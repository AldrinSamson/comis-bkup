const express = require('express');
const app = express();
const auditRoute = express.Router();

let Audit = require('../model/audit');

//get all
auditRoute.route('/').get((req, res) => {
    Audit.find({},{},{ sort: { date : -1 } },(error, data) => {
      if (error) {
        return next(error)
      } else {
        res.json(data)
      }
    })
  })
// get one
auditRoute.route('/get/id=:id').get((req, res) => {
    Audit.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})
// add
auditRoute.route('/post').post((req, res, next) => {
    Audit.create(req.body, (error, data) => {
      if (error) {
        console.log("error in inv add");
        return next(error)
      } else {
        res.json(data)
      }
    })
});
//update
auditRoute.route('/update/:id').put((req, res, next) => {
    Audit.findByIdAndUpdate(req.params.id, {
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
auditRoute.route('/delete/:id').delete((req, res, next) => {
    Audit.findByIdAndRemove(req.params.id, (error, data) => {
      if (error) {
        return next(error);
      } else {
        res.status(200).json({
          msg: data
        })
      }
    })
})



module.exports = auditRoute;