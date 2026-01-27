-- Seed mais completo para testes locais (10 vendedoras, 50 produtos, 15 maletas).
-- Execute após o schema estar criado.

INSERT INTO sellers (name, cpf, phone, region, address, gps_point, created_at)
SELECT
  'Vendedora ' || gs,
  '99999999' || lpad(gs::text, 2, '0'),
  '(11) 9' || lpad((9000 + gs)::text, 4, '0') || '-0000',
  CASE (gs % 5)
    WHEN 0 THEN 'Centro'
    WHEN 1 THEN 'Zona Norte'
    WHEN 2 THEN 'Zona Sul'
    WHEN 3 THEN 'Zona Leste'
    ELSE 'Zona Oeste'
  END,
  'Rua Teste, ' || (100 + gs),
  '-23.' || lpad((500 + gs)::text, 3, '0') || ', -46.' || lpad((600 + gs)::text, 3, '0'),
  NOW()
FROM generate_series(1, 10) gs;

INSERT INTO products (name, category, material, barcode, price, stock_qty)
SELECT
  CASE (gs % 5)
    WHEN 0 THEN 'Anéis'
    WHEN 1 THEN 'Colares'
    WHEN 2 THEN 'Pulseiras'
    WHEN 3 THEN 'Brincos'
    ELSE 'Pingentes'
  END || ' ' || gs,
  CASE (gs % 5)
    WHEN 0 THEN 'Anéis'
    WHEN 1 THEN 'Colares'
    WHEN 2 THEN 'Pulseiras'
    WHEN 3 THEN 'Brincos'
    ELSE 'Pingentes'
  END,
  CASE (gs % 3)
    WHEN 0 THEN 'Ouro'
    WHEN 1 THEN 'Prata'
    ELSE 'Banhado'
  END,
  '78900' || lpad(gs::text, 3, '0'),
  120 + (gs * 7.5),
  20 - (gs % 5)
FROM generate_series(1, 50) gs;

INSERT INTO bags (code, status, due_date, seller_id)
SELECT
  'MA-' || lpad(gs::text, 3, '0'),
  CASE
    WHEN gs IN (1, 2, 4, 10, 15) THEN 'Em campo'
    WHEN gs IN (3, 5, 8, 12) THEN 'Aguardando'
    ELSE 'Disponível'
  END,
  CASE
    WHEN gs IN (1, 2, 4, 10, 15, 3, 5, 8, 12) THEN NOW() + (gs || ' days')::interval
    ELSE NULL
  END,
  CASE
    WHEN gs IN (1, 2, 4, 10, 15) THEN ((gs - 1) % 10) + 1
    ELSE NULL
  END
FROM generate_series(1, 15) gs;

INSERT INTO bag_items (bag_id, product_id, quantity_sent, quantity_returned)
SELECT
  b.id,
  ((b.id - 1) * 2) + 1,
  4 + (b.id % 3),
  1
FROM bags b
WHERE b.id <= 6;

INSERT INTO bag_items (bag_id, product_id, quantity_sent, quantity_returned)
SELECT
  b.id,
  ((b.id - 1) * 2) + 2,
  6 + (b.id % 4),
  2
FROM bags b
WHERE b.id <= 6;

INSERT INTO closing_reports (bag_id, sold_count, summary, created_at)
SELECT
  b.id,
  4 + (b.id % 4),
  CASE
    WHEN b.id % 2 = 0 THEN 'Boa saída em colares e pingentes.'
    ELSE 'Vendas concentradas em anéis banhados.'
  END,
  NOW()
FROM bags b
WHERE b.id IN (1, 2, 4, 10);
