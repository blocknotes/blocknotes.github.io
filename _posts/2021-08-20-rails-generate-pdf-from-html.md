---
title: 'Rails: generate PDF from HTML'
tags: ruby rails
image: /assets/img/img-ruby-on-rails.png
share-img: /assets/img/img-ruby-on-rails_md.png
thumbnail-img: /assets/img/img-ruby-on-rails_sm.png
excerpt: Generate PDF documents from HTML on the fly with Rails
---

A common way to generate PDF from HTML with Ruby is using *wicked_pdf* or
*pdfkit* gems, but they rely on an external executable and it's slow compared to
native methods. So creating PDF documents is often delegated to background jobs.

To offer an alternative, years ago I started to work on a project based on Prawn
PDF (*prawn-styled-text*) to create PDF files starting from simplified HTML.
Recently I decided to rewrite it from scratch to improve the rendering with [prawn-html](https://github.com/blocknotes/prawn-html).

## A simple controller's action to generate PDF files

Here is a plain simple example:

```rb
class SomeController < ApplicationController
  def sample_action
    respond_to do |format|
      format.pdf do
        pdf = Prawn::Document.new
        PrawnHtml.append_html(pdf, '<h1 style="text-align: center">A test</h1>')
        send_data(pdf.render, filename: 'sample.pdf', type: 'application/pdf')
      end
    end
  end
end
```

## Setup an action controller renderer for PDFs

Another approach is to prepare a Renderer responsible for serving the PDF views:

```rb
# config/initializers/renderers.rb
ActionController::Renderers.add :pdf do |pdf_options, _context_options|
  pdf = Prawn::Document.new(pdf_options)
  PrawnHtml.append_html(pdf, render_to_string)
  send_data(pdf.render, type: Mime[:pdf])
end
```

So the controller's action can be:

```rb
# some controller
  def sample_action
    respond_to do |format|
      format.html
      format.pdf do
        render pdf: { page_size: 'A4' }
      end
    end
  end
```

And we can use a single view to offer both the preview and the PDF:

```erb
<!-- app/views/some/sample_action.erb -->
<h1>The dolphins</h1>

<div>
  <em>“For instance, on the planet Earth, man had always assumed that he was
  more intelligent than dolphins because he had achieved so much—the wheel, New
  York, wars and so on—whilst all the dolphins had ever done was muck about in
  the water having a good time. But conversely, the dolphins had always believed
  that they were far more intelligent than man—for precisely the same reasons.”
  </em> — Douglas Adams, <strong>The Hitchhiker's Guide to the Galaxy</strong>
</div>
```

With older Rails versions it's also necessary to register the Mime type:

```rb
# config/initializers/mime_types.rb
Mime::Type.register 'application/pdf', :pdf
```

That's it.

## Conclusion

Rendering HTML to PDF documents properly is not an easy task and my project
supports a limited set of HTML tags and CSS attributes, but sometimes it can be
useful to be able to create PDF files from HTML with better performances.

If you are curious, take a look at [prawn-html](https://github.com/blocknotes/prawn-html),
any feedback is appreciated.
