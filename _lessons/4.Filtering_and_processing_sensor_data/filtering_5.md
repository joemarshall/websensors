---
title: Non-linear filter awesomeness
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

{%include figure.html url="median_filter.svg" alt="Median filter versus low-pass filter." caption="Median filter versus low-pass filter. Click the circles to see interesting points I have highlighted" inline_file="true" %}


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
        return median
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
`  ,hasConsole:true,hasGraph:true,showCode:true,editable:true,caption:"Comparing median and low-pass filter."})
</script>

# Block averaging

All the filters we have looked at so far take in one value, and output a single value in return. Block averaging is different. Instead of taking an average over a sliding history block, when we block average, we read in a number of samples, take an average over that block (mean or median), then output a single value. This kind of averaging can be a useful way to turn a large amount of sensor data into a more maneagable, smaller dataset. It is widely used in machine learning (along with block maximum and block minimums).

Here is what block averaging looks like in our filters module. Note how the value functions return None unless the block is full.

``` python
class BlockMeanFilter:
    def __init__(self,block_size):
        self.history=[]
        self.block_size=block_size

    def on_value(self,new_value):        
        self.history.append(new_value)
        if len(self.history)==self.block_size:
            output=sum(self.history)/len(self.history)
            self.history=[]
            return output
        return None

class BlockMedianFilter:
    def __init__(self,block_size):
        self.history=[]
        self.block_size=block_size

    def on_value(self,new_value):        
        self.history.append(new_value)
        if len(self.history)==self.block_size:
            self.history.sort()
            output=self.history[len(self.history)//2]
            self.history=[]
            return output
        return None

```

Check out the example below showing block based filtering of sound (median, mean and maximum). These kind of filters can be really useful if you want to do something like 'detect the amount of noise in each minute of the day'.

<script>
makePyodideBox({
    codeString:`

SAMPLE_TIME = 0.01 # sample 100 times a second
BLOCK_SIZE = 20 # 1/5 second / 20 samples median filter size

import graphs, sensors,time
# The filters module contains median filter
import filters
graphs.set_style("sound","rgb(0,0,0)",0,1)
graphs.set_style("block mean","rgb(255,0,0)",0,1,subgraph_x=0,subgraph_y=1)
graphs.set_style("block max","rgb(0,255,0)",0,1,subgraph_x=1,subgraph_y=0)
graphs.set_style("block median","rgb(0,0,255)",0,1,subgraph_x=1,subgraph_y=1)

meanFilter=filters.BlockMeanFilter(block_size=BLOCK_SIZE)
medFilter=filters.BlockMedianFilter(block_size=BLOCK_SIZE)
maxFilter=filters.BlockMaxFilter(block_size=BLOCK_SIZE)
while True:
    sound_level=sensors.sound.get_level()
    meanVal=meanFilter.on_value(sound_level)
    medVal=medFilter.on_value(sound_level)
    maxVal=maxFilter.on_value(sound_level)
    # add values to the graphs - n.b. the graph.on_value ignores
    # any None values, so they won't move the graph along
    graphs.on_value("sound",sound_level)
    graphs.on_value("block mean",meanVal)
    graphs.on_value("block median",medVal)
    graphs.on_value("block max",maxVal)
    time.sleep(SAMPLE_TIME)
`  ,hasConsole:true,hasGraph:true,showCode:true,editable:true,caption:"Comparing median and low-pass filter."})
</script>


# Memory check
<details class="question" markdown=1>
<summary>What are the advantages and disadvantages of median filtering against low-pass filtering</summary>

Our simple low pass filter is very simple to implement and extremely efficient in terms of memory and performance. It can be used to smooth out everything in a signal, including step changes in the signal. It is however badly affected by large outliers in the data, and loses information when the underlying data changes quickly.

The median filter has advantages in that it is less affected by outliers, and it maintains step changes in the data. It is also often possible to use a smaller delay with median filter, which reduces delay in response of our sensor algorithms.

</details>

<details class="question" markdown=1>
<summary>What is different about our block-based filters to all the previous filters?</summary>
In previous filters that we have seen, each sample of input data leads to one sample of output data.

In the block-based filters, for a given block-size, we output one sample, so the number of output samples is smaller by a factor of blocksize i.e. $$samples_{output}=\frac{samples_{input}}{blocksize}$$ .
</details>
