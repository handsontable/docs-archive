
exports.defineTags = function(dictionary) {
  dictionary.defineTag('plugin', {
    mustHaveValue: true,
    isNamespace: false,

    onTagged: function(doclet, tag) {
      doclet.plugin = tag.value;
    }
  })
};
