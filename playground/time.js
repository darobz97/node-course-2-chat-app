const moment = require('moment');

var date = moment();
date.add(1, 'y');
console.log(date.format('MMM Do YYYY h:m a '));
