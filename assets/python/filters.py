from math import pi 
# we use pi for calculation
# of alpha from cutoff frequency

# we use a deque in the median filter
from collections import deque


class HighPassFilter:
    '''
    A class to perform simple first order 
    high pass filtering on a sensor value

    Methods
    -------
    on_value(value_in)
        Process a new value with the filter and return the old one
    '''
    def __init__(self,alpha):
        self.last_input=None
        self.last_output=None
        self.alpha=alpha

    def on_value(self,value_in):
        # if we haven't seen any value yet,
        # set this as our filter output        
        if self.last_input==None:
            self.last_input=value_in
            self.last_output=0
        # this is the actual filter calculation
        self.last_output=self.alpha * (self.last_output + value_in - self.last_input)
        self.last_input=value_in
        return self.last_output

    # a couple of handy static methods to create
    # filters based on time constant or cutoff frequency
    def make_from_cutoff(cutoff_frequency,time_between_samples):
        ''' Make a high-pass filter with this cutoff frequency .
                Parameters:
                    cutoff_frequency: Cutoff frequency in HZ
                    time_between_samples: seconds between samples

                Returns:
                    filter(HighPassFilter): 
                        High-pass filter object
        '''
        fc=cutoff_frequency*time_between_samples*2*pi
        alpha=1/(fc+1)
        return HighPassFilter(alpha)

    def make_from_time_constant(time_constant,time_between_samples):
        ''' Make a high-pass filter with a particular time constant.
                Parameters:
                    time_constant: Time constant in seconds
                    time_between_samples: Seconds between samples

                Returns:
                    filter(HighPassFilter): 
                        High-pass filter object
        '''
        alpha=(time_constant)/(time_constant+time_between_samples)
        return HighPassFilter(alpha)

class LowPassFilter:
    '''
    A class to perform simple first order 
    lowpass filtering on a sensor value

    Methods
    -------
    on_value(value_in)
        Process a new value with the filter and return the old one
    '''
    def __init__(self,alpha):
        self.last_value=None
        self.alpha=alpha


    def on_value(self,value_in):
        # if we haven't seen any value yet,
        # set this as our filter output        
        if self.last_value==None:
            self.last_value=value_in
        # this is the actual filter calculation
        self.last_value=self.alpha * value_in + (1-self.alpha)*self.last_value
        return self.last_value

    # a couple of handy static methods to create
    # filters based on time constant or cutoff frequency
    def make_from_cutoff(cutoff_frequency,time_between_samples):
        ''' Make a low-pass filter with this cutoff frequency .
                Parameters:
                    cutoff_frequency: Cutoff frequency in HZ
                    time_between_samples: seconds between samples

                Returns:
                    filter(LowPassFilter): 
                        Low-pass filter object
        '''
        fc=cutoff_frequency*time_between_samples*2*pi
        alpha=fc/(fc+1)
        return LowPassFilter(alpha)

    def make_from_time_constant(time_constant,time_between_samples):
        ''' Make a low-pass filter with a particular time constant.
                Parameters:
                    time_constant: Time constant in seconds
                    time_between_samples: Seconds between samples

                Returns:
                    filter(LowPassFilter): Low-pass filter object
        '''
        alpha=(time_between_samples)/(time_constant+time_between_samples)
        return LowPassFilter(alpha)

class MedianFilter:
    '''
    A class to perform median filtering
    on a sensor value

    Methods
    -------
    on_value(value_in)
        Process a new value with the filter and return the old one
    '''

    def __init__(self,block_size):
        self.history=deque(maxlen=block_size)

    def on_value(self,new_value):        
        self.history.append(new_value)
        ordered=sorted(self.history)
        orderedPos=int(len(ordered)/2)        
        return ordered[orderedPos]

