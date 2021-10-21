-- DDL
create table order_line (
	id integer primary key AUTOINCREMENT,
	total_price text DEFAULT '0.00',
    pizza_size text,
	quantity integer default 0,
	order_id INTEGER not null, 
	date text 
);
