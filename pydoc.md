

# Module graphs 

<a id="graphs_set_style"></a>
{% highlight python %}
# graphs.set_style
def {% link index.md %}set_style(
    graphName,
    colour,
    minVal,
    maxVal,
    subgraph_x=<_ast.Constant object at 0x7fc982876670>,
    subgraph_y=<_ast.Constant object at 0x7fc982876e20>
)
{% endhighlight python %}
Set the style of a named graph in the output box.
### Parameters
* **graphName**(*str)*
<br>    The name of the graph, used to send values to it, and displayed on screen
* **colour**(*str)*
<br>    The colour of the line, can be in the format "rgb(0,255,0)" or "red", "blue" etc.
* **minVal**(*float)*
<br>    The value of the bottom of the graph
* **maxVal**(*float)*
<br>    The value of the top of the graph
* **subgraph_x**(*int, optional)*
<br>    If you set x subgraphs, the graph window will be split horizontally from 0 to the maximum subgraph you set.    
* **subgraph_y**(*int, optional)*
<br>    If you set y subgraphs, the graph window will be split vertically from 0 to the maximum subgraph you set.    

<a id="graphs_on_value"></a>
```python
# graphs.on_value
def on_value(
    graphName,
    value
)
```
Add a value to a named graph in the output box
### Parameters
* **graphName**(*str)*
<br>    The name of the graph, which should be the same as passed to set_graph_style
* **value**(*float)*
<br>    The value you want to add to the graph. If you add None, it doesn't change the graph, 
    this allows you to directly pass in the output of a \`BlockAverageFilter\` or similar 
    which return None when there is no new value.


# Module sensors 


## class sensors.accel 

```python
class accel:
    #Get the acceleration of the device
    @staticmethod
    def get_xyz()

    #Get the magnitude of device acceleration.
    @staticmethod
    def get_magnitude()

```
<a id="sensors_accel_get_xyz"></a>
```python
# sensors.accel.get_xyz
@staticmethod
def get_xyz(
    
)
```
Get the acceleration of the device

This is returned in terms of x,y and z axes
### Returns
* **x**(*float)*
<br>    x axis acceleration in m/s^2
* **y**(*float)*
<br>    y axis acceleration in m/s^2
* **z**(*float)*
<br>    z axis acceleration in m/s^2

<a id="sensors_accel_get_magnitude"></a>
```python
# sensors.accel.get_magnitude
@staticmethod
def get_magnitude(
    
)
```
Get the magnitude of device acceleration.

If the device is still, this will be 1G (about 9.8 m/s^2)
### Returns
* **mag**(*float)*
<br>    magnitude of device acceleration (i.e. sqrt(x^2+y^2+z^2))


## class sensors.sound 

```python
class sound:
    #Get the level from the sound sensor. 
    @staticmethod
    def get_level()

```
<a id="sensors_sound_get_level"></a>
```python
# sensors.sound.get_level
@staticmethod
def get_level(
    
)
```
Get the level from the sound sensor. 
### Returns
* **level**(*float)*
<br>    sound level ranging from 0 to 1


## class sensors.light 

```python
class light:
    #Get the level from the light sensor
    @staticmethod
    def get_level()

```
<a id="sensors_light_get_level"></a>
```python
# sensors.light.get_level
@staticmethod
def get_level(
    
)
```
Get the level from the light sensor
### Returns
* **level**(*float)*
<br>    light level ranging from 0 to 1


## class sensors.replayer 

```python
class replayer:
    #Restart the replay of data
    @staticmethod
    def reset()

    #Return the mapping of columns in the current CSV file
    @staticmethod
    def columns()

    #Find out if there is replay data
    @staticmethod
    def has_replay()

    #Has replay finished yet?
    @staticmethod
    def finished()

    #Get a sample worth of sensor levels from the CSV file
    @staticmethod
    def get_level()

