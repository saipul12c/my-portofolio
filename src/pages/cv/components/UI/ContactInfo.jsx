import React from 'react';
import { Copy, Mail, Phone, MapPin } from 'lucide-react';

const ContactInfo = ({ isCopied, copyEmail }) => (
  <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
    <button
      onClick={copyEmail}
      className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-blue-900/40 hover:border-cyan-400/50 transition-all group"
    >
      <Mail className="w-4 h-4 text-cyan-400" />
      <span className="text-gray-300 text-sm">syaiful@example.com</span>
      <Copy className={`w-3 h-3 ${isCopied ? 'text-green-400' : 'text-gray-400'} group-hover:text-cyan-400`} />
    </button>
    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-blue-900/40">
      <Phone className="w-4 h-4 text-cyan-400" />
      <span className="text-gray-300 text-sm">+62 812-3456-7890</span>
    </div>
    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-blue-900/40">
      <MapPin className="w-4 h-4 text-cyan-400" />
      <span className="text-gray-300 text-sm">Jakarta, Indonesia</span>
    </div>
  </div>
);

export default ContactInfo;