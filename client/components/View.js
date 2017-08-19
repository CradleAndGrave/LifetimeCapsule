angular.module('app')
.controller('ViewCtrl', function($scope, Caps) {

  $scope.items = [
    'View',
    'Edit',
    'Delete'
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

  this.viewDetails = (cap) => {
  	// Work around for rendering dynamic content to modal by using jquery
    console.log(cap)
    $( ".close" ).click(function() {
      this.viewCapsule(cap)
    });

  	$('.modalBodyBorder').on('click', function(event) {
  		$scope.chosenIndex = event.currentTarget.id;
      Caps.fetchFiles(cap.contents[$scope.chosenIndex].file[0], (fileUrl) => {
        $scope.content = fileUrl;
      }).then(() => { 
  	    $('#viewModal').html(
  	       `<div class="modal-dialog" id="viewModalDialog">
  			  <div class="modal-content" id="viewModalContent"> 
  			    <div class="modal-header">
  			      <button type="button" class="btn close" data-dismiss="modal">&times;</button>
  			      <h4 class="modal-title">${cap.capsuleName}</h4>
  			    </div>
  			    <div class="viewModal-body" id="viewModalBody">
  		     
       	    	  <h4>${cap.contents[$scope.chosenIndex].name}</h4>
       	    	  <p id="viewDetails">${cap.contents[$scope.chosenIndex].input}</p>
  			        <img class="mediaFile" src="${$scope.content}" />
  			    </div>
  			  </div>
  			</div>`
  	    );
      })
  	})
  }

  this.viewCapsule = (cap) => {
  	// Work around for rendering dynamic content to modal by using jquery
    console.log('cap', cap)
    $('#viewModal').html(
    	`<div class="modal-dialog" id="viewModalDialog">
		  <div class="modal-content" id="viewModalContent"> 
		    <div class="modal-header">
		      <button type="button" class="btn close" data-dismiss="modal">&times;</button>
		      <h4 class="modal-title">${cap.capsuleName}</h4>
		    </div>
		    <div class="viewModal-body" id="viewModalBody">
		    </div>
		  </div>
		</div>`
    );

    for (var i = 0; i < cap.contents.length; i++) {
        $('.viewModal-body').append(
        	  `<div class="modalBodyBorder" id="${i}">
  	    	  <h4>${cap.contents[i].name}</h4>
  	    	  <p class="momentoInput">${cap.contents[i].input}</p>
      	  </div>`
        );
      // })
    }

  }
})
.component('viewPage', {
  controller: 'ViewCtrl',

  bindings: {
  	cap: '<',
  	editCapsule: '=',
  	init: '<',
  	deleteCap: '=',
  	index: '<'
  },

  templateUrl: '../templates/view.html'
})