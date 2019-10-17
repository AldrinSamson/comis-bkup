let express = require('express'),
  path = require('path'),
  mongoose = require('mongoose'),
  cors = require('cors'),
  bodyParser = require('body-parser'),
  dataBaseConfig = require('./database/db');

mongoose.Promise = global.Promise;
mongoose.connect(dataBaseConfig.db, {
  useNewUrlParser: true
}).then(() => {
    console.log('Database connected sucessfully ')
  },
  error => {
    console.log('Could not connected to database : ' + error)
  }
)

const inventoryRoute = require('./routes/inventory.route')
const inventoryTypeRoute = require('./routes/inventoryType.route')
const inventorySubTypeRoute = require('./routes/inventorySubType.route')
const transactionRoute = require('./routes/transaction.route')
const borrowerRoute = require('./routes/borrower.route')
const incidentRoute = require('./routes/incident.route')
const accountRoute = require('./routes/account.route')
const auditRoute = require('./routes/audit.route')

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors());

app.use(express.static(path.join(__dirname, 'dist/comis.version.3')));

app.use('/inventory', inventoryRoute)
app.use('/inventoryType', inventoryTypeRoute)
app.use('/inventorySubType', inventorySubTypeRoute)
app.use('/transaction' , transactionRoute)
app.use('/borrower' , borrowerRoute)
app.use('/incident' , incidentRoute)
app.use('/account' , accountRoute)
app.use('/audit' , auditRoute)

const port = process.env.PORT || 8000;

app.listen(port, () => {
   console.log('Connected to port ' + port)
})

app.use((req, res, next) => {
  next(createError(404));
});

app.get('/', (req, res) => {
  res.send('invaild endpoint');
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/comis.version.3/index.html'));
});

app.use(function (err, req, res, next) {
  console.error(err.message);
  console.log(err);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});
