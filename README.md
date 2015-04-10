# j-oo

Special light javascript object-oriented framework.

Less than 130 lines, but has more functions.

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

### Tip

这个小库的出发点是，当你需要写一个Class非常大(特别是跟DOM相关的Class)，由
逻辑、事件、算法等部分组成，但又比较内聚不适合分成不同模块时，
可以将这个类的不同功能部分分别写在不同文件里。你可以在不同的文件里通过
`constructor`参数给Class添加成员变量，通过`properties`参数添加成员方法。
类似于.NET（C#/VB.net）的partial关键字。

JS引擎对于构造函数会有优化，会把其成员变量像静态编译一样优化成数组访问。不确定
当构造函数被拆分成不同部分时，是否还有等效的优化。因此，对于性能要求高且出现
瓶颈的情况下（比如在粒子引擎这一类的频繁生成Class实例），请慎用(或者在发布时
将partial合并成一个Class)。