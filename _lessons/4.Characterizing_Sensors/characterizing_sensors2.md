---
title: Limitations of analog to digital conversion
prev: characterizing_sensors1
next: characterizing_sensors3
uses_pyodide: true
uses_light: true
uses_maths: true
uses_audio: true
lesson_order: 3
sublesson_order: 2

---
Before we can use data from a sensor, the analog signal from a piece of electronics has to be converted into a digital signal suitable for processing by a computer. This process places fundamental limitations in the quality of the signal that gets to our software for processing.

An analog to digital converter (ADC) takes an analog voltage, and converts it into a digital value. These digital values are usually a fixed number of bits, for example audio signals are often converted to 8 or 16 bit integer values. For an N-bit signal, a sensor will be able to output a total of $$2^N$$ possible values.

For simple sensors, these N values will be split evenly across the input voltage range of the ADC, with for a 5v sensor, 0v from the sensor being 0 and 5v from the sensor being the highest possible value.

More recently for audio and video, 'high dynamic range' conversions have been developed, these use specialized analog to digital converters that can sense a wider range of values, which are often not evenly spaced, for example an HDR camera sensor may be able to sense differences between very dark blacks at high accuracy, but may have less accuracy at high brightnesses, or may output multiple sensor values at a range of brightness multipliers The outputs from these may still be integers, but representing non-linearly spaced values, or may be converted to floating point values to support very wide ranges of sensor values. HDR & floating point sensors are primarily beyond the range of this course, but it is useful to know that they exist.

# Sensor range

Assuming a fixed dynamic range sensor, such as a typical sound or light sensor, there is some kind of electrical circuit which outputs a voltage range depending on the sensed quantity. For example a light sensor may be implemented using a light dependent resistor in a simple voltage divider circuit. This voltage, which is within a fixed voltage range is then converted to digital using a analog to digital converter. 

The **output range** of a digital sensor reading is definined as the minimum and maximum values that can be read. For example if we have a 10 bit sensor, the range of output values is $$(0 - 1024)$$. This similarly can be mapped onto an **input range**, which is the largest physical quantity which produces the minimum output value, and the smallest physical value that produces the maximum output value. In almost all sensors, there are possible values for the physical quantity which fall outside the sensor's input range. This creates fundamental limitations as to what you can sense with a sensor.

For example, the code below shows the output of the light sensor, with the range artificially reduced. You can see when the range goes very low or high, it will 'clip', returning a constant minimum or maximum value, and not responding to any changes in the level below the minimum. This kind of clipping is typical for many sensors when they are used to sense quantities which are outside the expected input range. If you change the maximum and minimum values on the call to `clipped_level=clip_value(level,min_val=0.2,max_val=0.6)` you can see the difference that changes in sensor range have to how the clipped sensor (red on the graph) responds.

<script> makePyodideBox({codeFile:"range_limit.py",hasConsole:true,showCode:true,editable:true,hasGraph:true})</script>

What does this mean - this fundamental limit in sensor capability means that each sensor may be appropriate for only a certain range of inputs, which needs considering when using the sensors. For example in a previous year's coursework, a student wanted to sense changes in very bright light which caused the light sensor she was using to saturate. She solved this by covering the sensor with a tissue which reduced the amount of light hitting the sensor.

<details class="question">
<summary>
When might a small range be appropriate?
</summary>
If it is possible to achieve the task being performed using a sensor with a smaller range, they will often be chosen for reasons such as: 
* They are often cheaper to purchase.
* In many sensors there is a trade-off between range and sensitivity, meaning that we can very precisely determine values if we use a small range, but for a wider range the values we can sense are very broadly spaced. 
* In some situations we are only interested in whether a value is inside or outside a range. For example light sensors are commonly used to turn off lights when ambient light levels are high enough. These sensors can have a very constrained range, as the only need a maximum slightly above the target ambient light level and a minimum slightly below.
</details>

<details class="question">
<summary>
Why might we use a wide ranged sensor?
</summary>
Some tasks are impossible without a wide ranging sensor, this is because:
* We may not know the absolute value of the quantity we are sensing, e.g. if sensing changes in light level from the ambient light in a situation, the baseline absolute light level could be anything from zero to bright sunlight.
* We expect a wide range of different values in one situation.
* In some situations, saturating the sensor so that it clips could cause safety critical issues. For example in motion sensors used in aircraft and drones, the range of motion sensed will need to be quite high, as if the sensor clips, it can cause the flight controls to malfunction during extreme manoeuvres, which is exactly the point when it is vital they do not. When the same type of sensor is used on a mobile phone to detect which way up it is being held and rotate the screen accordingly, it will hopefully be exposed to a significantly lower range of motion, and in the case it fails, the worst case scenario is that the screen may be briefly displayed the wrong way round, so a lower range part can be used.
- In many tasks we really need the signal not to clip - for example clipping of audio signals is a problem, as it can cause seriously distorted sound.
</details>


# Sensor Resolution and Sensitivity

The **resolution** of a digital sensor refers to how many discrete levels of output it can produce. For example for a simple 16 bit sensor, there are $$2^16$$ possible outputs, which gives it a resolution of 65536 levels.

Along with the range, resolution can be related to the **sensitivity** of a sensor, which is the smallest possible change that can be measured using that sensor. For a sensor that reads linearly across the whole range, this is as simple as:

$$ sensitivity = \frac{range}{resolution} $$

