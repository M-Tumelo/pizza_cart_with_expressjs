create table delivery(
   id integer primary key AUTOINCREMENT,
   order_id integer not null,
   WhenAssigned date not null,
   DeliveredBy text not null,
   WhenDelivered date
); 