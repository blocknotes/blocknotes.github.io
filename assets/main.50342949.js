parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"QV7J":[function(require,module,exports) {
function n(a){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(n){return typeof n}:function(n){return n&&"function"==typeof Symbol&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n})(a)}var a={bigImgEl:null,numImgs:null,init:function(){setTimeout(a.initNavbar,10),$(window).scroll(function(){$(".navbar").offset().top>50?$(".navbar").addClass("top-nav-short"):$(".navbar").removeClass("top-nav-short")}),$("#main-navbar").on("show.bs.collapse",function(){$(".navbar").addClass("top-nav-expanded")}),$("#main-navbar").on("hidden.bs.collapse",function(){$(".navbar").removeClass("top-nav-expanded")}),a.initImgs()},initNavbar:function(){var n=$(".navbar").css("background-color").replace(/[^\d,]/g,"").split(",");Math.round((299*parseInt(n[0])+587*parseInt(n[1])+114*parseInt(n[2]))/1e3)<=125?$(".navbar").removeClass("navbar-light").addClass("navbar-dark"):$(".navbar").removeClass("navbar-dark").addClass("navbar-light")},initImgs:function(){if($("#header-big-imgs").length>0){a.bigImgEl=$("#header-big-imgs"),a.numImgs=a.bigImgEl.attr("data-num-img");var n=a.getImgInfo(),t=n.src,e=n.desc;a.setImg(t,e);a.numImgs>1&&function n(){var t=a.getImgInfo(),e=t.src,o=t.desc;(new Image).src=e,setTimeout(function(){var t=$("<div></div>").addClass("big-img-transition").css("background-image","url("+e+")");$(".intro-header.big-img").prepend(t),setTimeout(function(){t.css("opacity","1")},50),setTimeout(function(){a.setImg(e,o),t.remove(),n()},1e3)},6e3)}()}},getImgInfo:function(){var n=Math.floor(Math.random()*a.numImgs+1);return{src:a.bigImgEl.attr("data-img-src-"+n),desc:a.bigImgEl.attr("data-img-desc-"+n)}},setImg:function(a,t){$(".intro-header.big-img").css("background-image","url("+a+")"),"undefined"!==n(t)&&!1!==t?$(".img-desc").text(t).show():$(".img-desc").hide()}};document.addEventListener("DOMContentLoaded",a.init);
},{}],"MgTz":[function(require,module,exports) {
var e={init:function(){e.updateExternalLinks(),e.adImprovements()},adImprovements:function(){$("#adsense > .btn-close").click(function(){document.cookie="_ad_closed=1;secure;samesite;max-age=2592000",$("#adsense").hide()}),document.cookie.split(";").some(function(e){0==e.trim().indexOf("_ad_closed=")&&$("#adsense").hide()}),window.setTimeout(function(){0==document.querySelector("#adsense").offsetHeight&&$("body").css("marginBottom",0)},200)},updateExternalLinks:function(){$('a[href^="https://rubygems.org"]').attr("target","_blank"),$('a[href^="https://github.com"]').attr("target","_blank"),$('a[href^="https://www.npmjs.com"]').attr("target","_blank")}};document.addEventListener("DOMContentLoaded",e.init);
},{}],"d6sW":[function(require,module,exports) {
require("./beautifuljekyll"),require("./utils");
},{"./beautifuljekyll":"QV7J","./utils":"MgTz"}]},{},["d6sW"], null)
//# sourceMappingURL=/assets/main.50342949.js.map