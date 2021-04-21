import "./imagecapture.js";

// if this is false we use grabframe which is supposed
// to work but unreliable as of 04/2021
// 
// If true we draw the video stream
// to a video element
// and draw that into a canvas

// n.b. we just use a canvas that isn't added to
// the document. In future it would be possible to
// use an offscreencanvas, but safari doesn't support
// that yet.
const USE_VIDEO_ELEMENT=true;


var primed=false;
var _onLevel;
var cameraPlaying=false;
var cameraStream,captureDevice,videoTrack;
var grabInterval;

var videoElement;
if (USE_VIDEO_ELEMENT)
{
    videoElement=document.createElement('video');
    videoElement.playsinline=true;
    videoElement.autoplay=true;
}
var grabCanvas=document.createElement('canvas');
grabCanvas.width=50;
grabCanvas.height=50;
var grabContext=grabCanvas.getContext('2d');
//document.body.appendChild(grabCanvas);

async function get_camera_stream()
{
    let constraint_tries=[{video:true},{video:{width:640}},{video:{width:480}}];
    for(let c in constraint_tries)
    {
        try
        {
            cameraPlaying=false;
            cameraStream = await navigator.mediaDevices.getUserMedia(constraint_tries[c]);
            return cameraStream;
        }
        catch(e)
        {
            console.log(e);
        }
    }
    console.log("Couldn't find working constraints for camera");    
}

// this stuff needs to be run direct from the click event
// or else it won't work in safari
// n.b. don't await anything before
// you do all the getting media stream stuff
export async function requestPermissions()
{
    primed=true;
    cameraStream = await get_camera_stream();
}

export async function start(callback)
{
    primed=false;
    _onLevel=callback;
    try
    {
        if(cameraStream)
        {
            cameraPlaying=false;
            videoTrack = cameraStream.getVideoTracks()[0];
            if( !USE_VIDEO_ELEMENT)
            {
                captureDevice = new ImageCapture(videoTrack,cameraStream);        
            }
            // if possible, disable auto white balance and fix brightness
            if(videoTrack.getCapabilities)
            {
                let caps=videoTrack.getCapabilities();
                if(caps["exposureTime"] && caps["exposureTime"].step!=0)
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
                    if(caps["exposureMode"])
                    {
                        await videoTrack.applyConstraints({"advanced":[{'exposureMode':'manual'}]});
                    }
                }
                if(caps["whiteBalanceMode"])
                {
                    await videoTrack.applyConstraints({"advanced":[{'whiteBalanceMode':'manual'}]});
                }
                if(caps["colorTemperature"])
                {
                    await videoTrack.applyConstraints({"advanced":[{'colorTemperature':'4000'}]});
                }
            }

            if(videoElement)
            {
                videoElement.srcObject=cameraStream;
                videoElement.play();
            }

            grabInterval=setInterval(grabImage,100)

            cameraPlaying = true;    
            console.log("Started camera input");
        }
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
        if(videoElement)
        {
            // old school - draw videoelement into canvas
            // then read pixels from that
            processFrame(videoElement);
        }else if( videoTrack.readyState == 'live' && captureDevice)
        {
            // The right way but not worky on 
            // chrome at least
            try
            {
                let frame=await captureDevice.grabFrame();
                processFrame(frame);
            }
            catch(error)
            {
                console.log("Couldn't grab image:",error);
            }    
        }
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
    imageData=undefined;
    let level=(sum/count)*(1.0/256.0);
    _onLevel(level);

}

export async function stop()
{
    // we're primed to go again, let it rerun
    if(primed)
    {
        return;
    }
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
