---
title: Some sensor processing using machine learning
uses_pyodide: true
uses_audio: true
uses_tensorflow: true
uses_files: true
---
In this page I will discuss a couple of examples of machine learning. For executing the machine learning models, you will use the tflite interpreter built into the websensors platform or installed on the raspberry Pis in the lab. To train the models, we will use [Google Colaboratory](https://colab.research.google.com/?utm_source=scs-index).This is a platform that allows you to run python scripts from a 'notebook' on the web. These scripts execute remotely on a virtual machine owned by google, which has a full desktop installation of python, with tensorflow and many other useful libraries pre-installed. This allows you to train simple models at reasonable speeds.

# Knock knock lock

Knock-knock lock is a lock which uses sound to sense knocking sounds. It will open if you knock in a particular pattern. For example you might use the [shave and a haircut pattern](https://en.wikipedia.org/wiki/Shave_and_a_Haircut) which looks like this (where * is a knock and - is a pause)

```
*-***-*---*-*
```

So, first things first, lets create some training data. For this we need to record data from the sound sensor, along with some ground truth as to whether what we are hearing is the correct or the incorrect knock pattern.

For simplicity, I do this by recording two csv files. Each one contains a bunch of knock patterns, separated by silence of at least 1 second. In one file, the knock patterns are all good knocks (I use shave and a haircut). In the other file, the knock patterns are all different knocks.

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

Then I go to the colab workbook with these two 

Finally, I can run the saved model (the .tflite file) in python using the tflite module. To do this I need to upload the tflite file to my python environment. You can do this on webpython by dragging it onto the box above the start/stop buttons. On the raspberry pi, just copy it back across.

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
    sensor_np=sensor_np-np.min(sensor_np) # min is now zero
    max_sensor=np.max(sensor_np)
    if max_sensor>0:
        sensor_np=sensor_np/max_sensor # max is now one
    # resample it to 512 samples long
    x_out_positions=np.linspace(0,512,512)
    x_original=np.linspace(0,512,len(sensor_data))
    sensor_resampled=np.interp(x_out_positions,x_original,sensor_np)
    # make it have 2 axes - time point, sensor, because this is what tensorflow expects
    sensor_resampled=np.expand_dims(sensor_resampled,-1)
    r=tflite_model.get_signature_runner()
    result=r(x=sensor_resampled.tolist())
    # get the first result no matter what the name of the output is
    first_key=next(iter(result.keys()))
    result=result[first_key][0]

    if(result[0]>result[1]):
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


{% comment %}
# TODO: 1) colab workbook for the ground truth files
# TODO: 2) work out how to load files from colab back to pyodide
#       - i.e. allow an upload to script filesystem on the pyodide box
# todo: 3) train and test it
# todo  4) make body sensing page
{% endcomment %}
