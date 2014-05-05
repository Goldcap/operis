require("example/app");

Ember.keys(requirejs._eak_seen).filter(function(key) {
  return (/tests/).test(key);
}).forEach(function(moduleName) {
  require(moduleName, null, null, true);
});
