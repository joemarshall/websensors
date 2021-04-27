---
title: Why we might combine multiple sensors
---
In this section we discuss a range of reasons why we might choose to use multiple sensor streams, and how that may allow us to better interpret the situation which we are sensing.

# Noise and error characteristics

Different sensors may have different noise and error characteristics. For example, if we consider a PIR motion sensor and a sound sensor; both can potentially be used to sense people moving in a room.

<details class="question">
<summary>
How does a PIR motion sensor sense people moving in a room?
</summary>
A PIR sensor detects changes in emitted heat in the room, which it assumes comes from people moving in the room.
</details>

<details class="question">
<summary>How might a sound sensor sense people moving in a room?</summary>
A sound sensor might sense people moving in a room by detecting loud noises, or by detecting particular types of noises that are characteristic of humans moving in a room.
</details>

These two sensors have very different characteristics:

The PIR has a very low amount of noise, and false positives are rare unless there are animals in the room. However, false negatives are less rare, there are quite a few ways in which it can fail to fire. It also only gives an on/off response, so if we want a more nuanced idea of how likely it is that there is a person in the room, we cannot easily get that with the PIR sensor. The PIR is however very low power and requires little processing to interpret.

The sound sensor in contrast has a lot of high-frequency noise, and needs a lot of filtering to be usable in this kind of situation. However it can give a nuanced idea of how much sound is being made in the room and thus how likely it is that someone is moving in the room. The accuracy of this sensor is likely to be quite low though, with a balance to be made between false positives and negatives.

One way to combine these sensors would be to first estimate the probability that the quantity and type of sound we are sensing is related to a person, then use the two sensors to create an overall probability of a person being in the room like so:

```python
if PIR==1:
    # if the PIR fires, there is definitely
    # someone in the room
    probability_person=1
else:
    # otherwise we return our sound sensor 
    # based probability
     probability_person=sound_probability
```
Thus we use the very low false negative rate of the PIR, and back it up with the sound sensor to catch anyone who manages to avoid the PIR sensor. Depending on the relative importance of false positives and false negatives to us, we can place a threshold on the final probability to adjust how sensitive the system is.


# Different ranges

Further to this, different sensors can have different ranges. A very common version of this is in 'high dynamic range' photography, which is often achieved by taking two different exposures, one longer (and hence brighter) than the other. This allows one cheap standard camera sensor to sense a much wider range of light and dark colours than otherwise, at the expense of potential issues with anything that moves during the two exposures.

Going to our sound and PIR based intruder detection system, we can see that the two sensors have different physical ranges. For example, if you look at figure <span class="nextfig"></span> you can see a simple room. If we place a PIR and sound sensor on the back wall, we can see that the PIR sensor gives good coverage for the majority of the room, except for close to the the wall, including where the person is working. If you used this PIR sensor to control automatic lights, the person in the office would get annoyed every time they sat still for a long time and the lights turned off. This setup is in most of the offices in the Computer Science building, and it is very annoying if you happen to be assigned a desk out of the PIR range. Adding a sound sensor has the potential to offer coverage of all areas of the room, but with less accuracy and a higher risk of false positives. Click on buttons below the image in Figure <span class="nextfig"></span> to see the different ranges in my super-shiny . 

<figure>
    <img id="roomlit" src="{{'/images/room-lit.jpg' | relative_url }}" alt="The example room" title="The example room" style="display:block"/>
    <img id="roompir" src="{{'/images/room-pir.jpg' | relative_url }}" alt="The range of a PIR in the example room" title="The PIR range" style="display:none" />
    <img id="roomsnd" src="{{'/images/room-sound.jpg' | relative_url }}" alt="The range of a sound sensor in the example room" style="display:none" title="The sound range" />
    <div class="switcher">
    <button id="roomlit_button" onclick="rangeImage('roomlit')">Room</button>
    <button id="roompir_button" onclick="rangeImage('roompir')">PIR range</button>
    <button id="roomsnd_button" onclick="rangeImage('roomsnd')">Sound range</button>
    </div>

    <figcaption>An example room showing physical ranges of a PIR and a sound sensor</figcaption>
</figure>
<script>
function rangeImage(imgName)
{
    const range_images=["roomlit","roompir","roomsnd"];
    range_images.forEach((x)=>{
        const el=document.getElementById(x);
        const button=document.getElementById(x+"_button");
        if(imgName==x)
        {
            el.style.display="block";
            button.disabled=true;
        }else
        {
            el.style.display="none";
            button.disabled=false;
        }
    });
}
rangeImage("roomlit")
</script>

# Sensors may sense different aspects of the same situation

