$(document).ready(function() {
  console.log("I'm ready!");
  var apiKey = 'CmRwot11VrUfsEUf9IYGRJSNNacFhOzjQP5ULx7f';
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
    $("#incumbentView").html('');
    var $state = $(".stateForm").val();
    var chamber = $("#chamberSearch").val();
    var counter = 0;


    // Get Incumbent Filing Info
    $.ajax({
      url: "https://api.open.fec.gov/v1/candidates/?page=1&sort=state&candidate_status=C&incumbent_challenge=I&state=" + $state + "&office=" + chamber + "&per_page=100&api_key=" + apiKey,
      method: 'GET',
      origin: 'http://localhost:8080',
      success: function(data) {
        $("#incumbentView").append("<p style='font-size: 1.5em'>Incumbent Candidate(s): 2016</p>")
        for (var i = 0; i < data.results.length; i++) {
          $("#incumbentView").append('<p id="' + data.results[i].candidate_id + '">' + data.results[i].name + '</p>');
          $.ajax({
            url: "https://api.open.fec.gov/v1/candidate/" + data.results[i].candidate_id + "/committees/?sort=name&per_page=100&page=1&api_key=" + apiKey,
            method: 'GET',
            origin: 'http://localhost:8080',
            success: function(moreData) {
              for (var i = 0; i < moreData.results.length; i++) {
                $.ajax({
                  url: "https://api.open.fec.gov/v1/committee/" + moreData.results[i].committee_id + "/filings/?page=1&sort=-receipt_date&cycle=2016&report_year=2016&per_page=100&api_key=" + apiKey,
                  method: 'GET',
                  origin: 'http://localhost:8080',
                  success: function(bestData) {
                    if (bestData.results.length > 0) {
                      for (var i = 0; i < bestData.results.length; i++) {
                        counter += bestData.results[i].total_disbursements;
                      }
                    } else {
                      console.log('no filing data for this committee');
                    }
                    var counterFixed = counter.toFixed(2);
                    $("#incumbentView").prepend($("#incumbentFinance").html("$" + counterFixed));
                  }
                })
              }
            }
          });
        }
      }
    }); // End ajax req: 1; incumbents

    // Get Challengers Filing Info
    $.ajax({
      url: "https://api.open.fec.gov/v1/candidates/?page=1&sort=state&candidate_status=C&incumbent_challenge=C&state=" + $state + "&office=" + chamber + "&per_page=100&api_key=" + apiKey,
      method: 'GET',
      origin: 'http://localhost:8080',
      success: function(data) {
        $("#challengerView").append("<p style='font-size: 1.5em'>Challenger(s): 2016</p>")
        for (var i = 0; i < data.results.length; i++) {
          $("#challengerView").append('<p id="' + data.results[i].candidate_id + '">' + data.results[i].name + '</p>');
          $.ajax({
            url: "https://api.open.fec.gov/v1/candidate/" + data.results[i].candidate_id + "/committees/?sort=name&per_page=100&page=1&api_key=" + apiKey,
            method: 'GET',
            origin: 'http://localhost:8080',
            success: function(moreData) {
              for (var i = 0; i < moreData.results.length; i++) {
                $.ajax({
                  url: "https://api.open.fec.gov/v1/committee/" + moreData.results[i].committee_id + "/filings/?page=1&sort=-receipt_date&cycle=2016&report_year=2016&per_page=100&api_key=" + apiKey,
                  method: 'GET',
                  origin: 'http://localhost:8080',
                  success: function(bestData) {
                    if (bestData.results.length > 0) {
                      for (var i = 0; i < bestData.results.length; i++) {
                        counter += bestData.results[i].total_disbursements;
                      }
                    } else {
                      console.log('no filing data for this committee');
                    }
                    var counterFixed = counter.toFixed(2);
                    $("#challengerView").prepend($("#challengerFinance").html("$" + counterFixed));
                  }
                })
              }
            }
          });
        }
      }
    }); // End ajax req: 2; challengers
  })
})
