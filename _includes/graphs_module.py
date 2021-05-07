""" This module allows you to draw nice line graphs in the web interface.
"""

import js        
def set_style(graphName,colour,minVal,maxVal,subgraph_x=None,subgraph_y=None):
    """ Set the style of a named graph in the output box.

    Parameters
    ----------
    graphName: str
        The name of the graph, used to send values to it, and displayed on screen
    colour: str
        The colour of the line, can be in the format "rgb(0,255,0)" or "red", "blue" etc.
    minVal: float
        The value of the bottom of the graph
    maxVal: float
        The value of the top of the graph
    subgraph_x: int, optional
        If you set x subgraphs, the graph window will be split horizontally from 0 to the maximum subgraph you set.    
    subgraph_y: int, optional
        If you set y subgraphs, the graph window will be split vertically from 0 to the maximum subgraph you set.    
    """
    js.set_graph_style(graphName,colour,minVal,maxVal,subgraph_x,subgraph_y)           
def on_value(graphName,value):
    """ Add a value to a named graph in the output box

    Parameters
    ----------
    graphName: str
        The name of the graph, which should be the same as passed to set_graph_style
    value: float
        The value you want to add to the graph. If you add None, it doesn't change the graph, 
        this allows you to directly pass in the output of a \`BlockAverageFilter\` or similar 
        which return None when there is no new value.
    """
    # ignore None values as block based filters output them when
    # no value is ready
    if value!=None:
        js.on_graph_value(graphName,value)        
