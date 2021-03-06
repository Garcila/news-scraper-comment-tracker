var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// Using the Schema constructor, create a new CommentSchema object
// This is similar to a Sequelize model
var CommentSchema = new Schema({
  title: String,
  body: String
});

// This creates our model from the above schema, using mongoose's model method
var Comment = mongoose.model("Comment", CommentSchema);

// Export the Comment model
module.exports = Comment;
