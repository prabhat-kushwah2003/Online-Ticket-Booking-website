import { useState, useEffect } from 'react';
import { ArrowRight, Star, TrendingUp, Calendar, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import EventCard from '../components/EventCard';
import PerformerCard from '../components/PerformerCard';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await api.get('/events');
                setEvents(data);
            } catch (err) {
                console.error('Failed to fetch events:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    // Filter events
    const upcomingEvents = events.filter(e => new Date(e.date) > new Date()).slice(0, 3);
    const trendingEvents = [...events].sort((a, b) => b.available_seats - a.available_seats).slice(0, 4); // Mock trending logic

    // Mock Performers Data (since we don't have a DB table yet)
    const performers = [
        { id: 1, name: "Dr. Marcus Elwood", role: "AI Scientist", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80" },
        { id: 2, name: "Sarah Chen", role: "Lead Designer", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80" },
        { id: 3, name: "Alex Rivera", role: "Tech Visionary", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80" },
        { id: 4, name: "Emily Zhao", role: "Product Strategist", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80" }
    ];

    return (
        <div className="relative">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
                <div className="absolute inset-0 z-[-1]">
                    <div className="absolute inset-0 bg-gradient-to-b from-dark/30 via-dark/90 to-dark z-10" />
                    <img
                        src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80"
                        alt="Event Background"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="container mx-auto px-4 text-center z-20 relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-sm font-medium text-secondary mb-6 backdrop-blur-md">
                            The Future of Event Booking is Here
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl md:text-8xl font-black mb-8 leading-tight tracking-tight"
                    >
                        Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">Extraordinary</span> <br />
                        Experiences
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto font-light"
                    >
                        Join thousands of people discovering the best concerts, conferences, and exclusive events in your city.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Link to="/events" className="btn-primary flex items-center justify-center gap-2 text-lg px-8 py-4 rounded-full shadow-lg shadow-primary/25">
                            Browse Events <ArrowRight className="w-5 h-5" />
                        </Link>
                        <a href="#trending" className="px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white font-semibold backdrop-blur-md">
                            View Trending
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-10 border-y border-white/5 bg-white/[0.02]">
                <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <StatItem number="500+" label="Events Hosted" />
                    <StatItem number="10k+" label="Active Users" />
                    <StatItem number="150+" label="Cities" />
                    <StatItem number="4.9/5" label="User Rating" />
                </div>
            </section>

            {/* Upcoming Events Section */}
            <section className="py-24 container mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-4xl font-bold mb-4 flex items-center gap-3">
                            <Calendar className="text-primary w-8 h-8" />
                            Upcoming Events
                        </h2>
                        <p className="text-gray-400 text-lg">Don't miss out on these exclusive experiences happening soon.</p>
                    </div>
                    <Link to="/events" className="hidden md:flex items-center text-primary hover:text-white transition-colors gap-2 font-semibold">
                        View All <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {upcomingEvents.length > 0 ? (
                            upcomingEvents.map(event => (
                                <EventCard key={event.id} event={event} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 text-gray-500">
                                No upcoming events found. Check back later!
                            </div>
                        )}
                    </div>
                )}
            </section>

            {/* Featured Performers Section (Summitra Style) */}
            <section className="py-24 bg-dark relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-accent font-bold tracking-wider uppercase text-sm mb-2 block">World Class Talent</span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Meet the Speakers & Performers</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            We bring together industry leaders, innovators, and world-class performers to create unforgettable experiences.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {performers.map(performer => (
                            <PerformerCard key={performer.id} performer={performer} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Trending/Recent Activity */}
            <section id="trending" className="py-24 container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl font-bold mb-12 flex items-center gap-3">
                        <TrendingUp className="text-secondary w-8 h-8" />
                        Trending Now
                    </h2>

                    {loading ? (
                        <div className="text-center">Loading...</div>
                    ) : (
                        <div className="grid md:grid-cols-4 gap-6">
                            {trendingEvents.map((event, index) => (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    className="glass-card p-4 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group"
                                >
                                    <div className="h-40 rounded-lg overflow-hidden mb-4 relative">
                                        <img
                                            src={event.image_url || 'https://via.placeholder.com/300'}
                                            alt={event.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-white">
                                            Popular
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-lg mb-1 truncate">{event.title}</h4>
                                    <p className="text-sm text-primary mb-2">{new Date(event.date).toLocaleDateString()}</p>
                                    <div className="flex justify-between items-center text-sm text-gray-400">
                                        <span>{event.location}</span>
                                        <span>${event.price}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </section>

            {/* Pricing Section */}
            <section className="py-24 container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
                    <p className="text-gray-400">Choose the perfect ticket type for your experience.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {/* Standard */}
                    <div className="glass-card p-8 rounded-2xl border border-white/10 hover:border-primary/50 transition-colors relative group">
                        <h3 className="text-2xl font-bold mb-2">Standard</h3>
                        <p className="text-gray-400 mb-6">General Admission</p>
                        <div className="text-4xl font-bold mb-6 text-white">1x <span className="text-lg font-normal text-gray-500">Base Price</span></div>

                        <ul className="space-y-4 mb-8 text-gray-300">
                            <li className="flex items-center gap-3"><Star className="w-5 h-5 text-primary" /> Full Event Access</li>
                            <li className="flex items-center gap-3"><Star className="w-5 h-5 text-primary" /> Free Wi-Fi</li>
                            <li className="flex items-center gap-3"><Star className="w-5 h-5 text-gray-600" /> <span className="text-gray-500 line-through">Lounge Access</span></li>
                        </ul>
                    </div>

                    {/* VIP */}
                    <div className="glass-card p-8 rounded-2xl border border-secondary/50 bg-secondary/5 relative transform md:-translate-y-4 shadow-2xl shadow-secondary/20">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-secondary text-white px-4 py-1 rounded-full text-sm font-bold">
                            Most Popular
                        </div>
                        <h3 className="text-2xl font-bold mb-2 text-secondary">VIP Access</h3>
                        <p className="text-gray-400 mb-6">For the ultimate experience</p>
                        <div className="text-4xl font-bold mb-6 text-white">2.5x <span className="text-lg font-normal text-gray-500">Base Price</span></div>

                        <ul className="space-y-4 mb-8 text-white">
                            <li className="flex items-center gap-3"><Star className="w-5 h-5 text-secondary" /> Priority Entry</li>
                            <li className="flex items-center gap-3"><Star className="w-5 h-5 text-secondary" /> VIP Lounge Access</li>
                            <li className="flex items-center gap-3"><Star className="w-5 h-5 text-secondary" /> Meet & Greet</li>
                            <li className="flex items-center gap-3"><Star className="w-5 h-5 text-secondary" /> Premium Drinks</li>
                        </ul>
                    </div>

                    {/* Group */}
                    <div className="glass-card p-8 rounded-2xl border border-white/10 hover:border-accent/50 transition-colors">
                        <h3 className="text-2xl font-bold mb-2">Group Bundle</h3>
                        <p className="text-gray-400 mb-6">Perfect for teams & friends</p>
                        <div className="text-4xl font-bold mb-6 text-white">0.8x <span className="text-lg font-normal text-gray-500">Per Person</span></div>

                        <ul className="space-y-4 mb-8 text-gray-300">
                            <li className="flex items-center gap-3"><Star className="w-5 h-5 text-accent" /> Discounted Rate</li>
                            <li className="flex items-center gap-3"><Star className="w-5 h-5 text-accent" /> Reserved Seating</li>
                            <li className="flex items-center gap-3"><Star className="w-5 h-5 text-accent" /> 4+ Tickets Required</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 container mx-auto px-4">
                <div className="relative rounded-3xl overflow-hidden p-12 text-center">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-90" />
                    <img
                        src="https://images.unsplash.com/photo-1459749411177-229252974461?auto=format&fit=crop&q=80"
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
                    />

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Experience the Extraordinary?</h2>
                        <p className="text-white/90 text-xl mb-10">Join thousands of others and book your next unforgettable event with FlowzEvents today.</p>
                        <Link to="/events" className="inline-block bg-white text-primary hover:bg-gray-100 font-bold text-lg px-10 py-4 rounded-full transition-colors shadow-xl">
                            Get Started Now
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

const StatItem = ({ number, label }) => (
    <div>
        <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-white/50 mb-2">
            {number}
        </div>
        <div className="text-gray-400 font-medium">{label}</div>
    </div>
);

export default Home;
