const express = require('express');
const controllers = require('./controllers');
const router = express.Router();

const verifyUser = (req, res, next) => {
  console.log('middleware hit');
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (!token) {
    sendUserError('the token was not provided', res);
    return;
  }
  jwt.verify(token, 'secret', (err, decodedToken) => {
    if (err) {
      sendUserError('token not valid', res);
      return;
    }
    req.decoded = decodedToken;
    next();
  });
};

router.post('/user', controllers.createUser);
router.put('/card', controllers.updateCard);
router.put("/location", controllers.updateLocation)
router.post("/login", controllers.login);
router.post("/nearby", controllers.nearbyUsers);

module.exports = router