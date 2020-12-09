-- Mostre as submitted_date de purchase_orders em que a submitted_date é do dia 26 de abril de 2006.

select submitted_date from purchase_orders where DATE(submitted_date)='2006-04-26';
