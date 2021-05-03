---
title: Testing Sensor Algorithms
uses_pyodide: true
uses_audio: true
uses_accelerometer: true
uses_light: true 
lesson_order: 6
sublesson_order: 1
category_intro_html: "How well does my system work? Did the change I made to my algorithm improve it or make it worse? Is my system better than your system? In this section, we will talk through ways to answer these questions through testing. Do make sure you read this section, it is really important in terms of how you actually build things..."
---
This section is about testing. Why might you want to test your sensor processing systems? 

Really, there are two reasons you need to test things. First thing is the same reason you need to test all software systems, just to make sure that the system works at all. We won't really talk about that here, go and find a software engineering course if you want to learn about that. Second thing, which is what we're mainly talking about here is that sensor systems have specific challenges because sensors are bad and processing sensors is hard (did I mention that yet?). 

In many normal software systems, the focus of testing is to make sure a system functions and to minimize errors. However, because sensors are rubbish and never work perfectly we have a further need for testing sensor algorithms, which is to work out how well the system works, what limitations it has, and what the characteristics of its performance are. Testing can enable us to make targeted improvements, and measure what difference such improvements made to the performance of our sensing, and also can allow us to compare the performance of our sensor systems against those produced by others.

- We will first look at how to capture data outputted by our python scripts in comma separated value (CSV) format, and how to replay these CSV files back into our scripts, so we can run our sensor processing algorithms repeatedly against the same input values.

- Key to understanding how well sensor systems work is the use of test datasets. These are sets of input sensor data where we know what we want the sensor algorithm to output. Typically these consist of input data alongside *ground truth* data, showing the real value of the process or event that the algorithm is trying to interpret. We can use these to capture numerical statistics about how well our system works, so for example if we tweak our algorithm, we know how the tweaks have affected performance. In the first part we will talk about how to capture these ground truth datasets, and how to replay them against our sensor algorithms for testing purposes.

- Then, we will talk about metrics which we might use to explore how well our sensor processing algorithms are working. These can allow us to understand things such as how good our algorithm is overall, how our adjustments to the algorithm alter the balance between false positives and false negatives. We also discuss ways in which we can look at the data to understand why our algorithm fails, and what circumstances it works well in.

- In the final part, we will talk about the processes of testing. This will include discussion of testing (how well an algorithm is working) versus tuning (to check the effects of changes during development), the risks of *overfitting*, where you optimise your algorithm to work well in the specific situation covered by the test data, but it does not generalise to other situations, when and how to use validation datasets, and ways in which you might wish to simplify your testing to account for the limited nature of your prototypes.



