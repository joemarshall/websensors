---
title: Extra built in modules
---
The web python we use here has a bunch of useful built in modules for doing things like capturing, replaying and filtering sensor data.
These are also included on the Raspberry Pis we use in the lab sessions.

These pages contain documentation of the various modules. Click on function or class names for details of them.


<div id="speech" class="moduletarget" markdown=1>
# Module [speech](python_intro3_speech.html)
```python
# Say these words as text-to-speech
def say(words)

```
</div>
<div id="graphs" class="moduletarget" markdown=1>
# Module [graphs](python_intro3_graphs.html)
This module allows you to draw basic line graphs on the LCD screen, or on the web graph
if you are running inside websensors.
```python
# Set the style of a named graph in the output box.
def set_style(graphName,colour,minVal,maxVal,subgraph_x=None,subgraph_y=None)

# Add a value to a named graph in the output box
def on_value(graphName,value)

```
</div>
<div id="sensors" class="moduletarget" markdown=1>
# Module [sensors](python_intro3_sensors.html)
This module allows you to get data from sensors, and also to replay sensor data from pre-recorded csv files.
```python
# Set the mapping between grove board pins and sensor objects. On the web sensor platform this does nothing.
def set_pins(sensor_pin_mapping)

# Sleep until *delay* seconds after the last time this was called. 
def delay_sample_time(delay)

# Ultrasonic sensor
class UltrasonicSensor
    # Return the sensed distance in centimetres 
    def get_level(self)

    # Begin an ultrasonic read. Until you call the matching end_read, *DO NOT* get values from
    def begin_read(self)

    # Get the value of an ultrasonic read. Only call this after a begin_read call. If there is no
    def end_read(self)


# Accelerometer sensor
class AccelSensor
    # Get the acceleration of the device
    def get_xyz(self)

    # Get the magnitude of device acceleration.
    def get_magnitude(self)


# Magnetometer sensor
class MagnetometerSensor
    # Get the magnetic field strength from the device
    def get_xyz(self)

    # Get the magnitude of magnetic field strength
    def get_magnitude(self)


# Gyroscope sensor
class GyroSensor
    # Get the rotation of the device
    def get_xyz(self)

    # Get the magnitude of device rotation
    def get_magnitude(self)


# Replay pre-recorded sensor data from CSV files
class replayer
    # Restart the replay of data
    @staticmethod
    def reset()

    # Return the mapping of columns in the current CSV file
    @staticmethod
    def columns()

    # Load replay data from file. The replay data should be a CSV file which has a column for each sensor you are recording from.
    @staticmethod
    def init_replay(filename)

    # Return the name of the currently loaded replay file
    @staticmethod
    def get_replay_name()

    # Find out if there is replay data
    @staticmethod
    def has_replay()

    # Has replay finished yet?
    @staticmethod
    def finished()

    # Get a sample worth of sensor levels from the CSV file
    @staticmethod
    def get_level()


```
</div>
<div id="led" class="moduletarget" markdown=1>
# Module [led](python_intro3_led.html)
```python
# Turn an LED connected to digital pin number *pin* on
def on(pin)

# Turn an LED connected to digital pin number *pin* off
def off(pin)

```
</div>
<div id="filters" class="moduletarget" markdown=1>
# Module [filters](python_intro3_filters.html)
This module allows you to filter sensor data using various linear and non-linear filtering techniques.
```python
# A class to perform simple first order high pass filtering on a sensor value
class HighPassFilter
    # Create a high pass filter object with a given alpha. 
    def __init__(self,alpha)

    # Process a new value with this filter object and return the output value
    def on_value(self,value_in)

    # Make a high-pass filter with this cutoff frequency.
    @staticmethod
    def make_from_cutoff(cutoff_frequency,time_between_samples)

    # Make a high-pass filter with a particular time constant
    @staticmethod
    def make_from_time_constant(time_constant,time_between_samples)


# A class to perform simple first order lowpass filtering on a sensor value
class LowPassFilter
    # Create a low pass filter object with a given alpha. 
    def __init__(self,alpha)

    # Process a new value with this filter object and return the output value
    def on_value(self,value_in)

    # Make a low-pass filter with this cutoff frequency .
    @staticmethod
    def make_from_cutoff(cutoff_frequency,time_between_samples)

    # Make a low-pass filter with a particular time constant.
    @staticmethod
    def make_from_time_constant(time_constant,time_between_samples)


# A class to perform median filtering on a sensor value
class MedianFilter
    # Create a median filter object with a given block size
    def __init__(self,block_size)

    # Process a new value with this filter object and return the output value
    def on_value(self,new_value)


# A class to perform a sliding average (mean)
class SlidingAverageFilter
    # Create a sliding average object with a given block size
    def __init__(self,block_size)

    # Process a new value with this filter object and return the output value
    def on_value(self,new_value)


# A class to perform a mean (average) on blocks of sensor data
class BlockMeanFilter
    # Process a new value with this filter object and return the output value
    def on_value(self,new_value)


# A class to perform a median over blocks of sensor values.
class BlockMedianFilter
    # Process a new value with this filter object and return the output value
    def on_value(self,new_value)


# A class to perform a maximum on blocks of data
class BlockMaxFilter
    # Process a new value with this filter object and return the output value
    def on_value(self,new_value)


# A class to perform a minimum on blocks of data
class BlockMinFilter
    # Process a new value with this filter object and return the output value
    def on_value(self,new_value)


```
</div>
<script>window.isPydocIndex=true;</script>
<script src="{{'/assets/js/pydoclink.js'|relative_url}}"></script>
