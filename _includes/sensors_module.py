""" This module allows you to get data from sensors, and also to replay sensor data from pre-recorded csv files.
"""
from contextlib import contextmanager
import re

def set_pins(sensor_pin_mapping:dict):
    for (sensorName,pin) in sensor_pin_mapping.items():
        sensorName=sensorName.lower()
        sensorName,sensorNum=re.match(r"(\D+)(\d*)",sensorName).groups()

        if sensorName not in globals():
            print(f"Warning: sensor {sensorName} is not supported on websensor platform")
            print(f"This code will only work to replay a CSV file")
        elif len(sensorNum)!=0:
            globals()[sensorName+sensorNum]=globals()[sensorName]


from math import sqrt
import io,csv
def on_sensor_event(event):
    name=event.name
    value=event.args
    if name=="gyro":
        gyro._on_rotation(value[0],value[1],value[2])
    elif name=="accel":
        accel._on_accel(value[0],value[1],value[2])
    elif name=="sound":
        sound._on_level(value[0])
    elif name=="light":
        light._on_level(value[0])
    elif name=="replayer":
        replayer._on_lines(value[0],value[1])            

class accel:
    """ Accelerometer sensor

    This allows you to get the acceleration of a device in metres per second squared, along three axes, X, Y and Z, which for a phone 
    are typically X,Y axes side to side and top to bottom on the screen, Z coming out of the screen. Be aware that in addition
    to any motion of the phone, the accelerometer will pick up a constant $9.8 \\frac{m/s}^2$ acceleration due to gravity.
    """
    _xyz=(0,0,0)
    @staticmethod
    def get_xyz():
        """ Get the acceleration of the device

        This is returned in terms of x,y and z axes

        Returns
        -------            
        x: float
            x axis acceleration in m/s^2
        y: float
            y axis acceleration in m/s^2
        z: float
            z axis acceleration in m/s^2
        """
        return accel._xyz
        
    @staticmethod
    def get_magnitude():
        """ Get the magnitude of device acceleration.
        
        If the device is still, this will be 1G (about 9.8 m/s^2)

        Returns
        -------
        mag: float
            magnitude of device acceleration (i.e. sqrt(x^2+y^2+z^2))
        """
        if  accel._xyz:
            x,y,z=(accel._xyz)
            return sqrt((x*x)+(y*y)+(z*z))
        else:
            return None
        
    # called from js to set the current acceleration
    @staticmethod
    def _on_accel(x,y,z):
        accel._xyz=(x,y,z)

class gyro:
    """ Gyroscope sensor

    This allows you to get the rotation of a device in radians per second, around three axes, X, Y and Z, which for a phone 
    are typically X,Y axes side to side and top to bottom on the screen, Z coming out of the screen. 
    """
    _xyz=(0,0,0)
    @staticmethod
    def get_xyz():
        """ Get the rotation of the device

        This is returned in terms of x,y and z axes

        Returns
        -------            
        x: float
            x axis rotation in radians/s
        y: float
            y axis rotation in radians/s
        z: float
            z axis rotation in radians/s
        """
        return gyro._xyz
        
    @staticmethod
    def get_magnitude():
        """ Get the magnitude of device rotation
        
        If the device is still, this will be 0

        Returns
        -------
        mag: float
            magnitude of device rotation (i.e. sqrt(x^2+y^2+z^2))
        """
        if  gyro._xyz:
            x,y,z=(gyro._xyz)
            return sqrt((x*x)+(y*y)+(z*z))
        else:
            return None
        
    # called from js to set the current acceleration
    @staticmethod
    def _on_rotation(x,y,z):
        gyro._xyz=(x,y,z)



class sound:
    """ Sound sensor

    This returns the rough volume of the sound occurring in the vicinity of the device. On web based systems it is done using the built
    in microphone. The scale is an arbitrary 0-1023 scale which is dependent on the microphone on your device, and
    probably a bunch of other hardware and software things.

    """
    _level=0
    @staticmethod
    def get_level():
        """Get the level from the sound sensor. 

        Returns
        -------
        level: float
            sound level ranging from 0 to 1023
        """
        return sound._level        
        
    # called from js to set the current level
    @staticmethod
    def _on_level(level):
        sound._level=int(level*1023)

