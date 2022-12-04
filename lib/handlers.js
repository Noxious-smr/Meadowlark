const fortune = require('./fortune');
var colorScheme = "";
exports.home = (req, res) => 
{
    res.cookie('monster', 'nom nom', {secure: true});
    res.cookie('signed_monster', 'nom nom', {signed: true});
    req.session.userName = 'Anonymous';
    colorScheme = req.session.colorScheme || 'dark';   
    console.log(process.env.MyName); 
    //res.clearCookie('monster');
    req.session.flash = { flash: {
        type: "SessionFlash",
        intro: "dev",
        message: "I am session flash"
    }};
    // console.log(res.locals.flash.message);
    res.render('home');
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
exports.notFound = (req, res) => res.render('404');

/* eslint-disable no-unused-vars */
exports.serverError = (err, req, res, next) => res.render('500');
/* eslint-enable no-unused-vars */
