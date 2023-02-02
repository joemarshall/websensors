---
title: Types of Machine Learning for Sensor Processing
uses_pyodide: true
uses_audio: true
uses_tensorflow: true
uses_files: true
---
Typical sensor data is a form of *time-series*; i.e. it is a series of data samples taken at successive discrete points in time. Other commonly studied types of time-series data include things like information about stock markets, video data, weather forecasting data, basically anything where data points are spaced out over time.

There are two types of machine learning models that are most-commonly used for time-series data (and hence sensor processing): Convolutional neural networks and recurrent neural networks.

When processing time series data, it is typical to use *sliding-windows*; what this means is that rather than apply machine learning methods to a single sample of data, we instead apply it to a window of data, which includes the current sample and a range of previous samples. We then move along and do the same for another sample. Depending on our application, we may move (slide) the window along by one sample at a time, giving windows which overlap, or by a full window each time. 

Convolutional neural networks 


