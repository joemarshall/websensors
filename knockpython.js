export async function startPythonKnockTest()
{
    const response = await fetch('knocktest1.py');
    const responseText=await response.text();
    
    pyodide.runPython(responseText);
}