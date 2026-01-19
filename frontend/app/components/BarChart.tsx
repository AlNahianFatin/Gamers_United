import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartOptions } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type BarChartData = {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        borderColor: string;
        backgroundColor: string;
    }[];
};

export default function BarChart({ children, name }: any) {
    const [chartData, setChartData] = useState<BarChartData>({
        labels: [],
        datasets: [],
    });

    const [chartOptions, setChartOptions] = useState<ChartOptions<'bar'>>({});

    useEffect(() => {
        setChartData({
            labels: ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Sales $',
                data: [18127, 22201, 19490, 17938, 24182, 17842, 22475],
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgb(53, 162, 235, 0.4',
            },]
        });
        
        setChartOptions({
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Daily Revenue' }
            },
            maintainAspectRatio: false,
            responsive: true
        })
    }, [])

    return (
        <>
            <div className='w-full md:col-span-2 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-white'>
                <Bar data={chartData} options={chartOptions} />
            </div>
        </>
    );
};