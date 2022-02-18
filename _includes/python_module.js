{% capture module_code %}
{% include {{include.fname}} %}
{% endcapture %}

loadAsModule("{{include.name}}",`
{{ module_code | replace: '\','\\\\' | replace: '`':'\\`'`}}
`)