const savedModel = require('../models/Saved')

module.exports = {
    ensureAuthenticated: function(req, res, next) {
      savedModel.findOne({id: req.headers.cook})
      .then(user => {
        if(!user) {
          console.log("User not Authenticated")
          res.send(false);
        }
        else {
          next();
        }
        
      })
      
      
    },
    forwardAuthenticated: function(req, res, next) {
      if (!req.isAuthenticated()) {
        return next();
      }
      res.redirect('http://localhost:3000/home');      
    }
  };
  