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
        res.sendFile('home.html', {root: path.join(__dirname, '../public'), user: req.session.username});
    } else {
        res.sendFile('teaser.html', options);
    }
} 
  
const signupget = (req, res)=>{ 
    res.render('signup.html', {root: path.join(__dirname, '../public')} );
} 

const tos = (req, res)=>{ 
    res.render('tos.html', {root: path.join(__dirname, '../public')} );
} 

const loginget = (req, res) => {
    res.render('login.html', {root: path.join(__dirname, '../public'), message: 'none', ont: 'none'})
}

const signuppost = async (req, res)=>{ 
    x = req.body;
    console.log(x)

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
            return res.render('login.html', {root: path.join(__dirname, '../public'), ont: 'block', message: info.message})
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
        res.render('review.html', {root: path.join(__dirname, '../public'), tags0: theuser.tags0, tags1: theuser.tags1, tags2: theuser.tags2, tags3: theuser.tags3, tags4: theuser.tags4})
    }
}

const reviewspost = async (req, res)=>{ 
}

const homeget = (req, res) => {
    res.render('home.html', {root: path.join(__dirname, '../public')})
}

const homepost = async (req, res)=>{ 
    res.render('home.html', {root: path.join(__dirname, '../public')})
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
        res.render('reviewpage.html', {root: path.join(__dirname, '../public'), id: parseInt(bookid)})
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