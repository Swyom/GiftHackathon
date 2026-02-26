import React from 'react';

const SentimentGauge = ({ score }) => {
    // Map score (-1 to 1) to a rotation (0 to 180 degrees)
    const rotation = (score + 1) * 90; 

    return (
        <div className="flex flex-col items-center p-4 bg-gray-800 rounded-xl">
            <h4 className="text-sm font-semibold mb-2">Market Sentiment Meter</h4>
            <div className="relative w-32 h-16 overflow-hidden">
                <div className="w-32 h-32 border-8 border-gray-700 rounded-full"></div>
                <div 
                    className="absolute top-0 left-0 w-32 h-32 border-8 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full transition-transform duration-1000"
                    style={{ transform: `rotate(${rotation}deg)` }}
                ></div>
            </div>
            <p className="mt-2 text-xs font-bold text-blue-400">IMPACT: HIGH</p>
        </div>
    );
};