var Class = require('../index.js');
var Person = Class(function(name) {
  this.name = name;
}, {
  say: function() {
    console.log('Say from Person: ' + 'hello, I\'m ' + this.name + '.');
  },
  fn: function() {
    console.log('call fn');
  }
});

var Man = Class(function(name, age) {
  this.base(name); //call super constructor. we do not use `this.super` because `super` is a reserved keyword.
  this.age = age;
  this._has_house = false;
}, {
  //override method
  say: function(msg) {
    this.callBase('say');
    console.log('say from Man:', msg, this.age);
  },
  //define property same as Object.defineProperty
  money: {
    value: 8888,
    writable: true,
    enumerable: false
  },
  house: {
    get: function() {
      return this._has_house;
    },
    set: function(val) {
      this._has_house = val;
    }
  }
}, Person);

var Tycoon = Class(function(name, age) {
  this.base(name, age);
}, {
  say: function() {
    this.callBase('say', 'I\'m rich!!');
  },
  //override property
  money: {
    value: '88888888888888888888'
  },
  house: {
    value: true
  }
}, Man);

var t = new Tycoon('土豪', 45);

console.log(t.money);
t.say();

module.exports = Tycoon;