import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/lib/format';
import React from 'react'


interface DataCardProps {
    value: number;
    label: string;
    shouldFormat?: boolean;
}

const DataCard = ({
    value,
    label,
    shouldFormat

}: DataCardProps) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className='text-sm font-medium'>
                    {label}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className='text-2xl font-bold uppercase'>
                    {shouldFormat ? `${formatPrice(value)}` : value}

                </div>
            </CardContent>
        </Card>

    )
}

export default DataCard
