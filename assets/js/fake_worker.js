class FakeWorker
{
    constructor(url)
    {
        // message handlers
        // initially empty
        this.onmessage=undefined;
        this.onerror=undefined;
        var workerOwner=this;

        this.workerContext=
        {
            importScripts:async function(script){
                var scriptTag=document.createElement("script");
                scriptTag.src=script;
                window.fakeWorkerContext=this.workerContext;
                document.body.appendChild(scriptTag);
            },
            postMessage:function(obj)
            {
                if(workerOwner.onmessage)
                {
                    workerOwner.onmessage({data:obj});
                }
            },
            throwError:function(obj)
            {
                workerOwner.onerror({data:obj});
            },
            onmessage:function(msg)
            {
                console.log("Worker message ignored",msg);
            }
        };
        var scriptTag=document.createElement("script");
        scriptTag.src=url;
        window.fakeWorkerContext=this.workerContext;
        document.body.appendChild(scriptTag);
    };

    postMessage(msg)
    {
        if(this.workerContext.onmessage)
        {
            this.workerContext.onmessage({data:msg})
        }        
    }

};
