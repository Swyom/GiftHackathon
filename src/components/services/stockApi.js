import axios from 'axios';

// Use your RapidAPI key - get one from https://rapidapi.com/apidojo/api/yahoo-finance1
const RAPID_API_KEY = '8bef397fc4mshef8901db563bfe9p12177djsnfd7f5065b755'; // Replace with your actual key

const apiClient = axios.create({
  baseURL: 'https://yahoo-finance15.p.rapidapi.com/api/v1',
  headers: {
    'X-RapidAPI-Key': '8bef397fc4mshef8901db563bfe9p12177djsnfd7f5065b755'
,
    'X-RapidAPI-Host': 'yahoo-finance15.p.rapidapi.com'
  }
});

// Indian stocks symbols with .NS suffix for NSE
export const INDIAN_STOCKS = [
  { symbol: 'RELIANCE.NS', name: 'Reliance Industries', sector: 'Energy' },
  { symbol: 'TCS.NS', name: 'Tata Consultancy Services', sector: 'IT' },
  { symbol: 'HDFCBANK.NS', name: 'HDFC Bank', sector: 'Banking' },
  { symbol: 'INFY.NS', name: 'Infosys', sector: 'IT' },
  { symbol: 'ICICIBANK.NS', name: 'ICICI Bank', sector: 'Banking' },
  { symbol: 'HINDUNILVR.NS', name: 'Hindustan Unilever', sector: 'FMCG' },
  { symbol: 'SBIN.NS', name: 'State Bank of India', sector: 'Banking' },
  { symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel', sector: 'Telecom' },
  { symbol: 'ITC.NS', name: 'ITC Limited', sector: 'FMCG' },
  { symbol: 'KOTAKBANK.NS', name: 'Kotak Mahindra Bank', sector: 'Banking' }
];

export const fetchStockQuote = async (symbol) => {
  try {
    const response = await apiClient.get('/markets/quote', {
      params: { ticker: symbol }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching stock quote:', error);
    return null;
  }
};

export const fetchStockCharts = async (symbol, interval = '1d', range = '1mo') => {
  try {
    const response = await apiClient.get('/markets/stock/charts', {
      params: {
        ticker: symbol,
        interval: interval,
        range: range
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching stock charts:', error);
    return null;
  }
};

export const fetchMarketMovers = async () => {
  try {
    const response = await apiClient.get('/markets/movers', {
      params: { region: 'IN' }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching market movers:', error);
    return null;
  }
};

export const searchStocks = async (query) => {
  try {
    const response = await apiClient.get('/markets/search', {
      params: { search: query }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching stocks:', error);
    return null;
  }
};