import asyncio,selectors,sys,js,ast

class Policy(asyncio.AbstractEventLoopPolicy):
    def __init__(self):
        self.__current_loop=None
    
    def get_event_loop(self):
        if not self.__current_loop:
            self.__current_loop=self.new_event_loop()
        return self.__current_loop
        
    def set_event_loop(self,loop):
        self.__current_loop=loop
        
    def new_event_loop(self):
        return CustomLoop()
        
    def get_child_watcher(self):
        return None
        
    def set_child_watcher(self):
        return None

asyncio.set_event_loop_policy(Policy())

class JSSelector(selectors.BaseSelector):
    def __init__(self):
        super().__init__()
        self.keyMap={}
        self.delay=-1
        
    def register(self,fileobj, events, data=None):
        self.keyMap[fileobj]=SelectorKey(fileobj=fileobj,events=events,data=data)
        
    def unregister(self,fileobj):
        self.keymap.remove(fileobj)
        
    def modify(self,fileobj, events, data=None):
        self.register(fileobj,events,data)
        
    def select(self,timeout=None):
        if timeout==None:
            self.delay=-1
        else:
            self.delay=timeout
        return []
        
    def get_map(self):
        return self.keymap
    
    def get_delay(self):
        return self.delay

class CustomLoop(asyncio.BaseEventLoop):
    def __init__(self):
        self.in_tick=False
        self._selector=JSSelector()
        super().__init__()
        asyncio.set_event_loop(self)
        
        self.set_task_factory(self.fix_task_imports)
        self.started=False
        
    def get_delay(self):
        return self._selector.get_delay()
        
    def _process_events(self,events):
        pass
        
    def fix_task_imports(self,loop,coro,name=None):
        # make a task
        #print("MKTask:",coro)
        task = asyncio.tasks.Task(coro, loop=loop, name=name)
        if task._source_traceback:
            del task._source_traceback[-1]        
        return task
    
    def start(self):
        js.eval("""
            var pyodide_async_loop_id=-1;
            window._pyodide_async_tick=() =>
            {
        	    loop=pyodide.globals.asyncio.get_event_loop()
        	    loop._run_once();
        	    pyodide_async_timeout=loop.get_delay()
                //console.log("tick:"+pyodide_async_timeout)
                if(pyodide_async_loop_id!=-1)
	            {
        		    window.clearInterval(pyodide_async_loop_id);
        		}
        		if(pyodide_async_timeout>=0)
        		{
		            pyodide_async_loop_id=window.setTimeout(window._pyodide_async_tick,pyodide_async_timeout*1000)
    	        }
            };
        """)
        self.started=True
        asyncio.events._set_running_loop(self)
        js.window._pyodide_async_tick()        
    
    def _run_once(self):
        self.in_tick=True
        retVal=super()._run_once()
        self.in_tick=False
        return retVal
    
    def call_later(self, delay, callback, *args):
        retVal=super().call_later(delay,callback,*args)
        if not self.in_tick and self.started:
            js._pyodide_async_tick()
        return retVal
    
    def call_soon(self, callback, *args, context=None):
        retVal= super().call_soon(callback,*args,context=context)
        if not self.in_tick and self.started:
            js._pyodide_async_tick()
        return retVal

    def call_at(self, when, callback, *args, context=None):
        retVal= super().call_at(when,callback,*args,context=context)
        if not self.in_tick and self.started:
            js._pyodide_async_tick()
        return retVal

    def set_task_to_run_until_done(self,mainTask):
        asyncio.set_event_loop(self)
        task=self.create_task(mainTask)
#        task=self.create_task(self.stop_when_task_done(mainTask))
        self.start()
        js._pyodide_async_tick()
    
    async def stop_when_task_done(self,future):
        try:
            future=asyncio.tasks.ensure_future(future)
            await future
        except:
            if future.done() and not future.cancelled():
                print("EXCEPTION in coroutine")
                # The coroutine raised a BaseException. Consume the exception
                # to not log a warning, the caller doesn't have access to the
                # local task.
                future.exception()
            raise
        if not future.done():
            raise RuntimeError('Event loop stopped before Future completed.')
        return future.result()
                



