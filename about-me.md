---
layout: page
title: About me
subtitle: It's me, Mat!
---

I'm Mat, a software developer.

I like to spend my spare time testing new software components and creating apps for web / Android / Windows / Linux / Arduino. The purpose of this site is to share interesting things to everyone interested. Feel free to contact me for tips, questions or just a “hi”

{% include custom/paypal_dontate.html %}

My DSLR experiments:

<div id="photos">
{% for file in site.static_files %}
  {% if file.path contains "photo" and file.name contains "_preview" -%}
    <div class="gallery-item"><a href="{{ file.path | remove: '_preview' }}" data-fslightbox="gallery"><img src="{{ file.path }}"/></a></div>
  {%- endif %}
{% endfor %}
</div>
