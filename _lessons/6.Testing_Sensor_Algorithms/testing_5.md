---
title: The role of testing in a sensor development workflow
uses_pyodide: true
uses_audio: true
uses_accelerometer: true
uses_light: true 
uses_maths: true
uses_files: true
---
Testing of sensor algorithms is a core part of design, development and deployment of sensor software. It is really really important. Let me say that again, just in case you are doing coursework for me and thinking of skimping on your testing (it is a quarter of the final mark, so expect to do some time doing it and documenting it). **NOTE, I have already said this repeatedly, but sensors are rubbish. Your sensor algorithm will never work perfectly. That is not a problem. In marking coursework, we expect your algorithm not to work perfectly; testing is where you show us how and why it fails. You will not get better marks if you build something that works 100% of the time compared to something that works 90% of the time.**

So what is testing, and how does it fit into your development workflow?

Testing is anything that you do which involves running some code and seeing what it does. This can range from informal testing where you just run the code and play with it and see if it feels like it does roughly the right thing, to more formal, structured tests which you might do to numerically quantify the performance of your algorithm. Testing happens everywhere during development.

I like to split testing activities into tuning vs final testing. Tuning is activities which you do continuously during development in order to understand what does and doesn't work, and to allow you to improve your code. Testing is activities you do before the code or system is delivered to anyone, or when you want to tell anyone what the performance of the system is.

One key distinction here is that when you tune your code, you aim to be informed by testing results, but you don't want to *overfit* your sensor processing code so that it only works in the exact situations that you have tested on. Because of this, it is always recommended that when you do any kind of final testing, if you want to truly understand the performance of the system, you do it on a different test dataset from the one which you tuned on. 

The demo below shows an example of overfitting that I just did:

## Overfitting Example

Here is an example of what happens if you overfit a sensor processing algorithm. The code below is a shiny torch detector. It detects when I point my shiny torch at the light sensor. I tested it on my laptop at 21:15 at night when it was quite dark and it worked great. The threshold is set just right so it fires when you shine the torch at it and reliably stays off otherwise. Run the code and try it with your mobile phone torch.

<script>
makePyodideBox({
    codeString:`
THRESHOLD=.4
import time    
import graphs
import sensors
graphs.set_style("light","rgb(0,255,0)",0,1,subgraph_y=1)
graphs.set_style("shiny torch on","rgb(255,0,0)",0,1,subgraph_y=0)
while True:
    light_level=sensors.light.get_level()
    thresholded_light=1 if light_level>THRESHOLD else 0
    graphs.on_value("light",light_level)
    graphs.on_value("shiny torch on",thresholded_light)
    print(light_level,sep=",")
    time.sleep(0.1)
`  ,hasConsole:true,hasGraph:true,showCode:true,editable:true,caption:"Joe's patent pending Shiny Torch Light Detector"})
</script>

<details class="question">
<summary>Why doesn't this work in conditions other than those I tested it in?</summary>
If the ambient light level is even slightly brighter, you will find that this code doesn't work; it is very much overfitted to the ambient light levels in the slightly dim room in which I built it.
</details>

# Testing activities throughout the workflow

There are many types of testing activity that might occur during the design and development of a sensing system. Here are some examples of testing activities that you might do and how you might go about them:

## Initial testing - learn about the sensor characteristics and response

When I start to develop a sensor algorithm, the thing I begin with is informal testing of sensor response. Firstly I will write a basic data capture script which captures data from the sensors of interest. Then I'll run it and look at what the values look at in real-time as I make whatever I want to track happen. Following this, I will capture some data to a CSV file and graph it in excel so I can really look into how it responds to whatever I want to track. This is really quick to do, and allows you to check out basic things like does it look like there is a chance you can make the algorithm work. Sometimes you have a great idea for a sensor processing system, but then in this initial testing, whatever event you want to track appears to have little effect on sensor values when you graph it in excel. In that case you may need to rethink what sensors you are using or how you are planning to apply them.

## Event data capture - for tuning

Throughout development, I will capture datasets of raw sensor data of the event I'm tracking occurring. These enable me to quickly replay sensor data while I'm building and changing the sensor processing algorithm, just to sanity check how things are working and whether I've badly broken something. 

## Live tuning
I also aim to do live testing during development; this helps to make sure that the system is exposed to a range of different inputs and to reduce overfitting based on pre-recorded datasets.

## Performance testing
Towards the point where I show off an algorithm to anyone, I will often do some kind of testing with completely new datasets, and also aim to do live testing with new users or in new places. This evaluates what the performance of the algorithm is irrespective of any bias in my sensor datasets used during development.

