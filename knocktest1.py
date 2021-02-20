from sensors import accel
from sensors import sound
import graphs
import asyncio,async_pyodide


class low_pass:
    def __init__(self,alpha,gain=None):
        self.lastOut=None
        self.alpha=alpha
        if gain:
            self.gain=gain
        else:
            self.gain=1.0
        
    def update(self,value):
        if value==None:
            return None
        if self.lastOut==None:
            self.lastOut=value
        outVal = self.alpha * self.lastOut + (1.0-self.alpha)*value
        self.lastOut=outVal
        return outVal*self.gain


class high_pass:
    def __init__(self,alpha,gain=None):
        self.lastIn=None
        self.lastOut=None
        self.alpha=alpha
        if gain:
            self.gain=gain
        else:
            self.gain=1.0/alpha
        
    def update(self,value):
        if value==None:
            return None
        if self.lastIn==None:
            self.lastOut=0
            self.lastIn=value
        outVal = self. alpha * (self.lastOut + value - self.lastIn)
        self.lastIn=value
        self.lastOut=outVal
        return outVal*self.gain


async def main_fn():
    print("WOO")
    hp_mag= high_pass(0.1)
    hp_snd = high_pass(0.1)
    lp_mag= low_pass(0.5)
    lp_snd= low_pass(0.5)
    graphs.setStyle("Sound","blue",-1,1)        
    graphs.setStyle("Sound_HP","green",-1,1)        
    graphs.setStyle("Sound_LP","white",-1,1)        
    graphs.setStyle("Accel","red",0,20)
    graphs.setStyle("Accel_HP","yellow",-10,10)
    while not sound.get_level() and not accel.get_magnitude():
        print("Can't find sensors")
        print("Click start sensors to run script")
        await asyncio.sleep(1)
        
    while True:
        mag=accel.get_magnitude()
        snd= sound.get_level()
        if mag:
            mag_lowpassed=lp_mag.update(mag)
            mag_highpassed=hp_mag.update(mag)
            graphs.onValue("Accel",mag)
            graphs.onValue("Accel_HP",mag_highpassed)


            if mag_highpassed>1:
                print("Accelerometer knock")
        if snd:
            snd_lowpassed=lp_snd.update(snd)
            snd_highpassed=hp_snd.update(snd)
            graphs.onValue("Sound",snd)        
            graphs.onValue("Sound_LP",snd_lowpassed)        
            graphs.onValue("Sound_HP",snd_highpassed)        
            if snd_highpassed>0.2:
                print("Sound knock")
            if snd_highpassed<-0.2:
                print("Sound knock off")
        await asyncio.sleep(.01);

loop=asyncio.get_event_loop()
loop.set_task_to_run_until_done(main_fn())