class _FindDefs(ast.NodeVisitor):
    def __init__(self):
        self.defs={}
        
    def visit_FunctionDef(self,node):        
        self.generic_visit(node)
        self.defs[node.name]=node.name
        
    def get_defs(self):
        return self.defs


### Code to translate simple python code to be async. n.b. right now only sleep calls and imports are async in practice
# all calls to local functions are async as otherwise you can't run sleep in them
class _MakeAsyncCalls(ast.NodeTransformer):
    def __init__(self,call_table,in_loop=False,ignore_imports=[]):
        self.call_table=call_table
        self.in_main=in_loop
        self.ignore_imports=ignore_imports

    def visit_AsyncFunctionDef(self,node):
        # ignore anything that is already async except for the main 
        if node.name=='__async_main':
            self.in_main=True
            self.generic_visit(node)
            self.in_main=False
        return node

    def visit_ImportFrom(self,node):
        if not self.in_main:
            return node     
        elements=[]
        if node.module in self.ignore_imports:
            return node
        elements.append(ast.Tuple([ast.Constant(node.module),ast.Constant(None)],ctx=ast.Load()))
        # first call async code to import it into pyodide, then call the original import statement to make it be available here
        newNode=[ast.Expr(value=ast.Await(ast.Call(ast.Name('aimport',ctx=ast.Load()),args=[ast.List(elements,ctx=ast.Load())],keywords=[]))),node]
#        newNode=[ast.Expr(value=ast.Await(ast.Call(ast.Attribute(value=ast.Name('aimport',ctx=ast.Load()),attr='async_pyodide',ctx=ast.Load()),args=[ast.List(elements,ctx=ast.Load())],keywords=[]))),node]                
        return newNode            

    def visit_Import(self,node):
        if not self.in_main:
            return node            
        elements=[]
        for c in node.names:
            if not c.name in self.ignore_imports:
                thisElement=ast.Tuple([ast.Constant(c.name),ast.Constant(c.asname)],ctx=ast.Load())
                elements.append(thisElement)
        if len(elements)>0:
            # first call async code to import it into pyodide, then call the original import statement to make it be available here
            newNode=[ast.Expr(value=ast.Await(ast.Call(ast.Name('aimport',ctx=ast.Load()),args=[ast.List(elements,ctx=ast.Load())],keywords=[]))),node]            
#            newNode=[ast.Expr(value=ast.Await(ast.Call(ast.Attribute(value=ast.Name('aimport',ctx=ast.Load()),attr='async_pyodide',ctx=ast.Load()),args=[ast.List(elements,ctx=ast.Load())],keywords=[]))),node]
        else:
            newNode=node
        return newNode

    def visit_FunctionDef(self,node):
        #print("Found functiondef")
        self.generic_visit(node) # make sure any calls are turned into awaits where relevant
        if node.name!="__init__":
            return ast.AsyncFunctionDef(name=node.name,args=node.args,body=node.body,decorator_list=node.decorator_list,returns=node.returns)
        else:
            return node
    
    def _parse_call(self,name):
        allNames=name.split(".")        
        retVal=ast.Name(id=allNames[0],ctx=ast.Load())
        allNames=allNames[1:]
        #print(dump(retVal))
        while len(allNames)>0:
            retVal=ast.Attribute(value=retVal,attr=allNames[0],ctx=ast.Load())
            allNames=allNames[1:]
        #print(dump(retVal))
        return retVal
            
    
    def visit_Call(self, node):
        target=node.func
        make_await=False
        nameParts=[]
        while type(target)==ast.Attribute:
            nameParts=[target.attr]+nameParts
            target=target.value
        if type(target)==ast.Name:
            nameParts=[target.id]+nameParts
        target_id=".".join(nameParts)
        simple_name=nameParts[-1]
        if target_id in self.call_table:
            make_await=True
        elif simple_name in self.call_table:
            make_await=True
            target_id=simple_name
        if make_await:          
            nameNodes=self._parse_call(self.call_table[target_id])
            #print("make await",target_id,node.args,node.keywords)
            newNode=ast.Await(ast.Call(nameNodes,args=node.args,keywords=node.keywords))
            return newNode
        else:
            # external library call, ignore
            return ast.Call(node.func,node.args,node.keywords)


