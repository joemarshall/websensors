import sys
import js

def _stdout_write(txt):
    js.console.log(str(txt))
    
def _stderr_write(txt):
    js.console.log("!"+str(txt))

sys.stdout.write=_stdout_write
sys.stderr.write=_stderr_write