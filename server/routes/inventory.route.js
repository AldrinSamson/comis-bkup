const express = require('express');
const app = express();
const inventoryRoute = express.Router();

let Inventory = require('../model/inventory');

//get all
inventoryRoute.route('/').get((req, res) => {
    Inventory.find({ },{},{ sort: { dateAdded: -1}},(error, data) => {
      if (error) {
        return next(error)
      } else {
        res.json(data)
      }
    })
  })
// get one
inventoryRoute.route('/get/id=:id').get((req, res) => {
  Inventory.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})
// add
inventoryRoute.route('/post').post((req, res, next) => {
    Inventory.create(req.body, (error, data) => {
      if (error) {
        console.log("error in inv add");
        return next(error)
      } else {
        res.json(data)
      }
    })
});
//update
inventoryRoute.route('/update/:id').put((req, res, next) => {
  Inventory.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data)
    }
  })
})
// get last itemnum
inventoryRoute.route('/get/subType=:subType').get((req, res) => {
  Inventory.findOne({ subType: req.params.subType },{},{ sort: { itemNum: -1}}, (error, data) => {
if (error) {
  return next(error)
} else {
  res.json(data)
}
})
})
//delete
inventoryRoute.route('/delete/:id').delete((req, res, next) => {
  Inventory.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})



module.exports = inventoryRoute;