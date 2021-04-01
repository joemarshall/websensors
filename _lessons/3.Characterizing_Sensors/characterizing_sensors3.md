---
title: Numerical error and noise
prev: characterizing_sensors2
next: characterizing_sensors4
uses_pyodide: true
uses_light: true
uses_maths: true
uses_audio: true
lesson_order: 3
sublesson_order: 3

---
As well as the fundamental limits of analog to digital conversion, such as temporal resolution, sensitivity and range, sensors have further problems. Basically most sensors are really not very good at taking physical quantities and converting them to digital values. In this section, we discuss **numerical errors** that occur in sensor data. These are errors which cause the output to be incorrect or hard to interpret in a way which is describable by mathematical formulae.

# Noise

For many reasons, sensors may have 'noisy' input; what this means is that they fluctuate around the correct value. This noise is typically modelled as being a gaussian random distribution centred on the correct value. i.e.

$$ sensorOutput = trueValue + gaussianRandom(noiseSd) $$

This can make it hard to know exactly what the true value is because it is jumping around. In future sections we will cover filtering and thresholding approaches to dealing with this.

<script> makePyodideBox({codeFile:"random_noise.py",hasConsole:true,showCode:true,editable:true,hasGraph:true})</script>

<details markdown=1>
<summary>
Can you think of things that might cause noise?
</summary>
Random noise can be caused by a wide range of natural and electrical phenomena. Examples include:

* Noise in measurement circuits caused by power supplies, other connected circuits or radio frequency interference.
* Motion of the sensor causing electrical or physical disturbances.
* Fluctuations in how physically measured things hit the sensors; for example in cameras, there may be variation in how many photons hit a cell for a pixel, or in a sound level sensor, peaks in vibrations may hit the sensor in between sensor measurements.
</details>


# Bias

Bias is when a sensor is incorrect because it is offset by a particular amount. For example almost all temperature sensors have some level of bias, in that they are able to report temperature repeatably to within say 0.1C, but in many cases the sensor value reported is consistently off by up to +-1C.

$$ sensorOutput = trueValue + bias $$

<script> makePyodideBox({codeFile:"bias.py",hasConsole:true,showCode:true,editable:true,hasGraph:true})</script>

<details markdown=1>
<summary>
Can you think of things that might cause bias?
</summary>
Bias again has multiple sources; examples of things that cause bias include:

* Variations in manufacturing of circuits causing things like resistor values to vary slightly between sensors.
* Manufacturing variations which cause differences in how much the measured physical phenomenon affects the sensor, for example slight changes in the shape of microphones can affect their response.
* Damage to circuit or sensor, or physical wear of sensing elements. A basic example of this is seen in car speedometers, which slowly lose accuracy as the tyres wear down, and the circumference of the wheel reduces.
</details>

# Accuracy and precision

Typically sensors exhibit a mixture of bias and noise. One way of considering the characteristics of a sensor is in terms of the concepts of **accuracy** and **precision**. Accuracy relates to how close to the real-world value a sensor reports on average, i.e. to how lacking in bias the sensor is. Precision describes how repeatable measurements are, or how closely clustered together multiple measurements of the same underlying value will be. Low precision implies a large amount of noise in the signal. The figure below shows combinations of accuracy and precision. Often when choosing a sensor there may be different ways of measuring the same phenomenon some of which are more accurate, and some which are more precise; when choosing a sensor, we should consider which is most important for our application; or whether by combining multiple sensors we can achieve better accuracy and precision.

{%include figure.html url="/images/accuracy_vs_precision.svg" alt="A sensor is accurate if the average result is close to the correct value. A sensor is precise if the variation in output is small." title="When pinning the bow tie on the llama precisely, the positions are close together. When it is done accurately, the positions of the bow tie are centred around the correct position." caption="Precision and Accuracy in a game of Pin the Bow Tie on the Llama" %}

<details>
<summary>
When might precision be more important than accuracy?
</summary>
In many applications, we are more interested in changes in value than the raw value itself. For example we may want to know when the light level in a room changes quickly, and not care about the ambient light level which is affected by time of day and the weather outside. In such situations, using a very precise sensor can avoid false readings due to sensor noise, whilst we don't really care what the absolute value of the light level is.
</details>


<details markdown=1>
<summary>
When might accuracy be more important than precision?
</summary>
If we are sensing a very slow moving quantity, such as temperature, an accurate but very noisy signal may be acceptable, as we can capture and average a large number of samples to estimate the true average. Using temperature as an example, there are a range of situations where accuracy is very important, for example when working with chemicals close to their freezing or boiling points, we may wish to measure and control temperature extremely accurately.
</details>

The errors described on this page are primarily 'numerical' errors, in that they can be modelled as simple numerical transformations of the data. On the next page, we will explore a range of non-numerical sensor errors, that cannot be easily modelled with mathematical transformations. 