from math import sqrt
import io,csv
def on_sensor_event(event):
    name=event["name"]
    value=event["args"]
    if name=="accel":
        accel._on_accel(value[0],value[1],value[2])
    elif name=="sound":
        sound._on_level(value[0])
    elif name=="light":
        light._on_level(value[0])
    elif name=="replayer":
        replayer._on_lines(value[0])            

class accel:
    """
        accelerometer sensor
    """
    _xyz=(0,0,0)
    @staticmethod
    def get_xyz():
        return accel._xyz
        
    @staticmethod
    def get_magnitude():
        if  accel._xyz:
            x,y,z=(accel._xyz)
            return sqrt((x*x)+(y*y)+(z*z))
        else:
            return None
        
    # called from js to set the current acceleration
    @staticmethod
    def _on_accel(x,y,z):
        accel._xyz=(x,y,z)
    
class sound:
    """
        Sound sensor
    """
    _level=0
    @staticmethod
    def get_level():
        return sound._level        
        
    # called from js to set the current level
    @staticmethod
    def _on_level(level):
        sound._level=level

class light:
    """
        Light sensor
    """
    _level=0
    @staticmethod
    def get_level():
        return light._level        
        
    # called from js to set the current level
    @staticmethod
    def _on_level(level):
        light._level=level

class replayer:
    """
        Replay pre-recorded sensor data from CSV files
    """
    _pos=0
    _start_time=None
    _replay_lines=None
    _replay_columns=None
    def reset():
        replayer._startTime=None
        replayer._pos=0

    def columns():
        return replayer._replay_columns
    # parse text csv string
    def _on_lines(lines): 
        if not lines or len(lines)==0:
            replayer._replay_lines=None
            replayer._replay_columns=None
            return
        f=io.StringIO(lines)
        r=csv.reader(f)
        replayer._replay_columns=r.__next__()
        # make lookup for columns
        replayer._replay_columns={x:y for y,x in enumerate(replayer._replay_columns)}
        # only get rows with the correct amount of data
        replayer._replay_lines=[x for x in r if len(x)==len(replayer._replay_columns)]
        replayer.reset()

    def has_replay():
        return (replayer._replay_lines!=None)

    def finished():
        if not replayer._replay_lines:
            return True
        return (replayer._pos<len(replayer._replay_lines)-1)

    def get_level(*col_names):        
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