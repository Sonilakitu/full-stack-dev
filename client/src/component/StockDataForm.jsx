import React, { useState } from "react";
import axios from "axios";
import "./StockDataForm.css";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StockDataForm = () => {
    const [symbol, setSymbol] = useState("");
    const [date, setDate] = useState("");
    const [result, setResult] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Make the API request
            const response = await axios.post("http://localhost:5010/api/fetchStockData", {
                symbol,
                date,
            });

            // Update the result state with the data from the API response
            toast.success("API Responded Successfully.", {
                position: "top-right",
                autoClose: 5000, // Close after 5 seconds
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
            });
            setResult(response.data);
        } catch (error) {
            // console.error("Error fetching stock data:", error.response);
            // Show toast message with the error
            toast.error(error.response.data.error.message, {
                position: "top-right",
                autoClose: 5000, // Close after 5 seconds
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
            });

            setResult({});
        }
    };

    return (
        <div className="container">
            <div className="flex-container">
            <div className="form-container">
                <h2>Stock Data Form</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Stock Symbol:
                        <input
                            type="text"
                            value={symbol}
                            onChange={(e) => setSymbol(e.target.value)}
                        />
                    </label>
                    <label>
                        Date:
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </label>
                    <button type="submit">Submit</button>
                </form>
            </div>

                {result && (
                <div className="result-container">
                    <h3>Stock Data</h3>
                    <p>Open: {result.open}</p>
                    <p>High: {result.high}</p>
                    <p>Low: {result.low}</p>
                    <p>Close: {result.close}</p>
                    <p>Volume: {result.volume}</p>
                </div>
            )}
                <ToastContainer />
            </div>

        </div>
    );
};

export default StockDataForm;
