$(document).ready(function() {

  var searchData = [];
  
  $.get("/data")
    .done(function(data) {
      searchData = data;
      $("#campaign_name").autocomplete({
        source: convertLabels(searchData)
      });
    })
    .fail(function(err) {
      alert("Please check your internet connection or contact the site admin.");
    });

  var fields = ["name", "details", "start", "end", "uniqueId"];
  var is_submitting = false;
  var can_submit = true;
  $("#campaign_uniqueDiv").hide();
  $("#help-text").hide();

  function getOrEmptyFormData(parent_ele_id, value) {
    if (value === undefined) {
      var formData = {};
      $("#campaign_uniqueId").val(ID());
      fields.forEach(function(ele, id) {
        formData[parent_ele_id + ele] = $("#" + parent_ele_id + ele).val();
      });
      submitForm(formData);
    } else if (value === "") {
      fields.forEach(function(ele, id) {
        $("#" + parent_ele_id + ele).val(undefined);
      });
    }
  }

  $(".datepicker").datepicker({
    changeMonth: true,
    changeYear: true,
    dateFormat: "yy-mm-dd",
    yearRange: "-1:"
  });

  function submitForm(formData) {
    if (formData !== undefined) {
      if (validateData() && can_submit) {
        $("#campaign_uniqueDiv").hide();
        var progressbar = $("#progress-bar");
        progressbar.progressbar({ value: false });
        $.post("/", formData).done(function(data) {
          if (data.statusCode === "400") {
            is_submitting = false;
            progressbar.progressbar("destroy");
            alert(
              "Sorry, the submission failed. Please contact the site admin"
            );
            setTimeout(function() {
              location.reload();
            }, 3000);
          } else {
            is_submitting = false;
            progressbar.progressbar("destroy");
            alert("The form submission was successful");
            $("#campaign_uniqueDiv").show();
            $("#campaign_uniqueId").val(data.uniqueId);
          }
        });
      } else {
        $("#campaign_uniqueDiv").hide();
        is_submitting = false;
      }
    }
  }

  $("#campaign_name").focusout(function() {
    var inputVal = $(this).val();
    var result = [];
    if(!searchData) {
      alert("Couldn't load data. Please check your internet connection");
      can_submit = false;
      return;
    }

    result = searchData.filter(function(ele) {
      return ele.campaignname.toLowerCase() === inputVal.toLowerCase();
    });


    if(result.length >= 1){
      can_submit = false;
      $("#campaign_submit").prop("disabled", true);
      $("#help-text").show();
      $("#searchInput")
        .addClass("has-error")
        .removeClass("has-success");
    }
    else {
      can_submit = true;
      $("#campaign_submit").prop("disabled", false);
      $("#help-text").hide();
      $("#searchInput")
        .addClass("has-success")
        .removeClass("has-error");
    }
  });



  function ID() {
    Math.seedrandom();
    return Math.random()
      .toString(36)
      .toUpperCase()
      .substr(2);
  }

  function validateData() {
    var common_id = "#campaign_";
    var is_valid = true;

    fields.forEach(function(ele, id) {
      if (!$(common_id + ele).val()) {
        is_valid = false;
      }
    });
    if (!validateDate()) {
      is_valid = false;
    }
    return is_valid;
  }

  function validateDate() {
    var start_date = new Date($("#campaign_start").val());
    var end_date = new Date($("#campaign_end").val());
    var today = new Date();
    if (today < start_date) {
      alert("Campaign's start date can't be today or in the future!");
      return false;
    } else if (end_date < start_date) {
      alert("Campaign's end date can't be before the start date!");
      return false;
    }

    return true;
  }

  $("form[name='campaign_form']").submit(function(e) {
    e.preventDefault();
    if (!is_submitting) {
      is_submitting = true;
      getOrEmptyFormData("campaign_");
      $("#campaign_uniqueId").val(ID());
    } else {
      alert("The form is already submitting");
    }
  });

  $("#campaign_empty").click(function() {
    $("#campaign_uniqueDiv").hide();
    getOrEmptyFormData("campaign_", "");
  });

  function convertLabels(searchData) {
    return searchData.map(function(ele){
      return ele.campaignname;
    });
  }

});
