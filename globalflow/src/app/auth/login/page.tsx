/**
 * 로그인 페이지 (간소화 버전)
 */

'use client'

import { useState } from 'react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Login:', email, password)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        GlobalFlow
                    </h1>
                    <p className="text-gray-900 mt-2">
                        글로벌 주식 투자 플랫폼
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-gray-900 text-2xl font-medium mb-2">로그인</h2>
                    <p className="text-gray-900 text-sm mb-6">
                        GlobalFlow 계정으로 로그인하세요
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1">
                                이메일
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-1">
                                비밀번호
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
                        >
                            로그인
                        </button>
                    </form>

                    <div className="mt-4 text-center text-sm text-black">
                        계정이 없으신가요?{' '}
                        <a href="/auth/signup" className="text-blue-600 hover:underline">
                            회원가입
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
