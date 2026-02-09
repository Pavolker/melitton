CREATE TABLE IF NOT EXISTS boxes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  box_type TEXT NOT NULL,
  install_date TIMESTAMP WITH TIME ZONE NOT NULL,
  origin TEXT NOT NULL,
  location JSONB, 
  status TEXT NOT NULL,
  photo TEXT,
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS management_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  box_id UUID REFERENCES boxes(id) ON DELETE CASCADE,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  type TEXT NOT NULL,
  notes TEXT,
  quantity TEXT,
  photo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS baits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  attractant TEXT NOT NULL,
  location JSONB,
  install_date TIMESTAMP WITH TIME ZONE NOT NULL,
  target_species TEXT NOT NULL,
  status JSONB NOT NULL, 
  next_inspection_date TIMESTAMP WITH TIME ZONE,
  photo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
