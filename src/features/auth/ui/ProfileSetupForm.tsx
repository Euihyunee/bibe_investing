/**
 * 프로필 설정 폼 컴포넌트
 * 회원가입 후 투자 성향을 설정하는 페이지
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/shared/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/shared/ui/card'
import { updateUserProfile } from '@/entities/user/api/authApi'
import type { RiskProfile, InvestmentGoal, InvestmentPeriod } from '@/shared/types'

export function ProfileSetupForm() {
    const router = useRouter()
    const [riskProfile, setRiskProfile] = useState<RiskProfile>('moderate')
    const [investmentGoal, setInvestmentGoal] = useState<InvestmentGoal>('wealth_building')
    const [investmentPeriod, setInvestmentPeriod] = useState<InvestmentPeriod>('5years+')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            await updateUserProfile({
                risk_profile: riskProfile,
                investment_goal: investmentGoal,
                investment_period: investmentPeriod,
            })
            router.push('/dashboard')
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>투자 프로필 설정</CardTitle>
                <CardDescription>
                    맞춤형 포트폴리오 추천을 위해 몇 가지 질문에 답해주세요
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                    {/* 위험 감수 수준 */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium">
                            1. 투자 위험 감수 수준은 어떻게 되시나요?
                        </label>
                        <div className="grid gap-3">
                            <button
                                type="button"
                                onClick={() => setRiskProfile('conservative')}
                                className={`p-4 text-left border rounded-lg transition-colors ${riskProfile === 'conservative'
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-primary/50'
                                    }`}
                            >
                                <div className="font-medium">보수적</div>
                                <div className="text-sm text-muted-foreground">
                                    안정적인 수익을 선호하며, 원금 손실을 최소화하고 싶습니다
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setRiskProfile('moderate')}
                                className={`p-4 text-left border rounded-lg transition-colors ${riskProfile === 'moderate'
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-primary/50'
                                    }`}
                            >
                                <div className="font-medium">중립적</div>
                                <div className="text-sm text-muted-foreground">
                                    적절한 위험을 감수하며 균형잡힌 수익을 추구합니다
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setRiskProfile('aggressive')}
                                className={`p-4 text-left border rounded-lg transition-colors ${riskProfile === 'aggressive'
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-primary/50'
                                    }`}
                            >
                                <div className="font-medium">공격적</div>
                                <div className="text-sm text-muted-foreground">
                                    높은 수익을 위해 큰 변동성도 감수할 수 있습니다
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* 투자 목표 */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium">
                            2. 투자 목표는 무엇인가요?
                        </label>
                        <div className="grid gap-3">
                            <button
                                type="button"
                                onClick={() => setInvestmentGoal('retirement')}
                                className={`p-4 text-left border rounded-lg transition-colors ${investmentGoal === 'retirement'
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-primary/50'
                                    }`}
                            >
                                <div className="font-medium">은퇴 준비</div>
                                <div className="text-sm text-muted-foreground">
                                    장기적인 노후 자금 마련
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setInvestmentGoal('short_term')}
                                className={`p-4 text-left border rounded-lg transition-colors ${investmentGoal === 'short_term'
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-primary/50'
                                    }`}
                            >
                                <div className="font-medium">단기 수익</div>
                                <div className="text-sm text-muted-foreground">
                                    1-3년 내 목돈 마련
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setInvestmentGoal('wealth_building')}
                                className={`p-4 text-left border rounded-lg transition-colors ${investmentGoal === 'wealth_building'
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-primary/50'
                                    }`}
                            >
                                <div className="font-medium">자산 증식</div>
                                <div className="text-sm text-muted-foreground">
                                    꾸준한 자산 성장
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* 투자 기간 */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium">
                            3. 투자 예정 기간은 얼마나 되시나요?
                        </label>
                        <div className="grid gap-3">
                            <button
                                type="button"
                                onClick={() => setInvestmentPeriod('1year')}
                                className={`p-4 text-left border rounded-lg transition-colors ${investmentPeriod === '1year'
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-primary/50'
                                    }`}
                            >
                                <div className="font-medium">1년</div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setInvestmentPeriod('3years')}
                                className={`p-4 text-left border rounded-lg transition-colors ${investmentPeriod === '3years'
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-primary/50'
                                    }`}
                            >
                                <div className="font-medium">3년</div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setInvestmentPeriod('5years+')}
                                className={`p-4 text-left border rounded-lg transition-colors ${investmentPeriod === '5years+'
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-primary/50'
                                    }`}
                            >
                                <div className="font-medium">5년 이상</div>
                            </button>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" size="lg" disabled={loading}>
                        {loading ? '저장 중...' : '완료하고 시작하기'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
