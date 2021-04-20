import time
import graphs
import sensors
graphs.set_style("snd","#000",0,1)
while True:
  level=sensors.sound.get_level()
  print(level)
  graphs.on_value("snd",level)
  time.sleep(0.01)