The script below artificially limits the resolution of the input sensor value. You can see that when the resolution is too low, small variations in the signal are impossible to sense. Also, you can see what is called 'quantization error', where when the signal is close to one value it shifts up or down depending on slight variations in the input signal. This can be a real problem when using low resolution sensors to detect small variations in signal, such as when taking photos in low light with a digital camera. Try playing with this code (don't forget to stop and start to reload the file) by modifying the `step` value in the line `quantized_value=quantize_value(level,step=0.1)` and see how it affects the low resolution sensor output (red on the graph).

<script> makePyodideBox({codeFile:"precision_limit.py",hasConsole:true,showCode:true,editable:true,hasGraph:true})</script>

When you finish playing, try and answer the questions below (click to see the answer):

<details class="question">
<summary>
Why might we use a low resolution sensor?
</summary>
If it is possible to achieve the task being performed using a low resolution sensor, they will often be chosen for reasons such as: 
* They are often cheaper to purchase.
* They also may have reduced electrical power needs.
* They typically require a lower amount of computing power to process.
* In some sensors such as cameras, there is a trade-off between value resolution and temporal resolution (see below), meaning that the sampling rate can be made much higher if the resolution is reduced.
</details>

<details class="question">
<summary>
Why might we use a high resolution sensor?
</summary>
Some tasks are impossible without high resolution, this is because:
* We want to sense small changes in value which we cannot sense with a lower resolution sensor.
* The expected input range is very wide, meaning that without high resolution we cannot achieve high enough sensitivity.
* We are in a situation where the accuracy of measurements is key; for example in measurement of temperature for precise chemical engineering purposes it may be important to know the temperature to the nearest 0.01 degrees C, whereas if we are building a furnace, within the nearest 10C may be sufficient.

</details>

# Temporal resolution

Our final fundamental constraint of digital sensing is the temporal resolution at which the sensor is sampled. This relates to how quickly we read the sensor, and may be limited by factors such as:
- How long analog circuitry requires to achieve a stable voltage
- How long a sensor requires to send a signal out and get a response (e.g. in the case of ultrasonic distance sensors as used for car parking sensors)
- How fast our analog to digital converter can process inputs
- How fast our computer can run the software to process inputs
- How much battery we want to use. Particularly in embedded systems, battery life can be greatly extended by sleeping the system in between sensor reads; this means there will be a trade-off between long battery life and fast sampling of sensors.

Temporal resolution is typically referred to in terms of **sampling rate**, using the unit of samples per second, or Hertz (Hz).

Reducing the sampling rate reduces the amount of processing and electrical power required to run a system, however this is at the expense of making systems slower to respond to changes in sensors, or can make it harder to spot quick changes in sensed quantities. It can also make it harder to reduce errors caused by noise in the system (see next section for more on sensor noise).

In contrast, increasing the sampling rate requires an increased amount of processing and electrical power, but can make the system far more responsive to quick changes in the sensed quantity.

In the code below, the sound sensor is sampled with a delay of 0.1 seconds, meaning that it samples at just under 10 Hz (because the other code in the loop also takes time in addition to the delay it runs slightly slower than 0.1s per sample). Try changing the delay and look at how it responds to e.g. short sharp actions, or longer changes in value. You will see that when the delay is large (e.g. 1 second), short actions are entirely missed. Try putting in a 5 second delay and see how it looks. 

<script> makePyodideBox({codeFile:"sampling_frequency.py",hasConsole:true,showCode:true,editable:true,hasGraph:true})</script>

Think about the following questions and click to open my answer:

<details class="question">
<summary>
What could a very low sampling rate of sound level be useful for?
</summary>
If we want to create a sensor which estimates how noisy a room is throughout the week, and we want to use a very small amount of power, for example for creating an environmental sensor designed to be left for a long time running on battery power, we may be able to sample at a very low sampling rate, e.g. once per second. By averaging these values over a long time, e.g. over an hour, we can get a relatively good idea of how noisy a room has been in any particular hour of the week.
</details>

<details class="question">
<summary>
When might we need to sample sound quickly?
</summary>
If we want to detect short lived events, such as someone clapping, we will need to sample sound relatively quickly, requiring a higher sampling rate. We commonly also want to use sound sampling to record speech or music, these may require extremely fast sampling of sound (e.g. 48000Hz is relatively standard, 192000 Hz is used in audio production) in order to capture the full nuances of the incoming audio. 
</details>

# Non-linearity

For many sensors, what we get from the sensor is a simple voltage or some kind of number based on that voltage. For many sensors, the relationship between this number and the measured quantity is not a simple linear mapping. For example, many temperature sensors are based on the resistance of thermistors which are placed in a voltage divider circuit against a known resistance. This can be related to temperature by first calculating the resistance based on measured voltage after the voltage divider, and then calculating the temperature based on the known response of the sensor. For example for temperature sensors we used in previous years which report a ten bit value between 0 and 1023, and use a 10000 Ohm fixed resistor, the following calculations were used to estimate temperature in C:

$$ Resistance = 10,000*(1023-sensorVal)/sensorVal $$

$$ Temperature = 1/(ln(Resistance/10000)/3975+1/298.15)-273.15 $$ 

What is interesting here is that for such sensors, the sensitivity changes over the range - for this sensor, it is quite sensitive between 0 and 1000 degrees, but as the temperature moves outside that range it becomes increasingly less sensitive.

{%include figure.html url="/images/temperature_nonlinear.svg" alt="A graph of temperature sensor raw data versus centigrade shows how sensitivity is reduced at the extremes of the temperature range." title="Sensitivity is reduced at both ends of the temperature range." caption="Nonlinearity in temperature sensor data." %}
