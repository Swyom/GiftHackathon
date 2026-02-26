import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';

export const Products = () => {
  const products = [
    {
      id: 1,
      name: "Urban Runner Pro",
      price: "$189",
      rating: 4.8,
      reviews: 128,
      image: "👟",
      badge: "Best Seller"
    },
    {
      id: 2,
      name: "Classic Leather Elite",
      price: "$249",
      rating: 4.9,
      reviews: 95,
      image: "🥾",
      badge: "Premium"
    },
    {
      id: 3,
      name: "Sport Velocity Max",
      price: "$219",
      rating: 4.7,
      reviews: 156,
      image: "🏃",
      badge: "New"
    },
    {
      id: 4,
      name: "Comfort Walker Deluxe",
      price: "$179",
      rating: 4.6,
      reviews: 203,
      image: "🚶",
      badge: "Popular"
    },
    {
      id: 5,
      name: "Urban Runner Lite",
      price: "$149",
      rating: 4.5,
      reviews: 80,
      image: "👟",
      badge: "Eco"
    },
    {
      id: 6,
      name: "Trail Blazer Pro",
      price: "$199",
      rating: 4.7,
      reviews: 110,
      image: "🥾",
      badge: "Adventure"
    },
    {
      id: 7,
      name: "Sprint Flash",
      price: "$229",
      rating: 4.8,
      reviews: 140,
      image: "⚡",
      badge: "Fast"
    },
    {
      id: 8,
      name: "Classic Comfort",
      price: "$159",
      rating: 4.6,
      reviews: 95,
      image: "👞",
      badge: "Comfort"
    }
    // original closing brace retained below
  ];

  return (
    <section id="products" className="min-h-screen py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-gray-100 rounded-full text-gray-900 text-sm font-medium">
              FEATURED COLLECTION
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Our Premium Shoes
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked collection of premium shoes, crafted with precision and style for every occasion.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group">
              <div className="relative bg-gray-100 rounded-xl p-6 overflow-hidden h-64 flex items-center justify-center mb-4 transition duration-300 group-hover:shadow-2xl">
                
                {/* Badge */}
                <span className="absolute top-4 right-4 bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                  {product.badge}
                </span>

                {/* Image Placeholder */}
                <div className="text-6xl transition duration-300 group-hover:scale-110">
                  {product.image}
                </div>

                {/* Overlay Button */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300 flex items-end justify-center pb-4">
                  <button className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition duration-300 px-6 py-3 bg-white text-gray-900 font-bold rounded-lg flex items-center gap-2 hover:bg-gray-100">
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">({product.reviews})</span>
              </div>

              {/* Price */}
              <div className="text-2xl font-bold text-gray-900">{product.price}</div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <button className="px-8 py-4 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition duration-300 inline-block">
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
};
