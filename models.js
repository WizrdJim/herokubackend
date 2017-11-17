const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongo = process.env.MONGO || 'mongodb://localhost/fullstackapp';

mongoose.Promise = Promise;
mongoose.connect(mongo, {useMongoClient: true});

/***********************************************
 * To do build friend card Schema
 * Should have classifications
 * Where Friends are ones that persist and are saved
 * Starred are those who will only exist temporarily
 * 
 */ 


const BusyCardSchema = new Schema({
  name: String,
  title: String,
  link: String
});

const CardListSchema = new Schema({
  parentId: String,
  personalList: [{
    type: Schema.Types.ObjectId,
    ref: "BusyCard"
  }]
})

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  bCard: {
    type: Schema.Types.ObjectId,
    ref: "BusyCard"
  },
  loc: {
    type: [Number], //[<longitude>, <latitude>]
    index: '2dSphere' //create the geospatial index
  },
  // cardList: {
  //   type: Schema.Types.ObjectId,
  //   ref: "CardList"
  // }
});

UserSchema.index({loc: '2dsphere'});
User = mongoose.model("User", UserSchema);
BusyCard = mongoose.model("BusyCard", BusyCardSchema);
CardList = mongoose.model("CardList", CardListSchema);

module.exports = {
  User,
  BusyCard,
  CardList
};
