import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Home, Download, Calendar, MapPin } from 'lucide-react';
import Confetti from 'react-confetti';
import { QRCodeCanvas } from 'qrcode.react';
import { useState, useEffect, useRef } from 'react';

const BookingSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { booking, event } = location.state || {};
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
    const ticketRef = useRef(null);

    useEffect(() => {
        if (!booking) {
            navigate('/');
        }

        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [booking, navigate]);

    if (!booking || !event) return null;

    const handleDownload = () => {
        window.print();
    };

    return (
        <div className="relative min-h-screen pt-20 pb-10 flex items-center justify-center px-4">
            <Confetti
                width={windowSize.width}
                height={windowSize.height}
                recycle={false}
                numberOfPieces={500}
                gravity={0.15}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="w-full max-w-md"
            >
                <div className="glass-card overflow-hidden border border-white/20 shadow-2xl relative">
                    {/* Success Header */}
                    <div className="bg-green-500/20 p-6 text-center border-b border-white/10">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500 mb-4 shadow-lg shadow-green-500/30"
                        >
                            <CheckCircle className="w-8 h-8 text-white" />
                        </motion.div>
                        <h1 className="text-2xl font-bold text-white mb-1">Booking Confirmed!</h1>
                        <p className="text-green-300">Your ticket has been sent to your email.</p>
                    </div>

                    {/* Ticket Content */}
                    <div ref={ticketRef} className="p-8 bg-dark/50 print:bg-white print:text-black">
                        <div className="text-center mb-6">
                            <h2 className="text-xl font-bold mb-2">{event.title}</h2>
                            <div className="flex justify-center items-center gap-4 text-sm text-gray-300 print:text-gray-600">
                                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(event.date).toLocaleDateString()}</span>
                                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {event.location}</span>
                            </div>
                        </div>

                        {/* Ticket Details Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-8 bg-white/5 p-4 rounded-xl border border-white/10 print:border-gray-300">
                            <div>
                                <span className="text-xs text-gray-400 uppercase tracking-wider">Customer</span>
                                <p className="font-semibold truncate">{booking.customer_name}</p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-400 uppercase tracking-wider">Ticket Type</span>
                                <p className="font-semibold text-primary">{booking.ticket_type || 'Standard'}</p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-400 uppercase tracking-wider">Quantity</span>
                                <p className="font-semibold">{booking.quantity} Ticket(s)</p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-400 uppercase tracking-wider">Total Paid</span>
                                <p className="font-semibold">${booking.total_price}</p>
                            </div>
                        </div>

                        {/* QR Code Section */}
                        <div className="flex flex-col items-center justify-center gap-4">
                            <div className="bg-white p-4 rounded-xl shadow-lg">
                                <QRCodeCanvas
                                    value={`order:${booking.bookingId}-event:${event.id}`}
                                    size={150}
                                    fgColor="#000000"
                                    bgColor="#ffffff"
                                    level="H"
                                />
                            </div>
                            <p className="text-xs text-gray-500 font-mono">ID: {booking.bookingId}</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="p-6 bg-white/5 border-t border-white/10 flex flex-col sm:flex-row gap-3 print:hidden">
                        <button onClick={handleDownload} className="btn-primary flex-1 py-3 text-center rounded-xl flex items-center justify-center gap-2">
                            <Download className="w-4 h-4" /> Download Ticket
                        </button>
                        <Link to="/" className="flex-1 py-3 text-center rounded-xl border border-white/10 hover:bg-white/10 flex items-center justify-center gap-2 transition-colors">
                            <Home className="w-4 h-4" /> Home
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default BookingSuccess;
