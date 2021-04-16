---
title: Linear filtering of numerical data
lesson_order: 4
sublesson_order: 4
uses_maths: true
uses_pyodide: true
uses_audio: true
uses_light: true
---

In this section, we look at frequency based linear filtering, a mathematical approach which is used to clean up continous numerical sensor data, i.e. data from sensors which report a range of values, such as our sound and light sensors.

Filtering can be used to clean up data where our desired output is also a continous numerical value, but it can also provide a really useful way to clean up the continuous inputs we use in our thresholding and event detection. In fact, with careful application of linear filters, it is often possible to skip many of the methods used in our previous section on robust event detection, and just apply linear filtering to clean up the data and follow it by a very simple threshold.

<figure markdown=1>
```mermaid
graph TD;

subgraph Linear Filtering Solution
    A[Sensor input]-->B[Linear Filter]
    B --> C[Simple threshold]
    C --> D[Events]
    end

subgraph Previous Solution
    X[Sensor input]-->Y[Complex thresholding <br> algorithm]
    Y --> Z[Events]
    end
```
<figcaption>Linear filtering can support or replace complex thresholding algorithms</figcaption>
</figure>

# Key concept: signal frequency

To understand linear filtering, we need to understand a really key concept, that of frequency in signals. So, sensor signals as we typically see them are *time-domain* signals. This means that we have a value for the signal at a series of known points in time. Another way of representing signals is in the *frequency domain*. You may have seen frequency based representations of audio signals; check out Figure 2 to see one. 

<figure markdown=1>
Click here to play the audio file, and look at the visual representations of it below:
<audio controls>
<source src="{{'/images/twinkle.mp3'|relative_url}}"></source>
</audio>
<table>
<tr>
<td>
<img src="{{'/images/waveform.png'|relative_url}}">
</td>
<td>
<img src="{{'/images/spectrogram.png'|relative_url}}">
</td>
</tr>
</table>
<figcaption>The time-domain waveform (left) makes it clear when audio is loud or quiet, but in the frequency domain representation (right), the pitches of the audio file can also be seen.
</figcaption>
</figure>

If you look at the frequency domain *spectrogram* of the audio file above, you can see that different frequencies in the graph have different meanings, in this case higher parts of the graph refer to higher pitches in the audio file. In the case that multiple pitches are sounding at the same time, we would see multiple pitches on the graph at once, whereas in the time-domain data, we would just see the vibrations pertaining to each pitch overlaid, and the fact of the multiple pitches would be lost. Thus in the time domain, it is hard to understand what is happening with multiple overlaid pitches, whereas in the frequency domain it becomes clear.

Understanding sensor data in terms of frequencies can similarly allow us to understand multiple overlaid physical processes which are all affecting the single value presented by the sensor. 

For example, with the light sensor, the single value we are given can be affected by:
* The time of day (i.e. is it before or after sunset and how high is the sun in the sky )
* The phase and rising of the moon (if it is night time)
* Clouds passing in front of the sun
* Whether the light is turned on or off in the room
* Whether a person is moving around near to the sensor
* Random noise in the sensor circuitry

All these things typically fluctuate at different rates; random noise often changes very quickly, people moving around near the sensor lead to quite quick changes, the light turning on and off leads to immediate step changes, which then alter the ambient light level for long periods of time, and time of day or moon phase change only very slowly. If we consider these in terms of frequencies, we can plot them in order of high to low frequency as can be seen in figure 3:

<figure markdown=1>
<table>
    <tr>
        <th>Frequency</th>
        <th>Timescale</th>
        <th>Elements of signal</th>
    </tr>
    <tr>
        <td>Low</td>
        <td>28 days</td>
        <td>Moon phase</td>
    </tr>
    <tr>
        <td rowspan="3" class="arrowdowncell">
        </td>
        <td>24 hours</td>
        <td>Sunrise state</td>
    </tr>
    <tr>
        <td>Hours, minutes</td>
        <td>Current room artificial light setting, changes in cloud cover</td>
    </tr>
    <tr>
        <td>Seconds</td>
        <td>People moving round or changes in light settings</td>
    </tr>
    <tr>
        <td>High</td>
        <td>Sub seconds</td>
        <td>Random noise</td>
    </tr>

</table>
<figcaption>The signal from a light sensor is affected by a range of different things, which affect the output signal at different frequencies.</figcaption>
</figure>

# Isolating desired frequencies

