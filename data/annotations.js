const annotations = {};

module.exports = {
  getAll() {
    return annotations;
  },

  getByName(name) {
    return annotations[name];
  },

  add(name, url) {
    annotations[name] = url;
  },

  delete(name) {
    delete annotations[name];
  },
};
