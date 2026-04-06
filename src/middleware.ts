import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('access_token')?.value
    const { pathname } = request.nextUrl

    // 인증이 필요한 경로들 (예: 대시보드, 포트폴리오 등)
    const isProtectedRoute = pathname === '/' || pathname.startsWith('/portfolio')
    
    // 인증과 상관없이 접근 가능한 경로 (로그인, 회원가입)
    const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/signup')

    // 토큰이 없는데 보호된 경로에 접근하면 로그인 페이지로 리다이렉트
    if (isProtectedRoute && !token) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        // 로그인 후 다시 돌아올 수 있도록 검색 파라미터 유지 가능 (선택 사항)
        return NextResponse.redirect(url)
    }

    // 토큰이 있는데 로그인/회원가입 페이지에 접근하면 메인으로 리다이렉트
    if (isAuthRoute && token) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * 모든 경로를 매칭하되 다음은 제외:
         * - _next/static (정적 파일)
         * - _next/image (이미지 최적화)
         * - favicon.ico (아이콘)
         * - 공용 이미지 파일들
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
