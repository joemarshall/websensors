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
# Set the mapping between grove board pins and sensor objects. On the web sensor platform this does nothing.
def set_pins(sensor_pin_mapping)

# Sleep until *delay* seconds after the last time this was called. 
def delay_sample_time(delay)

# Ultrasonic sensor
class UltrasonicSensor
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
<a id="sensors_set_pins" class="fntarget"></a>

# [*sensors*](#sensors).set_pins
```python
# sensors.set_pins
def set_pins(
    sensor_pin_mapping
)
```
Set the mapping between grove board pins and sensor objects. On the web sensor platform this does nothing.

Call this with a mapping like:
{ 
    "ultrasonic":3, # ultrasonic sensor on digital pin 3
    "gyro":0, # gyroscope on i2c port
    "sound":1 # sound sensor on analog pin 1
}

If you have two of any sensor, then you can add a number to the end of the name, like
"ultrasonic1":4 # ultrasonic sensor 1 on digital pin 4

Once this is called, sensor objects will be available as e.g. sensors.ultrasonic, sensors.gyro. For 
multiple of the same sensor, you can access them by the full name as e.g. sensors.ultrasonic1

Args:
    sensor_pin_mapping (dict): Dict mapping from sensor name to pin. Sensor names are:
        "light,temperature_analog,sound,rotary_angle" - sensors connected to an analog pin
        "gyro,accel,magnetometer,nfc" - sensors connected to an i2c port
        "pir,button,touch,dht,ultrasonic" - sensors connected to a digital port.

Raises:
    RuntimeError: Raised if an unknown sensor type is used.
<a id="sensors_delay_sample_time" class="fntarget"></a>

# [*sensors*](#sensors).delay_sample_time
```python
# sensors.delay_sample_time
def delay_sample_time(
    delay
)
```
Sleep until *delay* seconds after the last time this was called. 
This allows you to steadily sample at a given rate even if sampling
from your sensors takes some time.
<div id="sensors_UltrasonicSensor" class="classtarget" markdown=1>

# class sensors.UltrasonicSensor 

```python
class UltrasonicSensor:
    # Begin an ultrasonic read. Until you call the matching end_read, *DO NOT* get values from
    def begin_read(self)

    # Get the value of an ultrasonic read. Only call this after a begin_read call. If there is no
    def end_read(self)

```
</div>
## Description
Ultrasonic sensor

This sensor detects the distance to the nearest object in front of its beam. Because this is done
with ultrasonic pulses, the time to get a sample from this sensor is equal to roughly the time sound
takes to travel to and from the object. The maximum read distance is about 5 metres, which means that
a call to get_level can take up to 50-100ms to run, during which your code stalls.

If you want to dice with danger, this code also supports the begin_read and end_read methods. begin_read
sends out a pulse on the sensor. end_read checks if the response has come back yet, and returns None if 
it hasn't, or the value otherwise. In between calls to begin_read and end_read, your code can do anything 
*except* read from other sensors connected to the digital or analog pins on the grovepi board. Note, this 
means it is okay to read from sensors connected to the i2c ports, such as the accelerometer, gyro, 
magnetometer boards etc.
<a id="sensors_UltrasonicSensor_begin_read" class="fntarget"></a>

## [*sensors*](#sensors).[*UltrasonicSensor*](#sensors_UltrasonicSensor).begin_read
```python
# sensors.UltrasonicSensor.begin_read
def begin_read(
    self
)
```
Begin an ultrasonic read. Until you call the matching end_read, *DO NOT* get values from
any other sensors attached to the digital or analog pins of grovepi, or else *BAD THINGS* will
happen. There is *NO SAFETY CODE* stopping you doing bad things here. You may read accelerometers,
gyroscopes etc. to your hearts content though. This lets you combine ultrasonic pulses with high
speed accelerometer readings. 
<a id="sensors_UltrasonicSensor_end_read" class="fntarget"></a>

## [*sensors*](#sensors).[*UltrasonicSensor*](#sensors_UltrasonicSensor).end_read
```python
# sensors.UltrasonicSensor.end_read
def end_read(
    self
)
```
Get the value of an ultrasonic read. Only call this after a begin_read call. If there is no
response yet, it will return None, otherwise it returns the distance in centimetres where the ultrasonic
pulse bounced off an object. This always returns immediately and does not delay. 
<div id="sensors_AccelSensor" class="classtarget" markdown=1>

# class sensors.AccelSensor 

```python
class AccelSensor:
    # Get the acceleration of the device
    def get_xyz(self)

    # Get the magnitude of device acceleration.
    def get_magnitude(self)

```
</div>
## Description
Accelerometer sensor

