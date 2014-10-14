"use strict";

var utils = {
  JSONPath: function (path) {
    return path.join('/');
  },
  getJSONPatchValue: function (val) {
    return angular.fromJson(angular.toJson(val));
  }
}

export default angular.module('bob.storage', [])
  .factory('StorageFactory', function ($rootScope, $window, $timeout) {
    class StorageFactory {

      constructor() {
        this.store = {};
        var path = Immutable.Vector();
        this.operations = [];

        /*
        var savedOperations = $window.localStorage.getItem('saved-operations');
        try {
          savedOperations = JSON.parse(savedOperations);
          if (angular.isArray(savedOperations)) {
            this.operations = savedOperations;
            this.apply(savedOperations);
          }
        } catch(e) {}
        */

        var savedData = $window.localStorage.getItem('saved-data');
        try {
          savedData = JSON.parse(savedData);
          if (savedData) {
            this.store = angular.extend(this.store, savedData);
          }
        } catch(e) {}

        this.observe(this.store, path.push());

        this.saveToLocalStorage = _.throttle(() => {
          console.log('saving');
          $window.localStorage.setItem('saved-operations', angular.toJson(this.operations));
          $window.localStorage.setItem('saved-data', angular.toJson(this.store));
        }, 250);
      }


      observe(val, path) {
        if (angular.isArray(val)) {
          this.observeArray(val, path);
          if (val.length) {
            for (let i = 0, l = val.length; i < l; i++) {
              this.observe(val[i], path.push(i));
            }
          }
        } else if (typeof val === 'object') {
          this.observeObject(val, path);
          for (let x in val) {
            if (val.hasOwnProperty(x) && x.substr(0, 2) !== '$$') {
              console.log('gonna do stuff on ', x);
              this.observe(val[x], path.push(x));
            }
          }
        } else {
          this.observePath(val, path);
        }
      }

      observePath(val, path) {
        //throw 'observe path not implemented';
      }

      valFromPath(path, obj) {
        var p = Path.get(path);
        var val = p.getValueFrom(obj);
        return val;
      }

      apply(patches) {
        console.log('apply', JSON.stringify(patches));
        jsonpatch.apply(this.store, patches);
      }

      op(type, path, val) {
        if (angular.isArray(val) && val.length > 0 && type == 'add') {
          this.op(type, path, []);
          for (let i = 0, l = val.length; i < l; i++) {
            this.op(type, path.push(i), val[i]);
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
      }

      observeArray(val, path) {
        var observer = new ArrayObserver(val);
        if (val.$$observer) {
          val.$$observer.close();
          delete val.$$observer;
        }
        val.$$observer = observer;
        observer.open((splices) => {
          splices.forEach(s => {
            if (s.addedCount > 0) {
              let i = s.index;
              val
                .slice(s.index, s.index + s.addedCount)
                .forEach(o => {
                  let newPath = path.push(i);
                  this.observe(o, newPath);
                  this.op('add', newPath, o);
                  i++;
                })
            }
            if (s.removed) {
              let i = s.index;
              s.removed.forEach(x => {
                let newPath = path.push(i);
                if (x.$$observer) {
                  x.$$observer.close();
                }
                this.op('remove', newPath);
                i++;
              })
              this.observe(val, path);
            }
          })
        });
      }

      observeObject(val, path) {
        var observer = new ObjectObserver(val);
        if (val.$$observer) {
          val.$$observer.close();
          delete val.$$observer;
        }
        val.$$observer = observer;
        observer.open((a, r, c, o) => {
          for (let x in a) {
            if (val.hasOwnProperty(x) && x.substr(0, 2) !== '$$') {
              let newPath = path.push(x);
              this.observe(this.valFromPath(x, val), newPath);
              this.op('add', newPath, val[x]);
            }
          }
          for (let x in r) {
            let newPath = path.push(x);
            let old = o(x);
            if (old.$$observer) {
              old.$$observer.close();
            }
            this.op('remove', newPath);
          }
          for (let x in c) {
            let newPath = path.push(x);
            this.op('replace', newPath, val[x]);
          }
        });
      }

    }

    return StorageFactory;
  })
  .service('storage', function (StorageFactory) {
    return new StorageFactory;
  });
