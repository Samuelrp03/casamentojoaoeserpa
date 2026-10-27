-- SQL para criar a tabela de presentes
-- Execute este script no seu banco Neon (Postgres)

CREATE TABLE IF NOT EXISTS gifts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  link TEXT,
  image_url TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'purchased')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para ordenação por data de criação
CREATE INDEX IF NOT EXISTS idx_gifts_created_at ON gifts (created_at ASC);

-- Trigger para atualizar automaticamente o updated_at
CREATE OR REPLACE FUNCTION update_gifts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_gifts_updated_at ON gifts;

CREATE TRIGGER trigger_gifts_updated_at
  BEFORE UPDATE ON gifts
  FOR EACH ROW
  EXECUTE FUNCTION update_gifts_updated_at();

-- Comentários
COMMENT ON TABLE gifts IS 'Lista de presentes do casamento João & Vitória';
COMMENT ON COLUMN gifts.name IS 'Nome do presente';
COMMENT ON COLUMN gifts.description IS 'Descrição do presente';
COMMENT ON COLUMN gifts.price IS 'Preço sugerido em Reais (R$');
COMMENT ON COLUMN gifts.link IS 'Link para compra do presente';
COMMENT ON COLUMN gifts.image_url IS 'URL da imagem do presente';
COMMENT ON COLUMN gifts.status IS 'Status: available, reserved ou purchased';
COMMENT ON COLUMN gifts.created_at IS 'Data de criação';
COMMENT ON COLUMN gifts.updated_at IS 'Data de atualização';
