
exports.defineTags = function(dictionary) {
  dictionary.defineTag('util', {
    mustHaveValue: false,
    mustNotHaveValue: true,
    isNamespace: false,

    onTagged: function(doclet, tag) {
      doclet.util = "util";
    }
  })
};
