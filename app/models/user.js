// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
// ==============
//  1) HAVE A BUTTON ON PICTUERS THAT CRATES A POST REQUEST THAT IS TIDE TO THE USERID AND MAKES A SEPERATE COLLECTION OF FAVORTIEPICS
//  2) HAVE A PUT REQUEST TO ADD FAVORTIE PICS TO THE USER COLLECTION IN AN ARRAY
// ==============
    local            : {
        email        : String,
        password     : String,
        favoritePics : [Array]
    },
    facebook         : {
        id           : String,
        token        : String,
        name         : String,
        email        : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }

});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
