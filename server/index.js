const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const connectDB = require('./db');
const Event = require('./models/Event');
const Booking = require('./models/Booking');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// Routes
// Event Routes
app.get('/api/events', async (req, res) => {
    try {
        // Mongoose find returns an array of documents
        // The simple toJSON transform in model handles _id -> id mapping
        const events = await Event.find().sort({ date: 1 });
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/events/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ error: 'Event not found' });
        res.json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/events', async (req, res) => {
    const { title, description, location, date, price, total_seats, image_url } = req.body;
    try {
        const newEvent = new Event({
            title,
            description,
            location,
            date,
            price,
            total_seats,
            available_seats: total_seats, // Initial available seats = total seats
            image_url
        });
        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Booking Route with Availability Check and Seat Update
app.post('/api/bookings', async (req, res) => {
    const { event_id, customer_name, customer_email, customer_phone, quantity } = req.body;

    try {
        // Find the event
        const event = await Event.findById(event_id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Check availability
        if (event.available_seats < quantity) {
            return res.status(400).json({ error: 'Not enough seats available' });
        }

        // Calculate total price
        const total_price = event.price * quantity;

        // Create booking
        const newBooking = new Booking({
            event_id,
            customer_name,
            customer_email,
            customer_phone,
            quantity,
            total_price
        });

        await newBooking.save();

        // Update available seats
        // We use $inc to atomically decrease the seat count
        const updatedEvent = await Event.findByIdAndUpdate(
            event_id,
            { $inc: { available_seats: -quantity } },
            { new: true }
        );

        // Emit socket event for real-time update
        io.emit('seatUpdate', { id: updatedEvent.id, available_seats: updatedEvent.available_seats });

        res.status(201).json({ message: 'Booking successful', bookingId: newBooking.id });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Admin Routes
app.put('/api/events/:id', async (req, res) => {
    const { title, description, location, date, price, total_seats, image_url } = req.body;
    try {
        await Event.findByIdAndUpdate(
            req.params.id,
            { title, description, location, date, price, total_seats, image_url },
            { new: true }
        );
        res.json({ message: 'Event updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/events/:id', async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: 'Event deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
