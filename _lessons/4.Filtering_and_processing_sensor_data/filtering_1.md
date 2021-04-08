---
title: Filtering sensor data
lesson_order: 4
sublesson_order: 1
---
# Sensors are bad

I may have mentioned this before (like a million times so far), but the quality of data that we get from sensors is really bad.

<details markdown=1 class="reminder">
<summary>
Can you remember any of the reasons why sensor data is rubbish?
</summary>

* Sensors can have various types of errors, such as random noise and bias which mean they don't directly relate to the underlying sensed signal. 

* Some sensors only give relative changes in value, or values which whilst they relate to the underlying value are 'unitless', in that they don't directly map to any known unit e.g. for many light sensors, we know they read high when it is bright and low when dark, but cannot directly map this to light related units such as lumens or lux.

* Sensors often don't measure what we're actually interested in, for example we may be interested in human motion, but an infrared motion sensor will also respond to any other moving warm object, including animals or cars.

* It is easy to make mistakes in placement and wiring of sensors or in our code which processes the data.

* Other physical effects may alter the response of sensors, e.g. changes of temperature can change the response curve of many other non-temperature sensors.

</details>



