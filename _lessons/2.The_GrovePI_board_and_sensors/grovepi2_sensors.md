---
title: Reading from sensors
---
In order to work with sensors on the GrovePi boards, you run python scripts which talk to the GrovePi using our custom sensor module.

This is largely compatible to the websensors module used on this site, with the addition of two things: Support for the wider range of sensors available for the GrovePi; a way to map pin numbers to a sensor, so that you can tell the sensors module what sensors you have plugged into the GrovePi and where.

The below is an example of some code which talks to two GrovePi sensors:
<figure markdown=1>

```python
import sensors
import time

# tell the sensor module which sensors
# we have attached to which pins
sensor_pins={ "button":4, # button on digital pin 4
          "light":0} # light on analog pin 0
sensors.set_pins(sensor_pins)          
# print a column header so data looks nice if we save it
print("time,button,light")
while True:    
    #read from the button
    b=sensors.button.get_level()
    #read from the light sensor
    l= sensors.light.get_level()
    # output to the terminal
    print(time.time(),b,l,sep=',')
    # read roughly ten times a second
    time.sleep(0.1)
```

<figcaption>Basic code to read from a button (on pin D4) and a light sensor (on pin A0)
</figcaption>
</figure>

Breaking this code down, we have several parts.

# Pin assignment

Firstly in our code, we call `sensors.set_pins` to tell the sensor module what pin each sensor is attached to. This takes a python dictionary, where the keys are sensor names, and the values are the pin to which that sensor is attached.

```python
# tell the sensor module which sensors
# we have attached to which pins
sensor_pins={ "button":4, # button on digital pin 4
          "light":0} # light on analog pin 0
sensors.set_pins(sensor_pins)          
```
If we want to use multiple of the same sensor type, we can append a number to the sensor name, e.g.
```python
sensor_pins={ "button":4, # button on digital pin 4,
          "button2":5, # button on digital pin 5  
          "light":0} # light on analog pin 0
sensors.set_pins(sensor_pins)
```

For a full list of available sensor types, see the [sensor quick reference page](grovepi5_sensor_index.md).

# Reading sensor data
```python
while True:    
    #read from the button
    b=sensors.button.get_level()
    #read from the light sensor
    l= sensors.light.get_level()
```
For each sensor that we assign in our pin assignment, the sensors module creates an accompanying object which can be used to get the value of the sensor. So if our pin assignment includes `"button":4`, we can call `sensors.button.get_level()` to get the current value of the sensor. Most sensors support one method, `get_level()`, with the exception of accelerometer, gyroscope and magnetometers, which support both `get_xyz()` to get the vector value `(x,y,z)` of the sensor, and `get_magnitude()` which returns the magnitude `sqrt(x*x+y*y+z*z)` of the current vector value.

If we have multiple identical sensors, we can refer to them by the number used in the pin assignment, for example if we used `"button2":5` to tell the module that we have a button on pin 5, we can call `sensors.button2.get_level()` to get the value of the button attached to pin 5.

# Displaying sensor data

```python
# print a column header so data looks nice if we save it
print("time,button,light")
while True:    
    ...
    # output to the terminal
    print(time.time(),b,l,sep=',')
```

In this script, we output the sensor values to the terminal using standard python print. It is worth noting a couple of details here: Firstly, we output values with a comma separating the values (`sep=','`), and print a similarly comma separated header at the top with names for each column. This *comma separated value (CSV)* format makes them easy to save and automatically parse in other software, for example for graphing in Excel or as input to other python scripts. Secondly, we always print out a timestamp using `time.time()`. This means that when looking at the data files, we know exactly when each sensor reading happened. This is useful for example if you alter data rate in your sensor processing algorithm, or if you use sensors such as ultrasonic transducers which take a long time to read, meaning that you have less control over exact data rate.

This will produce an output text that looks like:
```
time,button,light
1645737180.1929998,0,367
1645737180.299,0,366
1645737180.4129999,0,366
1645737180.5249999,0,365
1645737180.645,0,365
1645737180.757,0,361
1645737180.8769999,0,364
1645737180.987,0,364
1645737181.096,0,364
1645737181.205,0,365
1645737181.314,0,365
1645737181.421,0,363
1645737181.53,0,352
1645737181.64,1,265
1645737181.7500002,1,265
1645737181.8739998,1,265
1645737181.983,1,265
1645737182.094,1,265
1645737182.203,1,265
1645737182.311,0,324
1645737182.418,0,349
1645737182.529,0,361
```
A note about timestamps - the timestamps are in *unix time*, which is defined as *time in seconds since January 1, 1970, 00:00:00 (UTC)*. This is a standard that is used by almost all software, with the annoying exception of Microsoft Excel, which uses a non-standard definition of time as a number of days since some date. If you want dates to display nicely in Excel, you can convert from unix time to Excel time using the formula
`=A13/(60*60*24)+"1/1/1970"`, and then set the resulting column type to date.

# Timing and data rate

```python
while True:    
    ...
    # read roughly ten times a second
    time.sleep(0.1)
```
When we read from sensors, we usually don't want to read absolutely as fast as the sensor allows, as that would create an extremely large amount of data. The `time.sleep(0.1)` is used to control the *sampling rate* of our sensor processing. Note that in the comment I say that this will read *roughly* ten times a second. This is because the calls to read from sensors take a tiny and somewhat variable amount of time, so it will in reality read slightly slower than 10 times a second. Depending on how fast changing the sensors you are reading are likely to be, you may want to change this sleep value to read at a faster or slower rate.  