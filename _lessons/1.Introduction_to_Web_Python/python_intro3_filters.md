---
title: PyDocs - filters module
---
To use:
```python
import filters 

```

<div id="filters" class="moduletarget" markdown=1>
# Module filters
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
<div id="filters_HighPassFilter" class="classtarget" markdown=1>

# class filters.HighPassFilter 

```python
class HighPassFilter:
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

```
</div>
## Description
A class to perform simple first order high pass filtering on a sensor value
    
<a id="filters_HighPassFilter___init__" class="fntarget"></a>

## [*filters*](#filters).[*HighPassFilter*](#filters_HighPassFilter).__init__
```python
# filters.HighPassFilter.__init__
def __init__(
    self,
    alpha
)
```
Create a high pass filter object with a given alpha. 

You may want to calculate alpha based on cutoff frequency 
or time constant, in that case, you can use the static methods
`make_from_cutoff` and `make_from_time_constant` to make the filter
instead of using the constructor.
### Parameters
* **alpha**(*float)*
<br>    The filter constant alpha

### Returns
* **filter**(*HighPassFilter)*
<br>    A high pass filter object

<a id="filters_HighPassFilter_on_value" class="fntarget"></a>

## [*filters*](#filters).[*HighPassFilter*](#filters_HighPassFilter).on_value
```python
# filters.HighPassFilter.on_value
def on_value(
    self,
    value_in
)
```
Process a new value with this filter object and return the output value
### Parameters
* **value_in**(*float)*
<br>    Input value to filter

### Returns
* **filtered_value**(*float)*
<br>    Filter output value

<a id="filters_HighPassFilter_make_from_cutoff" class="fntarget"></a>

## [*filters*](#filters).[*HighPassFilter*](#filters_HighPassFilter).make_from_cutoff
```python
# filters.HighPassFilter.make_from_cutoff
@staticmethod
def make_from_cutoff(
    cutoff_frequency,
    time_between_samples
)
```
Make a high-pass filter with this cutoff frequency.
### Parameters
* **cutoff_frequency**(*float)*
<br>    Cutoff frequency in HZ
* **time_between_samples**(*float)*
<br>    seconds between samples

### Returns
* **filter**(*HighPassFilter)*
<br>    High-pass filter object

<a id="filters_HighPassFilter_make_from_time_constant" class="fntarget"></a>

## [*filters*](#filters).[*HighPassFilter*](#filters_HighPassFilter).make_from_time_constant
```python
# filters.HighPassFilter.make_from_time_constant
@staticmethod
def make_from_time_constant(
    time_constant,
    time_between_samples
)
```
Make a high-pass filter with a particular time constant
### Parameters
* **time_constant**(*float)*
<br>    Time constant in seconds
* **time_between_samples**(*float)*
<br>    Seconds between samples

### Returns
* **filter**(*HighPassFilter)*
<br>    High-pass filter object

<div id="filters_LowPassFilter" class="classtarget" markdown=1>

# class filters.LowPassFilter 

```python
class LowPassFilter:
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

```
</div>
## Description
A class to perform simple first order lowpass filtering on a sensor value
<a id="filters_LowPassFilter___init__" class="fntarget"></a>

## [*filters*](#filters).[*LowPassFilter*](#filters_LowPassFilter).__init__
```python
# filters.LowPassFilter.__init__
def __init__(
    self,
    alpha
)
```
Create a low pass filter object with a given alpha. 

You may want to calculate alpha based on cutoff frequency 
or time constant, in that case, you can use the static methods
`make_from_cutoff` and `make_from_time_constant` to make the filter
instead of using the constructor.
### Parameters
* **alpha**(*float)*
<br>    The filter constant alpha

### Returns
* **filter**(*LowPassFilter)*
<br>    A low pass filter object

<a id="filters_LowPassFilter_on_value" class="fntarget"></a>

## [*filters*](#filters).[*LowPassFilter*](#filters_LowPassFilter).on_value
```python
# filters.LowPassFilter.on_value
def on_value(
    self,
    value_in
)
```
Process a new value with this filter object and return the output value
### Parameters
* **value_in**(*float)*
<br>    Input value to filter

### Returns
* **filtered_value**(*float)*
<br>    Filter output value

<a id="filters_LowPassFilter_make_from_cutoff" class="fntarget"></a>

## [*filters*](#filters).[*LowPassFilter*](#filters_LowPassFilter).make_from_cutoff
```python
# filters.LowPassFilter.make_from_cutoff
@staticmethod
def make_from_cutoff(
    cutoff_frequency,
    time_between_samples
)
```
Make a low-pass filter with this cutoff frequency .
### Parameters
* **cutoff_frequency**(*float)*
<br>    Cutoff frequency in HZ
* **time_between_samples**(*float)*
<br>    Seconds between samples

### Returns
* **filter**(*LowPassFilter)*
<br>    Low-pass filter object

<a id="filters_LowPassFilter_make_from_time_constant" class="fntarget"></a>

## [*filters*](#filters).[*LowPassFilter*](#filters_LowPassFilter).make_from_time_constant
```python
# filters.LowPassFilter.make_from_time_constant
@staticmethod
def make_from_time_constant(
    time_constant,
    time_between_samples
)
```
Make a low-pass filter with a particular time constant.
### Parameters
* **time_constant**(*float)*
<br>    Time constant in seconds
* **time_between_samples**(*float)*
<br>    Seconds between samples

### Returns
* **filter**(*LowPassFilter)*
<br>    Low-pass filter object

<div id="filters_MedianFilter" class="classtarget" markdown=1>

# class filters.MedianFilter 

