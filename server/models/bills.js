// Question Document Schema
const mongoose = require('mongoose')

const billSchema = new mongoose.Schema({
  patient: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  hospital: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  }
})

const Bill = mongoose.model('Bill', billSchema)

module.exports = Bill
