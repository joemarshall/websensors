---
---
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

var micStream,sourceNode,processorNode,audioContext;

export async function start(callback)
{
    _onLevel=callback;
    try
    {
        micStream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });        

        if(!audioContext)
        {
          var AudioContext = window.AudioContext || window.webkitAudioContext // Safari and old versions of Chrome
          audioContext = new AudioContext();
          await audioContext.audioWorklet.addModule('{{ "/assets/js/amplitude_getter2.js" | relative_url }}');
        }
        processorNode=new VUMeterNode(audioContext,20);
        sourceNode = audioContext.createMediaStreamSource(micStream);
        sourceNode.connect(processorNode);
        audioPlaying = true;    
        console.log("Started audio input");   
    
    }catch(e)
    {
        console.log("Error loading sound:",e);
        return;
    }    
}

export async function stop()
{
  console.log("STOPPING audio");
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
  if(micStream)
  {
    micStream.getTracks().forEach(track=>track.stop());
    micStream=undefined;
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
