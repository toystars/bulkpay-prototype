'use strict';

var authRoute = require('../api/user/index');
var codeRoute = require('../api/auth-code/index');
var businessRoute = require('../api/business/index');
var businessUnitRoute = require('../api/business-unit/index');
var historyRoute = require('../api/history/index');
var divisionRoute = require('../api/division/index');
var departmentRoute = require('../api/department/index');
var positionRoute = require('../api/position/index');
var payTypeRoute = require('../api/pay-type/index');
var payGroupRoute = require('../api/pay-group/index');
var payGradeRoute = require('../api/pay-grade/index');
var employeeRoute = require('../api/employee/index');
var taxRoute = require('../api/tax/index');
var pensionRoute = require('../api/pension/index');
var pensionManagerRoute = require('../api/pension-manager/index');
var payRunRoute = require('../api/payrun/index');
var payRollRoute = require('../api/payroll/index');

module.exports = function(app, passport) {
  authRoute(app, passport);
  codeRoute(app);
  businessRoute(app);
  businessUnitRoute(app);
  historyRoute(app);
  divisionRoute(app);
  departmentRoute(app);
  positionRoute(app);
  payTypeRoute(app);
  payGroupRoute(app);
  payGradeRoute(app);
  employeeRoute(app);
  taxRoute(app);
  pensionRoute(app);
  pensionManagerRoute(app);
  payRunRoute(app);
  payRollRoute(app);
};