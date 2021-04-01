import time
import sensors
import graphs
import random


def add_noise(input,noise_level):
    value= random.gauss(input,noise_level)
    if value<0: return 0
    if value>1: return 1
    return value

graphs.set_style("snd","rgb(0,0,0)",-.1,1.1)
graphs.set_style("noisy","rgb(255,0,0)",-.1,1.1)

while True:
    level=sensors.sound.get_level()
    noisy_value=add_noise(level,0.1)
    graphs.on_value("snd",level)
    graphs.on_value("noisy",noisy_value)
    print(level)
    time.sleep(.01)