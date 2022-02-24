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

Check out the accelerometer demo below on your phone (scan the QR code on the left to go straight there). If the phone is still, it should output which side of the phone is pointing upwards. See what happens when you move the phone around. 

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


# Event sensing errors

Some sensors, such as motion sensors and buttons are used to detect whether an event has happened. This leads to a class of errors relating to whether or not events have happened. For example if a person walks past a motion sensor and it doesn't trigger, this is a **false negative** error, or if it triggers based on a change in temperature in the area, when no one is about, this is a **false positive** error. We also see errors in sensing of quantities of events, for example if, as on a keyboard key, we have a button which closes a switch when pressed, and we wish to count how many times the button is pressed, we can get an error called **bounce**, where during the transition between not-pressed and pressed, the electrical signal fluctuates which causes multiple zeros and ones to be measured, which may cause multiple events to be fired when the button has only been pressed once. 

In the graph below, we can see an example of bounce occurring on a button. We have a button which when pressed causes the voltage of the sensor input to rise to 1V. However, whilst conceptually this is a digital or on/off sensing, in practice, the underlying process is analog, which means that (a) that rise is not instantaneous, and (b) there may be noise in the signal. If during the ramp up of the voltage, noisy voltage measurements cause the signal to jump both sides of 0.5v, in a system which senses less than 0.5v as a 0 and greater than 0.5v as a 1, we may experience fluctuations during the press and release.

{%include figure.html url="/images/bounce.svg" alt="Bounce occurring during press and release of a button " title="Bounce on a button" caption="The noisy electrical signal on this button causes it to jump either side of 0.5v during the press and release. The output from the button is 'thresholded' to a digital signal of 1 if the voltage is >0.5 and 0 otherwise, meaning that this noise can cause bounce, where several push events are sensed." %}

Another interesting event sensing error occurs with beam based sensors such as ultrasonic rangefinders and radars - these bounce a signal off things in the environment and measure when the signal returns. These can be subject to **multipath errors**, where rather than bouncing directly back, the signal bounces off a reflective surface before returning, and also to reflection errors where the signal does not bounce back at all. Multipath errors are also a problem in GPS satellite systems, where incoming signals are bounced off a building or elements of the scenery causing them to be received later than the direct line between satellite and receiver; this is a key cause of noise in GPS position sensing.

{%include figure.html url="/images/multipath.svg" alt="Multipath errors occur when a beam from a sensor bounces off surfaces before returning to the sensor." title="Multipath errors" caption="When a sensor beam bounces off an obstacle at an angle, the return signal can be delayed or lost which causes sensor errors." %}


# User error

Another key cause of poor quality sensor data is user or operator error. Errors in deploying and using sensors can cause many practical problems no matter the quality of the underlying sensor.

<details  class="question" markdown=1>
<summary>
Can you think of some common user errors?
</summary>
From supervising MRT courseworks  for several years, we have seen a wide range of sensor errors caused by user errors. Examples include:

* Pointing directional sensors the wrong way.
* Making noises while testing using a sound sensor which caused it to think the room was very noisy.
* Shadowing a light sensor during development.
* Mounting a PIR next to the development computer so that it fired all the time during development.
* Mounting a room temperature sensor right next to an air conditioning outlet (n.b. that one was actually me, and it caused some very odd sensor readings.)
* Bugs in code (very common).

# Coming up

This section has been all about how sensors are terrible. In the next section we will discuss a range of ways to filter and process sensor data in order to achieve better data quality and to enable us to better respond to the physical world in our sensor based systems.