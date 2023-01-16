const fortune = require('./fortune');
var colorScheme = "";
exports.home = (req, res) => 
{
    res.cookie('monster', 'nom nom', {secure: true});
    res.cookie('signed_monster', 'nom nom', {signed: true});
    req.session.userName = 'Anonymous';
    req.session.flash = {
        type: 'success',
        intro: 'Thank you!',
        message: '<h3>You have now been signed up for the newsletter FOR NOW.</h3>'
      };
    colorScheme = req.session.colorScheme || 'dark';   
    console.log(process.env.MyName); 
    console.log(req.session.flash.message);
    //console.log(flash.message);
    //res.clearCookie('monster');
    console.log(res.locals);
    res.render('home');
    // res.redirect(303, 'about');
    // res.render('home', {cart: "cart"}, (err, html) => {
    //     console.log(html);
    // });
}
exports.about = (req, res) => 
{
    console.log(req.cookies.monster);
    console.log(req.signedCookies.signed_monster);
    console.log(req.session.userName);
    console.log(colorScheme);
    res.render('about', { fortune: fortune.getFortune() });
}
exports.headers = (req, res) => {
    // res.type('application/json');
    res.type('text/plain');
    //const headers = Object.entries(req.headers).map(([key, value]) => `${key}: ${value}`);
    // const jsonObject = headers.join('\n');
    // res.send(JSON.stringify(req.headers));
    res.send(req.query);
}

exports.vacationPhotoContestProcess = (req, res, fields, files) => {
    console.log('field data: ', fields);
    console.log('files: ', files);
    res.redirect(303, 'vacation-photo-thank-you');
}

// exports.api = (req, res) => {

//     res.send(req.body());
// }

exports.vacationPhotoContest = (req, res, fields, files) => {
    console.log('field data: ', fields)
    console.log('files: ', files)
    console.log('from Fetch')
    res.send({ result: 'success' })
}

exports.notFound = (req, res) => res.render('404');

/* eslint-disable no-unused-vars */
exports.serverError = (err, req, res, next) => res.render('500');
/* eslint-enable no-unused-vars */
