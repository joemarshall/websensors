---
title: Robust event detection
lesson_order: 4
sublesson_order: 3
uses_maths: true
uses_pyodide: true
uses_audio: true
uses_light: true
---

# Event detection basics

In many uses of sensors, what we are interested in is not a continuous value of some parameter over time as we get from the raw sensor data, but events that occur in the physical world at specific times.

The most basic way to detect an event is with a simple threshold, as seen on the previous page. If we have a threshold value, we can assume an event occurs when the threshold changes.

For example, check out the code below which uses the light sensor to detect when you put your hand in front of the sensor (your webcam in this case). This is done by thresholding on a low light level (I chose an arbitrary value of 0.3 here), and firing an event when the light sensor goes below this.

<script>
makePyodideBox({
    codeString:`
# we use time.sleep for delay
import time    
# load the sensors module
import sensors
import graphs


graphs.set_style("light","rgb(0,0,0)",0,1)
graphs.set_style("threshold","rgb(0,255,0)",0,1)
graphs.set_style("event counter","rgb(0,0,255)",0,10,subgraph_y=1)
# try changing this threshold level and see what it does 
# to the thresholded output
THRESHOLD_LEVEL=0.3

event_count=0
last_threshold=0
while True:
    light_level=sensors.light.get_level()
    thresholded=1 if light_level<THRESHOLD_LEVEL else 0
    if last_threshold==0 and thresholded==1:
        # threshold hit, fire an event
        event_count+=1
        print("EVENT FIRED",event_count)
        # make sure that the event counter graph doesn't 
        # overflow
        event_count=event_count%10 
    last_threshold=thresholded
    graphs.on_value("light",light_level)
    graphs.on_value("threshold",THRESHOLD_LEVEL)
    graphs.on_value("event counter",event_count)
    time.sleep(0.01)
`  ,hasConsole:true,hasGraph:true,showCode:true,editable:true,caption:"Light sensor event detection using simple threshold"})
</script>

