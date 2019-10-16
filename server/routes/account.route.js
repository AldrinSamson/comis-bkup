const express = require('express');
const app = express();
const accountRoute = express.Router();

let Account = require('../model/account');

//get all
accountRoute.route('/').get((req, res) => {
    Account.find((error, data) => {
      if (error) {
        return next(error)
      } else {
        res.json(data)
      }
    })
  })
// get one
accountRoute.route('/get/id=:id').get((req, res) => {
    Account.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})
// add
accountRoute.route('/post').post((req, res, next) => {
    Account.create(req.body, (error, data) => {
      if (error) {
        console.log("error in inv add");
        return next(error)
      } else {
        res.json(data)
      }
    })
});
//update
accountRoute.route('/update/:id').put((req, res, next) => {
    Account.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data)
    }
  })
})
//delete
accountRoute.route('/delete/:id').delete((req, res, next) => {
    Account.findByIdAndRemove(req.params.id, (error, data) => {
      if (error) {
        return next(error);
      } else {
        res.status(200).json({
          msg: data
        })
      }
    })
  })
//login
accountRoute.route('/login/user=:user&pass=:pass').get((req, res) => {
  Account.find({ username: req.params.user , password : req.params.pass },{},{}, (error, data) => {
  if (error) {
    return next(error)
  } else {
    res.json(data)
  }
})
})
//check username
accountRoute.route('/checkUsername/id=:id').get((req, res) => {
  Account.findOne({ username: req.params.id },{},{}, (error, data) => {
  if (error) {
    return next(error)
  } else {
    res.json(data)
  }
})
})
//validateAnswer 
accountRoute.route('/validateAnswer/id=:id&a1=:a1&a2=:a2').get((req, res) => {
  Account.findOne({ username: req.params.id , securityAnswer1: req.params.a1 , securityAnswer2: req.params.a2 },{},{}, (error, data) => {
  if (error) {
    return next(error)
  } else {
    res.json(data)
  }
})
})
//newPass
accountRoute.route('/updatePass/:id').put((req, res, next) => {
  Account.findOneAndUpdate({username : req.params.id}, { $set: req.body },{}, (error, data) => {
  if (error) {
    return next(error);
  } else {
    res.json(data)
  }
})
})






module.exports = accountRoute;