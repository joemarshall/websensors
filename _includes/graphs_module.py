import js        
def set_style(graphName,colour,minVal,maxVal,subgraph_x=None,subgraph_y=None): 
    js.set_graph_style(graphName,colour,minVal,maxVal,subgraph_x,subgraph_y)           
def on_value(graphName,value):
    # ignore None values as block based filters output them when
    # no value is ready
    if value!=None:
        js.on_graph_value(graphName,value)        
