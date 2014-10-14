define([], function() {
  "use strict";
  "use strict";
  var utils = {
    JSONPath: function(path) {
      return path.join('/');
    },
    getJSONPatchValue: function(val) {
      return angular.fromJson(angular.toJson(val));
    }
  };
  var $__default = angular.module('bob.storage', []).factory('StorageFactory', function($rootScope, $window, $timeout) {
    var StorageFactory = function StorageFactory() {
      var $__0 = this;
      this.store = {};
      var path = Immutable.Vector();
      this.operations = [];
      var savedData = $window.localStorage.getItem('saved-data');
      try {
        savedData = JSON.parse(savedData);
        if (savedData) {
          this.store = angular.extend(this.store, savedData);
        }
      } catch (e) {}
      this.observe(this.store, path.push());
      this.saveToLocalStorage = _.throttle((function() {
        console.log('saving');
        $window.localStorage.setItem('saved-operations', angular.toJson($__0.operations));
        $window.localStorage.setItem('saved-data', angular.toJson($__0.store));
      }), 250);
    };
    ($traceurRuntime.createClass)(StorageFactory, {
      observe: function(val, path) {
        if (angular.isArray(val)) {
          this.observeArray(val, path);
          if (val.length) {
            {
              try {
                throw undefined;
              } catch ($l) {
                try {
                  throw undefined;
                } catch ($i) {
                  {
                    {
                      $i = 0;
                      $l = val.length;
                    }
                    for (; $i < $l; $i++) {
                      try {
                        throw undefined;
                      } catch (l) {
                        try {
                          throw undefined;
                        } catch (i) {
                          {
                            {
                              i = $i;
                              l = $l;
                            }
                            try {
                              this.observe(val[$traceurRuntime.toProperty(i)], path.push(i));
                            } finally {
                              $i = i;
                              $l = l;
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        } else if ((typeof val === 'undefined' ? 'undefined' : $traceurRuntime.typeof(val)) === 'object') {
          this.observeObject(val, path);
          for (var $x in val) {
            try {
              throw undefined;
            } catch (x) {
              {
                x = $x;
                if (val.hasOwnProperty(x) && x.substr(0, 2) !== '$$') {
                  console.log('gonna do stuff on ', x);
                  this.observe(val[$traceurRuntime.toProperty(x)], path.push(x));
                }
              }
            }
          }
        } else {
          this.observePath(val, path);
        }
      },
      observePath: function(val, path) {},
      valFromPath: function(path, obj) {
        var p = Path.get(path);
        var val = p.getValueFrom(obj);
        return val;
      },
      apply: function(patches) {
        console.log('apply', JSON.stringify(patches));
        jsonpatch.apply(this.store, patches);
      },
      op: function(type, path, val) {
        if (angular.isArray(val) && val.length > 0 && type == 'add') {
          this.op(type, path, []);
          {
            try {
              throw undefined;
            } catch ($l) {
              try {
                throw undefined;
              } catch ($i) {
                {
                  {
                    $i = 0;
                    $l = val.length;
                  }
                  for (; $i < $l; $i++) {
                    try {
                      throw undefined;
                    } catch (l) {
                      try {
                        throw undefined;
                      } catch (i) {
                        {
                          {
                            i = $i;
                            l = $l;
                          }
                          try {
                            this.op(type, path.push(i), val[$traceurRuntime.toProperty(i)]);
                          } finally {
                            $i = i;
                            $l = l;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          return;
        }
        path = '/' + path.toJS().join('/');
        var op = {};
        op.op = type;
        op.path = path;
        if (val) {
          op.value = utils.getJSONPatchValue(val);
        }
        this.operations.push(op);
        this.saveToLocalStorage();
        console.log(op);
      },
      observeArray: function(val, path) {
        var $__0 = this;
        var observer = new ArrayObserver(val);
        if (val.$$observer) {
          val.$$observer.close();
          delete val.$$observer;
        }
        val.$$observer = observer;
        observer.open((function(splices) {
          splices.forEach((function(s) {
            if (s.addedCount > 0) {
              try {
                throw undefined;
              } catch (i) {
                {
                  i = s.index;
                  val.slice(s.index, s.index + s.addedCount).forEach((function(o) {
                    var newPath = path.push(i);
                    $__0.observe(o, newPath);
                    $__0.op('add', newPath, o);
                    i++;
                  }));
                }
              }
            }
            if (s.removed) {
              try {
                throw undefined;
              } catch (i) {
                {
                  i = s.index;
                  s.removed.forEach((function(x) {
                    var newPath = path.push(i);
                    if (x.$$observer) {
                      x.$$observer.close();
                    }
                    $__0.op('remove', newPath);
                    i++;
                  }));
                  $__0.observe(val, path);
                }
              }
            }
          }));
        }));
      },
      observeObject: function(val, path) {
        var $__0 = this;
        var observer = new ObjectObserver(val);
        if (val.$$observer) {
          val.$$observer.close();
          delete val.$$observer;
        }
        val.$$observer = observer;
        observer.open((function(a, r, c, o) {
          for (var $x in a) {
            try {
              throw undefined;
            } catch (x) {
              {
                x = $x;
                if (val.hasOwnProperty(x) && x.substr(0, 2) !== '$$') {
                  try {
                    throw undefined;
                  } catch (newPath) {
                    {
                      newPath = path.push(x);
                      $__0.observe($__0.valFromPath(x, val), newPath);
                      $__0.op('add', newPath, val[$traceurRuntime.toProperty(x)]);
                    }
                  }
                }
              }
            }
          }
          for (var $x in r) {
            try {
              throw undefined;
            } catch (old) {
              try {
                throw undefined;
              } catch (newPath) {
                try {
                  throw undefined;
                } catch (x) {
                  {
                    x = $x;
                    newPath = path.push(x);
                    old = o(x);
                    if (old.$$observer) {
                      old.$$observer.close();
                    }
                    $__0.op('remove', newPath);
                  }
                }
              }
            }
          }
          for (var $x in c) {
            try {
              throw undefined;
            } catch (newPath) {
              try {
                throw undefined;
              } catch (x) {
                {
                  x = $x;
                  newPath = path.push(x);
                  $__0.op('replace', newPath, val[$traceurRuntime.toProperty(x)]);
                }
              }
            }
          }
        }));
      }
    }, {});
    return StorageFactory;
  }).service('storage', function(StorageFactory) {
    return new StorageFactory;
  });
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkB0cmFjZXVyL2dlbmVyYXRlZC9UZW1wbGF0ZVBhcnNlci82IiwiQHRyYWNldXIvZ2VuZXJhdGVkL1RlbXBsYXRlUGFyc2VyLzUiLCJzdG9yYWdlL3N0b3JhZ2UuanMiLCJAdHJhY2V1ci9nZW5lcmF0ZWQvVGVtcGxhdGVQYXJzZXIvNyIsIkB0cmFjZXVyL2dlbmVyYXRlZC9UZW1wbGF0ZVBhcnNlci84IiwiQHRyYWNldXIvZ2VuZXJhdGVkL1RlbXBsYXRlUGFyc2VyLzkiLCJAdHJhY2V1ci9nZW5lcmF0ZWQvVGVtcGxhdGVQYXJzZXIvMTEiLCJAdHJhY2V1ci9nZW5lcmF0ZWQvVGVtcGxhdGVQYXJzZXIvMTAiLCJAdHJhY2V1ci9nZW5lcmF0ZWQvVGVtcGxhdGVQYXJzZXIvMyIsIkB0cmFjZXVyL2dlbmVyYXRlZC9UZW1wbGF0ZVBhcnNlci8xIiwiQHRyYWNldXIvZ2VuZXJhdGVkL1RlbXBsYXRlUGFyc2VyLzIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsS0FBSyxBQUFDLElDQU4sVUFBUyxBQUFnQjs7QUNBekIsYUFBVyxDQUFDO0FBRVosQUFBSSxJQUFBLENBQUEsS0FBSSxFQUFJO0FBQ1YsV0FBTyxDQUFHLFVBQVUsSUFBRyxDQUFHO0FBQ3hCLFdBQU8sQ0FBQSxJQUFHLEtBQUssQUFBQyxDQUFDLEdBQUUsQ0FBQyxDQUFDO0lBQ3ZCO0FBQ0Esb0JBQWdCLENBQUcsVUFBVSxHQUFFLENBQUc7QUFDaEMsV0FBTyxDQUFBLE9BQU0sU0FBUyxBQUFDLENBQUMsT0FBTSxPQUFPLEFBQUMsQ0FBQyxHQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzlDO0FBQUEsRUFDRixDQUFBO2lCQUVlLENBQUEsT0FBTSxPQUFPLEFBQUMsQ0FBQyxhQUFZLENBQUcsR0FBQyxDQUFDLFFBQ3RDLEFBQUMsQ0FBQyxnQkFBZSxDQUFHLFVBQVUsVUFBUyxDQUFHLENBQUEsT0FBTSxDQUFHLENBQUEsUUFBTztBQ1puRSxBQUFJLE1BQUEsaUJEYUEsU0FBTSxlQUFhLENBRU4s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Q0FBRyxVQUFVLGNBQWEsQ0FBRztBQUM1QyxTQUFPLElBQUksZUFBYSxDQUFDO0VBQzNCLENBQUM7QU1wTEg7QUNBQSxnQkFBd0I7QUFBRSx1QkFBd0I7SUFBRTtBQ0FwRCxhQUFTLENBQUcsS0FBRztBQUFBLEdGQVE7QVBFbkIsQ0RGdUMsQ0FBQztBRXFMNUMiLCJmaWxlIjoic3RvcmFnZS9zdG9yYWdlLmpzIiwic291cmNlUm9vdCI6Ii4uIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKCRfX3BsYWNlaG9sZGVyX18wLCAkX19wbGFjZWhvbGRlcl9fMSk7IiwiZnVuY3Rpb24oJF9fcGxhY2Vob2xkZXJfXzApIHtcbiAgICAgICRfX3BsYWNlaG9sZGVyX18xXG4gICAgfSIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgdXRpbHMgPSB7XG4gIEpTT05QYXRoOiBmdW5jdGlvbiAocGF0aCkge1xuICAgIHJldHVybiBwYXRoLmpvaW4oJy8nKTtcbiAgfSxcbiAgZ2V0SlNPTlBhdGNoVmFsdWU6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICByZXR1cm4gYW5ndWxhci5mcm9tSnNvbihhbmd1bGFyLnRvSnNvbih2YWwpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBhbmd1bGFyLm1vZHVsZSgnYm9iLnN0b3JhZ2UnLCBbXSlcbiAgLmZhY3RvcnkoJ1N0b3JhZ2VGYWN0b3J5JywgZnVuY3Rpb24gKCRyb290U2NvcGUsICR3aW5kb3csICR0aW1lb3V0KSB7XG4gICAgY2xhc3MgU3RvcmFnZUZhY3Rvcnkge1xuXG4gICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5zdG9yZSA9IHt9O1xuICAgICAgICB2YXIgcGF0aCA9IEltbXV0YWJsZS5WZWN0b3IoKTtcbiAgICAgICAgdGhpcy5vcGVyYXRpb25zID0gW107XG5cbiAgICAgICAgLypcbiAgICAgICAgdmFyIHNhdmVkT3BlcmF0aW9ucyA9ICR3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3NhdmVkLW9wZXJhdGlvbnMnKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBzYXZlZE9wZXJhdGlvbnMgPSBKU09OLnBhcnNlKHNhdmVkT3BlcmF0aW9ucyk7XG4gICAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShzYXZlZE9wZXJhdGlvbnMpKSB7XG4gICAgICAgICAgICB0aGlzLm9wZXJhdGlvbnMgPSBzYXZlZE9wZXJhdGlvbnM7XG4gICAgICAgICAgICB0aGlzLmFwcGx5KHNhdmVkT3BlcmF0aW9ucyk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoKGUpIHt9XG4gICAgICAgICovXG5cbiAgICAgICAgdmFyIHNhdmVkRGF0YSA9ICR3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3NhdmVkLWRhdGEnKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBzYXZlZERhdGEgPSBKU09OLnBhcnNlKHNhdmVkRGF0YSk7XG4gICAgICAgICAgaWYgKHNhdmVkRGF0YSkge1xuICAgICAgICAgICAgdGhpcy5zdG9yZSA9IGFuZ3VsYXIuZXh0ZW5kKHRoaXMuc3RvcmUsIHNhdmVkRGF0YSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoKGUpIHt9XG5cbiAgICAgICAgdGhpcy5vYnNlcnZlKHRoaXMuc3RvcmUsIHBhdGgucHVzaCgpKTtcblxuICAgICAgICB0aGlzLnNhdmVUb0xvY2FsU3RvcmFnZSA9IF8udGhyb3R0bGUoKCkgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdzYXZpbmcnKTtcbiAgICAgICAgICAkd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKCdzYXZlZC1vcGVyYXRpb25zJywgYW5ndWxhci50b0pzb24odGhpcy5vcGVyYXRpb25zKSk7XG4gICAgICAgICAgJHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnc2F2ZWQtZGF0YScsIGFuZ3VsYXIudG9Kc29uKHRoaXMuc3RvcmUpKTtcbiAgICAgICAgfSwgMjUwKTtcbiAgICAgIH1cblxuXG4gICAgICBvYnNlcnZlKHZhbCwgcGF0aCkge1xuICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KHZhbCkpIHtcbiAgICAgICAgICB0aGlzLm9ic2VydmVBcnJheSh2YWwsIHBhdGgpO1xuICAgICAgICAgIGlmICh2YWwubGVuZ3RoKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHZhbC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgdGhpcy5vYnNlcnZlKHZhbFtpXSwgcGF0aC5wdXNoKGkpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICB0aGlzLm9ic2VydmVPYmplY3QodmFsLCBwYXRoKTtcbiAgICAgICAgICBmb3IgKGxldCB4IGluIHZhbCkge1xuICAgICAgICAgICAgaWYgKHZhbC5oYXNPd25Qcm9wZXJ0eSh4KSAmJiB4LnN1YnN0cigwLCAyKSAhPT0gJyQkJykge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZ29ubmEgZG8gc3R1ZmYgb24gJywgeCk7XG4gICAgICAgICAgICAgIHRoaXMub2JzZXJ2ZSh2YWxbeF0sIHBhdGgucHVzaCh4KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMub2JzZXJ2ZVBhdGgodmFsLCBwYXRoKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBvYnNlcnZlUGF0aCh2YWwsIHBhdGgpIHtcbiAgICAgICAgLy90aHJvdyAnb2JzZXJ2ZSBwYXRoIG5vdCBpbXBsZW1lbnRlZCc7XG4gICAgICB9XG5cbiAgICAgIHZhbEZyb21QYXRoKHBhdGgsIG9iaikge1xuICAgICAgICB2YXIgcCA9IFBhdGguZ2V0KHBhdGgpO1xuICAgICAgICB2YXIgdmFsID0gcC5nZXRWYWx1ZUZyb20ob2JqKTtcbiAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgIH1cblxuICAgICAgYXBwbHkocGF0Y2hlcykge1xuICAgICAgICBjb25zb2xlLmxvZygnYXBwbHknLCBKU09OLnN0cmluZ2lmeShwYXRjaGVzKSk7XG4gICAgICAgIGpzb25wYXRjaC5hcHBseSh0aGlzLnN0b3JlLCBwYXRjaGVzKTtcbiAgICAgIH1cblxuICAgICAgb3AodHlwZSwgcGF0aCwgdmFsKSB7XG4gICAgICAgIGlmIChhbmd1bGFyLmlzQXJyYXkodmFsKSAmJiB2YWwubGVuZ3RoID4gMCAmJiB0eXBlID09ICdhZGQnKSB7XG4gICAgICAgICAgdGhpcy5vcCh0eXBlLCBwYXRoLCBbXSk7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSB2YWwubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLm9wKHR5cGUsIHBhdGgucHVzaChpKSwgdmFsW2ldKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcGF0aCA9ICcvJyArIHBhdGgudG9KUygpLmpvaW4oJy8nKTtcblxuICAgICAgICB2YXIgb3AgPSB7fTtcbiAgICAgICAgb3Aub3AgPSB0eXBlO1xuICAgICAgICBvcC5wYXRoID0gcGF0aDtcbiAgICAgICAgaWYgKHZhbCkge1xuICAgICAgICAgIG9wLnZhbHVlID0gdXRpbHMuZ2V0SlNPTlBhdGNoVmFsdWUodmFsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub3BlcmF0aW9ucy5wdXNoKG9wKTtcbiAgICAgICAgdGhpcy5zYXZlVG9Mb2NhbFN0b3JhZ2UoKTtcbiAgICAgICAgY29uc29sZS5sb2cob3ApO1xuICAgICAgfVxuXG4gICAgICBvYnNlcnZlQXJyYXkodmFsLCBwYXRoKSB7XG4gICAgICAgIHZhciBvYnNlcnZlciA9IG5ldyBBcnJheU9ic2VydmVyKHZhbCk7XG4gICAgICAgIGlmICh2YWwuJCRvYnNlcnZlcikge1xuICAgICAgICAgIHZhbC4kJG9ic2VydmVyLmNsb3NlKCk7XG4gICAgICAgICAgZGVsZXRlIHZhbC4kJG9ic2VydmVyO1xuICAgICAgICB9XG4gICAgICAgIHZhbC4kJG9ic2VydmVyID0gb2JzZXJ2ZXI7XG4gICAgICAgIG9ic2VydmVyLm9wZW4oKHNwbGljZXMpID0+IHtcbiAgICAgICAgICBzcGxpY2VzLmZvckVhY2gocyA9PiB7XG4gICAgICAgICAgICBpZiAocy5hZGRlZENvdW50ID4gMCkge1xuICAgICAgICAgICAgICBsZXQgaSA9IHMuaW5kZXg7XG4gICAgICAgICAgICAgIHZhbFxuICAgICAgICAgICAgICAgIC5zbGljZShzLmluZGV4LCBzLmluZGV4ICsgcy5hZGRlZENvdW50KVxuICAgICAgICAgICAgICAgIC5mb3JFYWNoKG8gPT4ge1xuICAgICAgICAgICAgICAgICAgbGV0IG5ld1BhdGggPSBwYXRoLnB1c2goaSk7XG4gICAgICAgICAgICAgICAgICB0aGlzLm9ic2VydmUobywgbmV3UGF0aCk7XG4gICAgICAgICAgICAgICAgICB0aGlzLm9wKCdhZGQnLCBuZXdQYXRoLCBvKTtcbiAgICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHMucmVtb3ZlZCkge1xuICAgICAgICAgICAgICBsZXQgaSA9IHMuaW5kZXg7XG4gICAgICAgICAgICAgIHMucmVtb3ZlZC5mb3JFYWNoKHggPT4ge1xuICAgICAgICAgICAgICAgIGxldCBuZXdQYXRoID0gcGF0aC5wdXNoKGkpO1xuICAgICAgICAgICAgICAgIGlmICh4LiQkb2JzZXJ2ZXIpIHtcbiAgICAgICAgICAgICAgICAgIHguJCRvYnNlcnZlci5jbG9zZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLm9wKCdyZW1vdmUnLCBuZXdQYXRoKTtcbiAgICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIHRoaXMub2JzZXJ2ZSh2YWwsIHBhdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBvYnNlcnZlT2JqZWN0KHZhbCwgcGF0aCkge1xuICAgICAgICB2YXIgb2JzZXJ2ZXIgPSBuZXcgT2JqZWN0T2JzZXJ2ZXIodmFsKTtcbiAgICAgICAgaWYgKHZhbC4kJG9ic2VydmVyKSB7XG4gICAgICAgICAgdmFsLiQkb2JzZXJ2ZXIuY2xvc2UoKTtcbiAgICAgICAgICBkZWxldGUgdmFsLiQkb2JzZXJ2ZXI7XG4gICAgICAgIH1cbiAgICAgICAgdmFsLiQkb2JzZXJ2ZXIgPSBvYnNlcnZlcjtcbiAgICAgICAgb2JzZXJ2ZXIub3BlbigoYSwgciwgYywgbykgPT4ge1xuICAgICAgICAgIGZvciAobGV0IHggaW4gYSkge1xuICAgICAgICAgICAgaWYgKHZhbC5oYXNPd25Qcm9wZXJ0eSh4KSAmJiB4LnN1YnN0cigwLCAyKSAhPT0gJyQkJykge1xuICAgICAgICAgICAgICBsZXQgbmV3UGF0aCA9IHBhdGgucHVzaCh4KTtcbiAgICAgICAgICAgICAgdGhpcy5vYnNlcnZlKHRoaXMudmFsRnJvbVBhdGgoeCwgdmFsKSwgbmV3UGF0aCk7XG4gICAgICAgICAgICAgIHRoaXMub3AoJ2FkZCcsIG5ld1BhdGgsIHZhbFt4XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGZvciAobGV0IHggaW4gcikge1xuICAgICAgICAgICAgbGV0IG5ld1BhdGggPSBwYXRoLnB1c2goeCk7XG4gICAgICAgICAgICBsZXQgb2xkID0gbyh4KTtcbiAgICAgICAgICAgIGlmIChvbGQuJCRvYnNlcnZlcikge1xuICAgICAgICAgICAgICBvbGQuJCRvYnNlcnZlci5jbG9zZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5vcCgncmVtb3ZlJywgbmV3UGF0aCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGZvciAobGV0IHggaW4gYykge1xuICAgICAgICAgICAgbGV0IG5ld1BhdGggPSBwYXRoLnB1c2goeCk7XG4gICAgICAgICAgICB0aGlzLm9wKCdyZXBsYWNlJywgbmV3UGF0aCwgdmFsW3hdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgfVxuXG4gICAgcmV0dXJuIFN0b3JhZ2VGYWN0b3J5O1xuICB9KVxuICAuc2VydmljZSgnc3RvcmFnZScsIGZ1bmN0aW9uIChTdG9yYWdlRmFjdG9yeSkge1xuICAgIHJldHVybiBuZXcgU3RvcmFnZUZhY3Rvcnk7XG4gIH0pO1xuIiwidmFyICRfX3BsYWNlaG9sZGVyX18wID0gJF9fcGxhY2Vob2xkZXJfXzEiLCIoJHRyYWNldXJSdW50aW1lLmNyZWF0ZUNsYXNzKSgkX19wbGFjZWhvbGRlcl9fMCwgJF9fcGxhY2Vob2xkZXJfXzEsICRfX3BsYWNlaG9sZGVyX18yKSIsIiRfX3BsYWNlaG9sZGVyX18wWyR0cmFjZXVyUnVudGltZS50b1Byb3BlcnR5KCRfX3BsYWNlaG9sZGVyX18xKV0iLCIodHlwZW9mICRfX3BsYWNlaG9sZGVyX18wID09PSAndW5kZWZpbmVkJyA/XG4gICAgICAgICAgJ3VuZGVmaW5lZCcgOiAkX19wbGFjZWhvbGRlcl9fMSkiLCIkdHJhY2V1clJ1bnRpbWUudHlwZW9mKCRfX3BsYWNlaG9sZGVyX18wKSIsInJldHVybiAkX19wbGFjZWhvbGRlcl9fMCIsImdldCAkX19wbGFjZWhvbGRlcl9fMCgpIHsgcmV0dXJuICRfX3BsYWNlaG9sZGVyX18xOyB9IiwiX19lc01vZHVsZTogdHJ1ZSJdfQ==