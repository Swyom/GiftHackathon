import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const NewsModule = () => {
    const [news, setNews] = useState([]);
    const [activeAlert, setActiveAlert] = useState(null);

    useEffect(() => {
        // Listen for real-time market alerts
        socket.on('market_alert', (data) => {
            setActiveAlert(data);
            setTimeout(() => setActiveAlert(null), 10000); // Auto-hide
        });

        return () => socket.off('market_alert');
    }, []);

    return (
        <div className="p-4">
            {/* Drastic Event Alert System UI */}
            {activeAlert && (
                <div className="bg-red-600 text-white p-4 rounded-lg mb-4 animate-pulse shadow-lg border-2 border-yellow-400">
                    <h2 className="font-bold text-lg">⚠️ {activeAlert.title}</h2>
                    <p>{activeAlert.message}</p>
                </div>
            )}

            {/* Financial News Intelligence Feed */}
            <h1 className="text-2xl font-bold mb-4 text-white">Market Intelligence</h1>
            <div className="space-y-4">
                {news.map((item, index) => (
                    <div key={index} className="bg-gray-800 p-4 rounded border-l-4 border-blue-500">
                        <h3 className="text-lg font-semibold text-blue-300">{item.headline}</h3>
                        <p className="text-gray-400">{item.summary}</p>
                        {/* Visual Impact Badge */}
                        <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs font-mono bg-gray-700 px-2 py-1 rounded text-green-400">
                                ML Prediction: {item.sentiment_label}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewsModule;