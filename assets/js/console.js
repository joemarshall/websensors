
var NUM_CONSOLE_LINES=50;

export class Console
{

    constructor(divParent)
    {
        this.fullText="";
        this.text="";
        this.currentLine=0;
        this.lastSave=null;
        this.name=null;
        this.saveFn=null;
        this.div=divParent;
    }

    setSaveFn(fn)
    {
        this.saveFn=fn;
    }

    clear()
    {
        this.fullText="";
        this.text="";
        this.currentLine=0;
        this.div.innerHTML="";
    
        let now=new Date();
        let nowStr=now.toISOString().replaceAll("-","_").replaceAll(":","_").substr(0,19)
        this.name="output_"+nowStr+".csv";
        this.lastSave=null;
    }

    write(msg)
    {
        let needs_rescroll=false;
        if(this.div.scrollTop+this.div.clientHeight+1>=this.div.scrollHeight)
        {
            needs_rescroll=true;
        }
        this.fullText+=msg;
        this.text+=msg;
        var spl=this.text.split("\n")
        if( spl.length>NUM_CONSOLE_LINES)
        {
            this.text=spl.slice(-NUM_CONSOLE_LINES).join("\n");
        }
        this.div.innerText=this.text;
        if (needs_rescroll)
        {
            this.div.scrollTop=this.div.scrollHeight-this.div.clientHeight;
        }
        let curTime=new Date();
        if(!this.lastSave || curTime-this.lastSave>30000)
        {
            if(this.save())
            {
                this.lastSave=curTime;
            }
        }
    }     
    
    save()
    {
        if(this.saveFn && this.name)
        {
            return this.saveFn(this.name,this.fullText);
        }else
        {
            return true;
        }
    }

    download()
    {
        var blob = new Blob([this.fullText], {
            type: "text/plain;charset=utf-8;",
        });
        var a=document.createElement('a')
        a.href = URL.createObjectURL(blob);
        a.download='output.csv';
        a.click();
    }
};