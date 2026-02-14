"use client";

import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WhatsAppButton() {
    const phoneNumber = "905320000000"; // Placeholder - User to update
    const message = "Merhaba, bilgi almak istiyorum.";

    return (
        <motion.a
            href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
            whileHover={{ scale: 1.1 }}
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 rounded-full shadow-lg hover:bg-green-600 transition-colors cursor-pointer group"
            aria-label="WhatsApp ile iletişime geç"
        >
            {/* Pulse Effect */}
            <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />

            {/* Icon */}
            <MessageCircle className="w-8 h-8 text-white relative z-10" />

            {/* Tooltip */}
            <span className="absolute right-full mr-3 px-2 py-1 bg-primary/90 text-primary-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                WhatsApp Hattı
            </span>
        </motion.a>
    );
}
