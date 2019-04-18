  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyB10PFJ-XUduvZAh_uGJw13Q95yd1fVrSI",
    authDomain: "train-scheduler-f45df.firebaseapp.com",
    databaseURL: "https://train-scheduler-f45df.firebaseio.com",
    projectId: "train-scheduler-f45df",
    storageBucket: "train-scheduler-f45df.appspot.com",
    messagingSenderId: "271885869952"
  };
  firebase.initializeApp(config);
//Create database variable to create reference to firebase.database().
 var database = firebase.database();

 var minutesTillTrain = 0;

//Show and update current time. Using setInterval method to update time.
function displayRealTime() {
setInterval(function(){
    $('#current-time').html(moment().format('hh:mm A'))
  }, 1000);
}
displayRealTime();
var Row = "";
var Key = "";
 //Click event for the submit button. When user clicks Submit button to add a train to the schedule...
 document.querySelector("#submit-button").addEventListener("click", function(event) {

	// Prevent form from submitting
	event.preventDefault();

	//Grab the values that the user enters in the text boxes in the "Add A train" section. Store the values in variables.
	var trainName = $("#train-name").val().trim();
	var destination = $("#destination").val().trim();
	var firstTrainTime = $("#first-train-time").val().trim();
	var trainFrequency = $("#frequency").val().trim();

	//Form validation for user input values. To add a train, all fields are required.
	//Check that all fields are filled out.
	if (trainName === "" || destination === "" || firstTrainTime === "" || trainFrequency === ""){
		$("#not-military-time").empty();
		$("#missing-field").html("ALL fields are required to add a train to the schedule.");
		return false;		
    }
    	//Form validation for user input values. To add a train, all fields are required.
	//Check that all fields are filled out.
	if (trainName === "" || destination === "" || firstTrainTime === "" || trainFrequency === ""){
		$("#not-military-time").empty();
		$("#missing-field").html("ALL fields are required to add a train to the schedule.");
		return false;		
	}

	//Check to make sure that there are no null values in the form.
	else if (trainName === null || destination === null || firstTrainTime === null || trainFrequency === null){
		$("#not-military-time").empty();
		$("#not-a-number").empty();
		$("#missing-field").html("ALL fields are required to add a train to the schedule.");
		return false;		
	}

	//Check that the user enters the first train time as military time.
	else if (firstTrainTime.length !== 5 || firstTrainTime.substring(2,3)!== ":") {
		$("#missing-field").empty();
		$("#not-a-number").empty();
		$("#not-military-time").html("Time must be in military format: HH:mm. For example, 15:00.");
		return false;
	}

	//Check that the user enters a number for the Frequency value.
	else if (isNaN(trainFrequency)) {
    	$("#missing-field").empty();
    	$("#not-military-time").empty();
    	$("#not-a-number").html("Not a number. Enter a number (in minutes).");
    	return false;
	}

	//If form is valid, perform time calculations and add train to the current schedule.
	else {
		$("#not-military-time").empty();
		$("#missing-field").empty();
		$("#not-a-number").empty();

		//Moment JS math caclulations to determine train next arrival time and the number of minutes away from destination.
		// First Time (pushed back 1 year to make sure it comes before current time)
	    var firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
	    console.log(firstTimeConverted);

	    // Current Time
	    var currentTime = moment();
	    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

	    // Difference between the times
	    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
	    console.log("DIFFERENCE IN TIME: " + diffTime);

	    // Time apart (remainder)
	    var tRemainder = diffTime % trainFrequency;
	    console.log(tRemainder);

	    // Minute Until Train
	    var tMinutesTillTrain = trainFrequency - tRemainder;
	    console.log("MINUTES TILL TRAIN: " + MinutesTillTrain);

	    // Next Train
	    var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm A");
	    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

		//Create local temporary object for holding train data
		var newTrain = {
			trainName: trainName,
			destination: destination,
			firstTrainTime: firstTrainTime,
			trainFrequency: trainFrequency,
			nextTrain: nextTrain,
			tMinutesTillTrain: tMinutesTillTrain,
			currentTime: currentTime.format("hh:mm A")
		};

		//Save/upload train data to the database.
        database.ref().push(newTrain);

		//Remove the text from the form boxes after user presses the add to schedule button.
		$("#train-name").val("");
		$("#destination").val("");
		$("#first-train-time").val("");
		$("#frequency").val("");
	}
});