# Reporting testing
If say, you were doing a coursework report on a sensor algorithm that detected and quantified events, how might you write your report up so that it was clear what a thorough job of the testing of your algorithm is and can demonstrate to us how well the thing works?

The key thing is to present us with a lot of detail at each stage as to how the sensor data informed your work. Good project reports typically have quite a few relevant graphs, clearly annotated to show what they mean, and clear tables showing the performance of the algorithm in testing.

To get this right, you might want to:
1. Show that your algorithm development was informed by sensor data; e.g. by showing graphs of raw data captured early on in the process annotated with when events occurred.
2. Show that you built your algorithm with the help of data, for example by including pre-recorded datasets that you used during the process of algorithm development and tuning.
3. Show the (different) datasets which you used for final testing, and present clear numerical results of how well it worked, for example run it against a decent number of events, and chart the false positives and false negatives. You could even go all out and show an ROC curve for your algorithm if it is relevant. For any numerical outputs from your sensor algorithm, show what the error is using metrics such as mean squared error.
4. When your algorithm doesn't work perfectly, show detailed analyses of  where it doesn't work, and where it does work. 

The first 3 steps of this, you should know how to do if you've got to here.

Step 4, I'll talk about right now and show an example of an annotated graph:

## Analysing and describing sensor errors

When your algorithm doesn't work, beyond just knowing how often your sensor algorithm fails, it is worth considering what are the conditions under which it fails. These are very useful for considering how you might sense such conditions and improve the algorithm to avoid these errors, and can also be useful to you or others when considering whether your sensor algorithm would be appropriate for any particular application.

As an example, let's look at Joe's Super Karate Chop Detector. This uses accelerometer to detect a karate chop motion when the phone is held sideways in your hand.

<script>
makePyodideBox({
    codeString:`
THRESHOLD=30
import time
import graphs
import sensors
graphs.set_style("x","rgb(0,255,0)",-20,20)
chop_count=0
last_chop=0
start_time=time.time()
print("time","x","y","z","chop count",sep=",")
while True:
    time_now=time.time()-start_time
    (x,y,z)=sensors.accel.get_xyz()
    if x>THRESHOLD:
        this_chop=1
    else:
        this_chop=0
    if this_chop==1 and last_chop==0:
        chop_count+=1
    last_chop=this_chop
    print(time_now,x,y,z,chop_count,sep=',')
    time.sleep(0.01)
`  ,hasConsole:true,hasGraph:true,showCode:true,showFileButtons:true,editable:true,caption:"Joe's Super Karate Chop Detector"})
</script>

Let's say I decide I'm going to run this and do ten chops. The output I get might look like the figure below (in fact it did, I just ran the code and then put it straight into Excel). You can see in the graph that I have annotated the two false negatives to say why the two non-sensed chops were missed (it was because the device was twisted). You will see that in the truth table, I do not fill in the False event column - this is because I did not yet define fixed timesteps to do sensing in, and actually only tested against data that had events in.


<figure>
    <img src="{{'/images/karate1.svg' | relative_url }}" alt="Results from my chop sensing with ten chops shows for two of the chops the X axis did not go past the threshold." title="Results of chop sensing test with ten chops" />

<table class="truthtable">
    <tr>
        <td></td><td colspan=2>Real event</td>
    </tr>
    <tr>
        <th>Sensor report</th><th>True</th><th>False</th>
    </tr>
    <tr>
        <td>True</td><td>8</td><td>N/A</td>
    </tr>
    <tr>
        <td>False</td><td>2</td><td>N/A</td>
    </tr>
</table>

<figcaption>Results of chop sensing test with ten chops shows that two false negatives occurred. </figcaption>
</figure>


<details class="question">
<summary>
Look at the data in the figure above. What do these results mean? Why were there two false negatives, what might have caused them? How might you annotate the graph to show this?
</summary>

By looking at the other axes of the accelerometer it became clear that in the two missing chops, I must have rotated the device slightly, so that the X axis was no longer going above the threshold. I annotated the graph accordingly.

You can also see from the graph with the threshold included on it that whilst it would be possible just to move the threshold down to catch chop number 6 and 7, but the moment you did that, you'd see a false positive as I was picking up the device just before chop 1.

n.b. you can either add these graph annotations in Excel, or you can save the output from excel as a picture and add it in another piece of software. I like to use Inkscape to do this, which is free.

{%include figure.html url="/images/karate2.svg" alt="Annotated chop sensor data, noting that in the two missing chops the device was rotated so no chop was sensed." title="Annotated chop sensor graph" caption="In the chops that weren't sensed, the phone clearly rotated off the correct axis. We can annotate these data points based on our observations" %}

</details>
