self.languagePluginUrl = "./"

importScripts("pyodide.js")

let sensorModule;

function loadAsModule(moduleName,modulePython)
{
    this._load_as_module_src=modulePython;

    // load this code in as a python module
    return pyodide.runPython(`
import js,sys
import importlib.util
spec = importlib.util.spec_from_loader('${moduleName}', loader=None, origin='${moduleName}.py')
${moduleName} = importlib.util.module_from_spec(spec)
del spec
sys.modules['${moduleName}']=${moduleName}
exec(js._load_as_module_src, ${moduleName}.__dict__)
${moduleName}
`);    
}

class CancelSleep
{
    constructor(ms)
    {
        this.p=new Promise((resolve,reject)=>{
          this.sleepTimer=setTimeout(resolve,ms); this.rejectFN=reject;
        });
//        this.p.owner=this;
        this.p.cancel=()=>{this.cancel();}
    };

    cancel()
    {
        clearTimeout(this.sleepTimer);
        this.rejectFN();
    };
    
    getPromise()
    {
        return this.p;
    }
   
};

function sleep(ms) {
    
    return new CancelSleep(ms).getPromise();
}

let inCancel=false;
let pyConsole;
let results,state;
let sleeper;
let sleepTimer;

function stdout_write(s)
{
    if(!inCancel)
    {
        self.postMessage({type:"stdout",text:s});
    }
}

function stderr_write(s)
{
    if(!inCancel)
    {
        self.postMessage({type:"stderr",text:s});
    }
}

function set_graph_style(graphName,colour,minVal,maxVal,subgraphX,subgraphY)
{
    if(!inCancel)
    {
        self.postMessage({type:"graph",fn:"style",arguments:[graphName,colour,minVal,maxVal,subgraphX,subgraphY]});
    }

}

function on_graph_value(graphName,curVal)
{
    if(!inCancel)
    {
        self.postMessage({type:"graph",fn:"data",arguments:[graphName,curVal]});
    }
}



async function runAsyncLoop(id,arg)
{
    pyodide.runPython("__pc.clear_cancel()")
    let runCommandID=id;
    while(true)
    {
        let retValPython;
        let resumeArg;
        retValPython=pyodide.runPython("__pc.run_once()")
        retVal=retValPython.toJs();
        retValPython.destroy();
        if(!retVal || !retVal.get)
        {
            self.postMessage({id:id,type:"response",failed:true});
            return
        }                
        if (retVal.get("done")==true)
        {
            self.postMessage({id:id,type:"response",results:true});
            return;
        }else
        {
            const action=retVal.get("action");
            if(action==="await")
            {
                await retVal.get("object");
            }else if(action=="resume")
            { 
                args=retVal.get("args"); 
                if(args.get("interrupt")) {
                    sleeper=sleep(0)
                    try
                    {
                        await sleeper;                            
                    }catch(e)
                    {
                        self.postMessage({id:id,type:"response",cancelled:true});    
                        sleeper=null;
                        return;
                    }
                    sleeper=null;
                }else if(args.get("cmd")=="sleep")
                {
                    sleeper=sleep(args.get("time")*1000);
                    try
                    {
                        await sleeper;
                    }catch(e)
                    {
                        self.postMessage({id:id,type:"response",cancelled:true});    
                        sleeper=null;
                        return;
                    }
                    sleeper=null;
                }
            }
        }
    }

}