```
<a id="sensors_replayer_reset"></a>
```python
# sensors.replayer.reset
@staticmethod
def reset(
    
)
```
Restart the replay of data
        
<a id="sensors_replayer_columns"></a>
```python
# sensors.replayer.columns
@staticmethod
def columns(
    
)
```
Return the mapping of columns in the current CSV file
### Returns
* **columns**(*map)*
<br>    list of column:index pairs

<a id="sensors_replayer_has_replay"></a>
```python
# sensors.replayer.has_replay
@staticmethod
def has_replay(
    
)
```
Find out if there is replay data

Returns True if there is a replay CSV file set up, false otherwise.
### Returns
* **has_csv**(*bool)*
<br>    True iff there is a replay CSV file.
        

<a id="sensors_replayer_finished"></a>
```python
# sensors.replayer.finished
@staticmethod
def finished(
    
)
```
Has replay finished yet?

Returns True if there are no more lines left in the CSV file
### Returns
* **finished_csv**(*bool)*
<br>    True iff the CSV file is finished
        

<a id="sensors_replayer_get_level"></a>
```python
# sensors.replayer.get_level
@staticmethod
def get_level(
    
)
```
Get a sample worth of sensor levels from the CSV file

This returns selected columns from a line in the CSV file and then moves onto the next line. This means that
if you want to read multiple columns, you have to do it in one call.
### Parameters
* ***col_names**(*tuple)*
<br>    Pass the list of column names that you want to read, e.g.
    \`sensors.replayer.get_level("time","sound","light")\`

### Returns
* **finished_csv**(*bool)*
<br>    True iff the CSV file is finished                


# Module filters 


## class filters.HighPassFilter 

```python
class HighPassFilter:
    #Create a high pass filter object with a given alpha. 
    def __init__(self,alpha)

    #Process a new value with this filter object and return the output value
    def on_value(self,value_in)

    #Make a high-pass filter with this cutoff frequency.
    @staticmethod
    def make_from_cutoff(cutoff_frequency,time_between_samples)

    #Make a high-pass filter with a particular time constant
    @staticmethod
    def make_from_time_constant(time_constant,time_between_samples)

```
<a id="filters_HighPassFilter___init__"></a>
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
\`make_from_cutoff\` and \`make_from_time_constant\` to make the filter
instead of using the constructor.
### Parameters
* **alpha**(*float)*
<br>    The filter constant alpha

### Returns
* **filter**(*HighPassFilter)*
<br>    A high pass filter object

<a id="filters_HighPassFilter_on_value"></a>
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

<a id="filters_HighPassFilter_make_from_cutoff"></a>
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

<a id="filters_HighPassFilter_make_from_time_constant"></a>
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


## class filters.LowPassFilter 

```python
class LowPassFilter:
    #Create a low pass filter object with a given alpha. 
    def __init__(self,alpha)

    #Process a new value with this filter object and return the output value
    def on_value(self,value_in)

    #Make a low-pass filter with this cutoff frequency .
    @staticmethod
    def make_from_cutoff(cutoff_frequency,time_between_samples)

    #Make a low-pass filter with a particular time constant.
    @staticmethod
    def make_from_time_constant(time_constant,time_between_samples)

```
<a id="filters_LowPassFilter___init__"></a>
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
\`make_from_cutoff\` and \`make_from_time_constant\` to make the filter
instead of using the constructor.
### Parameters
* **alpha**(*float)*
<br>    The filter constant alpha

### Returns
* **filter**(*LowPassFilter)*
<br>    A low pass filter object

<a id="filters_LowPassFilter_on_value"></a>
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

<a id="filters_LowPassFilter_make_from_cutoff"></a>
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

<a id="filters_LowPassFilter_make_from_time_constant"></a>
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


## class filters.MedianFilter 

```python
class MedianFilter:
    #Create a median filter object with a given block size
    def __init__(self,block_size)

    #Process a new value with this filter object and return the output value
    def on_value(self,new_value)

```
<a id="filters_MedianFilter___init__"></a>
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

<a id="filters_MedianFilter_on_value"></a>
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


## class filters.SlidingAverageFilter 

```python
class SlidingAverageFilter:
    #Create a sliding average object with a given block size
    def __init__(self,block_size)

    #Process a new value with this filter object and return the output value
    def on_value(self,new_value)

```
<a id="filters_SlidingAverageFilter___init__"></a>
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

<a id="filters_SlidingAverageFilter_on_value"></a>
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


## class filters.BlockMeanFilter 

```python
class BlockMeanFilter:
    #Process a new value with this filter object and return the output value
    def on_value(self,new_value)

```
<a id="filters_BlockMeanFilter_on_value"></a>
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


## class filters.BlockMedianFilter 

```python
class BlockMedianFilter:
    #Process a new value with this filter object and return the output value
    def on_value(self,new_value)

```
<a id="filters_BlockMedianFilter_on_value"></a>
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


## class filters.BlockMaxFilter 

```python
class BlockMaxFilter:
    #Process a new value with this filter object and return the output value
    def on_value(self,new_value)

```
<a id="filters_BlockMaxFilter_on_value"></a>
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


## class filters.BlockMinFilter 

```python
class BlockMinFilter:
    #Process a new value with this filter object and return the output value
    def on_value(self,new_value)

```
<a id="filters_BlockMinFilter_on_value"></a>
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


# Module speech 