In previous years, several students built systems to track cycling. They were aiming to essentially use sensors to understand the situation of riding a bike. Multiple sensors may allow us to more fully understand the whole situation. For example, one project looked at extreme downhill mountain biking. They wanted to understand a range of things about their rides, which we list below. For each one, you can consider what sensors might be useful for it (and click to open to see what I think.) 

<details class="question">
<summary>
How fast is the bike going, and how far has the rider gone?
</summary>
People did this with a magnet on the wheel and a magnetic switch. By counting how often the switch activated, they could estimate distance travelled quite accurately. One student also used a GPS to estimate speed and distance.
</details>

<details class="question">
<summary>
How bumpy is the terrain?
</summary>
Two possible sensors here, firstly an accelerometer, which can give a good estimate of how much vibration the bike is experiencing, and secondly, a tilt switch; this contains a small metal ball in a tube which when it is tilted one way makes contact across a switch, and when tilted the other way breaks the contact. The tilt switch can be used to estimate how much rattling is occurring by mounting vertically and considering how much the ball is being thrown up off the switch by the bike rattling. This is likely to be less accurate, but it is a very low power and cheap sensor which requires minimal processing.
</details>

<details class="question" markdown=1>
<summary markdown=0>How about 'air time' (how long a rider is in the air over a jump)?
</summary>
The accelerometer was used for this, because when the sensor is in freefall, i.e. it is purely being affected by the force of gravity, it reports an acceleration of roughly zero.
</details>

# Multiple of the same sensors to better understand a situation...

Sometimes we just need a load of the same sensors to understand a situation. For example some motion capture suits such as [Rokoko's smartsuit]https://www.rokoko.com/products/smartsuit-pro) use a large number of identical accelerometer/gyroscope sensors placed at a range of places across the body.

One idea from previous years is to consider what would happen if we had multiple motion sensors in a public toilet. This was inspired by a cartoon by Gary Larson [which I can only link to](https://s3-eu-west-1.amazonaws.com/media.unbound.co/p/images/1459/original/a72a80fd9c449fda51c0931d3387a35d.jpg?1427981425), in which he invents a public "DIDN'T WASH HANDS" alarm which goes off when someone leaves the bathroom without washing their hands.

This creates an interesting, although maybe ill-advised idea, of putting sensing in a toilet, which is useful to consider as a thought experiment. We note that many toilets including those in Nottingham University buildings have motion sensors for lights and auto-flushing systems; what we are considering here is what would happen if such sensors could be networked and analysed to better understand the toilet usage situation.



<details class="question">
<summary>
Where might we place motion sensors in a public bathroom?</summary>
</details>

{%include figure.html url="/images/toilet-sensors.jpg" alt="A toilet with PIR sensors everywhere" title="Toilet with PIR sensors" caption="The coloured lights show possible PIR sensor ranges in a public toilet." %}

Imagine we had all the sensors described in the answer above, and think about the questions below:

<details class="question">
<summary>
If we could use these sensors to detect whether people had washed their hands or not, would making a public "person has not washed their hands" alarm be a good idea? What would be the consequences of errors in our sensor interpretation here? Would we be best off aiming to reduce false positives or false negatives?
</summary>
A false positive here is a system publically announcing that someone is a dirty scuzzer who doesn't wash their hands after going to the loo, when they actually are perfectly sanitary in their behaviour. This would be embarassing and upsetting for people. A false negative in contrast would just mean one person was wandering around with dirty hands. As such, we really really would be better off trying as hard as possible to reduce false positives at the expense of making false negatives more likely.
</details>


<details class="question">
<summary>
What can't motion sensors detect about this situation which makes it hard to build the handwash alarm system with them?</summary>
Motion sensors can only detect that one or more people are moving in an area of the bathroom. They cannot detect how many people, or their identity. So it is likely that the system would fail either because it misidentified who didn't wash their hands, or because two people caused a sensor to trigger and it only registered that as one handwash visit.
</details>

Whilst the handwash alarm is probably a bad idea, there might be wider usefulness of motion sensing in toilet cubicles.

<details class="question">
<summary>
What might it mean if the usage pattern of one toilet cubicle changes a lot? </summary>
If the usage of one toilet cubicle suddenly drops, this may mean that the toilet is blocked or broken, or otherwise dirty, and needs dealing with. Similarly if we have one cubicle that is in high usage, it may imply that neigbouring cubicles need a clean.
</details>

<details class="question">
<summary>
How else might toilet sensor data be useful in managing buildings and understanding their design? </summary>
If we know the usage of different cubicles or sinks in a bathroom, we could use this to identify potential for design improvements, such as reorganising the layout so that cubicles are more evenly used, or providing more cubicles in some bathrooms and reducing the size of others where usage levels suggest it is a good idea.
</details>

<details class="question">
<summary>
What are the ethical issues of sensing in bathrooms?
</summary>
I left this for you to think about... 
</details>