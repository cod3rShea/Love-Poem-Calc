// Declare global variables
let firstName = "";
let secondName = "";
let percentage = "";
let calcQueryURL = "https://love-calculator.p.rapidapi.com/getPercentage?fname=" + firstName + "&sname=" + secondName;
let settings = "";
let poemURL = "https://thundercomb-poetry-db-v1.p.rapidapi.com/linecount/" + percentage;
let poemArray = [];
let poemToDisplay = [];

// This function grabs the values from the name inputs and assigns them to variables, which are inserted into the query URL.
const loveName = () => {
	reset();
	firstName = $("#f-name").val().trim();
	secondName = $("#l-name").val().trim();

	// It makes a GET request to get your "compatibility percentage" which is displayed on screen.
	calcQueryURL = "https://love-calculator.p.rapidapi.com/getPercentage?fname=" + firstName + "&sname=" + secondName;
	const settings = {
		"async": true,
		"crossDomain": true,
		"url": calcQueryURL,
		"method": "GET",
		"headers": {
			"x-rapidapi-key": "2ab08fa6e5msh6a35a71dc08653cp1d8de2jsn9999fa7a0623",
			"x-rapidapi-host": "love-calculator.p.rapidapi.com"
		}
	};

	// We then call the functions to display the poem.
	$.ajax(settings).done(function (response) {
		percentage = response.percentage;
		$("#percentage").text("Your crush percentage is: " + percentage + "%");
		poemLines();
	});
}

// Here we put the percentage you were given into the poem API query URL to return a poem with the same linecount.
function poemLines(loveName) {

	let poemURL = "https://poetrydb.org/linecount/" + percentage;
	
	jQuery.get( `${poemURL}`, (data) => {
		for (let i = 0; i < data.length; i++) {
			if (data[i].linecount === percentage) {
				poemArray.push(data[i])
			}
		}

		// We then generate a random number to pull a random poem so you're not given the same poem if you hit "go" again.
		let number = Math.floor(Math.random() * poemArray.length);
		let poemToDisplay = poemArray[number].lines;
		$(".loader").remove();

		// After we choose a poem, we loop through to display the poem on the page.
		for (i = 0; i < poemToDisplay.length; i++) {
			let poemDiv = $("<p>").text(poemToDisplay[i]);
			$("#poem").append(poemDiv);
		}

		// This displays the author and title
		$("#title").text(poemArray[number].title);
		$("#author").text("Author : " + poemArray[number].author);
	}).fail(function() {
		throw Error( "error" );
	});
}

// This blanks out both text fields, the percentage variable, and the array of correct linecount poems.
// Clearing the names and percentage is mostly for convenience, but the array would stack with the old poems if not cleared.
const reset = () => {
	firstName = "";
	secondName = "";
	percentage = "";
	poemArray = [];
}

// On document load, the button will be disabled.
$(document).ready(function () {

	$("#go").prop("disabled", true);

	// On a 'keyup' of either text field, it checks for a value in both text fields.
	$(".name").keyup(function() {
		area = $(this);

		// If neither of them are blank, it enables the button. If one of them goes blank again, it will re-disable.
		if ($("#f-name").val() == "" || $("#l-name").val() == "") {
			$("#go").prop("disabled", true);
		} else {
			$("#go").prop("disabled", false);
		}
	})

	// On click function to start the process and the loader.
	$("#go").on("click", function (event) {
		event.preventDefault();
		loveName();
		$("#title").empty();
		$("#author").empty();
		$("#poem").empty();
		$("#poem").append("<div class='loader'>");
	});
});

// Typed.js functionality. We give it what to type out as well as a speed and some parameters for backspace and looping.
let typed = new Typed('h1', {
	strings: ["LOVE CALCULATOR ^1000 AND ^1000 POEM GENERATOR"],
	typeSpeed: 100,
	backSpeed: 100,
	smartBackspace: false,
	loop: false
  });
