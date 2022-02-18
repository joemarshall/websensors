import time
import sensors
import graphs
import random


def add_bias(input,bias):
    value= input+bias
    if value<0: return 0
    if value>1023: return 1023
    return value

graphs.set_style("snd","rgb(0,0,0)",0,1024)
graphs.set_style("bias","rgb(255,0,0)",0,1024)

while True:
    level=sensors.sound.get_level()
    biased_value=add_bias(level,300)
    graphs.on_value("snd",level)
    graphs.on_value("bias",biased_value)
    time.sleep(.01)