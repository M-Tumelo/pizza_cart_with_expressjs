let express = require('express');

let app = express();

let fav = require('serve-favicon');

var moment = require('moment'); 

const exphbs = require('express-handlebars');

const pizza_cart = require('./userCart');
const bodyParser = require('body-parser');

//import sqlite modules
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const shoppingCart = pizza_cart();
let path = require('path')

//Configure the express-handlebars module
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
const session = require('express-session');
const { compile } = require('handlebars');

//Set-up middleware
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 300000 } }))
app.use(fav(path.join(__dirname, 'public', 'img/favicon.ico')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'));

open({
  filename: './data.db',
  driver: sqlite3.Database
}).then(async function (db) {

  // run migrations

  await db.migrate();

  // only setup the routes once the database connection has been established
  app.get('/', (req, res) => {

    res.render('index');
  });

  app.get('/cart', async (req, res) => {
    const cart = shoppingCart.getCart(req.session.email);
	res.render('cart',{
    totals: cart.totals(),
    counter : cart.getCounter()
    });
  });

  //Add to order - buttons reference
  app.get('/order', async function (req, res) {
    const order_line = await db.all('select * from order_line where order_id = ?', req.session.id);
    const getTotal = await db.all('select * from orders where order_id = ?', req.session.id);
  res.render('orders',{
   order_line,
   getTotal
  });
  });

  // + and - buttons reference
  app.post('/factory/:id', async function (req, res) {
    const cart = shoppingCart.getCart(req.session.email);
    cart.recordAction(req.params.id);
    let grandTotal = cart.totals().grandTotal;
    switch (req.params.id) {

      case 'min_small_pizza': req.params.id = 'small'; price = cart.totals().smallPizza; counter = cart.getCounter().small; break;
      case 'small': price = cart.totals().smallPizza; counter = cart.getCounter().small; break;

      case 'medium': price = cart.totals().midPizza; counter = cart.getCounter().medium; break;
      case 'min_mid_pizza': req.params.id = 'medium'; price = cart.totals().midPizza; counter = cart.getCounter().medium; break;

      case 'min_large_pizza': req.params.id = 'large'; price = cart.totals().largePizza; counter = cart.getCounter().large; break;
      case 'large': price = cart.totals().largePizza; counter = cart.getCounter().large; break;
    }
    let orderId = req.session.id;
    let ord = await db.get('select order_id from orders where order_id = ?', orderId);
    if (ord != null) {

      let sql = `SELECT * FROM order_line WHERE order_id  = ?`

      let stmt = await db.all(sql, [orderId]);
      let update_pizza = [];
      console.log(stmt)
      for (var i = 0; i < stmt.length; i++) {
        if (stmt[i].pizza_size == req.params.id) {
          update_pizza = stmt[i];
          break;
        }
        else update_pizza = null;
      }
      if (update_pizza !== null) {
        let update_table = `UPDATE order_line
                                      SET total_price = ?,
                                      quantity = ?                                      
                                     WHERE id = ?`;
        await db.run(update_table, price, counter, update_pizza.id);
      }
      else {
        await db.run('insert into order_line (total_price, pizza_size, quantity, order_id, date) values (?, ?, ?, ?, ?)', price, req.params.id, counter, orderId,moment(new Date()).format('DD-MM-YY'));
      }
    }
    else {
      await db.run('insert into orders (order_id, total) values (?, ?)', orderId, grandTotal);
      await db.run('insert into order_line (total_price, pizza_size, quantity, order_id, date) values (?, ?, ?, ?, ?)', price, req.params.id, counter, orderId,moment(new Date()).format('DD-MM-YY'));
    }
    await db.run('update orders set total = ? where order_id =?', grandTotal, orderId);
    res.redirect('/cart')
  });

  app.get('/login', (req, res) => {
    res.render('login')
  });

  app.get('/register', (req, res) => {
    res.render('register')
  });

  app.post('/login', async (req, res) => {
    req.session.email = req.body.email;
    req.session.psw = req.body.psw;
    let sql = await db.get('Select Email email, Password psw from register where Email = ?', req.session.email);
    console.log(sql)
    if (sql == null) {
      console.log('Incorrect Email or password');
      res.redirect('/cart');
    }
    if (sql.psw !== req.session.psw) {
      console.log('Incorrect Email or password')
      res.redirect('/login')
    }
    else {
      res.redirect('/cart')
    }

  });
  app.post('/register', async (req, res) => {
    const { name, email, psw, psw1 } = req.body;

    req.session.name = name;
    req.session.email = email;
    req.session.psw = psw;
    req.session.psw1 = psw1;
    let sql = await db.get('Select Email email, Password psw from register where Email = ?', req.session.email);
    if (sql == null) {
      if (req.session.psw == psw1) {
        const insert_details = 'insert into register (name, email, password) values (?, ?, ?)';
        await db.run(insert_details, req.session.name, req.session.email, req.session.psw);
        res.redirect('/login');
      }
      else {
        res.redirect('/register')
      }
    }
    else {
      res.redirect('/')
    }
  });
});


let PORT = process.env.PORT || 3001;

app.listen(PORT, function () {
  console.log('App starting on port', PORT);
});
