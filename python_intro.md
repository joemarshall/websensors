---
title: Web based python introduction
uses_pyodide: true
uses_audio: true
uses_accelerometer: true
upnext: index

---

This site uses a version of python compiled to run in your web browser, with some javascript added to allow you to read from sensors on your computer or phone and draw graphs. 

The reason for this is so that you can experiment with processing sensor data in python without requiring any specialist hardware. You can access sensors including sound level (on mobile or any PC with a microphone), light level (sort of, on anything with a camera) and mobile phone accelerometers and gyroscopes on Android or iOS.

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
