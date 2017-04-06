/* eslint-disable */

module.exports = function (req, res, next, value) {
  if(isNaN(value) || parseInt(Number(value)) != value || isNaN(parseInt(value, 10))){
    res.status(404).send('Not a proper home id.');
    return;
  }
  req.photoHomeId = value;
  next();
}
