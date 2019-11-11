const express = require('express');
const app = express();
const transactionRoute = express.Router();

let Transcation = require('../model/transaction');

//get all
transactionRoute.route('/').get((req, res) => {
    Transcation.find({},{},{ sort: { dateBorrowed : -1 } },(error, data) => {
      if (error) {
        return next(error)
      } else {
        res.json(data)
      }
    })
  })
// get one
transactionRoute.route('/get/id=:id').get((req, res) => {
    Transcation.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})
// add
transactionRoute.route('/post').post((req, res, next) => {
    Transcation.create(req.body, (error, data) => {
      if (error) {
        console.log("error in inv add");
        return next(error)
      } else {
        res.json(data)
      }
    })
});
//update
transactionRoute.route('/update/:id').put((req, res, next) => {
    Transcation.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data)
    }
  })
})
//getLatest
transactionRoute.route('/getLatest/id=:id').get((req, res) => {
    Transcation.findOne({ itemID: req.params.id },{},{ sort: { dateBorrowed : -1 } }, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})
//get by borrower
transactionRoute.route('/getByBorrower/id=:id').get((req, res) => {
  Transcation.find({ borrowerID: req.params.id },{},{ sort: { dateBorrowed : -1 } }, (error, data) => {
  if (error) {
    return next(error)
  } else {
    res.json(data)
  }
})
})
//get by item 
transactionRoute.route('/getByItem/id=:id').get((req, res) => {
  Transcation.find({ itemID: req.params.id },{},{ sort: { dateBorrowed : -1 } }, (error, data) => {
  if (error) {
    return next(error)
  } else {
    res.json(data)
  }
})
})
// group n count item
transactionRoute.route('/frequentItems').get((req, res) => {
  const aggregatorOpts = [{
    $group: {
      _id: "$itemID",
      count: { $sum: 1 }
    }
  },
  {
    $sort: { count : -1 } 
  },
  { $limit: 6 } 
]
  
  Transcation.aggregate(aggregatorOpts, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// group n count item
transactionRoute.route('/frequentBorrowers').get((req, res) => {
  const aggregatorOpts = [{
    $group: {
      _id: "$borrowerID",
      count: { $sum: 1 }
    }
  },
  {
    $sort: { count : -1 } 
  },
  { $limit: 6 },
  {$lookup:

    {

        from: 'borrower',

        localField: '_id',

        foreignField: 'bID',

        as: 'bDetails'

    }

}
   
]
  
  Transcation.aggregate(aggregatorOpts,(error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

transactionRoute.route('/testjoin').get((req, res) => {
  const aggregatorOpts = [ 
    {$lookup:

    {

        from: 'borrower',

        localField: 'borrowerID',

        foreignField: 'bID',

        as: 'bDetails'

    }

}
]
  
  Transcation.aggregate(aggregatorOpts,(error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})
// TODO CLEAR BY DATE , CLEAR ALL
module.exports = transactionRoute;

