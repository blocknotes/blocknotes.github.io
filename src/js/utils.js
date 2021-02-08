require('fslightbox')

var main = {

  init: function () {
    // main.adImprovements();
    main.updateExternalLinks()
  },

  // ------------------------------------------------------------------------ //

  updateExternalLinks: () => {
    const elements = 'a[href*="github.com"],a[href*="npmjs.com"],a[href*="stackoverflow.com"],a[href*="rubygems.org"],a[href*="twitter.com"]'
    document.querySelectorAll(elements).forEach((el) => { el.setAttribute('target', '_blank') })
  }

  // --- TMP ---------------------------------------------------------------- //
  /* adImprovements: function () {
    $('#adsense > .btn-close').click(function() {
      document.cookie = '_ad_closed=1;secure;samesite;max-age=2592000'; // 1 month
      $('#adsense').hide();
    });
    var cookies = document.cookie.split(';');
    if(cookies.some(function(item) {
      if(item.trim().indexOf('_ad_closed=') == 0) {
        $('#adsense').hide();
      }
    }));

    window.setTimeout(function() {
      if(document.querySelector('#adsense').offsetHeight == 0) $('body').css('marginBottom', 0);
    }, 200);
  } */
};

document.addEventListener('DOMContentLoaded', main.init)
