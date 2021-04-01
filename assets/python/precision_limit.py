import time
import sensors
import graphs

# 'quantize' this value to have a minimum step size
# (precision) of 'step'
def quantize_value(level,step):
    return ((level+0.5*step)//step)*step

graphs.set_style("snd","rgb(0,0,0)",-.1,1.1)
graphs.set_style("quantized","rgb(255,0,0)",-.1,1.1)

while True:
    level=sensors.sound.get_level()
    # artificially make the sensor report values spaced 0.1
    # apart. Play with this to see the effect of more or
    # less resolution
    quantized_value=quantize_value(level,0.1)
    graphs.on_value("snd",level)
    graphs.on_value("quantized",quantized_value)
    print(level)
    time.sleep(.01)