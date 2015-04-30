(function() {
  var counter = 0,
    numbered,
    source,
    linenums;

  source = document.getElementsByClassName('prettyprint source');

  if (source && source[0]) {
    linenums = config.linenums;

    if (linenums) {
      source = source[0].getElementsByTagName('ol')[0];

      if (source) {
        Array.prototype.slice.apply(source.children).map(function(item) {
          counter ++;
          item.id = 'line' + counter;
        });
      }
    } else {
      source = source[0].getElementsByTagName('code')[0];

      numbered = source.innerHTML.split('\n');
      numbered = numbered.map(function(item) {
        counter ++;

        return '<span id="line' + counter + '"></span>' + item;
      });

      source.innerHTML = numbered.join('\n');
    }
  }
})();
