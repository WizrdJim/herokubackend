const { User, BusyCard, CardList } = require('./models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const BCRYPT_COST = 11;



const sendUserError = (err, res) => {
  res.status(422);
  if (err && err.message) {
    res.json({
      message: err.message,
      stack: err.stack,
    });
    return
  }
  res.json(err);
}
const createUser = (req, res) => {
  // Create a default for the cards
  const name = 'Busy'
        title = 'Card'
        link = 'Busy@BusyCard.busyness';
  //Get the username/password does basic error handling
  const { username, password } = req.body;
  if (password === "") {
    sendUserError("Please input a valid password", res);
    return;
  }
  //encrypt password cause no one needs to know
  console.log(username+''+password);
  bcrypt.hash(password, BCRYPT_COST, (err, passwordHash) => {
    if (err) {
      sendUserError(err, res);
      return;
    }
    //builds boilerplate card
    console.log(name+''+title+''+link);
    const newCard = new BusyCard({name, title, link});
    newCard.save((error, card) => {
      if (error) {
        console.log(error.message)
        sendUserError(error, res);
        return;
      }
      console.log(card);
      //Connect the user with the default card id
      const bCard = card._id;
      console.log(bCard);

      const newUser = new User({ username, passwordHash, bCard });
      newUser.save((erro, user) => {
        if (error) {
          console.log(erro);
          sendUserError(erro, res);
          return;
        }
        //User saved should return the user_id and the busycard does not currrently!!!!!!
        console.log(user._id+''+ user.bCard)
        res.json({id: user._id, bCard: user.bCard});
      })
    })
  })
}

const updateCard = (req, res) => {
  //find card by id update card
  console.log(req.body.card);
  const { id, name, title, link } = req.body.card;
  BusyCard.findOne({_id: id}, (error, card) => {
    if (error) {
      sendUserError(error, res);
    }
    if (!card) {
      console.log('card not found');
      return;
    }
    card.name = name;
    card.title = title;
    card.link = link;
    card.save((error, card) => {
      if (error) {
        sendUserError(error, res);
        return;
      }
      res.json(card);
    });
  })
}

const updateLocation = (req, res) => {
  const {loc, id} = req.body;
  console.log(loc);
  User.findOne({_id: id})
    .exec((error, user) => {
      if(error) {
        sendUserError(error, res);
        return;
      }
      user.loc = loc;
      user.save((err, user) => {
        if(err) {
          sendUserError(err, res);
          return;
        }
        console.log(user);
      })
    })
}

const login = (req, res) => {
  const { username, password } = req.body;
  if(!password) {
    sendUserError("Please input a valid Username/Password", res);
  }
  if(!username) {
    sendUserError("Please input a valid Username/Password", res);
  }
  console.log('username: ' + username + ' password: ' + password);
  User.findOne({ username })
    .populate('bCard')
    .exec((err, user) => {
    if (err) {
      sendUserError(err, res);
      return;
    }
    if (!user) {
      sendUserError("Please input a valid Username/Password", res);
      return;
    }
    if (bcrypt.compareSync(password, user.passwordHash)) {
      //implement token here
      const card = user.bCard;
      console.log(card);
      res.json({ success: true, id: user._id, card});
      return;
    }
    sendUserError("Please input a valid Username/Password", res);
  })
}

const nearbyUsers = (req, res) => {
  const {id, loc} = req.body;
  console.log("location datat passed to /nearby " + loc)
  User.find({'loc': {
    '$near': {
      '$maxDistance': 10,
      '$geometry': { type: 'Point', coordinates: loc}
    }
  }})
  .populate('bCard')
  .exec((err, users) => {
    if(err) {
      console.log(err);
      sendUserError(err, res);
      return;
    }
    console.log("**********USERS: " + JSON.stringify(users));
    res.json({users})
  })
}
module.exports = {
  createUser: createUser,
  updateCard: updateCard,
  updateLocation: updateLocation,
  login: login,
  nearbyUsers: nearbyUsers
}