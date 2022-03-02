---
title: Approaches to making sensor data usable
lesson_order: 4
sublesson_order: 1
category_intro_html: Sensor data is dirrrty. How do we get a cleaner measurement of what we want to understand about the world? Find out in this exciting multi-part series on data filtering!
---
# Sensors are bad

I may have mentioned this before (like a million times so far), but the quality of data that we get from sensors is really bad.

<details markdown=1 class="reminder">
<summary>
Can you remember any of the reasons why sensor data is rubbish?
</summary>

* Sensors can have various types of errors, such as random noise and bias which mean they don't directly relate to the underlying sensed signal. 

* Some sensors only give relative changes in value, or values which whilst they relate to the underlying value are 'unitless', in that they don't directly map to any known unit e.g. for many light sensors, we know they read high when it is bright and low when dark, but cannot directly map this to light related units such as lumens or lux.

* Sensors often don't measure what we're actually interested in, for example we may be interested in human motion, but an infrared motion sensor will also respond to any other moving warm object, including animals or cars. Or we may want to understand some higher level concept such as *Is Joe at home yet*, based on interpretations of lower level sensor data such as the location of Joe's phone and motion data from Joe's house.

* It is easy to make mistakes in placement and wiring of sensors or in our code which processes the data.

* Other physical effects may alter the response of sensors, e.g. changes of temperature can change the response curve of many other non-temperature sensors.

</details>

# What can we do about sensor data being bad?

When we are using sensor data, there are multiple ways in which we may deal with the fact that sensor data is not very good. In this part of the course material, we discuss ways in which we may process an individual stream of sensor data in order to make it more useful for our purpose, which is to understanding or responding to the state of the physical world and changes in that state in our computer software. As noted above, this material focuses on ways to make individual sensor streams more amenable to computer interpretation; in section 5, we will discuss how to combine information from multiple sensors to better interpret them computationally.

In the following 3 subsections we look at 3 different methods of processing sensor data:

* By **thresholding** numerical signals at a particular value, we can use them to detect the time of occurrence of events or changes in state. This may be as simple as firing an event each time the sensor output exceeds a particular value, or may be done more intelligently in various ways.

* When we are sensing the occurrence of **events**, such as at what point someone pressed a button, several types of errors may occur; in the second section, we discuss ways in which our sensing may be made more robust to errors such as multiple reporting of a single event, and how we may tune our algorithms to balance **false positives**, where an event is reported when it did not in fact occur, or **false negatives**, where an event is missed.

* With numerical signals, they may contain various different forms of information overlaid. For example sound data may contain information relating to general noise level of a room, information relating to discrete speech events, along with a level of random sensor noise. A useful way to conceptualise this is the concept of different frequencies of signal; in the third subsection of this content, we discuss **frequency based filtering** methods, which aim to isolate particular frequencies from a signal, for example getting the ambient light level in a room by isolating very slow, low frequency changes in a light sensor, whilst ignoring fast changes due to things like people walking past the sensor.

In the final part of this section, we will look at some challenges of filtering that are specific to two sensors, the accelerometer and sound sensors. Whilst the approaches to dealing with these sensors are essentially those described above, the nature of these particular sensors presents some very specific challenges which are worth knowing about, and illustrate how sensor processing can be helped by knowing the detailed characteristics of the sensors which you are using.


