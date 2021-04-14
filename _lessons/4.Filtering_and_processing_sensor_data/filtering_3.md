---
title: Robust event detection
lesson_order: 4
sublesson_order: 3
uses_maths: true
uses_pyodide: true
uses_audio: true
uses_light: true
---

# Event detection basics

In many uses of sensors, what we are interested in is not a continuous value of some parameter over time as we get from the raw sensor data, but events that occur in the physical world at specific times.

The most basic way to detect an event is with a simple threshold, as seen on the previous page. If we have a threshold value, we can assume an event occurs when the threshold changes.

For example, check out the code below which uses the light sensor to detect when you put your hand in front of the sensor (your webcam in this case). This is done by thresholding on a low light level (I chose an arbitrary value of 0.3 here), and firing an event when the light sensor goes below this.

<script>
makePyodideBox({
    codeString:`
# we use time.sleep for delay
import time    
# load the sensors module
import sensors
import graphs


graphs.set_style("light","rgb(0,0,0)",0,1)
graphs.set_style("threshold","rgb(0,255,0)",0,1)
graphs.set_style("event counter","rgb(0,0,255)",0,10,subgraph_y=1)
# try changing this threshold level and see what it does 
# to the thresholded output
THRESHOLD_LEVEL=0.3

event_count=0
last_threshold=0
while True:
    light_level=sensors.light.get_level()
    thresholded=1 if light_level<THRESHOLD_LEVEL else 0
    if last_threshold==0 and thresholded==1:
        # threshold hit, fire an event
        event_count+=1
        print("EVENT FIRED",event_count)
        # make sure that the event counter graph doesn't 
        # overflow
        event_count=event_count%10 
    last_threshold=thresholded
    graphs.on_value("light",light_level)
    graphs.on_value("threshold",THRESHOLD_LEVEL)
    graphs.on_value("event counter",event_count)
    time.sleep(0.01)
`  ,hasConsole:true,hasGraph:true,showCode:true,editable:true,caption:"Light sensor event detection using simple threshold"})
</script>

Have a play with this example for a bit, wave in front of your webcam. Does it work for you? What doesn't work, and if it doesn't work, can you see why from the data?

<details class="question" markdown=1>
<summary>Do you have any ideas about why this code is not robust? </summary>
There are a bunch of reasons why this code does funny things. These are largely due to similar errors to those we saw in the thresholding section, but with some event specific extra fun.

* If it is too dark or light where you are, the threshold is wrong, and it just doesn't fire events even if you are waving in front.
* If the threshold is very close to the current ambient light level, it continually fires events.
* If the light fluctuates as you wave in front of the sensor, it often fires multiple events very close together when actually only one event is happening.
* Sometimes a tiny fluctuation in light level can cause the value to jump briefly to the other side of the threshold and back again.
</details>

# What problems occur with event detection

At the highest level, when we are using a sensor based system to detect events in the real world, there are two things that can go wrong.

1. **False positives** - when a sensor system reports an event, but no event has actually occurred. 

2. **False negatives** - when an event occurs but the sensor system does not report an event.

What we want from a system are **true positives**, where the sensor system reports events when an event has actually occurred.

With the light sensor system above, we saw that if it was too dark or light, the system never crossed the threshold, so any events were not sensed, causing large numbers of *false negatives*. If the ambient light level was very close to the set threshold, random fluctuations in the light level caused events to be sensed due purely to these random fluctuations, cause *false positives*. Sometimes when we correctly sensed an event, the fluctuations in light during the transition from light to dark or back caused multiple *false positives* as well as the *true positives* which we were hoping for.

A really important thing to grasp about sensors is that they very rarely just work. Almost all sensor based systems which are trying to detect events will exhibit either false positives, false negatives, or often a combination of both. What we are trying to do when building such systems is to catch as many events as possible (reducing the number of false negatives), whilst balancing that against the potential for false positives.

# Balancing false positives and false negatives

In real-life deployment of sensor-based systems, the balance between false positives and false negatives is largely driven by application, in other words it is a design choice. We typically have to think about the consequences of each class of error, and then develop our system to prioritize reducing one or the other type of error. In many real-world systems, there may be multiple levels of event detection, some of which may have more or less serious consequences.

In the following questions, we're going to think about some real-world examples of sensor systems. For each one, try and consider what are the consequences of false positive and false negatives, and how we might balance such events. As always, try and think about your answer before you click open to see mine.

<details class="question" markdown=1>
<summary>A smoke and fire alarm - these use networks of sensors to detect high levels of smoke or heat, and make a loud noise to warn inhabitants of a building so they can evacuate the building. In some historic buildings which are highly flammable in their design, or large public buildings, a fire alarm may be linked to automatically alert the fire service. 

