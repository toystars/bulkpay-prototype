
var _ = require('underscore');

var diff = function (a, b, objectKey, reference) {

  var log = [];
  var logObject = {};

  /*if (typeof b === 'object' && Object.keys(b).length === 0) {
    log.push({
      event: 'deleted',
      referenceKey: '',
      referenceId: ''
    });
    return log;
  }*/

  if (typeof a !== 'object' && typeof b !== 'object') {
    if (a !== b) {
      log.push({
        event: 'changed'
      });
      return log;
    }
  } else {

    var object = {};
    // get keys for base object
    var keys = Object.keys(a);

    // loop through
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (b.hasOwnProperty(key)) {

        if (key === '_id' || key === 'createdAt') {
          continue;
        }

        if (a[key] === b[key]) {

        } else {
          // check for array type
          if (a[key] instanceof Array || b[key] instanceof Array) {

            if (a[key].length > 0 && typeof a[key][0] !== 'object') {
              var aString = a[key].join(', ');
              var bString = b[key].join(', ');
              console.log(bString);
              if (aString !== bString) {
                log.push({
                  event: 'changed',
                  referenceKey: key,
                  referenceId: reference ? reference : '',
                  oldValue: aString,
                  newValue: bString
                });
              }
            } else {
              // check for removal and presence
              for (var x = 0; x < a[key].length; x++) {

                object = find(a[key][x], b[key]);

                if (object) {
                  log = log.concat(diff(a[key][x], object, key, a[key][x]._id));
                } else {
                  logObject = {
                    event: 'removed',
                    referenceKey: key + '.' + a[key][x]._id,
                    referenceId: a[key][x]._id
                  };
                  log.push(logObject);
                }

              }

              // check for addition
              for (var y = 0; y < b[key].length; y++) {

                object = find(b[key][y], a[key]);

                if (!object) {
                  log = log.concat(diff({}, b[key][y], key, b[key][y]._id));
                }


              }
            }

          } else if (typeof a[key] === 'object' || typeof b[key] === 'object') {
            // object check
            var newKey = '';
            if (objectKey) {
              newKey = objectKey + '.' + key;
            } else {
              newKey = key;
            }
            log = log.concat(diff(a[key], b[key], newKey, reference));
          } else {
            // primitive check
            if (objectKey) {
              logObject = {
                event: 'changed',
                referenceKey: objectKey + '.' + key,
                referenceId: reference ? reference : '',
                oldValue: (a[key]).toString(),
                newValue: (b[key]).toString()
              };
            } else {
              logObject = {
                event: 'changed',
                referenceKey: key,
                referenceId: reference ? reference : '',
                oldValue: (a[key]).toString(),
                newValue: (b[key]).toString()
              };
            }
            log.push(logObject);
          }
        }
      } else {
        // it has been removed then
        logObject = {
          event: 'removed',
          referenceKey: key
        };
        log.push(logObject);
      }
    }

    if (b) {
      keys = Object.keys(b);
      for (i = 0; i < keys.length; i++) {
        var bKey = keys[i];
        if (!a.hasOwnProperty(bKey)) {
          var bNewKey = '';
          if (objectKey) {
            bNewKey = objectKey + '.' + bKey;
          } else {
            bNewKey = bKey;
          }
          if (typeof b[bKey] === 'object') {
            if (b[bKey] instanceof Array) {
              if (b[bKey].length > 0 && b[bKey][0] !== 'object') {
                log.push({
                  event: 'set',
                  referenceKey: bNewKey,
                  referenceId: reference ? reference : '',
                  oldValue: '',
                  newValue: b[bKey].join(', ')
                });
              } else {
                _.each(b[bKey], function (object) {
                  log = log.concat(diff({}, object, bNewKey, reference));
                });
              }
            } else {
              log = log.concat(diff({}, b[bKey], bNewKey, reference));
            }
          } else {

            logObject = {
              event: 'set',
              referenceKey: bNewKey,
              referenceId: reference ? reference : '',
              oldValue: '',
              newValue: b[bKey] ? (b[bKey]).toString() : ''
            };
            log.push(logObject);

          }
        }
      }
    }
  }
  return log;
};


var find = function (object, array) {
  for (var i = 0; i < array.length; i++) {
    if (diff(object, array[i]).length === 0) {
      return array[i];
    }
    return null;
  }
};


exports.diff = diff;
