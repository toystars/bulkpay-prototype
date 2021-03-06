bulkPay.controller('CreateBusinessCtrl', ['$scope', 'AuthSvc', '$cookies', '$state', '$http', function ($scope, AuthSvc, $cookies, $state, $http) {

  AuthSvc.isLoggedIn(function (status) {
    if (!status) {
      $state.go('login');
    }
  });

  $scope.$parent.inView = 'New Business';
  var userId = AuthSvc.getCurrentUser()._id;
  $scope.currencies = [];
  $scope.currency = '';

  /*
   * Initializing data and helper functions
   * */
  var resetBusiness = function () {
    $scope.newBusiness = {
      name: '',
      address: '',
      city: '',
      state: '',
      website: '',
      country: 'Nigeria',
      industry: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      creatorId: userId,
      creator: userId
    };
  };
  $scope.options = {
    placeholder: "Choose One",
    allowClear: true
  };

  var getCurrencies = function () {
    $http.get('data/currencies.json').success(function (currencies) {
      var keys = Object.keys(currencies);
      _.each(keys, function (key) {
        if (currencies.hasOwnProperty(key)) {
          $scope.currencies.push({
            currency: key,
            format: currencies[key].format,
            symbol: currencies[key].symbol
          });
        }
      });
    }).error(function (error) {
      console.log(error);
    });
  };


  /*
   * Main logic
   * */

  resetBusiness();
  getCurrencies();

  $scope.save = function () {
    /*
     * Validation to be handled later
     * */
    $http.post('/api/businesses', $scope.newBusiness).success(function (business) {
      if (business) {
        swal("Success", "Business created successfully.", "success");
        resetBusiness();
        AuthSvc.refreshUser();
      }
    }).error(function (error) {
      console.log(error);
    });
  };

  $scope.getCurrencyString = function (currency) {
    return currency.currency + ' - ' + currency.symbol;
  };

  $scope.changeCurrency = function () {
    $scope.newBusiness.currency = _.find($scope.currencies, function (currency) {
      return currency.currency === $scope.currency;
    });
  };


  /*
   * Data
   * */
  $scope.states = ['Abia State',
    'Adamawa State',
    'Akwa Ibom State',
    'Anambra State',
    'Bauchi State',
    'Bayelsa State',
    'Benue State',
    'Borno State',
    'Cross River State',
    'Delta State',
    'Ebonyi State',
    'Edo State',
    'Ekiti State',
    'Enugu State',
    'Federal Capital Territory',
    'Gombe State',
    'Imo State',
    'Jigawa State',
    'Kaduna State',
    'Kano State',
    'Katsina State',
    'Kebbi State',
    'Kogi State',
    'Kwara State',
    'Lagos State',
    'Nasarawa State',
    'Niger State',
    'Ogun State',
    'Ondo State',
    'Osun State',
    'Oyo State',
    'Plateau State',
    'Rivers State',
    'Sokoto State',
    'Taraba State',
    'Yobe State',
    'Zamfara State'
  ];

  $scope.industries = ['Accommodations',
    'Accounting',
    'Advertising',
    'Aerospace',
    'Agriculture & Agribusiness',
    'Air Transportation',
    'Apparel & Accessories',
    'Auto',
    'Banking',
    'Beauty & Cosmetics',
    'Biotechnology',
    'Chemical',
    'Communications',
    'Computer',
    'Construction',
    'Consulting',
    'Consumer Products',
    'Education',
    'Electronics',
    'Employment',
    'Energy',
    'Entertainment & Recreation',
    'Fashion',
    'Financial Services',
    'Food & Beverage',
    'Health',
    'Information',
    'Information Technology',
    'Technology',
    'Telecommunications',
    'Video Game',
    'Web Services'
  ];

}]);