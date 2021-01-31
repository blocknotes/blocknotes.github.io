// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"beautifuljekyll.js":[function(require,module,exports) {
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// Dean Attali / Beautiful Jekyll 2020
var BeautifulJekyllJS = {
  bigImgEl: null,
  numImgs: null,
  init: function init() {
    setTimeout(BeautifulJekyllJS.initNavbar, 10); // Shorten the navbar after scrolling a little bit down

    $(window).scroll(function () {
      if ($(".navbar").offset().top > 50) {
        $(".navbar").addClass("top-nav-short");
      } else {
        $(".navbar").removeClass("top-nav-short");
      }
    }); // On mobile, hide the avatar when expanding the navbar menu

    $('#main-navbar').on('show.bs.collapse', function () {
      $(".navbar").addClass("top-nav-expanded");
    });
    $('#main-navbar').on('hidden.bs.collapse', function () {
      $(".navbar").removeClass("top-nav-expanded");
    }); // show the big header image

    BeautifulJekyllJS.initImgs();
  },
  initNavbar: function initNavbar() {
    // Set the navbar-dark/light class based on its background color
    var rgb = $('.navbar').css("background-color").replace(/[^\d,]/g, '').split(",");
    var brightness = Math.round(( // http://www.w3.org/TR/AERT#color-contrast
    parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000);

    if (brightness <= 125) {
      $(".navbar").removeClass("navbar-light").addClass("navbar-dark");
    } else {
      $(".navbar").removeClass("navbar-dark").addClass("navbar-light");
    }
  },
  initImgs: function initImgs() {
    // If the page was large images to randomly select from, choose an image
    if ($("#header-big-imgs").length > 0) {
      BeautifulJekyllJS.bigImgEl = $("#header-big-imgs");
      BeautifulJekyllJS.numImgs = BeautifulJekyllJS.bigImgEl.attr("data-num-img"); // 2fc73a3a967e97599c9763d05e564189
      // set an initial image

      var imgInfo = BeautifulJekyllJS.getImgInfo();
      var src = imgInfo.src;
      var desc = imgInfo.desc;
      BeautifulJekyllJS.setImg(src, desc); // For better UX, prefetch the next image so that it will already be loaded when we want to show it

      var getNextImg = function getNextImg() {
        var imgInfo = BeautifulJekyllJS.getImgInfo();
        var src = imgInfo.src;
        var desc = imgInfo.desc;
        var prefetchImg = new Image();
        prefetchImg.src = src; // if I want to do something once the image is ready: `prefetchImg.onload = function(){}`

        setTimeout(function () {
          var img = $("<div></div>").addClass("big-img-transition").css("background-image", 'url(' + src + ')');
          $(".intro-header.big-img").prepend(img);
          setTimeout(function () {
            img.css("opacity", "1");
          }, 50); // after the animation of fading in the new image is done, prefetch the next one
          //img.one("transitioned webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){

          setTimeout(function () {
            BeautifulJekyllJS.setImg(src, desc);
            img.remove();
            getNextImg();
          }, 1000); //});
        }, 6000);
      }; // If there are multiple images, cycle through them


      if (BeautifulJekyllJS.numImgs > 1) {
        getNextImg();
      }
    }
  },
  getImgInfo: function getImgInfo() {
    var randNum = Math.floor(Math.random() * BeautifulJekyllJS.numImgs + 1);
    var src = BeautifulJekyllJS.bigImgEl.attr("data-img-src-" + randNum);
    var desc = BeautifulJekyllJS.bigImgEl.attr("data-img-desc-" + randNum);
    return {
      src: src,
      desc: desc
    };
  },
  setImg: function setImg(src, desc) {
    $(".intro-header.big-img").css("background-image", 'url(' + src + ')');

    if (_typeof(desc) !== (typeof undefined === "undefined" ? "undefined" : _typeof(undefined)) && desc !== false) {
      $(".img-desc").text(desc).show();
    } else {
      $(".img-desc").hide();
    }
  }
}; // 2fc73a3a967e97599c9763d05e564189

document.addEventListener('DOMContentLoaded', BeautifulJekyllJS.init);
},{}],"utils.js":[function(require,module,exports) {
var main = {
  init: function init() {
    main.updateExternalLinks();
    main.adImprovements();
  },
  // ----------------------------------------------------------------------- //
  adImprovements: function adImprovements() {
    $('#adsense > .btn-close').click(function () {
      document.cookie = '_ad_closed=1;secure;samesite;max-age=2592000'; // 1 month

      $('#adsense').hide();
    });
    var cookies = document.cookie.split(';');
    if (cookies.some(function (item) {
      if (item.trim().indexOf('_ad_closed=') == 0) {
        $('#adsense').hide();
      }
    })) ;
    window.setTimeout(function () {
      if (document.querySelector('#adsense').offsetHeight == 0) $('body').css('marginBottom', 0);
    }, 200);
  },
  updateExternalLinks: function updateExternalLinks() {
    $('a[href^="https://rubygems.org"]').attr('target', '_blank');
    $('a[href^="https://github.com"]').attr('target', '_blank');
    $('a[href^="https://www.npmjs.com"]').attr('target', '_blank');
  }
};
document.addEventListener('DOMContentLoaded', main.init);
},{}],"main.js":[function(require,module,exports) {
require('./beautifuljekyll');

require('./utils');
},{"./beautifuljekyll":"beautifuljekyll.js","./utils":"utils.js"}]},{},["main.js"], null)