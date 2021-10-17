-- DDL
create table register(
	id integer primary key AUTOINCREMENT,
    name  text not null,
	Email text not null,
    Password text not null
);