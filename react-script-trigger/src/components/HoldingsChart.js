import React, { useEffect, useRef } from 'react';
import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js';

// Register necessary components
Chart.register(PieController, ArcElement, Tooltip, Legend);

const PieChart = ({ holdings }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = new Chart(chartRef.current, {
      type: 'pie',
      data: {
        labels: holdings.map(stock => stock.name),
        datasets: [{
          data: holdings.map(stock => stock.investedAmount),
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
            '#FF9F40', '#FFCD56', '#4BC0C0', '#9966FF', '#FF6384'
          ],
          hoverBackgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
            '#FF9F40', '#FFCD56', '#4BC0C0', '#9966FF', '#FF6384'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
                const percentage = ((value / total) * 100).toFixed(2);
                return `${label}: ${percentage}%`;
              }
            }
          }
        }
      }
    });

    return () => {
      chart.destroy();
    };
  }, [holdings]);

  return (
    <div style={{ width: '400px', height: '400px' }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default PieChart;
