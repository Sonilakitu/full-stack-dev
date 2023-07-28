
require('dotenv').config();
const axios = require("axios");
const config = require("../config.js");
const apiKey = config.apiKey;
const polygonBaseUrl = 'https://api.polygon.io/v1';

/**
 * @description Project the required fields
 * @param {*} payload 
 * @param {*} keys 
 * @returns 
 */
const dataProjector = (payload, keys) => {

  const responseData = {};
  for (const key of keys) {
    if (payload[key]) {
      responseData[key] = payload[key];
    }
  }

  return responseData;
};

/**
 * @description Takes the req as input and give the particular date stock info
 * @param {*} req 
 * @param {*} res
 */
const specificDayStockHandler = async (req, res) => {
  try {
    // NOTE: Date format (YYYY-MM-DD)
    const { symbol, date } = req.body;

    // Check if symbol and date are provided
    if (!symbol) {
      return res.status(400).json({ error: { message: 'Stock symbol is required.' } });
    }

    if (!date) {
      return res.status(400).json({ error: { message: 'Date is required.' } });
    }

    const response = await axios.get(`${polygonBaseUrl}/open-close/${symbol}/${date}?apiKey=${apiKey}`);

    if (!response?.data) {
      return res.status(404).json({ error: { message: 'Trade statistics not found for the provided stock and date.' } });
    }

    const tradeStatistics = response.data;
    const projectedData = dataProjector(tradeStatistics, ['open', 'close', 'low', 'high', 'volume']);

    res.json(projectedData);
  } catch (error) {
    console.error('Error fetching stock data:', error);

    // Provide a more generic error message for unexpected errors
    let errorMessage = 'An error occurred while fetching stock data.';

    // Check if the error is an Axios error and has a response
    if (error.isAxiosError && error.response) {
      const { status, data } = error.response;

      // Provide more specific error messages for known error cases
      if (status === 400) {
        errorMessage = data.error || 'Bad Request.';
      } else if (status === 404) {
        errorMessage = data.error || 'Trade statistics not found.';
      } else if (status === 500) {
        errorMessage = 'Internal server error. Please try again later.';
      }
    }

    res.status(404).json({ error: { message: errorMessage } });
  }
};


module.exports = {
  specificDayStockHandler
};