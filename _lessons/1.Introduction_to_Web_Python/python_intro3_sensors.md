---
title: PyDocs - sensors module
---
To use:
```python
import sensors 

```

<div id="sensors" class="moduletarget" markdown=1>
# Module sensors
This module allows you to get data from sensors, and also to replay sensor data from pre-recorded csv files.
```python
# Accelerometer sensor
class accel
    # Get the acceleration of the device
    @staticmethod
    def get_xyz()

    # Get the magnitude of device acceleration.
    @staticmethod
    def get_magnitude()


# Gyroscope sensor
class gyro
    # Get the rotation of the device
    @staticmethod
    def get_xyz()

    # Get the magnitude of device rotation
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
<div id="sensors_accel" class="classtarget" markdown=1>

# class sensors.accel 

```python
class accel:
    # Get the acceleration of the device
    @staticmethod
    def get_xyz()

    # Get the magnitude of device acceleration.
    @staticmethod
    def get_magnitude()

```
</div>
## Description
Accelerometer sensor

This allows you to get the acceleration of a device in metres per second squared, along three axes, X, Y and Z, which for a phone 
are typically X,Y axes side to side and top to bottom on the screen, Z coming out of the screen. Be aware that in addition
to any motion of the phone, the accelerometer will pick up a constant $9.8 \frac{m/s}^2$ acceleration due to gravity.
<a id="sensors_accel_get_xyz" class="fntarget"></a>

## [*sensors*](#sensors).[*accel*](#sensors_accel).get_xyz
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

<a id="sensors_accel_get_magnitude" class="fntarget"></a>

## [*sensors*](#sensors).[*accel*](#sensors_accel).get_magnitude
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

<div id="sensors_gyro" class="classtarget" markdown=1>

# class sensors.gyro 

```python
class gyro:
    # Get the rotation of the device
    @staticmethod
    def get_xyz()

    # Get the magnitude of device rotation
    @staticmethod
    def get_magnitude()

```
</div>
## Description
Gyroscope sensor

This allows you to get the rotation of a device in radians per second, around three axes, X, Y and Z, which for a phone 
are typically X,Y axes side to side and top to bottom on the screen, Z coming out of the screen. 
<a id="sensors_gyro_get_xyz" class="fntarget"></a>

## [*sensors*](#sensors).[*gyro*](#sensors_gyro).get_xyz
```python
# sensors.gyro.get_xyz
@staticmethod
def get_xyz(
    
)
```
Get the rotation of the device

This is returned in terms of x,y and z axes
### Returns
* **x**(*float)*
<br>    x axis rotation in radians/s
* **y**(*float)*
<br>    y axis rotation in radians/s
* **z**(*float)*
<br>    z axis rotation in radians/s

<a id="sensors_gyro_get_magnitude" class="fntarget"></a>

## [*sensors*](#sensors).[*gyro*](#sensors_gyro).get_magnitude
```python
# sensors.gyro.get_magnitude
@staticmethod
def get_magnitude(
    
)
```
Get the magnitude of device rotation

If the device is still, this will be 0
### Returns
* **mag**(*float)*
<br>    magnitude of device rotation (i.e. sqrt(x^2+y^2+z^2))

<div id="sensors_sound" class="classtarget" markdown=1>

# class sensors.sound 

```python
class sound:
    # Get the level from the sound sensor. 
    @staticmethod
    def get_level()

```
</div>
## Description
Sound sensor

This returns the rough volume of the sound occurring in the vicinity of the device. On web based systems it is done using the built
in microphone. The scale is an arbitrary 0-1023 scale which is dependent on the microphone on your device, and
probably a bunch of other hardware and software things.
<a id="sensors_sound_get_level" class="fntarget"></a>

## [*sensors*](#sensors).[*sound*](#sensors_sound).get_level
```python
# sensors.sound.get_level
@staticmethod
def get_level(
    
)
```
Get the level from the sound sensor. 
### Returns
* **level**(*float)*
<br>    sound level ranging from 0 to 1023

<div id="sensors_light" class="classtarget" markdown=1>

# class sensors.light 

```python
class light:
    # Get the level from the light sensor
    @staticmethod
    def get_level()

```
</div>
## Description
Light sensor

This gets light levels from a camera or light sensor on your device. The scale is an arbitrary 0-1023 one 
dependent on the camera or sensor on your device, and probably a bunch of other hardware and software things. 
On non-chrome web browsers and iOS Chrome, this may be extremely innaccurate because they force automatic brightness adjustment.
<a id="sensors_light_get_level" class="fntarget"></a>

## [*sensors*](#sensors).[*light*](#sensors_light).get_level
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

<div id="sensors_replayer" class="classtarget" markdown=1>

# class sensors.replayer 

```python
class replayer:
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
## Description
Replay pre-recorded sensor data from CSV files

This class supports loading of CSV files into your code and replaying them. The actual CSV loading logic is done for you
when your script is started, you just need to check if there is any replay data and use it if so. For example you might
do this with a conditional if statement like this:

```python
if sensors.replayer.has_replay():
    this_time,x,y,z,sound = sensors.replayer.get_level("time","x","y","z","sound")
else:
    this_time=time.time()-start_time
    x,y,z=sensors.accel.get_xyz()
    sound=sensors.sound.get_level()
```
<a id="sensors_replayer_reset" class="fntarget"></a>

## [*sensors*](#sensors).[*replayer*](#sensors_replayer).reset
```python
# sensors.replayer.reset
@staticmethod
def reset(
    
)
```
Restart the replay of data
        
<a id="sensors_replayer_columns" class="fntarget"></a>

## [*sensors*](#sensors).[*replayer*](#sensors_replayer).columns
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

<a id="sensors_replayer_init_replay" class="fntarget"></a>

## [*sensors*](#sensors).[*replayer*](#sensors_replayer).init_replay
```python
# sensors.replayer.init_replay
@staticmethod
def init_replay(
    filename
)
```
Load replay data from file. The replay data should be a CSV file which has a column for each sensor you are recording from.
        
<a id="sensors_replayer_get_replay_name" class="fntarget"></a>

## [*sensors*](#sensors).[*replayer*](#sensors_replayer).get_replay_name
```python
# sensors.replayer.get_replay_name
@staticmethod
def get_replay_name(
    
)
```
Return the name of the currently loaded replay file
This is useful for example if you want to do different 
tests for different types of input data
<a id="sensors_replayer_has_replay" class="fntarget"></a>

## [*sensors*](#sensors).[*replayer*](#sensors_replayer).has_replay
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
        

<a id="sensors_replayer_finished" class="fntarget"></a>

## [*sensors*](#sensors).[*replayer*](#sensors_replayer).finished
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
        

<a id="sensors_replayer_get_level" class="fntarget"></a>

## [*sensors*](#sensors).[*replayer*](#sensors_replayer).get_level
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
    `sensors.replayer.get_level("time","sound","light")`

### Returns
* **columns**(*tuple)*
<br>    The value of each of the requested columns

<script src="{{'/assets/js/pydoclink.js'|relative_url}}"></script>
