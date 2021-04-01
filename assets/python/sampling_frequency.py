import time
import sensors
import graphs

graphs.set_style("snd","rgb(0,0,0)",-.1,1.1)

while True:
    level=sensors.sound.get_level()
    graphs.on_value("snd",level)
    print(level)
    # alter this line to change the sampling frequency
    # initially we sample at roughly 10Hz
    time.sleep(.1)