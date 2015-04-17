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
        
        if ($item.data('name') && regexp.test($item.find("a").first().text())) {
          $item.show();
          $item.closest('.itemMembers').show();
          $item.closest('.item').show();
        }
      });
    } else {
      $el.find('.item, .sub-item, .itemMembers li').show();
      $el.find('.item .itemMembers').hide();
    }

    $el.find('.list').scrollTop(0);
  });

  // Toggle when click an item element
  $('.navigation').on('click', '.title', function(event) {
    if (event.target.getAttribute('href') === '#') {
      $(this).parent().find('.itemMembers').toggle();
    }

    return false;
  });

  // Show an item related a current documentation automatically
  var filename = $('.page-title').data('filename').replace(/\.[a-z]+$/, '');
  var $currentItem = $('.navigation .item[data-name*="' + filename + '"]:eq(0)');
  var $currentSubItem = $('.navigation .sub-item[data-name*="' + filename + '"]:eq(0)');

  //get the current method element
  var urlElement = window.location.href.split('/');
  urlElement = urlElement[urlElement.length - 1].replace('.html', '');
  var $currentMethod = $currentItem.find('li[data-name*="' + urlElement + '"]:eq(0)');

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

  // Add the 'active-link' class to the active page
  if ($currentSubItem.length) {
    $currentSubItem.find('a').first().addClass('active-link');
  }

  // Add the 'active-link' class to the active method
  if($currentMethod.length) {
    $currentMethod.find('a').first().addClass('active-link');
  }

  var breadcrumbs = buildBreadcrumbs($currentMethod);
  $('div.breadcrumbs').eq(0).html(breadcrumbs);

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

function buildBreadcrumbs() {
  var $activeLink = $('.active-link').eq(0),
    $activeLinkParent = $activeLink.parent(),
    $subtitle,
    $item,
    $subheader,
    $header,
    docsLink,
    breadcrumbs;

  var makeSpan = function (content) {
    return '<span>' + content + '</span>';
  };

  // links
  docsLink = document.createElement('a');
  docsLink.href = '/';
  docsLink.text = 'Documentation';

  if($activeLink.parents("div.sublist.api").size() > 0) {
    $subtitle = $activeLinkParent.prevAll('span.subtitle').eq(0).filter(function () {
      return $activeLinkParent.parent()[0] === $(this).parent()[0];
    });

    $item = $activeLink.parents('li.item').eq(0);
    $subheader = $item.prevAll('p.subheader').eq(0);
    $header = $item.prevAll('p.header').eq(0);

    breadcrumbs = docsLink.outerHTML
      + makeSpan(config.hotVersion)
      + makeSpan($header.text())
      + makeSpan($subheader.text())
      + makeSpan($item.attr('data-name'))
      + makeSpan($subtitle.text())
      + makeSpan($activeLink.text());

  } else {
    $item = $activeLink.parents('li.item').eq(0);
    $item = $item.find('.title a');

    breadcrumbs = docsLink.outerHTML
      + makeSpan(config.hotVersion)
      + makeSpan($item.text())
      + makeSpan($activeLink.text());
  }

  return breadcrumbs;
}
