$(function () {
  // Search Items
  $('#search').on('keyup', function () {
    var value = $(this).val(),
      $el = $('.navigation'),
      $notFound = $('.sublist.not-found'),
      regexp;

    if (value) {
      regexp = new RegExp(value, 'i');
      $el.find('li, .itemMembers, .subheader, .sublist').hide();

      $el.find('li').each(function (i, v) {
        var $item = $(v);

        if ($item.data('name') && regexp.test($item.find("a").first().text())) {
          $item.show();
          $item.closest('.itemMembers').show();
          $item.closest('.item').show();
          $item.parents('.item').prevAll('p').first().show();
          $item.parents('.sublist').show();
        }
      });
      if ($('.sublist:not([style*="display: none"]), .tutorial:not([style*="display: none"])').length) {
        $notFound.hide();
      } else {
        $notFound.show();
      }
    } else {
      $el.find('.item, .sub-item, .itemMembers li, .subheader, .sublist').show();
      $el.find('.item .itemMembers').hide();
      $notFound.hide();
    }

    $el.find('.list').scrollTop(0);
  });

  // Toggle when click an item element
  $('.navigation').on('click', '.title', function (event) {
    if (event.target.getAttribute('href') === '#') {
      $(this).parent().find('.itemMembers').toggle();
    }

    return false;
  });

  // Show an item related a current documentation automatically
  var filename = $('.page-title').data('filename').replace(/\.[a-z]+$/, '');
  var $currentItem = $('.navigation .item[data-name="' + filename + '"]:eq(0)');
  var $currentSubItem = $('.navigation .sub-item[data-name="' + filename + '"]:eq(0)');
  var $current;

  //get the current method element
  var urlElement = window.location.href.split('/');
  urlElement = urlElement[urlElement.length - 1].replace('.html', '');
  var $currentMethod = $currentItem.find('li[data-name="' + urlElement + '"]:eq(0)');

  if ($currentItem.length) {
    $currentItem
      //.remove()
      //.prependTo('.navigation .list')
      //.show()
      .find('.itemMembers')
      .show();
    $current = $currentItem;
  } else if ($currentSubItem.length) {
    $currentSubItem
      .parent('.itemMembers')
      .show();
    $current = $currentSubItem;
  }
  if ($currentMethod.length) {
    $current = $currentMethod;
  }

  // Add the 'active-link' class to the active page
  if ($currentSubItem.length) {
    $currentSubItem.find('a').first().addClass('active-link');
  }

  // Add the 'active-link' class to the active method
  if ($currentMethod.length) {
    $currentMethod.find('a').first().addClass('active-link');
  }

  var breadcrumbs = buildBreadcrumbs();
  $('div.breadcrumbs').eq(0).html(breadcrumbs);

  // Auto resizing on navigation
  var _onResize = function () {
    var height = $(window).height() - 118,
      $el = $('.navigation');

    $el.height(height).find('.list').height(height - 62);

    // Scroll to the currently selected element
    if ($current) {
      $('.navigation').find('ul.list').first().scrollTop($current.position().top);
    }
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
      s = document.createElement('script');
      s.async = true;
      s.type = 'text/javascript';
      s.src = 'http://' + disqusShortname + '.disqus.com/count.js';
      document.getElementsByTagName('BODY')[0].appendChild(s);
    });
  }
});

function getDocUrl(docVersion) {
  return location.href.replace(/\/\d+\.\d+\.\d+(\-(beta|alpha)(\d+)?)?\//, '/' + docVersion + '/');
}
function goTo(href) {
  location.href = href;
}

var _docVersions = [];

function docVersions(docVersions) {
  _docVersions = docVersions;
}

function getLatestHOTStableVersion() {
  var stable = _docVersions.reverse().filter(function(version) {
    return version.match(/\d+\.\d+\.\d+/) ? true : false;
  });

  return stable.length ? stable[0] : _docVersions.reverse()[0];
}

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
  var makeLatestLink = function (hotVersion) {
    var stableVersion = getLatestHOTStableVersion();

    if (stableVersion === hotVersion) {
      return '';
    }

    return '<a class="hot-latest" href="' + getDocUrl(stableVersion) + '">switch into latest stable version</a>';
  };
  var makeHotVersion = function (hotVersion) {
    var lastVersion = null;

    var options = _docVersions.reverse().map(function(version) {
      var minorMajor = version.split('.').splice(0, 2).join('.'),
        option = '';

      if (lastVersion !== minorMajor) {
        if (lastVersion !== null) {
          option += '</optgroup>';
        }
        option += '<optgroup label="' + minorMajor + '.x">';
      }
      if (version === hotVersion) {
        option += '<option selected value="' + version + '">' + version + '</option>';
      } else {
        option += '<option value="' + version + '">' + version + '</option>';
      }
      lastVersion = minorMajor;

      return option;
    });
    options.push('</optgroup>');

    return '<span>' +
      '<select class="hot-chooser" onchange="goTo(getDocUrl(this.value))" selected="' + hotVersion + '">' +
      options.join('') +
      '</select>' +
      '</span>';
  };

  // links
  docsLink = document.createElement('a');
  docsLink.href = '/';
  docsLink.text = 'Documentation';

  if ($('.source').size() > 0) {
    var filename = $('.page-title').data('filename').replace(/\.[a-z]+$/, '');

    breadcrumbs = docsLink.outerHTML
      + makeHotVersion(hotVersion)
      + makeSpan("Source: " + filename)
      + makeLatestLink(hotVersion);

  } else if ($activeLink.parents("div.sublist.api").size() > 0) {
    $subtitle = $activeLinkParent.prevAll('span.subtitle').eq(0).filter(function () {
      return $activeLinkParent.parent()[0] === $(this).parent()[0];
    });

    $item = $activeLink.parents('li.item').eq(0);
    $subheader = $item.prevAll('p.subheader').eq(0);
    $header = $item.prevAll('p.header').eq(0);

    breadcrumbs = docsLink.outerHTML
      + makeHotVersion(hotVersion)
      + makeSpan($header.text())
      + makeSpan($subheader.text())
      + makeSpan($item.attr('data-name'))
      + makeSpan($subtitle.text())
      + makeSpan($activeLink.text())
      + makeLatestLink(hotVersion);

  } else {
    $item = $activeLink.parents('li.item').eq(0);
    $item = $item.find('.title a');

    breadcrumbs = docsLink.outerHTML
      + makeHotVersion(hotVersion)
      + makeSpan($item.text())
      + makeSpan($activeLink.text())
      + makeLatestLink(hotVersion);
  }

  return breadcrumbs;
}

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

// Ugly fix for dropdown menu
function dropdownLoop() {
  $('.dropdown').each(function(index, element) {
    var btnStyle = element.previousElementSibling.style,
      boxShadowStyle = btnStyle.boxShadow,
      clipStyle = $(element).css('clip');

    if (clipStyle === 'auto') {
      btnStyle.boxShadow = '0 1px 0 #4B96E0 inset, -1px 0 0 #4B96E0 inset, 1px 0 0 #4B96E0 inset';

    } else if (boxShadowStyle !== 'none') {
      btnStyle.boxShadow = 'none';
    }
  });
  requestAnimFrame(dropdownLoop);
}
dropdownLoop();
