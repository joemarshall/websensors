
export class Console
{
    static NUM_CONSOLE_LINES=50;

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
        if( spl.length>Console.NUM_CONSOLE_LINES)
        {
            this.text=spl.slice(-Console.NUM_CONSOLE_LINES).join("\n");
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
        if(this.saveFn)
        {
            return this.saveFn(this.name,this.fullText);
        }else
        {
            return true;
        }

    }
};