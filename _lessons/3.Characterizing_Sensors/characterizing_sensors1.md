---
title: Sensors are dirty and bad 
next: characterizing_sensors2
upprev: index
lesson_order: 3
sublesson_order: 1
category_intro_html: In the previous section we learnt that sensors **respond** to physical properties in the real world, rather than simply giving you the value of that property. In this section, we will look at how we can understand and characterize that response.
---
A sensor is:

> A device that receives a stimulus and responds with an electrical signal [McGrath & Scanaill 2014](#mands)

In this set of exercises we will explore the details of what that word **responds** means. In short, sensors are quite bad, and data from sensors is quite dirty and horrible.

# Responds, not equals
So, we have sensor data from a sensor, and we have a physical process we want to observe using the sensor. 

Let's say we have a light sensor. A light sensor responds to the level of light which is falling on it. But the reported value may differ from the actual quantity of light falling on the sensor in a wide range of ways. It might look like the graph in Figure 1 for example.

{%include figure.html url="/images/sensor_graph1.svg" alt="A sensor may report values that differ from the value of the physical quantity being sensed in a range of different ways." title="The value of a physical quantity versus the value a sensor reports." caption="A sensor's response to a sensed physical quantity can differ from the value of the sensed quantity in several ways." %}

The following pages describe several ways in which this sensor data can differ. Briefly, they are:

1. Sensors convert what are usually analog quantities into digital signals. This process has inherent limitations which limit the quality of data that we have access to in our software. For example:
    * Sensors are often limited by **range**, in that they only sense within a fixed range of levels, and when the physical quantity being measured goes outside that range, the output is incorrect.
    * Sensors can usually only detect a limited number of steps. This limits the **precision** of the value, so it is impossible to see very small variations in the underlying physical quantity.
    * Sensors are usually sampled at a constant rate in time. This limited **temporal resolution** means that fluctuations which happen within timesteps cannot be seen in the sensor data.
1. Most sensors are not perfect - various electrical or physical reasons may cause a sensor to exhibit causes of  error which affect the reported numerical value. These include:
    * Sensors typically have some level of **noise**, where the sensor value may fluctuate around the real value.
    * Sensors may give a value which is **biased**, or offset from the true value.
    * Many sensors give **relative** values which just show the change in the physical value being sensed.
    * Some sensors (e.g. many light sensors) don't even give values which map nicely to any known quantity being sensed. For example with many light sensors, we may know that if they output a low level it is quite dark, if they output a high level it is sort of bright, but there is little information as to what this means in terms of lux measurements.
    * Some sensors are **non-linear** in their response, meaning that depending on the level of the sensed quantity, their resolution may differ.
1. As well as numerical errors, there are a selection of ways in which sensor data may exhibit errors which are non-numerical, in that they are not able to be described in terms of mathematical transformations of the input data. Some examples of these are:
    * Sensors may be affected by **interfering outputs**, where different processes from those being sensed affect the value; for example many sensors will respond differently depending on the ambient temperature.
    * There are a whole number of ways in which sensors may have errors relating to **sensing of events**, such as a motion sensor not reporting an event when a person goes past it or vice-versa.
    * **User error** in sensor placement or behaviour around the sensors during development may cause problems with the data captured from sensors by computers.

