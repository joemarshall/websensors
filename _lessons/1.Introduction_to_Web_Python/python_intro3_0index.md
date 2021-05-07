---
title: Extra built in modules
---
The web python we use here has a bunch of useful built in modules for doing things like capturing, replaying and filtering sensor data.

These pages contain documentation of the various modules. Click on function or class names for details of them.


<div id="graphs" class="moduletarget" markdown=1>
# Module graphs
```python
# Set the style of a named graph in the output box.
def set_style(graphName,colour,minVal,maxVal,subgraph_x=None,subgraph_y=None)

# Add a value to a named graph in the output box
def on_value(graphName,value)

```
</div>
<div id="sensors" class="moduletarget" markdown=1>
# Module sensors
```python
# Accelerometer sensor
class accel
    # Get the acceleration of the device
    @staticmethod
    def get_xyz()

    # Get the magnitude of device acceleration.
    @staticmethod
    def get_magnitude()


# Sound sensor
class sound
    # Get the level from the sound sensor. 
    @staticmethod
    def get_level()


# Light sensor
class light
    # Get the level from the light sensor
    @staticmethod
    def get_level()


# Replay pre-recorded sensor data from CSV files
class replayer
    # Restart the replay of data
    @staticmethod
    def reset()

    # Return the mapping of columns in the current CSV file
    @staticmethod
    def columns()

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
<div id="filters" class="moduletarget" markdown=1>
# Module filters
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
A module for making your computer (or phone) talk. Useful for getting output when you can't see the screen well.
<div id="speech" class="moduletarget" markdown=1>
# Module speech
```python
# Say the words 
def say(words)

```
</div>
<script>window.isPydocIndex=true;</script>
<script src="{{'/assets/js/pydoclink.js'|relative_url}}"></script>
