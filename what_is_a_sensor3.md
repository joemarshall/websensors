# What is a sensor (3)
## Why are sensors complicated?

So, why do you need to learn about sensors. Don't they just work? Can't you just take a sensor and use whatever it outputs, and there isn't really a need for a course in it?

In fact, the answer to the question is that sensors aren't complicated... And that is actually the problem...

Let's go back to the definition of a sensor:

> A device that receives a stimulus and responds with an electrical signal [McGrath & Scanaill 2014](#mands)

There are two things here:

## Sensor response is not a perfect representation of the stimulus

A sensor **responds** to a stimulus. This response does not enable us to perfectly know what the state of the stimulus is. For example a temperature sensor may show a value of 12.1 degrees C, but depending on the quality of the sensor it may be for example 11 or 13 degrees C in reality. A sound sensor may not respond to sounds that are too loud or too quiet. A motion sensor provides an idea that some kind of motion is happening in the object, but very limited information as to how much motion is occurring, or what it is that is moving. All sensors may have errors or noise which mask the effect of the stimulus on the measured value.

TODO: noisy sound sensor goes here

Check out the example here of a sound level sensor which uses your webcam or computer microphone assuming you have one. If you don't have one, then plug one it, or find this page on your phone. Click to enable it, and try making some noises. You should see it responding to the sound, but think about how this is responding by looking at the questions below. Have a play and see what you think...:

- Does this give a good measurement of the level of the sound?
- If you wanted to measure loud banging noises or claps, would this data be useful?
- If you wanted to measure the overall sound level in the room, i.e. how noisy is this room right now, would this value be useful?
- Make a continuous sound, does the sound meter stay level?
- Make a really quiet sound, can you see it?
- Make a really loud sound right near the microphone, what happens?

In the second section of these exercises, we will look at how to process and clean up data from individual sensors to get a better idea of the aspects of the sensed stimulus which we are interested in. 

## Sensors don't usually measure what we want to know

Try and answer the questions below before you click them out:

A PIR motion sensor is a sensor which is used to make lights turn on automatically or trigger alarms based on when there is human motion in the area covered by the sensor.
<details>
<summary>What does a PIR motion sensor measure?</summary>

<b>Did you say 'motion', or 'human motion', or 'people moving'?</b>

This is what we want to know from a motion sensor, but in reality, all a PIR motion sensor measures is infrared radiation hitting two parts of the sensor. This responds to heat emitted by people or animals moving in the view of the sensor; when the difference in value between the two parts of the sensor changes, the motion sensor outputs a value to notify us that there is motion in the area of the sensor.

<b> In practice motion sensors don't always respond as we wish - for example:</b>

1) Sensors targeted at detecting humans, such as security lights, are often triggered by animals, passing cars with warm engines or other changes in emitted heat that occur in the area of the sensor.
2) Changes in temperature due to weather conditions may cause the sensor to trigger.
3) It is possible to use insulating material or shields between a person and the sensor to stop a sensor firing. 
4) If someone is not emitting sufficient heat due to extremely cold weather and associated clothing, or the temperature is very similar to human body temperature, the sensor range is diminished.
5) The sensor has no idea of identity, so security alarms can't tell the difference between someone who is meant to be there and an unwanted intruder. This can cause false alarms.
---
</details>

A mobile phone contains a sensor called an accelerometer. This is used for example to detect which way up the phone is so that the screen can rotate as you turn the phone between landscape and portrait. 

<details>
<summary>Do you know what an accelerometer measures?</summary>

<b>Not motion or acceleration</b>

An accelerometer does not measure either motion of the device or how it is oriented. In fact, an accelerometer measures the bending of tiny weighted springs inside the sensor chip. These respond to acceleration forces on the device, including those caused by gravity. Because of this gravitational force effect, accelerometers can be used to understand which way is down relative to the phone's current orientation. This means that when the phone is still, an accelerometer can be used to detect whether the phone is being held in landscape or portrait orientation and to rotate the phone display accordingly.

<b> What goes wrong with orientation sensing </b>

We want the phone display to orient such that it is the way up that the person requires, i.e. so they can see and read the screen naturally. Doing this with a simple sensor like an accelerometer means that:
1) If the phone is jogged around, e.g. by someone running with their phone out, the accelerations due to this motion may cause the displayed image to rotate even though the phone is still in the original orientation.
2) If a person lies down in such a way that their phone is angled somewhere between the two trigger angles, the phone may switch from one to another and back irritatingly.
3) Phones don't sense orientation correctly in freefall or in space.
4) If content on the display is wrongly oriented, it is impossible to correct for it. For example if a video is taken sideways, when you tilt the screen to correct for it, the video then reorients to still be sideways.
</details>

## Summary

Why are sensors hard? Look at the two questions below for the answers:

<details>
<summary>
What do we want to know when we use sensors?
</summary>
Most of the time when we use a sensor, we want to infer something about the state of the world, or what is happening in it. For example with a motion sensor, we may want to know if there is someone unwanted within our building. With an accelerometer, we may want to know how a device is being held, or how it is being moved.
</details>

<details>
<summary>
What do sensors give us?
</summary>
Sensors give us relatively simple measurements of physical quantities, which may be of varying levels of accuracy. There may be some interpretation placed on top of this, but fundamentally, whilst what we ideally want is to have a sensor that tells us what we want to know, what we typically have is a sensor or sensors that respond to the physical state of the world, and we must use that to infer the underlying state that we are interested in.
</details>

## References

1. <a id="mands"></a>McGrath M.J., Scanaill C.N. (2013) Sensing and Sensor Fundamentals. In: Sensor Technologies. Apress, Berkeley, CA. https://doi.org/10.1007/978-1-4302-6014-1_2

