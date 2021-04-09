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
    graphCanvas.width=graphCanvas.scrollWidth;
    graphCanvas.height=graphCanvas.scrollHeight;    
    let ctx={
        defaultRange:[-1,1],// default y range, updated when an explicit range is set
        nextAutoColour:0,
        needsPaint:false,

        drawCtx: graphCanvas.getContext("2d"),
        canvasWidth:graphCanvas.width,
        canvasHeight:graphCanvas.height,

        fontSize: graphCanvas.height*0.1,

        externalWidth: graphCanvas.scrollWidth,
        externalHeight: graphCanvas.scrollHeight,
        yBorderFraction:.05,// fraction of y range that is outside the set range
    
        graphInfos:{},

        painted:true,
            
        setGraphStyle: function(graphName,colour,minVal,maxVal,subgraphX,subgraphY)
        {
            if(subgraphY==undefined)
            {
                subgraphY=0;
            }
            if(subgraphX==undefined)
            {
                subgraphX=0;
            }
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
            if(!this.graphInfos[graphName])
            {
                this.graphInfos[graphName]={};
            }
            let info=this.graphInfos[graphName];
            info.subgraphX=subgraphX;
            info.subgraphY=subgraphY;
            info.range=[minVal,maxVal];
            this.defaultRange=[minVal,maxVal];
            info.colour=colour;
        },
        checkExists: function(graphName)
        {
            if (!this.graphInfos[graphName])
            {
                // no graph object at all
                this.graphInfos[graphName]={}
            }
            let info=this.graphInfos[graphName];
            if(!info.history)
            {
                info.history=[];
                info.count=0;
                info.historyLength=this.canvasWidth;
            }else
            {
                return;
            }
            if(!info.colour)
            {
                info.colour=GRAPH_AUTO_COLOURS[this.nextAutoColour];
                this.nextAutoColour+=1;
                if(this.nextAutoColour>=GRAPH_AUTO_COLOURS.length)
                {
                    this.nextAutoColour=0;
                }
            }
            if(!info.range)
            {
                info.range=this.defaultRange;
            }
        },
        onGraphValue: function(graphName,value)
        {
            this.checkExists(graphName);
            let info=this.graphInfos[graphName];
            info.history.push(value);
            info.count+=1;
            // keep an extra point here because we need to be able 
            // to shift so that things are aligned
            if(info.history.length>info.historyLength+1)
            {
                info.history.shift();
            }
            this.needsPaint=true;
/*            if(this.painted)
            {
                this.painted=false;
                window.requestAnimationFrame(this.draw.bind(this));
            }*/
        },  
        

        drawSubgraphs: function(subX,subY,xPos,yPos,w,h)
        {
            for(const name in this.graphInfos)
            {
                let info=this.graphInfos[name];
                if(info.subgraphX!=subX || info.subgraphY!=subY)
                {
                    continue;
                }

                let bumpOne=false;
                for(const other in this.graphInfos)
                {
                    if(other!=name)
                    {
                        let otherInfo=this.graphInfos[other];
                        // if we are one point different
                        // in count to another graph,
                        // then make sure we line up
                        // by showing older data for us
                        if(info.count-otherInfo.count==1)
                        {
                            bumpOne=true;
                        }
                    }
                }

                this.drawCtx.strokeStyle = info.colour;
                let minVal=info.range[0];
                let maxVal=info.range[1];
                let histBuffer=info.history;
                if(!histBuffer)
                {
                    continue;
                }
                let scaleY=(h*(1.0-2.0*this.yBorderFraction))/(maxVal-minVal);
                this.drawCtx.save();
                this.drawCtx.setTransform(1,0,0,-scaleY,0,yPos+h*(1.0-this.yBorderFraction) + (minVal*scaleY))
                this.drawCtx.beginPath();
                // we never show the first point in history,
                // because we need to be able to bump one point back 
                // if two same rate sensor streams are not in sync right now
                let pointCount=histBuffer.length-1;
                if(pointCount>w)
                {
                    pointCount=w;
                }
                
                // get the last w points from history which are
                // at the high end of the buffer
                let i=histBuffer.length-pointCount;
                if(bumpOne)
                {
                    // we are one point ahead of the other sensor(s) 
                    // so just show one point older to maintain consistent alignment
                    i-=1;
                }

                let curX=xPos+(w-pointCount);
                this.drawCtx.moveTo(curX,histBuffer[i]);
                i++;            
                curX++;

                for(;curX<xPos+w;i++,curX++)
                {
                    this.drawCtx.lineTo(curX,histBuffer[i]);
                }
                this.drawCtx.restore();
                this.drawCtx.stroke();      
            }

            let maxTextWidth=0;
            let maxTextY=0;
            let fontSize=this.fontSize;
            this.drawCtx.font = `small-caps ${fontSize}px Arial `;
            this.drawCtx.textBaseline='top';
            let legendY=yPos+this.fontSize*0.5;
            this.drawCtx.textAlign='left';
            let minTextY=legendY;

            for(const name in this.graphInfos)
            {
                let info=this.graphInfos[name];
                if(info.subgraphX!=subX || info.subgraphY!=subY)
                {
                    continue;
                }
                let textMeasure=this.drawCtx.measureText(name);
                maxTextWidth=Math.max(maxTextWidth,textMeasure.width);
                maxTextY=legendY+textMeasure.fontBoundingBoxDescent;
                legendY+=fontSize;
            }
            if(legendY==minTextY)
            {
                // nothing in this cell
                return;
            }
            this.drawCtx.fillStyle = 'white';
            this.drawCtx.fillRect(xPos+fontSize*0.25 ,minTextY-fontSize*0.25,maxTextWidth+fontSize*0.5,(maxTextY-minTextY)+fontSize*0.5);
            legendY=yPos+this.fontSize*0.5;
            for(const name in this.graphInfos)
            {
                let info=this.graphInfos[name];
                if(info.subgraphX!=subX || info.subgraphY!=subY)
                {
                    continue;
                }
                this.drawCtx.fillStyle = info.colour;
                this.drawCtx.fillText(name, xPos+this.fontSize*0.5, legendY);
                legendY+=this.fontSize;
            }
        },
        drawGraphs: function()
        {
            let subgraphXCount=0;
            let subgraphYCount=0;
            for(const name in this.graphInfos)
            {
                let info=this.graphInfos[name];
                subgraphXCount=Math.max(subgraphXCount,info.subgraphX+1);
                subgraphYCount=Math.max(subgraphYCount,info.subgraphY+1);
            }
            for(let c=0;c< subgraphXCount;c++)
            {
                let x1=Math.floor((this.canvasWidth*c)/subgraphXCount);
                let x2=Math.floor((this.canvasWidth*(c+1))/subgraphXCount);
                for(let d=0;d<subgraphYCount;d++)
                    {

                        let y1=Math.floor((this.canvasHeight*d)/subgraphYCount);
                        let y2=Math.floor((this.canvasHeight*(d+1))/subgraphYCount);
                        this.drawSubgraphs(c,d,x1,y1,x2-x1,y2-y1);
                    }
                }
        },

        timer:function()
        {
            if(this.needsPaint)
            {
                this.needsPaint=false;
                window.requestAnimationFrame(this.draw.bind(this));
            }
        },


        draw:function(timeObj)
        {
            this.clearCanvas();
            this.drawGraphs();
        },
    
        clearCanvas: function()
        {
          this.drawCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        }
    };
    window.setInterval(ctx.timer.bind(ctx),40);// 25hz update max
    return ctx;        
}

