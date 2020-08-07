const helpers = {
  camelize: function(str) {
    return str
      .toLowerCase()
      .split(" ")
      .map((a) => a.trim())
      .map((a) => a[0].toUpperCase() + a.substring(1))
      .join(" ");
  },
};

export default helpers;
