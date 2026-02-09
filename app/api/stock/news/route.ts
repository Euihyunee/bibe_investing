import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * 전역 뉴스 캐싱 및 국내 RSS 연동 엔진 (Market Insights)
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const region = searchParams.get('region') || 'US'

    // 서버 사이드 직접 클라이언트 생성 (auth-helpers 의존성 문제 회피)
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    try {
        // 1. DB 캐시 확인 (10분 이내 데이터가 있는지)
        const { data: cachedNews, error: cacheError } = await (supabase
            .from('news_articles')
            .select('*') as any)
            .eq('region', region)
            .gt('created_at', new Date(Date.now() - 10 * 60 * 1000).toISOString())
            .order('published_at', { ascending: false })
            .limit(15)

        if (!cacheError && cachedNews && (cachedNews as any[]).length > 5) {
            console.log(`[Cache Hit] Serving ${region} news from DB`)
            return NextResponse.json((cachedNews as any[]).map((item: any) => ({
                id: item.id,
                title: item.title,
                summary: item.summary,
                source: item.source,
                time: formatTime(Math.floor(new Date(item.published_at!).getTime() / 1000)),
                link: item.url,
                region: item.region
            })))
        }

        console.log(`[Cache Miss] Fetching fresh news for ${region}`)

        // 2. 외부 데이터 수집 (Region별 분기)
        let freshNews = []

        if (region === 'KR') {
            // [국내 특화] 한국경제 + 매일경제 + 야후 K-증시 믹싱
            const [hkArticles, mkArticles, yahooKr] = await Promise.all([
                fetchHKRSS(),
                fetchMKRSS(),
                fetchYahooNews(['South Korea KOSPI', 'Samsung Electronics'])
            ])

            // 국내 언론사 위주로 믹싱 (최대 12개)
            freshNews = [...mkArticles.slice(0, 5), ...hkArticles.slice(0, 5), ...yahooKr.slice(0, 2)]
        } else if (region === 'Global') {
            // [글로벌] 야후 글로벌 + 국내 주요 뉴스 믹싱
            const [globalArticles, krFocus] = await Promise.all([
                fetchYahooNews(REGION_QUERIES['Global']),
                fetchHKRSS() // 글로벌 탭에도 한국 소식 믹싱
            ])
            freshNews = [...globalArticles.slice(0, 10), ...krFocus.slice(0, 2)]
        } else {
            // [미국/중국/일본] 야후 파이낸스 국가별 수집
            const keywords = REGION_QUERIES[region] || REGION_QUERIES['US']
            freshNews = await fetchYahooNews(keywords)
        }

        // 3. 데이터 정제 및 DB 저장 (Upsert)
        const processedNews = freshNews.map(item => ({
            title: translateToKorean(item.title),
            summary: translateToKorean(item.summary || '상세 내용 없음'),
            source: item.source || 'Market Watch',
            url: item.link,
            published_at: item.published_at || new Date().toISOString(),
            region: region // 수집된 지역 정보 태깅
        }))

        // 비동기로 DB 저장
        supabase.from('news_articles').upsert(
            processedNews.map(n => ({ ...n })),
            { onConflict: 'url' }
        ).then(({ error }: any) => {
            if (error) console.error('News Cache Upsert Failed:', error)
        })

        return NextResponse.json(processedNews.map((item, idx) => ({
            id: `new-${idx}-${Date.now()}`, // 고유 ID 보장
            title: item.title,
            summary: item.summary,
            source: item.source,
            time: formatTime(Math.floor(new Date(item.published_at).getTime() / 1000)),
            link: item.url,
            region: region
        })))

    } catch (error: any) {
        console.error('Stock News Proxy Error:', error)
        return NextResponse.json([{
            id: 'fallback-1',
            title: '뉴스를 동기화하는 중 오류가 발생했습니다.',
            summary: '잠시 후 다시 시도해주세요.',
            source: 'System',
            time: '방금 전',
            link: '#'
        }])
    }
}

/**
 * 한국경제 RSS 수집 (정규표현식 파서)
 */
