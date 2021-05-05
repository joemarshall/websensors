---
title: Sensor testing metrics
uses_pyodide: true
uses_audio: true
uses_accelerometer: true
uses_light: true 
uses_files: true
uses_maths: true
---
In the introduction, we noted that testing is useful for both for internal improvement of your own sensor algorithms, and also to allow you to benchmark them against other people's algorithms.

So how can we compare the performance of a sensor processing algorithm? We can test it. We can use metrics. Metrics are numerical values which allow us to make a comparison as to the performance of an algorithm. 

In fact, we just saw some metrics on the page on ground truth, where we looked at the clap sensing and how much error there was in our sensor algorithm output. Let's look at some different categories of metric:

# Measures of numerical error

Numerical measures of error are particularly useful when you're building something that aims to track the value of some physical quantity, for example if you're building a sensor to track temperature, you would want to know how wrong on average it is, so that you could compare it with other things sensing the same thing. Such measures are also particularly important in machine learning, as many machine learning algorithms essentially use some form of gradient-descent on numerical error measures, aiming to create a model which best minimises the error on given training data.

Numerical error measurements typically take the form of functions which calculate the difference between individual algorithm outputs and ground truth, e.g.

$$ 
error = \sum_0^N{f(Y_{predicted},Y_{true})}
$$

## Mean squared error

The most common example of this is mean squared error (MSE), which uses the function:
$$ 
error = \sum_0^N{\frac{(Y_{predicted}-Y_{true})^2}{N}}
$$

MSE has the advantage that it penalizes algorithms significanty more as they become more wrong, thus aiming to minimize it means your algorithm is more likely to produce results which closely follow the ground truth data. However it is quite sensitive to outliers, in that if a tiny number of points are very wrong, the MSE will be bad, no matter what the typical behaviour.

## Mean absolute deviation
Mean absolute deviation (MAD) aims to avoid problems with outliers, at the expense of not being so strongly focused on remaining close to the correct value.

$$ 
error = \sum_0^N{\frac{|(Y_{predicted}-Y_{true})|}{N}}
$$

## Mean absolute percentage error 

$$ 
error = 100\%*\sum_0^N{\frac{|(Y_{predicted}-Y_{true})|}{Y_{true}}}
$$

This is useful where the absolute percentages of quantities are meaningful, e.g. if you are calculating how much liquid is in a container or something similar. It means that as the quantities are smaller, you want higher precision. This is particularly useful in datasets with many orders of magnitude, for example in price datasets, if someone is estimating a price of a roughly £200,000 house, they may be interested in how good the estimate is $$\pm$$£1000, whereas if you are estimating the cost of a cup of coffee, the desired accuracy may be more on the scale of $$\pm$$£0.10

## Mean squared log error

Rather than use a percentage error, another way to calculate error in datasets with high magnitude differences is to take a logarithm of the values before calculating error. Taking account of the fact that the logarithm function changes faster for smaller values, this means that errors are penalised more for smaller predicted values. This can be done with any of the previous functions, for example the mean squared log error (MSLE) looks like this:

$$ 
error = \sum_0^N{\frac{(log(Y_{predicted}+1)-log(Y_{true}+1))^2}{N}}
$$

n.b. we take +1 in the error function because we make the assumption that values are positive and start at zero. If that is not the case, another constant may be required.

## Non point numerical error estimation

All the functions above use point based error measures which compare based on single point comparisons between algorithm prediction and ground truth; these are useful for many purposes, however they have real problems with time-series data when delays occur. For example, consider the two graphs below which show a predicted and ground truth measurement. You can see that the sensor based prediction is pretty much correct, but the output is delayed in time by a tiny amount, meaning that the spikes misalign and are missed, causing high error levels, greater than if the sensor algorithm constantly outputted zero. This means that for such spiky data we may need to look at different measures of error.

{%include figure.html url="/images/sensors_timeoffset.svg" alt="A spiky sensor algorithm output which is offset in time from the ground truth may cause high error values" title="Error with a spiky output can be high when the sensor output is delayed" caption="If the ground truth is offset in time compared to the sensor algorithm prediction, this can cause high errors in single point error calculations" %}

There are several ways to do that; one is to discretize the data into *events*, through thresholding or similar, and apply the event based measures described in the next section. Another is to aim to estimate delay and correct the data for that delay before considering it. The most general way is to use a numerical metric which uses a wider section of the ground truth dataset to compare each point against. Completely generally, this may be described as a function taking the complete predicted and ground truth datasets, something like this:

$$ 
error = f(Y_{predicted_1},Y_{predicted_2}...,Y_{real_1},Y_{real_2})
$$

Or more typically it is done using *windowing*, where a range of values around the current point are considered. Most often the points considered are just those before the point, because that allows us to continually estimate error during prediction, which for a given window size W makes it look like this:

$$
W = \text{window size} 
$$

$$
error= \sum_{T=0}^N{f(Y_{predicted_T},Y_{predicted_{T-1}}...Y_{predicted_{T-W}},Y_{real_T},...Y_{real_{T-W}})}
$$

However if we have full ground truth and predicted datasets, we may choose to extend the window to points outside the current value.

As an example of an error, we can consider the following error which calculates the minimum squared distance to any of the previous points in the error window W. This error is very resistant to delays that are smaller than W, although because of the minimum in the calculation, it can be somewhat spiky in its output. As written here it also treats the X value as a quantity equal to the Y value, i.e. 1 step difference in X is the same as 1 step in Y; in practice, some scaling may be required of either value to adjust for the importance we place on reduced time delay versus reduced point error.

