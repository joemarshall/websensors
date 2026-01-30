# hack workaround to make tflite interpreter look like ai_edge_rt interpreter
# we use latest tfjs, so should support same models as ai-edge-rt
# but this is probably less fast and lovely

import tflite_runtime.interpreter as tflite_interpreter

import numpy as np
from types import ModuleType

class compiledmodel(ModuleType):

    class TensorBuffer:
        def __init__(self,*,shape=None,array=None,dtype,tensor_idx):
            if shape!=None:
                self.array=np.zeros(shape,dtype=dtype)
            elif array!=None:
                self.array=np.array(array,dtype=dtype)
            else:
                raise ValueError("Either shape or array must be provided")
            self.tensor_idx = tensor_idx

        def read(self,num_elements,dtype):
            return self.array.flatten()[:num_elements].astype(dtype)
        
        def write(self,data_array):
            self.array=np.array(data_array,dtype=self.array.dtype).reshape(self.array.shape)

    class CompiledModel:

        def __init__(self,*,model_bytes=None):
            self.tflite = tflite_interpreter.Interpreter(model_content=model_bytes)

        @classmethod
        def from_buffer(cls,buffer):
            return cls(model_bytes=buffer)
        
        @classmethod
        def from_file(cls,filepath):
            with open(filepath,"rb") as f:
                model_bytes=f.read()
            return cls(model_bytes=model_bytes)
        
        def get_signature_list(self):
            return self.tflite.get_signature_list()
        
        def create_input_buffers(self,sig_index=0):
            if sig_index!=0:
                raise ValueError("Only single signature supported")
            inputs=self.tflite.get_input_details()
            retval=[]
            for x in inputs:
                retval.append(compiledmodel.TensorBuffer(shape=x['shape'][1:],dtype=x['dtype'],tensor_idx=x['index']))
            return retval

        def create_output_buffers(self,sig_index=0):
            if sig_index!=0:
                raise ValueError("Only single signature supported")
            outputs=self.tflite.get_output_details()
            retval=[]
            for x in outputs:
                retval.append(compiledmodel.TensorBuffer(shape=x['shape'],dtype=x['dtype'],tensor_idx=x['index']))
            return retval

        def run_by_index(self,sig_index,input_buffers,output_buffers):
            if sig_index!=0:
                raise ValueError("Only single signature supported")
            for buf in input_buffers:
                self.tflite.set_tensor(buf.tensor_idx,buf.array)
            self.tflite.invoke()
            for buf in output_buffers:
                buf.array=np.array(self.tflite.get_tensor(buf.tensor_idx))

import sys    
sys.modules[__name__ + ".compiledmodel"] = compiledmodel("compiledmodel")