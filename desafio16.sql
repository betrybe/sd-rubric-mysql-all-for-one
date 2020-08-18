-- Exiba a submitted_date das purchase_orders que estão entre 2006-01-26 00:00:00 e 2006-03-31 23:59:59.

select submitted_date from purchase_orders where submitted_date between '2006-01-26 00:00:00'  and '2006-03-31 23:59:59';
