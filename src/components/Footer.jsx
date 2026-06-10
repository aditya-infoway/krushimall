import { Phone, Mail, MapPin, ArrowRight, ChevronDown } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTwitter,
  FaGooglePlay,
  FaApple,
} from "react-icons/fa";
import { useState } from "react";
import { FaXTwitter } from "react-icons/fa6";
const Footer = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const quickLinks = [
    "Home",
    "Find Tractor Parts",
    "New Tractors",
    "Used Tractors",
    "All Brands",
    "Finance & EMI",
  ];

  const serviceLinks = [
    "Contact Us",
    "Return Policy",
    "Shipping Information",
    "Track Order",
    "FAQs",
    "Warranty",
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 overflow-hidden">
      {/* Main Footer - Desktop */}
      <div className="hidden lg:block">
        {/* Updated: Matching BrandsMakers spacing */}
        <div className="px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 py-2 md:py-16 lg:py-10">
          {/* Updated: Applied the same max-width wrapper */}
          <div className="w-full max-w-[1440px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto">
            
            <div className="grid grid-cols-4 gap-8 xl:gap-12">
              {/* About */}
              <div>
                <h2 className="text-2xl xl:text-3xl font-bold text-green-600 tracking-tight">
                  Krushi <span className="text-white">Mall</span>
                </h2>
                <p className="mt-4 text-sm text-gray-400 leading-relaxed">
                  India's #1 online marketplace for tractor spare parts, new & used
                  tractors. Trusted by 50,000+ farmers across the country with
                  genuine parts from 100+ brands.
                </p>
                <div className="mt-6 space-y-3">
                  <a
                    href="tel:+911234567890"
                    className="flex items-center gap-3 text-sm text-gray-400 hover:text-green-500 transition-colors group"
                  >
                    <Phone className="h-4 w-4 text-green-500 group-hover:scale-110 transition-transform" />
                    +91 12345 67890
                  </a>
                  <a
                    href="mailto:support@krushimall.com"
                    className="flex items-center gap-3 text-sm text-gray-400 hover:text-green-500 transition-colors group"
                  >
                    <Mail className="h-4 w-4 text-green-500 group-hover:scale-110 transition-transform" />
                    support@krushimall.com
                  </a>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <MapPin className="h-4 w-4 text-green-500" />
                    Meerut, Uttar Pradesh, India
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">
                  Quick Links
                </h4>
                <ul className="space-y-3">
                  {quickLinks.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-gray-400 hover:text-green-500 transition-colors hover:translate-x-1 inline-block transform"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tractor Categories */}
              <div>
                <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">
                  Tractor Parts
                </h4>
                <ul className="space-y-3">
                  {[
                    "Engine Parts",
                    "Transmission",
                    "Hydraulic System",
                    "Electrical Parts",
                    "Brake System",
                    "Filters & Fluids",
                  ].map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-gray-400 hover:text-green-500 transition-colors hover:translate-x-1 inline-block transform"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Newsletter */}
              <div>
                <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">
                  Stay Updated
                </h4>
                <p className="text-sm text-gray-400 mb-4">
                  Subscribe for exclusive tractor deals, new parts arrivals, and
                  farming tips.
                </p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                  />
                  <button className="bg-green-600 hover:bg-green-700 text-white cursor-pointer px-5 rounded-r-lg transition-colors">
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-5 flex gap-3">
                  {[
                    { icon: FaFacebookF, link: "#" },
                    { icon: FaXTwitter, link: "#" },
                    { icon: FaInstagram, link: "#" },
                    { icon: FaYoutube, link: "#" },
                  ].map((social, index) => {
                    const Icon = social.icon;

                    return (
                      <a
                        key={index}
                        href={social.link}
                        className="w-10 h-10 bg-gray-800 hover:bg-green-600 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200 hover:-translate-y-1"
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Mobile Footer - Accordion Style */}
      <div className="lg:hidden">
        {/* Brand */}
        <div className="px-5 pt-10 pb-6 text-center border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">
            Krushi <span className="text-green-500">Mall</span>
          </h2>
          <p className="mt-3 text-sm text-gray-400">
            India's #1 marketplace for tractor parts & tractors
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <a
              href="tel:+911234567890"
              className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white transition-all"
            >
              <Phone className="h-4 w-4" />
            </a>
            <a
              href="mailto:support@krushimall.com"
              className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white transition-all"
            >
              <Mail className="h-4 w-4" />
            </a>
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400">
              <MapPin className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Accordion Links */}
        {[
          { title: "Quick Links", links: quickLinks },
          {
            title: "Tractor Parts",
            links: [
              "Engine Parts",
              "Transmission",
              "Hydraulic System",
              "Electrical Parts",
              "Brake System",
              "Filters & Fluids",
            ],
          },
          { title: "Customer Service", links: serviceLinks },
        ].map((section) => (
          <div key={section.title} className="border-b border-gray-800">
            <button
              onClick={() => toggleSection(section.title)}
              className="w-full flex items-center justify-between px-5 py-4 text-white font-semibold text-sm uppercase tracking-wider"
            >
              {section.title}
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  openSection === section.title ? "rotate-180" : ""
                }`}
              />
            </button>
            {openSection === section.title && (
              <div className="px-5 pb-4">
                {section.links.map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="block py-2 text-sm text-gray-400 hover:text-green-500 transition-colors"
                  >
                    {link}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Newsletter - Mobile */}
        <div className="px-5 py-6 ">
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">
            Stay Updated
          </h4>
          <p className="text-sm text-gray-400 mb-4">
            Get tractor deals & farming tips
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
            />
            <button className="bg-green-600 hover:bg-green-700 text-white px-5 rounded-r-lg">
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-4 flex gap-3">
            {[
              { icon: FaFacebookF, link: "#" },
              { icon: FaXTwitter, link: "#" },
              { icon: FaInstagram, link: "#" },
              { icon: FaYoutube, link: "#" },
            ].map((social, index) => {
              const Icon = social.icon;

              return (
                <a
                  key={index}
                  href={social.link}
                  className="w-10 h-10 bg-gray-800 hover:bg-green-600 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* App Promo */}
      <div className="lg:border-t border-gray-800">
        {/* Updated: Matching BrandsMakers spacing */}
        <div className="px-4 sm:px-6 lg:px-20 xl:px-24">
          {/* Updated: Applied the same max-width wrapper */}
          <div className="w-full max-w-[1440px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto py-6">
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-400 text-center sm:text-left">
                Download the Krushi Mall app for easy tractor parts ordering
              </p>

              <div className="flex flex-wrap justify-center gap-3">
                <button className="flex items-center cursor-pointer gap-2 bg-gray-800 hover:bg-gray-700 text-white px-5 py-3 rounded-lg text-sm font-medium transition-colors">
                  <FaGooglePlay className="h-4 w-4" />
                  <span>Google Play</span>
                </button>

                <button className="flex items-center cursor-pointer gap-2 bg-gray-800 hover:bg-gray-700 text-white px-5 py-3 rounded-lg text-sm font-medium transition-colors">
                  <FaApple className="h-5 w-5" />
                  <span>App Store</span>
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="lg:border-t border-gray-800">
        {/* Updated: Matching BrandsMakers spacing */}
        <div className="px-4 sm:px-6 lg:px-20 xl:px-24">
          {/* Updated: Applied the same max-width wrapper */}
          <div className="w-full max-w-[1440px] xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto py-4">
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-gray-500 text-center sm:text-left">
                © 2025 Krushi Mall. All rights reserved. | India's Trusted Tractor
                Marketplace
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="text-xs text-gray-500 hover:text-green-500 transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-xs text-gray-500 hover:text-green-500 transition-colors"
                >
                  Terms of Service
                </a>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;