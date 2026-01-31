-- AI Analysis History Table
CREATE TABLE ai_analysis_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  analysis_text TEXT NOT NULL,
  financial_snapshot JSONB NOT NULL, -- Store totals, breakdowns, metrics
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for performance
CREATE INDEX idx_ai_analysis_history_business_id ON ai_analysis_history(business_id);
CREATE INDEX idx_ai_analysis_history_created_at ON ai_analysis_history(created_at DESC);
CREATE INDEX idx_ai_analysis_history_business_date ON ai_analysis_history(business_id, created_at DESC);

-- Row Level Security
ALTER TABLE ai_analysis_history ENABLE ROW LEVEL SECURITY;

-- Users can only see AI analysis for their business
CREATE POLICY "Users can view own ai analysis" ON ai_analysis_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = ai_analysis_history.business_id
      AND businesses.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own ai analysis" ON ai_analysis_history
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = ai_analysis_history.business_id
      AND businesses.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own ai analysis" ON ai_analysis_history
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = ai_analysis_history.business_id
      AND businesses.user_id = auth.uid()
    )
  );
