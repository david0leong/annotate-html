const names = {};

module.exports = {
  getAll() {
    return names;
  },

  getByName(name) {
    return names[name];
  },

  add(name, url) {
    names[name] = url;
  },

  delete(name) {
    delete names[name];
  },
};