When we are doing sensor processing, we often want only to know about certain parts of the signal. Figure <span class="nextfig"/> shows an example of a whole day's light sensor data from inside a room with a window to the outside. We can see that at 6:00 someone turns on a light, which makes the room bright, as the daylight gets brighter, the light is turned off, and the light level responds to the sunlight coming in, until 16:00 when the light is turned on again, until 21:00 when the room falls dark. We can also see a number of moments when a person walks past the light sensor, causing a momentary dip in light level. The signal is also affected by a small quantity of random noise. 

{%include figure.html url="lightgraph_24hours.svg" alt="Light sensor readings for 24 hours, showing the effects of switching on lights, changes in sunlight levels, people shadowing the sensor and random noise ." title="A light sensor is affected by a range of different external processes." caption="24 hours of light sensor readings. Click the circles to see interesting points I have highlighted" inline_file="true" %}


So, looking at this dataset, we can consider a range of possible uses for this sensor data. Lets look at two in detail:

1. Firstly, we could use this sensor data to estimate the ambient light level over the day, i.e. the level of light which is falling on the sensor coming from either the room light or from outside. To do this we need to get rid of random noise and also the fluctuations as people walk past the sensor. To do this, we would want to remove the high frequencies from the signal, and focus on the low and mid frequencies.

2. We might also be interested in tracking human behaviour in the room through detecting the events, the sharp, brief dips in light level. To be able to do this easily, we want to ignore the effect of low frequencies in the signal, removing the effect of ambient light, and just tracking the little spikes.

There are a range of ad-hoc ways we could solve these problems, such as by using adaptive thresholds to detect spike events, or simply averaging data over a long time to get the ambient light level. However, a more principled way of doing this is to use a linear filter to do this.

In this course, we will primarily talk about two types of linear filter - **high pass** and **low pass** filters. *High pass* filters take a signal, and return the signal with the low frequency, slow variations in level removed. Low pass filters do the opposite, they return only the slow variations, while supressing the quick high frequency changes in the signal. So, to accomplish task 1 above, we would probably want to use a low pass filter to remove noise and brief spikes, whereas with task 2, we are only interested in short term variation, so we could use a high-pass filter to suppress the slow variations caused by the ambient light level changing.

# Task 1 - Low pass filtering to estimate ambient light level

A low pass filter takes a signal and reduces the level of the high frequencies in that signal. Design of low pass filters can involve complex maths to make the optimum filter for a particular purpose. Filter design is beyond the scope of this course. For this course, we will only really talk about the most simple low-pass filter, the **first order low-pass filter**. This essentially applies a very simple smoothing algorithm to the signal which has the effect of attenuating the high frequencies whilst retaining low frequency fluctuations.

## First order low pass filter definition

The first order low pass filter is defined by the equation below, where $$Y_T$$ is the filter output at time T, and $$X_T$$ is the input signal to the filter. $$\alpha$$(Alpha) is the smoothing factor - as $$\alpha$$ becomes lower, the output of the filter at each time step becomes more stable; if $$\alpha$$ is equal to 1, the filter will always output the initial value. As $$\alpha$$ is set closer to zero, more of the high frequency content remains in the output signal, until at $$\alpha=0$$ the filter outputs a completely unmodified input signal.

$$
Y_T =  \alpha * X_T + (1-\alpha)* Y_{T-1}
$$

As well as considering $$\alpha$$ intuitively as a smoothing factor, we can consider it's relation to two things - the *cutoff frequency* of the filter and its *time constant*. A low pass filter is designed to keep (or *pass*) information in the signal below the *cutoff frequency*, whilst reducing the input of frequencies above the cutoff frequency. This simple filter does this just by smoothing out changes in the signal over time, which brings us to the *time constant*; the time constant is defined as the time taken for a rising edge input from 0 to 1 to cause a rise in filter output to 0.63. If the time constant is higher, the filter has a slower and more smooth response to changes in signal. Cutoff frequency and time constant both map directly to alpha, using the equations below, where $$\Delta_T$$ is the time between samples (in seconds), and $$\alpha$$ is the coefficient in the algorithm. For slightly historical reasons relating to analog electronic implementations of low pass filters the time constant is usally referred to as $$RC$$. In code, we will need to know $$\alpha$$. If we wish to define our filter response in terms of cutoff frequency of time constant, we can do this using the equations in Figure <span class="nextfig"> below.


