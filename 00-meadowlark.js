const express = require('express');
const expressHandlebars = require('express-handlebars');
const weatherMiddleware = require('./lib/middleware/weather')

const { credentials } = require('./config');

const cookieParser = require('cookie-parser');


const app = express();

const port = process.env.port || 3000;

// const fortunes =["Conquer your fears or they will conquer you.",
//                 "Rivers need springs.",
//                 "Do not fear what you don't know.",
//                 "You will have a pleasant surprise.",
//                 "Whenever possible, keep it simple."
//                 ];
// const fortune = require('./lib/fortune');
const handlers = require('./lib/handlers');

// configure handlebars view engine
app.engine('handlebars', expressHandlebars.engine({
  defaultLayout: 'main',
}));

app.set('view engine', 'handlebars');

app.use(cookieParser(credentials.cookieSecret));

// configuring static content

app.use(express.static(`${__dirname}/public`));
//app.disable('x-powered-by');

// app.get('/', (req, res) => {
//     // res.type('text/plain');
//     // res.send('Meadowlark Travel');
//     res.render('home');
// });

app.use(weatherMiddleware);

app.get('/', handlers.home);

// app.get('/about', (req, res) => {
//     // res.type('text/plain');
//     // res.send('About Meadowlark Travel');
//     // const randomFortune = fortunes[Math.floor(Math.random()*fortunes.length)];
//     res.render('about', {fortune: fortune.getFortune()});
//     //res.render('about');
// });
app.get('/about', handlers.about);

app.get('/headers', handlers.headers);

// custom 404 page
// app.use((req, res) => {
//     // res.type('text/plain');
//     // res.status(404);
//     // res.send('404 - Not Found')
//     res.status(404);
//     res.render('404');
// });
app.use(handlers.notFound);


// custom 500 page
// app.use((err, req, res, next) => {
//     console.error(err.message);
//     // res.type('text/plain');
//     // res.status(500);
//     // res.send('500 - Server Error');

//     res.status(500);
//     res.render('500');
// });

app.use(handlers.serverError);

// app.listen(port, () => console.log(
//     `Server is listening on port: ${process.env.PORT}\nExpress started on http://localhost:${port}; \npress Ctrl-C to terminate.`
// ));

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is listening on port: ${process.env.PORT}\nExpress started on http://localhost:${port}; \npress Ctrl-C to terminate.`);
  });
} else {
  module.exports = app;
}
