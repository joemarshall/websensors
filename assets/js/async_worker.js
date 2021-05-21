---
---

var workerContext;
if(self.hasOwnProperty('fakeWorkerContext'))
{
   workerContext=fakeWorkerContext;
}else
{
    workerContext=self;
}

// gitcdn is even faster but unreliable in china
// window.languagePluginUrl='https://gitcdn.link/repo/joemarshall/websensors/main/pyodide/';
// serve through jsdelivr for faster loading
//languagePluginUrl='https://rawcdn.githack.com/joemarshall/websensors/main/pyodide/';
//languagePluginUrl="{{'/pyodide/' | relative_url }}";


let sensorModule;

async function loadURLAsModule(moduleName,moduleURL)
{
    var response=await fetch(moduleURL);
    var responseData=await response.text();
    loadAsModule(moduleName,responseData);
}

function loadAsModule(moduleName,modulePython)
{
    self._load_as_module_src=modulePython;

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

function console_write(args)
{
    var s="";
    for(let i in args)
    {
        s+=args[i]+" ";
    }
    s+="\n";
    workerContext.postMessage({type:"console",text:s});
}

function overrideConsole(oldConsole)
{
    consoleProxy=
    {
        log:function()
        {
            console_write(arguments);
            oldConsole.log.apply(oldConsole,arguments)
        },
        warn:function()
        {
            console_write(arguments);
            oldConsole.warn.apply(oldConsole,arguments)
        },
        error:function()
        {
            console_write(arguments);
            oldConsole.error.apply(oldConsole,arguments)
        },
        info:function()
        {
            console_write(arguments);
            oldConsole.info.apply(oldConsole,arguments)
        }
    };
    return consoleProxy;
     
}

if(!self.hasOwnProperty('fakeWorkerContext'))
{
    console=overrideConsole(console);
}

function stdout_write(s)
{
    if(!inCancel)
    {
        workerContext.postMessage({type:"stdout",text:s});
    }
}

function stderr_write(s)
{
    if(!inCancel)
    {
        workerContext.postMessage({type:"stderr",text:s});
    }
}

function set_graph_style(graphName,colour,minVal,maxVal,subgraphX,subgraphY)
{
    if(!inCancel)
    {
        workerContext.postMessage({type:"graph",fn:"style",arguments:[graphName,colour,minVal,maxVal,subgraphX,subgraphY]});
    }

}

function on_graph_value(graphName,curVal)
{
    if(!inCancel)
    {
        workerContext.postMessage({type:"graph",fn:"data",arguments:[graphName,curVal]});
    }
}

function on_speech_say(words)
{
    if(!inCancel)
    {
        workerContext.postMessage({type:"speech",say:words});
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
            workerContext.postMessage({id:id,type:"response",failed:true});
            return
        }                
        if (retVal.get("done")==true)
        {
            workerContext.postMessage({id:id,type:"response",results:true});
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
                        workerContext.postMessage({id:id,type:"response",cancelled:true});    
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
                        workerContext.postMessage({id:id,type:"response",cancelled:true});    
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
    try
    {
        // make the filter module (low, high pass, median filter etc.)
        loadAsModule("filters",`
{% include filters_module.py %}
`);    

        loadAsModule("speech",`
{% include speech_module.py %}
`);

        // make the graph module (calls back to js to display graph values)
        loadAsModule("graphs",`
{% include graphs_module.py %}
    `
            );

            // make the sensor module - receives sensor data
            sensorModule=loadAsModule("sensors",`
{% include sensors_module.py %}
`);
            await pyodide.runPythonAsync(`
{% include init_console.py %}
`);
            pyConsole=pyodide.globals.get("__pc");
            pyConsole.stdout_callback = stdout_write
            pyConsole.stderr_callback = stderr_write
    }catch(err)
    {
        console.log("Failed to init python",err);
        throw(err);
    }

}

workerContext.onmessage = async function(e) {
    const {cmd,arg,id} = e.data;
    if(cmd =='init')
    {
        self.languagePluginUrl=arg.cdn;
        if(arg.cdn=='none')
        {
            self.languagePluginUrl="{{ '/pyodide/'|absolute_url }}"
        }
        console.log(self.languagePluginUrl);
        try
        {        
            await workerContext.importScripts("{{'/pyodide/pyodide.js' | relative_url }}")
            await self.languagePluginLoader;
            await initPython();
            workerContext.postMessage({id:id,type:"response",results:true});
        }catch(err)
        {
            console.log("Error getting python",err);
            workerContext.postMessage({id:id,type:"response",results:false});
        }
    }else
    {
        // make sure that we've loaded before anything else runs
        await languagePluginLoader;
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
        workerContext.postMessage({id:id,type:"response",results:banner});
    }
    if(cmd=="push_and_run")
    {        
        needsMore=pyConsole.push(arg);
        if (needsMore)
        {
            workerContext.postMessage({id:id,type:"response",needsMore:true});
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
        workerContext.postMessage({id:id,type:"response",results:true});
        incancel=false;
    }
    if(cmd=="tab_complete")
    {
        workerContext.postMessage({id:id,type:"response",results:pyConsole.complete()});
    }
    if(cmd=="sensor")
    {
        sensorModule.on_sensor_event(arg)
    }
}



