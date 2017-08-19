angular.module('app')
.controller('CreateCtrl', function($scope, Caps, Upload, $timeout, $sce, $http) {

  this.capsuleId = $scope.$ctrl.capsuleId;
  this.capsuleToEdit = $scope.$ctrl.capsuleToEdit;
  this.capIndex = null;
  this.capsuleNameModel = '';
  $scope.momentoName = '';
  $scope.input = '';
  $scope.date = '';
  $scope.recipient = '';
  $scope.content;
  $scope.fileName = undefined;

  this.saveCapsule = (capObj, newMomento) => {
    Caps.saveCap(capObj, (err, res) => {
      if (err) {
        if(newMomento){
          this.currentCap.shift();
        }
        throw new Error(err);
      } else {
        $scope.momentoName = '';
        $scope.input = '';
      } 
    });
  }

  this.capsuleChange = (input, addMomento) => {
    console.log($scope.$ctrl.capsuleId)
    $scope.showDetails = false;
    if ($scope.$ctrl.editingViewCapsule) {
      if(addMomento) {
        this.capsuleToEdit.contents.unshift({input: input || '', name: $scope.momentoName || '', file: [$scope.fileId]});
      }
      var capObj = {capsuleName: $scope.$ctrl.capsuleName, capsuleId: this.capsuleId, capsuleContent: this.capsuleToEdit.contents};
      this.saveCapsule(capObj, false);
    } else {
      if(addMomento) {
        this.currentCap.unshift({input: input || '', name: $scope.momentoName || '', file: [$scope.fileId]});
      }
      var capObj = {capsuleName: $scope.$ctrl.capsuleName, capsuleId: this.capsuleId, capsuleContent: this.currentCap};
      this.saveCapsule(capObj, true);
    }
  }

  this.setCapsuleName = (name) => {
    var capName;
    if(name) {
      capName = name;
    } else {
      capName = document.getElementById('capsuleInput').value;
    }
    if(capName !== null && capName !== undefined && capName !== '') {
      $scope.$ctrl.capsuleName = capName;
      $scope.$ctrl.editedCapsuleName = capName;
      $scope.$ctrl.named = true;
      this.capsuleChange(null, false);
    } else {
      this.named = false;
    }
  }

  this.getIndex = (index) => {
    this.capIndex = index;
  }
  
  this.editMomento = (input, momentoName) => {
    console.log(this.capIndex, input, momentoName);
    $scope.showDetails = false;
    $scope.momentoName = momentoName;
    if ($scope.$ctrl.editingViewCapsule) {
      $scope.$ctrl.capsuleToEdit.contents[this.capIndex] = {input: input || '', name: $scope.momentoName || '', file: [$scope.fileId]};
      var capObj = {capsuleName: $scope.$ctrl.editedCapsuleName, capsuleId: $scope.$ctrl.capsuleId, capsuleContent: $scope.$ctrl.capsuleToEdit.contents};
      this.saveCapsule(capObj, false);
    } else {
      this.currentCap[this.capIndex] = {input: input || '', name: $scope.momentoName || '', file: [$scope.fileId]};
      var capObj = {capsuleName: $scope.$ctrl.capsuleName, capsuleId: this.capsuleId, capsuleContent: this.currentCap};
      this.saveCapsule(capObj, false);
    }
    this.capIndex = null;
  }

  this.deleteMomento = (index) => {
    var deletThis = confirm('Are you sure you want to delete this momento?');
    if(deletThis) {
      if ($scope.$ctrl.editingViewCapsule) {
        $scope.$ctrl.capsuleToEdit.contents.splice(index, 1);
        var capObj = {capsuleName: $scope.$ctrl.editedCapsuleName, capsuleId: $scope.$ctrl.capsuleId, capsuleContent: $scope.$ctrl.capsuleToEdit.contents};
        this.saveCapsule(capObj, false);
      } else {
        this.currentCap.splice(index, 1);
        var capObj = {capsuleName: $scope.$ctrl.capsuleName, capsuleId: this.capsuleId, capsuleContent: this.currentCap};
        this.saveCapsule(capObj, false);
      }
    }
  }

  this.saveForLater = () => {
    var saveProgress = confirm('Save any changes and view your capsules?');
    if(saveProgress) {
      if ($scope.$ctrl.editingViewCapsule) {
        var capObj = {capsuleName: $scope.$ctrl.editedCapsuleName, capsuleId: $scope.$ctrl.capsuleId, capsuleContent: $scope.$ctrl.capsuleToEdit.contents};
        this.saveCapsule(capObj, false);
      } else {
        var capObj = {capsuleName: $scope.$ctrl.capsuleName, capsuleId: this.capsuleId, capsuleContent: this.currentCap};
        this.saveCapsule(capObj, false);
      }
      $scope.momentoName = '';
      $scope.input = '';
      $scope.$ctrl.viewToggle(true);
    }
  }

  this.bury = (date, recipient) => {

    var capObj;
    if ($scope.$ctrl.editingViewCapsule) {

      capObj = {
        capsuleId: this.capsuleId,
        capsuleContent: this.capsuleToEdit.contents,
        unearthDate: date,
        recipient: recipient
      };

    } else {
      capObj = {
        capsuleId: this.capsuleId,
        capsuleContent: this.currentCap,
        unearthDate: date,
        recipient: recipient
      };
    }

    Caps.bury(capObj, (err, res) => {
      if (err) {
        this.currentCap.shift();
        throw new Error(err);
      } else {
        $scope.$ctrl.view = true;
        $scope.$ctrl.capsuleName = '';
        $scope.input = '';
        $scope.date = '';
        $scope.recipient = '';
        this.currentCap = [];
        $scope.$ctrl.viewToggle(true);
     }
    });
  }

  this.momentoDetails = (momento) => {
    // Work around for rendering dynamic content to modal by using jquery
    Caps.fetchFiles(momento.file[0], (fileUrl) => {
      $scope.content = fileUrl;
    }).then(() => {    
      $('#viewMomentoModal').html(
        `<div class="modal-dialog" id="viewModalDialog">
        <div class="modal-content" id="viewModalContent"> 
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title" id="momentoDetails">${$scope.$ctrl.capsuleName}</h4>
          </div>
          <div class="viewModal-body" id="viewModalBody">
            <div id="momentoDetails"> 

              <h4>${momento.name}</h4>
              <p id="viewDetails">${momento.input}</p>
              <img class="mediaFile" src="${$scope.content}" />
            </div>
          </div>
        </div>
      </div>`
      );
    })

  }

  this.uploadFiles = function(file, errFiles) {
      $scope.f = file;
      $scope.errFile = errFiles && errFiles[0];
      $scope.showDetails = true;
      if (file) {

          file.upload = Upload.upload({
            url: `http://127.0.0.1:3000/upload/${$scope.$ctrl.capsuleId}`,
            method: 'POST',
            file: file
          }).then((response)=> {
            console.log(response)
            $scope.fileId = response.data
          })

          file.upload = Upload.upload({
              url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
              data: {file: file}
          });

          file.upload.then(function (response) {
              $timeout(function () {
                  console.log('res', response)
                  file.result = response.data;
              });
          }, function (response) {
              if (response.status > 0)
                  $scope.errorMsg = response.status + ': ' + response.data;
          }, function (evt) {
              file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
              file.progress = `${file.progress}%`
          });
      }   
  }

})
.component('createPage', {
  controller: 'CreateCtrl',

  bindings: {
    capsuleId: '<',
    capsuleToEdit: '<',
    editingViewCapsule: '<',
    view: '=',
    named: '=',
    editedCapsuleName: '=',
    viewToggle: '<',
    currentCap: '=', 
    capsuleName: '=',
    deleteCap: '=',
  },

 templateUrl: '../templates/create.html'

})
