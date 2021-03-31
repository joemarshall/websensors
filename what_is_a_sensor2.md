---
title: What is a sensor (2)
prev: what_is_a_sensor
next: what_is_a_sensor3
uses_pyodide: true
uses_audio: true
uses_files: true
---

# Definition

A sensor is: 
> "a device which provides a usable output in response to a specific measurand" [Instrument Society of America, 1975](#isa). 

> A device that receives a stimulus and responds with an electrical signal [McGrath & Scanaill 2014](#mands)

So basically, it is something that takes some kind of physical thing that is happening in the real world, and creates an electrical output which alters based on that physical change. This makes things happening in the world accesible to electrical equipment. Most importantly for this course, it makes them accessible to computers.

{%include figure.html url="/images/sensor_diagram1.svg" alt="A sensor responds to a physical quantity from the real world by altering an electric signal which may then be processed by a computer or other electrical devices." title="A sensor responds to a physical quantity from the real world by altering an electric signal which may then be processed by a computer or other electrical devices." caption="What a sensor does" %}

# Sensor examples revisited

How does this apply to my examples of sensors?

A passive infrared motion sensor responds to the level of emitted infrared light coming into the sensor. By detecting changes in the amount of light across the sensor it is possible to detect motion of warm objects such as humans or animals.

A microphone creates electricity based on vibrations of a membrane inside the microphone. Because this responds to the vibrations in the air, the microphone responds to air vibrations or sound waves and outputs a corresponding electrical signal.

A keyboard is a set of buttons, each of which respond to a physical pushing action by outputting an electrical signal based on whether the button is pushed down or not.

A camera contains a grid of sensors which respond to photons (light) falling on them. By placing this grid of sensors behind a lens and counting how much light hits each sensor in the grid, we can capture an image from the camera.


# Let's look at a sensor
The microphone on a computer is an example of a sensor. Lets look at some data from your microphone. If you don't have one, then please grab whatever you use for your teams meetings and use that. This page should work on phones if you need it to.

Click the 'go' button below, and once you have told your web browser to allow access to your microphone you should see a load of numbers come up and the graph should show values. If you make noise, the numbers should get bigger, and the graph should show higher levels. If you don't see that, check that your microphone is working (e.g. with teams or something). If you still can't see anything, [email me](mailto:joe.marshall@nottingham.ac.uk) and ask for help, letting me know what device and web browser you are using because there may be something on the server that doesn't work for your device, and you really really need me to work it out with you so you can do the coursework. It works great in Chrome or Firefox on Windows and should also work on Safari.

<script> makePyodideBox({codeFile:"basic_audio.py",hasConsole:true,showCode:true,editable:true,hasGraph:true})</script>

# Further reading

To understand more about the nature of sensors and sensing, there is a really useful book chapter linked below by McGrath & Scanaill [2014](#mands) which is absolutely worth a read. Maybe take a look after you've done the next "what is a sensor" exercise.


# References

1. <a id="isa"></a> Instrument Society of America/ ANSI, “ISA S37.1–1975 (R1982),” ed, 1975. N.b. you don't need to read this reference unless you have an absolutely masochistic desire to find and read standards documents, read the book below instead. 

1. <a id="mands"></a>McGrath M.J., Scanaill C.N. (2013) Sensing and Sensor Fundamentals. In: Sensor Technologies. Apress, Berkeley, CA. [https://doi.org/10.1007/978-1-4302-6014-1_2](https://doi.org/10.1007/978-1-4302-6014-1_2)
