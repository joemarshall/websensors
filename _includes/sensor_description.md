# {{include.name}} 

<a href="#list-of-sensors">Back to sensor list</a><br/>

{{include.description}}

{% capture title_link %}
<tr>
<td><a href="#{{include.name|slugify}}">{{include.name}}</a></td>
{%if include.pintype=="digital" %}
<td style="background-color:#fef">
{% elsif include.pintype=="analog" %}
<td style="background-color:#efe">
{% else %}
<td style="background-color:#ffe">
{% endif %}
 {{include.pintype}}</td> <td> {{include.shortdesc}} </td>
</tr>
{% endcapture %}

{% assign sensor_names= sensor_names | append:title_link  %}

{% if include.examplecode != nil %}
```
{{include.examplecode}}
```
{% else %}
```
sensor_pins={ "{{include.pyname}}":{{include.pin}} } 
# button on {{include.pintype}} pin {{include.pin}}
sensors.set_pins(sensor_pins)
while True:
    {{include.abbreviation}}=sensors.{{include.pyname}}.get_level()
    print({{include.abbreviation}}) 
    # {{include.comment}}
```
{% endif %}
