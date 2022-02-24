---
title: Thresholding data
lesson_order: 4
sublesson_order: 2
uses_maths: true
uses_pyodide: true
uses_audio: true

---
Thresholding is probably the simplest form of numerical sensor processing. 

Basically, a thresholding function applies a very simple function, which is one if the incoming sensor value is greater than a *threshold* value and zero otherwise. If you like to see things as maths functions, the most basic threshold looks like this:

$$
 f_{threshold}(x) = \begin{cases}
    1 & \text{if } x\geq threshold\\  
    0              & \text{otherwise}
    \end{cases}
$$

Here is an example of this most basic of thresholding:

<script>
makePyodideBox({
    codeString:`
# we use time.sleep for delay
import time    
# load the sensors module
import sensors
import graphs


graphs.set_style("sound","rgb(0,0,0)",0,1024)
graphs.set_style("threshold","rgb(0,255,0)",0,1024)
graphs.set_style("output","rgb(0,0,255)",0,1,subgraph_y=1)
# try changing this threshold level and see what it does 
# to the thresholded output
THRESHOLD_LEVEL=512

while True:
    sound_level=sensors.sound.get_level()
    thresholded=1 if sound_level>THRESHOLD_LEVEL else 0
    graphs.on_value("sound",sound_level)
    graphs.on_value("threshold",THRESHOLD_LEVEL)
    graphs.on_value("output",thresholded)
    time.sleep(0.01)
`  ,hasConsole:true,hasGraph:true,showCode:true,editable:true,caption:"Apply a simple threshold to the sound sensor"})
</script>

<details class="question" markdown=1>
<summary>
Play with this example above and make some noises at different levels. Can you see any problems with this threshold? Click to see two things that don't work well with this kind of simple threshold.
</summary>
* If the value is close to the threshold, the output can jump above and below the threshold, leading the output to jump 0,1,0,1 and back. 
* If we want to use this to detect sensor events, it will only fire if our base 'quiet' level is less than the threshold and our 'loud' level is greater than the threshold.
</details>

# De-bounced Thresholds
As we saw above, when the sensor value is close to the threshold value, sensor noise can cause the threshold to oscillate up and down. These oscillations are sometimes referred to as *bounce*, and ways of fixing them are known as *debouncing* methods. 

{%include figure.html url="/images/threshold_oscillation.svg" alt="When a sensor value is close to the threshold, noise can cause oscillations" title="A simple threshold applied to a noisy signal, showing oscillations which occur when the noise causes the value to go both sides of the threshold" caption="Noisy signal causes threshold to oscillate when the sensor value is close to the threshold." %}

De-bounced thresholds aim to fix this by using two thresholds, one governing up transitions, and the other governing down transitions. If the input value is in between the two thresholds, the output value does not change. In terms of the maths, this looks like:

$$
 f_{up,down}(x,t) = \begin{cases}
    1 & \text{if } x\geq up\\  
    0 & \text{if } x\leq down\\  
    f(t-1) & \text{otherwise}
    \end{cases}
$$

As we can see from the graph below, as long as the typical sensor noise level is lower than the difference between the up and down thresholds, bouncing will no longer occur.

{%include figure.html url="/images/threshold_debounced.svg" alt="When separate up and down thresholds are used, the threshold output no long oscillates with noisy input." title="A pair of up and down thresholds applied to a noisy signal to remove bounce." caption="Debounced thresholds reduce unwanted oscillations in the output." %}

The code below implements a debounced threshold on the sound sensor. Have a play with this and compare it against the previous example.

<script>
makePyodideBox({
    codeString:`
# we use time.sleep for delay
import time    
# load the sensors module
import sensors
import graphs


graphs.set_style("sound","rgb(0,0,0)",0,1024)
graphs.set_style("up","rgb(255,0,0)",0,1024)
graphs.set_style("down","rgb(0,255,0)",0,1024)
graphs.set_style("output","rgb(0,0,255)",0,1,subgraph_y=1)
# try changing this threshold level and see what it does 
# to the thresholded output
THRESHOLD_UP=768
THRESHOLD_DOWN=256

thresholded=0
while True:
    sound_level=sensors.sound.get_level()
    if sound_level>THRESHOLD_UP:
        thresholded=1
    elif sound_level<THRESHOLD_DOWN:
        thresholded=0
    # if it is between the two thresholds, we don't change our output value
    graphs.on_value("sound",sound_level)
    graphs.on_value("up",THRESHOLD_UP)
    graphs.on_value("down",THRESHOLD_DOWN)
    graphs.on_value("output",thresholded)
    time.sleep(0.01)
`  ,hasConsole:true,hasGraph:true,showCode:true,editable:true,caption:"Apply debounced (up/down) thresholds to the sound sensor"})
</script>

# Adaptive thresholds

The second problem with thresholds that we described above, that you need to set the correct value for a threshold, can be partially solved by use of adaptive thresholding. Adaptive thresholding sets the threshold based on some characteristic of the sensor data. For example, we might say that our threshold is equal to twice the average of the last 50 readings of the sensor. Or we might use a threshold based on mean and standard deviation, e.g. threshold = mean(last N readings) + standard deviation (last N readings).

The code below uses a [deque](https://docs.python.org/3.8/library/collections.html), which is short for double ended queue, to store the last 50 sensor readings. A deque is like a list, but it has a fixed maximum length, so if you append more than maxlen items to the end of the deque, the item at the other end drops off. We use this to create a *history buffer* which stores the previous N readings. This is useful for all sorts of things, including for setting adaptive thresholds.

<script>
makePyodideBox({
    codeString:`
# we use time.sleep for delay
import time    
# load the sensors module
import sensors
import graphs
# we use the double ended queue from python collections to store a history buffer
from collections import deque

HISTORY_LEN=500 # five seconds

graphs.set_style("sound","rgb(0,0,0)",0,1024)
graphs.set_style("threshold","rgb(255,0,0)",0,1024)
graphs.set_style("output","rgb(0,0,255)",0,1,subgraph_y=1)
history=deque(maxlen=HISTORY_LEN)

thresholded=0
while True:
    sound_level=sensors.sound.get_level()
    history.append(sound_level)
    # we set our threshold value to be double the mean of the history
    # buffer, plus 100 to ignore noise
    THRESHOLD=2.0*sum(history)/len(history)+100
    THRESHOLD=min(THRESHOLD,968) # set a maximum on threshold to 968
    if sound_level>THRESHOLD:
        thresholded=1
    else:
        thresholded=0
    graphs.on_value("sound",sound_level)
    graphs.on_value("threshold",THRESHOLD)
    graphs.on_value("output",thresholded)
    time.sleep(0.01)
`  ,hasConsole:true,hasGraph:true,showCode:true,editable:true,caption:"Apply an adaptive threshold to the sound sensor value"})
</script>
