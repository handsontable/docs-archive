(function() {
  if (typeof Babel !== 'undefined') {
    Babel.disableScriptTags();
  }

  function camelCase(string) {
		var s = string.replace(/-\D/g, function(match){
			return match.charAt(1).toUpperCase();
		});

    return s[0].toUpperCase() + s.substr(1);
	};

  if (window.addEventListener) {
    window.addEventListener('load', function() {
      var s = document.querySelector('script[data-presets]');

      if (s) {
        var code = Babel.transform(s.innerText, {presets: ['es2015', 'react', 'stage-0']}).code;
        var scriptEl = document.createElement('script');

        scriptEl.text = code;
        document.head.appendChild(scriptEl);
      }
    }, false);
  }

  window.require = function(key) {
    var ns = '';

    key.split('/').forEach(function(k, index) {
      var nsPart = '';

      if (index === 0) {
        nsPart = camelCase(k.replace('@', ''));
      } else {
        nsPart = '.' + k;
      }

      ns = ns + nsPart;
    });

    if (key === 'react-dom') {
      ns = 'ReactDOM';
    } else if (key === '@handsontable/react' || key === '@handsontable-pro/react') {
      ns = 'Handsontable.react.HotTable';
    } else if (key === 'handsontable-pro') {
      ns = 'Handsontable';
    }

    var moduleToReturn = window;

    ns.split('.').forEach(function(n) {
      moduleToReturn = moduleToReturn[n];
    });

    return moduleToReturn;
  }
}())
