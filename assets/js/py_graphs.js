const GRAPH_AUTO_COLOURS=
[
    'red',
    'yellow',
    'green',
    'blue',
    'purple',
    'black'
];


export function makeGraphContext(graphCanvas)
{
    let ctx={
        defaultRange:[-1,1],// default y range, updated when an explicit range is set
        nextAutoColour:0,

        drawCtx: graphCanvas.getContext("2d"),
        canvasWidth:graphCanvas.width,
        canvasHeight:graphCanvas.height,
        yBorderFraction:.05,// fraction of y range that is outside the set range
    
        graphHistories:{},
        graphColours:{},
        graphRanges:{},
            
        setGraphStyle: function(graphName,colour,minVal,maxVal)
        {
            // no range parameters, set same as last time
            if(minVal==undefined && maxVal==undefined)
            {
                minVal=this.defaultRange[0];
                maxVal=this.defaultRange[1];
            }
            // one range parameter, set 0-that
            if(minVal!=undefined && maxVal==undefined)
            {
                maxVal=minVal;
                minVal=0;
            }
            this.graphRanges[graphName]=[minVal,maxVal];
            this.defaultRange=[minVal,maxVal];
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
                this.graphColours[graphName]=GRAPH_AUTO_COLOURS[this.nextAutoColour];
                this.nextAutoColour+=1;
                if(this.nextAutoColour>=GRAPH_AUTO_COLOURS.length)
                {
                    this.nextAutoColour=0;
                }
            }
            if(!this.graphRanges[graphName])
            {
                this.graphRanges[graphName]=this.defaultRange;
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
                let scaleY=(this.canvasHeight*(1.0-2.0*this.yBorderFraction))/(maxVal-minVal);
                this.drawCtx.save();
                this.drawCtx.setTransform(1,0,0,-scaleY,0,this.canvasHeight*(1.0-this.yBorderFraction) + (minVal*scaleY))
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