What are the consequences of false positives and negatives in this system?
How might we wish to balance them?
  </summary>

The consequences of false negatives here are clear. Firstly, buildings might burn down. As a consequence of this, people might die, people may lose large amounts of money, the operations of businesses in the building may be badly affected. Basically buildings burning down is a really bad bad thing that we really very much want to avoid.

But what are the consequences of false positives? As anyone who has ever lived in student accommodation knows, smoke alarms which repeatedly fire can cause a lot of immediate practical problems for building inhabitants. For example inhabitants may be forced to evacuate a building very late at night, or may be repeatedly forced to interrupt their work. As well as this, there are second-order effects of false positives as to how they affect *trust* in the system. If a system is firing regularly without an actual fire, then over time, people lose their trust in the system, meaning they are slower to evacuate when a real fire occurs. When systems interact with third parties, such as if they call the fire service, false positives may have large financial penalties attached, or may affect the ability to use the service, with fire-services called out to large numbers of automatically fired alerts potentially removing the ability for this organisation to access the auto-alarm service.

One approach to this is to set different thresholds for different actions - for example in a public building, if a single smoke sensor detects smoke, a member of security staff may be alerted and sent to check it out. Once two or more sensors detect smoke, an evacuation alert would sound, and once some larger number of sensors detect smoke, or heat levels exceed some high threshold, alert emergency services directly.
</details>

<details class="question" markdown=1>
<summary> A 'smart speaker' uses sound to detect a wake word such as 'alexa' or 'hey google'. Ignoring all the cleverness that happens after the wake-word sensing, consider what the consequences of false positives and false negatives are for smart speakers.
</summary>

False negatives in wake-word detection are annoying to users. No one wants to have to repeatedly shout 'hey google' every time they want to turn their lights off or play some music. As the parent of a 4 year old child who doesn't speak clearly enough for google to understand, I regularly see how annoying it is when your smart speaker doesn't do your bidding at the first try.

False positives can also cause annoyance to users - for example it is annoying when your Alexa randomly triggers during a TV show or when you're having a conversation with someone else. Developers of these speakers also do not like false positives because they emphasise the always-listening nature of smart speakers, something which privacy advocates are already worries about. Further to this, unwanted activations can cause data protection issues, as was seen with Apple's Siri, where it was revealed that contractors working for Apple had been given access to recordings of commands given to Siri, which included snippets of unrelated conversation heard after false positive wake-word sensing.
</details>

<details class="question" markdown=1>
<summary> A security system aims to stop people stealing the crown jewels at the Tower of London. As well as a highly physically secure vault, a set of sensors both monitoring the integrity of the walls, sound levels in the room, and sensor beams across the room aim to detect if people are moving in the space at times when it is closed. If any suspicious activity is detected an on-site security team are alerted, who may view CCTV footage or undertake an in person inspection.

How important are false positives and false negatives in this situation?
</summary>

In this situation, the property being guarded is valuable enough to merit full on-site security cover. As such, there will always be security people in the vicinity. This makes false positives less important here - if every so often the security system throws a false alarm and someone has to go down and check the vault, this is not going to severely inconvenience anyone, especially given that regular security patrols will probably occur anyway, it simply alters the timing of them.

False negatives however cannot be countenanced when guarding property like this which is irreplacable and priceless.

When designing a system for these purposes, we would aim to trigger alarms based on sensor values which for less valuable items would cause too many false positives. It would be appropriate here to tip the balance towards false positives in order to minimise the chances of false negatives which are catastrophic.
</details>

<details class="question" markdown=1>
<summary> In medical screening for diseases, we may screen a high-risk population for signs that they are likely to have a particular illness. If the screening tests show a positive result, people are referred for further testing.

What are the effects of false positives and negatives here?
</summary>
From a purely medical risk model, false positives may be seen as less of a problem here, because we are screening out people who are very unlikely to have a condition and then doing further tests to check which ones actually have the illness. Whereas false negatives could give people reassurance that they didn't have an illness which might exacerbate the effects of the illness.

However false positives do have some downsides here - they can both be extremely worrying to patients and they can lead to people experiencing invasive or dangerous second-level testing which they don't really need to have.
</details>

As you can see here, sensor based systems are often deployed in situations where they are involved in decision making processes which may have real effects on societies and the people within those societies. Depending on the situation being sensed, and the different effect of each type of mistake we may wish to prioritise reduction of false positives or false negatives in our sensing system design.

