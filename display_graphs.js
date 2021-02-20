import { startAccelerometer,startAbsoluteOrientation,requestPermissions
} from "./accel_sensor.js";

import {startAudioProcessor} from "./sound_sensor.js";

let graphHistories={}
let graphColours={}

var drawCtx;
var sensorModule;

export async function startAll()
{
    await loadPythonGraphModule();
    try
    {
        await requestPermissions();// get permissions for audio, sensors
    }catch(e)
    {
        console.log("Error in requestPermission",e);
    }
   startSensors();
}

function onGraphValue(graphName,value,colour)
{
    if (!graphHistories[graphName])
    {
        graphHistories[graphName]=[];
        graphColours[graphName]=colour;
    }
    graphHistories[graphName].push(value);
    if(graphHistories[graphName].length>512)
    {
        graphHistories[graphName].shift();
    }
}


function drawGraphs() {
    for(name in graphHistories)
    {
        drawCtx.strokeStyle = graphColours[name];
        drawCtx.beginPath();
        drawCtx.moveTo(0,canvasHeight= (graphHistories[name][0]*value -1));
        for (let i = 1; i < canvasWidth; i++) {
        let value = graphHistories[name][i];
        let y = canvasHeight - canvasHeight * value - 1;
        drawCtx.lineTo(i,y);
        }
        drawCtx.stroke();        
    }
}

function onAccel(x,y,z)
{
    onGraphValue("accel",0.2*Math.sqrt(x*x+y*y+z*z),"blue");
    sensorModule.accel._on_accel(x,y,z)
}

async function startSensors()
{
    sensorModule=pyodide.runPython("import sensors\nsensors");
    drawCtx=document.querySelector("#canvas").getContext("2d");
    startAudioProcessor(onAudioLevel);
    startAccelerometer(onAccel);
    startAbsoluteOrientation(onOrientation);
}

function onOrientation(yaw,pitch,roll)
{
    console.log("Orientation:",yaw+":"+pitch+":"+roll);
}

function onAudioLevel(volume)
{
    onGraphValue("snd",volume,"white");
    sensorModule.sound._on_level(volume)   
};
let canvasWidth = 512;
let canvasHeight = 256;

function draw()
{
    clearCanvas();
    drawGraphs();
}

function clearCanvas() {
  drawCtx.clearRect(0, 0, canvasWidth, canvasHeight);
}



