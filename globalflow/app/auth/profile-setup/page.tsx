/**
 * 프로필 설정 페이지
 */

import { ProfileSetupForm } from '@/features/auth/ui/ProfileSetupForm'

export default function ProfileSetupPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
            <div className="w-full max-w-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold">거의 다 왔습니다!</h1>
                    <p className="text-muted-foreground mt-2">
                        맞춤형 투자 전략을 위해 프로필을 설정해주세요
                    </p>
                </div>
                <ProfileSetupForm />
            </div>
        </div>
    )
}
