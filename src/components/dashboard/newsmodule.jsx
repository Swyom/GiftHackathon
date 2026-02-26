import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

// TIP: If your backend console says "Running on 5001", change this to 5001
const socket = io('http://localhost:5000');

const NewsModule = () => {
    const [news, setNews] = useState([]);
    const [activeAlert, setActiveAlert] = useState(null);

useEffect(() => {
    // 1. Initial Fetch for News List
    const fetchNews = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/news'); 
            const data = await response.json();
            console.log("News Data Arrived:", data); 
            setNews(data);
        } catch (err) {
            console.error("Fetch Error:", err);
        }
    };
    fetchNews();

    // 2. Real-Time Alert Listener
    // Ensure the event name 'market_alert' matches your backend io.emit
    socket.on('market_alert', (data) => {
        console.log("🚨 Real-time alert received:", data); 
        setActiveAlert(data);

        // Keep it visible for 15 seconds so judges don't miss it
        setTimeout(() => {
            setActiveAlert(null);
        }, 15000);
    });

    // 3. Cleanup: Stop listening when component unmounts
    return () => {
        socket.off('market_alert');
    };
}, []);

    return (
        <div className="p-4 bg-gray-900 min-h-screen">
            {/* Drastic Event Alert UI */}
            {activeAlert && (
                <div className="fixed top-4 right-4 z-50 bg-red-600 text-white p-6 rounded-lg animate-bounce shadow-2xl border-4 border-yellow-400 max-w-md">
                    <h2 className="font-bold text-xl mb-1">🚨 {activeAlert.title}</h2>
                    <p className="font-medium">{activeAlert.message}</p>
                    <p className="text-sm mt-2 opacity-90">{activeAlert.impact}</p>
                </div>
            )}

            <h1 className="text-3xl font-bold mb-6 text-white border-b border-gray-700 pb-2">Market Intelligence</h1>
            <div className="space-y-4">
                {news.length > 0 ? (
                    news.map((item, index) => (
                        <div key={index} className="bg-gray-800 p-5 rounded-xl border-l-8 border-blue-500 hover:bg-gray-750 transition-all shadow-md">
                            <h3 className="text-lg font-bold text-blue-300 leading-tight mb-2">{item.headline}</h3>
                            <p className="text-gray-400 text-sm mb-3">{item.summary}</p>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold px-3 py-1 rounded-full bg-opacity-20 ${item.color || 'bg-blue-500 text-blue-400'}`}>
                                    ML Prediction: {item.sentiment_label}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 italic">Fetching latest market intelligence...</p>
                )}
            </div>
        </div>
    );
};

export default NewsModule;