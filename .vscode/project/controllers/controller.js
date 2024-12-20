const path = require('path');                             // install path
const options = {root: path.join(__dirname, '../public')};// set options root
const db = require(path.join(__dirname, '../databases/postgres.js'))
var theuser;

// password hashing stuff
var MD5 = require("crypto-js/md5");
const salt = "Let_us_pick_up_our_books_and_our_pens,_they_are_the_most_powerful_weapons_Malala_Yousafzai";

// passport authentication stuff
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

async function users_list() {
    const res = await db.query('SELECT id, username, password, tags0, tags1, tags2, tags3, tags4, hasread, hasliked, hasdisliked, wishlist FROM users');
    return res.rows
}

const partialbeginloggedin = `
<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]>      <html class="no-js"> <!--<![endif]-->

<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Our Beloved Books</title>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📚</text></svg>">
        <meta name="keywords" content="books, reviews, book reviews, community, discussion group, teenagers, books for teens">
        <meta name="description" content="Our Beloved Books is fostered to teenagers who love books. Here, we provide book reviews and analysis, as well as a community group for the curious to ask book-related questions!">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="style.css">
        <link rel="stylesheet" href="/style.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"/>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-eOJMYsd53ii+scO/bJGFsiCZc+5NDVN2yr8+0RDqr0Ql0h+rP48ckxlpbzKgwra6" crossorigin="anonymous">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
        <script src="https://code.jquery.com/jquery-3.6.0.min.js" defer></script>
        <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js" defer></script>
        <script>
            $(document).ready(function() {
                $("tbody").sortable({connectWith:"tbody"});
            });
        </script>
    </head>
    <body style="background-color: rgb(214, 231, 255); margin: 0 !important; ">
        <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js"></script>
        <div class="navbar navbar-expand-lg" id="header" style="max-width:100vw;">
            <div class="container-fluid row">
                <div class="navbar-brand col-6">
                    <h3 onclick="window.location.href = '/'">⭐ Our Beloved Books</h3>
                </div>
                <div class="col-2" style="float: left;">
                    <a class="navlink" href="/community"><h4>Community</h4></a>
                </div>
                <div class="col-2" style="float: left;">
                    <a class="navlink" href="/reviews"><h4>Reviews</h4></a>
                </div>
                <div class="col-2" style="float: left;">
                    <div class="dropdown">
                        <button type="button" style="all: unset; font-family: 'Nerko One', cursive;
                        font-weight: 400;
                        font-style: normal;
                        font-size: 1.4em;
                        padding: 5px;
                        color: #0f434d;
                        display: flex;
                        align-items: center;
                        flex-wrap: wrap;" class="navlink h-25" data-toggle="dropdown">
                          Account &nbsp; <i class="fa fa-user-circle"></i>
                        </button>
                        <div class="dropdown-menu">
                          <a href="#">Profile</a>
                          <a href="#">Settings</a>
                          <a href="#">Inbox</a>
                          <a href="#">Signout</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="offcanvas offcanvas-start exception" id="menubar" style="margin:0 !important; text-align: left; padding-left: 2em;">
            <div class="offcanvas-header exception" style="text-align: left; align-items: center;">
                <h1 class="offcanvas-title" style="display: flex; align-items: center;">Menu</h1>
                <button style="line-height: 1.7em; height: 1.7em; 
                all: unset; border: none; background: none; color: black; font-size: 2em !important;" type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas">
                    x
                </button>
              </div>
              <div class="offcanvas-body exception">
                <a class="classica" href="/reviews"><h4>Reviews</h4></a><br>
                <a class="classica" href="/community"><h4>Community</h4></a><br>
                <a class="classica" href="/profile"><h4>Profile</h4></a>
              </div>
        </div>

        <div class="navbar navbar-expand-lg" id="headeralternative" style="display: none; max-width: 100vw !important;">
            <div class="container-fluid row">
                <div class="col-1">
                    <button style="all: unset; font-size: 2em; color: black;" class="btn btn-primary ham" type="button" data-bs-toggle="offcanvas" data-bs-target="#menubar">&equiv;</button>
                </div>
                <div class="navbar-brand col-11">
                    <h3 class='display-5' onclick="window.location.href = '/'" style="padding-left: 5vw; padding-top: 1vw;">Our Beloved Books</h3>
                </div>
            </div>
        </div>

        <!--[if lt IE 7]>
            <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="#">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->
        <br>

`

