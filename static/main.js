$(document).ready(function() {
  var searchData = [
    {
      _id: "5a68c772506c003f9a3ae607",
      age: 21,
      company: "GORGANIC",
      phone: "+1 (864) 485-3625",
      address: "332 Engert Avenue, Cutter, Virginia, 218",
      about: "Cillum mollit nostrud irure veniam. Aliqua eiusmod officia ut nulla qui aliquip eu proident enim adipisicing ut laboris aliquip. Culpa est aliqua velit eu enim magna pariatur quis do elit culpa cupidatat. Voluptate sint nulla veniam esse incididunt veniam nisi amet exercitation eiusmod minim sunt laborum magna."
    },
    {
      _id: "5a68c772bfbde82458d2adc4",
      age: 32,
      company: "COMVEYOR",
      phone: "+1 (833) 445-2684",
      address: "702 Clara Street, Masthope, Illinois, 7357",
      about: "Duis enim eu anim mollit irure sit fugiat aliquip voluptate labore. Aliqua nisi pariatur dolore esse laboris. Deserunt ex voluptate irure labore incididunt consectetur amet et nisi ad irure proident incididunt. Nisi incididunt minim reprehenderit veniam non incididunt mollit. Ea et cupidatat enim in et laboris consequat adipisicing anim. Elit minim deserunt officia ad minim anim est dolor in amet et."
    },
    {
      _id: "5a68c7728094777dc27be238",
      age: 36,
      company: "INDEXIA",
      phone: "+1 (917) 489-2144",
      address: "108 Dewitt Avenue, Singer, Arizona, 6928",
      about: "Ex irure sunt veniam irure mollit exercitation enim officia nisi nisi eu eiusmod amet. Cupidatat commodo non laboris consequat proident dolore officia consectetur eiusmod. Eiusmod incididunt eu sunt eu deserunt culpa sint consectetur aliquip eu. Occaecat aute sit consectetur minim et cillum adipisicing pariatur amet qui ipsum. Ad reprehenderit eiusmod cillum ullamco. Minim incididunt duis consectetur sunt voluptate nulla. Duis exercitation sit aliquip nostrud fugiat cillum."
    },
    {
      _id: "5a68c7736eb4c41a1f5012a8",
      age: 32,
      company: "ZORK",
      phone: "+1 (912) 495-2293",
      address: "207 Highland Boulevard, Camas, New York, 8764",
      about: "Exercitation elit in minim fugiat sint mollit anim aliquip minim. Ea adipisicing non pariatur eu aliquip anim ad cillum nulla sint magna non Lorem. Consequat consectetur consectetur incididunt minim excepteur adipisicing nulla cillum. Nostrud adipisicing cupidatat enim tempor exercitation ut fugiat nostrud laborum. Duis sint labore ex id consectetur laborum occaecat qui dolor. Lorem nisi cupidatat sunt aliqua veniam voluptate veniam laboris duis ullamco nostrud amet."
    },
    {
      _id: "5a68c773053677cdc584fe98",
      age: 28,
      company: "COREPAN",
      phone: "+1 (844) 534-2385",
      address: "507 Lyme Avenue, Hayden, Kansas, 272",
      about: "In aliqua id quis magna ipsum laboris. Quis occaecat sunt ullamco magna non dolore tempor. Cupidatat duis laborum fugiat voluptate. Et incididunt dolore officia commodo duis voluptate laborum et est minim duis velit quis. Sit nostrud aliqua occaecat tempor elit laboris sunt aliqua nulla mollit aute tempor anim."
    },
    {
      _id: "5a68c773b4fdc19a7a7eb1ce",
      age: 36,
      company: "RECRISYS",
      phone: "+1 (833) 482-2158",
      address: "436 Canda Avenue, Goodville, Hawaii, 4613",
      about: "Ea anim adipisicing sint sunt fugiat non veniam adipisicing velit aliqua ex mollit occaecat. Pariatur sint quis amet ad et. In veniam exercitation aute deserunt anim. Ut est sit eiusmod deserunt nostrud do fugiat laboris."
    }
  ];

  // data

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
    var result = searchData.filter(function(ele) {
      console.log(ele.company);
      return ele.company.toLowerCase() === inputVal.toLowerCase();
    });
    if(result.length === 1){
      can_submit = false;
      $("#help-text").show();
      $("#searchInput")
        .addClass("has-error")
        .removeClass("has-success");
    }
    else {
      can_submit = true;
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

  $.get('/data')
    .done(function(data){
      searchData = data.data;
      console.log(searchData);
    })
    .fail(function(err){
      alert("Please check your internet connection or contact the site admin.");
    });
});
