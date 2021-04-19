---
title: Python and sensors on the web
uses_pyodide: true
uses_audio: true
uses_accelerometer: true
uses_light: true 
lesson_order: 1
sublesson_order: 1
category_intro_html: "The sensor processing examples on here use web based python scripts. These run in your web browser thanks to the [pyodide project](https://pyodide.org/). In this section we will discuss this stuff, the coursework, and how you should use web python in your coursework."
---

This site uses a version of python compiled to run in your web browser, with some javascript added to allow you to read from sensors on your computer or phone and draw graphs. 

The reason for this is so that you can experiment with processing sensor data in python without requiring any specialist hardware. You can access sensors including sound level (on mobile or any PC with a microphone), light level (sort of, on anything with a camera) and mobile phone accelerometers and gyroscopes on Android or iOS.

# Browser and System Compatibility of the different sensors

Most things work fine in Chrome, Edge, Firefox and Safari on Windows, Mac or iOS.

Light level sensing will work most accurately on Chrome or Edge for Windows and Android Chrome because other
browsers don't allow manual control of camera exposure, so 
auto exposure may break things.

Sound level should be cool and dandy everywhere.

There is no accelerometer support on Windows or Mac, so you can only read accelerometer on mobile platforms.

# Python Hello World

When you see a python block like the one below, you can run python in it. The examples have python already in them, you can change it if you want to fiddle.

Click the 'start' button to run the python, and 'stop' to cancel a run.

<script>
makePyodideBox({
    codeString:`
# change the code below and click start to run
print ("hello web python")
`  ,hasConsole:true,showCode:true,editable:true,caption:"Hello world in python"})
</script>

# Getting data from sensors
To get data from sensors, you use the sensors module, like these examples for sound and accelerometer respectively. Note, accelerometer will only work on a phone as computers don't typically have them in, or don't expose them to web browsers. 

<script>
makePyodideBox({
    codeString:`
# we use time.sleep for delay
import time    
# load the sensors module
import sensors
while True:
    sound_level=sensors.sound.get_level()
    print(sound_level)
    time.sleep(0.1)
`  ,hasConsole:true,showCode:true,editable:true,caption:"Read sound sensor in python"})
</script>

<script>
makePyodideBox({
    codeString:`
# we use time.sleep for delay
import time    
# load the sensors module
import sensors
while True:
    # get xyz values of acceleration
    # can also use sensors.accel.get_magnitude()
    # to get the overall magnitude of acceleration
    (x,y,z)=sensors.accel.get_xyz()
    print(x,y,z,sep=',')
    time.sleep(0.1)
`  ,hasConsole:true,showCode:true,editable:true,caption:"Read smartphone accelerometer sensor in python"})
</script>

# Drawing things on graphs
The graph module in python allows you to draw simple line graphs. It works in any code box that shows a graph below. Use it like this:

<script>
makePyodideBox({
    codeString:`
# we use time.sleep for delay
import time    
# load the graphing module
import graphs
c=0
graphs.set_style("Straight","rgb(255,255,0)",-1,1)
graphs.set_style("Squared","rgb(0,255,0)",-1,1)
graphs.set_style("Cubed","blue",-1,1) 
while True:
    c=c+0.01
    if c>1:
        c=-1    
    graphs.on_value("Straight",c)
    graphs.on_value("Squared",c*c)
    graphs.on_value("Cubed",c*c*c)
    time.sleep(0.01)
`  ,hasConsole:true,hasGraph:true,showCode:true,editable:true,caption:"Show values on a graph in python"})
</script>

# Let's graph a sensor

In the example below, we get the light and sound sensors and show them on a graph.

Note in the set_style call, we use subgraph_y to split the graph into two separate graphs. You can also use subgraph_x
to split the graph horizontally, but it is often less useful because things at the same time don't line up.

<script>
makePyodideBox({
    codeString:`
# we use time.sleep for delay
import time    
# load the graphing module and sensors 
import graphs
import sensors
c=0
graphs.set_style("sound","rgb(255,255,0)",0,1,subgraph_y=0)
graphs.set_style("light","rgb(0,255,0)",0,1,subgraph_y=1)
while True:
    c=c+0.01
    if c>1:
        c=-1    
    sound_level=sensors.sound.get_level()
    light_level=sensors.light.get_level()
    print(sound_level,light_level,sep=",")
    graphs.on_value("light",light_level)
    graphs.on_value("sound",sound_level)
    time.sleep(0.1)
`  ,hasConsole:true,hasGraph:true,showCode:true,editable:true,caption:"Show light and sound on a graph"})
</script>

