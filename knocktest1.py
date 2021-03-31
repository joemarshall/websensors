from sensors import accel
from sensors import sound
import graphs
from time import sleep

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


hp_mag= high_pass(0.1)
hp_snd = high_pass(0.1)
lp_mag= low_pass(0.5)
lp_snd= low_pass(0.5)
graphs.set_style("Sound","blue",-1,1)        
graphs.set_style("Sound_HP","green",-1,1)        
graphs.set_style("Sound_LP","white",-1,1)        
graphs.set_style("Accel","red",0,20)
graphs.set_style("Accel_HP","yellow",-10,10)
    
while True:
    mag=accel.get_magnitude()
    snd= sound.get_level()
    if mag:
        mag_lowpassed=lp_mag.update(mag)
        mag_highpassed=hp_mag.update(mag)
        graphs.on_value("Accel",mag)
        graphs.on_value("Accel_HP",mag_highpassed)


        if mag_highpassed>1:
            print("Accelerometer knock")
    if snd:
        snd_lowpassed=lp_snd.update(snd)
        snd_highpassed=hp_snd.update(snd)
        graphs.on_value("Sound",snd)        
        graphs.on_value("Sound_LP",snd_lowpassed)        
        graphs.on_value("Sound_HP",snd_highpassed)        
        if snd_highpassed>0.2:
            print("Sound knock")
        if snd_highpassed<-0.2:
            print("Sound knock off")
    sleep(.01);

