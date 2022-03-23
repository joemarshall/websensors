
# !-- Import @tensorflow/tfjs-core -->
# <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core"></script>
# <!-- Adds the CPU backend -->
# <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-cpu"></script>
# <!--
#   Import @tensorflow/tfjs-tflite

#   Note that we need to explicitly load dist/tf-tflite.min.js so that it can
#   locate WASM module files from their default location (dist/).
# -->
# <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-tflite/dist/tf-tflite.min.js"></script>
# comes in as  tflite_runtime.interpreter
#from tflite_runtime.interpreter import Interpreter
import js

from types import ModuleType

class interpreter(ModuleType):
    class Interpreter:
        def __init__(self,model_path=None, model_content=None, experimental_delegates=None,
                num_threads=None, experimental_op_resolver_type=None, experimental_preserve_all_tensors=False):
            if model_path!=None:
                # read the model from 'disk'
                with open(model_path,"rb") as m:
                    model_content=m.read()
            # make a tfjs-tflite interpreter
            # ignore options for now
            # we need to await a js promise, use unthrow for this (we need to not be inside any finally blocks etc.)
            self.tflitePromise= js.tflite.loadTFLiteModel(model_content);
            self.tflitePromise.then(self.on_loaded)

        def clean_name(self,name):
            if name.startswith("serving_default_"):
                name=name[len("serving_default_"):]
            if name.find(":")!=-1:
                name=name[:name.find(":")]
            return name

        def on_loaded(self,interp):
            self.tflite=interp
            self.js_inputs=self.tflite.inputs.to_py()
            for x in range(len(self.js_inputs)):
                self.js_inputs[x]["index"]=x
                self.js_inputs[x]["friendlyname"]=self.clean_name(self.js_inputs[x]["name"])
            self.js_outputs=self.tflite.outputs.to_py()
            tensor_base_index=len(self.js_inputs)
            for x in range(len(self.js_outputs)):
                self.js_outputs[x]["index"]=x+tensor_base_index
            self.tensors={}

        def allocate_tensors(self):
            # make tensors for model - we actually keep everything in here until invoke
            pass

        def get_input_details(self):
            return self.js_inputs

        def get_output_details(self):
            return self.js_outputs

        def get_signature_list(self):
            inputs=[x['name'] for x in self.get_input_details()]
            outputs=[x['name'] for x in self.get_output_details()]
            return {'serving_default':{'inputs':inputs,'outputs':outputs} }

        def get_signature_runner(self,signature_key=None):
            if signature_key and signature_key!='serving_default':
                print("Bad signature",signature_key)
                return None
            inputs=self.get_input_details()
            def invokeFn(**args):
                for x in inputs:
                    self.set_tensor(x['index'],args[x['friendlyname']])
                self.invoke()
                outputs=self.get_output_details()
                retval={}
                for x in outputs:
                    retval[x['name']]=self.get_tensor(x['index'])
                # return the tensors in a dict
                return retval
            return invokeFn

        def invoke(self):
            import pyodide
            dataMap={}
            if(len(self.js_inputs)==1):
                intensor=[self.tensors[self.js_inputs[0]["index"]]]
                output_vals=self.tflite.predict(js.tf.tensor(pyodide.to_js(intensor))).to_py()
            else:
                for c in self.js_inputs:
                    dataMap[c["name"]]=self.tensors[c["index"]]
                output_vals=self.tflite.predict(pyodide.to_js(dataMap)).to_py()
            if type(output_vals)==list:
                # list of tensors
                for id,x in zip(self.js_outputs,output_vals):
                    self.set_tensor(id["index"],x.arraySync().to_py())
            elif type(output_vals)==dict:
                # named dict
                for id in self.js_outputs:
                    if id["name"] in output_vals:
                        self.set_tensor(id["index"],output_vals[id["name"]].arraySync().to_py())
            else:
                # single tensor
                self.set_tensor(self.js_outputs[0]["index"],output_vals.arraySync().to_py())

        def reset_all_variables(self):
            self.tensors={}

        def resize_tensor_input(self,input_index,tensor_size,strict=False):
            # I think we can ignore this - tensors for input should be 
            # able to be passed in whatever size and should sort out
            # in the tflite-js code
            pass

        def set_tensor(self,tensor_index,value):
            self.tensors[tensor_index]=value

        def get_tensor(self,tensor_index):
            # throw keyerror if no tensor
            return self.tensors[tensor_index]

        def tensor(self,tensor_index):
            return lambda x:self.tensors[tensor_index]
import sys
sys.modules[__name__ + ".interpreter"] = interpreter("interpreter")