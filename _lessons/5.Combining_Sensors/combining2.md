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

Going to our sound and PIR based intruder detection system, we can see that the two sensors have different physical ranges. For example, if you look at figure <span class="nextfig"></span> you can see a simple room. If we place a PIR and sound sensor on the back wall, we can see that the PIR sensor gives good coverage for the majority of the room, except for close to the the wall, including where the person is working. A sound sensor offers coverage of all areas of the room, but with less accuracy. Click on buttons below the image to see the different ranges.


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