class light:
    """ Light sensor

    This gets light levels from a camera or light sensor on your device. The scale is an arbitrary 0-1023 one 
    dependent on the camera or sensor on your device, and probably a bunch of other hardware and software things. 
    On non-chrome web browsers and iOS Chrome, this may be extremely innaccurate because they force automatic brightness adjustment.
    
    """
    _level=0
    @staticmethod
    def get_level():
        """ Get the level from the light sensor

        Returns
        -------
        level: float
            light level ranging from 0 to 1
        """
        return light._level        
        
    # called from js to set the current level
    @staticmethod
    def _on_level(level):
        light._level=int(level*1023.0)

class replayer:
    """ Replay pre-recorded sensor data from CSV files

    This class supports loading of CSV files into your code and replaying them. The actual CSV loading logic is done for you
    when your script is started, you just need to check if there is any replay data and use it if so. For example you might
    do this with a conditional if statement like this:

    ```python
    if sensors.replayer.has_replay():
        this_time,x,y,z,sound = sensors.replayer.get_level("time","x","y","z","sound")
    else:
        this_time=time.time()-start_time
        x,y,z=sensors.accel.get_xyz()
        sound=sensors.sound.get_level()
    ```

    """
    _pos=0
    _start_time=None
    _replay_lines=None
    _replay_columns=None
    _filename=None

    # do nothing context manager, which forces interrupts to stop
    @staticmethod
    @contextmanager
    def run_fast():
        try:
            yield 0
        finally:
            return

    @staticmethod
    def reset():
        """Restart the replay of data
        """
        replayer._startTime=None
        replayer._pos=0

    @staticmethod
    def columns():
        """Return the mapping of columns in the current CSV file

            Returns
            -------
            columns: map
                list of column:index pairs
        """
        return replayer._replay_columns
    # parse text csv string
    @staticmethod
    def _on_lines(lines,filename): 
        def make_numbers(x):
            retval=[]
            for y in x:
                try:
                    retval.append(float(y))
                except ValueError:
                    retval.append(y)
            return retval
        if not lines or len(lines)==0:
            replayer._replay_lines=None
            replayer._replay_columns=None
            replayer._filename=None
            return
        replayer._filename=filename
        print("ON LINES:",replayer._filename)
        f=io.StringIO(lines)
        r=csv.reader(f)
        replayer._replay_columns=r.__next__()
        # make lookup for columns
        replayer._replay_columns={str(x):y for y,x in enumerate(replayer._replay_columns)}
        # only get rows with the correct amount of data         
        replayer._replay_lines=[make_numbers(x) for x in r if len(x)==len(replayer._replay_columns)]

        replayer.reset()

    @staticmethod
    def init_replay(filename):
        """ Load replay data from file. The replay data should be a CSV file which has a column for each sensor you are recording from.
        """
        with open(filename) as f:
            lines=f.read()
            replayer._on_lines(lines,filename)

    @staticmethod
    def get_replay_name():
        """ Return the name of the currently loaded replay file
            This is useful for example if you want to do different 
            tests for different types of input data
        """
        print("GET FNAME:",replayer._filename)
        return replayer._filename

    @staticmethod
    def has_replay():
        """ Find out if there is replay data
        
        Returns True if there is a replay CSV file set up, false otherwise.

        Returns
        -------
        has_csv: bool
            True iff there is a replay CSV file.
                
        """
        return (replayer._replay_lines!=None)

    @staticmethod
    def finished():
        """ Has replay finished yet?

        Returns True if there are no more lines left in the CSV file

        Returns
        -------
        finished_csv: bool
            True iff the CSV file is finished
                
        """
        if not replayer._replay_lines:
            return True
        return (replayer._pos<len(replayer._replay_lines)-1)

    @staticmethod
    def get_level(*col_names):        
        """ Get a sample worth of sensor levels from the CSV file

        This returns selected columns from a line in the CSV file and then moves onto the next line. This means that
        if you want to read multiple columns, you have to do it in one call.

        Parameters
        ----------
        *col_names : tuple
            Pass the list of column names that you want to read, e.g.
            `sensors.replayer.get_level("time","sound","light")`

        Returns
        -------
        columns: tuple
            The value of each of the requested columns
        """
        if replayer._replay_lines and len(replayer._replay_lines)>replayer._pos:
            ret_val=replayer._replay_lines[replayer._pos]
            if replayer._pos<len(replayer._replay_lines)-1:
                replayer._pos+=1
        else:
            ret_val=0*len(replayer._replay_columns)
        if col_names:
            # look up the columns and return in order 
            return [ret_val[replayer._replay_columns[x]] for x in col_names]
        else:
            return ret_val