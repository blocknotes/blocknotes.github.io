var main = {

  init: function () {
    main.updateExternalLinks();
    main.adImprovements();
  },

  // ----------------------------------------------------------------------- //

  adImprovements: function () {
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
  },

  updateExternalLinks: function () {
    $('a[href^="https://rubygems.org"]').attr('target', '_blank');
    $('a[href^="https://github.com"]').attr('target', '_blank');
    $('a[href^="https://www.npmjs.com"]').attr('target', '_blank');
  }
};

document.addEventListener('DOMContentLoaded', main.init);
