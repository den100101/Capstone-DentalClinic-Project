import "../styles/chart.css";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

function MonthlyRevenueChart() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [monthlyRevenue, setMonthlyRevenue] = useState(Array(12).fill(0));

  async function GetMonthlyRevenue() {
    try {
      const response = await fetch(`${API_URL}/get_monthly_revenue`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      const revenue = Number(data.monthly_revenue) || 0;

      const currentMonth = new Date().getMonth();

      const revenueData = Array(12).fill(0);

      revenueData[currentMonth] = revenue;

      setMonthlyRevenue(revenueData);
    } catch (error) {
      console.error("Error fetching monthly revenue:", error);

      // Keep chart data valid even if API fails
      setMonthlyRevenue(Array(12).fill(0));
    }
  }

  useEffect(() => {
    GetMonthlyRevenue();
  }, []);

  const chartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],

    datasets: [
      {
        label: "Monthly Revenue",
        data: Array.isArray(monthlyRevenue)
          ? monthlyRevenue
          : Array(12).fill(0),

        borderColor: "rgb(199, 8, 8)",
        backgroundColor: "rgba(126, 4, 4, 0.2)",

        fill: true,
        tension: 0.4,

        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "top",
      },

      title: {
        display: true,
        text: "Monthly Revenue",
      },
    },

    scales: {
      y: {
        beginAtZero: true,
        max: 50000,

        ticks: {
          stepSize: 10000,

          callback: (value) => {
            if (value === 0) {
              return "₱0k";
            }

            return `₱${value / 1000}k`;
          },
        },
      },
    },
  };

  return (
    <div className="chart">
      <Line data={chartData} options={options} />
    </div>
  );
}

export default MonthlyRevenueChart;
