---
title: PyDocs - graphs module
---
To use:
```python
import graphs 

```

<div id="graphs" class="moduletarget" markdown=1>
# Module graphs
This module allows you to draw nice line graphs in the web interface.
```python
# Set the style of a named graph in the output box.
def set_style(graphName,colour,minVal,maxVal,subgraph_x=None,subgraph_y=None)

# Add a value to a named graph in the output box
def on_value(graphName,value)

```
</div>
<a id="graphs_set_style" class="fntarget"></a>

# [*graphs*](#graphs).set_style
```python
# graphs.set_style
def set_style(
    graphName,
    colour,
    minVal,
    maxVal,
    subgraph_x=None,
    subgraph_y=None
)
```
Set the style of a named graph in the output box.
### Parameters
* **graphName**(*str)*
<br>    The name of the graph, used to send values to it, and displayed on screen
* **colour**(*str)*
<br>    The colour of the line, can be in the format "rgb(0,255,0)" or "red", "blue" etc.
* **minVal**(*float)*
<br>    The value of the bottom of the graph
* **maxVal**(*float)*
<br>    The value of the top of the graph
* **subgraph_x**(*int, optional)*
<br>    If you set x subgraphs, the graph window will be split horizontally from 0 to the maximum subgraph you set.    
* **subgraph_y**(*int, optional)*
<br>    If you set y subgraphs, the graph window will be split vertically from 0 to the maximum subgraph you set.    

<a id="graphs_on_value" class="fntarget"></a>

# [*graphs*](#graphs).on_value
```python
# graphs.on_value
def on_value(
    graphName,
    value
)
```
Add a value to a named graph in the output box
### Parameters
* **graphName**(*str)*
<br>    The name of the graph, which should be the same as passed to set_graph_style
* **value**(*float)*
<br>    The value you want to add to the graph. If you add None, it doesn't change the graph, 
    this allows you to directly pass in the output of a `BlockAverageFilter` or similar 
    which return None when there is no new value.

<script src="{{'/assets/js/pydoclink.js'|relative_url}}"></script>
