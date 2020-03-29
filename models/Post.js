const mongoose = require('mongoose');

const { Schema } = mongoose;

const PostSchema = new Schema({
  url: String,
  img: String,
  title: String,
  publisher: String,
  originalImg: String,
  platform: String,
});

const Post = mongoose.model('Post', PostSchema);

exports.createPost = (post) => Post.create(post)
  .then((doc) => doc)
  .catch((err) => Promise.reject(err));

exports.getPost = (url, platform) => Post.findOne({ url, platform })
  .then((doc) => doc)
  .catch((err) => Promise.reject(err));
