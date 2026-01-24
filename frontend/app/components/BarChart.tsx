"use client"

import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type SalesData = {
    date: string;
    total: number;
};

export default function BarChart({ children, name }: any) {
    const [chartData, setChartData] = useState<any>(null);
    const [chartOptions, setChartOptions] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSales() {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/getLastWeekPurchases`, { withCredentials: true });
                const sales: SalesData[] = response.data;

                // Map dates to short weekday labels
                const labels = sales.map(s => {
                    const d = new Date(s.date);
                    return d.toLocaleDateString('en-US', { weekday: 'short' });
                });

                const data = sales.map(s => s.total);

                setChartData({
                    labels: labels,
                    datasets: [{
                        label: 'Sales $',
                        data: data,
                        borderColor: 'rgb(0,0,0)',
                        backgroundColor: 'rgb(238,30,15)',
                    }]
                });

                setChartOptions({
                    plugins: {
                        legend: { position: 'top' },
                        title: { display: true, text: 'Daily Revenue' }
                    },
                    maintainAspectRatio: false,
                    responsive: true
                });

            } catch (error) {
                console.error("Failed to fetch sales data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchSales();
    }, []);

    if (loading || !chartData) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <div className='w-full md:col-span-2 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-white'>
            <Bar data={chartData} options={chartOptions} />
        </div>
    );
};
