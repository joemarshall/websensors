var _onLevel;
var audioPlaying=false;

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
            this._volume = event.data.volume;
            window.setTimeout(this.draw.bind(this),0);
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
    _onLevel(this._volume);
  }

}

var cameraStream,sourceNode,processorNode;

export async function startAudioProcessor(callback)
{
    _onLevel=callback;
    try
    {
        cameraStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
    //        video: true
        });
        //console.log(cameraStream);
        
    }catch(e)
    {
        console.log("Error loading sound:",e);
        return;
    }
    var audioContext = new AudioContext() // Default
    || new webkitAudioContext() // Safari and old versions of Chrome
    || false; 
    
    await audioContext.audioWorklet.addModule('amplitude_getter2.js');
    processorNode=new VUMeterNode(audioContext,1);
    sourceNode = audioContext.createMediaStreamSource(cameraStream);
    sourceNode.connect(processorNode);
    audioPlaying = true;    
    console.log("Started audio input");   
}

