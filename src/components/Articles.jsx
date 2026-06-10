import { ArrowRight } from 'lucide-react';

const Articles = () => {
  const articles = [
    {
      title: 'How to Choose the Right Tractor for Your Farm: Complete Guide 2024',
      date: '27 Apr, 2024',
      excerpt: 'Learn about HP requirements, soil types, and attachment compatibility to make the best purchase decision for your farming needs.',
      image: 'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?w=400&h=250&fit=crop&auto=format',
      category: 'Buying Guide',
      readTime: '8 min read',
    },
    {
      title: 'Mahindra vs Swaraj vs John Deere: Which Tractor Brand is Best?',
      date: '06 Apr, 2024',
      excerpt: 'Detailed comparison of India top tractor brands based on performance, maintenance cost, resale value, and farmer reviews.',
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=250&fit=crop&auto=format',
      category: 'Comparison',
      readTime: '12 min read',
    },
    {
      title: 'Government Subsidies for Tractors 2024: Complete State-wise List',
      date: '28 Mar, 2024',
      excerpt: 'Check eligibility for PM Kisan Yojana, state subsidies, and bank loan schemes available for tractor purchase in your state.',
      image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=250&fit=crop&auto=format',
      category: 'Finance',
      readTime: '7 min read',
    },
    {
      title: 'Used Tractor Buying Checklist: 15 Points to Inspect Before Purchase',
      date: '02 Mar, 2024',
      excerpt: 'Complete inspection guide covering engine condition, hydraulic system, tires, paperwork verification, and price negotiation tips.',
      image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=250&fit=crop&auto=format',
      category: 'Buying Guide',
      readTime: '11 min read',
    },
    {
      title: 'Organic Farming with Tractors: Sustainable Agriculture Practices',
      date: '20 Feb, 2024',
      excerpt: 'Modern tractor techniques for organic farming including minimum tillage, cover cropping, and precision agriculture methods.',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=250&fit=crop&auto=format',
      category: 'Farming',
      readTime: '5 min read',
    },
  ];

  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className=" px-4 sm:px-6 lg:px-20">
        
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 px-4 py-1.5 rounded-lg mb-4">
            <span className="text-green-700 text-sm font-semibold"> Knowledge Center</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-3">
            Tractor <span className="text-transparent bg-clip-text bg-green-600">Articles & Guides</span>
          </h2>
          
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Expert advice, maintenance tips, and buying guides for farmers
          </p>
        </div>
      
        {/* Article Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {articles.slice(1).map((article, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-400"
            >
              <div className="relative overflow-hidden h-48">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-green-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    {article.category}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-500 font-medium">{article.date}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{article.readTime}</span>
                </div>
                <h3 className="font-bold text-gray-900 leading-snug group-hover:text-green-600 transition-colors line-clamp-2 mb-2">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">{article.excerpt}</p>
                <button className="text-green-600 cursor-pointer font-semibold text-sm hover:text-green-700 transition-colors flex items-center gap-1 group/btn">
                  Read More
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <button className="inline-flex cursor-pointer items-center gap-2 bg-green-600 hover:from-green-700 hover:to-green-700 text-white font-semibold px-8 py-4 rounded-xl transition-all hover:shadow-lg group">
            View All Articles
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-green-500 rounded-2xl p-8 md:p-12 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-black mb-3">
              Get Tractor Tips in Your Inbox
            </h3>
            <p className="text-white font-black mb-6">
              Subscribe to our newsletter for weekly maintenance tips, buying guides, and exclusive offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <button className="bg-white cursor-pointer text-green-600 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
            <p className="text-white text-xs font-black mt-3">No spam, unsubscribe anytime.</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Articles;