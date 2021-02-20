export async function loadAsModule(moduleName,modulePython)
{
    // load the python from the source file as string
    const response = await fetch(modulePython);
    const responseText=await response.text();
    // store text in global variable accessible via JS module in python
    window._load_as_module_src=responseText;

    // load this code in as a python module
    let moduleObj=pyodide.runPython(`
import js			
import importlib.util
spec = importlib.util.spec_from_loader('${moduleName}', loader=None, origin="${modulePython}")
${moduleName} = importlib.util.module_from_spec(spec)
del spec
sys.modules['${moduleName}']=${moduleName}
exec(js._load_as_module_src, ${moduleName}.__dict__)
${moduleName}
`);
    
    // return the module
    return moduleObj;
}

var async_mod=null;

export async function runScriptWithAsyncSleep(pythonFile)
{
    const response = await fetch(pythonFile);
    const responseText=await response.text();
    await runPythonWithAsyncSleep(responseText);
}

export async function runScriptFromFile(pythonFile)
{
    const response = await fetch(pythonFile);
    const responseText=await response.text();
    pyodide.runPython(responseText);
}


export async function runPythonWithAsyncSleep(pythonCode)
{
    window._pyodide_asyncrun_text=pythonCode;
    if(!async_mod)
    {
        async_mod=pyodide.runPython("import asyncio,async_pyodide\nasync_pyodide");        
    }
    console.log("Running python now");
    pyodide.runPython(`
import js
import async_pyodide
#print("Get ready to run async");
async_pyodide.run_in_new_loop(js._pyodide_asyncrun_text,js.pyodide.globals)
#print("Running async now");
`)
    
}


