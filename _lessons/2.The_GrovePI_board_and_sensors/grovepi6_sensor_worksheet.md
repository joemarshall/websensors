---
title: Lab Worksheet - Introduction to Grovepi 
---

In this worksheet you will learn the basics of using the grovepi boards and sensors.

The worksheet is split into multiple parts:
1. [Connect sensors, power and display to the grovepi board and start it up](#part1)
1. [Connect to the raspberry pi to run code using secure shell (SSH)](#part2)
1. [Copy code to the raspberry pi using secure file copy (SFTP / SCP) and run it.](#part3)
1. [Write code to view the data from some sensors.](#part4)
1. [Save the data from sensors to a data file and copy it back to your computer for analysis.](#part5)
1. [Run code against the grovepi emulator for testing purposes.](#part6)
1. [Use the grovepi emulator to automatically run code on the raspberry pi and capture output.](#part7)
1. [Run code on the websensors sensor emulation platform.](#part8)

Follow through the worksheet in order; if you have any problems please ask me for help. Each section consists of an introductory exercise, followed by a knowledge check exercise in which you are asked to put the knowledge you've learnt in the section to use.

You might want to keep the [sensor reference](grovepi5_sensor_index.html) open in another tab for quick reference while you work through this. 


<a id="part1"></a>
# Part 1 - Go and get a Raspberry Pi 
Before we can do anything at all, we need to get three things 
1. A raspberry pi (with attached grovepi board)
2. An LCD display with a grovepi cable
3. A usb power supply for the Raspberry Pi

Once you have these, plug the LCD display cable into the grovepi board. It needs to go in a socket which is marked `i2c`, i.e. i2c0 i2c1, i2c2. If you plug it into any other socket it will not work. This is a key concept for working with grovepi boards - you have to plug things into the correct type of socket. There are three main types, digital input/output, marked as `D1`, `D2`..., analog input, marked as `A0`, `A1`..., and I2C, marked as `I2C0`,`I2C1` etc. Each type of sensor connects to a specific type of port. 

Now plug the usb power supply into a socket, and plug the USB end into the Raspberry Pi board. 

If everything is working, you should see some green lights on the Raspberry Pi. If you then wait for a minute the LCD display should show some text. Wait until it says `W:` followed by an IP address (a series of 4 numbers separated by dots). If you get here, then you're ready to go to the next step.

This is a hardware course, using lots of components which are quite exposed, so things do break down. If the above doesn't happen, use the following troubleshooting advice to work out what is wrong. For each problem you have, try the troubleshooting steps in the order written below.


| Problem | Troubleshooting steps |
| --------| -----------------------|
|No lights on PI | Check that the plug socket works. Try another power supply. Try another Raspberry Pi|
|Nothing on display | Check the display is plugged into a port marked i2c. Reboot by unplugging and replugging USB cable. Change the wire for the display. Try another display. Try another Raspberry Pi|
|No wifi address found | Wait for 30 seconds. Reboot by unplugging and replugging USB cable. Try another Raspberry Pi.|

If you swap out a Raspberry Pi, display, or power supply, and that fixes the problem, please give us the non-working hardware to look at and fix.

## Knowledge Check

If you've got here, you basically know what the deal is, but maybe have a think about what each part is doing in this process - what is the USB cable doing? What is the purpose of the display? 

<a id="part2"></a>
# Part 2 - Connect to the Raspberry Pi to run code


In order to run python code on your Raspberry Pi, you need to connect to it. Because we use the Raspberry Pis without a screen, you have to connect to them over the network. We do this using a secure shell (SSH) program.

Firstly, make sure you have a secure shell program. If you're on Windows, you need something like [putty](https://www.putty.org/), which should be installed on the university computers, and is a free download for your own computer. If you're on Mac, you can use command line `ssh` in the terminal.

Note the network address on the screen of the raspberry Pi, it will be something like `10.154.1.222`, followed by `:w`. Ignore the `:w` bit, that just says that it is connected via WiFi.

Use your secure shell program to connect to it (either through the graphical interface you have installed, or if you're in a command shell type `ssh dss@10.154.1.222`. If you are asked about whether to accept the device certificate or something similar, click yes. When you are asked for a login, enter the username `dss` and the password `dss`. This should get you to a command prompt which ends in a `$`. You can run commands by typing the command followed by enter. 

Now try running the python interpreter by typing `python` and hitting enter.

This should show some text about python, followed by a `>>>` prompt. Enter the following python code here:

```
import grovelcd
grovelcd.setRGB(255,255,0)
```

The LCD screen should change colour to yellow.

Type `exit()` to leave python.

## Knowledge Check

Try to run some different python code, e.g. output 'hello world' somehow.

<a id="part3"></a>
# Part 3 - Copy code to the Raspberry Pi

Okay, so you can now run python code on the Raspberry Pi. But you don't want to have to type your code in every time, so you need some way to get code files across to the Pi. To do this, we us a secure file copy program (
/ SFTP). On Windows, I use [winscp](https://winscp.net/eng/index.php). On Mac, you can use [cyberduck](https://cyberduck.io/), or alternatively if you're happy with using the terminal, you can type `scp <source file> dss@<address>:`, e.g. `scp test.py dss@10.154.10.23:`. The **:** is important, because it tells scp that you're copying to a remote device. So, make sure you have access to something to do secure file copy. You also need a text editor. On Windows I use [notepad++](https://notepad-plus-plus.org/downloads/). 

In your text editor, make a file called `test.py`, and enter the following into it:
```
import grovelcd
grovelcd.setRGB(0,255,255)
```

**IMPORTANT NOTE ABOUT LINE ENDINGS ON WINDOWS** - You need to make sure that your text file is saved in unix compatible format, because Windows by default uses a different character code to end lines compared to Unix. In Notepad++, select `Edit`,`EOL Conversion` and `Unix` from the menu. On Mac you can ignore this because it uses Unix line endings anyway. Make sure you save the file after changing the line endings.

Copy the file to the Raspberry Pi, either using WinSCP/Cyberduck, or by typing `scp test.py dss@address:` in a terminal, then connect to the Pi using ssh as described above. At the prompt you see after logging in via ssh, type `python test.py`. With any luck the LCD screen should turn cyan (greeny-blue). If it doesn't look at the ssh window to see if any error messages have been printed.

If everything works, hooray, you've written a program on your computer, transferred it to the Raspberry Pi, and run it.

## Knowledge Check

Change your program (e.g. make it output something, or use different colour values or something), re-copy it to the Pi and run it again.

<a id="part4"></a>
# Part 4 - Let's read from some sensors

At this point, you will want to grab yourself a sensor or two. I suggest you grab a button to start with, because they're easy to change the value of, and maybe a rotary angle sensor (also known as a potentiometer). The button is a *digital* sensor, which outputs either 0 or 1 depending on whether it is pressed. The rotary sensor is an *analog* sensor, which outputs a number between 0 and 1023 depending on where it is twisted to.

Use grove cables to plug the rotary sensor into the first analog pin, labelled `A0` and plug the button into digital pin 4, labelled `D4`. Note: the cable ports on the grove board are typically referred to as *pins* because they connect to chip pins on the underlying board.

In your text editor, open a new python file (e.g. `my_lovely_sensors.py`) and enter some code into it.

First - we need to import the modules to read from sensors, and the time module, which allows us to pause python between sensor readings.
```
import sensors
import time
```

Then, we need to add some code to tell python which sensors we are using, and what we have connected them to.
```
# tell the sensor module which sensors
# we have attached to which pins
sensor_pins={ "button":4, # button on digital pin 4
          "rotary_angle":0} # rotary angle sensor on analog pin 0
sensors.set_pins(sensor_pins)
```
Next, we will write a loop which outputs the sensor values to the terminal every tenth of a second, continuing forever. You can press CTRL+C to stop the program running.
```
# print a nice header line so we know what each column of output is
print("time,button,rotary angle")
while True:    
    #read from the button
    b=sensors.button.get_level()
    #read from the angle sensor
    l= sensors.rotary_angle.get_level()
    # output everything to the terminal
    # sep=',' means to put commas between each value
    print(time.time(),b,l,sep=',')
    # read roughly ten times a second
    time.sleep(0.1)
```

That's all the code you need right now. Copy the program across to the Pi using scp / winscp / cyberduck, and connect to the Pi using secure shell. 

Run the program (`python my_lovely_sensors.py`). If you've done everything right, you should see numbers scrolling down the screen showing the current values of the sensors. If everything is working nicely, one of the numbers should change if you press the button, and the other should respond to changes of the rotary angle sensor. If the numbers aren't changing, check you've put the sensors into the correct ports on the GrovePi board.

## Knowledge Check

If that worked, try a different sensor - e.g. a light sensor. You will need to change the sensor_pins bit, and the sensors.<sensor_name> in the loop. Check out the 
[sensor reference](grovepi5_sensor_index.html) for names of sensors which we have and how to connect and access them.

<a id="part5"></a>
# Part 5 - Capture and Analyse some Sensor Data

You might have noticed in the previous step that sensor data goes quite quickly, and you can't necessarily see what it is doing in real-time. Often we want to capture sensor data and look at what it did and when. To do this, we need to be able to capture the output from our python program.

To do this, we need to *redirect* the output of the python to a file. We can do this using shell commands. The simplest way is by using the > operator. > tells the shell to take the output of a command and send it to a file. So, for example, if we want to send the output of our lovely sensor program to a file, we can do it like this:
```
python my_lovely_sensors.py > sensor_data.csv
```
If you run this, you will see nothing, because the output is redirected to the file, but it will keep running until you press CTRL+C to stop it. Press CTRL+C and type `ls`, and you should see a file called `sensor_data.csv`. If you type `cat sensor_data.csv`, you can see that it is packed full of lovely sensor data. 

By using a more advanced way of redirecting output, you can send the output to a file, whilst also seeing it on screen. to do this, you need to use a tool called `tee`, and the *pipe* operator `|`. The pipe operator takes the output of a program and sends it as input to another program. `tee` takes whatever is input to it, and both outputs it to screen, and writes it at the same time. 

Type the following into the secure shell:
```
python -u my_lovely_sensors.py | tee sensor_data2.csv
```
You should see sensor data coming down the screen until you press CTRL+C. When you stop, you should be able to see `sensor_data2.csv` has filled up with sensor data.

Note: the `-u` in the command above is needed, because when python sees it is writing to a pipe, by default it *buffers* output into big chunks, so you will only see sensor data after a whole load has been written. Adding `-u` forces python into *unbuffered* mode, where things are written to screen as soon as they are printed in python.

Now for the cool bit - using your secure copy program, copy the .csv file back from the Raspberry Pi to the computer. Then open a spreadsheet program such as Excel, and open the .csv file. Because we outputted our data separated by commas up above, we should be able to see the sensor data arranged neatly in columns in our spreadsheet. 

## Knowledge Check

At this point, try capturing some sensor data of you doing something, e.g. waving your hand in front of the light sensor, or making a loud noise next to the sound sensor. Copy it back off, open it up in a spreadsheet, and make a graph of the sensor values. See if you can see in the graph when you did the action. This kind of analysis is very common in initial development of sensor processing algorithms.

<a id="part6"></a>
# Part 6 - Run code on GrovePi Emulator

The GrovePi emulator allows you to run python code on your computer. You can get it from https://github.com/joemarshall/grovepi-emulator/releases if you want a pre-built version for Mac or Windows. Unzip the zip file and put it somewhere on your computer, and run `grovepiemu.exe`(Windows) or 'grovepiemu'(Mac). If you are running linux, clone the https://github.com/joemarshall/grovepi-emulator/ git repository and run using `python grovepiemu.py`.

When the emulator starts up, it shows three columns representing the digital, analog and I2C pins on a Grove board. Find D4 and right click on it and choose button. Then find A0 and select 'generic analog sensor' or 'light sensor'. You should then see a button widget for the button and a slider for the analog sensor. 

Below the sensors is a section titled 'Run python scripts'. Click the button that says 'Python load', and select the `my_lovely_sensors.py` file that you saved above. Now hit 'python start'. You should see the output from the python script in the 'GrovePI Python output' window. However the sensor values here are not captured from real sensors, they represent the current value set on the main emulator window. Try clicking the button in the D4 section, and you should see the values in the emulator output window changing. Move the slider in the A0 section and again it will change. This is running your python code against an emulated grovepi board. Try changing the python code - to reload the code you can just click 'Python start' and it will reload the same file and start running it again.

The emulator has another couple of other cool features that you need to know about - firstly, you can replay the real sensor values that you recorded in the previous section through the emulated grovepi. You do this using the "CSV Playback of sensor data" part of the main window. Click on 'file...' and select the CSV file you copied off previously, and then you can choose which column to map to what input. For this to work, you must **always** have a time column so that the replayer knows when to change the sensor values. Once you have done this, you can click the 'CSV Start' button to replay the sensor data through the emulated sensors. You should see things changing in the main window, and the python output window should show the replayed sensor values. Secondly, you can automatically capture output from the python script by clicking `capture script to file`, so you don't have to do anything cunning if you want to save the output.

## Knowledge Check

Run the emulator and capture your output whilst messing around with the sensors. Open up the CSV file you wrote in excel and graph it.

<a id="part7"></a>
# Part 7 - Use GrovePi emulator to run code on your Pi

As well as allowing you to emulate a Raspberry Pi + GrovePi on your computer, the emulator has one other super-handy feature, which is that it can run scripts remotely on the real raspberry pi, saving you the hassle of using SCP and SSH manually. To do this, select 'run on real Pi via SSH', and enter `dss@<adddress>`, where `<address>` is the address shown on the raspberry Pi screen at startup, e.g. `192.168.1.2`. This will automatically copy the python script to the Raspberry Pi, start it running, and show the output in the python output window. You can even automatically capture the script output to a CSV by clicking the `capture script to file` button.

When using the GrovePi emulator the workflow is much simpler than the manual copy script / run / copy data back cycle. With GrovePi emulator, all you need to do is connect it to the Pi, point it at your script and hit 'python start' (and optionally `capture script to file`). If you update your python code, you can just press `python start` and it will be copied over again and restarted once more.

## Knowledge Check

Alter your previous script to use a different sensor, run it on real Pi, and capture the data whilst you do an action near the sensor. Graph it and look and see what you can identify about the activity from the sensor data.


<a id="part8"></a>
# Part 8 - Run code on Websensors platform
The web-sensors platform is what makes all the little python boxes on this webpage work. It supports a subset of the functionality of the grovepi boards, but runs entirely in your web-browser. You can use it on the (scratchpad)[/scratchpad.md]

It supports a subset of sensors, specifically: light (emulated using camera), sound (emulated via microphone), accelerometer and gyroscope (on mobile devices only, using built in sensors).

Writing code for it is roughly the same as the code above, except that the pin numbers are ignored. The code below will work on websensors, on a real GrovePi board, or on the emulator. 

Websensors can be useful for testing things which require real-time interaction with sensor data at points when you have access to the sensors.

```
import sensors
import time

# tell the sensor module which sensors
# we have attached to which pins
sensor_pins={ "light":0, # light on analog pin 0
} 
sensors.set_pins(sensor_pins)
# print a nice header line so we know what each column of output is
print("time,light")
while True:    
    #read from the light sensor
    l = sensors.light.get_level()
    # output everything to the terminal
    # sep=',' means to put commas between each value
    print(time.time(),l,sep=',')
    # read roughly ten times a second
    time.sleep(0.1)
```

## Knowledge Check

Go the the websensors scratchpad, and try running the code above and capture its output. Try the same using the emulator to run it on a real GrovePi.

# Final knowledge check

Now you know how to write python code and run it on Raspberry Pi, on your computer, or on the web, here are a few final knowledge check activities:

1. Get one of the more complicated sensors, e.g. digital humidity and temperature (DHT), or accelerometer. Read the documentation on the [sensor reference](grovepi5_sensor_index.html) and try and write a script to output the data from the sensor.
2. The `graphs` module, (documented at [grovepi display](grovepi5_sensor_index.html)) lets you show little line graphs on the display (or in the browser in websensors). Try and use this to show a graph of some sensor data on your Raspberry Pi screen.
