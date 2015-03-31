$(function () {
  // Search Items
  $('#search').on('keyup', function() {
    var value = $(this).val(),
      $el = $('.navigation'),
      regexp;

    if (value) {
      regexp = new RegExp(value, 'i');
      $el.find('li, .itemMembers').hide();

      $el.find('li').each(function (i, v) {
        var $item = $(v);

        if ($item.hasClass('api-reference')) {
          $item.show();

          return;
        }
        if ($item.data('name') && regexp.test($item.data('name'))) {
          $item.show();
          $item.closest('.itemMembers').show();
          $item.closest('.item').show();
        }
      });
    } else {
      //$el.find('.item, .itemMembers').show();
      $el.find('.item, .header, .api-reference').show();
      $el.find('.itemMembers').hide();
    }

    $el.find('.list').scrollTop(0);
  });

  // Toggle when click an item element
  $('.navigation').on('click', '.title', function(event) {
    if (event.target.getAttribute('href') === '#') {
      $(this).parent().find('.itemMembers').toggle();
    }
  });

  // Show an item related a current documentation automatically
  var filename = $('.page-title').data('filename').replace(/\.[a-z]+$/, '');
  var $currentItem = $('.navigation .item[data-name*="' + filename + '"]:eq(0)');
  var $currentSubItem = $('.navigation .sub-item[data-name*="' + filename + '"]:eq(0)');

  if ($currentItem.length) {
    $currentItem
      //.remove()
      //.prependTo('.navigation .list')
      //.show()
      .find('.itemMembers')
      .show();
  } else if ($currentSubItem.length) {
    $currentSubItem
      .parent('.itemMembers')
      .show();
  }

  // Auto resizing on navigation
  var _onResize = function () {
    var height = $(window).height() - 118,
      $el = $('.navigation');

    $el.height(height).find('.list').height(height - 62);
  };

  $(window).on('resize', _onResize);
  _onResize();

  // disqus code
  if (config.disqus) {
    $(window).on('load', function () {
      var disqusShortname = config.disqus,
        dsq = document.createElement('script'),
        s;

      dsq.type = 'text/javascript';
      dsq.async = true;
      dsq.src = 'http://' + disqusShortname + '.disqus.com/embed.js';

      (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
      s = document.createElement('script'); s.async = true;
      s.type = 'text/javascript';
      s.src = 'http://' + disqusShortname + '.disqus.com/count.js';
      document.getElementsByTagName('BODY')[0].appendChild(s);
    });
  }
});
