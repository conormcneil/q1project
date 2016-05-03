$(document).ready(function() {
  console.log("I'm ready!");

  var states = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Deleware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];
  var statesAbbr = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];

  // Use function to display states
  var stateForm = $('.stateForm');
  var displayStates = function(arr) {
    for (var i = 0; i < arr.length; i++) {
      stateForm.append("<option value='" + statesAbbr[i] + "'>" + arr[i] + "</option>");
    }
  }
  displayStates(states);

  $("button").click(function() {
    $("#resultView").html('');
    var $state = $(".stateForm").val();
    var chamber = $("#chamberSearch").val();
    var counter = 0;
    var searchChamber = "https://api.open.fec.gov/v1/candidates/?page=1&sort=state&candidate_status=C&candidate_status=C&state=" + $state + "&office=" + chamber + "&per_page=100&api_key=CmRwot11VrUfsEUf9IYGRJSNNacFhOzjQP5ULx7f";

    $.ajax({
      url: searchChamber,
      method: 'GET',
      origin: 'http://localhost:8080',
      success: function(data) {
        console.log(data);
        $("#resultView").append("<p style='font-size: 1.5em'>Official Candidates: 2016</p>")
        for (var i = 0; i < data.results.length; i++) {
          $("#resultView").append('<p id="' + data.results[i].candidate_id + '">' + data.results[i].name + '</p>');
          $.ajax({
            url: "https://api.open.fec.gov/v1/candidate/" + data.results[i].candidate_id + "/committees/?sort=name&per_page=100&page=1&api_key=CmRwot11VrUfsEUf9IYGRJSNNacFhOzjQP5ULx7f",
            method: 'GET',
            origin: 'http://localhost:8080',
            success: function(moreData) {
              console.log(moreData.results);
              console.log(moreData.results.length);
              for (var i = 0; i < moreData.results.length; i++) {
                console.log(moreData.results[i].committee_id);
                $.ajax({
                  url: "https://api.open.fec.gov/v1/committee/" + moreData.results[i].committee_id + "/filings/?page=1&sort=-receipt_date&cycle=2016&report_year=2016&per_page=100&api_key=CmRwot11VrUfsEUf9IYGRJSNNacFhOzjQP5ULx7f",
                  method: 'GET',
                  origin: 'http://localhost:8080',
                  success: function(bestData) {
                    if (bestData.results.length > 0) {
                      console.log(bestData.results);
                      console.log(bestData.results.length);
                      for (var i = 0; i < bestData.results.length; i++) {
                        console.log(bestData.results[i].total_disbursements);
                        counter += bestData.results[i].total_disbursements;
                      }
                    } else {
                      console.log('no filing data for this committee');
                    }
                    console.log(counter);
                    var counterFixed = counter.toFixed(2);
                    $("#resultView").prepend($("#committeeView").html("$" + counterFixed));
                  }
                })
              }
            }
          });
        }
      }
    });
  })
})
