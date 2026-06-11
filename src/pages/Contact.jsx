import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    alert('Message sent successfully!');
  };

  const contactInfo = [
    { icon: Phone, title: 'Phone', details: ['+91 12345 67890', '+91 98765 43210'], color: 'bg-green-100 text-green-600' },
    { icon: Mail, title: 'Email', details: ['support@partmasters.com', 'sales@partmasters.com'], color: 'bg-green-100 text-green-600' },
    { icon: MapPin, title: 'Address', details: ['123 Auto Parts Street', 'Mumbai, Maharashtra 400001'], color: 'bg-green-100 text-green-600' },
    { icon: Clock, title: 'Working Hours', details: ['Mon - Sat: 9:00 AM - 8:00 PM', 'Sunday: 10:00 AM - 4:00 PM'], color: 'bg-green-100 text-green-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 "> {/* Added pt-16 for mobile, pt-20 for desktop */}
      {/* Hero */}
      <section className="bg-gray-900 text-white py-16">
        <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold  tracking-tight mb-4">Contact Us</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Have questions about a part? Need help with your order? We're here to help!
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="pt-12 md:pt-16 lg:pt-20">
        <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow">
                <div className={`w-14 h-14 ${item.color} bg-opacity-10 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                {item.details.map((detail, j) => (
                  <p key={j} className="text-sm text-gray-600">{detail}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section className="pt-12 md:pt-16 lg:pt-20 pb-6">
       <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 ">

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-6">Send
                 <span className="text-transparent bg-clip-text bg-green-600"> Us a Message
                 </span>
                 </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className='text-red-600'>*</span></label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className='text-red-600'>*</span></label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input 
                    type="text" 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm"
                    placeholder="Order inquiry / Part question"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                  <textarea 
                    rows={5} 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm resize-none"
                    placeholder="How can we help you?"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="h-5 w-5" />
                  Send Message
                </button>
              </form>
            </div>

            {/* FAQ Quick Links */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-6">Frequently  <span className="text-transparent bg-clip-text bg-green-600">Asked Questions
                   </span>
                   </h2>
                <div className="space-y-5">
                  {[
                    { q: 'How do I find parts for my car?', a: 'Use our vehicle selector on the homepage or browse by category.' },
                    { q: 'What is the return policy?', a: 'We offer 10-day assured returns if the part doesn\'t fit your vehicle.' },
                    { q: 'How long does delivery take?', a: 'Typically 3-7 business days depending on your location.' },
                    { q: 'Are the parts genuine?', a: 'We work with verified sellers offering genuine and quality aftermarket parts.' },
                  ].map((faq, i) => (
                    <details key={i} className="group border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <summary className="flex justify-between items-center cursor-pointer text-gray-900 font-medium hover:text-green-600 transition-colors">
                        {faq.q}
                        <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                      </summary>
                      <p className="mt-2 text-sm text-gray-600">{faq.a}</p>
                    </details>
                  ))}
                </div>
              </div>

              <div className="bg-red-50 rounded-2xl p-8 border border-red-100">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Need  <span className="text-transparent bg-clip-text bg-green-600">Immediate Help? </span>
                </h3>
                <p className="text-gray-600 mb-4">Call our support team for urgent queries</p>
                <a href="tel:+911234567890" className="text-green-600 font-bold text-2xl hover:text-green-700 transition-colors">
                  +91 12345 67890
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;