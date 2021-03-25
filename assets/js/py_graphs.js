export function makeGraphContext(graphCanvas)
{
    let ctx={

        drawCtx: graphCanvas.getContext("2d"),
        canvasWidth:graphCanvas.width,
        canvasHeight:graphCanvas.height,
    
        graphHistories:{},
        graphColours:{},
        graphRanges:{},
            
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
                this.graphColours[graphName]='black';
            }
            if(!this.graphRanges[graphName])
            {
                this.graphRanges[graphName]=[-1,1];
            }
            this.graphHistories[graphName].push(value);
            if(this.graphHistories[graphName].length>this.canvasWidth)
            {
                this.graphHistories[graphName].shift();
            }
            window.requestAnimationFrame(this.draw.bind(this));
        },  
        
        drawGraphs: function()
        {
            for(const name in this.graphHistories)
            {
                this.drawCtx.strokeStyle = this.graphColours[name];
                let minVal=this.graphRanges[name][0];
                let maxVal=this.graphRanges[name][1];
                let histBuffer=this.graphHistories[name];
                let scaleY=this.canvasHeight/(maxVal-minVal);
                this.drawCtx.save();
                this.drawCtx.setTransform(1,0,0,-scaleY,0,this.canvasHeight-maxVal*scaleY)
                this.drawCtx.beginPath();
                this.drawCtx.moveTo(0,histBuffer[0]);
                for (let i = 1; i < this.canvasWidth; i++) {
                    let value = histBuffer[i];
                    this.drawCtx.lineTo(i,value);
                }
                this.drawCtx.restore();
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
    return ctx;        
}

