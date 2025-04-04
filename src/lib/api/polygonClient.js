/**
 * Polygon.io API client for Stock Advisor application
 */

// Store API key in environment variable for security
const POLYGON_API_KEY = process.env.POLYGON_API_KEY || 'YOUR_POLYGON_API_KEY'; // Replace with your actual API key

/**
 * Get stock aggregates (candlestick) data
 * @param {string} symbol - Stock symbol
 * @param {string} multiplier - Time multiplier (e.g., 1, 5, 15)
 * @param {string} timespan - Time span (minute, hour, day, week, month, quarter, year)
 * @param {string} from - From date (YYYY-MM-DD)
 * @param {string} to - To date (YYYY-MM-DD)
 * @returns {Promise<Object>} Aggregates data
 */
export const getStockAggregates = async (symbol, multiplier = 1, timespan = 'day', from, to) => {
  try {
    // Normalize parameters
    const normalizedSymbol = symbol.toUpperCase();
    
    // Calculate default date range if not provided (30 days)
    if (!to) {
      to = new Date().toISOString().split('T')[0]; // Today
    }
    
    if (!from) {
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - 30); // 30 days ago
      from = fromDate.toISOString().split('T')[0];
    }
    
    // Construct URL
    const url = `/api/polygon-proxy/aggregates/${normalizedSymbol}/${multiplier}/${timespan}/${from}/${to}`;
    
    // Make the request
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch aggregate data');
    }
    
    return data.data;
  } catch (error) {
    console.error(`Error fetching aggregates for ${symbol}:`, error);
    throw error;
  }
};

/**
 * Get daily open/close data for a stock
 * @param {string} symbol - Stock symbol
 * @param {string} date - Date in 'YYYY-MM-DD' format
 * @returns {Promise<Object>} Daily open/close data
 */
export const getDailyOpenClose = async (symbol, date) => {
  try {
    // Normalize parameters
    const normalizedSymbol = symbol.toUpperCase();
    
    // Use today's date if not provided
    if (!date) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1); // Yesterday to ensure market has closed
      date = yesterday.toISOString().split('T')[0];
    }
    
    // Construct URL
    const url = `/api/polygon-proxy/daily-open-close/${normalizedSymbol}/${date}`;
    
    // Make the request
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch daily open/close data');
    }
    
    return data.data;
  } catch (error) {
    console.error(`Error fetching daily open/close for ${symbol} on ${date}:`, error);
    throw error;
  }
};

/**
 * Get previous close data for a stock
 * @param {string} symbol - Stock symbol
 * @returns {Promise<Object>} Previous close data
 */
export const getPreviousClose = async (symbol) => {
  try {
    // Normalize parameters
    const normalizedSymbol = symbol.toUpperCase();
    
    // Construct URL
    const url = `/api/polygon-proxy/previous-close/${normalizedSymbol}`;
    
    // Make the request
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch previous close data');
    }
    
    return data.data;
  } catch (error) {
    console.error(`Error fetching previous close for ${symbol}:`, error);
    throw error;
  }
};

/**
 * Get company details for a stock
 * @param {string} symbol - Stock symbol
 * @returns {Promise<Object>} Company details
 */
export const getTickerDetails = async (symbol) => {
  try {
    // Normalize parameters
    const normalizedSymbol = symbol.toUpperCase();
    
    // Construct URL
    const url = `/api/polygon-proxy/ticker-details/${normalizedSymbol}`;
    
    // Make the request
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch ticker details');
    }
    
    return data.data;
  } catch (error) {
    console.error(`Error fetching ticker details for ${symbol}:`, error);
    throw error;
  }
};

/**
 * Get insider transactions for a stock
 * @param {string} symbol - Stock symbol
 * @returns {Promise<Object>} Insider transactions
 */
export const getInsiderTransactions = async (symbol) => {
  try {
    // Normalize parameters
    const normalizedSymbol = symbol.toUpperCase();
    
    // Construct URL
    const url = `/api/polygon-proxy/insider-transactions/${normalizedSymbol}`;
    
    // Make the request
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch insider transactions');
    }
    
    return data.data;
  } catch (error) {
    console.error(`Error fetching insider transactions for ${symbol}:`, error);
    throw error;
  }
};

/**
 * Get market status
 * @returns {Promise<Object>} Market status
 */
export const getMarketStatus = async () => {
  try {
    // Construct URL
    const url = `/api/polygon-proxy/market-status`;
    
    // Make the request
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch market status');
    }
    
    return data.data;
  } catch (error) {
    console.error(`Error fetching market status:`, error);
    throw error;
  }
};

/**
 * Get technical indicators for a stock
 * @param {string} symbol - Stock symbol
 * @param {string} indicator - Technical indicator type (e.g., sma, ema, macd)
 * @param {Object} params - Additional parameters
 * @returns {Promise<Object>} Technical indicator data
 */
export const getTechnicalIndicators = async (symbol, indicator, params = {}) => {
  try {
    // Normalize parameters
    const normalizedSymbol = symbol.toUpperCase();
    
    // Construct URL
    const url = `/api/polygon-proxy/indicators/${indicator}/${normalizedSymbol}`;
    
    // Add additional parameters
    const queryParams = new URLSearchParams(params);
    
    // Make the request
    const response = await fetch(`${url}?${queryParams.toString()}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch technical indicators');
    }
    
    return data.data;
  } catch (error) {
    console.error(`Error fetching ${indicator} for ${symbol}:`, error);
    throw error;
  }
};

/**
 * Fetch comprehensive stock data (combines multiple API calls)
 * @param {string} symbol - Stock symbol
 * @returns {Promise<Object>} Comprehensive stock data
 */
export const getComprehensiveStockData = async (symbol) => {
  try {
    // Since we might hit rate limits or have other issues, use Promise.allSettled
    // to get as much data as possible, even if some requests fail
    const [aggregatesResult, tickerDetailsResult, insiderTransactionsResult] = await Promise.allSettled([
      getStockAggregates(symbol),
      getTickerDetails(symbol),
      getInsiderTransactions(symbol),
    ]);
    
    // Extract values or null for each result
    const aggregatesData = aggregatesResult.status === 'fulfilled' ? aggregatesResult.value : null;
    const tickerDetailsData = tickerDetailsResult.status === 'fulfilled' ? tickerDetailsResult.value : null;
    const insiderTransactionsData = insiderTransactionsResult.status === 'fulfilled' ? insiderTransactionsResult.value : null;
    
    // Return whatever data we have
    return {
      symbol,
      aggregatesData,
      tickerDetailsData,
      insiderTransactionsData,
    };
  } catch (error) {
    console.error(`Error fetching comprehensive data for ${symbol}:`, error);
    throw error;
  }
};
