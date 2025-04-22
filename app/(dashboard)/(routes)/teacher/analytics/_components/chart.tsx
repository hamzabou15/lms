"use client"

import { Card } from "@/components/ui/card";
import { BarChart } from "recharts";
import { Bar, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";


interface ChartProps {

    data: {
        name: string;
        total: number;
    }[];

}


const Chart = ({
    data
}: ChartProps) => {
    return (
        <Card>
            <ResponsiveContainer
                width="100%"
                height={300}
            >
                <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="name" />
                    <YAxis
                        tickFormatter={(value) =>
                            `${value} MAD `
                        }
                    />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>

        </Card>
    )
}

export default Chart
