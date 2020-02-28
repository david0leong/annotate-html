const isNameValid = name => /^[a-z0-9]+$/i.test(name);
const isUrlValid = url =>
  /^(https?:\/\/(www\.)?)[a-z0-9]+([-.][a-z0-9]+)*\.[a-z]{2,}(:[0-9]{1,5})?([/?]\S*)?$/i.test(
    url
  );

module.exports = {
  isNameValid,
  isUrlValid,
};
