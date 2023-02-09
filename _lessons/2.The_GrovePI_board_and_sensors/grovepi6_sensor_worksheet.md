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


If you swap out a Raspberry Pi, display, or power supply, and that fixes the problem, please give us the non-working hardware to look at.

# Part 2 - Connect to the Raspberry Pi to run code and copy files

In order to run python code on your Raspberry Pi, you need to connect to it. Because we use the Raspberry Pis without a screen, you have to connect to them over the network. We do this using a secure shell (SSH) program.

Firstly, make sure you have a secure shell program. If you're on Windows, you need something like [putty](https://www.putty.org/), which should be installed on the university computers, and is a free download for your own computer. If you're on Mac, you can either use command line `ssh` if you're happy with command line programs, or you can 

note the network address on the screen of the raspberry Pi, it will be something like `10.154.1.222`.

Then, use a secure shell program to connect to it.

