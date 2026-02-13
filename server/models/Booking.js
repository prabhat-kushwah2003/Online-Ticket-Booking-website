const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    customer_name: { type: String, required: true },
    customer_email: { type: String, required: true },
    customer_phone: { type: String },
    quantity: { type: Number, required: true },
    total_price: { type: Number, required: true },
    booking_date: { type: Date, default: Date.now }
});

// Transform _id to id just in case
bookingSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('Booking', bookingSchema);
