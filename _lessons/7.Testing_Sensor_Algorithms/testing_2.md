---
title: Capturing and Replaying Data
uses_pyodide: true
uses_audio: true
uses_accelerometer: true
uses_light: true 
uses_files: true
---

Before you do any testing, you will need to know how to capture and replay data from your scripts.

# Capturing data

When you want to store the output from your sensor python code, you can do this using the onedrive integration in the scratchpad webpage. Check it out in the code box below. If you login to onedrive using the button at the top, you can both load and save your code on your onedrive account, and also (and this is the key bit here), you'll find a checkbox at the bottom that says 'autosave data'. If you select this, then it will save the output of each run of the python to your onedrive in a folder you choose. The files are called 'output_DATE_TIME.csv', where DATE and TIME are the current date and time in Greenwich Mean Time.

# Always output your sensor data in CSV format

The files we output are called `.CSV`. This is because when you output sensor values from a script, you really should format your output as a CSV file.

A CSV file is a specially formatted text file which looks like this

```
column1,column2,column3
1,2,3
3,3,3
0,0,0
```
i.e. the first line is a comma separated list of column names, then the next lines are comma separated lists of the values of each column at each timepoint. You can output CSV really easily in python, by just putting `sep=','` on your print statements like this:

```python
# first output the header
print("sound","light","time",sep=',') 
while True:
    # output a line of sensor data, as CSV
    print(1,2,3,sep=',')
```

Why should you do this? The CSV format is a standard - it can be read by external programs such as excel if you want to graph your recorded data. Additionally, it can be used here for sensor data replay.

# What is sensor data replay?

You'll see a replay controller window on the code window below (and on the scratchpad). With this, you can send a .csv file into the sensors each time you run the code. This can be one you made yourself, or one you outputted from a previous bit of code.

The replay values come in to the special sensors.replayer sensor, with names based on the columns in the CSV file. You can get at them like this, by providing a list of columns:

```python
snd,light=sensors.replayer.get_level("sound","light")
```

You can also switch between replay and not replay by checking if a replay CSV is being passed in by the web page like so:
```python
REPLAY=sensors.replayer.has_replay()
```

Note: replay values are passed in as they were printed out, one line per call to replayer.get_level. This means two things:
1. Always call replayer.get_level once per iteration round the loop with all the columns you're interested in.
2. If you change the time.sleep, replay will happen faster. This can be useful for testing, but means that replays from things recorded with different sleep values will not work right.

# Why replay?
Replay is useful when developing sensor algorithms, because it allows you to see how your algorithm might perform against a pre-recorded set of data. You can then alter your algorithm and try again, and repeat this until you are happy with how the algorithm performs.

Have a play with replay using the script below. This script outputs two sensor values. It will automatically switch to CSV file if you put a CSV file into the replay box. You can save a CSV file from a run by clicking on the 'autosave output' checkbox and choosing a folder in your onedrive. Try recording a CSV file from this script to your onedrive, then opening it as the replay values. You should see that once you open a replay CSV, the script does the same thing every time rather than responding to the live sensors.

<script>
makeReplayController();
makePyodideBox({codeString:
`
import time
import sensors
REPLAY=sensors.replayer.has_replay()

# sep="," means to output in CSV format
print("sound","light",sep=",")
while True:
    if REPLAY:
        snd,light=sensors.replayer.get_level("sound","light")
    else:
        snd=sensors.sound.get_level()
        light=sensors.light.get_level()
    print(snd,light,sep=",")
    time.sleep(1)
`,
hasConsole:true,hasGraph:true,showCode:true,editable:true,showFileButtons:true,caption:"Put your code into here to test it"})
</script>

