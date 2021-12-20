function isJSON(data) {
  try {
    JSON.parse(data)
  } catch {
    return false;
  }
  return true;
}

module.exports = {
  isJSON,
}