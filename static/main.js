

$(document).ready(function () {

let fields = [ "name", "details", "start", "end", "uniqueId" ]


$("#campaign_uniqueId").val(ID());

function getOrEmptyFormData (parent_ele_id, value) {

	if (value === undefined) {
		let formData = {};
		fields.forEach(function (ele, id) {
			formData[parent_ele_id + ele] = $("#"+parent_ele_id + ele).val();
			console.log($("#"+parent_ele_id + ele).val());
		});
		console.log(formData);
		submitForm(formData);		
	}
	else if (value === '') {
		fields.forEach(function (ele, id) {
			$("#"+parent_ele_id + ele).val(undefined);
		});	
	}
}

		$(".datepicker").datepicker({
	      changeMonth: true,
	      changeYear: true,
	      dateFormat: "yy-mm-dd",
	      yearRange: "-1:"
	    });



function submitForm (formData) {
	if (formData !== undefined) {
		if (validateData()){
			$.post('/', formData)
				.done(function (data) {
					getOrEmptyFormData("campaign_", '');
					console.log("Done", data);
			});
		}
	}	
}

function ID () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  Math.seedrandom();
  return Math.random().toString(36).toUpperCase().substr(2);
};

function validateData () {
	let common_id = "#campaign_";
	let is_valid = true;

	fields.forEach(function (ele, id) {
		// removeP(common_id+ele);
		console.log(common_id+ele);
		if ($(common_id+ele).val() === '' || $(common_id+ele).val() === undefined) {
			// addP(common_id+ele);
			is_valid = false;
		}
	});
	if (!validateDate()){
		is_valid = false;
	}
	return is_valid;
}

function validateDate () {
	const start_date = new Date($("#campaign_start").val());
	const end_date = new Date($("#campaign_end").val());
	const today = new Date();

	if (today.toDateString() <== start_date.toDateString()) {
		alert("Campaign's start date can't be today or in the future!");
		return false;
	}
	else if (end_date < start_date){
		alert("Campaign's end date can't be before the start date!");
		return false;		
	}

	return true;
}

	$("form[name='campaign_form']").submit(function (e) {
		e.preventDefault();
		getOrEmptyFormData("campaign_");
	});


});