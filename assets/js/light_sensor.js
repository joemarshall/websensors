import "./imagecapture.js";

var _onLevel;
var cameraPlaying=false;
var cameraStream,captureDevice,videoTrack;
var grabInterval;

var grabCanvas=document.createElement('canvas');
grabCanvas.width=50;
grabCanvas.height=50;
var grabContext=grabCanvas.getContext('2d');
//document.body.appendChild(grabCanvas);

export async function start(callback)
{
    _onLevel=callback;
    try
    {
        cameraPlaying=false;
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: {width:320,height:240}
        });
        videoTrack = cameraStream.getVideoTracks()[0];
        captureDevice = new ImageCapture(videoTrack,cameraStream);        
        // if possible, disable auto white balance and fix brightness
        if(videoTrack.getCapabilities)
        {
            let caps=videoTrack.getCapabilities();
            if(caps["exposureMode"])
            {
                await videoTrack.applyConstraints({"advanced":[{'exposureMode':'manual'}]});
            }
            if(caps["exposureTime"])
            {
                let c=caps["exposureTime"];
                // default to 100th of a second exposure
                // unit is in multiples of 100 microseconds 
                let exposureVal=100; 
                if(c.min>exposureVal)
                {
                    exposureVal=c.min;
                }else if(c.max<exposureVal)
                {
                    exposureVal=c.max;
                }
                await videoTrack.applyConstraints({"advanced":[{'exposureTime':exposureVal}]});
            }
            if(caps["whiteBalanceMode"])
            {
                await videoTrack.applyConstraints({"advanced":[{'whiteBalanceMode':'manual'}]});
            }
        }

        grabInterval=setInterval(grabImage,100)

        cameraPlaying = true;    
        console.log("Started camera input");
    }catch(e)
    {
        console.log("Error loading camera:",e);
        return;
    }    
}

async function grabImage()
{
    if(cameraPlaying)
    {
        captureDevice.grabFrame().then(processFrame).catch(error => {
            console.log("Couldn't grab image:",error);
            });    
    }
}

function processFrame(bmp)
{
    grabContext.drawImage(bmp,0,0,grabCanvas.width,grabCanvas.height);
    let imageData =grabContext.getImageData(0, 0,grabCanvas.width,grabCanvas.height);
    let sum=0;
    let count=0;
    for(let c=0;c<grabCanvas.width*grabCanvas.height;c++)
    {
        sum+=imageData.data[c];
        count+=1;
    }
    let level=(sum/count)*(1.0/256.0);
    _onLevel(level);
    console.log(level);

}

export async function stop()
{
    if(grabInterval)
    {
        clearInterval(grabInterval);
        grabInterval=undefined;
    }
  console.log("STOPPING camera");
  cameraPlaying=false;
  if(videoTrack)
  {
      videoTrack=undefined;
  }
  if(captureDevice)
  {
    captureDevice=undefined;
  }
  if(cameraStream)
  {
    cameraStream.getTracks().forEach(track=>track.stop());
    cameraStream=undefined;
  }
}