A further thing to consider is that the performance of sensor systems may differ based on aspects of what they are sensing. These can cause serious issues. For example many sensing systems have been demonstrated to work less accurately when applied to women or non-white people. As an example of what happens when things go wrong, check out [this article](https://www.theverge.com/2021/4/13/22382398/robert-williams-detroit-police-department-aclu-lawsuit-facial-recognition-wrongful-arrest) about a recent lawsuit relating to facial identification systems.[The Verge, April 2021](#verge2021). 

# Let's make our event sensing more robust

So, with all that in mind, how might we make our event sensing more robust. 

## Method 1: Apply better thresholding methods

As we saw in the previous section, by using different thresholds for up and down, and by thresholding adaptively based on previously observed values, we can make thresholding work more efficiently.

Check out the code below which does both those things:

<script>
makePyodideBox({
    codeString:`
# we use time.sleep for delay
import time    
# load the sensors module
import sensors
import graphs
# import deque module for sensor history storage
from collections import deque

# threshold based on previous 200 readings
history=deque(maxlen=200)

graphs.set_style("light","rgb(0,0,0)",0,1)
graphs.set_style("threshold up","rgb(255,0,0)",0,1)
graphs.set_style("threshold down","rgb(0,255,0)",0,1)
graphs.set_style("event counter","rgb(0,0,255)",0,10,subgraph_y=1)

# These multipliers set what fraction of the mean of the previous
# 200 readings is used as the threshold for moving up or down
THRESHOLD_UP_MULTIPLIER=0.9
THRESHOLD_DOWN_MULTIPLIER=0.75

event_count=0
last_threshold=0
while True:
    light_level=sensors.light.get_level()
    # update threshold based on 0.75*mean of previous values to fire an 
    # event then 0.9 to return to normal state
    history.append(light_level)
    mean=sum(history)/len(history)
    threshold_up=THRESHOLD_UP_MULTIPLIER*mean
    threshold_down=THRESHOLD_DOWN_MULTIPLIER*mean

    if light_level<threshold_down:
        thresholded=1
    elif light_level>threshold_up:
        thresholded=0
    else:
        thresholded=last_threshold
    if last_threshold==0 and thresholded==1:
        # threshold hit, fire an event
        event_count+=1
        print("EVENT FIRED",event_count)
        # make sure that the event counter graph doesn't 
        # overflow
        event_count=event_count%10 
    last_threshold=thresholded
    graphs.on_value("light",light_level)
    graphs.on_value("threshold up",threshold_up)
    graphs.on_value("threshold down",threshold_down)
    graphs.on_value("event counter",event_count)
    time.sleep(0.01)
`  ,hasConsole:true,hasGraph:true,showCode:true,editable:true,caption:"Light sensor event detection using adaptive up and down thresholds"})
</script>

If you play with this, you should be able to see that this is way more robust to differing light levels. This basic robustness can help with both false positives and false negatives equally, by avoiding the threshold levels being set very close to the ambient light level, or being set so high that the threshold is never triggered.

However, if you look at the parameters for these thresholds, the bit of code below, the parameters may be altered depending on our desired balance between false positive and false negatives.

```
# These multipliers set what fraction of the mean of the previous
# 200 readings is used as the threshold for moving up or down
THRESHOLD_UP_MULTIPLIER=0.9
THRESHOLD_DOWN_MULTIPLIER=0.75
```

These parameters set what percentage of the mean of the sensor history is used for each of the up and down thresholds. Tuning these values can be used to alter whether false positives or false negatives are more likely. For example the higher the down threshold is set, the more likely it will be that an event is triggered by random fluctuations, causing a false positve. If this threshold is set lower, then events will need to cause big deviations in sensor data to be detected, meaning that false negatives become increasingly likely. Similarly, as the threshold up multiplier is moved closer to the down multiplier, the risk of sensor fluctuation causing multiple events to be sensed for one real event is increased (false positives), whereas when the two parameters are spaced out further, the risk of false positives is decreased, at the expense of missing out on two events where the sensor value happens not to completely return to zero in between.

## Method 2: Require multiple counts before firing events

Another way to make sensing of events more robust is to require the threshold value to be hit multiple times before we fire an event detection. Check out the code below. In particular, try messing with `THRESHOLD_TRIGGER_COUNT` and see what happens to the event detection.

<script>
makePyodideBox({
    codeString:`
# we use time.sleep for delay
import time    
# load the sensors module
import sensors
import graphs
# import deque module for sensor history storage
from collections import deque

# threshold based on previous 200 readings
history=deque(maxlen=200)


# we only fire an event once our threshold is hit for this
# number of times round the loop
THRESHOLD_TRIGGER_COUNT = 30


graphs.set_style("light","rgb(0,0,0)",0,1)
graphs.set_style("threshold up","rgb(255,0,0)",0,1)
graphs.set_style("threshold down","rgb(0,255,0)",0,1)
graphs.set_style("threshold_count","rgb(0,0,255)",0,THRESHOLD_TRIGGER_COUNT,subgraph_y=1)

# These multipliers set what fraction of the mean of the previous
# 200 readings is used as the threshold for moving up or down
THRESHOLD_UP_MULTIPLIER=0.9
THRESHOLD_DOWN_MULTIPLIER=0.75
event_count=0
threshold_count=0
last_threshold=0
while True:
    light_level=sensors.light.get_level()
    # update threshold based on 0.75*mean of previous values to fire an 
    # event then 0.9 to return to normal state
    history.append(light_level)
    mean=sum(history)/len(history)
    threshold_up=THRESHOLD_UP_MULTIPLIER*mean
    threshold_down=THRESHOLD_DOWN_MULTIPLIER*mean

    if light_level<threshold_down:
        thresholded=1
    elif light_level>threshold_up:
        thresholded=0
    else:
        thresholded=last_threshold
    if thresholded:
        threshold_count+=1
    else:
        threshold_count=0
    if threshold_count==THRESHOLD_TRIGGER_COUNT:
        # threshold hit for THRESHOLD_TRIGGER_COUNT samples, fire an event
        event_count+=1
        print("Event fired",event_count)
    last_threshold=thresholded
    graphs.on_value("light",light_level)
    graphs.on_value("threshold up",threshold_up)
    graphs.on_value("threshold down",threshold_down)
    graphs.on_value("threshold_count",min(threshold_count,THRESHOLD_TRIGGER_COUNT))
    time.sleep(0.01)
`  ,hasConsole:true,hasGraph:true,showCode:true,editable:true,caption:"Light sensor event detection requiring threshold to be passed a number of times before event is fired"})
</script>

<details class="question" markdown=1>
<summary>What effect does changing  `THRESHOLD_TRIGGER_COUNT` have on the event sensing here? </summary>

Increasing `THRESHOLD_TRIGGER_COUNT` makes the sensing less likely to give false positives. However, this is traded off against two things. Firstly, increasing the trigger count means that short lived events are likely to cause false negatives. Secondly, by requiring the trigger count to be hit, our sensing of events is delayed, meaning we can only be sure an event is occuring at `THRESHOLD_TRIGGER_COUNT` samples after it begins. This is fine for some things, but in many sensing situations we will not want to delay too much, for example if we are wanting to sense when a trigger button on a gamepad is pressed, the timing is vital for games to work smoothly. 
</details>

## Method 3: Cancel close together events

We can also consider ignoring events that occur very close together. This avoids double triggering caused by fluctuations during the event. 

<script>
makePyodideBox({
    codeString:`
# we use time.sleep for delay
import time    
# load the sensors module
import sensors
import graphs
# import deque module for sensor history storage
from collections import deque

# threshold based on previous 200 readings
history=deque(maxlen=200)

# don't fire an event until at least MIN_TIME_BETWEEN_EVENTS samples have been taken
MIN_TIME_BETWEEN_EVENTS=50

graphs.set_style("light","rgb(0,0,0)",0,1)
graphs.set_style("threshold up","rgb(255,0,0)",0,1)
graphs.set_style("threshold down","rgb(0,255,0)",0,1)
graphs.set_style("time since last","rgb(0,0,255)",0,MIN_TIME_BETWEEN_EVENTS,subgraph_y=1)

# These multipliers set what fraction of the mean of the previous
# 200 readings is used as the threshold for moving up or down
THRESHOLD_UP_MULTIPLIER=0.9
THRESHOLD_DOWN_MULTIPLIER=0.75
event_count=0
threshold_count=0
last_threshold=0
time_since_last_event=MIN_TIME_BETWEEN_EVENTS
while True:
    light_level=sensors.light.get_level()
    # update threshold based on 0.75*mean of previous values to fire an 
    # event then 0.9 to return to normal state
    history.append(light_level)
    mean=sum(history)/len(history)
    threshold_up=THRESHOLD_UP_MULTIPLIER*mean
    threshold_down=THRESHOLD_DOWN_MULTIPLIER*mean

    if light_level<threshold_down:
        thresholded=1
    elif light_level>threshold_up:
        thresholded=0
    else:
        thresholded=last_threshold
    time_since_last_event+=1
    if last_threshold==0 and thresholded==1:        
        # threshold hit, fire an event only if MIN_TIME_BETWEEN_EVENTS samples have passed
        if time_since_last_event>=MIN_TIME_BETWEEN_EVENTS:
            time_since_last_event=0
            # threshold hit for THRESHOLD_TRIGGER_COUNT samples, fire an event
            event_count+=1
            print("EVENT FIRED",event_count)
    last_threshold=thresholded
    graphs.on_value("light",light_level)
    graphs.on_value("threshold up",threshold_up)
    graphs.on_value("threshold down",threshold_down)
    graphs.on_value("time since last",min(time_since_last_event,MIN_TIME_BETWEEN_EVENTS))
    time.sleep(0.01)
`  ,hasConsole:true,hasGraph:true,showCode:true,editable:true,caption:"Light sensor event detection which ignores multiple events very close together"})
</script>


<details class="question" markdown=1>
<summary>What effect does changing  `MIN_TIME_BETWEEN_EVENTS` have on false positives and false negatives? </summary>

Increasing `MIN_TIME_BETWEEN_EVENTS` means that false positives due to fluctuations in the data value are less likely to occur. However, the flip side of this is that we are unable to sense very quick sequences of events. This might be fine if we are making e.g. a security light triggered by a motion sensor, but if we are making a sensor based drum-kit or something else where quick repeated events are used, this would cause too many false negatives. 
</details>

# Now let's try this kind of event sensing with audio

We've seen with the light sensor examples how various different methods of thresholding and event triggering may be used to make event detection more robust to false positives, and how that is usually a balance between reducing false positives, where the sensing system reports events which did not really occur, and avoiding false negatives, where an event occurs but is not reported by the sensing system.

Before we leave this page, here's a quick example of doing similar things with the sound sensor. Try running it and then clapping very loud, hopefully it should fire events each time you clap.

<script>
makePyodideBox({
    codeString:`
# we use time.sleep for delay
import time    
# load the sensors module
import sensors
import graphs
# import deque module for sensor history storage
from collections import deque

# threshold based on previous 200 readings
history=deque(maxlen=200)

# don't fire an event until at least MIN_TIME_BETWEEN_EVENTS samples have been taken
MIN_TIME_BETWEEN_EVENTS=50

graphs.set_style("sound","rgb(0,0,0)",0,1)
graphs.set_style("threshold up","rgb(255,0,0)",0,1)
graphs.set_style("threshold down","rgb(0,255,0)",0,1)
graphs.set_style("time since last","rgb(0,0,255)",0,MIN_TIME_BETWEEN_EVENTS,subgraph_y=1)

# These multipliers set what fraction of the mean of the previous
# 200 readings is used as the threshold for moving up or down
THRESHOLD_UP_MULTIPLIER=1.8
THRESHOLD_DOWN_MULTIPLIER=1.5
event_count=0
threshold_count=0
last_threshold=0
time_since_last_event=MIN_TIME_BETWEEN_EVENTS
while True:
    sound_level=sensors.sound.get_level()
    # update threshold based on 2*mean of previous values to fire an 
    # event then 1.5x to return to normal state
    history.append(sound_level)
    mean=sum(history)/len(history)+0.1 # add the 0.1 so that silence is not zero (so multipliers work okay)
    threshold_up=THRESHOLD_UP_MULTIPLIER*mean
    threshold_down=THRESHOLD_DOWN_MULTIPLIER*mean

    if sound_level<threshold_down:
        thresholded=0
    elif sound_level>threshold_up:
        thresholded=1
    else:
        thresholded=last_threshold
    time_since_last_event+=1
    if last_threshold==0 and thresholded==1:        
        # threshold hit, fire an event only if MIN_TIME_BETWEEN_EVENTS samples have passed
        if time_since_last_event>=MIN_TIME_BETWEEN_EVENTS:
            time_since_last_event=0
            # threshold hit for THRESHOLD_TRIGGER_COUNT samples, fire an event
            event_count+=1
            print("EVENT FIRED",event_count)
    last_threshold=thresholded
    graphs.on_value("sound",sound_level)
    graphs.on_value("threshold up",threshold_up)
    graphs.on_value("threshold down",threshold_down)
    graphs.on_value("time since last",min(time_since_last_event,MIN_TIME_BETWEEN_EVENTS))
    time.sleep(0.01)
`  ,hasConsole:true,hasGraph:true,showCode:true,editable:true,caption:"Sound sensor clap detection"})
</script>



# References

1. <a id="verge2021"></a> Face recognition sensing leads to lawsuit:
https://www.theverge.com/2021/4/13/22382398/robert-williams-detroit-police-department-aclu-lawsuit-facial-recognition-wrongful-arrest

