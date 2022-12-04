const fortune = require('./fortune');

exports.home = (req, res) => 
{
    res.cookie('monster', 'nom nom');
    res.cookie('signed_monster', 'nom nom', {signed: true});
    res.clearCookie('monster');
    res.render('home');
}
exports.about = (req, res) => 
{
    console.log(req.cookies.monster);
    console.log(req.signedCookies.signed_monster);
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
