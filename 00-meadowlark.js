const express = require('express');
const expressHandlebars = require('express-handlebars');
const weatherMiddleware = require('./lib/middleware/weather');
const flashMiddleware = require('./lib/middleware/flash');

const { credentials } = require('./config');

const cookieParser = require('cookie-parser');

const expressSession = require('express-session');

const bodyParser = require('body-parser');

const multiparty = require('multiparty');

const VALID_EMAIL_REGEX = new RegExp('^[a-zA-Z0-9.!#$%&\'*+\/=?^_`{|}~-]+@' + '[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?' + 
'(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$');

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

app.use(bodyParser.json());

app.use(cookieParser(credentials.cookieSecret));

//add session support
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: credentials.cookieSecret
}));



// configuring static content

app.use(express.static(`${__dirname}/public`));
//app.disable('x-powered-by');

// app.get('/', (req, res) => {
//     // res.type('text/plain');
//     // res.send('Meadowlark Travel');
//     res.render('home');
// });

app.use(weatherMiddleware);
//app.use(flashMiddleware);

app.post('/newsletter', function(req, res){
  const name = req.body.name || '', email = req.body.email || '';
  //input validation
  if(VALID_EMAIL_REGEX.test(email)){
    req.session.flash = {
      type: 'danger',
      intro: 'Validation error!',
      message: 'The Email address you entered was not valid.'
    }
    return res.redirect(303, '/newsletter');
  }
  new NewsLetterSignup({name, email}).save((err) => {
    if(err){
      req.session.flash = {
        type: 'danger',
        intro: 'Database error!',
        message: 'There was a database error; please try again later.'
      }
      return res.redirect(303, '/newsletter/archive');
    }
    req.session.flash = {
      type: 'success',
      intro: 'Thank you!',
      message: 'You have now been signed up for the newsletter.'
    };
    return res.redirect(303, '/newsletter/archive');
  })
})

app.post('/vacation-photo/:year?/:month?', (req, res) => {
  const form = new multiparty.Form();
  console.log("Reached");
  form.parse(req, (err, fields, files) => {
    if(err) return res.status(500).send({error: err.message});
    handlers.vacationPhotoContestProcess(req, res, fields, files);    
  });
});
app.get('/vacation-photo', (req, res) => {
  res.render('contest/vacation-photo');
})
app.get('/', handlers.home);

// app.get('/about', (req, res) => {
//     // res.type('text/plain');
//     // res.send('About Meadowlark Travel');
//     // const randomFortune = fortunes[Math.floor(Math.random()*fortunes.length)];
//     res.render('about', {fortune: fortune.getFortune()});
//     //res.render('about');
// });
app.get('/api/about', handlers.about);

app.get('/headers', handlers.headers);
app.get('/vacation-photo-thank-you', (req, res) => res.render('vacation-photo-thank-you'));

// custom 404 page
// app.use((req, res) => {
//     // res.type('text/plain');
//     // res.status(404);
//     // res.send('404 - Not Found')
//     res.status(404);
//     res.render('404');
// });

app.post('/vacation-photo-contest', (req,res) => {
  const form = new multiparty.Form()
  form.parse(req, (err, fields, files) => {
    //if(err) return handlers.api.vacationPhotoContestError(req, res, err.message)
    handlers.vacationPhotoContest(req, res, fields, files) 
  }) 
});
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