```python
class MedianFilter:
    # Create a median filter object with a given block size
    def __init__(self,block_size)

    # Process a new value with this filter object and return the output value
    def on_value(self,new_value)

```
</div>
## Description
A class to perform median filtering on a sensor value

    
<a id="filters_MedianFilter___init__" class="fntarget"></a>

## [*filters*](#filters).[*MedianFilter*](#filters_MedianFilter).__init__
```python
# filters.MedianFilter.__init__
def __init__(
    self,
    block_size
)
```
Create a median filter object with a given block size
### Parameters
* **block_size**(*int)*
<br>    The number of previous samples that we take a median over

<a id="filters_MedianFilter_on_value" class="fntarget"></a>

## [*filters*](#filters).[*MedianFilter*](#filters_MedianFilter).on_value
```python
# filters.MedianFilter.on_value
def on_value(
    self,
    new_value
)
```
Process a new value with this filter object and return the output value
### Parameters
* **value_in**(*float)*
<br>    Input value to filter

### Returns
* **filtered_value**(*float)*
<br>    Median of current sliding buffer

<div id="filters_SlidingAverageFilter" class="classtarget" markdown=1>

# class filters.SlidingAverageFilter 

```python
class SlidingAverageFilter:
    # Create a sliding average object with a given block size
    def __init__(self,block_size)

    # Process a new value with this filter object and return the output value
    def on_value(self,new_value)

```
</div>
## Description
A class to perform a sliding average (mean)
on a sensor value
<a id="filters_SlidingAverageFilter___init__" class="fntarget"></a>

## [*filters*](#filters).[*SlidingAverageFilter*](#filters_SlidingAverageFilter).__init__
```python
# filters.SlidingAverageFilter.__init__
def __init__(
    self,
    block_size
)
```
Create a sliding average object with a given block size
### Parameters
* **block_size**(*int)*
<br>    The number of previous samples that we sliding average over

<a id="filters_SlidingAverageFilter_on_value" class="fntarget"></a>

## [*filters*](#filters).[*SlidingAverageFilter*](#filters_SlidingAverageFilter).on_value
```python
# filters.SlidingAverageFilter.on_value
def on_value(
    self,
    new_value
)
```
Process a new value with this filter object and return the output value
### Parameters
* **value_in**(*float)*
<br>    Input value to filter

### Returns
* **filtered_value**(*float)*
<br>    Mean of current sliding average buffer

<div id="filters_BlockMeanFilter" class="classtarget" markdown=1>

# class filters.BlockMeanFilter 

```python
class BlockMeanFilter:
    # Process a new value with this filter object and return the output value
    def on_value(self,new_value)

```
</div>
## Description
A class to perform a mean (average) on blocks of sensor data

Sensor values are only output once per block_size input samples.
<a id="filters_BlockMeanFilter_on_value" class="fntarget"></a>

## [*filters*](#filters).[*BlockMeanFilter*](#filters_BlockMeanFilter).on_value
```python
# filters.BlockMeanFilter.on_value
def on_value(
    self,
    new_value
)
```
Process a new value with this filter object and return the output value
### Parameters
* **value_in**(*float)*
<br>    Input value to filter

### Returns
* **filtered_value**(*float)*
<br>    Mean of the current block, or None if we are mid-block

<div id="filters_BlockMedianFilter" class="classtarget" markdown=1>

# class filters.BlockMedianFilter 

```python
class BlockMedianFilter:
    # Process a new value with this filter object and return the output value
    def on_value(self,new_value)

```
</div>
## Description
A class to perform a median over blocks of sensor values.

Sensor values are only output once per block_size input samples.
<a id="filters_BlockMedianFilter_on_value" class="fntarget"></a>

## [*filters*](#filters).[*BlockMedianFilter*](#filters_BlockMedianFilter).on_value
```python
# filters.BlockMedianFilter.on_value
def on_value(
    self,
    new_value
)
```
Process a new value with this filter object and return the output value
### Parameters
* **value_in**(*float)*
<br>    Input value to filter

### Returns
* **filtered_value**(*float or None)*
<br>    Median of the current block, or None if we are mid block

<div id="filters_BlockMaxFilter" class="classtarget" markdown=1>

# class filters.BlockMaxFilter 

```python
class BlockMaxFilter:
    # Process a new value with this filter object and return the output value
    def on_value(self,new_value)

```
</div>
## Description
A class to perform a maximum on blocks of data

Sensor values are only output once per block_size input samples.
<a id="filters_BlockMaxFilter_on_value" class="fntarget"></a>

## [*filters*](#filters).[*BlockMaxFilter*](#filters_BlockMaxFilter).on_value
```python
# filters.BlockMaxFilter.on_value
def on_value(
    self,
    new_value
)
```
Process a new value with this filter object and return the output value
### Parameters
* **value_in**(*float)*
<br>    Input value to filter

### Returns
* **filtered_value**(*float)*
<br>    Maximum of this block, or None if mid block

<div id="filters_BlockMinFilter" class="classtarget" markdown=1>

# class filters.BlockMinFilter 

```python
class BlockMinFilter:
    # Process a new value with this filter object and return the output value
    def on_value(self,new_value)

```
</div>
## Description
A class to perform a minimum on blocks of data

Sensor values are only output once per block_size input samples.
<a id="filters_BlockMinFilter_on_value" class="fntarget"></a>

## [*filters*](#filters).[*BlockMinFilter*](#filters_BlockMinFilter).on_value
```python
# filters.BlockMinFilter.on_value
def on_value(
    self,
    new_value
)
```
Process a new value with this filter object and return the output value
### Parameters
* **value_in**(*float)*
<br>    Input value to filter

### Returns
* **filtered_value**(*float or None)*
<br>    Minimum of this block, or None if mid block

<script src="{{'/assets/js/pydoclink.js'|relative_url}}"></script>
