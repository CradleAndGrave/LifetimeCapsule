angular.module('app')
.controller('ViewCtrl', function($scope, Caps, $http) {

  this.viewDetails = (cap) => {
  	// Work around for rendering dynamic content to modal by using jquery
  	$('.modalBodyBorder').on('click', function(event) {
  		$scope.chosenIndex = event.currentTarget.id;

      $http.get(`http://127.0.0.1:3000/download/${cap.contents[$scope.chosenIndex].file[0]}`,     
      {responseType:'arraybuffer'})
        .success(function (response) {
          console.log('Response from download', response)
          var file = new Blob([(response)], {type: 'images/*'});
          var fileURL = URL.createObjectURL(file);
          $scope.content = fileURL;
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