class _LineOffsetter(ast.NodeTransformer):
    def __init__(self,offset):
        self.offset=offset        

    def visit(self, node):
        if hasattr(node,"lineno"):
            node.lineno+=self.offset
        if hasattr(node,"endlineno"):
            node.end_lineno+=self.offset
        self.generic_visit(node)
        return node


# todo make this for multiple code modules (and maybe to guess class types from the code..)
def __compile_with_async_sleep(code_str,compile_mode='exec',in_loop=False):

    if not in_loop:

        async_code_preamble="""
import sys
import asyncio
from async_pyodide import aimport,CustomLoop

_loop=CustomLoop()
asyncio.set_event_loop(_loop)

async def __async_main():
"""
        extraLines=len(async_code_preamble.split("\n"))-1
        
        all_code=async_code_preamble
        for line in code_str.splitlines():
            all_code+="    "+line+"\n"
        all_code+="_loop.set_task_to_run_until_done(__async_main())\n"
    else:

        async_code_preamble="""
import asyncio
from async_pyodide import aimport
"""
        all_code=async_code_preamble
        for line in code_str.splitlines():
            all_code+=line+"\n"
        
    extraLines=len(async_code_preamble.split("\n"))-1

    #print(all_code)    

    oldTree=ast.parse(all_code, mode='exec')        
#    print("OLDTREE")
#    print(ast.dump(oldTree))
    defs=_FindDefs()
    defs.visit(oldTree)
    allDefs=defs.get_defs()
    # override sleep with asleep
    allDefs["sleep"]="asyncio.sleep"
    allDefs["time.sleep"]="asyncio.sleep"    
    newTree=ast.fix_missing_locations(_MakeAsyncCalls(allDefs,in_loop=in_loop,ignore_imports=['asyncio','async_pyodide']).visit(oldTree))
    newTree=_LineOffsetter(-extraLines).visit(newTree)
    
    
    # remove the module as we can't await a module
#    print("NEWTREE")
#    print(ast.dump(newTree))
    if in_loop:
        # if we're in a loop already, return an awaitable
        return compile(newTree,filename="your_code.py",mode=compile_mode,flags=ast.PyCF_ALLOW_TOP_LEVEL_AWAIT)
    else:
        # else return code that makes a loop and calls it
        return compile(newTree,filename="your_code.py",mode=compile_mode)

def schedule_as_async_in_existing_loop(code):
    import asyncio
    _loop=asyncio.get_running_loop()
    _loop.create_task(__compile_with_async_sleep(code,in_loop=True))

def get_awaitable(code):
    return __compile_with_async_sleep(code,in_loop=True)

# we need the globals context here because 
# the javascript loop callback comes from the absolute top level context
# which doesn't have imports / global variables etc. from our module in it
def run_in_new_loop(code,globalsContext):
    __asyncipy_loop=asyncio.get_event_loop()
    __async_run_code=__compile_with_async_sleep(code,in_loop=True)
    this_coroutine=eval(__async_run_code,globalsContext)
    __asyncipy_loop.set_task_to_run_until_done(this_coroutine)
    

js.eval("""
window.__pyodide_async_import= (module,alias,future) =>
{
	if(alias)
	{
//        console.log("Import ",module,"as",alias)
		pyodide.runPythonAsync("import " +module +" as "+alias).then(value=>{future.set_result(1)},reason=>{python_err_print(reason);});
	}else
	{
//      	console.log("Import ",module)
		pyodide.runPythonAsync("import " +module).then(value=>{future.set_result(1)},reason=>{python_err_print(reason);});
	}	
}
"""
)

async def _aimport(module,alias):
    future = asyncio.get_event_loop().create_future()
    js.__pyodide_async_import(module,alias,future)
    return (await future)
	
# import list of module,alias pairs
async def aimport(namePairs):
    for (module,alias) in namePairs:
        await _aimport(module,alias)


