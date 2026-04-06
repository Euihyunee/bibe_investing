import { Pool } from 'pg';

/**
 * 로컬 PostgreSQL 연결 풀 설정
 * DATABASE_URL 형식을 읽어와 연결을 관리합니다.
 */
if (!process.env.DATABASE_URL) {
  console.warn('작업 주의: DATABASE_URL 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인하세요.');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

/**
 * 쿼리 실행 헬퍼 함수
 * @param text - SQL 쿼리문
 * @param params - 쿼리 파라미터 (Array)
 */
export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  
  if (process.env.NODE_ENV === 'development') {
    console.log('실행된 쿼리:', { text, duration, rows: res.rowCount });
  }
  
  return res;
};

export default pool;
