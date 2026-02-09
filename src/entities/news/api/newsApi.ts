/**
 * 실시간 뉴스 조회를 위한 API (국가별 지원)
 */
export async function getLatestNews(region: string = 'US') {
    try {
        const response = await fetch(`/api/stock/news?region=${encodeURIComponent(region)}`)
        if (!response.ok) throw new Error('뉴스 로드 실패')
        return await response.json()
    } catch (error) {
        console.error('getLatestNews Error:', error)
        return []
    }
}
