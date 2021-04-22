---
title: Awesome Accelerometers
uses_maths: true
uses_pyodide: true
uses_audio: true
uses_light: true
uses_accelerometer: true
---

In this section we talk about specific filtering that one might wish to do for the accelerometer

# Accelerometer

The accelerometer is a really neat sensor which outputs the acceleration that the device is experiencing. We can use this to detect gestures, estimate orientation of the device, estimate how fast the device is moving, detect bumps, all sorts of things. However processing sensor data from it is relatively difficult. 

<details class="question" markdown=1>
<summary>Any idea why accelerometer data is hard to process?</summary>
The accelerometer reports *all* acceleration on the device in terms of 3 axes X, Y and Z. This acceleration is a combination of two signals, firstly the acceleration due to motion of the device in space, and secondly, the constant downwards acceleration due to gravity which all objects are subject to.

Further to that, the accelerometer axes are aligned to the axes of the device; this means that when a device is rotated as well as moved in space, the axes rotate along with the device. This means that filtering of each individual axis alone may be problematic if the device is rotated.
</details>

So, what are some ways to process the accelerometer that are useful:

## Method 1 - Ensure fixed alignment of the device and remove constant gravitational acceleration

Stick your phone on the floor. As long as it is flat, then the Z axis should be pointing up. Then we can just treat that z axis as a single sensor value as before. Try playing with this knock sensor code on your phone. It should say knock when you hit the floor or jump next to it hard enough.

We use a high pass filter in this example to remove the gravitational acceleration, which we know will be constant as long as the device is still.


<script>
makePyodideBox({
    codeString:`
SAMPLE_TIME = 0.01 # sample 100 times a second
FILTER_TIME_CONSTANT=.05 # 20th of a second
THRESHOLD=1.0

import graphs, sensors,time,filters,speech
graphs.set_style("z accel","rgb(0,0,0)",-10,10)
graphs.set_style("highpassed z","rgb(255,0,0)",-3,3,subgraph_y=1)

# startup delay 
time.sleep(.5)

hpFilter=filters.HighPassFilter.make_from_time_constant(FILTER_TIME_CONSTANT,SAMPLE_TIME)
last_threshold=0
knockCount=0
while True:
    x,y,z=sensors.accel.get_xyz()
#    print(x,y,z)
    z_highpassed=hpFilter.on_value(z)
    threshold=1 if z_highpassed>THRESHOLD else 0
    if threshold!=last_threshold and threshold==1:
        knockCount+=1
        speech.say(f"KNOCK {knockCount}")
        print("KNOCK",knockCount)
    graphs.on_value("z accel",z)
    graphs.on_value("highpassed z",z_highpassed)
    time.sleep(SAMPLE_TIME)
`  ,hasConsole:true,hasGraph:true,showCode:true,editable:true,caption:"If we have a known orientation we can just use that axis"})
</script>


## Method 2 - Use the magnitude
The magnitude of the acceleration is found by taking the magnitude of the vector (x,y,z), i.e. 

$$magnitude=\sqrt{x^2+y^2+z^2}$$.

This value is useful because it is not dependent on rotation of the device, so we can use it just to detect e.g. how much a device is being shaken. 

Pick up your phone, and run this sample, and give the phone a good shake. If you have your speakers on, it should complain if you shake it too much.

<script>
makePyodideBox({
    codeString:`
SAMPLE_TIME = 0.01 # sample 100 times a second
FILTER_TIME_CONSTANT=.05 # 2 seconds

import graphs, sensors,time,filters,speech
import math
graphs.set_style("magnitude","rgb(0,0,0)",-5,5)
graphs.set_style("lowpassed magnitude","rgb(255,0,0)",-5,5,subgraph_y=1)

# startup delay 
time.sleep(.5)

lpFilter=filters.LowPassFilter.make_from_time_constant(FILTER_TIME_CONSTANT,SAMPLE_TIME)

mag_max=-100
while True:
    x,y,z=sensors.accel.get_xyz()
#    print(x,y,z)
    # take 9.8 off the magnitude to account
    # for gravitational acceleration
    magnitude=math.sqrt(x*x+y*y+z*z)-9.8 
    mag_lowpassed=lpFilter.on_value(magnitude)
    if mag_lowpassed>3 and mag_max<=3:
        specch.say("Ouchy ouch")
    elif mag_lowpassed>5 and mag_max<=5:
        speech.say("Too hard")
    mag_max=max(mag_lowpassed,mag_max)
    graphs.on_value("magnitude",magnitude)
    graphs.on_value("lowpassed magnitude",magnitude)
    time.sleep(SAMPLE_TIME)
`  ,hasConsole:true,hasGraph:true,showCode:true,editable:true,caption:"We can use the magnitude to make things work any way up"})
</script>

