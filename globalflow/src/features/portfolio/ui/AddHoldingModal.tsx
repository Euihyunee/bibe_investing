/**
 * 종목 추가 모달 컴포넌트
 */

'use client'

import { useState } from 'react'
import styled from 'styled-components'
import { Button, Input, Label, InputGroup, HelperText } from '@/shared/ui/styled'
import type { CreateHoldingRequest } from '../types'

// ========== 스타일 ==========

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const Modal = styled.div`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[6]};
  width: 100%;
  max-width: 28rem;
  box-shadow: ${({ theme }) => theme.shadows.xl};
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`

const ModalTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
`

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text.muted};
  cursor: pointer;
  padding: 0.25rem;
  
  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`

const MarketSelector = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`

const MarketButton = styled.button<{ $active?: boolean }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme, $active }) =>
        $active ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme, $active }) =>
        $active ? theme.colors.primary : 'transparent'};
  color: ${({ theme, $active }) =>
        $active ? 'white' : theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-top: ${({ theme }) => theme.spacing[4]};
`

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-top: ${({ theme }) => theme.spacing[2]};
`

// ========== 컴포넌트 ==========

interface AddHoldingModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: CreateHoldingRequest) => Promise<void>
}

export function AddHoldingModal({ isOpen, onClose, onSubmit }: AddHoldingModalProps) {
    const [market, setMarket] = useState<'US' | 'KR'>('KR')
    const [symbol, setSymbol] = useState('')
    const [name, setName] = useState('')
    const [quantity, setQuantity] = useState('')
    const [averagePrice, setAveragePrice] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        // 유효성 검사
        if (!symbol.trim()) {
            setError('종목 코드를 입력하세요')
            return
        }
        if (!name.trim()) {
            setError('종목명을 입력하세요')
            return
        }
        if (!quantity || Number(quantity) <= 0) {
            setError('수량을 입력하세요')
            return
        }
        if (!averagePrice || Number(averagePrice) <= 0) {
            setError('평균 단가를 입력하세요')
            return
        }

        setLoading(true)
        try {
            await onSubmit({
                symbol: symbol.toUpperCase().trim(),
                name: name.trim(),
                market,
                quantity: Number(quantity),
                average_price: Number(averagePrice),
            })

            // 폼 초기화
            setSymbol('')
            setName('')
            setQuantity('')
            setAveragePrice('')
            onClose()
        } catch (err) {
            setError(err instanceof Error ? err.message : '종목 추가 실패')
        } finally {
            setLoading(false)
        }
    }

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    return (
        <Overlay onClick={handleOverlayClick}>
            <Modal onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                    <ModalTitle>종목 추가</ModalTitle>
                    <CloseButton onClick={onClose}>&times;</CloseButton>
                </ModalHeader>

                <Form onSubmit={handleSubmit}>
                    <InputGroup>
                        <Label>시장</Label>
                        <MarketSelector>
                            <MarketButton
                                type="button"
                                $active={market === 'KR'}
                                onClick={() => setMarket('KR')}
                            >
                                🇰🇷 한국
                            </MarketButton>
                            <MarketButton
                                type="button"
                                $active={market === 'US'}
                                onClick={() => setMarket('US')}
                            >
                                🇺🇸 미국
                            </MarketButton>
                        </MarketSelector>
                    </InputGroup>

                    <InputGroup>
                        <Label htmlFor="symbol">종목 코드</Label>
                        <Input
                            id="symbol"
                            type="text"
                            placeholder={market === 'KR' ? '예: 005930' : '예: AAPL'}
                            value={symbol}
                            onChange={(e) => setSymbol(e.target.value)}
                        />
                        <HelperText>
                            {market === 'KR' ? '6자리 숫자 코드' : '미국 티커 심볼'}
                        </HelperText>
                    </InputGroup>

                    <InputGroup>
                        <Label htmlFor="name">종목명</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder={market === 'KR' ? '예: 삼성전자' : '예: Apple Inc.'}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </InputGroup>

                    <InputGroup>
                        <Label htmlFor="quantity">수량 (주)</Label>
                        <Input
                            id="quantity"
                            type="number"
                            placeholder="0"
                            min="0"
                            step="1"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                        />
                    </InputGroup>

                    <InputGroup>
                        <Label htmlFor="averagePrice">평균 매수가 (원)</Label>
                        <Input
                            id="averagePrice"
                            type="number"
                            placeholder="0"
                            min="0"
                            step="1"
                            value={averagePrice}
                            onChange={(e) => setAveragePrice(e.target.value)}
                        />
                    </InputGroup>

                    {error && <ErrorText>{error}</ErrorText>}

                    <ButtonGroup>
                        <Button
                            type="button"
                            $variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            취소
                        </Button>
                        <Button
                            type="submit"
                            $variant="primary"
                            $fullWidth
                            disabled={loading}
                        >
                            {loading ? '추가 중...' : '추가'}
                        </Button>
                    </ButtonGroup>
                </Form>
            </Modal>
        </Overlay>
    )
}
