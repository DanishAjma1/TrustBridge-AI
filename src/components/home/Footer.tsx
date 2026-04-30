import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Instagram } from "lucide-react";
import { motion } from "framer-motion";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Platform",
      links: [
        { label: "Home", href: "/" },
        { label: "Campaigns", href: "/All-Campaigns" },
        { label: "Fundraises", href: "/Fundraises" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Terms of Service", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Guidelines", href: "/guidelines" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
  ];

  const contactInfo = [
    { icon: Mail, text: "aitrustbridge@gmail.com", label: "Email" },
    { icon: Phone, text: "+92 322 6409363", label: "Phone" },
    { icon: MapPin, text: "River Garden, Gujrat, Pakistan", label: "Address" },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand Section */}
            <motion.div
              className="md:col-span-3 lg:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Link to="/" className="flex items-center gap-2 mb-4 group">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white border border-primary-200 shadow-md group-hover:shadow-lg transition-shadow">
                  <img
                    src="/tab-logo1.png"
                    alt="Trust Bridge AI"
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-black text-gray-900 text-sm">Trust Bridge</h3>
                  <span className="text-primary-600 text-xs font-bold">AI Platform</span>
                </div>
              </Link>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Connecting entrepreneurs with investors. Empowering innovation, one deal at a time.
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      title={social.label}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-primary-600 hover:border-primary-300 hover:bg-primary-50 transition-all"
                    >
                      <Icon size={18} />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {/* Footer Sections */}
            {footerSections.map((section, idx) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">
                  {section.title}
                </h4>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="text-gray-600 hover:text-primary-600 text-sm transition-colors duration-200 font-medium"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Contact Info Card */}
          <motion.div
            className="bg-white rounded-2xl border border-gray-200 p-8 mb-12 grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {contactInfo.map((info, idx) => {
              const Icon = info.icon;
              return (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">{info.label}</p>
                    <p className="text-gray-900 font-bold text-sm">{info.text}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Newsletter Signup */}
          {/* <motion.div
            className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl border border-primary-200 p-8 md:p-12 text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">
              Stay Updated
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Get the latest insights on investment opportunities and success stories.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold rounded-lg hover:from-primary-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-primary-500/30 transform hover:-translate-y-0.5">
                Subscribe
              </button>
            </div>
          </motion.div> */}
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-200 py-8 md:py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm text-center md:text-left">
              © {currentYear} Trust Bridge AI. All rights reserved. | Empowering the future of
              investment.
            </p>
            {/* <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">
                Sitemap
              </a>
              <span className="text-gray-300">•</span>
              <a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">
                Cookie Policy
              </a>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
};