## Method 3 - Use the gravitational acceleration for orientation sensing

If you assume the accelerometer is still, then you can use the gravitational acceleration to detect orientation. For example, if a phone is flat on it's back, the z acceleration is $$9.8m/s^2$$ (or 1G).

The code below detects whether a phone is tipped to it's left or right (in portrait orientation) by looking at the angle defined by Z and X. 

` roll = math.atan2(z,x ) `

where [math.atan2](https://docs.python.org/3/library/math.html) is the full circle arc-tangent function, which gives an angle from a vector.

<script>
makePyodideBox({
    codeString:`
SAMPLE_TIME = 0.01 # sample 100 times a second
FILTER_TIME_CONSTANT=.05 # 2 seconds

import graphs, sensors,time,filters,speech
import math
graphs.set_style("angle","rgb(0,0,0)",-math.pi,math.pi)

# startup delay 
time.sleep(.5)

lpFilter=filters.LowPassFilter.make_from_time_constant(FILTER_TIME_CONSTANT,SAMPLE_TIME)

dotPos=10;

while True:
    x,y,z=sensors.accel.get_xyz()
    angle=math.atan2(x,z)
    if angle<-math.pi/4:
        dotPos-=0.05
        if dotPos<0:
            dotPos=0
    elif angle>math.pi/4:
        dotPos+=0.05
        if dotPos>20:
            dotPos=20
    print(" "*int(dotPos) + ".");
    
    graphs.on_value("angle",angle)
    time.sleep(SAMPLE_TIME)
`  ,hasConsole:true,hasGraph:true,showCode:true,editable:true,caption:"Tilt based on the accelerometer"})
</script>

# What can't you do with an accelerometer?

A warning... One thing that is commonly attempted with an accelerometer is to identify device motion and changes in position. The reasoning behind this is that in theory if we know the initial position and velocity of our device, by integrating the acceleration we can estimate speed, and then by integrating the speed, we get relative position.

This process of estimating changes in position from a known starting point is known as *dead reckoning*. It is sort of possible in some situations when the accelerometer orientation is known to a high degree of accuracy. However it is extremely hard to do successfully for one reason, which is that as well as integrating the actual value of the acceleration, we also integrate any error in the accelerometer signal. Any error in accelerometer means that the velocity is wrong, which means that the position quickly drifts away from the real position. 

Try the code below on your phone to see - put the phone on a flat surface, and hit start, then move it 20cm to the right. See what the distance moved is reported as, and whether it stops when you stop.

<script>
makePyodideBox({
    codeString:`
SAMPLE_TIME = 0.01 # sample 100 times a second

import graphs, sensors,time,filters,speech
graphs.set_style("x accel","rgb(0,0,0)",-10,10)
graphs.set_style("velocity","rgb(255,0,0)",-50,50,subgraph_y=1)
graphs.set_style("position","rgb(255,0,0)",-50,50,subgraph_y=2)

# startup delay 
time.sleep(.5)

# initially we are stopped at position 0
velocity=0
position=0
while True:
    x,y,z=sensors.accel.get_xyz()
    velocity+=x*SAMPLE_TIME
    position+=velocity*SAMPLE_TIME
    graphs.on_value("x accel",x)
    graphs.on_value("velocity",velocity)
    graphs.on_value("position",position)
    time.sleep(SAMPLE_TIME)
`  ,hasConsole:true,hasGraph:true,showCode:true,editable:true,caption:"Integrating accelerometer to get velocity and position quickly drifts"})
</script>
