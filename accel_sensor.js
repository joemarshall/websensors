import { Gyroscope, Accelerometer,LinearAccelerationSensor,AbsoluteOrientationSensor,RelativeOrientationSensor,toEulerFromQuaternion
} from "./motion_sensors.js";

var _js_accelerometer;

export async function requestPermissions()
{
    if(window.DeviceMotionEvent  != undefined)
    {
     if (typeof DeviceMotionEvent.requestPermission === 'function') {
        let state=await DeviceMotionEvent.requestPermission();
        if(state!='granted')
        {
            console.log("Motionevent permission not granted");
            return false;
        }
        
     }
    }else
    {
        console.log("No device motion event");
    }
    if(window.DeviceOrientationEvent)
    {
     if (typeof  DeviceOrientationEvent.requestPermission === 'function') {
        let state=await DeviceOrientationEvent.requestPermission();
        if(state!='granted')
        {
            console.log("OrientationEvent permission not granted");
            return false;
        }
     }
    }else
    {
        console.log("No device orientation event");                
    }
     return true;
}

export async function startAccelerometer(callback)
{
    console.log("start accel",callback)
    let result;
    if(navigator.permissions && navigator.permissions.query)
    {
        result=await navigator.permissions.query({ name: "accelerometer" });
    }
    if(!result || result.state=='granted')
    {
        _js_accelerometer = new Accelerometer({ referenceFrame: 'device' ,frequency:'60'});
        _js_accelerometer.addEventListener('error', event => {
            // Handle runtime errors.
            if (event.error.name === 'NotReadableError' ) {
                console.log('Cannot connect to accelerometer.');
            }
        });
        _js_accelerometer.start();
        _js_accelerometer.addEventListener("reading",()=>callback(_js_accelerometer.x,_js_accelerometer.y,_js_accelerometer.z))
        console.log('Started accelerometer.');        
    }else
    {
        console.log('Accelerometer permission denied');
    }
}

var _js_abs_ori;

export async function startAbsoluteOrientation(callback)
{
    let results;
    if(navigator.permissions && navigator.permissions.query)
    {
        results=await Promise.all([navigator.permissions.query({ name: "accelerometer" }),
                     navigator.permissions.query({ name: "magnetometer" }),
                     navigator.permissions.query({ name: "gyroscope" })]);
    }
     if (!results || results.every(result => result.state === "granted")) {
        _js_abs_ori = new AbsoluteOrientationSensor();
        _js_abs_ori.addEventListener('error', event => {
            // Handle runtime errors.
            if (event.error.name === 'NotReadableError' ) {
                console.log('Cannot connect to absolute orientation sensor.');
            }
        });
        _js_abs_ori.start();
        console.log("Started absolute orientation sensor");
        _js_abs_ori.addEventListener("reading",()=>
            {                    
                let euler;
                euler=toEulerFromQuaternion(_js_abs_ori.quaternion);                    
                callback(euler[2],euler[0],euler[1]); // yaw, pitch, roll order
            });
     } else {
       console.log("No permissions to use AbsoluteOrientationSensor.");
     }
}
   
/*   
const rel_ori = new RelativeOrientationSensor();
Promise.all([navigator.permissions.query({ name: "accelerometer" }),
             navigator.permissions.query({ name: "gyroscope" })])
       .then(results => {
         if (results.every(result => result.state === "granted")) {
           sensor.start();
           ...
         } else {
           console.log("No permissions to use RelativeOrientationSensor.");
         }
   });   
   
*/