async function fetchHKRSS() {
    try {
        const response = await fetch('https://www.hankyung.com/rss/all', { cache: 'no-store' })
        const xml = await response.text()
        const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || []
        return items.map(item => {
            const title = item.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)?.[1] ||
                item.match(/<title>([\s\S]*?)<\/title>/)?.[1] || ''
            const link = item.match(/<link>([\s\S]*?)<\/link>/)?.[1] || ''
            const description = item.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1] ||
                item.match(/<description>([\s\S]*?)<\/description>/)?.[1] || ''
            const pubDate = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || new Date().toString()

            return {
                title: title.trim(),
                summary: description.trim().substring(0, 150).replace(/<[^>]*>/g, '') + '...',
                source: '한국경제',
                link: link.trim(),
                published_at: new Date(pubDate).toISOString()
            }
        })
    } catch (e) {
        console.error('HK RSS Fetch Error:', e)
        return []
    }
}

/**
 * 매일경제 RSS 수집 (정규표현식 파서)
 */
async function fetchMKRSS() {
    try {
        const response = await fetch('https://www.mk.co.kr/rss/30100041/', { cache: 'no-store' })
        const xml = await response.text()
        const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || []
        return items.map(item => {
            const title = item.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)?.[1] ||
                item.match(/<title>([\s\S]*?)<\/title>/)?.[1] || ''
            const link = item.match(/<link>([\s\S]*?)<\/link>/)?.[1] || ''
            const description = item.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1] ||
                item.match(/<description>([\s\S]*?)<\/description>/)?.[1] || ''
            const pubDate = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || new Date().toString()

            return {
                title: title.trim(),
                summary: description.trim().substring(0, 150).replace(/<[^>]*>/g, '') + '...',
                source: '매일경제',
                link: link.trim(),
                published_at: new Date(pubDate).toISOString()
            }
        })
    } catch (e) {
        console.error('MK RSS Fetch Error:', e)
        return []
    }
}

/**
 * 야후 파이낸스 뉴스 수집 헬퍼
 */
async function fetchYahooNews(keywords: string[]) {
    const fetchPromises = keywords.map(keyword =>
        fetch(
            `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(keyword)}&newsCount=8`,
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'application/json',
                    'Referer': 'https://finance.yahoo.com/'
                },
                cache: 'no-store'
            }
        ).then(res => res.ok ? res.json() : { news: [] })
    )

    const results = await Promise.all(fetchPromises)
    const allNewsRaw = results.flatMap(r => r.news || [])
    const uniqueNewsMap = new Map()

    allNewsRaw.forEach((item: any) => {
        if (!uniqueNewsMap.has(item.uuid)) {
            uniqueNewsMap.set(item.uuid, item)
        }
    })

    return Array.from(uniqueNewsMap.values())
        .map(item => {
            const timestamp = item.provider_publish_time;
            const date = timestamp ? new Date(timestamp * 1000) : new Date();
            const validDate = isNaN(date.getTime()) ? new Date() : date;

            return {
                title: item.title,
                summary: item.summary,
                source: item.publisher,
                link: item.link,
                published_at: validDate.toISOString()
            };
        })
}

const REGION_QUERIES: Record<string, string[]> = {
    'KR': ['South Korea KOSPI', 'Korea Economy Policy'],
    'US': ['Wall Street', 'Federal Reserve', 'Nasdaq'],
    'CN': ['China Economy', 'Hang Seng Index'],
    'JP': ['Nikkei 225', 'Bank of Japan'],
    'Global': ['Global Market', 'World Economy']
}

const TRANSLATION_DICT: Record<string, string> = {
    'Fed': '연준', 'Federal Reserve': '연방준비제도', 'Inflation': '인플레이션', 'Rate': '금리',
    'Stocks': '주식', 'Market': '시장', 'Economy': '경제', 'Recession': '경기침체',
    'Bullish': '상승 전망', 'Bearish': '하락 전망', 'Nvidia': '엔비디아', 'Tesla': '테슬라',
    'Apple': '애플', 'Microsoft': '마이크로소프트', 'US': '미국', 'China': '중국', 'Japan': '일본'
}

function translateToKorean(text: string): string {
    if (!text) return ''
    let translated = text
    Object.entries(TRANSLATION_DICT).forEach(([eng, kor]) => {
        const regex = new RegExp(`\\b${eng}\\b`, 'gi')
        translated = translated.replace(regex, kor)
    })
    return translated
}

function formatTime(timestamp: number) {
    if (!timestamp) return '방금 전'
    const date = new Date(timestamp * 1000)
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60)
    if (diff < 1) return '방금 전'
    if (diff < 60) return `${diff}분 전`
    if (diff < 1440) return `${Math.floor(diff / 60)}시간 전`
    return `${Math.floor(diff / 1440)}일 전`
}
