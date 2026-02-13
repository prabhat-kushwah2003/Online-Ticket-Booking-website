import { useState, useEffect } from 'react';
import EventCard from '../components/EventCard';
import api from '../api';
import { io } from 'socket.io-client';
import { Search, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const socket = io('http://localhost:5000');

const Events = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('All');
    const [locations, setLocations] = useState(['All']);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();

        socket.on('seatUpdate', (updatedEvent) => {
            setEvents(prevEvents =>
                prevEvents.map(event =>
                    event.id === updatedEvent.id ? { ...event, available_seats: updatedEvent.available_seats } : event
                )
            );
        });

        return () => {
            socket.off('seatUpdate');
        };
    }, []);

    useEffect(() => {
        let results = events;

        if (searchTerm) {
            results = results.filter(event =>
                event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.location.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedLocation !== 'All') {
            results = results.filter(event => event.location === selectedLocation);
        }

        setFilteredEvents(results);
    }, [searchTerm, selectedLocation, events]);

    const fetchEvents = async () => {
        try {
            const response = await api.get('/events');
            setEvents(response.data);
            setFilteredEvents(response.data);

            // Extract unique locations
            const uniqueLocations = ['All', ...new Set(response.data.map(event => event.location))];
            setLocations(uniqueLocations);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching events:', error);
            setLoading(false);
        }
    };

    return (
        <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4"
            >
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-2">
                        Explore Events
                    </h1>
                    <p className="text-gray-400">Find the perfect event for you</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    {/* Location Filter */}
                    <div className="relative w-full sm:w-48">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <select
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-primary text-white appearance-none cursor-pointer hover:bg-white/10 transition-colors"
                        >
                            {locations.map(loc => (
                                <option key={loc} value={loc} className="bg-dark text-white">
                                    {loc}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-primary text-white placeholder-gray-500 transition-all focus:bg-white/10"
                        />
                    </div>
                </div>
            </motion.div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {filteredEvents.length === 0 ? (
                        <div className="text-center text-gray-400 mt-20 p-10 border border-white/5 rounded-2xl bg-white/5">
                            <p className="text-xl">No events found matching your criteria.</p>
                            <button
                                onClick={() => { setSearchTerm(''); setSelectedLocation('All'); }}
                                className="mt-4 text-primary hover:underline"
                            >
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredEvents.map((event, index) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default Events;
