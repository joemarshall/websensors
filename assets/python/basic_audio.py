import time
import graphs
import sensors
while True:
  level=sensors.sound.get_level()
  print(level)
  graphs.on_value("snd",level)
  time.sleep(0.01)