const partialbeginloggedout = `
<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]>      <html class="no-js"> <!--<![endif]-->
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Our Beloved Books</title>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📚</text></svg>">
        <meta name="keywords" content="books, reviews, book reviews, community, discussion group, teenagers, books for teens">
        <meta name="description" content="Our Beloved Books is fostered to teenagers who love books. Here, we provide book reviews and analysis, as well as a community group for the curious to ask book-related questions!">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="style.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"/>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-eOJMYsd53ii+scO/bJGFsiCZc+5NDVN2yr8+0RDqr0Ql0h+rP48ckxlpbzKgwra6" crossorigin="anonymous">
    </head>
    <body style="background-color: rgb(214, 231, 255); margin: 0 !important; ">
        <div class="navbar navbar-expand-lg" id="header" style="max-width:100vw;">
            <div class="container-fluid row">
                <div class="navbar-brand col-8">
                    <h3 onclick="window.location.href = '/'">⭐ Our Beloved Books</h3>
                </div>
                <div class="col-2" style="float: left;">
                    <a class="navlink h-25" href="/signup">Signup</a>
                </div>
                <div class="col-2" style="float: left;">
                    <a class="navlink h-25" href="/login">Login</a>
                </div>
            </div>
        </div>

        <div class="offcanvas offcanvas-start exception" id="menubar" style="margin:0 !important; text-align: left; padding-left: 2em;">
            <div class="offcanvas-header exception" style="text-align: left; align-items: center;">
                <h1 class="offcanvas-title" style="display: flex; align-items: center;">Menu</h1>
                <button style="line-height: 1.7em; height: 1.7em; 
                all: unset; border: none; background: none; color: black; font-size: 2em !important;" type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas">
                    x
                </button>
              </div>
              <div class="offcanvas-body exception">
                <a class="classica" href="/login"><h4>Login</h4></a><br>
                <a class="classica" href="/signup"><h4>Signup</h4></a><br>
                <a class="classica" href="/about"><h4>About</h4></a>
              </div>
        </div>

        <div class="navbar navbar-expand-lg" id="headeralternative" style="display: none; max-width: 100vw !important;">
            <div class="container-fluid row">
                <div class="col-1">
                    <button style="all: unset; font-size: 2em; color: black;" class="btn btn-primary ham" type="button" data-bs-toggle="offcanvas" data-bs-target="#menubar">&equiv;</button>
                </div>
                <div class="navbar-brand col-11">
                    <h3 class='display-5' onclick="window.location.href = '/'" style="padding-left: 5vw; padding-top: 1vw;">Our Beloved Books</h3>
                </div>
            </div>
        </div>

        <!--[if lt IE 7]>
            <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="#">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->
        <br>
`

const partialend = `
        <script src="script.js" async defer></script>
        <script type="text/javascript" src=
"https://code.jquery.com/jquery-3.3.1.slim.min.js"></script>
    <script type="text/javascript"
        src=
"https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.0/umd/popper.min.js"></script>
    <script type="text/javascript"
        src=
"https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/js/bootstrap.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/js/bootstrap.bundle.min.js" integrity="sha384-JEW9xMcG8R+pH31jmWH6WWP0WintQrMb4s7ZOdauHnUtxwoG2vI5DkLtS3qm9Ekf" crossorigin="anonymous"></script>
    </body>
</html>
`

const partialfooter = `
<footer style="margin: 0; padding: 1em; background-color: rgb(66, 37, 211); color: white;">
            <h2>Copyright © 2024 Our Beloved Books. All rights reserved.</h2>
        </footer>`

passport.use(new LocalStrategy(
    { usernameField: 'username' },
    async (username, password, done) => {
        users = await users_list();
        password = MD5(password.trim() + salt).toString();
        success = false;
        for (u in users) {
            user = users[u];
            if(username === user.username && password === user.password) {
                success = user
            }
        }
        if(success) {
            return done(null, success)
        } else {
            return done(null, false, { message: 'Invalid credentials.\n' });
        }
    }
));
  
passport.serializeUser((user, done) => {
    theuser = user;
    done(null, user.id);
});
  
passport.deserializeUser(async (id, done) => {
    users = await users_list();
    const user = users[0].id === id ? users[0] : false; 
    done(null, user);
});

// Methods to be executed on routes 
const indexget = (req, res)=>{
    if (req.isAuthenticated()) {
        res.render('home.html', {root: path.join(__dirname, '../public'), user: req.session.username, head: partialbeginloggedin, footer: partialfooter, end: partialend});
    } else {
        res.render('teaser.html', {root: path.join(__dirname, '../public'), head: partialbeginloggedout, footer: partialfooter, end: partialend});
    }
} 
  
const signupget = (req, res)=>{ 
    res.render('signup.html', {root: path.join(__dirname, '../public'), head: partialbeginloggedout, footer: partialfooter, end: partialend} );
} 

const tos = (req, res)=>{ 
    res.render('tos.html', {root: path.join(__dirname, '../public'), head: partialbeginloggedout, footer: partialfooter, end: partialend} );
} 

const loginget = (req, res) => {
    res.render('login.html', {root: path.join(__dirname, '../public'), message: 'none', ont: 'none', head: partialbeginloggedout, footer: partialfooter, end: partialend})
}

