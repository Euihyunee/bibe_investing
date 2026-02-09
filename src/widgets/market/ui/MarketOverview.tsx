/**
 * 시장 현황 위젯
 * 미국, 한국, 브릭스 시장의 주요 지수를 보여줍니다
 */

'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card'
import { formatPercent } from '@/shared/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface MarketIndex {
    name: string
    value: number
    change: number
    changePercent: number
}

interface MarketOverviewProps {
    usMarket: MarketIndex
    krMarket: MarketIndex
    bricsMarket: MarketIndex
}

export function MarketOverview({ usMarket, krMarket, bricsMarket }: MarketOverviewProps) {
    const markets = [
        { label: '미국 (S&P 500)', data: usMarket },
        { label: '한국 (KOSPI)', data: krMarket },
        { label: '브릭스', data: bricsMarket },
    ]

    return (
        <div className="grid md:grid-cols-3 gap-4">
            {markets.map(({ label, data }) => {
                const isPositive = data.changePercent >= 0

                return (
                    <Card key={label}>
                        <CardContent className="pt-6">
                            <div className="space-y-2">
                                <div className="text-sm text-muted-foreground">{label}</div>
                                <div className="text-2xl font-bold">
                                    {data.value.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}
                                </div>
                                <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                    <span>
                                        {isPositive ? '+' : ''}{data.change.toFixed(2)} ({isPositive ? '+' : ''}{formatPercent(data.changePercent)})
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
