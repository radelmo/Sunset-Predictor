let mongoose = require ('mongoose');
let Schema = mongoose.Schema;

let postSchema = new Schema ({
    _id: {type: String, required: true},
    content: [{Latitude: String, Longitude: String, Username: String, Date: String}]
});

module.exports = mongoose.model('post', postSchema);
