
exports.defineTags = function(dictionary) {
  dictionary.defineTag('pro', {
    mustHaveValue: false,
    isNamespace: false,

    onTagged: function(doclet, tag) {
      doclet.pro = true;
    }
  })
};
