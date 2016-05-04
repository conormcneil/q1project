var apiKey = 'CmRwot11VrUfsEUf9IYGRJSNNacFhOzjQP5ULx7f';
var states = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Deleware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];
var statesAbbr = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];
var stateForm = $('.stateForm');

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
var challengersCommittees = [];
var challengersCommitteeIds = [];
var committeesFinalValues = {};
var committeeSum = 0;

var getChallengers = function() {
  var $state = $(".stateForm").val();
  var chamber = $("#chamberSearch").val();
  $.ajax({
    url: "https://api.open.fec.gov/v1/candidates/?page=1&sort=state&candidate_status=C&incumbent_challenge=I&state=AZ" + "&office=" + chamber + "&per_page=100&api_key=" + apiKey,
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
    $.ajax({
      url: "https://api.open.fec.gov/v1/candidate/" + arr[i].candidate_id + "/committees/history/2016/?sort=-cycle&per_page=20&page=1&api_key=" + apiKey,
      method: 'GET',
      success: function(committees) { // returns with committee objects in an array per member
        var results = committees.results;
        challengersCommittees.push(results);
        return makeObj(challengersCommittees);
      }
    })
  }
  var makeObj = function(arr) {
    if (arr.length === challengersFinalKeys.length) { // if all members committees have been pushed to array, continue. Else, return to previous for loop until array is completed
      for (var i = 0; i < challengersFinalKeys.length; i++) {
        committeesFinalValues[challengersFinalKeys[i]] = challengersCommittees[i];
        // console.log(challengersCommittees[i][j].committee_id);
      }
      console.log(committeesFinalValues); // Final key-value pair object??
    } else {
      return
    }
    return getFilings(committeesFinalValues);
  }
}

var getFilings = function(obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    var tmp = [];
    for (var j = 0; j < obj[keys[i]].length; j++) {
      tmp.push(obj[keys[i]][j].committee_id);
    }
    test(tmp);
  }
}

var test = function(x) {
  var counter = 0;
  for (var i = 0; i < x.length; i++) {
    $.ajax({
      url: "https://api.open.fec.gov/v1/committee/" + x[i] + "/filings/?page=1&sort=-receipt_date&cycle=2016&report_year=2016&per_page=100&api_key=" + apiKey,
      method: 'GET',
      success: function(receipt) {
        var results = receipt.results;
        console.log(results);
        for (var i = 0; i < results.length; i++) {
          console.log(results[i].total_receipts);
          counter += results[i].total_receipts;
        }
        console.log(counter);
      }
    })
  }
}

// var sumReceipts = function(inp) {
//   var sums = 0;
//   for (var i = 0; i < inp.length; i++) {
//     $.ajax({
//       url: "https://api.open.fec.gov/v1/committee/" + inp[i] + "/filings/?page=1&sort=-receipt_date&cycle=2016&report_year=2016&per_page=100&api_key=" + apiKey,
//       method: 'GET',
//       success: function(totalReceipts) {
//         console.log(totalReceipts.results);
//       }
//     })
//   }
// }
































// placeholder
