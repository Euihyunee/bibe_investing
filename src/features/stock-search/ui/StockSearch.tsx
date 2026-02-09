'use client'

import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { searchStocks } from '@/entities/stock/api/stockApi'
import { Stock } from '@/shared/types'

const Container = styled.div`
    position: relative;
    width: 100%;
`

const SearchInput = styled.input`
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;

    &:focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
`

const Dropdown = styled.ul`
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    max-height: 240px;
    overflow-y: auto;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    z-index: 50;
    margin: 0;
    padding: 4px;
    list-style: none;
`

const DropdownItem = styled.li`
    padding: 10px 12px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background 0.2s;

    &:hover {
        background: #f3f4f6;
    }
`

const StockName = styled.span`
    font-size: 14px;
    font-weight: 500;
    color: #111827;
`

const StockSymbol = styled.span`
    font-size: 12px;
    color: #6b7280;
    background: #f3f4f6;
    padding: 2px 6px;
    border-radius: 4px;
`

const Message = styled.div`
    padding: 12px;
    font-size: 13px;
    color: #9ca3af;
    text-align: center;
`

interface StockSearchProps {
    onSelect: (stock: Stock) => void
    placeholder?: string
}

export const StockSearch = ({ onSelect, placeholder = '주식 이름 또는 심볼 입력 (예: Apple, 삼성전자)' }: StockSearchProps) => {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<Stock[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length >= 2) {
                setIsLoading(true)
                try {
                    const data = await searchStocks(query)
                    setResults(data)
                    setIsOpen(true)
                } catch (error) {
                    console.error('Stock search failed:', error)
                } finally {
                    setIsLoading(false)
                }
            } else {
                setResults([])
                setIsOpen(false)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [query])

    const handleSelect = (stock: Stock) => {
        setQuery(stock.name)
        setIsOpen(false)
        onSelect(stock)
    }

    return (
        <Container ref={dropdownRef}>
            <SearchInput
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                onFocus={() => query.length >= 2 && setIsOpen(true)}
            />
            {isOpen && (
                <Dropdown>
                    {isLoading ? (
                        <Message>검색 중...</Message>
                    ) : results.length > 0 ? (
                        results.map((stock) => (
                            <DropdownItem key={stock.symbol} onClick={() => handleSelect(stock)}>
                                <StockName>{stock.name}</StockName>
                                <StockSymbol>{stock.symbol}</StockSymbol>
                            </DropdownItem>
                        ))
                    ) : (
                        <Message>검색 결과가 없습니다.</Message>
                    )}
                </Dropdown>
            )}
        </Container>
    )
}
