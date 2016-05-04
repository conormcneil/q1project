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
    var runningTotal = 0;


    // Get Incumbent Filing Info
    $.ajax({
      url: "https://api.open.fec.gov/v1/candidates/?page=1&sort=state&candidate_status=C&incumbent_challenge=I&state=" + $state + "&office=" + chamber + "&per_page=100&api_key=" + apiKey,

      method: 'GET',
      origin: 'http://localhost:8080',
      success: function(candidates) {
        console.log(candidates); // A Single array of all candidates
        // $("#incumbentView").html("<section class='tabLeft' style='font-size: 1.5em'>Incumbent(s)</section>");
        // $("#incumbentView").append("<section class='tabRight' style='font-size: 1.5em'>Expenditures</section>");
        for (var i = 0; i < candidates.results.length; i++) {
          $("#incumbentView").append("<aside class='" + candidates.results[i].party + "'>" + candidates.results[i].name + " (" + candidates.results[i].party.toLowerCase() + ")</aside>");


        // all candidate names have been appended to window, now gather committee ids for each candidate
        $.ajax({
          url: "https://api.open.fec.gov/v1/candidate/" + candidates.results[i].candidate_id + "/committees/history/2016/?sort=-cycle&per_page=20&page=1&api_key=" + apiKey,
          method: 'GET',
          origin: 'http://localhost:8080',
          success: function(committees) {
            console.log(committees.results);
            // For each committee ID, check filings for expenditures
            for (var i = 0; i < committees.results.length; i++) {
              console.log(committees.results[i].committee_id);
              $.ajax({
                url: "https://api.open.fec.gov/v1/committee/" + committees.results[i].committee_id + "/filings/?page=1&sort=-receipt_date&cycle=2016&report_year=2016&per_page=100&api_key=" + apiKey,
                method: 'GET',
                origin: 'http://localhost:8080',
                success: function(filings) {
                  var counter = 0; // Here?
                  console.log(filings.results);
                  // console.log(filings.results.length);
                  for (var i = 0; i < filings.results.length; i++) {
                    counter += filings.results[i].total_receipts;
                    console.log(filings.results[i].total_receipts);
                    console.log(counter);
                  }
                  // $("#incumbentView").append(", " + counter);
                }
              }) // end ajax
            }
          }
        }) // end ajax
                // use each committee_id to request filing info for that committee
                    // if committee_id filings show any expenditures, add them here
        }
      }
    })// End ajax 1 incumbents

    // Get Challengers Filing Info
    $.ajax({
      url: "https://api.open.fec.gov/v1/candidates/?page=1&sort=state&candidate_status=C&incumbent_challenge=C&state=" + $state + "&office=" + chamber + "&per_page=100&api_key=" + apiKey,
      method: 'GET',
      origin: 'http://localhost:8080',
      success: function(candidates) {
        console.log(candidates); // A Single array of all candidates
        // $("#challengerView").html("<section class='tabLeft' style='font-size: 1.5em'>Challenger(s)</section>");
        // $("#challengerView").append("<section class='tabRight' style='font-size: 1.5em'>Expenditures</section>");
        for (var i = 0; i < candidates.results.length; i++) {
          $("#challengerView").append("<aside class='" + candidates.results[i].party + "'>" + candidates.results[i].name + " (" + candidates.results[i].party.toLowerCase() + ")</aside>");


        // all candidate names have been appended to window, now gather committee ids for each candidate
        $.ajax({
          url: "https://api.open.fec.gov/v1/candidate/" + candidates.results[i].candidate_id + "/committees/history/2016/?sort=-cycle&per_page=20&page=1&api_key=" + apiKey,
          method: 'GET',
          origin: 'http://localhost:8080',
          success: function(committees) {
            console.log(committees.results);
            // For each committee ID, check filings for expenditures
            for (var i = 0; i < committees.results.length; i++) {
              console.log(committees.results[i].committee_id);
              $.ajax({
                url: "https://api.open.fec.gov/v1/committee/" + committees.results[i].committee_id + "/filings/?page=1&sort=-receipt_date&cycle=2016&report_year=2016&per_page=100&api_key=" + apiKey,
                method: 'GET',
                origin: 'http://localhost:8080',
                success: function(filings) {
                  var counter = 0; // Here?
                  console.log(filings.results);
                  // console.log(filings.results.length);
                  for (var i = 0; i < filings.results.length; i++) {
                    counter += filings.results[i].total_receipts;
                    console.log(filings.results[i].total_receipts);
                    console.log(counter);
                  }
                  // $("#challengerView").append(", " + counter);
                }
              }) // end ajax
            }
          }
        }) // end ajax
                // use each committee_id to request filing info for that committee
                    // if committee_id filings show any expenditures, add them here
        }
      }
    })// End ajax req: 2; challengers
  })
})
