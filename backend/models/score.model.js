const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    score: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now // Guarda automáticamente la fecha actual cuando se crea el registro
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('Score', scoreSchema);