async function initPython()
{
        // make the graph module (calls back to js to display graph values)
        loadAsModule("graphs",`
import js        
def set_style(graphName,colour,minVal,maxVal,subgraph_x=None,subgraph_y=None): 
    js.set_graph_style(graphName,colour,minVal,maxVal,subgraph_x,subgraph_y)           
def on_value(graphName,value):
    js.on_graph_value(graphName,value)        
        `
        );

        // make the sensor module - receives sensor data
        sensorModule=loadAsModule("sensors",`
from math import sqrt

def on_sensor_event(event):
    name=event["name"]
    value=event["args"]
    if name=="accel":
        accel._on_accel(value[0],value[1],value[2])
    elif name=="sound":
        sound._on_level(value[0])
    elif name=="light":
        light._on_level(value[0])

class accel:
    _xyz=(0,0,0)
    @staticmethod
    def get_xyz():
        return accel._xyz
        
    @staticmethod
    def get_magnitude():
        if  accel._xyz:
            x,y,z=(accel._xyz)
            return sqrt((x*x)+(y*y)+(z*z))
        else:
            return None
        
    # called from js to set the current acceleration
    @staticmethod
    def _on_accel(x,y,z):
        accel._xyz=(x,y,z)
    
class sound:
    _level=0
    @staticmethod
    def get_level():
        return sound._level        
        
    # called from js to set the current level
    @staticmethod
    def _on_level(level):
        sound._level=level

class light:
    _level=0
    @staticmethod
    def get_level():
        return light._level        
        
    # called from js to set the current level
    @staticmethod
    def _on_level(level):
        light._level=level
`);
        await pyodide.runPythonAsync(`
import unthrow
# create hook for time.sleep
import time
time.sleep=lambda t: unthrow.stop({"cmd":"sleep","time":t})

import sys
import js
from pyodide import console


def displayhook(value):
    separator = "\\n[[;orange;]<long output truncated>]\\n"
    _repr = lambda v: console.repr_shorten(v, separator=separator)
    return console.displayhook(value, _repr)

sys.displayhook = displayhook


class PyConsole(console.InteractiveConsole):
    def __init__(self):
        super().__init__(
            persistent_stream_redirection=False,
        )
        self.resume_args=None
        self.resumer=unthrow.Resumer()
        self.resumer.set_interrupt_frequency(100)
        self.cancelled=False
        self.run_source_obj=None
        self.run_code_obj=None

    def clear_cancel(self):
        self.cancelled=False

    def cancel_run(self):
        self.resumer.cancel()
        self.cancelled=True
        self.resetbuffer()
        self.run_code_obj=None
        self.run_source_obj =None

    def run_once(self):
        if self.cancelled:
            self.cancelled=False
            self.finished=True
            return {"done":True,"action":"cancelled"}
        if self.run_source_obj:
            src=self.run_source_obj
            self.run_source_obj=None
            return {"done":False,"action":"await","obj":console._load_packages_from_imports(src)}
        elif self.run_code_obj:
            with self.stdstreams_redirections():
                try:
                    if not self.resumer.run_once(exec,[self.run_code_obj,self.locals]):
                        self.resume_args=self.resumer.resume_params
                        self.flush_all()
                        # need to rerun run_once after handling this action
                        return {"done":False,"action":"resume","args":self.resume_args}
                except BaseException:
                    self.showtraceback()
                # in CPython's REPL, flush is performed
                # by input(prompt) at each new prompt ;
                # since we are not using input, we force
                # flushing here
                self.flush_all()
                self.run_code_obj=None
                self.run_source_obj =None

            return {"done":True}


    def runcode(self, code):
        #  we no longer actually run code in here, 
        # we store it here and then repeatedly run 
        source = "\\n".join(self.buffer)
        self.run_code_obj=code
        self.run_source_obj = source

    def banner(self):
        return f"Welcome to the Pyodide terminal emulator 🐍\\n{super().banner()}"

__pc=PyConsole()            
        `);
        pyConsole=pyodide.globals.get("__pc");
        pyConsole.stdout_callback = stdout_write
        pyConsole.stderr_callback = stderr_write

}

onmessage = async function(e) {
    await languagePluginLoader;
    const {cmd,arg,id} = e.data;
    if(cmd =='init')
    {
        await initPython();
        self.postMessage({id:id,type:"response",results:true});
    }
    if (cmd =='run')
    {
        // push code directly into console runner
        pyConsole.runcode(arg);
        await runAsyncLoop(id,arg);
        return;
    }
    if(cmd=="banner")
    {
        banner=pyodide.runPython("__pc.banner()");
        self.postMessage({id:id,type:"response",results:banner});
    }
    if(cmd=="push_and_run")
    {        
        needsMore=pyConsole.push(arg);
        if (needsMore)
        {
            self.postMessage({id:id,type:"response",needsMore:true});
        }else
        {
            // got a command to run, run the code in the console loop
            await runAsyncLoop(id,arg);
            return;
        }
    }
    if(cmd=="abort")
    {
        incancel=true;
        pyodide.runPython("__pc.cancel_run()"); 
        if(sleeper) {
            sleeper.cancel();
            sleeper=null;
        }
        self.postMessage({id:id,type:"response",results:true});
        incancel=false;
    }
    if(cmd=="tab_complete")
    {
        self.postMessage({id:id,type:"response",results:pyConsole.complete()});
    }
    if(cmd=="sensor")
    {
        sensorModule.on_sensor_event(arg)
    }
}



