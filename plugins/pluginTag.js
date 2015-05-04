
exports.defineTags = function(dictionary) {
  dictionary.defineTag('plugin', {
    mustHaveValue: false,
    mustNotHaveValue: true,
    isNamespace: false,
    onTagged: function(doclet, tag) {
      doclet.plugin = "plugin";
    }
  })
};
