import time
import sensors
import graphs

def clip_value(level,min_val,max_val):
    if level<min_val:
        return min_val
    if level>max_val:
        return max_val
    return level
graphs.set_style("snd","rgb(0,0,0)",-.1,1.1)
graphs.set_style("clipped_level","rgb(255,0,0)",-.1,1.1)

while True:
    level=sensors.sound.get_level()
    # artificially clip the sound sensor to within 0.2 - 0.6
    # try messing with the minimum and maximum values and clicking
    # start and stop to apply them
    clipped_level=clip_value(level,min_val=0.2,max_val=0.6)
    graphs.on_value("snd",level)
    graphs.on_value("clipped_level",clipped_level)
    print(level)
    time.sleep(.01)