const signuppost = async (req, res)=>{ 
    x = req.body;

    username = x.username.trim();
    password = MD5(x.password.trim() + salt).toString();
    email = x.email.trim();
    bio = x.bio;
    fname = x.name.trim();
    age = x.age;
    area = x.area
    genres = x.genre;
    lengths = x.length;
    narrations = x.narrationstyle;
    level = x.level;

    if (typeof genres == "string") { genresa = genres} else { genresa = genres.join(',')}
    if (typeof lengths == "string") { lengtha = lengths} else { lengtha = lengths.join(',')}
    if (typeof narrations == "string") { stylea = narrations } else { stylea = narrations.join(',')}

    tags3 = '{' + genresa + ',' + lengtha + ',' + stylea + '}'

    try {
        if (area != undefined) {
            const mq = 'INSERT INTO users (username, password, fname, email, bio, age, area, tags3, level, xp) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)'
            const result1 = await db.query(mq, [username, password, fname, email, bio, age, area, tags3, level, 0]);
        } else {
            const mq = 'INSERT INTO users (username, password, fname, email, bio, age, tags3, level, xp) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)'
            const result1 = await db.query(mq, [username, password, fname, email, bio, age, tags3, level, 0]);
        }
        res.redirect('/home')
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
} 

const loginpost = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (info) {
            return res.render('login.html', {root: path.join(__dirname, '../public'), ont: 'block', message: info.message, head: partialbeginloggedout, footer: partialfooter, end: partialend})
        }
        req.login(user, (err) => {
            req.session.username = user.username;
            return res.redirect('/')
        })
    })(req, res, next);
}

const reviewsget = (req, res) => {
    if (theuser == undefined) {
        res.redirect('/login')
    } else {
        res.render('review.html', {root: path.join(__dirname, '../public'), tags0: theuser.tags0, tags1: theuser.tags1, tags2: theuser.tags2, tags3: theuser.tags3, tags4: theuser.tags4, head: partialbeginloggedin, footer: partialfooter, end: partialend})
    }
}

const reviewspost = async (req, res)=>{ 
}

const homeget = (req, res) => {
    res.render('home.html', {root: path.join(__dirname, '../public'), head: partialbeginloggedin, footer: partialfooter, end: partialend})
}

const homepost = async (req, res)=>{ 
    res.render('home.html', {root: path.join(__dirname, '../public'), head: partialbeginloggedin, footer: partialfooter, end: partialend})
}

const addbookpost = async (req, res)=>{ 
    x = req.body;

    isbn = x.isbn
    title = x.title
    teaser = x.teaser.trim()
    minage = x.minage.trim()
    reason = x.reason.trim()
    pages = x.length
    author = x.authors
    tags = x.tags

    console.log(x)

    const mq = 'SELECT id FROM books'
    const result1 = await db.query(mq)
    if (result1.rowCount == 0) {
        id = 1
    } else {
        id = result1.rows[result1.rowCount -1].id.split(':')[0] + 1
    }

    if (pages < 300) {
        if (tags.includes('14') == false) {
            tags.push('14')
        }
        if (tags.includes('15') == true) {
            tags.splice(tags.indexOf('15'), 1)
        } 
        if (tags.includes('16') == true) {
            tags.splice(tags.indexOf('16'), 1)
        }
    } else if (pages < 600) {
        if (tags.includes('15') == false) {
            tags.push('15')
        }
        if (tags.includes('16') == true) {
            tags.splice(tags.indexOf('16'), 1)
        } 
        if (tags.includes('14') == true) {
            tags.splice(tags.indexOf('14'), 1)
        }
    } else if (pages >= 600) {
        if (tags.includes('16') == false) {
            tags.push('16')
        }
        if (tags.includes('15') == true) {
            tags.splice(tags.indexOf('15'), 1)
        } 
        if (tags.includes('14') == true) {
            tags.splice(tags.indexOf('14'), 1)
        }
    }
    
    if (minage == '') {
        if (tags.includes('43') == false) { tags.push('43') }
        if (tags.includes('44') == true) { tags.splice(tags.indexOf('44')) }
        tags = `{${tags.join(',')}}`
        const mq = 'INSERT INTO books (id, isbn, title, author, teaser, tags) VALUES ($1, $2, $3, $4, $5, $6)'
        const result2 = await db.query(mq, [id, isbn, title, author, teaser, tags])
    } else {
        if (tags.includes('44') == false) { tags.push('44') }
        if (tags.includes('43') == true) { tags.splice(tags.indexOf('43')) }
        tags = `{${tags.join(',')}}`
        minage = minage + ':' + reason
        const mq = 'INSERT INTO books (id, isbn, title, author, teaser, tags, minage) VALUES ($1, $2, $3, $4, $5, $6, $7)'
        const result2 = await db.query(mq, [id, isbn, title, author, teaser, tags, minage])
    }
    
    res.send({'id':id})
}

const reviewpageget = async (req, res) => {
    bookid = req.params.bookid
    if (theuser == undefined) {
        res.redirect('/login')
    } else {
        res.render('reviewpage.html', {root: path.join(__dirname, '../public'), id: parseInt(bookid), head: partialbeginloggedin, footer: partialfooter, end: partialend})
    }
}
  
// Export of all methods as object 
module.exports = { 
    indexget,
    signupget,
    signuppost,
    tos,
    loginget,
    loginpost,
    reviewsget,
    reviewspost,
    homeget,
    homepost,
    addbookpost,
    reviewpageget
}