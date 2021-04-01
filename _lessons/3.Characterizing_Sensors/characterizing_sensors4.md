---
title: Non-numerical errors
prev: characterizing_sensors3
upnext: index
uses_pyodide: true
uses_light: true
uses_maths: true
uses_audio: true
uses_accelerometer: true
lesson_order: 3
sublesson_order: 4

---
Many sources of error in sensor data are not possible to model as simple numerical deviations from the correct value. In this section we discuss a range of such non-numerical errors.

# Interfering Inputs

Whilst sensors are designed to primarily measure one signal, we often find that the value of other physical quantities can also affect sensor output. As examples of this, the temperature of sensors can affect the way they respond; this is common in simple sensors like light sensors, which change their resistance when the temperature changes.

{%include figure.html url="/images/temperature_interfering.svg" alt="A light dependent resistor changes its resistance based on temperature as well as light." title="As the ambient temperature drops, the resistance of a light sensor drops." caption="An extract from a light sensor datasheet shows how the value of the sensor's resistance changes depending on ambient temperature." %}

Some sensors inherently measure more than one signal - for example if we are using an accelerometer to measure the orientation of a device, when it is still, we can clearly measure the orientation due to the clear measurement of gravitational acceleration. However, if we then move the accelerometer around, this causes further acceleration. Similarly with a sound sensor, all vibrations reaching the sensor are measured; so the signal reaching the sensor may be affected by the general level of background noise as well as by speech or other sounds. 

Check out the accelerometer demo below - 

<script>
makePyodideBox({
    codeString:`
# we use time.sleep for delay
import time    
# load the sensors module
import sensors
import graphs

while True:
    # get xyz values of acceleration
    # can also use sensors.accel.get_magnitude()
    # to get the overall magnitude of acceleration
    (x,y,z)=sensors.accel.get_xyz()
    if abs(x)>abs(y) and abs(x)>abs(z):
        if x>0:
            print("Right side up")
        else:
            print("Left side up")
    elif abs(y)>abs(x) and abs(y)>abs(z):
        if y>0:
            print("Top up")
        else:
            print("Bottom up")
    elif abs(z)>abs(x) and abs(z)>abs(y):
        if z>0:
            print("Front up")
        else:
            print("Back up")
    graphs.on_value("x",x)
    graphs.on_value("y",y)
    graphs.on_value("z",z)
    time.sleep(0.1)
`  ,hasGraph:true,hasConsole:true,showCode:true,editable:true,caption:"Read smartphone accelerometer sensor in python"})
</script>

