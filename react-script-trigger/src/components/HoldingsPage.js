import React, { useState, useEffect } from 'react';
import './HoldingsPage.css';
import StockCard from './StockCard';
import { Pie } from 'react-chartjs-2';

const Holdings = () => {
  const [holdings, setHoldings] = useState([]);
  const [totalInvestedAmount, setTotalInvestedAmount] = useState(0);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/holdings', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        setHoldings(data);
        const total = data.reduce((acc, stock) => {
          const investedAmount = calculateInvestedAmount(stock.avg, stock.no_shares);
          return acc + parseFloat(investedAmount);
        }, 0);
        setTotalInvestedAmount(total);

        // Prepare data for the pie chart
        const chartLabels = data.map(stock => stock.name);
        const chartValues = data.map(stock => calculateInvestedAmount(stock.avg, stock.no_shares));

        setChartData({
          labels: chartLabels,
          datasets: [
            {
              data: chartValues,
              backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
                '#FF9F40',
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
                '#FF9F40',
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
                '#FF9F40',
              ],
              hoverOffset: 10, // Add hover offset to make the pie slice pop out
            },
          ],
        });
      })
      .catch(error => console.error('Error fetching holdings:', error));
  }, []);

  const calculateInvestedAmount = (avgPrice, noShares) => {
    const avg = parseFloat(avgPrice.replace(/,/g, '').replace(/₹/g, ''));
    const shares = parseInt(noShares, 10);

    if (!isNaN(avg) && !isNaN(shares)) {
      return (avg * shares).toFixed(2);
    }
    return 'N/A';
  };

  const calculatePercentage = (investedAmount) => {
    if (totalInvestedAmount > 0) {
      return ((investedAmount / totalInvestedAmount) * 100).toFixed(2);
    }
    return 0;
  };

  return (
    <div className="holdings-page-container">
      <div className="holdings-container">
        <h2>Holdings</h2>
        <div className="total-invested-card">
          <p>Total Invested Amount: ₹{totalInvestedAmount.toFixed(2)}</p>
        </div>
        {holdings.length > 0 ? (
          holdings.map((stock, index) => {
            const investedAmount = calculateInvestedAmount(stock.avg, stock.no_shares);
            const percentage = calculatePercentage(investedAmount);
            return (
              <StockCard
                key={index}
                name={stock.name}
                avgPrice={stock.avg}
                noShares={stock.no_shares}
                investedAmount={investedAmount}
                percentage={percentage}
              />
            );
          })
        ) : (
          <p>No holdings found.</p>
        )}
      </div>

      {chartData && (
        <div className="chart-container">
          <Pie
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false, // Disable legend
                },
                tooltip: {
                  callbacks: {
                    label: function (tooltipItem) {
                      return `${tooltipItem.label}: ₹${tooltipItem.raw}`;
                    },
                  },
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Holdings;
