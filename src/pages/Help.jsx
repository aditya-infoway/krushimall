import {
  Search,
  HelpCircle,
  FileText,
  Phone,
  Mail,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      icon: FileText,
      title: "Orders & Shipping",
      articles: [
        "Track your order",
        "Shipping methods",
        "Delivery time",
        "Change order",
      ],
    },
    {
      icon: HelpCircle,
      title: "Returns & Refunds",
      articles: [
        "Return policy",
        "How to return",
        "Refund timeline",
        "Damaged items",
      ],
    },
    {
      icon: Phone,
      title: "Account & Payment",
      articles: [
        "Create account",
        "Payment methods",
        "Billing issues",
        "Account security",
      ],
    },
    {
      icon: Mail,
      title: "Product Help",
      articles: [
        "Find parts",
        "Compatibility check",
        "Product warranty",
        "Installation guide",
      ],
    },
  ];

  const faqs = [
    {
      q: "How do I find the right part for my car?",
      a: "Use our vehicle selector tool on the homepage. Enter your car make, model, and year to see compatible parts.",
    },
    {
      q: "What is the return policy?",
      a: "We offer a 10-day assured return policy. If the part doesn't fit, we'll process your return and refund.",
    },
    {
      q: "How long does delivery take?",
      a: "Standard delivery takes 3-7 business days. Express delivery is available in select cities (1-2 days).",
    },
    {
      q: "Are aftermarket parts reliable?",
      a: "Yes! We only source from trusted aftermarket brands that meet or exceed OEM specifications.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Hero */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold  tracking-tight mb-4">
            Help Center
          </h1>
          <p className="text-gray-300 mb-8">How can we help you today?</p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help articles..."
              className="w-full pl-12 pr-4 py-3.5 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="pt-12 md:pt-16 lg:pt-20">
        <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <cat.icon className="h-8 w-8 text-green-600 mb-4" />
                <h3 className="font-bold text-gray-900 mb-3">{cat.title}</h3>
                <ul className="space-y-2">
                  {cat.articles.map((article, j) => (
                    <li key={j}>
                      <a
                        href="#"
                        className="text-sm text-gray-600 hover:text-green-600 transition-colors flex items-center gap-1"
                      >
                        <ChevronRight className="h-3 w-3" />
                        {article}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="pt-12 md:pt-16 lg:pt-20">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-8 text-center">
            Frequently{" "}
            <span className="text-transparent bg-clip-text bg-green-600">
              {" "}
              Asked Questions{" "}
            </span>
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 group"
              >
                <summary className="flex justify-between items-center cursor-pointer font-semibold text-gray-900 hover:text-green-600 transition-colors">
                  {faq.q}
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-12">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="bg-green-50 rounded-2xl p-8 border border-green-100">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
              Still{" "}
              <span className="text-transparent bg-clip-text bg-green-600">
                Need Help?{" "}
              </span>
            </h3>
            <p className="text-gray-600 mb-6">
              Our support team is ready to assist you
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/contact"
                className="h-12 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center"
              >
                Contact Us
              </a>

              <a
                href="tel:+911234567890"
                className="h-12 px-6 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-lg border border-gray-300 transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="h-4 w-4 text-green-600" />
                <span>Call Now</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Help;
