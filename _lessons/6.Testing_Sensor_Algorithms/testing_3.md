---
title: Ground Truth Datasets
uses_pyodide: true
uses_audio: true
uses_accelerometer: true
uses_light: true 
uses_files: true
---
In order to know how well your sensing algorithm is working, you need to know how accurately it is predicting whatever underlying process it is aiming to observe. How we do this is by using *ground truth* dataset. Ground truth data is sensor input data where we also know the correct answer. This allows us to compare our program output with the correct answer.

In most real-world deployments of sensors, we do not have access to ground truth in general, as if we had an easy way of getting the correct answer, then we would use that to get our data in the first place. An exception is when we are using sensor data to predict a future value; for example I recently built a system which used sensor data readings of current and historic water level and rainfall in the area, and used that to build a system which predicts what the river level near my house will be tomorrow. In this kind of data, the sensor dataset itself contains the ground truth, it is just unavailable at the point you actually want the sample.

Anyway, ignoring that exception, you are going to want to have some way of generating ground truth datasets for your sensor data. I'll discuss some ways to do that here. First however, lets talk about data capture...

# Manual - by observation

(and possibly auto-inputting it)

# Manual - by making it happen

# Automatic - by using extra sensors

