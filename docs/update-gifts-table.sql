-- SQL para atualizar a tabela de presentes
-- Execute este script no seu banco Neon (Postgres)

-- Remover coluna image_url
ALTER TABLE gifts DROP COLUMN IF EXISTS image_url;

-- Adicionar coluna quantity_needed (quantidade necessária)
ALTER TABLE gifts ADD COLUMN IF NOT EXISTS quantity_needed INTEGER NOT NULL DEFAULT 1;

-- Adicionar coluna quantity_reserved (quantidade já reservada)
ALTER TABLE gifts ADD COLUMN IF NOT EXISTS quantity_reserved INTEGER NOT NULL DEFAULT 0;

-- Garantir que quantity_reserved não seja maior que quantity_needed
ALTER TABLE gifts DROP CONSTRAINT IF EXISTS check_quantity;
ALTER TABLE gifts ADD CONSTRAINT check_quantity CHECK (quantity_reserved <= quantity_needed AND quantity_reserved >= 0);

-- Índice para facilitar consultas
CREATE INDEX IF NOT EXISTS idx_gifts_status ON gifts (status);

-- Comentários
COMMENT ON COLUMN gifts.quantity_needed IS 'Quantidade necessária do presente';
COMMENT ON COLUMN gifts.quantity_reserved IS 'Quantidade já reservada pelos convidados';
