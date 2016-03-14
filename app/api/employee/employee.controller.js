/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/employees              ->  index
 * POST    /api/employees              ->  create
 * GET     /api/employees/:id          ->  show
 * PUT     /api/employees/:id          ->  update
 * DELETE  /api/employees/:id          ->  destroy
 */

'use strict';

require('./employee.model.js');
require('../pay-grade/pay-grade.model.js');
require('../pay-group/pay-group.model.js');
require('../tax/tax.model.js');
require('../pension/pension.model.js');
var mongoose = require('mongoose'),
  Employee = mongoose.model('Employee'),
  PayGrade = mongoose.model('PayGrade'),
  PayGroup = mongoose.model('PayGroup'),
  Tax = mongoose.model('Tax'),
  Pension = mongoose.model('Pension'),
  _ = require('underscore'),
  crudHelper = require('../../helpers/crud.js');


/**
 * Get all employees
 */
exports.index = function (req, res) {
  Employee.find({}, function (error, employees) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (employees) {
      crudHelper.respondWithResult(res, null, employees);
    }
  });
};


/**
 * Get last employee created
 */
exports.getLast = function (req, res) {
  Employee.findOne({businessId: req.params.id}, function (error, employee) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (employee) {
      crudHelper.respondWithResult(res, null, employee);
    }
  });
};


/**
 * Get all employees per business
 */
exports.employees = function (req, res) {
  Employee.find({businessId: req.params.id}, function (error, employees) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (employees) {
      crudHelper.respondWithResult(res, null, employees);
    }
  });
};


/**
 * Get employees for pay run
 */
exports.getPayRunEmployees = function (req, res) {
  Employee.find({businessId: req.params.businessId, status: 'Active'}, function (error, employees) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (employees) {
      PayGrade.find({businessId: req.params.businessId}, function (error, payGrades) {
        if (payGrades) {
          _.each(employees, function (employee) {
            var payGrade = _.find(payGrades, function (payGrade) {
              return employee.payGradeId === payGrade.toObject()._id.toString();
            });
            if (payGrade) {
              employee.payGrade = payGrade;
            }
          });
          Tax.find({ businessId: req.params.businessId }, function (error, taxes) {
            if (taxes) {
              _.each(employees, function (employee) {
                var taxRule = _.find(taxes, function (tax) {
                  return employee.payGrade.taxRuleId === tax.toObject()._id.toString();
                });
                if (taxRule) {
                  employee.taxRule = taxRule;
                }
              });
              Pension.find({ businessId: req.params.businessId }, function (error, pensions) {
                if (pensions) {
                  _.each(employees, function (employee) {
                    var pension = _.find(pensions, function (pension) {
                      return employee.payGrade.pensionRuleId === pension.toObject()._id.toString();
                    });
                    if (pension) {
                      employee.pensionRule = pension;
                    }
                  });
                  PayGroup.find({ businessId: req.params.businessId }, function (error, payGroups) {
                    if (payGroups) {
                      crudHelper.respondWithResult(res, null, {
                        employees: employees,
                        payGroups: payGroups
                      });
                    } else {
                      crudHelper.handleError(res, null, error);
                    }
                  });
                } else {
                  crudHelper.handleError(res, null, error);
                }
              });
            } else {
              crudHelper.handleError(res, null, error);
            }
          });
        } else {
          crudHelper.handleError(res, null, error);
        }
      });
    }
  });
};


/*
 * Get filtered employees
 * */
exports.filteredEmployees = function (req, res) {
  var orArray = [];
  var filterObject = req.body;
  var keys = Object.keys(filterObject);
  if (keys.length > 0) {
    for (var x = 0; x < keys.length; x++) {
      if (filterObject.hasOwnProperty(keys[x])) {
        if (filterObject[keys[x]] && filterObject[keys[x]] !== '') {
          var object = {};
          object[keys[x]] = filterObject[keys[x]];
          orArray.push(object);
        }
      }
    }
  } else {
    orArray.push({});
  }
  var selector = {
    $and: [{
      businessId: req.params.id
    }, {
      $or: orArray
    }]
  };
  Employee.find(selector, function (error, employees) {
    if (error) {
      crudHelper.handleError(res, null, error);
    }
    if (employees) {
      crudHelper.respondWithResult(res, null, employees);
    }
  });
};

/*
 * Create new employee
 * */
exports.create = function (req, res) {
  var newEmployee = new Employee(req.body);
  newEmployee.save(function (error, employee) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.respondWithResult(res, 201, employee);
    }
  });
};

/*
 * Fetch an employee
 * */
exports.show = function (req, res) {
  Employee.findOne({_id: req.params.id}, function (error, employee) {
    if (error) {
      crudHelper.handleError(res, null, error);
    } else if (employee) {
      crudHelper.respondWithResult(res, null, employee);
    } else {
      crudHelper.handleError(res, null, {message: 'Employee not found!'});
    }
  });
};


/*
 * Fetch by pay group id
 * */
exports.getByPayGroup = function (req, res) {
  Employee.find({payGroupId: req.params.payGroupId}, function (error, employees) {
    if (error) {
      crudHelper.handleError(res, null, error);
    } else if (employees) {
      crudHelper.respondWithResult(res, null, employees);
    } else {
      crudHelper.handleError(res, null, {message: 'No employee found!'});
    }
  });
};


/*
 * Fetch by position
 * */
exports.getPositionEmployees = function (req, res) {
  Employee.find({positionId: req.params.positionId}, function (error, employees) {
    if (error) {
      crudHelper.handleError(res, null, error);
    } else if (employees) {
      crudHelper.respondWithResult(res, null, employees);
    } else {
      crudHelper.handleError(res, null, {message: 'No employee found!'});
    }
  });
};

/*
 * Save employee photo
 * */
exports.savePhoto = function (req, res) {
  res.status(200).json(req.files.file);
};

/*
 * Update single employee
 * */
exports.updateEmployee = function (req, res) {
  Employee.findOne({_id: req.params.id}, function (error, employee) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    } else {
      crudHelper.handleEntityNotFound(req, res, employee, true);
    }
  });
};

exports.destroy = function (req, res) {
  Employee.findOne({_id: req.params.id}, function (error, employee) {
    if (error) {
      crudHelper.handleError(res, 400, error);
    }
    if (employee) {
      crudHelper.handleEntityNotFound(req, res, employee, false);
    }
  });
};