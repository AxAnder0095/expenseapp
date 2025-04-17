import React, {PureComponent} from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';



const data = [
    {
        name: 'Savings',
        Expense: 2400,

    },
    {
        name: 'Food',
        Expense: 1398,
        amt: 2210,
    },
    {
        name: 'Entertain',
        Expense: 9800,
        amt: 2290,
    },
    {
        name: 'Bills',
        Expense: 3908,
        amt: 2000,
    },
    {
        name: 'Page E',
        Expense: 4800,
        amt: 2181,
    },
    {
        name: 'Page F',
        Expense: 3800,
        amt: 2500,
    },
    {
        name: 'Page G',
        Expense: 4300,
        amt: 2100,
    },
];

export default class BarChartEA extends PureComponent {
    static demoUrl = 'https://codesandbox.io/p/sandbox/simple-bar-chart-72d7y5';

    render() {
        return (
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Expense" fill="#AB20FD" activeBar={<Rectangle fill="#FF00B4" stroke="blue" />} />
                </BarChart>
            </ResponsiveContainer>
        );
    }
}