import React from 'react';
import { CheckCircle, Award, Users, Zap } from 'lucide-react';

export const About = () => {
  const features = [
    {
      icon: Award,
      title: "Award-Winning Design",
      description: "Recognized globally for innovative and timeless shoe designs"
    },
    {
      icon: Users,
      title: "Customer First",
      description: "We prioritize customer satisfaction above everything else"
    },
    {
      icon: Zap,
      title: "Superior Quality",
      description: "Premium materials and craftsmanship in every pair"
    },
    {
      icon: CheckCircle,
      title: "Lifetime Guarantee",
      description: "We stand behind our products with a lifetime guarantee"
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div>
            <span className="px-4 py-2 bg-gray-900/10 rounded-full text-gray-900 text-sm font-medium inline-block mb-4">
              ABOUT OUR BRAND
            </span>
            <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Crafted for Excellence Since 1999
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              SoleStep has been at the forefront of footwear innovation for over two decades. We believe that great shoes go beyond aesthetics—they're about comfort, quality, and the way they make you feel.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Every pair we create is a testament to our commitment to excellence, using only the finest materials and employing skilled craftsmen who take pride in their work.
            </p>
            <button className="px-8 py-4 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition duration-300">
              Learn Our Story
            </button>
          </div>

          {/* Right Features Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 border border-gray-100">
                  <div className="w-12 h-12 bg-gray-900/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon size={24} className="text-gray-900" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 pt-16 border-t border-gray-200">
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-900 mb-2">25+</div>
            <p className="text-gray-600 font-medium">Years in Business</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-900 mb-2">150+</div>
            <p className="text-gray-600 font-medium">Countries Worldwide</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-900 mb-2">500K+</div>
            <p className="text-gray-600 font-medium">Pairs Sold Annually</p>
          </div>
        </div>
      </div>
    </section>
  );
};
