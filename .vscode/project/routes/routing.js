// 3rd Party Modules 
const { Router } = require('express'); 
const passport = require('passport');
const path = require('path');                             // install path

// Local Modules 
const control = require('../controllers/controller'); 

// Initialization 
const router = Router(); 
router.use(passport.initialize());
router.use(passport.session());

// Requests 
router.get('/', control.indexget)

router.get('/signup', control.signupget); 
router.post('/signup', control.signuppost); 

router.get('/tos', control.tos);

router.get('/login', control.loginget);
router.post('/login', control.loginpost)

router.get('/reviews', control.reviewsget);
router.post('/reviews', control.reviewspost);

router.get('/home', control.homeget);
router.post('/home', control.homepost);

router.post('/addbook', control.addbookpost);
router.post('/ratebook', control.ratebookpost);

router.get('/reviewpage/:bookid', control.reviewpageget);

router.get('/profile', control.profileget);
router.post('/submittier', control.submittier)

router.get('/usertags', control.usertags)

module.exports = router;

