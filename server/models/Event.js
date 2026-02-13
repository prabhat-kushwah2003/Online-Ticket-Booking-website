const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    price: { type: Number, required: true },
    total_seats: { type: Number, required: true },
    available_seats: { type: Number, required: true },
    image_url: { type: String },
    created_at: { type: Date, default: Date.now }
});

// Transform _id to id for frontend compatibility
eventSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('Event', eventSchema);
