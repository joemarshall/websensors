---
title: Characterizing Sensors - Non-numerical errors
prev: characterizing_sensors3
upnext: index
uses_pyodide: true
uses_light: true
uses_maths: true
uses_audio: true
---
Many sources of error in sensor data are not possible to model as simple numerical deviations from the correct value. In this section we discuss a range of such non-numerical errors.

# Interfering Inputs

Whilst sensors are designed to primarily measure one signal, we often find that the value of other physical quantities can also affect sensor output. As examples of this, the temperature of sensors can affect the way they respond; this is common in simple sensors like light sensors, which change their resistance when the temperature changes.

{%include figure.html url="/images/temperature_interfering.svg" alt="A light dependent resistor changes its resistance based on temperature as well as light." title="As the ambient temperature drops, the resistance of a light sensor drops." caption="An extract from a light sensor datasheet shows how the value of the sensor's resistance changes depending on ambient temperature." %}

Some sensors inherently measure more than one signal - for example if we are using an accelerometer to measure the orientation of a device, when it is still, we can clearly measure the orientation due to the clear measurement of gravitational acceleration. However, if we then move the accelerometer around, this causes further acceleration. Similarly with a sound sensor, all vibrations reaching the sensor are measured; so the signal reaching the sensor may be affected by the general level of background noise as well as by speech or other sounds. 

## TODO: demo with accelerometer

