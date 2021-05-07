"""
A module for making your computer (or phone) talk. Useful for getting output when you can't see the screen well.
"""

import js

def say(words):
    """ Say the words 

    They will be spoken on the loudspeaker of your device (or whatever audio output you
    have connected.)

    This is useful for things like making yourself aware of sensor event detections.
    """
    js.on_speech_say(words)
