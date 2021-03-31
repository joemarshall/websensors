var _onLevel;
var audioPlaying=false;

var _made_worklet=false;

class VUMeterNode extends AudioWorkletNode {
  constructor (audioContext, updateIntervalInMS) {
    super(audioContext, 'vumeter2', {
      numberOfInputs: 1,
      numberOfOutputs: 0,
      channelCount: 1,
      processorOptions: {
        updateIntervalInMS: updateIntervalInMS || 20.0
      }
    });

  // States in AudioWorkletNode
    this._updateIntervalInMS = updateIntervalInMS;
    this._volume = 0;
    // Handles updated values from AudioWorkletProcessor
    this.port.onmessage = event => {
      if (event.data.volume!=undefined)
      {
        // double it so it goes 0-1 
            this._volume = Math.min(event.data.volume*2.0,1);
//            window.setTimeout(this.draw.bind(this),0);
            _onLevel(this._volume);
          }
    }
    this.port.start();
  }
  get updateInterval() {
    return this._updateIntervalInMS;
  }
  set updateInterval(updateIntervalInMS) {
    this._updateIntervalInMS = updateIntervalInMS;
    this.port.postMessage({updateIntervalInMS: updateIntervalInMS});
  }
  draw () {
    // Draws the VU meter based on the volume value
    // every |this._updateIntervalInMS| milliseconds.
  }

}

var cameraStream,sourceNode,processorNode,audioContext;

export async function start(callback)
{
    _onLevel=callback;
    try
    {
        cameraStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
    //        video: true
        });        
    }catch(e)
    {
        console.log("Error loading sound:",e);
        return;
    }
    
    var AudioContext = window.AudioContext // Default
        || window.webkitAudioContext // Safari and old versions of Chrome
        || false;     
    if(!audioContext)
    {
      audioContext = new AudioContext() // Default
      || new webkitAudioContext() // Safari and old versions of Chrome
      || false; 
        await audioContext.audioWorklet.addModule('amplitude_getter2.js');
    }
    processorNode=new VUMeterNode(audioContext,20);
    sourceNode = audioContext.createMediaStreamSource(cameraStream);
    sourceNode.connect(processorNode);
    audioPlaying = true;    
    console.log("Started audio input");   
}

export async function stop()
{
  console.log("STOPPING");
  if(processorNode)
  {
    processorNode.disconnect();
    processorNode=undefined;
  }
  if(sourceNode)
  {
    sourceNode.disconnect();
    sourceNode=undefined;
  }
  if(cameraStream)
  {
    cameraStream.getTracks().forEach(track=>track.stop());
    cameraStream=undefined;
  }
  // never close audio context as bad things happen in chrome
  // and I can't work out what has a reference to it
/*  if(audioContext)
  {
    await audioContext.close();
    audioContext=undefined;
    console.log("CLOSE AUDIO");
  }*/
}
