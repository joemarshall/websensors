---
title: Joe's Sensor Processing Interactive Teaching Stuff
---

This webpage contains an introduction to sensor data and sensor processing including a bunch of interactive sensor processing examples. It is primarily intended for students on the COMP4036 Mixed Reality Technology course at Nottingham University School of Computer Science. 

Any questions, email [Joe Marshall](mailto:joe.marshall@nottingham.ac.uk).

# Python on the web

The sensor processing examples on here use web based python scripts. These run in your web browser thanks to the [pyodide project](https://pyodide.org/).

[Intro to web python](lessons/1.Introduction_to_Web_Python/python_intro.html)

# What is a sensor?
These pages introduce you to what a sensor is

[What is a sensor pt1 - Examples of sensors](lessons/2.What_is_a_Sensor/what_is_a_sensor1.html)

[What is a sensor pt2 - Definition](lessons/2.What_is_a_Sensor/what_is_a_sensor2.html)

[What is a sensor pt3 - Why are sensors complicated](lessons/2.What_is_a_Sensor/what_is_a_sensor3.html)

# Characteristics of sensors
In the previous section we learnt how sensors **respond** to physical properties in the real world, rather than simply giving you the value of that property. In this section, we will look at how we can understand and characterize that response.

[Characterizing sensors - Introduction](lessons/3.Characterizing_Sensors/characterizing_sensors1.html)

[Characterizing sensors pt2 - Range, resolution and sensitivity ](lessons/3.Characterizing_Sensors/characterizing_sensors2.html)

[Characterizing sensors pt3 - Numerical noise](lessons/3.Characterizing_Sensors/characterizing_sensors3.html)

[Characterizing sensors pt4 - Non-numerical sensor errors](lessons/3.Characterizing_Sensors/characterizing_sensors4.html)

# Filtering individual sensors
Sensor data is dirrrty. How do we get a cleaner measurement of what we want to understand about the world? Find out in this exciting four part series on data filtering!

# Combining sensors
By combining multiple sensors with different characteristics, we may be able to better understand the world. Here we talk about how you might do that...

# Machine learning for sensor processing
In this section I discuss machine learning approaches to sensor processing and interpretation. These are the state of the art in terms of getting the most out of the data produced by sensors. They are however non-trivial to implement, so you may want to use the simpler filtering techniques described in the previous sections in your coursework if you are not a confident programmer already...

