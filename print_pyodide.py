import sys
import js

__outbuf=""
__errbuf=""

def _stdout_write(txt):
    global __outbuf
    __outbuf+=txt
    lines=__outbuf.split("\n")
    if len(lines)>1:
        for c in lines[:-1]:
            js.console.log(c)
        __outbuf=lines[-1]
    
def _stderr_write(txt):
    global __errbuf
    __errbuf+=txt
    lines=__errbuf.split("\n")
    if len(lines)>1:
        for c in lines[:-1]:
            js.console.log(c)
        __errbuf=lines[-1]

sys.stdout.write=_stdout_write
sys.stderr.write=_stderr_write