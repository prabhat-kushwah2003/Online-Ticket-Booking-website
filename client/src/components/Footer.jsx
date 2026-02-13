import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-dark/50 border-t border-white/10 mt-auto">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-gray-400 text-sm">
                        © 2026 FlowzEvents. All rights reserved.
                    </div>
                    <div className="flex space-x-6">
                        <SocialLink href="#" icon={<Github className="w-5 h-5" />} />
                        <SocialLink href="#" icon={<Twitter className="w-5 h-5" />} />
                        <SocialLink href="#" icon={<Linkedin className="w-5 h-5" />} />
                    </div>
                </div>
            </div>
        </footer>
    );
};

const SocialLink = ({ href, icon }) => (
    <a href={href} className="text-gray-400 hover:text-white transition-colors">
        {icon}
    </a>
);

export default Footer;
