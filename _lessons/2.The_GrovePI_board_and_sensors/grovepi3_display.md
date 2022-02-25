---
title: The LCD Display
uses_pyodide: true
uses_audio: true
uses_light: true 

---

**Plug the display into an I2C port on the grovepi**

The Grove LCD Display that we use is a 16x2 character LCD screen. It has a backlight which can be set to any RGB colour, which can be useful for an easy to spot output from your algorithms when an event is sensed or something.

It also provides a small and poor quality implementation of the graph API  from the websensor platforms, to display small line graphs.

We provide a bunch of functions to use this display.

{%include figure.html url="/images/grove_screen.jpg" alt="The Grove display" title="Grove Display" caption="The Grove LCD display can show 2 lines of 16 characters of text." %}


# How to show text on the display

To write text onto the display, you can use the `grovelcd` module:

```
import grovelcd
grovelcd.setText("Hello world\nSecond Line")
```

# RGB backlight

The RGB backlight just lights up the whole LCD display with a colour. You can set it using the `grovelcd` module:

```
import grovelcd
# set backlight to RGB colour 
# (each of R,G and B range from 0-255)
grovelcd.setRGB(0,255,128) 
```

# Graph module

The graph module displays a simple line graph visualisation of values which are added to it. It supports options for splitting into subgraphs vertically and horizontally. On GrovePi, only 1 or 2 graphs per axis are supported, i.e. you can show up to a total of 4 graphs. On the web-sensor platform these are theoretically unlimited, although more than about 8 gets pretty hard to read.

To draw graphs, you first call `graphs.set_style(name,colour,min_val,max_val,subgraph_x=0,subgraph_y=0)` to tell the graphs module that you have a graph with a particular name, and set the minimum and maximum values for it. On GrovePi, the colour argument is ignored. Then for each value you want to add, you call `graphs.on_value(name,value)`. 

The below example demonstrates how to show two sensor values on a pair of graphs - it should work both in the browser and on a grovepi board.

<script>
makePyodideBox({
    codeString:`
# we use time.sleep for delay
import time    
# load the graphing module and sensors 
import graphs
import sensors
# if running on grovepi, sound is on A0, light is on A1
sensors.set_pins({"sound":0,"light":1})
# setup two graphs, one above the other
graphs.set_style("sound","rgb(255,255,0)",0,1024,subgraph_y=0)
graphs.set_style("light","rgb(0,255,0)",0,1024,subgraph_y=1)
while True:
    sound_level=sensors.sound.get_level()
    light_level=sensors.light.get_level()
    print(sound_level,light_level,sep=",")
    # send the levels to the graphs
    graphs.on_value("light",light_level)
    graphs.on_value("sound",sound_level)
    time.sleep(0.1)
`  ,hasConsole:true,hasGraph:true,showCode:true,editable:true,caption:"Show light and sound on a graph"})
</script>

