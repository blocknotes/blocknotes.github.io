var main = {

  init: function () {
    main.updateExternalLinks();
    // main.adImprovements();
  },

  // ----------------------------------------------------------------------- //

  // adImprovements: function () {
  //   $('#adsense > .btn-close').click(function() {
  //     document.cookie = '_ad_closed=1;secure;samesite;max-age=2592000'; // 1 month
  //     $('#adsense').hide();
  //   });
  //   var cookies = document.cookie.split(';');
  //   if(cookies.some(function(item) {
  //     if(item.trim().indexOf('_ad_closed=') == 0) {
  //       $('#adsense').hide();
  //     }
  //   }));

  //   window.setTimeout(function() {
  //     if(document.querySelector('#adsense').offsetHeight == 0) $('body').css('marginBottom', 0);
  //   }, 200);
  // },

  updateExternalLinks: function () {
    const elements = 'a[href*="github.com"],a[href*="npmjs.com"],a[href*="stackoverflow.com"],a[href*="rubygems.org"],a[href*="twitter.com"]'
    $(elements).attr('target', '_blank');
  }
};

document.addEventListener('DOMContentLoaded', main.init);
