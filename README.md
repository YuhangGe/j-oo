# j-oo

Special light object-oriented framework.

Less than 200 lines, but has more functions.

## API

### `Class(constructor, [properties, superClass])`

Create a class. 

````js
var Class = require('j-oo');
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
    console.log('say from Man:', msg);
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
    this.callBase('say', 'I\'m rich!!', this.age);
  },
  //override property
  money: {
    value: '88888888888888888888';
  },
  house: {
    value: true
  }
}, Man);

````

### `Class.partial(someClass, [constructor, properties])`

Extend a Class, similar as .NET's partial keyword. Sometimes you write a class with
a variety of duties, and this class contains many lines of code. You can split this
class into multi files by using `Class.partial`. 

````js
/*
 * SomeClass.js
 */
var Class = require('j-oo');
var SomeClass = Class(function() {

}, {

});
module.exports = SomeClass;
````

````js
/*
 * SomeClass.partial.js
 */
var SomeClass = require('./SomeClass.js');
var Class = require('j-oo');
Class.partial(SomeClass, {
  anotherFn: function() {
    console.log('fn call');
  }
});

//even you can extend constructor
Class.partial(SomeClass, function() {
  this.anotherProperty = 'xxoo';
});

````