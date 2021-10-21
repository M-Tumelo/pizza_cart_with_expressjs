-- DDL
create table orders (
	order_id INTEGER not null,
	total text,
	status text,
	name text,
	user_id integer
);