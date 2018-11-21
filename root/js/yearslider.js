$(document).ready(function() {
	currentYearChanged();
});


$("#slider").on("input change", function() { 
	currentYearChanged();
});

function currentYearChanged() {
   	var slider = document.getElementById("slider");
	var output = document.getElementById("output");
	output.innerHTML = slider.value; // Display the default slider value

	// Update the current slider value (each time you drag the slider handle)
	slider.oninput = function() {
	    output.innerHTML = this.value;
	}

	// Filtrer les données avec l'année choisie 
	changeCurrentYear(slider.value);
}