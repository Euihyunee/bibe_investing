'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { Card, CardTitle, CardDescription, Button } from '@/shared/ui/styled'
import { StockSearch } from '@/features/stock-search/ui/StockSearch'
import { Stock } from '@/shared/types'
import { usePortfolio } from '@/features/portfolio/model/usePortfolio'

const Form = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 16px;
`

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`

const Label = styled.label`
    font-size: 14px;
    font-weight: 600;
    color: #374151;
`

const Input = styled.input`
    padding: 12px 16px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
    outline: none;

    &:focus {
        border-color: #3b82f6;
    }
`

const Row = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
`

const SelectedStockInfo = styled.div`
    padding: 12px;
    background: #f0f9ff;
    border: 1px solid #bae6fd;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const SymbolTag = styled.span`
    font-size: 12px;
    font-weight: 700;
    color: #0369a1;
    background: #e0f2fe;
    padding: 2px 8px;
    border-radius: 4px;
`

const ExchangeRateInfo = styled.div`
    margin-top: 16px;
    padding: 12px;
    background: #f8fafc;
    border-radius: 8px;
    border: 1px dashed #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    color: #64748b;
`

/**
 * 주식 추가 위젯
 */
export const AddStockWidget = () => {
    const { addItem, summary } = usePortfolio()
    const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
    const [quantity, setQuantity] = useState('')
    const [price, setPrice] = useState('')

    const handleAddStock = async () => {
        if (!selectedStock || !quantity || !price) {
            alert('모든 필드를 입력해주세요.')
            return
        }

        const result = await addItem({
            symbol: selectedStock.symbol,
            name: selectedStock.name,
            market: selectedStock.market,
            quantity: Number(quantity),
            average_price: Number(price),
            currency: selectedStock.market === 'US' ? 'USD' : 'KRW'
        } as any)

        if (result.success) {
            alert(`${selectedStock.name} 종목이 포트폴리오에 추가되었습니다!`)
            // 초기화
            setSelectedStock(null)
            setQuantity('')
            setPrice('')
        } else {
            alert(`추가 실패: ${result.error}`)
        }
    }

    return (
        <Card>
            <CardTitle>종목 추가하기</CardTitle>
            <CardDescription>새로운 주식을 검색해서 내 포트폴리오에 담아보세요.</CardDescription>

            <Form>
                <FormGroup>
                    <Label>종목 검색</Label>
                    <StockSearch onSelect={(stock) => setSelectedStock(stock)} />
                </FormGroup>

                {selectedStock && (
                    <SelectedStockInfo>
                        <div>
                            <div style={{ fontSize: '14px', fontWeight: '600' }}>{selectedStock.name}</div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>현지 시장: {selectedStock.market}</div>
                        </div>
                        <SymbolTag>{selectedStock.symbol}</SymbolTag>
                    </SelectedStockInfo>
                )}

                <Row>
                    <FormGroup>
                        <Label>수량</Label>
                        <Input
                            type="number"
                            placeholder="주"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>매수가</Label>
                        <Input
                            type="number"
                            placeholder="가격"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </FormGroup>
                </Row>

                <Button
                    $variant="primary"
                    onClick={handleAddStock}
                    disabled={!selectedStock}
                    style={{ marginTop: '8px' }}
                >
                    포트폴리오에 추가
                </Button>

                {summary.exchangeRate && (
                    <ExchangeRateInfo>
                        <span>현재 기준 환율</span>
                        <span style={{ fontWeight: '700', color: '#334155' }}>
                            1 USD = {summary.exchangeRate.toLocaleString(undefined, { minimumFractionDigits: 1 })} KRW
                        </span>
                    </ExchangeRateInfo>
                )}
            </Form>
        </Card>
    )
}
