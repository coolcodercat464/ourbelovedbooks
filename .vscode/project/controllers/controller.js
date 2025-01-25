const path = require('path');                             // install path
const options = {root: path.join(__dirname, '../public')};// set options root
const db = require(path.join(__dirname, '../databases/postgres.js'))
var theuser;

// password hashing stuff
var MD5 = require("crypto-js/md5");
const salt = "Let_us_pick_up_our_books_and_our_pens,_they_are_the_most_powerful_weapons_Malala_Yousafzai";
var userid = 0;

// passport authentication stuff
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

async function users_list() {
    const res = await db.query('SELECT id, username, password, tags0, tags1, tags2, tags3, tags4, hasread, hasliked, hasdisliked, wishlist FROM users');
    return res.rows
}

// save initial url so after login it doesnt get lost
var urlinit = '/';


// templates
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

        <link rel="stylesheet" href="/style.css">

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"/>
        
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js" integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF" crossorigin="anonymous"></script>
        
        <link href = "https://code.jquery.com/ui/1.10.4/themes/ui-lightness/jquery-ui.css" rel = "stylesheet">
        <script src = "https://code.jquery.com/jquery-1.10.2.js"></script>
        <script src = "https://code.jquery.com/ui/1.10.4/jquery-ui.js"></script>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        
        <script>
            $(function() {
            $( ".sortable" ).sortable({
                connectWith: ".sortable",
                placeholder: "highlight",
                dropOnEmpty: true
            });
            });
        </script>
    </head>
    <body style="background-color: rgb(214, 231, 255); margin: 0 !important; ">
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
                <div class="dropdown col-2" style="float: left;">
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
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="/profile">Profile</a></li>
                        <li><a class="dropdown-item" href="#">Setting</a></li>
                        <li><a class="dropdown-item" href="#">Inbox</a></li>
                        <li><a class="dropdown-item" href="#">Signout</a></li>
                    </ul>
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

        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js" integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF" crossorigin="anonymous"></script>
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
        <script type="text/javascript"
        src=
"https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/js/bootstrap.min.js"></script>
    </body>
