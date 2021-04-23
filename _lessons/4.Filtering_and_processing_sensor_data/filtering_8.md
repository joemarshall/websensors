---
title: Luscious Light
uses_pyodide: true
uses_light: true
---

This section has a couple of brief recipes for doing useful things with light sensing.

# Using median filter to get reliable ambient light level 

The light sensor is typically effected by shadowing, things like where someone passes a sensor briefly, or by reflections where a light flashes onto the sensor. 

As an example of how this can cause issues we can consider chickens (Figure <span class="nextfig"></span>). Domestic chickens are creatures of habit, when dusk falls, they return to their hen house and roost. Foxes are also creatures of habit. When it gets dark, they go out looking for poultry to eat (or anything else small really, foxes are very unfussy). Humans who keep chickens need to go out around dusk and close the hen-house door. Otherwise bad things happen. Unfortunately, humans are not so much creatures of habit, they have a tendency to get distracted, or be late back from work or whatever. Because of this, the automatic hen-house door closer was created. What this does is use a light sensor to detect dusk falling, and close the door, keeping chicken and fox safely separate. In the morning, the light sensor triggers and opens the door again. 

{%include figure.html url="/images/chicken.jpg" alt="A chicken" title="This is my pet chicken who is called Scratch" caption="This is an entirely gratuitous chicken." %}

So what goes wrong with this and why am I going on about chickens here?

So in early versions of these devices, they used very rudimentary sensors which basically just used pretty raw light value output to trigger door open or close. They discovered a problem, which was that if these were placed near a road, or in a yard where people parked cars, the car headlight beams would trigger the door to open and allow naughty Mr Fox to eat the chickens. More modern versions use filtering to avoid unwanted triggers.

<script>
makePyodideBox({
    codeString:`
## In real deployment these values would be like this
#SAMPLE_TIME=1 # sample once a second
#BLOCK_SIZE=1800 # half an hour
## I made them much shorter so you can play
SAMPLE_TIME=.1 # sample 10x a second
BLOCK_SIZE=300 # 30 seconds

import graphs, sensors,time
# The filters module contains my simple high and low pass filters
import filters
graphs.set_style("light","rgb(0,0,0)",0,1)
graphs.set_style("ambient level","rgb(255,0,0)",0,1,subgraph_y=1)

medFilter=filters.MedianFilter(BLOCK_SIZE)
c=0
while True:
    light_level=sensors.light.get_level()
    ambient_light=medFilter.on_value(light_level)
    graphs.on_value("light",light_level)
    graphs.on_value("ambient level",ambient_light)
    time.sleep(SAMPLE_TIME) 

`  ,hasConsole:true,hasGraph:true,showCode:true,editable:true,caption:"Using a median filter to detect ambient light levels - try waving in front of the sensor etc."})
</script>

# Detecting artificial light switching

Lets say we have a simple light sensor and we want to know whether the light falling onto it is a) artificial light or b) sunlight. One way to do this is to detect when lights are switched on or off.

The code below first filters out brief changes in light levels to avoid being triggered by shadowing, using a median filter, then uses a high pass filter on that to detect abrupt and persistent changes in light state which indicate light on or light off. It also has a lower threshold for light level below which it assumes that there can't be any light turned on.


<script>
makePyodideBox({
    codeString:`
SAMPLE_TIME=.1 # sample 10x a second
# median filter to filter out very brief changes
BLOCK_SIZE=100 # 10 seconds

# high pass filter to detect changes on the scale of 
# 5 seconds or so (i.e. we assume that light on happens
# within 5 seconds and sunlight doesn't change that fast)
HP_TIME_CONSTANT=5

# thresholds on the high passed value to detect turn on/off changes
THRESHOLD_OFF = -0.1
THRESHOLD_ON = 0.1

# threshold on ambient light level for it 
# being definitely dark e.g. no light on for sure
THRESHOLD_DARK=0.1

import graphs, sensors,time
# The filters module contains my simple high and low pass filters
import filters
graphs.set_style("light","rgb(0,0,0)",0,1)
graphs.set_style("ambient level","rgb(255,0,0)",0,1,subgraph_y=1)
graphs.set_style("high passed light","rgb(0,255,0)",-1,1,subgraph_y=2)
graphs.set_style("light on","rgb(0,0,255)",0,1,subgraph_y=3)

time.sleep(0.3)

medFilter=filters.MedianFilter(BLOCK_SIZE)
hpFilter=filters.HighPassFilter.make_from_time_constant(HP_TIME_CONSTANT,SAMPLE_TIME)
c=0
light_state=0
while True:
    light_level=sensors.light.get_level()
    ambient_light=medFilter.on_value(light_level)
    hp_light=hpFilter.on_value(ambient_light)
    if ambient_light<THRESHOLD_DARK:
        light_state=0
    elif hp_light<THRESHOLD_OFF:
        light_state=0
    elif hp_light>THRESHOLD_ON:
        light_state=1
    graphs.on_value("light",light_level)
    graphs.on_value("ambient level",ambient_light)
    graphs.on_value("high passed light",hp_light)
    graphs.on_value("light on",light_state)
    time.sleep(SAMPLE_TIME) 

`  ,hasConsole:true,hasGraph:true,showCode:true,editable:true,caption:"Detecting light on/off switching"})
</script>
<details class="question" markdown=1>
<summary markdown=1>
Try playing with this algorithm then think about the following questions:
1. When might it fail to detect light switching?
2. When might it detect the light is on when it isn't?
</summary>

1. The obvious example of a false negative with this algorithm is if you turn on a light when there is sunlight in the room already. 
2. If you open curtains in a room letting in sunlight suddenly, you will get a false positive with this algorithm.

</details>

