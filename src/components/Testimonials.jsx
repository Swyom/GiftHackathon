import React from 'react';
import { Star, Quote } from 'lucide-react';

export const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Professional Runner",
      image: "👩‍💼",
      rating: 5,
      text: "SoleStep shoes have transformed my running experience. The comfort and support are unmatched. I've never felt better!"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Business Executive",
      image: "👨‍💼",
      rating: 5,
      text: "Elegance meets comfort in every pair. These shoes look as professional as they feel. Highly recommended!"
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      role: "Fashion Blogger",
      image: "👩‍🎨",
      rating: 5,
      text: "Finally found shoes that don't compromise on style or comfort. SoleStep is my go-to brand now!"
    },
    {
      id: 4,
      name: "James Wilson",
      role: "Athletes Coach",
      image: "👨‍🏫",
      rating: 5,
      text: "I recommend SoleStep to all my athletes. The quality is exceptional and the results speak for themselves."
    },
    {
      id: 5,
      name: "Lisa Anderson",
      role: "Travel Enthusiast",
      image: "👩‍🦰",
      rating: 5,
      text: "Wore them throughout my European trip. Comfortable enough for 10k steps daily, stylish enough for dinner!"
    },
    {
      id: 6,
      name: "David Thompson",
      role: "CEO, Tech Startup",
      image: "👨‍💻",
      rating: 5,
      text: "Premium quality at a reasonable price. SoleStep delivers exactly what they promise. Outstanding service!"
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-full text-gray-300 text-sm font-medium inline-block mb-4">
            CUSTOMER REVIEWS
          </span>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Loved by Our Customers
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have discovered the SoleStep difference
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl p-8 hover:border-gray-600 transition duration-300 hover:shadow-2xl group"
            >
              {/* Quote Icon */}
              <Quote size={32} className="text-gray-700 mb-4" />

              {/* Testimonial Text */}
              <p className="text-gray-200 mb-6 leading-relaxed">{testimonial.text}</p>

              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-4 border-t border-gray-700/50 pt-6">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center text-2xl">
                  {testimonial.image}
                </div>
                <div>
                  <h4 className="text-white font-bold">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Metrics */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 p-8 bg-gray-800/30 border border-gray-700/50 rounded-xl">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">4.9/5</div>
            <p className="text-gray-300">Average Rating</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">50,000+</div>
            <p className="text-gray-300">Happy Customers</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">98%</div>
            <p className="text-gray-300">Satisfaction Rate</p>
          </div>
        </div>
      </div>
    </section>
  );
};
