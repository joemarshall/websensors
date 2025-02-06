---
title: MRT Coursework 2 introduction
uses_pyodide: true
uses_audio: true
uses_accelerometer: true
uses_light: true 
---

The second coursework is all about using sensors to interpret the state of
the world around the sensing device.

In your coursework you will build a system which uses at least two sensors. You may wish to prototype elements of your sensing using the web sensor platform. 

As an example of a sensing algorithm, here is a repetitive activity being sensed - click start below, and if you are quiet, you should be able to clap, and the number of claps being printed out should go up.

<script>
makePyodideBox({
    codeString:`# detect things that happen in less than about a 20th of a second
HIGH_PASS_CONSTANT=.2
# very small low pass filter just to remove any jumps around the threshold
LOW_PASS_CONSTANT=0.01
# detect jumps of 200 from constant level
THRESHOLD=200
# time between samples
SAMPLE_TIME=0.005
import time
import graphs
import sensors
# hey look at this, I put all the filters I talk about
# in the filters module for you to save you copy/pasting
# the code in your work
import filters

graphs.set_style("sound","rgb(0,0,0)",0,1024)
graphs.set_style("filtered sound","rgb(255,0,0)",-256,256,subgraph_y=1)
graphs.set_style("threshold","rgb(0,255,0)",-256,256,subgraph_y=1)

hpFilter=filters.HighPassFilter.make_from_time_constant(HIGH_PASS_CONSTANT,SAMPLE_TIME)
lpFilter=filters.LowPassFilter.make_from_time_constant(LOW_PASS_CONSTANT,SAMPLE_TIME)

last_thresholded=1
event_count=0
while True:
    sound_level=sensors.sound.get_level()
    sound_highpassed=hpFilter.on_value(sound_level)
    sound_lowpassed=lpFilter.on_value(sound_highpassed)
    thresholded=1 if sound_lowpassed>THRESHOLD else 0
    if thresholded==1 and last_thresholded==0:
        event_count+=1
        print(time.time(),event_count)
    last_thresholded=thresholded
    print(event_count,sep=',')
    graphs.on_value("sound",sound_level)
    graphs.on_value("filtered sound",sound_lowpassed)
    graphs.on_value("threshold",THRESHOLD)
    time.sleep(SAMPLE_TIME)
`  ,hasConsole:true,hasGraph:true,showCode:true,editable:true,caption:"Clap sensing using high pass and low pass filters"})
</script>

To understand how this code works, work through the exercises in this website, which will help you learn the basics of how sensor processing systems are developed.

# Coursework doings

For the coursework, you will submit a proposal for a sensing system to build.

You will then prototype *only* the sensor processing aspect of this, i.e. the part which interprets the sensor data. You will not prototype the user interface, the server backend, physical hardware or anything else. These aspects of the system may be described in the design section of your report, but are not part of the practical work.

For the practical work, you  will develop a sensing algorithm, a python script like the one above which takes in sensor data, processes that data, and outputs some kind of interpretation of the data. This will use the methods in the sections on sensor filtering and combination. We will expect your algorithm to run on the grovepi boards which are available in the lab unless you have already discussed something different with us.

Once the algorithm is built, you will use the methods in the section on testing of algorithms to quantify how well your system works, and in what circumstances it fails and why. This is an important part of the final report which is highly weighted, so don't leave this till the last minute. 

As the previous paragraphs perhaps made obvious, the final outcome of this work is a written report. You must also submit all code for your sensor algorithm, which we will run during marking so we can understand how your system works. Please make sure all code you submit does run, as we cannot mark non-running code.

# Stuff for you to use in the labs

During the coursework, you will want to prototype things - often this involves sticking stuff together with tape, strapping raspberry pis or sensors onto objects. We have a bunch of stuff around in the lab, including foam, gaffa tape, cardboard, an empty cupboard if you want to prototype something inside a cupboard, a small trolley for prototyping moving projects etc. You can also take the raspberry pis out during the lab time, around the building, or even outside. You can also bring your own stuff to the lab sessions.

{%include figure.html url="/images/labstuff.jpg" alt="Stuff we have that you can use in the lab sessions - foam, cardboard, a trolley, doors, a cupboard, gaffa tape etc." title="Some stuff we have access to during the lab sessions" caption="During the lab sessions there is a bunch of prototyping bits and pieces available to you. You can also go outside or around the building with the sensors." %}

# Here are some I made earlier...

Some prototypes made by students on the course:

{%include figure.html url="/images/shoetracker.jpg" alt="Sensors attached to a shoe" title="Shoe tracker" caption="Tracking foot motion by attaching sensors to a shoe." %}

{%include figure.html url="/images/doorsensor.jpg" alt="Sensors attached to a door frame" title="Door sensing" caption="Counting people going through a door using sensors attached to the frame." %}

{%include figure.html url="/images/goal.jpg" alt="Sensors attached to a toy football goal" title="Goal tracker" caption="Tracking shots on goal using ultrasound sensors, prototyped using a scale model goal (and a tiny ball)." %}
