-- SQL final para atualizar a tabela de presentes
-- Execute este script no seu banco Neon (Postgres)
-- Remove image_url e status, adiciona quantidade

-- Remover coluna image_url se existir
ALTER TABLE gifts DROP COLUMN IF EXISTS image_url;

-- Remover coluna status se existir
ALTER TABLE gifts DROP COLUMN IF EXISTS status;

-- Adicionar colunas de quantidade
ALTER TABLE gifts ADD COLUMN IF NOT EXISTS quantity_needed INTEGER NOT NULL DEFAULT 1;
ALTER TABLE gifts ADD COLUMN IF NOT EXISTS quantity_reserved INTEGER NOT NULL DEFAULT 0;

-- Garantir valores válidos
ALTER TABLE gifts DROP CONSTRAINT IF EXISTS check_quantity_reserved;
ALTER TABLE gifts ADD CONSTRAINT check_quantity_reserved CHECK (quantity_reserved >= 0 AND quantity_reserved <= quantity_needed);

-- Remover trigger antigo se não for mais necessário (opcional)
-- O updated_at ainda pode ser mantido

-- Comentários
COMMENT ON COLUMN gifts.quantity_needed IS 'Quantidade total necessária do presente';
COMMENT ON COLUMN gifts.quantity_reserved IS 'Quantidade já reservada pelos convidados';
