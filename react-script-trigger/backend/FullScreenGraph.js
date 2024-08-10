import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './App.css';

function FullScreenGraph() {
  const { chartType } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [latestPrice, setLatestPrice] = useState(null); 
  const [comparisonResult, setComparisonResult] = useState(""); 
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/data');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();

        let chartData;

        if (chartType === 'one-day-return') {
          chartData = {
            labels: result.map(item => item.label),
            datasets: [
              {
                label: 'One-Day Returns (₹)',
                data: result.map((item, index) => ({
                  x: item.label,
                  y: item.value,
                  oneDayReturnChange: item.oneDayReturnChange,
                  sensexValue: parseFloat(item.sensex) || 0,
                  sensexChange: item.sensexChange,
                  oneDayReturnSymbol: item.oneDayReturnSymbol,
                })),
                fill: {
                  target: 'origin', 
                  above: 'rgba(75, 192, 192, 0.3)', 
                  below: 'rgba(255, 99, 132, 0.3)', 
                },
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 8,
                tension: 0.4, 
              },
            ],
          };
        } else if (chartType === 'sensex') {
          const sensexValues = result.map(item => parseFloat(item.sensex) || 0);
          const latestSensex = sensexValues[sensexValues.length - 1];

          chartData = {
            labels: result.map(item => item.label),
            datasets: [
              {
                label: 'Sensex',
                data: sensexValues,
                fill: {
                  target: 'origin',
                  above: 'rgba(255, 99, 132, 0.3)',
                  below: 'rgba(75, 192, 192, 0.3)',
                },
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 8,
                tension: 0.4,
              },
            ],
            options: {
              scales: {
                y: {
                  beginAtZero: false,
                  suggestedMin: latestSensex - 5000,
                  suggestedMax: latestSensex + 5000,
                },
              },
            },
          };

          setLatestPrice(`Sensex: ₹${latestSensex.toLocaleString()}`);
        } else if (chartType === 'nifty50') {
          const nifty50Values = result.map(item => parseFloat(item.nifty50) || 0);
          const latestNifty50 = nifty50Values[nifty50Values.length - 1];

          chartData = {
            labels: result.map(item => item.label),
            datasets: [
              {
                label: 'Nifty 50',
                data: nifty50Values,
                fill: {
                  target: 'origin',
                  above: 'rgba(54, 162, 235, 0.3)',
                  below: 'rgba(255, 159, 64, 0.3)',
                },
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 8,
                tension: 0.4,
              },
            ],
            options: {
              scales: {
                y: {
                  beginAtZero: false,
                  suggestedMin: latestNifty50 - 500,
                  suggestedMax: latestNifty50 + 500,
                },
              },
            },
          };

          setLatestPrice(`Nifty 50: ₹${latestNifty50.toLocaleString()}`);
        }

        setData(chartData);
        setLoading(false);
      } catch (error) {
        setError(`Failed to fetch data: ${error.toString()}`);
        setLoading(false);
      }
    };

    fetchGraphData();
  }, [chartType]);

  const handleDataPointClick = (event, elements) => {
    if (chartType !== 'one-day-return' || elements.length === 0) {
      return;
    }

    const index = elements[0].index;
    const dataset = data.datasets[0].data;

    if (index === 0) {
      setComparisonResult("This is the first data point, so no comparison can be made.");
      return;
    }

    const currentSensexValue = dataset[index].sensexValue;
    const previousSensexValue = dataset[index - 1].sensexValue;
    const oneDayReturnChange = dataset[index].oneDayReturnChange;
    const sensexChange = dataset[index].sensexChange;
    const oneDayReturnSymbol = dataset[index].oneDayReturnSymbol;

    let comparisonText = "";

    if (currentSensexValue < previousSensexValue) {
      comparisonText = `<span style="color:red;">Sensex went down by ${sensexChange.toFixed(2)}%</span>`;
    } else {
      comparisonText = `<span style="color:green;">Sensex went up by ${sensexChange.toFixed(2)}%</span>`;
    }

    if (oneDayReturnSymbol === "-") {
      comparisonText += ` and <span style="color:red;">Your portfolio went down by ${oneDayReturnChange}%</span>.`;
    } else {
      comparisonText += ` and <span style="color:green;">Your portfolio went up by ${oneDayReturnChange}%</span>.`;
    }

    setComparisonResult(comparisonText);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div 
      style={{ 
        height: '100vh', 
        width: '100vw', 
        padding: '10px', 
        backgroundColor: '#121212',
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        boxSizing: 'border-box',
        position: 'relative' 
      }}
    >
      {latestPrice && (
        <div 
          style={{
            position: 'absolute',
            top: '10px',
            left: '20px',
            fontSize: '24px',
            color: 'white',
            fontFamily: 'Quicksand, sans-serif', 
          }}
        >
          {latestPrice}
        </div>
      )}
      <div style={{ height: '80%', width: '80%' }}>
        <Line 
          ref={chartRef}
          data={data} 
          options={{
            ...data?.options,
            onClick: chartType === 'one-day-return' ? handleDataPointClick : undefined, 
          }} 
          style={{ height: '100%', width: '100%' }}
        />
      </div>
      {comparisonResult && (
        <div 
          className="comparison-result" 
          style={{ color: 'white', marginTop: '20px', fontFamily: 'Quicksand, sans-serif' }} 
          dangerouslySetInnerHTML={{ __html: comparisonResult }}
        />
      )}
      <button
        onClick={() => navigate(-1)}
        style={{
          backgroundColor: '#333',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          marginTop: '10px'
        }}
      >
        Back
      </button>
    </div>
  );
}

export default FullScreenGraph;
