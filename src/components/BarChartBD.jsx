import React from 'react';
import {
    BarChart, Bar, Rectangle, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const BarChartBD = ({ chartData }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={chartData}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="expenseType" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="expenseAmount" fill="#AB20FD" activeBar={<Rectangle fill="#FF00B4" stroke="blue" />} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default BarChartBD;