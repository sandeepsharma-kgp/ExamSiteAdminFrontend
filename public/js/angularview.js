var app = angular.module("myApp", []);

app.controller('MainCtrl', ['$scope','$filter', function ($scope, $filter){

  $scope.subjects = [
    { subjectID: 1, 'subjectName': 'Physics'},
    { subjectID: 2, 'subjectName': 'Chemistry'},
    { subjectID: 3, 'subjectName': 'English'}
  ];

  $scope.errorMessage = false;

  $scope.addRow = function () {
    var maxID = (Math.max.apply(null, $scope.subjects.map(x => x.id)) || 0) + 1;

    if(!!$scope.subjects.find(x => x.subjectName === $scope.selectedsubject.subjectName) {
      //alert('already eixsts');
      $scope.errorMessage = true;
      return;
    }
    $scope.subjects.push({'subjectName': $scope.selectedsubject.subjectName, subjectID: maxID});
    $scope.selectedsubject.subjectName = '';
  }

  $scope.remove = function () {
    var newDataList = [];
    $scope.selectedAll = false;
    angular.forEach($scope.subjects, function(selected) {
      if(!selected.selected) {
        newDataList.push(selected);
      }
      $scope.subjects = newDataList;
      $scope.selectedsubject.subjectName = '';
    });
  }

  $scope.checkAll = function () {
    $scope.selectedAll = false;
    if(!$scope.selectedAll) {
      $scope.selectedAll = true;
    } else {
      $scope.selectedAll = false;
    }
    angular.forEach($scope.subjects, function(subject){
      subject.selected = $scope.selectedAll;
    });
  }
  $scope.singlesubjectSelected = false;

  $scope.setSelectedsubject = function (subject){
    if($scope.subjects.filter(x => x.selected).length > 1){
      $scope.selectedsubject = null;
      $scope.singlesubjectSelected = false;
    } else {
      $scope.selectedsubject = angular.copy($scope.subjects.find(x => x.selected));
      $scope.singlesubjectSelected = !!$scope.selectedsubject;
    }
  }

  $scope.edit = function() {
    if(!!$scope.subjects.find(x => x.subjectName === $scope.selectedsubject.subjectName)) {
      //alert('already eixsts');
      $scope.errorMessage = true;
      return;
    }
    var subjectToEdit = $scope.subjects.find(x => x.id === $scope.selectedsubject.subjectID);
    subjectToEdit .subjectName = $scope.selectedsubject.subjectName;
  }

}]);
