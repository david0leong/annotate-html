let annotations = {};

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

  deleteByName(name) {
    delete annotations[name];
  },

  deleteAll() {
    annotations = {};
  },
};