$$
sqdist(Y_{predicted},X_{offset},Y_{real}) = {X_{offset}}^2 + (Y_{predicted}-Y_{real})^2
$$

$$
error = \sum_{T=0}^N{\min_{X=0...W}{sqdist(Y_{predicted_T},X,Y_{real_{T-X}})}}
$$

# Event errors

In many cases, what we are looking for with our sensor data processing is not a continuous value, but is instead an event. In this case, we need different metrics to the continuous numerical error measures described above. 

Event error measurements are basically ways of describing three things; rates of *false positives*, *false negatives* and *latency*. We've briefly mentioned these before, but just in case, here are some definitions:

* **False positives**: If our sensor algorithm reports that an event has occurred, this is a false positive, sometimes called a Type I error (type one error).
* **False negative**: If an event occurs but it is not reported by our sensor algorithm, this is a **false negative** or Type II error.
* **Latency**: If an event is sensed correctly, but there is a delay in response of our algorithm, this is called the latency. Most sensing systems have some level of inherent latency due to delays and buffers in the circuitry and software that converts analog electrical signals to digital and transfers them to the sensing software.

## Measures of false positives and false negatives

We can measure false positives and false negatives by considering sensor detected events against ground truth data which shows when real events occurred. So for example if we have ground truth data that shows that real events occurred at approximately 5 second intervals, on exactly the 5th second in the data, then we can compare how many of these events were sensed, how many were not (false negatives), and how many extra events were sensed (false positives).

We can use these to estimate the *sensitivity* and *specificity*, which are just different names for the observed true positive rate and true negative rate of the event sensing algorithm. These were defined in the combining sensors section, but we'll briefly recap here:

$$
\begin{array}{ll}
\text{True positive rate (sensitivity)}\\
 = \frac{|\text{True positives}|}{|\text{True positives}+\text{False positives}|} \\
 \\
\text{True negative rate(specificity)}\\
\\
  = \frac{|\text{True negatives}|}{|\text{True negatives}+\text{False negatives}|} \\
 \\
\end{array}
$$

We can estimate these just by counting the number of true positives and true negatives in our sensor results. As a minimum, when testing an event based sensor algorithm, we need to know this. If you're submitting coursework relating to an event-detecting sensor algorithm to me, please do put these statistics in.

## Base rates

In general these statistics do not tell the whole story; what is missing is the *base rate* of how likely events are to occur. Without this we cannot tell how likely it is that any given event will be sensed. As an example, take a medical test which tests for a common disease which is found in exactly 2 in 100 people. Let's say we have a great test, with a 99.5% sensitivity, and a 95% specificity. So in our 100 people, the 99.5% sensitivity means that typically both of the 2 people have a positive result. The 95% specificity means that of the other 98, approximately 3 will show a false positive. If we look at this statistic, due to the probability of an event occurring being low, if a random person is chosen out of the group who test positive, there's only a 40% chance that they actually have the disease. N.b. if anyone is interested in this kind of reasoning, it is well worth reading [Gigerenzer (2003)](#GIG2003), for a very accessible but in depth look at it. If you do this kind of analysis, you have to estimate or calculate somehow the base rate for the event which you are sensing.

When dealing with continuous sensor data, as we are here, this kind of bayesian analysis becomes more complicated, because each sample is not necessarily independent. One way to apply this kind of logic is to split the sensor data into discrete chunks and make the (possibly dubious) assumption that each are pretty much independent. Or record a set of separate chunks of sensor data into files which contain either event or no event. Alternatively, you can simply assume independence between samples and make it clear that you're making that assumption.

With our exercise sensing systems it may be hard to apply this kind of logic however, because exercise is by definition an artificial activity for which the base rate of exercise will be strongly driven by what the person is doing, e.g. if someone starts an app that counts sit-ups, it is highly likely they will do some sit-ups soon.

# Measuring event latency

Event latency can be measured by applying error metric functions to the difference in time between real event and sensed event. e.g.

$$ latencyError = f(T_{real},T_{sensed})$$

This can use any single point error, for example we may use the mean squared error function for latency, or just the mean latency.

There is one complication, which is that as latency increases, it may become increasingly hard to tell the difference between a sensed event with a delay, and a false positive that came after a false negative. It may be appropriate to apply a threshold maximum distance in time for two events to be considered the same. Telling the differences here will require observation of the sensor data, observing things such as a) is there a constant level of latency in the sensor data which can be corrected for, b) is it plausible from the raw sensor data that the event sensed relates to the real event. 

Practically, one key thing when we are measuring latency is to have an accurate measure of when the real event occurred. This may not always be the case. The question below asks you to consider that...

<details class="question">
<summary>
In the previous section on capturing ground truth, we had a script which told you when it expected you to do the event. Why might the ground truth not be accurate here?
</summary>
The script itself adds some potential latency; rather than an event occurring when the script thinks it should happen, it instead is delayed by the time it takes you to see or hear the instruction and then to clap. This adds a whole world of latency into the event sensing. 
</details>

One good way of getting time accuracy relating to latency is to video everything, so that you can see both the input and the output from the script. This lets you see latency at an accuracy dependent on the frame rate of your camera.

# References

<a id="GIG2003"></a>Gigerenzer, Gerd. Reckoning with risk: learning to live with uncertainty. Penguin UK, 2003.