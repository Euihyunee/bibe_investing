-- 로컬 PostgreSQL 전용 스키마 (Supabase 종속성 제거)
-- UUID 확장 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 사용자 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  risk_profile VARCHAR(20) CHECK (risk_profile IN ('conservative', 'moderate', 'aggressive')),
  investment_goal VARCHAR(50) CHECK (investment_goal IN ('retirement', 'short_term', 'wealth_building')),
  investment_period VARCHAR(20) CHECK (investment_period IN ('1year', '3years', '5years+')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================
-- 포트폴리오 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_value DECIMAL(15, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON portfolios(user_id);

-- ============================================
-- 보유 종목 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS holdings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  symbol VARCHAR(20) NOT NULL,
  name VARCHAR(100),
  market VARCHAR(10) CHECK (market IN ('US', 'KR', 'BRICS')),
  quantity DECIMAL(15, 4) NOT NULL,
  average_price DECIMAL(15, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_holdings_portfolio_id ON holdings(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_holdings_symbol ON holdings(symbol);

-- ============================================
-- 뉴스 기사 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS news_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  summary TEXT,
  source VARCHAR(100),
  url TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  sentiment VARCHAR(20) CHECK (sentiment IN ('positive', 'negative', 'neutral')),
  impact_score INTEGER CHECK (impact_score >= 0 AND impact_score <= 100),
  related_stocks TEXT[],
  related_sectors TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_news_published_at ON news_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_sentiment ON news_articles(sentiment);
CREATE INDEX IF NOT EXISTS idx_news_impact_score ON news_articles(impact_score DESC);

-- ============================================
-- AI 추천 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) CHECK (type IN ('buy', 'sell', 'rebalance')),
  symbol VARCHAR(20),
  reason TEXT,
  confidence INTEGER CHECK (confidence >= 0 AND confidence <= 100),
  expected_return DECIMAL(5, 2),
  risk_level VARCHAR(20) CHECK (risk_level IN ('low', 'medium', 'high')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_recommendations_user_id ON recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_created_at ON recommendations(created_at DESC);

-- ============================================
-- 트리거: updated_at 자동 업데이트
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- users 테이블 트리거
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- portfolios 테이블 트리거
DROP TRIGGER IF EXISTS update_portfolios_updated_at ON portfolios;
CREATE TRIGGER update_portfolios_updated_at
  BEFORE UPDATE ON portfolios
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- holdings 테이블 트리거
DROP TRIGGER IF EXISTS update_holdings_updated_at ON holdings;
CREATE TRIGGER update_holdings_updated_at
  BEFORE UPDATE ON holdings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 주가 캐시 테이블
-- ============================================
CREATE TABLE IF NOT EXISTS stock_prices_cache (
  symbol VARCHAR(20) PRIMARY KEY,
  price DECIMAL(15, 2) NOT NULL,
  market_state VARCHAR(20),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stock_prices_symbol ON stock_prices_cache(symbol);

-- stock_prices_cache 테이블 트리거
DROP TRIGGER IF EXISTS update_stock_prices_updated_at ON stock_prices_cache;
CREATE TRIGGER update_stock_prices_updated_at
  BEFORE UPDATE ON stock_prices_cache
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
