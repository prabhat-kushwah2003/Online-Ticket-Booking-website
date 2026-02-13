import { motion } from 'framer-motion';
import { Instagram, Twitter, Music } from 'lucide-react';

const PerformerCard = ({ performer }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="group relative h-[300px] rounded-2xl overflow-hidden cursor-pointer"
        >
            <img
                src={performer.image}
                alt={performer.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

            <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-xl font-bold text-white mb-1">{performer.name}</h3>
                <p className="text-secondary text-sm font-medium mb-4">{performer.role}</p>

                <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                    <button className="text-gray-300 hover:text-white transition-colors">
                        <Instagram className="w-5 h-5" />
                    </button>
                    <button className="text-gray-300 hover:text-white transition-colors">
                        <Twitter className="w-5 h-5" />
                    </button>
                    <button className="text-gray-300 hover:text-white transition-colors">
                        <Music className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default PerformerCard;
