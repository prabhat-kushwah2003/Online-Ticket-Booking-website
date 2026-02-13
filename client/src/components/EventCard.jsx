import { Calendar, MapPin, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
    return (
        <Link to={`/events/${event.id}`} className="block h-full">
            <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/20 transition-all h-full flex flex-col"
            >
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/90 to-transparent z-10" />
                    <img
                        src={event.image_url || 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80'}
                        alt={event.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 z-20 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                        <span className="text-sm font-bold text-white">${event.price}</span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 relative z-20 flex-grow flex flex-col">
                    <div className="flex gap-2 mb-3">
                        <span className="text-xs font-semibold px-2 py-1 rounded bg-primary/20 text-primary border border-primary/20">
                            {event.category || 'Concert'}
                        </span>
                        {event.available_seats < 20 && (
                            <span className="text-xs font-semibold px-2 py-1 rounded bg-red-500/20 text-red-500 border border-red-500/20">
                                Selling Fast
                            </span>
                        )}
                    </div>

                    <h3 className="text-xl font-bold mb-2 text-white group-hover:text-primary transition-colors line-clamp-1">
                        {event.title}
                    </h3>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">
                        {event.description}
                    </p>

                    <div className="space-y-2 text-sm text-gray-300 mt-auto">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-secondary" />
                            <span>{new Date(event.date).toLocaleDateString()} • {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-secondary" />
                            <span className="truncate">{event.location}</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

export default EventCard;
