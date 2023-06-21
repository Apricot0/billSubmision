const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        require: true
    },
    bills: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bill'
    }],
    create_date: {
        type: Date,
        required: true,
        unique: true,
        default: Date.now
    },
    account_name: {
        type: String
    }
})
        

// Virtual property to return the URL for the document
//answerSchema.virtual('url').get(function () {
//  return `/posts/answer/${this._id}`
//})

const User = mongoose.model('User', userSchema)
module.exports = User