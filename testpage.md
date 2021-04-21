---
title: "test sensors"
uses_pyodide: true
uses_audio: true
uses_accelerometer: true
uses_light: true 
---

<script>
makePyodideBox({codeString:`import time,sensors
while True:
    print(sensors.sound.get_level(),sensors.light.get_level(),sensors.accel.get_xyz())
    time.sleep(0.05)`,
hasConsole:true,hasGraph:true,showCode:true,editable:true,caption:"Put your code into here to test it"})
</script>


