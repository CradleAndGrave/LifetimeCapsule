angular.module('app')
.controller('HomeCtrl', function($scope, Caps) {

  this.profile = false;
  this.view = true;
  this.editingViewCapsule = false;
  this.editedCapsuleName = '';
  this.capsuleId = 0;
  this.capsuleToEdit = {};
  this.currentCap = [];
  this.named = false;

  this.toggleToProfile = () => {
    this.profile = !this.profile;
  }

  $scope.items = [
    'All',
    'Buried',
    'In Progress'
  ];

  $scope.status = {
    isopen: false
  };

  $scope.toggled = function(open) {
    $log.log('Dropdown is now: ', open);
  };

  $scope.toggleDropdown = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.status.isopen = !$scope.status.isopen;
  };

  $scope.appendToEl = angular.element(document.querySelector('#dropdown-long-content'));
  this.handleFilter = function(event) {
    Caps.filterCaps(event.target.id, $scope.$ctrl.userId, (err, res) => {
      if (!err) {
        $scope.$ctrl.capsData = res;
      } else {
        throw new Error(err);
      }
    });
  }

  this.editCapsule = (capsule) => {
    this.capsuleToEdit = capsule;
    this.capsuleToEdit.contents = capsule.contents;
    this.capsuleId = capsule._id;
    this.capsuleName = capsule.capsuleName;
    this.editingViewCapsule = true;
    this.editedCapsuleName = capsule.capsuleName;
    this.named = true;
    this.view = false;
    this.profile = false;
  }

  this.toggleToCreate = () => {
    if (this.view) {
      Caps.createCap($scope.$ctrl.userId,(err, capsuleId) => {
        if (err) {
          console.log('You dun screwed up');
          throw new Error(err);
        } else {
          this.capsuleName = '';
          this.capsuleId = capsuleId;
          this.capsuleToEdit = {};
          this.named = false;
          this.view = false;
          this.profile = false;
        }
      })
    } else {
      var saveProgress = confirm('Are you sure you want to start a new capsule?');
      if(saveProgress) {
        Caps.createCap($scope.$ctrl.userId,(err, capsuleId) => {
          if (err) {
            console.log('You dun screwed up');
            throw new Error(err);
          } else {
            this.named = false;
            this.capsuleName = '';
            this.currentCap = [];
            this.capsuleId = capsuleId;
            this.capsuleToEdit = {};
            this.named = false;
            this.view = false;
            this.editingViewCapsule = false;
            this.profile = false;
          }
        })
      }
    }
  }


  this.toggleToView = function(buried) {
    this.profile = false;
    // check if the page is in "view" or "create"
    if(!this.view) {

      if (!buried) {
        var saveProgress = confirm('Are you sure you want to leave this capsule?\nWe\'ll save this one if you do.');
      } else {
        var saveProgress = true;
      }

      if (saveProgress) {
        Caps.filterCaps('all', $scope.$ctrl.userId, (err, res) => {
          if (!err) {
            $scope.$ctrl.capsData = res;
          } else {
            throw new Error(err);
          }
        });
        this.capsuleName = '';
        this.currentCap = [];
        this.editingViewCapsule = false;
        this.named = false;
        this.view = true;
      }
    } else {
      Caps.filterCaps('all', $scope.$ctrl.userId, (err, res) => {
        if (!err) {
          $scope.$ctrl.capsData = res;
        } else {
          throw new Error(err);
        }
      });
    }
  }.bind(this)


  this.deleteCap = (capId, index) => {
    var saveProgress = confirm('Remove this capsule?...forever??');

    if(saveProgress) {
      
      var capObj = {capsuleId: capId}
      Caps.deleteCap(capObj, (err, res) => {
        if (err) {
          throw new Error(err);
        } else {
          this.toggleToView(true);
        }
      });
    }
  }

  this.logOut = () => {
    $scope.$ctrl.signedIn = false;
  }

})
.component('homePage', {
  controller: 'HomeCtrl',
  bindings: {
    userId: '<',
    initialData: '=',
    first: '=',
    editedCapsuleName: '<',
    signedIn: '=',
    email: '<',
    capsData: '='
  },
  templateUrl: '../templates/home.html'
})
