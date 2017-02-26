---
title: 'A glance at RubyMotion'
image: /img/img-rubymotion.png
categories: tests
tags: ruby mobile
---

> Write cross-platform apps for iOS, Android and OS X in Ruby

[http://www.rubymotion.com/](http://www.rubymotion.com/)

I like Ruby a lot and finding a good framework like RubyMotion is a pleasure but as one of my workmates said _to build an app with it for both Android and iOS is like writing two apps because you need to know both the APIs_; instead an hybrid framework in many cases permits to do the same with a unique code.

**Bright sides**
* outputs native app
* to use Ruby for mobile app
* cross-platform (included OSX)

**Dark sides**
* price: free with restrictions (only latest mobile OS for app target) or min 200$ per year
* specific OS knowledge is required

**Android example**

```java
class MainActivity < Android::App::Activity
  def onCreate(savedInstanceState)
    super
    view = Android::Widget::TextView.new(self)
    view.text = "Hello World!"
    self.contentView = view
  end
end
```

**iOS example**

```objective-c
class AppDelegate
  def application(application, didFinishLaunchingWithOptions:launchOptions)
    alert = UIAlertView.new
    alert.message = "Hello World!"
    alert.show
    true
  end
end
```
