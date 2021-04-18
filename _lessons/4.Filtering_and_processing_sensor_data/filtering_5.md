---
title: Some non-linear filtering things
lesson_order: 4
sublesson_order: 5
uses_maths: true
uses_pyodide: true
uses_audio: true
uses_light: true
---
A simple linear filter takes one or more previous values of input, along with one or more previous values of the filter output, and applies a linear function to generate the output value. For example, we saw the first-order low-pass filter written as:
$$
Y_T =  \alpha * X_T + (1-\alpha)* Y_{T-1}
$$

The great thing about these filters is that they are extremely simple and efficient to implement, and require minimal storage space. However, as we saw, they are subject to limitations, such as the increasingly large delay as your low-pass filter frequency is reduced.

In this section we discuss a couple of other filtering methods you should be aware of. These increase the complexity in terms of space or algorithm complexity, whilst aiming to reduce some of the limitations of simple linear filters.

# Median filter

A median filter is a non-linear smoothing method used to remove high frequency variation from data. It is typically used in situations where a low-pass filter would otherwise be used. The equation of a median filter is very simple. It has a single parameter of blocksize. At time $$T$$, the output $$Y_T$$ is defined based on input values $$X_T$$, and block-size $$N$$ by the equation:

$$
Y_T = median_{K=0}^{k=N}X_{T-K}
$$

Basically, all a median filter does is remember the last N values, and output the median of those values. Why is that useful? Two reasons: outliers in data, maintaining step-response and reduced / fixed delay. 

Outliers are values in data which are far outside the general trend of the data. For example if we are measuring light and want only the general ambient light level, we can consider things like people shadowing the light sensor as outliers; they are big changes in the data which do not represent the actual underlying trend we are aiming to sense. With a linear filter, even if our time constant is long enough to reduce the effect of these they are never perfectly removed from the data, and their effect is worse if they are bigger in value; the linear filter just reduces their effect. The median filter in contrast will completely remove outliers if they occur for less than 1/2 of the time in the last N values.

Step response of a filter is what happens to the output data when presented with an input which does a sharp step. In a low-pass filter, all steps are smoothed out. In contrast, with a median filter, steps are simply delayed a bit. This is a useful property if we want to high-pass filter afterwards to detect such steps, whilst still reducing the effects of outliers and noise.

Because of the limited effects of outliers, in practice a median filter often can effectively filter data with a far smaller buffer than the time constant of the simple linear filters we are using. This can reduce delay by quite a lot. In addition to this, an advantage of the median filter is that the response delay is fixed, in that for a simple step change in value, the filter responds at N/2 values, and we know for sure than any values further back in time than N samples do not affect the output at all. This fixed property means we can make guarantees about how fast our median filter based system will respond regardless of the input data.

## Median filter in code

The class below does a simple median filter. Using the 'deque' from collections to store a history of the last N values, it sorts the history deque and takes the middle value to do the median (this is not the most efficient median algorithm, but it is simple to understand and good enough for most sensor data processing).

```python
from collections import deque
class MedianFilter:
    def __init__(self,block_size):
        self.history=deque(maxlen=block_size)

    def on_value(self,new_value):
        self.history.append(new_value)
        ordered=sorted(self.history)
        orderedPos=int(len(ordered/2))
        median=ordered[orderedPos]
```

As before, the MedianFilter class is in my filters module, so you don't need to copy it in every time. Let us stick this into a bit of light-sensor code, so you can see what it looks like in comparison to the response of a low-pass filter with a time constant chosen to be equal to the length of the median filter.

Play with this code, see what happens to the two sensor values if you just quickly change the light value. Watch what happens when you make a step change by holding your finger over the camera lens. See if you can see how the response delay is different, and how outliers are removed.

<script>
makePyodideBox({
    codeString:`
SAMPLE_TIME = 0.05 # sample 20 times a second
BLOCK_SIZE = 20 # 1 second / 20 samples median filter size
# set low pass filter to match median filter
FILTER_TIME_CONSTANT=BLOCK_SIZE*SAMPLE_TIME

import graphs, sensors,time
# The filters module contains median filter
import filters
graphs.set_style("light","rgb(0,0,0)",0,1)
graphs.set_style("lowpassed light","rgb(255,0,0)",0,1,subgraph_y=1)
graphs.set_style("median light","rgb(0,255,0)",0,1,subgraph_y=2)

lpFilter=filters.LowPassFilter.make_from_time_constant(FILTER_TIME_CONSTANT,SAMPLE_TIME)
medFilter=filters.MedianFilter(block_size=BLOCK_SIZE)
while True:
    light_level=sensors.light.get_level()
    light_lowpassed=lpFilter.on_value(light_level)
    light_median=medFilter.on_value(light_level)
    graphs.on_value("light",light_level)
    graphs.on_value("lowpassed light",light_lowpassed)
    graphs.on_value("median light",light_median)
    time.sleep(SAMPLE_TIME)
`  ,hasConsole:true,hasGraph:true,showCode:true,editable:true,caption:"Low-pass filter causes delay - try 'turning on and off the light' by covering the light sensor and see how long this takes to detect the changes in light status."})
</script>


# Block averaging