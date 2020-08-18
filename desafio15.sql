-- Mostre somente as horas (sem os minutos e os segundos) da submitted_date de todos registros de purchase_orders. Chame essa coluna de submitted_hour.

select HOUR(submitted_date) as submitted_hour FROM purchase_orders;