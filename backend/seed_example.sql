-- Exemplo de carga manual para testar o banco de dados.
-- Execute após o schema estar criado.

INSERT INTO sellers (name, cpf, phone, region, address, gps_point, created_at)
VALUES
  ('Vendedora Exemplo', '99999999999', '(11) 90000-0000', 'Centro', 'Rua Teste, 123', '-23.000, -46.000', NOW());

INSERT INTO products (name, category, material, barcode, price, stock_qty)
VALUES
  ('Anel Premium', 'Anéis', 'Ouro', '7890012345678', 199.90, 15);

INSERT INTO bags (code, status, due_date, seller_id)
VALUES
  ('MA-999', 'Em campo', NOW() + INTERVAL '7 day', 1);

INSERT INTO bag_items (bag_id, product_id, quantity_sent, quantity_returned)
VALUES
  (1, 1, 5, 1);

INSERT INTO closing_reports (bag_id, sold_count, summary, created_at)
VALUES
  (1, 4, 'Exemplo: maior saída em anéis de ouro.', NOW());
