import unthrow
# create hook for time.sleep
import time
time.sleep=lambda t: unthrow.stop({"cmd":"sleep","time":t})

import sys
import traceback
from pyodide import console


def displayhook(value):
    separator = "\\n[[;orange;]<long output truncated>]\\n"
    _repr = lambda v: console.repr_shorten(v, separator=separator)
    return console.displayhook(value, _repr)

sys.displayhook = displayhook


class PyConsole:
    def __init__(self):
        self.resume_args=None
        self.resumer=unthrow.Resumer()
        self.resumer.set_interrupt_frequency(100)
        self.cancelled=False
        self.run_source_obj=None
        self.run_code_obj=None
        self.locals={}

    def clear_cancel(self):
        self.cancelled=False

    def cancel_run(self):
        self.resumer.cancel()
        self.cancelled=True
        #self.resetbuffer()
        self.run_code_obj=None
        self.run_source_obj =None

    def run_once(self):
        if self.cancelled:
            self.cancelled=False
            self.finished=True
            return {"done":True,"action":"cancelled"}
        elif self.run_code_obj:
            try:
                if not self.resumer.run_once(exec,[self.run_code_obj,self.locals]):
                    self.resume_args=self.resumer.resume_params
                    self.flush_all()
                    # need to rerun run_once after handling this action
                    return {"done":False,"action":"resume","args":self.resume_args}
            except BaseException:
                self.showtraceback()
            # in CPython's REPL, flush is performed
            # by input(prompt) at each new prompt ;
            # since we are not using input, we force
            # flushing here
            self.flush_all()
            self.run_code_obj=None
            self.run_source_obj =None
            return {"done":True}

    def showtraceback(self):
        traceback.print_exc()

    def flush_all(self):
        pass
#        sys.stdout.flush()
#        sys.stderr.flush()

    def runcode(self, code):
        sys.stdout.write=self.stdout_callback
        sys.stderr.write=self.stderr_callback
        #  we no longer actually run code in here, 
        # we store it here and then repeatedly run 
        self.run_code_obj=code
        self.locals={}

    def banner(self):
        return f"Welcome to the Pyodide terminal emulator 🐍\\n{super().banner()}"

__pc=PyConsole()            