</html>
`

const partialfooter = `
<footer style="margin: 0; padding: 1em; background-color: rgb(66, 37, 211); color: white;">
            <h2>Copyright © 2024 Our Beloved Books. All rights reserved.</h2>
        </footer>`

// more passport stuff for sessions
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
                break;
            }
        }
        if(success) {
            userid = u;
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
    const user = users[userid].id === id ? users[userid] : false; 
    done(null, user);
});

// Methods to be executed on routes 

// home page
const indexget = (req, res)=>{
    if (req.isAuthenticated()) {
        res.render('home.html', {root: path.join(__dirname, '../public'), user: req.session.username, head: partialbeginloggedin, footer: partialfooter, end: partialend});
    } else {
        res.render('teaser.html', {root: path.join(__dirname, '../public'), head: partialbeginloggedout, footer: partialfooter, end: partialend});
    }
} 

const homeget = (req, res) => {
    res.render('home.html', {root: path.join(__dirname, '../public'), head: partialbeginloggedin, footer: partialfooter, end: partialend})
}

const homepost = async (req, res)=>{ 
    res.render('home.html', {root: path.join(__dirname, '../public'), head: partialbeginloggedin, footer: partialfooter, end: partialend})
}

// signup, terms of service, and logins
const signupget = (req, res)=>{ 
    res.render('signup.html', {root: path.join(__dirname, '../public'), head: partialbeginloggedout, footer: partialfooter, end: partialend} );
} 

const tos = (req, res)=>{ 
    res.render('tos.html', {root: path.join(__dirname, '../public'), head: partialbeginloggedout, footer: partialfooter, end: partialend} );
} 

const loginget = (req, res) => {
    res.render('login.html', {root: path.join(__dirname, '../public'), message: 'none', ont: 'none', head: partialbeginloggedout, footer: partialfooter, end: partialend})
}

// posting for the above
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
        res.redirect(urlinit)
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
            return res.redirect(urlinit)
        })
    })(req, res, next);
}

// stuff for reviews (get)
const reviewsget = (req, res) => {
    if (theuser == undefined) {
        urlinit = '/reviews'
        res.redirect('/login')
    } else {
        res.render('review.html', {root: path.join(__dirname, '../public'), tags0: theuser.tags0, tags1: theuser.tags1, tags2: theuser.tags2, tags3: theuser.tags3, tags4: theuser.tags4, head: partialbeginloggedin, footer: partialfooter, end: partialend})
    }
}

const reviewpageget = async (req, res) => {
    bookid = req.params.bookid
    if (theuser == undefined) {
        urlinit = `/reviewpage/${bookid}`
        res.redirect('/login')
    } else {
        res.render('reviewpage.html', {root: path.join(__dirname, '../public'), id: parseInt(bookid), head: partialbeginloggedin, footer: partialfooter, end: partialend, username: theuser.username})
    }
}

// adding books, reviews, etc... (post for reviews)
const addbookpost = async (req, res)=>{ 
    if (req.isAuthenticated()) {
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
            id = result1.rows[result1.rowCount -1].id + 1
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
            const result = await db.query(mq, [id, isbn, title, author, teaser, tags])
        } else {
            if (tags.includes('44') == false) { tags.push('44') }
            if (tags.includes('43') == true) { tags.splice(tags.indexOf('43')) }
            tags = `{${tags.join(',')}}`
            minage = minage + ':' + reason
            const mq = 'INSERT INTO books (id, isbn, title, author, teaser, tags, minage) VALUES ($1, $2, $3, $4, $5, $6, $7)'
            const result = await db.query(mq, [id, isbn, title, author, teaser, tags, minage])
        }

        res.send({'id':id})
    } else {
        res.redirect('/login')
    }
}

const ratebookpost = async (req, res)=>{ 
    if (theuser == undefined) {
        res.redirect('/login')
    } else {
        x = req.body;

        const mq = 'INSERT INTO reviews (username, date, title, body, stars, book) VALUES ($1, $2, $3, $4, $5, $6)'
        const result = await db.query(mq, [theuser.username, x.date, x.title, x.review, x.rating, x.bookid])
    }
}

const analysebookpost = async (req, res)=>{ 
    if (theuser == undefined) {
        res.redirect('/login')
    } else {
        x = req.body;
        const mq = 'INSERT INTO sna (username, date, title, body, book) VALUES ($1, $2, $3, $4, $5)'
        const result = await db.query(mq, [theuser.username, x.date, x.title, x.text, x.bookid])
    }
}

const submitstarspost = async (req, res)=>{ 
    if (theuser == undefined) {
        res.redirect('/login')
    } else {
        x = req.body;
        const mq1 = 'SELECT username FROM ratings'
        const result1 = await db.query(mq1)

        isin = false
        for (names in result1.rows) {
            n = result1.rows[names];
            if (n.username == theuser.username) {
                isin = true
            }
        }

        if (isin) {
            const mq = 'UPDATE ratings SET stars = $1 WHERE username = $2'
            const result = await db.query(mq, [x.rating, theuser.username])
        } else {
            const mq = 'INSERT INTO ratings (username, stars, book) VALUES ($1, $2, $3)'
            const result = await db.query(mq, [theuser.username, x.rating, x.bookid])
        }

        const mq2 = 'SELECT stars FROM ratings WHERE book = $1'
        const result2 = await db.query(mq2, [x.bookid])

        size = 0;
        sum = 0;
        for (i in result2.rows) {
            rating = result2.rows[i].stars;
            sum = sum + rating;
            size ++;
        }
        const mq4 = 'UPDATE books SET stars = $1 WHERE id = $2'
        const result4 = await db.query(mq4, [sum/size, x.bookid])
    }
}

const submittldrpost = async (req, res)=>{ 
    if (theuser == undefined) {
        res.redirect('/login')
    } else {
        x = req.body;

        const mq = 'INSERT INTO tldrbites (username, stars, book, tldr, upvotes) VALUES ($1, $2, $3, $4, 0)'
        const result = await db.query(mq, [theuser.username, x.rating, x.bookid, x.tldr])
    }
}

const votetldr = async (req, res)=>{ 
    if (theuser == undefined) {
        res.redirect('/login')
    } else {
        x = req.body;

        const mq = 'SELECT upvotes FROM tldrbites WHERE id = $1'
        const result = await db.query(mq, [x.id])
        currentvotes = parseInt(result.rows[0].upvotes)

        inc = (x.inc === '+') ? 1 : -1;
        keyword = (x.inc === '+') ? 'up' : 'down';
        oppkey = (x.inc === '+') ? 'down' : 'up';

        const mq3u = 'SELECT upvoters FROM tldrbites WHERE id = $1'
        upv = await db.query(mq3u, [x.id])

        const mq3d = 'SELECT downvoters FROM tldrbites WHERE id = $1'
        dov = await db.query(mq3d, [x.id])

        voters = {'up': upv.rows[0]['upvoters'], 'down': dov.rows[0]['downvoters']}

        console.log(voters)

        if (inc === 1) {
            const mq3 = 'SELECT upvoters FROM tldrbites WHERE id = $1'
            result3 = await db.query(mq3, [x.id])
        } else {
            const mq3 = 'SELECT downvoters FROM tldrbites WHERE id = $1'
            result3 = await db.query(mq3, [x.id])
        }
        
        if (voters[oppkey] != null && voters[oppkey].includes(theuser.username)) {
            l = voters[oppkey]
            l.splice(l.indexOf(theuser.username))
            const mq6 = `UPDATE tldrbites SET upvotes = $1, ${oppkey}voters = $2 WHERE id = $3`
            const result6 = await db.query(mq6, [currentvotes + inc, '{' + l.join(',') + '}', x.id])
            currentvotes += inc
        }

        if (result3.rows[0][keyword + 'voters'] == null) {
            const mq2 = `UPDATE tldrbites SET upvotes = $1, ${keyword}voters = $2 WHERE id = $3`
            const result2 = await db.query(mq2, [currentvotes + inc, '{' + theuser.username + '}', x.id])
        } else if (result3.rows[0][keyword + 'voters'].includes(theuser.username)) {
            l = result3.rows[0][keyword + 'voters']
            l.splice(l.indexOf(theuser.username))
            const mq2 = `UPDATE tldrbites SET upvotes = $1, ${keyword}voters = $2 WHERE id = $3`
            const result2 = await db.query(mq2, [currentvotes - inc, '{' + l.join(',') + '}', x.id])
        } else {
            l = result3.rows[0][keyword + 'voters']
            l.push(theuser.username)
            const mq2 = `UPDATE tldrbites SET upvotes = $1, ${keyword}voters = $2 WHERE id = $3`
            const result2 = await db.query(mq2, [currentvotes + inc, '{' + l.join(',') + '}', x.id])
        }
    }
}

// adding to reading lists
const addwish = async (req, res) => {
    if (theuser == undefined) {
        res.redirect('/login')
    } else {
        x = req.body;

        const mq1 = 'SELECT wishlist FROM users WHERE username = $1;'
        const result1 = await db.query(mq1, [theuser.username])

        if (typeof(x.bookid) == 'number' && !result1.rows[0].wishlist.includes(x.bookid)) {
            const mq = 'UPDATE users SET wishlist = array_append(wishlist, $1) WHERE username = $2;'
            await db.query(mq, [x.bookid, theuser.username])
        }
    }
};

const addliked = async (req, res) => {
    if (theuser == undefined) {
        res.redirect('/login')
    } else {
        x = req.body;

        const mq1 = 'SELECT hasliked FROM users WHERE username = $1;'
        const result1 = await db.query(mq1, [theuser.username])

        if (typeof(x.bookid) == 'number' && !result1.rows[0].hasliked.includes(x.bookid)) {
            const mq = 'UPDATE users SET hasliked = array_append(hasliked, $1) WHERE username = $2;'
            await db.query(mq, [x.bookid, theuser.username])
        }
    }
};

const adddisliked = async (req, res) => {
    if (theuser == undefined) {
        res.redirect('/login')
    } else {
        x = req.body;

        const mq1 = 'SELECT hasdisliked FROM users WHERE username = $1;'
        const result1 = await db.query(mq1, [theuser.username])

        if (typeof(x.bookid) == 'number' && !result1.rows[0].hasdisliked.includes(x.bookid)) {
            const mq = 'UPDATE users SET hasdisliked = array_append(hasdisliked, $1) WHERE username = $2;'
            await db.query(mq, [x.bookid, theuser.username])
        }
    }
};

// profiles and profile updating
const profileget = async (req, res) => {
    if (theuser == undefined) {
        urlinit = '/profile'
        res.redirect('/login')
    } else {
        res.render('profile.html', {root: path.join(__dirname, '../public'), head: partialbeginloggedin, footer: partialfooter, end: partialend})
    }
}

const submittier = async (req, res) => {
    if (theuser == undefined) {
        res.redirect('/login')
    } else {
        x = req.body;
        tags0 = (x.tags0.length == 0) ? '{}' : `{${x.tags0.join(',')}}`
        tags1 = (x.tags1.length == 0) ? '{}' : `{${x.tags1.join(',')}}`
        tags2 = (x.tags2.length == 0) ? '{}' : `{${x.tags2.join(',')}}`
        tags3 = (x.tags3.length == 0) ? '{}' : `{${x.tags3.join(',')}}`
        tags4 = (x.tags4.length == 0) ? '{}' : `{${x.tags4.join(',')}}`
        const mq = 'UPDATE users SET tags0 = $1, tags1 = $2, tags2 = $3, tags3 = $4, tags4 = $5 WHERE username = $6'
        await db.query(mq, [tags0, tags1, tags2, tags3, tags4, theuser.username])
        res.send(x);
    }
};

const submitlists = async (req, res) => {
    if (theuser == undefined) {
        res.redirect('/login')
    } else {
        x = req.body;
        wish = (x.wish.length == 0) ? '{}' : `{${x.wish.join(',')}}`
        liked = (x.liked.length == 0) ? '{}' : `{${x.liked.join(',')}}`
        disliked = (x.disliked.length == 0) ? '{}' : `{${x.disliked.join(',')}}`
        const mq = 'UPDATE users SET wishlist = $1, hasliked = $2, hasdisliked = $3 WHERE username = $4'
        await db.query(mq, [wish, liked, disliked, theuser.username])
        res.send(x);
    }
};

// information or database searches dependent on user (non-dependents are in server.js)
const usertags = async (req, res) => {
    if (theuser == undefined) {
        urlinit = '/usertags'
        res.redirect('/login')
    } else {
        const mq = 'SELECT tags0, tags1, tags2, tags3, tags4 FROM users WHERE username = $1'
        const result = await db.query(mq, [theuser.username])
        res.send(result.rows);
    }
};

const userlists = async (req, res) => {
    if (theuser == undefined) {
        urlinit = '/usertags'
        res.redirect('/login')
    } else {
        const mq = 'SELECT wishlist, hasliked, hasdisliked FROM users WHERE username = $1'
        const result = await db.query(mq, [theuser.username])
        res.send(result.rows);
    }
};

const userratings = async (req, res) => {
    if (theuser == undefined) {
        urlinit = '/userratings'
        res.redirect('/login')
    } else {
        const mq = 'SELECT book, stars FROM ratings WHERE username = $1'
        const result = await db.query(mq, [theuser.username])
        res.send(result.rows);
    }
};

// Export of all methods as object 
module.exports = { 
    indexget,
    signupget,
    signuppost,
    tos,
    loginget,
    loginpost,
    reviewsget,
    homeget,
    homepost,
    addbookpost,
    reviewpageget,
    ratebookpost,
    profileget,
    usertags,
    submittier,
    addwish,
    addliked,
    adddisliked,
    userlists,
    submitlists,
    userratings,
    submitstarspost,
    submittldrpost,
    votetldr,
    analysebookpost
}