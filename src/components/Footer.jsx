import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Company",
      links: ["About Us", "Careers", "Blog", "Press"]
    },
    {
      title: "Support",
      links: ["Contact Us", "FAQ", "Shipping Info", "Returns"]
    },
    {
      title: "Legal",
      links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Disclaimer"]
    }
  ];

  const socialLinks = [
    { icon: Facebook, url: "#", label: "Facebook" },
    { icon: Instagram, url: "#", label: "Instagram" },
    { icon: Twitter, url: "#", label: "Twitter" },
    { icon: Linkedin, url: "#", label: "LinkedIn" }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-300 to-white rounded-lg flex items-center justify-center">
                <span className="text-gray-900 font-bold text-lg">SH</span>
              </div>
              <span className="font-bold text-xl text-white">SoleStep</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Premium footwear crafted for excellence since 1999. Step into quality.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.url}
                    aria-label={social.label}
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-700 hover:text-white transition duration-300"
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="text-white font-bold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition duration-300 text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Section */}
          <div>
            <h3 className="text-white font-bold mb-4">Get In Touch</h3>
            <div className="space-y-4">
              <a href="mailto:hello@solestep.com" className="flex items-center gap-3 text-gray-400 hover:text-white transition duration-300 group">
                <Mail size={18} className="group-hover:translate-x-1 transition" />
                <span className="text-sm">hello@solestep.com</span>
              </a>
              <a href="tel:+1-800-123-4567" className="flex items-center gap-3 text-gray-400 hover:text-white transition duration-300 group">
                <Phone size={18} className="group-hover:translate-x-1 transition" />
                <span className="text-sm">+1-800-123-4567</span>
              </a>
              <div className="flex items-start gap-3 text-gray-400">
                <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                <span className="text-sm">123 Fashion Street, New York, NY 10001, USA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Payment Methods */}
            <div>
              <p className="text-gray-400 text-sm mb-4">We Accept</p>
              <div className="flex gap-4 flex-wrap">
                <span className="px-3 py-1 bg-gray-800 rounded text-gray-300 text-xs font-medium">💳 VISA</span>
                <span className="px-3 py-1 bg-gray-800 rounded text-gray-300 text-xs font-medium">💳 MASTERCARD</span>
                <span className="px-3 py-1 bg-gray-800 rounded text-gray-300 text-xs font-medium">💳 AMEX</span>
                <span className="px-3 py-1 bg-gray-800 rounded text-gray-300 text-xs font-medium">💳 PAYPAL</span>
              </div>
            </div>

            {/* Bottom Right Text */}
            <div className="md:text-right">
              <p className="text-gray-400 text-sm">
                © {currentYear} SoleStep. All rights reserved. | Made with <span className="text-red-500">❤️</span> for shoe lovers
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <div className="flex justify-center py-6 border-t border-gray-800">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition duration-300 text-sm font-medium"
        >
          ↑ Back to Top
        </button>
      </div>
    </footer>
  );
};
