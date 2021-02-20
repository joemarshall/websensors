/* Boometer-processor.js: AudioWorkletGlobalScope */
const SMOOTHING_FACTOR = 0;
const MINIMUM_VALUE = 0.00001;
class AmplitudeProcessor extends AudioWorkletProcessor 
{
  constructor (options) {
    super();
    this._sum =0;
    this._samples=0;
    this._volume = 0;
    this._updateIntervalInMS = options.processorOptions.updateIntervalInMS;
    this._nextUpdateSamples = 1000;
    this.port.onmessage = event => {
      if (event.data.updateIntervalInMS)
        this._updateIntervalInMS = event.data.updateIntervalInMS;
    }
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
            this.port.postMessage({volume: this._volume});
            this._nextUpdateSamples=this.intervalInSamples;
            this._samples=0;
            this._sum=0;
        }
      }
    }
    // Keep on processing if the volume is above a threshold, so that
    // disconnecting inputs does not immediately cause the meter to stop
    // computing its smoothed value.
    return (input.length>0) || this._volume >= MINIMUM_VALUE;
  }
};
registerProcessor('vumeter2', AmplitudeProcessor);