This allows you to get the acceleration of a device in metres per second squared, along three axes, X, Y and Z, which for a phone 
are typically X,Y axes side to side and top to bottom on the screen, Z coming out of the screen. Be aware that in addition
to any motion of the phone, the accelerometer will pick up a constant $9.8 \frac{m/s}^2$ acceleration due to gravity.
<a id="sensors_AccelSensor_get_xyz" class="fntarget"></a>

## [*sensors*](#sensors).[*AccelSensor*](#sensors_AccelSensor).get_xyz
```python
# sensors.AccelSensor.get_xyz
def get_xyz(
    self
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

<a id="sensors_AccelSensor_get_magnitude" class="fntarget"></a>

## [*sensors*](#sensors).[*AccelSensor*](#sensors_AccelSensor).get_magnitude
```python
# sensors.AccelSensor.get_magnitude
def get_magnitude(
    self
)
```
Get the magnitude of device acceleration.

If the device is still, this will be 1G (about 9.8 m/s^2)
### Returns
* **mag**(*float)*
<br>    magnitude of device acceleration (i.e. sqrt(x^2+y^2+z^2))

<div id="sensors_MagnetometerSensor" class="classtarget" markdown=1>

# class sensors.MagnetometerSensor 

```python
class MagnetometerSensor:
    # Get the magnetic field strength from the device
    def get_xyz(self)

    # Get the magnitude of magnetic field strength
    def get_magnitude(self)

```
</div>
## Description
Magnetometer sensor

This allows you to get the magnetic field affecting a device along three axes, X, Y and Z, which for a phone 
are typically X,Y axes side to side and top to bottom on the screen, Z coming out of the screen. 
<a id="sensors_MagnetometerSensor_get_xyz" class="fntarget"></a>

## [*sensors*](#sensors).[*MagnetometerSensor*](#sensors_MagnetometerSensor).get_xyz
```python
# sensors.MagnetometerSensor.get_xyz
def get_xyz(
    self
)
```
Get the magnetic field strength from the device

This is returned in terms of x,y and z axes
### Returns
* **x**(*float)*
<br>    x axis magnetic field strength
* **y**(*float)*
<br>    y axis magnetic field strength
* **z**(*float)*
<br>    z axis magnetic field strength

<a id="sensors_MagnetometerSensor_get_magnitude" class="fntarget"></a>

## [*sensors*](#sensors).[*MagnetometerSensor*](#sensors_MagnetometerSensor).get_magnitude
```python
# sensors.MagnetometerSensor.get_magnitude
def get_magnitude(
    self
)
```
Get the magnitude of magnetic field strength
### Returns
* **mag**(*float)*
<br>    magnitude of device acceleration (i.e. sqrt(x^2+y^2+z^2))

<div id="sensors_GyroSensor" class="classtarget" markdown=1>

# class sensors.GyroSensor 

```python
class GyroSensor:
    # Get the rotation of the device
    def get_xyz(self)

    # Get the magnitude of device rotation
    def get_magnitude(self)

```
</div>
## Description
Gyroscope sensor

This allows you to get the rotation of a device in radians per second, around three axes, X, Y and Z, which for a phone 
are typically X,Y axes side to side and top to bottom on the screen, Z coming out of the screen. 
<a id="sensors_GyroSensor_get_xyz" class="fntarget"></a>

## [*sensors*](#sensors).[*GyroSensor*](#sensors_GyroSensor).get_xyz
```python
# sensors.GyroSensor.get_xyz
def get_xyz(
    self
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

<a id="sensors_GyroSensor_get_magnitude" class="fntarget"></a>

## [*sensors*](#sensors).[*GyroSensor*](#sensors_GyroSensor).get_magnitude
```python
# sensors.GyroSensor.get_magnitude
def get_magnitude(
    self
)
```
Get the magnitude of device rotation

If the device is still, this will be 0
### Returns
* **mag**(*float)*
<br>    magnitude of device rotation (i.e. sqrt(x^2+y^2+z^2))

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

\`\`\`python
if sensors.replayer.has_replay():
    this_time,x,y,z,sound = sensors.replayer.get_level("time","x","y","z","sound")
else:
    this_time=time.time()-start_time
    x,y,z=sensors.accel.get_xyz()
    sound=sensors.sound.get_level()
\`\`\`
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
    \`sensors.replayer.get_level("time","sound","light")\`

### Returns
* **columns**(*tuple)*
<br>    The value of each of the requested columns

<script src="{{'/assets/js/pydoclink.js'|relative_url}}"></script>
