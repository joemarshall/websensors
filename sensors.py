import js
from math import sqrt

_snd_level=None

class accel:
    _xyz=None
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
    _level=None
    @staticmethod
    def get_level():
        return sound._level        
        
    # called from js to set the current level
    @staticmethod
    def _on_level(level):
 #       print("SNDLEVEL",level)
        sound._level=level

def startAll():        
    # start the sensors and hook them up here
    initFn=js.eval("""
    (sensorModule)=>
    {
        console.log("In sensor loader")
        let loadAccel = async function()
        {
            console.log("Loading accel module");
            let accel_js_module=await import("../accel_sensor.js");
            console.log("Loaded accel module");
            await accel_js_module.requestPermissions();
            console.log("Got permissions");
            await accel_js_module.startAccelerometer(sensorModule.accel._on_accel);
            console.log("started accel okay");
        };

        let loadSound = async function()
        {
            let sound_js_module=await import("../sound_sensor.js");
            sound_js_module.startAudioProcessor(sensorModule.sound._on_level);
        };

        Promise.all([loadAccel(),loadSound()]).then(()=>{console.log("Connected sensors");})

    };
    """)
    initFn(globals())
        
        