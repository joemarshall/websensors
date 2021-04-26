---
title: Combining Sensors and making inferences - Intro
category_intro_html: Each type or placement of sensor has advantages and disadvantages over the range of possible situations we are sensing. By combining two or more sensors it may be possible to get improved results, as each sensor compensates for weaknesses in the other sensors.
---

# Section Summary

We have already looked at a) what sensors are, b) how to make sensor data more usable by filtering. In this section we look at how to make inferences based on one or more sensor data streams, such as:

* Has an event happened (e.g. someone has opened a door, someone has knocked on the door)
* What is the value of a quantity (e.g. how many people do we think are in a room, how ‘busy’ is the room, what shape is the room)
* What is happening to a device (e.g. is it being thrown around, has it been dropped, is it outside or inside)

As I have said repeatedly in previous sections, the important thing here is that what we want to know is different from what sensors report. This is the key thing to understand when we are considering using multiple sensors. Reasons we might wish to use multiple sensors include:

1. Different sensors may have different noise characteristics
2. Sensors may respond to the same thing but have different ranges 
3. Sensors may detect different aspects of the same situation

Once we know we want to use multiple sensors to make inferences about a situation, we can consider how we may combine the data from these sensors. We will discuss multiple ways of doing this including:

1. Simple 'if this-then that' logic
2. Combined Thresholding
3. Applying probabilistic modelling to estimate event probabilities
4. Sensor fusion algorithms
5. Machine learning algorithms

Finally, this section will discuss a set of examples both from my research work, and from projects which students did in previous years.
