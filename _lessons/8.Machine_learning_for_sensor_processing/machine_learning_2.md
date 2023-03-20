---
title: Types of Machine Learning for Sensor Processing
uses_pyodide: true
uses_audio: true
uses_tensorflow: true
uses_files: true
---

# Pre-processing sensor data 

Typical sensor data is a form of *time-series*; i.e. it is a series of data samples taken at successive discrete points in time. Other commonly studied types of time-series data include things like information about stock markets, video data, weather forecasting data, basically anything where data points are spaced out over time.

When pre=processing time series data, it is typical to use *sliding-windows*; what this means is that rather than apply machine learning methods to a single sample of data, we instead apply it to a window of data, which includes the current sample and a range of previous samples. We then move along and do the same for another sample. Depending on our application, we may move (slide) the window along by one sample at a time, giving windows which overlap, or by a full window each time. 

# Typical models used for sensor data processing

There are two types of machine learning models that are most-commonly used for time-series data (and hence sensor processing): Convolutional neural networks and recurrent neural networks.

## Convolutional neural networks 

A Convolutional neural network is based around a 'convolution' operation, uses a filter matrix of much smaller dimensions than the input matrix. In windowed time series data, the input matrix is of dimensions (Window size x Sensor channels), and the convolution filter will typically be something with dimensions such as (5,Sensor channels). The same filter is matrix is applied (by multiplication) across all points in the input matrix, and the weighting of the different values in the filter are trained against a ground truth dataset. Practically this makes use of the fact that short term features at one time point in the dataset can typically be modelled as the same at different time points. By applying these convolutions at multiple scales, both long and short term features of the input data can be identified. These networks can be extremely powerful while not using too much processor power to apply the trained network. They are limited by the length of the input window as to how long term an event they can be influenced by, as anything outside the input window does not affect their results.


## Recurrent Neural Networks

A recurrent neural network is a neural network in which the output of the network for one timestep depends on the previous timestep (which in turn depends on the previous timestep and so on). Such networks in theory allow the modelling of time series data of infinite length, as every step depends on all prior steps. In practice they can be extremely capable at modelling time series datasets. 

# What we can get from the machine learning data

Machine learning algorithms typically allow us to interpret sensor data in one of two ways - classifiers, which use sensor data to identify which of a set of discrete outputs are more or less probable, and regression models, which use sensor data to identify some kind of numerical output value. Both may use similar internal network layouts, but with different processing of the outputs at the end of the network.

# Classification

In a classification model, the output of the model is passed through a *softmax* function, which converts it into a probability distribution which maps to the probability that each of a fixed set of output classifications is true. For example if we want to sense whether anyone is in a room, we may use a two class or binary classifier, where the first probability is the probability that no-one is in the room, and the second is the probability that someone is in the room. We apply the machine learning model, and output as our result the classification with the greatest probability.

# Regression

In a regression model, the output of the model is not converted to a probability, rather it is mapped directly to a numerical value which we are using our sensor data to estimate. For example if we are using sensor data to estimate how fast a sensor is moving , we may use a regression model which outputs the distance the sensor has been moved in the last minute (or second, or hour, depending on what time scale we're interested in)