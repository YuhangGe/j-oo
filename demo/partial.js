var Class = require('../index.js');
var Tycoon = require('./simple.js');

Class.partial(Tycoon, function(name, age, company) {
  this.company = company;
}, {
  anotherFn: function() {
    this.say();
    console.log('call another fn:', this.company);
  }
});


console.log('---output form partial.js----');
var t = new Tycoon('土豪', 32, 'alipay');
t.anotherFn();
