module.exports = {
  menuFileName: (code) => {
    return `${code.slice(0, 1).toUpperCase()}${code.slice(1)}`;
  }
}