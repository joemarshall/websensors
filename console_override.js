
var consoleDiv;
// get this once otherwise running setconsolediv twice will do bad things
var oldConsole=window.console;

export function setConsoleDiv(el)
{
    const console_div=el;
    console_div.innerText="";
    var newConsole=(function(oldCons){
        return {
            log: function(){
                oldCons.log.apply(console,arguments);
                // Your code
                for(let i in arguments){console_div.innerText+=arguments[i]+" ";};
                console_div.innerText+="\n";
                console_div.scrollTop = console_div.scrollHeight;
            },
            info: function () {
                oldCons.info.apply(console,arguments);
                // Your code
                for(let i in arguments){console_div.innerText+=arguments[i]+" ";};
                console_div.innerText+="\n";
                console_div.scrollTop = console_div.scrollHeight;
            },
            warn: function () {
                oldCons.warn.apply(console,arguments);
                // Your code
                for(let i in arguments){console_div.innerText+=arguments[i]+" ";};
                console_div.innerText+="\n";
                console_div.scrollTop = console_div.scrollHeight;
            },
            error: function () {
                oldCons.error.apply(console,arguments);
                // Your code
                for(let i in arguments){console_div.innerText+=arguments[i]+" ";};
                console_div.innerText+="\n";
                console_div.scrollTop = console_div.scrollHeight;
            }
        };
    }(oldConsole));
    
    window.console=newConsole;
}