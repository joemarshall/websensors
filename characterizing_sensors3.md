---
title: Characterizing Sensors - Numerical error and noise
prev: characterizing_sensors2
next: characterizing_sensors4
uses_pyodide: true
uses_light: true
uses_maths: true
uses_audio: true
---
As well as the fundamental limits of analog to digital conversion, such as temporal resolution, sensitivity and range, sensors have further problems. Basically most sensors are really not very good at taking physical quantities and converting them to digital values. In this section, we discuss **numerical errors** that occur in sensor data. These are errors which cause the output to be incorrect or hard to interpret in a way which is describable by mathematical formulae.

# Noise

For many reasons, sensors may have 'noisy' input; what this means is that they fluctuate around the correct value. This noise is typically modelled as being a gaussian random distribution centred on the correct value. i.e.

$$ sensor_output = gaussian_random(true_value,noise_sd) $$

This can make it hard to know exactly what the true value is. 

<script> makePyodideBox({codeFile:"random_noise.py",hasConsole:true,showCode:true,editable:true,hasGraph:true})</script>


# Bias

# Accuracy and precision

# Non-linearity