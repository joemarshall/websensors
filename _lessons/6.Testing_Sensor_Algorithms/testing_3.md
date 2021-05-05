---
title: Ground Truth Datasets
uses_pyodide: true
uses_audio: true
uses_accelerometer: true
uses_light: true 
uses_files: true
---
In order to know how well your sensing algorithm is working, you need to know how accurately it is predicting whatever underlying process it is aiming to observe. How we do this is by using a *ground truth* dataset. Ground truth data is sensor input data where we also know the correct output. This allows us to compare our program output with the correct answer.

In most real-world deployments of sensors, we do not have access to ground truth in general, as if we had an easy way of getting the correct answer, then we would use that to get our data in the first place. An exception is when we are using sensor data to predict a future value; for example I recently built a system which used sensor data readings of current and historic water level and rainfall in the area, and used that to build a system which predicts what the river level near my house will be tomorrow. In this kind of data, the sensor dataset itself contains the ground truth, it is just unavailable at the point you actually want the sample.

Anyway, ignoring that exception, you are going to want to have some way of generating ground truth datasets for your sensor data. I'll discuss some ways to do that here:

# Manual - by observation

Say you have a system which detects people walking past your phone using the accelerometer. One way to collect testing data for this would be to put it somewhere that people would walk, and note down when people pass whilst recording the sensor data. It is usally possible from visually scanning a graph of the sensor data to observe the exact time each event occurred.

This is observational ground truth data; capturing data as it is in the real world. The advantages of this are that it represents typical real-world data; however it may be difficult to capture data for all possible cases.

# Manual - by making it happen

A previous year's project detected golf swings using accelerometer and sound sensing. To create a ground truth dataset, the student created a number of separate datasets that each did one type of swing ten times, along with a 1 minute of not swinging dataset. These constructed ground truth dataset allowed the student to understand their algorithm performance across the full range of possible stroke types.

An additional way to do this is to script it, by making your python script show prompts for what to do (or say something when it is time to do something). This way as long as you follow the script each time you record the data, you will get a correct ground truth recording.

# Automatic - by using extra sensors

In our 
[swing sensor](http://localhost:4000/lessons/5.Combining_Sensors/combining_4.html#swing-angle-detection) system, we initially used a simple sensor on the swing seat to calculate the swing position. We then used this as ground-truth data against data from the head mounted accelerometer to train a sensor algorithm which no longer requires the external sensor. This kind of automated ground-truth generation is quite common in sports technology, where people for example aim to estimate calories used or muscle power output from other measurements such as distance, speed, wind-speed and gradient. Such measurements can directly be done with expensive lab-quality equipment; by approximating measurements using simpler sensors, they can be made available in cheaper consumer quality hardware.

Another way of using extra sensors is to use one sensor which is easily triggered just as 'event occurred' trigger, so you for example press a button each time you see something happening, and record the output of that; this is essentially doing observational sensor recording, but automating the process of saving the ground truth data.

# What to do with it once you have it

Once you have recorded your ground truth sensor data, we can if needed load it into excel, and add a column for the ground truth (if we aren't automatically recording it), and then we can replay back into the sensor processing code, complete with comparisons relating to the ground truth measures.

# Let's try recording some ground truth and playing it back

The following python script collects ground truth data for a clap sensing algorithm. It uses a scripted model, in that it expects you to clap 10 times during each run of the script which lasts approximately 1 minute. To use it, run the script, and watch the last number, which is the expected number of claps. Each time that last number changes, you clap. 

At the end, it shows how many claps it detected, versus how many it was expecting, and also an error counter - the error counter is the mean squared error at all points between the number of claps it was expecting and the number of claps sensed. The closer this is to zero, the better the sensor algorithm is working.

If you replay CSV data into this script, it will use that as input, and show you the error for the pre-recorded CSV data. So, a task; do the steps below and try and understand it. If you can understand this you will be well set up for doing the coursework, so please please do work through this exercise in full.

1. Set 'autosave output' to on.
2. Run the script. Each time you see that last number change, do a clap. Run it until it finishes.
3. You should see an error value at the end of the output - take a note of that.
4. Find the output file in your onedrive and load it as a replay CSV in the replay CSV file box.
5. Run the script again. Hopefully you should get the same error value.
6. Tweak the threshold value and run again against the same data, see if the error value changes.
7. Try to tweak the threshold until the error improves. Repeat this until you can't improve the error value any more.
8. Once you get that right, turn off the replay CSV and try it manually, see if it works better than originally when you clap yourself again. There is a risk that the adjusting the threshold has just overfitted.

Note - if you're in a hurry, while you are tweaking the threshold, you can comment out the sleep line that does the delay when real data is being used. Make sure you put it back before you do step 8, or else weird things will happen.

Once you successfully get to step 8, you have basically done the complete workflow for the coursework. Read the next pages for more on testing and tuning your algorithm, but right now, you know the boring stuff about how to run a script, capture data etc.

<script>
makeReplayController();
makePyodideBox({codeString:
`THRESHOLD=.5
DELAY=0.01

import time
import sensors
import speech
import graphs
REPLAY=sensors.replayer.has_replay()

bangs_expected=0
bangs_detected=0

error_accumulator=0
error_count=0

# sep="," means to output in CSV format
# 4 columns - time, raw sound, bangs detected, bangs expected
print("time","sound","bangs_detected","bangs_expected",sep=",")

# run for 1 minute, bangs every 5 seconds after 10 seconds
last_second=0
start_time=time.time()

# lets graph everything too
graphs.set_style("sound","rgb(255,0,0)",0,1)
graphs.set_style("bangs detected","rgb(0,255,0)",0,10,subgraph_y=1)
graphs.set_style("bangs expected","rgb(0,0,255)",0,10,subgraph_y=1) 


while True:
    # if we are replaying, read sensor value and time from the replayer
    # not the actual sensors            
    if REPLAY:
        sound,this_time=sensors.replayer.get_value("sound","time")
    else:
        sound=sensors.sound.get_level()
        # how long since we started running
        this_time=time.time()-start_time
    # quit after 60 seconds
    if this_time>=60:
        break
    # integer value of time = seconds since start
    this_second=int(this_time)
    # say the script on 5 second intervals
    if this_second != last_second:
        if (this_second%5)==0 and this_second>=10:
            speech.say("Bang")
            bangs_expected+=1
    # keep track of the previous second, so we can do things on
    # changes in the value
    last_second=this_second
    # do the threshold here
    if sound>THRESHOLD:
        # detected a bang
        bangs_detected+=1
    error_accumulator+=(bangs_detected-bangs_expected)**2
    error_count+=1
    # if you want, comment out this line when doing replay
    # and you can get the results quicker
    time.sleep(DELAY)
    print(this_time,sound,bangs_detected,bangs_expected,sep=',')
    graphs.on_value("sound",sound)
    graphs.on_value("bangs detected",bangs_detected)
    graphs.on_value("bangs expected",bangs_expected)

# this error total is the mean difference between bangs_expected and bangs_detected
# there are probably better ways to do this error, see next page
print("ERROR at end:",error_accumulator/error_count, "Bangs detected:",bangs_detected, "Expected:",bangs_expected)
`,
hasConsole:true,hasGraph:true,showCode:true,editable:true,showFileButtons:true,caption:"Put your code into here to test it"})
</script>
