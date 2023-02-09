---
title: Lab Worksheet - Introduction to Grovepi 
---

In this worksheet you will learn the basics of using the grovepi boards and sensors.

By the end of the worksheet you should be able to
- Connect sensors, power and display to the grovepi board and start it up.
- Connect to the raspberry pi to run code using secure shell (SSH)
- Copy code to the raspberry pi using secure file copy (SFTP / SCP) and run it.
- Write code to view the data from some sensors.
- Save the data from sensors to a data file and copy it back to your computer for analysis.
- Run code against the grovepi emulator for testing purposes.
- Use the grovepi emulator to automatically run code on the raspberry pi and capture output.
- Run code on the websensors sensor emulation platform.

Follow through the worksheet in order; if you have any problems please ask me for help.

You might want to keep the [sensor reference](grovepi5_sensor_index.html) open in another tab for quick reference while you work through this. 

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

# Part 2 - Connect to the Raspberry Pi to run code

In order to run python code on your Raspberry Pi, you need to connect to it. Because we use the Raspberry Pis without a screen, you have to connect to them over the network. We do this using a secure shell (SSH) program.

Firstly, make sure you have a secure shell program. If you're on Windows, you need something like [putty](https://www.putty.org/), which should be installed on the university computers, and is a free download for your own computer. If you're on Mac, you can use command line `ssh` in the terminal.

Note the network address on the screen of the raspberry Pi, it will be something like `10.154.1.222`, followed by `:w`. Ignore the `:w` bit, that just says that it is connected via WiFi.

Use your secure shell program to connect to it (either through the graphical interface you have installed, or if you're in a command shell type `ssh 10.154.1.222`. If you are asked about whether to accept the device certificate or something similar, click yes. When you are asked for a login, enter the username `dss` and the password `dss`. This should get you to a command prompt which ends in a `$`. You can run commands by typing the command followed by enter. 

Now try running the python interpreter by typing `python` and hitting enter.

This should show some text about python, followed by a `>>>` prompt. Enter the following python code here:

```
import grovelcd
grovelcd.setRGB(255,255,0)
```

The LCD screen should change colour to yellow.

Type `exit()` to leave python.

# Part 3 - Copy code to the Raspberry Pi

Okay, so you can now run python code on the Raspberry Pi. But you don't want to have to type your code in every time, so you need some way to get code files across to the Pi. To do this, we us a secure file copy program (SCP / SFTP). On Windows, I use [winscp](https://winscp.net/eng/index.php). On Mac, you can use [cyberduck](https://cyberduck.io/), or alternatively if you're happy with using the terminal, you can type `scp <source file> dss@<address>`, e.g. `scp test.py dss@10.154.10.23`. So, make sure you have access to something to do secure file copy. You also need a text editor. On Windows I use [notepad++](https://notepad-plus-plus.org/downloads/). 

In your text editor, make a file called `test.py`, and enter the following into it:
```
import grovelcd
grovelcd.setRGB(0,255,255)
```

**IMPORTANT NOTE ABOUT LINE ENDINGS ON WINDOWS** - You need to make sure that your text file is saved in unix compatible format, because Windows by default uses a different character code to end lines compared to Unix. In Notepad++, select `Edit`,`EOL Conversion` and `Unix` from the menu. On Mac you can ignore this because it uses Unix line endings anyway. Make sure you save the file after changing the line endings.

Copy the file to the Raspberry Pi, either using WinSCP/Cyberduck, or by typing `scp test.py dss@address` in a terminal, then connect to the Pi using ssh as described above. At the prompt you see after logging in via ssh, type `python test.py`. With any luck the LCD screen should turn cyan (greeny-blue). If it doesn't look at the ssh window to see if any error messages have been printed.

If everything works, hooray, you've written a program on your computer, transferred it to the Raspberry Pi, and run it.

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

Copy the program across to the Pi using scp / winscp / cyberduck, and connect to the Pi using secure shell. 

Run the program (`python my_lovely_sensors.py`). If you've done everything right, you should see numbers scrolling down the screen showing the current values of the sensors. If everything is working nicely, one of the numbers should change if you press the button, and the other should respond to changes of the rotary angle sensor. If the numbers aren't changing, check you've put the sensors into the correct ports on the GrovePi board.
