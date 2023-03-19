const mongoose = require('mongoose');

const chocolateSchema = mongoose.Schema({
    chocolate: {type: String, default: ''},
    locale: {type: String, default: ''},
    inventory: {type: Number, default: 0}
});

const datesSchema = mongoose.Schema({
    date: {type: Date, default: '2020-1-1'},
    seats: {type: Number, default: '10'}
});

const userSchema = mongoose.Schema({
    username: {type: String, default: ""},
    password: {type: String, default: ""}
});
const seatsSchema = mongoose.Schema({
    name: {type: String, defult:"no name given"},
    party: {type: Number, default: 1},
    date: {type: Date, default: '2020-1-1'},
    dateRef: {type: mongoose.Schema.Types.ObjectId, ref: 'Date'}
})

const Chocolates = mongoose.model("Chocolate", chocolateSchema);
const Dates = mongoose.model("Dates", datesSchema);
const Users = mongoose.model("Users", userSchema);
const Seats = mongoose.model("Seats", seatsSchema);

module.exports = {
    Chocolates,
    Dates,
    Users,
    Seats,
}