---
---
var _onLevel;
var audioPlaying=false;

var _made_worklet=false;

async function makeProcessor(ctx,intervalInMS)
{
    if (typeof(AudioWorkletNode)=='function')
    {
          if(!_made_worklet)
          {
              await ctx.audioWorklet.addModule("{{'/assets/js/amplitude_getter2.js'|relative_url}}");
              _made_worklet=true;  
          }


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
              if (event.data.volume!=undefined && _onLevel)
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
        return new VUMeterNode(ctx,intervalInMS);
    }else
    {
        var sampleRate=ctx.sampleRate;
        var _vu_proc=new class 
        {
          constructor (options) {
            this._sum =0;
            this._samples=0;
            this._volume = 0;
            this._updateIntervalInMS = intervalInMS;
            this._nextUpdateSamples = 1000;
          }            

          get intervalInSamples () {
            return this._updateIntervalInMS / 1000 * sampleRate;
          }
          process (inputs, outputs, parameters) {
            const input = inputs[0];
            // Note that the input will be down-mixed to mono; however, if no inputs are
            // connected then zero channels will be passed in.
            if (input.length > 0) {
              const samples = input[0];
              for (let i = 0; i < samples.length; ++i)
              {
                this._sum += samples[i] * samples[i];
                this._samples++;
                if(this._samples>=this._nextUpdateSamples)
                {            
                    this._volume=Math.sqrt(this._sum/this._samples);
                    
                    if (_onLevel)
                    {
                    // double it so it goes 0-1 
                        _onLevel(Math.min(this._volume*2.0,1));
                    }                    
                    this._nextUpdateSamples=this.intervalInSamples;
                    this._samples=0;
                    this._sum=0;
                }
              }
            }
          }
            
        }();
        
        var processorNode=ctx.createScriptProcessor(2048);
        
        processorNode.onaudioprocess=function(evt)
        {
            var input=evt.inputBuffer.getChannelData(0);
            _vu_proc.process([[input]],[],{});
        };
        // this needs to connect to destination or else 
        // it will never get called
        processorNode.connect(ctx.destination);
        return processorNode;
    }
}

// we prime the sensor when requestPermissions 
// is called
var primed=false;

var micStream,sourceNode,processorNode,audioContext;

// this stuff needs to be run direct from the click event
// or else it won't work in safari
export async function requestPermissions()
{
  _onLevel=undefined;
  primed=true;
  // need to make the audio context before anything async
  if(!audioContext)
  {
    const AudioContext = window.AudioContext || window.webkitAudioContext // Safari and old versions of Chrome
    audioContext = new AudioContext();
  }
  // if we are restarting, then don't stop 
  // and start everything
  if(!micStream)
  {
    try
    {
      // this needs to be first before any async calls
      micStream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });
      sourceNode = audioContext.createMediaStreamSource(micStream);
      processorNode=await makeProcessor(audioContext,20);
      sourceNode.connect(processorNode);
    }catch(e)
    {
      console.log("Couldn't get sound permissions",e)
    }
  }
}

export async function start(callback)
{
  primed=false;
    _onLevel=callback;
    try
    {
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
  if(primed)
  {
    return;
  }
  _onLevel=undefined;
  console.log("STOPPING audio");
/*  if(processorNode)
  {
    processorNode=undefined;
  }*/
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
