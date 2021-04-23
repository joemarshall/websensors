---
title: Stupendous Sound
uses_pyodide: true
uses_audio: true
---

The sound sensor is another sensor which has a lot of different information in it and which requires careful handling to interpret the data from the sensor.

Here are a couple of useful recipes for doing things with sound processing. If you have something you really need, do ask me.

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
c=0
while True:
    sound_level=sensors.sound.get_level()
    noise_level=lpFilter.on_value(sound_level)
    c+=1
    # display room noise level every 10 secs
    if c==50:
        print("ROOM NOISE:",noise_level)
        c=0
    graphs.on_value("sound",sound_level)
    graphs.on_value("noise level",noise_level)
    time.sleep(SAMPLE_TIME) 

`  ,hasConsole:true,hasGraph:true,showCode:true,editable:true,caption:"A very long low-pass filter to estimate room noise levels"})
</script>

# Detect spikes (without firing on constant loud noises)

To detect spikes here, we assume a spike is a quick up followed by a quick down. To detect these, we:

1. Highpass filter to isolate changes in level
2. Threshold and fire an event if we see both positive and negative spikes in the highpass filter close together with silence either side.

If you look at the code below, there are a bunch of constants. Changing these alters how sensitive it is to spikes, and how 'spiky' a spike has to be.

|Constant|&nbsp;Default&nbsp;| Description
|--:|:-:|:--|
| TIME_THRESHOLD | 0.2s | We only count spikes that are separated from the previous one by at least this much. This avoids finding spikes when e.g. people are talking loud
| SILENCE_BEFORE | 0.2s | We require this much silence before a spike - to make sure it is really a spike.
| SILENCE_AFTER | 0.1s | And this much silence after. Making this value can make the spike detection less likely to false positive, but because we have to wait this long before reporting a spike, it will add delay.
| UP_THRESHOLD | .02 | How much of an up spike is required on the high-passed value. Increasing this value will mean spikes have to be louder so increase the level of false negatives whilst decreasing false positives.
| DOWN_THRESHOLD | -.02 | How much of a down spike is required on the high-passed value. This has a similar effect to the UP_THRESHOLD



<script>
makePyodideBox({
    codeString:`
# looking for short jumps in value
HP_TIME_CONSTANT=0.05
# sample quickly
SAMPLE_TIME=0.01


# only notice a knock when we see and up and a down
# between this time
# knock shorter than 0.2 seconds
TIME_THRESHOLD=0.2
# 0.2 seconds of silence before
SILENCE_BEFORE=0.2
# followed by >0.2 seconds of silence
SILENCE_AFTER=0.1


# how loud does a knock need to be
UP_THRESHOLD=.02
DOWN_THRESHOLD=-.02

import graphs, sensors,time
# The filters module contains my simple high and low pass filters
import filters
graphs.set_style("sound","rgb(0,0,0)",0,1)
graphs.set_style("hp","rgb(0,255,0)",-.1,.1,subgraph_y=1)

hpFilter=filters.HighPassFilter.make_from_time_constant(HP_TIME_CONSTANT,SAMPLE_TIME)
c=0

# this is the current threshold position
# if the highpassed value is < -threshold, then
# we set it to -1
# if it is above threshold, then 1
lastPosition=0

lastUp=None
lastDown=None
crossingUp=None

crossingDown=None

while True:
    sound_level=sensors.sound.get_level()
    hp=hpFilter.on_value(sound_level)
    graphs.on_value("sound",sound_level)
    graphs.on_value("hp",hp)
    time.sleep(SAMPLE_TIME) 
    if lastPosition!=-1 and hp<DOWN_THRESHOLD:
        # down transition
        lastPosition=-1
        # mark a transition
        lastDown=crossingDown
        crossingDown=time.time()
    if lastPosition!=1 and hp>UP_THRESHOLD:
        # up transition
        lastPosition=1
        # mark a transition
        lastUp=crossingUp
        crossingUp=time.time()
#    print(crossingUp,crossingDown,lastUp,lastDown)
    if crossingDown!=None and crossingUp!=None and crossingDown>crossingUp:
        if crossingDown-crossingUp<TIME_THRESHOLD and time.time()- crossingDown>SILENCE_AFTER:
                if lastDown==None or (lastDown<crossingUp and crossingUp-lastDown)>SILENCE_BEFORE:
                    print("KNOCK",lastDown,crossingUp)
                lastUp=crossingUp
                lastDown=crossingDown
`  ,hasConsole:true,hasGraph:true,showCode:true,editable:true,caption:"Detecting spikes by detecting stability (high pass value close to zero, followed by up and down spike, followed by stability)"})
</script>






