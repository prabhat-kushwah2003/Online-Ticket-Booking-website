import { useState, useEffect } from 'react';
import api from '../api';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [formData, setFormData] = useState({
        title: '', description: '', location: '', date: '', price: '', total_seats: '', image_url: ''
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        const { data } = await api.get('/events');
        setEvents(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingEvent) {
                await api.put(`/events/${editingEvent.id}`, formData);
            } else {
                await api.post('/events', formData);
            }
            setShowModal(false);
            fetchEvents();
            setEditingEvent(null);
            setFormData({ title: '', description: '', location: '', date: '', price: '', total_seats: '', image_url: '' });
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure?')) {
            await api.delete(`/events/${id}`);
            fetchEvents();
        }
    };

    const openEdit = (event) => {
        setEditingEvent(event);
        setFormData({ ...event, date: new Date(event.date).toISOString().slice(0, 16) });
        setShowModal(true);
    };

    return (
        <div className="pt-24 px-4 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Event Management</h1>
                <button
                    onClick={() => { setEditingEvent(null); setFormData({ title: '', description: '', location: '', date: '', price: '', total_seats: '', image_url: '' }); setShowModal(true); }}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add Event
                </button>
            </div>

            <div className="grid gap-4">
                {events.map(event => (
                    <div key={event.id} className="glass-card p-4 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-xl">{event.title}</h3>
                            <p className="text-gray-400">{new Date(event.date).toLocaleDateString()} • {event.location} • {event.available_seats} / {event.total_seats} seats</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => openEdit(event)} className="p-2 hover:bg-white/10 rounded-lg text-blue-400">
                                <Edit className="w-5 h-5" />
                            </button>
                            <button onClick={() => handleDelete(event.id)} className="p-2 hover:bg-white/10 rounded-lg text-red-400">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative"
                        >
                            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                                <X />
                            </button>
                            <h2 className="text-2xl font-bold mb-6">{editingEvent ? 'Edit Event' : 'Create Event'}</h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                                    <Input label="Location" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} required />
                                </div>
                                <Input label="Image URL" value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })} />

                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Date & Time" type="datetime-local" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
                                    <Input label="Price ($)" type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                                </div>

                                <Input label="Total Seats" type="number" value={formData.total_seats} onChange={e => setFormData({ ...formData, total_seats: e.target.value })} required />

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white h-32"
                                        required
                                    />
                                </div>

                                <button type="submit" className="w-full btn-primary py-3 rounded-xl mt-4">
                                    {editingEvent ? 'Update Event' : 'Create Event'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Input = ({ label, type = "text", value, onChange, required }) => (
    <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white transition-all"
        />
    </div>
);

export default AdminDashboard;
