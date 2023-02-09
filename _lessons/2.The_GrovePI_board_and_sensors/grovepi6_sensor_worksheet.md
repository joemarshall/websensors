---
title: Lab Worksheet - Introduction to Grovepi 
---

In this worksheet you will learn the basics of using the grovepi boards and sensors.

By the end of the worksheet you should be able to
- Connect sensors, power and display to the grovepi board and start it up.
- Connect to the raspberry pi to run code using secure shell (SSH)
- Copy code to the raspberry pi using secure file copy (SFTP / SCP)
- View the data from some sensors
- Save the data from sensors to a data file and copy it back to your computer for analysis
- Run code against the grovepi emulator for testing purposes
- Use the grovepi emulator to automatically run code on the raspberry pi and capture output
- Run code on the websensors sensor emulation platform

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

