module.exports = {
  isJson(string) {
    let value = true;
    try {
      JSON.parse(string);
    }
    catch (e) {
      value = false;
    }

    return value;
  },
};
