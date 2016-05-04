var apiKey = 'CmRwot11VrUfsEUf9IYGRJSNNacFhOzjQP5ULx7f';
var states = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Deleware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];
var statesAbbr = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];
var stateForm = $('.stateForm');
var challengersFinalKeys = [];
var vals = [];
var finalObj = {};

var displayStates = function(arr) {
  for (var i = 0; i < arr.length; i++) {
    stateForm.append("<option value='" + statesAbbr[i] + "'>" + arr[i] + "</option>");
  }
}
displayStates(states);

$("button").click(function() {
  $("#incumbentView").html('');
  $("#challengerView").html('');
  getChallengers();
});

var getChallengers = function() {
  var $state = $(".stateForm").val();
  var chamber = $("#chamberSearch").val();
  $.ajax({
    url: "https://api.open.fec.gov/v1/candidates/?page=1&sort=state&candidate_status=C&incumbent_challenge=I&state=" + $state + "&office=" + chamber + "&per_page=100&api_key=" + apiKey,
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
  var tmp = [];
  for (var i = 0; i < arr.length; i++) {
    $.ajax({
      url: "https://api.open.fec.gov/v1/candidate/" + arr[i].candidate_id + "/committees/history/2016/?sort=-cycle&per_page=20&page=1&api_key=" + apiKey,
      method: 'GET',
      success: function(committees) { // returns with committee objects in an array per member
        tmp = [];
        var results = committees.results;
        for (var j = 0; j < results.length; j++) {
          tmp.push(results[j].committee_id);
        }
        if (tmp.length === results.length) {
          vals.push(tmp);
          if (vals.length === arr.length) {
            makeObj(arr,vals);
          }
        }
      }
    })
  }
}

var makeObj = function(keys, values) {
  for (var i = 0; i < keys.length; i++) {
    finalObj[keys[i].candidate_id] = values[i];
  }
  console.log(finalObj);
}












































// placeholder
