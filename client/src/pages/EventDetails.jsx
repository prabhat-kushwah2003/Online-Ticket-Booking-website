import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { Calendar, MapPin, Users, DollarSign, ArrowLeft, CheckCircle, Ticket } from 'lucide-react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';

const socket = io('http://localhost:5000');

const TICKET_TYPES = [
    { id: 'standard', name: 'Standard Entry', multiplier: 1, desc: 'General admission access' },
    { id: 'vip', name: 'VIP Access', multiplier: 2.5, desc: 'Priority seating + Lounge access' },
    { id: 'group', name: 'Group Bundle', multiplier: 0.8, desc: 'Discount for groups (min 4 tickets)', minQty: 4 }
];

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [selectedTicket, setSelectedTicket] = useState(TICKET_TYPES[0]);
    const [bookingForm, setBookingForm] = useState({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        quantity: 1
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchEvent();

        socket.on('seatUpdate', (updatedEvent) => {
            if (event && updatedEvent.id === event.id) {
                setEvent(prev => ({ ...prev, available_seats: updatedEvent.available_seats }));
            }
        });

        return () => {
            socket.off('seatUpdate');
        };
    }, [id, event?.id]);

    const fetchEvent = async () => {
        try {
            const response = await api.get(`/events/${id}`);
            setEvent(response.data);
            setLoading(false);
        } catch (error) {
            setError('Event not found');
            setLoading(false);
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        try {
            const finalPrice = event.price * selectedTicket.multiplier * bookingForm.quantity;

            const response = await api.post('/bookings', {
                event_id: event.id,
                ...bookingForm,
                ticket_type: selectedTicket.name,
                total_price: finalPrice
            });
            navigate('/booking-success', { state: { booking: response.data, event } });
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || 'Booking failed');
        }
    };

    const updateQuantity = (newQty) => {
        const min = selectedTicket.minQty || 1;
        const validQty = Math.max(min, Math.min(event.available_seats, newQty));
        setBookingForm(prev => ({ ...prev, quantity: validQty }));
    };

    // Update quantity constraint when ticket type changes
    useEffect(() => {
        if (selectedTicket.minQty && bookingForm.quantity < selectedTicket.minQty) {
            setBookingForm(prev => ({ ...prev, quantity: selectedTicket.minQty }));
        }
    }, [selectedTicket]);

    if (loading) return <div className="pt-24 text-center">Loading...</div>;
    if (error || !event) return <div className="pt-24 text-center text-red-500">{error || 'Event not found'}</div>;

    const currentPrice = event.price * selectedTicket.multiplier;

    return (
        <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-10">
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors group">
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Events
            </button>

            <div className="grid lg:grid-cols-2 gap-12">
                {/* Left Column: Event Info & Map */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="rounded-2xl overflow-hidden shadow-2xl mb-8 border border-white/10 relative group">
                        <img
                            src={event.image_url || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80"}
                            alt={event.title}
                            className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                            <span className="text-white font-bold">{event.category || 'Event'}</span>
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{event.title}</h1>
                    <p className="text-gray-300 leading-relaxed mb-8 text-lg">{event.description}</p>

                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-6 mb-8">
                        <InfoItem icon={<Calendar className="text-secondary" />} text={new Date(event.date).toLocaleDateString()} subtext={new Date(event.date).toLocaleTimeString()} />
                        <InfoItem icon={<MapPin className="text-secondary" />} text={event.location} subtext="View on map below" />
                        <InfoItem icon={<Users className="text-secondary" />} text={`${event.available_seats} / ${event.total_seats}`} subtext="Seats Available" />
                        <InfoItem icon={<DollarSign className="text-secondary" />} text={`Starting from $${event.price}`} subtext="Per Ticket" />
                    </div>

                    {/* Google Map Integration */}
                    <div className="rounded-2xl overflow-hidden border border-white/10 h-64 shadow-lg">
                        <iframe
                            title="Event Location"
                            className="w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(event.location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                            frameBorder="0"
                            scrolling="no"
                        ></iframe>
                    </div>
                </motion.div>

                {/* Right Column: Ticket Selection & Booking */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="glass-card p-6 sm:p-8 sticky top-24 border border-white/10 shadow-2xl shadow-primary/10">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Ticket className="text-primary" /> Select Tickets
                        </h2>

                        {/* Ticket Categories */}
                        <div className="space-y-3 mb-8">
                            {TICKET_TYPES.map((type) => (
                                <div
                                    key={type.id}
                                    onClick={() => setSelectedTicket(type)}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all relative overflow-hidden ${selectedTicket.id === type.id
                                            ? 'bg-primary/20 border-primary shadow-lg shadow-primary/10'
                                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                                        }`}
                                >
                                    <div className="flex justify-between items-center mb-1 relative z-10">
                                        <span className="font-bold text-lg">{type.name}</span>
                                        <span className="text-xl font-bold text-secondary">
                                            ${(event.price * type.multiplier).toFixed(0)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-400 relative z-10">{type.desc}</p>
                                    {selectedTicket.id === type.id && (
                                        <motion.div
                                            layoutId="selected-indicator"
                                            className="absolute inset-0 border-2 border-primary rounded-xl"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleBooking} className="space-y-4">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="space-y-4"
                                >
                                    <Input
                                        label="Full Name"
                                        value={bookingForm.customer_name}
                                        onChange={e => setBookingForm({ ...bookingForm, customer_name: e.target.value })}
                                        required
                                    />
                                    <Input
                                        label="Email Address"
                                        type="email"
                                        value={bookingForm.customer_email}
                                        onChange={e => setBookingForm({ ...bookingForm, customer_email: e.target.value })}
                                        required
                                    />
                                    <Input
                                        label="Phone Number"
                                        value={bookingForm.customer_phone}
                                        onChange={e => setBookingForm({ ...bookingForm, customer_phone: e.target.value })}
                                    />

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Quantity {selectedTicket.minQty && `(Min ${selectedTicket.minQty})`}</label>
                                        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-xl border border-white/10 w-max">
                                            <button
                                                type="button"
                                                onClick={() => updateQuantity(bookingForm.quantity - 1)}
                                                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/20 transition-colors font-bold text-xl"
                                            >
                                                -
                                            </button>
                                            <span className="text-xl font-bold w-12 text-center">{bookingForm.quantity}</span>
                                            <button
                                                type="button"
                                                onClick={() => updateQuantity(bookingForm.quantity + 1)}
                                                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/20 transition-colors font-bold text-xl"
                                                disabled={bookingForm.quantity >= event.available_seats}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            <div className="pt-6 mt-6 border-t border-white/10">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <span className="block text-gray-400 text-sm">Total Price</span>
                                        <span className="text-xs text-gray-500">{bookingForm.quantity} x {selectedTicket.name}</span>
                                    </div>
                                    <span className="text-3xl font-bold text-primary">
                                        ${(currentPrice * bookingForm.quantity).toFixed(2)}
                                    </span>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="w-full btn-primary py-4 rounded-xl text-lg shadow-xl shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                                    disabled={event.available_seats === 0}
                                >
                                    {event.available_seats === 0 ? 'Sold Out' : (
                                        <>Confirm Booking <CheckCircle className="w-5 h-5" /></>
                                    )}
                                </motion.button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const InfoItem = ({ icon, text, subtext }) => (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
        <div className="p-3 bg-white/5 rounded-full text-secondary shadow-inner">{icon}</div>
        <div>
            <span className="block font-bold text-lg text-white">{text}</span>
            {subtext && <span className="text-sm text-gray-400">{subtext}</span>}
        </div>
    </div>
);

const Input = ({ label, type = "text", value, onChange, required }) => (
    <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
        <input
            type="text"
            value={value}
            onChange={onChange}
            required={required}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-primary text-white transition-all focus:bg-white/10"
        />
    </div>
);

export default EventDetails;
