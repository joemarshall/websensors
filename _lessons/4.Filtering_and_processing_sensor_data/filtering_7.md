---
title: Stupendous Sound
uses_pyodide: true
uses_audio: true
---

The sound sensor is another sensor which has a lot of different information in it and which requires careful handling to interpret the data from the sensor.

Here are some useful recipes for doing things with sound processing:

# Detect noise level over the last minute

To detect 'how busy' a room is, we could consider using an overall measure of noise in the room. Here we do this with a simple low-pass filter with a high time constant.

<script>
makePyodideBox({
    codeString:`# 60 second time constant
FILTER_TIME_CONSTANT=60
# with such a big time constant we don't necessarily need to record samples very frequently, so I've set this to 5 times a second
SAMPLE_TIME=0.2
import graphs, sensors,time
# The filters module contains my simple high and low pass filters
import filters
graphs.set_style("sound","rgb(0,0,0)",0,1)
graphs.set_style("noise level","rgb(255,0,0)",0,1,subgraph_y=1)

lpFilter=filters.LowPassFilter.make_from_time_constant(FILTER_TIME_CONSTANT,SAMPLE_TIME)
while True:
    sound_level=sensors.sound.get_level()
    noise_level=lpFilter.on_value(sound_level)
    graphs.on_value("sound",sound_level)
    graphs.on_value("noise level",noise_level)
    time.sleep(SAMPLE_TIME) 

`  ,hasConsole:true,hasGraph:true,showCode:true,editable:true,caption:"A very long low-pass filter to estimate room noise levels"})
</script>



# Detect spikes (without firing on constant loud noises)

# Measure immediate volume level of room 


