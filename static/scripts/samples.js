/*
 * https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded
 *
 * contentloaded.js
 *
 * Author: Diego Perini (diego.perini at gmail.com)
 * Summary: cross-browser wrapper for DOMContentLoaded
 * Updated: 20101020
 * License: MIT
 * Version: 1.2
 *
 * URL:
 * http://javascript.nwbox.com/ContentLoaded/
 * http://javascript.nwbox.com/ContentLoaded/MIT-LICENSE
 *
 */

//@win window reference
//@fn function reference
function contentLoaded(win, fn) {

  var done = false, top = true,

    doc = win.document,
    root = doc.documentElement,
    modern = doc.addEventListener,

    add = modern ? 'addEventListener' : 'attachEvent',
    rem = modern ? 'removeEventListener' : 'detachEvent',
    pre = modern ? '' : 'on',

    init = function (e) {
      if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
      (e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
      if (!done && (done = true)) fn.call(win, e.type || e);
    },

    poll = function () {
      try {
        root.doScroll('left');
      } catch (e) {
        setTimeout(poll, 50);
        return;
      }
      init('poll');
    };

  if (doc.readyState == 'complete') fn.call(win, 'lazy');
  else {
    if (!modern && root.doScroll) {
      try {
        top = !win.frameElement;
      } catch (e) {
      }
      if (top) poll();
    }
    doc[add](pre + 'DOMContentLoaded', init, false);
    doc[add](pre + 'readystatechange', init, false);
    win[add](pre + 'load', init, false);
  }
}


function ajax(url, method, params, callback) {
  var obj;

  try {
    obj = new XMLHttpRequest();
  } catch (e) {
    try {
      obj = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
      try {
        obj = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {
        alert("Your browser does not support Ajax.");
        return false;
      }
    }
  }
  obj.onreadystatechange = function () {
    if (obj.readyState == 4) {
      callback(obj);
    }
  };
  obj.open(method, url, true);
  obj.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  obj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  obj.send(params);

  return obj;
}

(function () {


  function trimCodeBlock(code, pad) {
    var i, ilen;
    pad = pad || 0;
    code = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); //escape html special chars
    code = code.split('\n');
    for (i = 0; i < 10; i++) {
      if (code[0].trim() === '') {
        code.splice(0, 1);
      }
    }
    var offset = 0;
    for (i = 0, ilen = code[0].length; i < ilen; i++) {
      if (code[0].charAt(i) != " ") {
        break;
      }
      offset++;
    }
    for (i = 0, ilen = code.length; i < ilen; i++) {
      code[i] = new Array(pad + 1).join(' ') + code[i].substring(offset);
    }
    return code;
  }

  function bindDumpButton() {
    if (typeof Handsontable === "undefined") {
      return;
    }

    Handsontable.dom.addEvent(document.body, 'click', function (e) {

      var element = e.target || e.srcElement;

      if (element.nodeName == "BUTTON" && element.name == 'dump') {
        var name = element.getAttribute('data-dump');
        var instance = element.getAttribute('data-instance');
        var hot = window[instance];
        console.log('data of ' + name, hot.getData());
      }
    });
  }

  function bindFiddleButton() {
    if (typeof Handsontable === "undefined") {
      return;
    }

    Handsontable.dom.addEvent(document.body, 'click', function (e) {
      var element = e.target || e.srcElement;

      if (element.className == "jsFiddleLink") {

        var keys = ['common'];
        var runfiddle = element.getAttribute('data-runfiddle');

        if (!runfiddle) {
          throw new Error("Edit in jsFiddle button does not contain runfiddle data");
        }
        keys.push(runfiddle);

        var baseUrl = location.protocol + '//' + location.host;

        var tags = [];
        var css = '';
        var js = '';
        var html = '';
        var onDomReady = true;

        tags.push('</style><!-- Ugly Hack due to jsFiddle issue -->\n');
        //tags.push('<script src="https://code.jquery.com/jquery-1.11.1.min.js"></script>\n');

        for (var i = 0, ilen = keys.length; i < ilen; i++) {

          var dataFiddle = document.querySelectorAll('[data-jsfiddle=' + keys[i] + ']');

          for (var x = 0, len = dataFiddle.length; x < len; x++) {

            var tag = null;


            if (dataFiddle[x].nodeName === 'LINK') {
              tag = dataFiddle[x].outerHTML;
            }
            else if (dataFiddle[x].nodeName === 'SCRIPT' && dataFiddle[x].src) {
              tag = dataFiddle[x].outerHTML;
            }
            else if (dataFiddle[x].nodeName === 'SCRIPT') {
              js += trimCodeBlock(dataFiddle[x].innerHTML, 2).join('\n') + '\n';
            }
            else if (dataFiddle[x].nodeName === 'STYLE') {
              css += trimCodeBlock(dataFiddle[x].innerHTML).join('\n') + '\n';
            }
            else { //DIV

              var clone = dataFiddle[x].cloneNode(true);

              var externalExamples = clone.querySelectorAll('[data-jsfiddle="external-example"]');
              for (var k = 0; k < externalExamples.length; k++) {
                externalExamples[k].parentNode.removeChild(externalExamples[k]);
              }

              var clonedExample = clone.querySelector('#' + runfiddle);
              clonedExample.innerHTML = ''; //clear example HTML, just leave container
              var originalHT = dataFiddle[x].querySelector('#' + runfiddle);

              var originalStyle = originalHT.getAttribute('data-originalstyle');
              if (originalStyle) {
                clonedExample.setAttribute('style', originalStyle);
              }

              var aName = clone.querySelectorAll('a[name]');
              var hotHidden = clone.querySelectorAll('handsontable.hidden');

              for (var n = 0, nLen = aName.length; n < nLen; n++) {
                aName[n].parentNode.removeChild(aName[n]);
              }

              for (var h = 0, hLen = hotHidden.length; h < hLen; h++) {
                hotHidden[h].parentNode.removeChild(hotHidden[h]);
              }

              html += trimCodeBlock(clone.innerHTML).join('\n');
            }
            if (tag) {
              tag = tag.replace(' data-jsfiddle="' + keys[i] + '"', '');

              if (tag.indexOf('href="http') === -1 && tag.indexOf('href="//') && tag.indexOf('src="http') === -1 && tag.indexOf('src="//')) {
                tag = tag.replace('href="', 'href="' + baseUrl);
                tag = tag.replace('src="', 'src="' + baseUrl);
                tag = tag.replace('demo/../', '');

                if (this.nodeName === 'LINK' && this.rel === "import") {
                  //web component imports must be loaded throught a CORS-enabling proxy, because our local server does not support it yet
                  tag = tag.replace('href="http://', 'href="http://www.corsproxy.com/');
                  onDomReady = false;
                }
              }

              tags.push(tag)
            }
          }

        }

        var externalExamples = document.querySelectorAll('[data-jsfiddle="external-example"]');
        for (var k = 0; k < externalExamples.length; k++) {
          var clone = externalExamples[k].cloneNode(true);

          while (clone.firstChild) {
            clone.removeChild(clone.firstChild);
          }
          html += trimCodeBlock(clone.outerHTML).join('\n');
        }

        css = css + '\n' + tags.join('\n');

        var form = document.createElement('FORM');
        form.action = 'http://jsfiddle.net/api/post/library/pure/';
        form.method = 'POST';
        form.target = '_blank';
        form.innerHTML = '<input type="text" name="title" value="Handsontable example">' +
          '<input type="text" name="wrap" value="d">' +
          '<textarea name="html">' + html.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</textarea>' +
          '<textarea name="js">' + js.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</textarea>' +
          '<textarea name="css">' + css.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</textarea>';

        form.style.visibility = 'hidden';

        document.body.appendChild(form);
        form.submit();
        form.parentNode.removeChild(form);


      }
    });
  }

  function addLineIndicators(code) {
    var codeInner = code.innerHTML.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").split(/\n/);
    var finalString = '';

    var baseScriptIndent = getScriptBaseIndent(code);

    for (var k = 0, codeLength = codeInner.length; k < codeLength; k++) {
      if ((k === 0 || k === codeLength - 1) && codeInner[k] === '') {
        continue;
      }

      if (codeInner[k].substring(0, baseScriptIndent.length) == baseScriptIndent) {
        codeInner[k] = codeInner[k].replace(baseScriptIndent, '');
      }

      finalString += '<span class="code-line">' + codeInner[k] + '</span>' + '\n';
    }

    return finalString;
  }

  function init() {
    var codes = document.querySelectorAll('.descLayout pre.javascript code');
    for (var i = 0, lenI = codes.length; i < lenI; i++) {
      var scriptS = codes[i];
      var codeS = trimCodeBlock(codes[i].innerHTML);
      scriptS.innerHTML = codeS.join('\n');
    }

    var scripts = document.querySelectorAll('.codeLayout script:not([data-dont-display])');
    for (var j = 0, lenJ = scripts.length; j < lenJ; j++) {
      var script = scripts[j];
      var pre = document.createElement('PRE');
      pre.className = 'javascript';

      var code = document.createElement('CODE');
      code.innerHTML = addLineIndicators(script);

      pre.appendChild(code);
      script.parentNode.insertBefore(pre, script.nextSibling);
    }
    hljs.initHighlighting();

    bindFiddleButton();
    bindDumpButton();
    replaceHotVersion();
  }

  function getScriptBaseIndent(scriptEl) {
    var scriptOuterHtml = scriptEl.outerHTML.split('\n'),
      firstLine = scriptOuterHtml[scriptOuterHtml.length - 1],
      indent = "";

    while (firstLine.charAt(0) === ' ') {
      firstLine = firstLine.substr(1);
      indent += " ";
    }

    return indent;
  }

  function replaceHotVersion() {
    var placeholders = document.querySelectorAll(".hotVersion");

    for (var i = 0, placeholdersCount = placeholders.length; i < placeholdersCount; i++) {
      placeholders[i].innerHTML = hotVersion;
    }
  }

  contentLoaded(window, function (event) {
    if (typeof disableHighlight === 'undefined' || !disableHighlight) {
      init();
    }
  });

})();
