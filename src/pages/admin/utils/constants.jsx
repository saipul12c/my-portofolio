import React from 'react';
import { Sparkles, Mail, Github, Linkedin, Instagram, Phone } from "lucide-react";

export const SPARKLES_ICON = <Sparkles className="text-purple-500" size={24} />;

export const SOCIAL_LINKS = [
  { 
    icon: <Mail size={22} />, 
    label: "Email", 
    href: "mailto:syaiful@example.com",
    color: "from-red-400 to-pink-500",
    desc: "Email langsung"
  },
  { 
    icon: <Github size={22} />, 
    label: "GitHub", 
    href: "https://github.com/saipul12c",
    color: "from-gray-600 to-gray-800",
    desc: "Open source"
  },
  { 
    icon: <Linkedin size={22} />, 
    label: "LinkedIn", 
    href: "https://linkedin.com/",
    color: "from-blue-500 to-blue-700",
    desc: "Professional"
  },
  { 
    icon: <Instagram size={22} />, 
    label: "Instagram", 
    href: "https://instagram.com/saipul16_",
    color: "from-pink-400 to-purple-500",
    desc: "Daily updates"
  },
  { 
    icon: <Phone size={22} />, 
    label: "WhatsApp", 
    href: "https://wa.me/6281234567890",
    color: "from-green-500 to-teal-500",
    desc: "Chat langsung"
  },
];