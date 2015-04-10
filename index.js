(function() {
  var __map = [null];
  var __id = 1;
  var prop = '__$class_id$__';
  var deep = '__$class_deep$__';

  function $isUndefined(obj) {
    return typeof obj === 'undefined';
  }
  function $isFunction(obj) {
    return typeof obj === 'function';
  }

  function err(msg) {
    debugger;
    throw new Error(msg);
  }

  function $hasProperty(obj, prop) {
    return obj.hasOwnProperty(prop);
  }
  function $dp(obj, prop, value, writable, enumerable, configurable) {
    Object.defineProperty(obj, prop, {
      value: value,
      writable: writable ? true : false,
      enumerable: enumerable ? true : false,
      configurable: configurable !== false
    })
  }

  function dc(Class) {
    var cp = Class.prototype;
    if (!$hasProperty(cp, prop)) {
      $dp(cp, prop, __id);
      $dp(Class, prop, __id);
      __map.push({
        c: [], //constructors
        p: {}, //properties
        b: []  //base classes
      });
      __id++;
    }
  }

  function create(constructor, properties, ParentClass) {
    var Class = function() {
      if (!$hasProperty(this, deep)) {
        $dp(this, deep, -1, true, false, false);
      }
      var cm = __map[this[prop]], carr;
      if (this[deep] >= 0) {
        carr = __map[cm.b[this[deep]][prop]].c;
      } else {
        for (var k in cm.p) {
          Object.defineProperty(this, k, cm.p[k]);
        }
        carr = cm.c;
      }
      for(var i = 0; i < carr.length; i++) {
        carr[i].apply(this, arguments);
      }
    };
    dc(Class);
    bind(Class, properties, constructor);

    if (ParentClass && $hasProperty(ParentClass, prop)) {

      var cm = __map[Class[prop]];
      var pm = __map[ParentClass[prop]];
      cm.b = [ParentClass].concat(pm.b);
      var cpt = Class.prototype;
      var ppt = ParentClass.prototype;


      cpt.base = function() {
        this[deep]++;
        //如此疯狂的一行代码。。。
        __map[this[prop]].b[this[deep]].apply(this, arguments);
        this[deep]--;
      };
      cpt.callBase = function(method) {
        if ($isUndefined(method)) {
          err('callBase method need function name as first argument');
        }

        var baseClass, med;
        this[deep]++;
        baseClass = __map[this[prop]].b[this[deep]];
        med = baseClass.prototype[method];
        med.apply(this, [].slice.call(arguments, 1));
        this[deep]--;
      };

      var k;
      for (k in pm.p) {
        if (!$hasProperty(cm.p, k)) {
          cm.p[k] = pm.p[k];
        }
      }

      for (k in ppt) {
        if (!$hasProperty(cpt, k)) {
          cpt[k] = ppt[k];
        }
      }
    }
    return Class;
  }

  function bind(Class, properties, constructor) {
    var m = __map[Class[prop]];
    if (constructor) {
      m.c.push(constructor);
    }
    var k, p, t;
    for (k in properties) {
      p = properties[k];
      t = $isFunction(p) ? Class.prototype : m.p;
      if ($hasProperty(t, k)) {
        err('oo.extend 不能添加已经定义过的属性/方法，请检查。')
      }
      t[k] = p;
    }
  }

  create.partial = function(Class, constructor, properties) {
    if (!$hasProperty(Class, prop)) {
      err('扩展一个Class，请先创建它');
    }

    if (typeof constructor === 'function') {
      bind(Class, properties, constructor);
    } else {
      bind(Class, constructor);
    }
  };

  if (typeof window !== 'undefined') {
    if (typeof angular !== 'undefined') {
      angular.module('oo', []).factory('oo', create);
    }
    window.oo = create;
  } else {
    module.exports = create;
  }
})();