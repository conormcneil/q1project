var apiKey = 'CmRwot11VrUfsEUf9IYGRJSNNacFhOzjQP5ULx7f';
var states = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Deleware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];
var statesAbbr = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];
var stateForm = $('.stateForm');
var $state = $(".stateForm").val();
var chamber = $("#chamberSearch").val();

var displayStates = function(arr) {
  for (var i = 0; i < arr.length; i++) {
    stateForm.append("<option value='" + statesAbbr[i] + "'>" + arr[i] + "</option>");
  }
}
displayStates(states);

$("button").click(function() {
  $("#incumbentView").html('');
  getChallengers();
});



var challengersFinalKeys = [];
var test = [];
var committeesFinalValues = {};

var getChallengers = function() {
  console.log(chamber);
  $.ajax({
    url: "https://api.open.fec.gov/v1/candidates/?page=1&sort=state&candidate_status=C&incumbent_challenge=C&state=AZ" + "&office=" + chamber + "&per_page=100&api_key=" + apiKey,
    method: 'GET',
    success: function(challengers) {
      var results = challengers.results;
      for (var i = 0; i < results.length; i++) {
        challengersFinalKeys.push(results[i].candidate_id);
        localStorage.setItem("candidate_" + [i] + "","" + results[i].candidate_id + "");
        $("#challengerView").append("<article id=" + results[i].candidate_id + " class=" + results[i].party + ">" + results[i].name + "</article>");
      }
      return getCommitteesC(results);
    }
  })
}

var getCommitteesC = function(arr) { // arr is array of candidates
  for (var i = 0; i < arr.length; i++) {
    // console.log(i); // for loop completes before executing ajax

    $.ajax({
      url: "https://api.open.fec.gov/v1/candidate/" + arr[i].candidate_id + "/committees/history/2016/?sort=-cycle&per_page=20&page=1&api_key=" + apiKey,
      method: 'GET',
      success: function(committees) {
        var results = committees.results;
        test.push(results);
        return yeezy(test);
        // return results;
        // return getFilings(results); // pass an array to next function call
      }
    })
  }
  var yeezy = function(arr) {
    if (arr.length === challengersFinalKeys.length) {
      // console.log(arr);
      console.log(challengersFinalKeys);
      console.log(test);
      for (var i = 0; i < challengersFinalKeys.length; i++) {
        committeesFinalValues[challengersFinalKeys[i]] = test[i];
      }
      console.log(committeesFinalValues); // Final key-value pair object
    } else {
      return
    }
  }
}


var getFilings = function(arr) {
  console.log(arr);
    // $.ajax({
    //   url: "https://api.open.fec.gov/v1/committee/" + arr[i].committee_id + "/filings/?page=1&sort=-receipt_date&cycle=2016&report_year=2016&per_page=100&api_key=" + apiKey,
    //   method: 'GET',
    //   success: function(filings) {
    //     console.log(filings.results);
    //     for (var j = 0; j < filings.results.length; j++) {
    //       console.log(filings.results[j].total_receipts);
    //     }
    //     return getReceipts(filings.results);
    //   }
    // })
  }

// var getReceipts = function(arr) {
//   var counter = 0;
//   console.log(arr);
//   for (var i = 0; i < arr.length; i++) {
//     counter += arr[i].total_receipts;
//   }
//   console.log(counter);
//   $("#challengerFinance").append("<article class=finance>$" + counter + "</article");
//   console.log(challengersFinalKeys);
// }
































// placeholder