<figure>
<table>
<tr>
<th> $$\alpha \text{ from parameter}$$</th>
<th>$$\text{Parameter from }\alpha$$</th>
</tr>
<tr>
<td width="50%">
$$
\alpha = \frac{\Delta_T}{RC+\Delta_T}
$$
</td>
<td width="50%">
$$ 
RC = \Delta_T (\frac{1-\alpha}{\alpha})
$$
</td>
</tr>
<tr>
<td>
$$
\alpha = \frac{f_{cutoff}2\pi\Delta_T }{f_{cutoff}2\pi\Delta_T+1}
$$
</td>
<td>
$$
f_{cutoff} = \frac{\alpha}{(1-\alpha)2\pi\Delta_T} 
$$
</td>
</tr>
</table>
<figcaption>These equations allow us to calculate alpha (which we will want in code) from either the time constant or cutoff frequency, which give meaningful units to our filter coefficients</figcaption>
</figure>

# Low pass filter in code

In code, the first order lowpass filter is as simple as: 

```python
filter_out = alpha * sensor_value + (1-alpha)*filter_out
```

In the example code, we will wrap our low pass filter in a little filter class. This basically just stores the filter output value from the previous sample. The reason for encapsulating this in a class is because if you are using multiple sensor values and you want to filter more than one of them, you need to store the output value independently for each filtered sensor. If you use a class, you can just bung in another instance of the class and you are cool, without having to keep track of a load of filter variables.

The basic filtering class looks like this. In the working code below you will see there are comments and some helper functions to allow you to make filters based on time constant or cutoff frequency, but the basic workings of the filter are as simple as the short class below.

```python
class LowPassFilter:
  def __init__(self,alpha):
    self.last_value=0

  def on_value(self,value_in):
    self.last_value=self.alpha * value_in +(1-self.alpha)*self.last_value
    return self.last_value
```

So, here we go, lets write something to apply a low pass filter to a sensor. Here we make a low pass filter class, and then apply it with a time constant of 5 seconds to a sound sensor. This allows us to have a good idea of the general level of sound in a room right now, whilst not jumping around loads because of e.g. people talking or single loud noises. We might further want to know about lower frequencies in the signal, such as when answering the question 'how loud was this room in the last hour'. We could do this just by changing the time constant to be larger.

<script>
makePyodideBox({
    codeString:`
# 5 second time constant for the filter
# try playing with making this smaller or bigger
FILTER_TIME_CONSTANT=5 


import time
import graphs
import sensors
from math import pi 
# we use pi for calculation
# of alpha from cutoff frequency
class LowPassFilter:
    '''
    A class to perform simple first order 
    lowpass filtering on a sensor value

    Methods
    -------
    on_value(value_in)
        Process a new value with the filter and return the old one
    '''
    def __init__(self,alpha):
        self.last_value=None
        self.alpha=alpha


    def on_value(self,value_in):
        # if we haven't seen any value yet,
        # set this as our filter output        
        if self.last_value==None:
            self.last_value=value_in
        # this is the actual filter calculation
        self.last_value=self.alpha * value_in + (1-self.alpha)*self.last_value
        return self.last_value

    # a couple of handy static methods to create
    # filters based on time constant or cutoff frequency
    def make_from_cutoff(cutoff_frequency,time_between_samples):
        ''' Make a low pass filter with this cutoff frequency .
                Parameters:
                    cutoff_frequency: Cutoff frequency in HZ
                    time_between_samples: seconds between samples

                Returns:
                    filter(LowPassFilter): 
                        Low pass filter object
        '''
        fc=cutoff_frequency*time_between_samples*2*pi
        alpha=fc/(fc+1)
        return LowPassFilter(alpha)

    def make_from_time_constant(time_constant,time_between_samples):
        ''' Make a low pass filter with a particular time constant.
                Parameters:
                    time_constant: Time constant in seconds
                    time_between_samples: Seconds between samples

                Returns:
                    filter(LowPassFilter): Low pass filter object
        '''
        alpha=(time_between_samples)/(time_constant+time_between_samples)
        return LowPassFilter(alpha)

graphs.set_style("sound","rgb(0,0,0)",0,1)
graphs.set_style("lowpassed sound","rgb(255,0,0)",0,1,subgraph_y=1)

soundFilter=LowPassFilter.make_from_time_constant(FILTER_TIME_CONSTANT,0.05)
while True:
    sound_level=sensors.sound.get_level()
    sound_lowpassed=soundFilter.on_value(sound_level)
    print(sound_level,sound_lowpassed,sep=',')
    graphs.on_value("sound",sound_level)
    graphs.on_value("lowpassed sound",sound_lowpassed)
    time.sleep(0.05)
`  ,hasConsole:true,hasGraph:true,showCode:true,editable:true,caption:"Light sensor event detection using simple threshold"})
</script>
