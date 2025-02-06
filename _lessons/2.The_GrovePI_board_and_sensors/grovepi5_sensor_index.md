---
title: Sensor quick reference
---
This page lists the sensors that we have for the grovepi, along with code samples to read from each one.

# List of sensors
{% assign sensor_names="
<table>
<th>Sensor</th>
<th>Grove connection</th>
<th>Description</th>
" %}
{% capture sensor_descriptions %}

{%include sensor_description.md name="Button" pin="4" pintype="digital" abbreviation="b" pyname="button" comment="1 if button pressed, 0 otherwise" description="A simple push button, outputs 1 if it is pressed or 0 otherwise." shortdesc="Switches on when pushed" %}

{%include sensor_description.md name="Tilt switch" pin="4" pintype="digital" abbreviation="t" pyname="tilt" comment="1 if switch is tilted one way 0 otherwise" description="A tilt switch is a small tube with a ball bearing in. When it is tipped one way, the ball bearing contacts with the switch and the sensor outputs 1, otherwise it outputs 0." shortdesc="Switches on when tilted one way"%}

{%include sensor_description.md name="Passive infrared" pin="7" pintype="digital" abbreviation="m" pyname="pir" comment="1 if motion sensed, 0 otherwise" description="A passive infrared sensor (PIR) is designed to detect human motion in the area in front of the sensor. They are commonly used to switch security lights or burglar alarms. When someone moves in front of the sensor it outputs 1 for several seconds. When no motion is detected it outputs zero. 

One detail of this sensor is that there is a little 'jumper' on the board which is made of three pins with a little cap across two of them. If you move the cap so it is covering the central pin and the pin marked H, the PIR is set to retriggerable mode, which means the PIR will come on continually when motion is detected. In non-retriggerable mode (central pin and L) the PIR will turn on when motion is first detected, then turn off for a bit, rather than continually triggering. For many projects retriggerable mode makes most sense and is easiest to understand." shortdesc="Fires in response to human motion." %}

{%include sensor_description.md name="Ultrasonic Ranger" pin="6" pintype="digital" abbreviation="d" pyname="ultrasonic" comment="Distance in cm" description="The ultrasonic ranger detects the distance of objects in front of the sensor and returns the distance in centimetres. It is commonly used in car parking sensors. If no object is detected within the range (about 4-5 metres ish), it returns a very high value. It works by sending out pulses of ultrasound and measuring what time the pulse is reflected back. Because of this, reading the sensor takes some time (about 1/20th of a second), so using a lot of ultrasonic reads can slow down your sensor processing. The ultrasonic ranger is connected to a digital pin on the grovepi." shortdesc="Measures distance to the nearest object." %}

{%include sensor_description.md name="Digital humidity and temperature" pin="6" pintype="digital" abbreviation="t,h" pyname="dht" comment="temperature in degrees C, humidity as a percentage" description="The DHT sensor is a small chip which reads temperature in degrees C and humidity as a percentage. Due to the design of the sensor chip, you can only get a new value from this once every 2 seconds, so it is not necessary to read any faster from this sensor." shortdesc="Measures temperature in C and humidity percentage" %}

{%include sensor_description.md name="Rotary Angle" pin="2" pintype="analog" abbreviation="r" pyname="rotary_angle" comment="0 = anticlockwise fully, 1023= clockwise fully" description="A potentiometer / rotary angle sensor - turn the knob clockwise and it goes higher, turn it anticlockwise it goes lower. At the extreme anti-clockwise and clockwise ends of the rotation the value reaches 0 and 1023 respectively" shortdesc="Detects which way the knob is turned." %}



{%include sensor_description.md name="Light" pin="1" pintype="analog" abbreviation="l" pyname="light" comment="0 = dark, 1023= very bright" description="A light sensor - this outputs 0 in complete darkness, and higher values when light shines on the sensor. The absolute value of the sensor for any given light level can vary quite a lot between different sensor boards, and also depends on ambient temperature, so it is best to use this to detect changes, or broad levels of light, rather than to consider any particular number as meaning exactly the same light level" shortdesc="Measures amount of light" %}

{%include sensor_description.md name="Sound and Loudness" pin="0" pintype="analog" abbreviation="s" pyname="sound" comment="0 = quiet, 1023= very loud" description="The sound and loudness sensors both contain a microphone and convert the sound level at the microphone into a value between 0 and 1023, where 0 = silence and 1023 is extremely loud. Because of the nature of sound as a vibration, this often requires quite a lot of filtering to get a usable signal, because the sampling of the sound signal could hit anywhere on the sound wave. The loudness sensor has a little screwdriver potentiometer to adjust the microphone level, and also some very minor filtering which aims to make it better respond to sound loudness." shortdesc="Measures sound waves" %}

{%include sensor_description.md name="Analog temperature sensor" pin="1" pintype="analog" abbreviation="t" pyname="temperature_analog" comment="0 = very cold, 1023= very hot" description="The analog temperature sensor is a thermistor, a resistor which changes resistance depending on temperature. It outputs an arbitrary value between 0 and 1023, where higher values are hotter. The response of individual sensors varies enough that it is not easy to convert this value into an absolute value in C; if you want degrees C, you would probably be better off using the [DHT sensor](#digital-humidity-and-temperature)]." shortdesc="Responds to ambient temperature" %}

{%include sensor_description.md name="Accelerometer and Gyro" pin="0" pintype="i2c" description="There are two different accelerometer boards in our kits. If you only want to read from the accelerometer, then either board will work fine for you. The accelerometer tells you how much acceleration the board is undergoing, measured in m/s^2; because the accelerometer senses all acceleration, including  constant acceleration due to gravity of 9.8m/s^2 downwards, you can use this sensor to tell which way up the board is by looking at which way the gravity vector is pointing. You can also detect freefall by looking at the magnitude of the sensor; when a sensor is being dropped, it will have an accelerometer magnitude of roughly zero.

The accelerometer/gyro board also has a gyroscope sensor, which tells you how fast it is rotating around each axis. If you want to know which axis (x,y,z) is which on the board, there's a little diagram marked on each sensor board." shortdesc="Measures acceleration and rotation" examplecode='# accelerometer and gyro on any i2c pin
sensor_pins={ "accel":0,
"gyro":0}
sensors.set_pins(sensor_pins)
while True:
    # acceleration in x,y,z axes
    ax,ay,az=sensors.accel.get_xyz() 
    # magnitude of acceleration
    am = sensors.accel.get_magnitude() 
    # rotation around x,y,z axes
    rx,ry,rz=sensors.gyro.get_xyz() 
    # magnitude of rotation
    rm = sensors.gyro.get_magnitude()
    print(x,y,z,am,rx,ry,rz,rm) '
%}

{%include sensor_description.md name="Accelerometer and Magnetometer" pin="0" pintype="i2c" description="The accelerometer/magnetometer board has an accelerometer as described above. It also has a magnetometer, which detects the orientation and strength of the earth's magnetic field. This can be used as a compass, to tell which way the board is pointing in the world." shortdesc="Measures acceleration and magnetic field" examplecode=' # accelerometer and magnetometer on any i2c pin
sensor_pins={ "accel":0,
"magnetometer":0}
sensors.set_pins(sensor_pins)
while True:
    # acceleration in x,y,z axes
    ax,ay,az=sensors.accel.get_xyz()
    # magnitude of acceleration
    am = sensors.accel.get_magnitude()
    # magnetic field strength in x,y,z axes
    mx,my,mz=sensors.magnetometer.get_xyz() 
    # magnitude of magnetic field
    mm = sensors.magnetometer.get_magnitude()
    print(x,y,z,am,mx,my,mz,mm) '
%}

{% endcapture %}

{% assign sensor_names=sensor_names | append:"</table>" %}
<figure>
{{sensor_names}}
<figcaption>List of the grovepi sensors which we have. Click on the sensor name for more info</figcaption>
</figure>
{{ sensor_descriptions }}



