---
title: Some sensor processing using machine learning
uses_pyodide: true
uses_audio: true
uses_tensorflow: true
uses_files: true
---
This section assumes you know about machine learning already. If you don't, there are a bunch of concepts which you may find hard to grasp, particularly within the colab notebook. Check out the tutorials on the previous page if you want to know the deal about tensorflow and machine learning. Specifically here, the models I'm building are *supervised* learning models, trained with ground truth data, which use convolutional neural network models to process time-series data.

In this page I will discuss a couple of examples of machine learning. For executing the machine learning models, you will use the tflite interpreter built into the websensors platform or installed on the raspberry Pis in the lab. To train the models, we will use [Google Colaboratory](https://colab.research.google.com/?utm_source=scs-index).This is a platform that allows you to run python scripts from a 'notebook' on the web. These scripts execute remotely on a virtual machine owned by google, which has a full desktop installation of python, with tensorflow and many other useful libraries pre-installed. This allows you to train simple models at reasonable speeds.


# Classifier example - knock knock lock

Knock-knock lock is a lock which uses sound to sense knocking sounds. It will open if you knock in a particular pattern. For example you might use the [shave and a haircut pattern](https://en.wikipedia.org/wiki/Shave_and_a_Haircut) which looks like this (where * is a knock and - is a pause)


```
*-***-*---*-*
```

This is an example of using a machine learning algorithm to create a simple classifier, telling us if a knock pattern is either correct, or not correct.

So, first things first, lets create some training data. For this we need to record data from the sound sensor, along with some ground truth as to whether what we are hearing is the correct or the incorrect knock pattern.

For simplicity, I do this by recording two csv files using the code below. Each one contains a bunch of knock patterns, separated by silence of at least 1 second. In one file, the knock patterns are all good knocks (I use shave and a haircut). In the other file, the knock patterns are all different knocks.

I capture these using the script below

<script>
makePyodideBox({
    codeString:`
import sensors
import time
# for raspberry pi, we put the sound sensor on pin A0
sensors.set_pins({"sound":0})

RECORDING_TYPE_GAP=0
RECORDING_TYPE_GOOD=1
RECORDING_TYPE_BAD=2

# set this to good or bad before you run the script
RECORDING_TYPE = RECORDING_TYPE_GOOD
# threshold between silence and start of a knock pattern - this may need to be different if you're on raspberry pi
SILENCE_LEVEL=128

ground_truth=0
last_loud_time=None
print("time","sound level","ground truth",sep=',')
while True:
    snd_level=sensors.sound.get_level()
    cur_time=time.time()
    if snd_level>SILENCE_LEVEL:
        last_loud_time=cur_time
        if ground_truth==0:
            # a noise, this is the start of a knock
            ground_truth=RECORDING_TYPE
    if ground_truth!=0 and snd_level<SILENCE_LEVEL:
        # silence for more than one second is the end of a pattern
        if cur_time-last_loud_time>1:
            ground_truth=0
    print(cur_time,snd_level,ground_truth,sep=',')
    time.sleep(0.01) # 100th of a second
`  ,hasConsole:true,hasGraph:true,showCode:true,editable:true,showFileButtons:true,caption:"Capture ground truth datasets using this script"})
</script>

Once you've captured some ground truth data, you can go to Google Colaboratory to train a model on the full copy of python there. An example of how to do this in the [Colab notebook](https://colab.research.google.com/github/joemarshall/websensors/blob/main/assets/python/KnockLock.ipynb). Once you've trained a model, assuming it worked okay, you should get an output file which is a .tflite file. This will work in the cut-down version of tensorflow which is installed on both the Raspberry Pis and on the websensor platform.

You can run the saved model (the .tflite file) in python using the tflite_runtime module. To do this I need to upload the tflite file to my python environment. You can do this on webpython by dragging it onto the box above the start/stop buttons. On the raspberry pi, just copy it back across to the pi.

<script>
makePyodideBox({
    codeString:`
import sensors
import time
import numpy as np
from tflite_runtime.interpreter import Interpreter

# for raspberry pi, we put the sound sensor on pin A0
sensors.set_pins({"sound":0})

# threshold between silence and start of a knock pattern - this may need to be different if you're on raspberry pi
SILENCE_LEVEL=128

tflite_model=Interpreter(model_path="model.tflite")

def check_unlock(sensor_data):
    global tflite_model
    # make the knock pattern be a fixed length 
    sensor_np=np.array(sensor_data)
    # trim silence off the end
    last_sound_pos=np.argmax(np.flip(sensor_np)>128)
    sensor_np=sensor_np[:-last_sound_pos]
    sensor_np=sensor_np-np.min(sensor_np) # min is now zero
    max_sensor=np.max(sensor_np)
    if max_sensor>0:
        sensor_np=sensor_np/max_sensor # max is now one
    # resample it to 512 samples long
    x_out_positions=np.linspace(0,512,512)
    x_original=np.linspace(0,512,len(sensor_np))
    sensor_resampled=np.interp(x_out_positions,x_original,sensor_np)
    # make it have 2 axes - time point, sensor, because this is what tensorflow expects
    sensor_resampled=np.expand_dims(sensor_resampled,-1)
    r=tflite_model.get_signature_runner()
    result=r(x=sensor_resampled.tolist())
    # get the first result no matter what the name of the output is
    first_key=next(iter(result.keys()))
    result=result[first_key][0]

    if(result[1]>result[0]):
        return False
    else:
        return True

current_knock_array=[]

in_knock=0
last_loud_time=None
print("time","sound level")
while True:
    snd_level=sensors.sound.get_level()
    cur_time=time.time()
    if snd_level>SILENCE_LEVEL:
        last_loud_time=cur_time
        if in_knock==0:
            # a noise, this is the start of a knock
            current_knock_array=[]
            in_knock=1
    if in_knock!=0 and snd_level<SILENCE_LEVEL:
        # silence for more than one second is the end of a pattern - now run the model on it        
        if cur_time-last_loud_time>1:
            in_knock=0
            # trim silence off the end of the current knock array
            if check_unlock(current_knock_array):
                print("Unlocked okay")
                time.sleep(5)
            else:
                print("Bad knock pattern")
                time.sleep(2)
    if in_knock:
        current_knock_array.append(snd_level)
    print(cur_time,snd_level,sep=',')
    time.sleep(0.01) # 100th of a second
`  ,hasConsole:true,hasGraph:true,showCode:true,editable:true,showFileButtons:true,hasUploadBox:true,caption:"This script does the unlock implementation by using the pretrained model you created above."})
</script>

# Regression model example - tempo tapper

The tempo tapper calculates a tempo in beats per minute that you are tapping. 

This uses an almost identical model to the classification model, but the output instead of being a choice of classifier class, is instead a value in beats per minute. This is an example of using machine learning to do *regression*, or to estimate the value of some quantity.

We generate ground truth for this differently - instead of tapping and telling the system what taps we're doing, the ground truth generator script tells us when to tap to create a range of tempos.

<script>
makePyodideBox({
    codeString:`
import sensors
import time
import random
from collections import deque

# for raspberry pi, we put the sound sensor on pin A0
sensors.set_pins({"sound":0})

last_beat_times=deque(maxlen=4)

print("is_beat","time","sound level","ground truth",sep=',')
# start off by outputting 120bpm tick
beat_tempo=120
next_beat_time=time.time()+(60/beat_tempo)
tempo_change_beats=4
ground_truth_tempo=0
while True:
    snd_level=sensors.sound.get_level()
    cur_time=time.time()
    if cur_time>=next_beat_time:
        is_beat=111
        if len(last_beat_times)==4:
            # calculate the bpm based on the time for previous 4 beats 
            ground_truth_tempo= (60*4)/(cur_time-last_beat_times[0])
        last_beat_times.append(next_beat_time)
        next_beat_time+=(60/beat_tempo)
        tempo_change_beats-=1
        if tempo_change_beats==0:
            # tempos from 60-180 only here
            beat_tempo=(random.random()*120.0)+60
            tempo_change_beats=8
    else:
        is_beat=0
    print(is_beat,cur_time,snd_level,ground_truth_tempo,sep=',')
    time.sleep(0.01) # 100th of a second
`  ,hasConsole:true,hasGraph:true,showCode:true,editable:true,showFileButtons:true,caption:"Capture ground truth datasets using this script"})
</script>

We can similarly load this ground truth data in another [Colab notebook](https://colab.research.google.com/github/joemarshall/websensors/blob/main/assets/python/Tempo_tapper.ipynb), and train an almost identical neural network to do the regression.

Load your ground truth into the colab notebook and run it as before. It takes quite a time to train the model. You should get out tempomodel.tflite, which goes into the script below to run it.

<script>
makePyodideBox({
    codeString:`

import sensors
import time
import numpy as np
import graphs
from collections import deque

from tflite_runtime.interpreter import Interpreter

# for raspberry pi, we put the sound sensor on pin A0
sensors.set_pins({"sound":0})

tflite_model=Interpreter(model_path="tempomodel.tflite")

sensor_history=deque(maxlen=512)

def get_tempo(sensor_data):
    global tflite_model
    sensor_np=np.array(sensor_data)
    # scale the data so it isn't too big (same as the colab does)
    sensor_np=sensor_np/512.0
    # make it have 2 axes - time point, sensor, because this is what tensorflow expects
    sensor_np=np.expand_dims(sensor_np,-1)
    r=tflite_model.get_signature_runner()
    result=r(x=sensor_np.tolist())
    # get the first result no matter what the name of the output is
    first_key=next(iter(result.keys()))
    result=result[first_key][0][0]
    return result

graphs.set_style("sound","rgb(0,0,0)",0,1024)
graphs.set_style("tempo","rgb(255,0,0)",0,200,subgraph_y=1)
    
cur_tempo=0
print("time","sound level","tempo",sep=',')
while True:
    snd_level=sensors.sound.get_level()
    cur_time=time.time()
    sensor_history.append(snd_level)
    if len(sensor_history)==512:
        cur_tempo=get_tempo(sensor_history)
    print(cur_time,snd_level,cur_tempo,sep=',')
    graphs.on_value("sound",snd_level)
    graphs.on_value("tempo",cur_tempo)
    time.sleep(0.01) # 100th of a second
`  ,hasConsole:true,hasGraph:true,showCode:true,editable:true,showFileButtons:true,hasUploadBox:true,caption:"This script does the tempo tap implementation by using the pretrained model you created above."})
</script>