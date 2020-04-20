module.exports = function(app, passport, db, multer, ObjectId) {


  var storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'public/images/uploads')
      },
      filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + ".png")
      }
  });
  var upload = multer({storage: storage});

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
      let uId = ObjectId(req.session.passport.user)
      console.log(req.user);
        db.collection('data').find().toArray((err, result) => {
          // console.log(result)
          db.collection('pictureUpload').find({'posterId': uId}).toArray((err, result) => {
            // console.log(result)
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user,
            messages: result,
            pictureUpload: result,
            pinnedImage: result,
            })
            console.log("this is result",result)
          })
        })
    });

    app.get('/feed', isLoggedIn, function(req, res) {
        db.collection('data').find().toArray((err, result) => {
          db.collection('pictureUpload').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('feed.ejs', {
            user : req.user,
            messages: result,
            pictureUpload: result
          })
        })
      })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/login');
    });

// message board routes ===============================================================

    app.post('/messages', (req, res) => {
      db.collection('data').save({name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown:0}, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/profile')
      })
    })


    app.put('/pin', (req, res) => {
      let uId = ObjectId(req.session.passport.user)
      // console.log("pinned image route")
      console.log(req.body.pinnedImage)
      db.collection('users')
      .findOneAndUpdate({_id: uId}, {
        // to update in object use quotes with dot notation :)
         $push: {'local.favoritePics': req.body.pinnedImage}
      }, {
        sort: {_id: 1},
        upsert: false
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })

    app.post('/pictureUpload', upload.single('file-to-upload'), (req, res, next) => {
      let uId = ObjectId(req.session.passport.user)
      let userEmail = req.user.local.email
      db.collection('pictureUpload').save({userEmail: userEmail, posterId: uId, caption: req.body.caption, likes: 0, imgPath: 'images/uploads/' + req.file.filename}, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/profile')
      })
    });

    app.put('/likePicture', (req, res) => {
      db.collection('pictureUpload')
      .findOneAndUpdate({_id: ObjectId(req.body._id), caption: req.body.caption}, {
        $set: {
          likes:req.body.likes + 1
        }
      }, {
        sort: {_id: 1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })

    // app.put('/likeProfilePic', (req, res) => {
    //   console.log(req.body._id)
    //   console.log(req.body.caption)
    //   db.collection('pictureUpload')
    //   .findOneAndUpdate({_id: ObjectId(req.body._id), {
    //     $set: {
    //       likes:req.body.likes + 1
    //     }
    //   }, {
    //     sort: {_id: 1},
    //     upsert: true
    //   }, (err, result) => {
    //     if (err) return res.send(err)
    //     res.send(result)
    //   })
    // })

    app.delete('/deletePost', (req, res) => {
      // console.log(req.body)
      db.collection('pictureUpload').findOneAndDelete({_id: ObjectId(req.body._id), posterId: ObjectId(req.body.posterId)}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
