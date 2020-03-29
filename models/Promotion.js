const mongoose = require('mongoose');

const { Schema } = mongoose;

const PromotionSchema = new Schema({
  url: String,
  img: String,
  title: String,
  publisher: String,
  originalImg: String,
});

const Promotion = mongoose.model('Promotion', PromotionSchema);

exports.createPromotion = (data) => Promotion.create(data)
  .then((doc) => Promise.resolve(doc))
  .catch((err) => Promise.reject(err));

exports.getPromotion = (param) => Promotion.findOne({ url: param })
  // .then((doc) => Promise.resolve(doc))
  .then((doc) => doc)
  .catch((err) => Promise.reject(err));
