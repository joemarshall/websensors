# todo - make a way to output a line which shows on the graph

_GRAPH_JS="""

let __graph_js_context={

    drawCtx: null,
    canvasWidth:0,
    canvasHeight:0,

    graphHistories:{},
    graphColours:{},
    graphRanges:{},
    
    setDrawContext: function(myCanvas)
    {
        this.drawCtx=myCanvas.getContext("2d");
        this.canvasHeight=myCanvas.height;
        this.canvasWidth=myCanvas.width;
    },

    setGraphStyle: function(graphName,colour,minVal,maxVal)
    {
        this.graphRanges[graphName]=[minVal,maxVal];
        this.graphColours[graphName]=colour;
    },


    onGraphValue: function(graphName,value)
    {
        if (!this.graphHistories[graphName])
        {
            this.graphHistories[graphName]=[];
        }
        if(!this.graphColours[graphName])
        {
            this.graphColours[graphName]='white';
        }
        if(!this.graphRanges[graphName])
        {
            this.graphRanges[graphName]=[-1,1];
        }
        this.graphHistories[graphName].push(value);
        if(this.graphHistories[graphName].length>512)
        {
            this.graphHistories[graphName].shift();
        }
        window.requestAnimationFrame(this.draw.bind(this));
    },  
    
    drawGraphs: function()
    {
        for(name in this.graphHistories)
        {
            this.drawCtx.strokeStyle = this.graphColours[name];
            this.drawCtx.beginPath();
            let minVal=this.graphRanges[name][0];
            let maxVal=this.graphRanges[name][1];
            let histBuffer=this.graphHistories[name];
            let offsetY=maxVal;
            let scaleY=this.canvasHeight/(minVal-maxVal);
            let scaled=(histBuffer[0]-offsetY)*scaleY;
            this.drawCtx.moveTo(0,scaled);
            for (let i = 1; i < this.canvasWidth; i++) {
                let value = this.graphHistories[name][i];
                scaled = (histBuffer[i]-offsetY)*scaleY;
                this.drawCtx.lineTo(i,scaled);
            }
            this.drawCtx.stroke();        
        }
    },

    draw:function()
    {
        this.clearCanvas();
        this.drawGraphs();
    },

    clearCanvas: function()
    {
      this.drawCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }
};
__graph_js_context;
"""

import js

__graph_js_context=None

def setCanvas(canvas):
    global __graph_js_context
    __graph_js_context=js.eval(_GRAPH_JS)
    __graph_js_context.setDrawContext(canvas)


def setStyle(graphName,colour,minVal,maxVal): 
    __graph_js_context.setGraphStyle(graphName,colour,minVal,maxVal)
   
def onValue(graphName,value):
    __graph_js_context.onGraphValue(graphName,value)

