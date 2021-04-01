import time
import sensors
import graphs
import random


def add_bias(input,bias):
    value= value+bias
    if value<0: return 0
    if value>1: return 1
    return value

graphs.set_style("snd","rgb(0,0,0)",-.1,1.1)
graphs.set_style("noisy","rgb(255,0,0)",-.1,1.1)

while True:
    level=sensors.sound.get_level()
    biased_value=add_bias(level,0.3)
    graphs.on_value("snd",level)
    graphs.on_value("bias",biased_value)
    time.sleep(.01)