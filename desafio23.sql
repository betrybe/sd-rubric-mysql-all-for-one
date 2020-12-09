-- Atualize os dados de discount da tabela order_details para 30 cuja unit_price seja menor que 10.0000.

UPDATE order_details SET discount=30 where unit_price < 10.0000;
