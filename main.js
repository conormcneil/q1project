var apiKey = 'CmRwot11VrUfsEUf9IYGRJSNNacFhOzjQP5ULx7f';
var states = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Deleware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];
var statesAbbr = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];
var stateForm = $('.stateForm');
var challengersFinalKeys = [];
var incumbentsFinalKeys = [];
var valsC = [];
var valsI = [];
var finalObjC = {};
var finalObjI = {};

var displayStates = function(arr) {
  for (var i = 0; i < arr.length; i++) {
    stateForm.append("<option value='" + statesAbbr[i] + "'>" + arr[i] + "</option>");
  }
}
displayStates(states);

$("#submitButton").click(function() {
  window.localStorage.clear();
  console.log(window.localStorage);
  // $("#incumbentView").html('<p>Incumbents Up for Re-Election</p>');
  // $("#challengerView").html('<p>Official Challengers</p>');
  $("#incumbentView").html('');
  $("#challengerView").html('');
  $("#incumbentCommittees").html('');
  $("#challengerCommittees").html('');
  getIncumbents();
  getChallengers();
});

$("aside").click(function() {
  var candId = event.target.id;
  var target = event.target;
  var id = target.closest("aside").id;

  if (id === "incumbentView") {
    $("#incumbentCommittees").html('');
    if (finalObjI[candId].length === 0) {
      $("#incumbentCommittees").append('<p>This candidate is not currently associated with any active committees</p>');
    }
    for (var i = 0; i < finalObjI[candId].length; i++) {
      getCommsI(finalObjI[candId][i]);
    }
  } else if (id === 'challengerView') {
    $("#challengerCommittees").html('');
    if (finalObjC[candId].length === 0) {
      $("#challengerCommittees").append('<p style="font-size: 2em">This candidate is not currently associated with any active committees</p> ');
    }
    for (var i = 0; i < finalObjC[candId].length; i++) {
      getCommsC(finalObjC[candId][i]);
    }
  }
})

var getCommsI = function(committeeID) {
  console.log('getCommitteesI');
  console.log(committeeID);
  $.ajax({
    url:"https://api.open.fec.gov/v1/committee/" + committeeID + "/?page=1&per_page=20&sort=name&api_key=" + apiKey,
    method: 'GET',
    success: function(committee) {
      var result = committee.results[0].name;
      console.log(result);
      $("#incumbentCommittees").append('<p class="committeeName">' + result + '</p>');
      return result;
    }
  })
}
var getCommsC = function(committeeID) {
  console.log(committeeID);
  $.ajax({
    url:"https://api.open.fec.gov/v1/committee/" + committeeID + "/?page=1&per_page=20&sort=name&api_key=" + apiKey,
    method: 'GET',
    success: function(committee) {
      var result = committee.results[0].name;
      console.log(result);
      $("#challengerCommittees").append('<p class="committeeName">' + result + '</p>');
      return result;
    }
  })
}

// Get Incumbents Object
var getIncumbents = function() {
  var $state = $(".stateForm").val();
  var chamber = $("#chamberSearch").val();
  $.ajax({
    url: "https://api.open.fec.gov/v1/candidates/?page=1&sort=state&candidate_status=C&incumbent_challenge=I&state=" + $state + "&office=" + chamber + "&per_page=100&api_key=" + apiKey,
    method: 'GET',
    success: function(incumbents) {
      var results = incumbents.results;
      for (var i = 0; i < results.length; i++) {
        incumbentsFinalKeys.push(results[i].candidate_id);
        $("#incumbentView").append("<article id=" + results[i].candidate_id + " class=" + results[i].party + ">" + results[i].name + " (" + results[i].party.toLowerCase() + ")</article>");
        localStorage.setItem(results[i].candidate_id,'');
      }
      return getCommitteesI(results);
    }
  })
}

var getCommitteesI = function(arr) { // arr is array of candidates
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
          valsI.push(tmp);
          if (valsI.length === arr.length) {
            makeObjI(arr,valsI);
          }
        }
      }
    })
  }
}

var makeObjI = function(keys, values) {
  for (var i = 0; i < keys.length; i++) {
    finalObjI[keys[i].candidate_id] = values[i];
  }
  console.log(finalObjI);
  // Send finalObjI to calculate receipts
  // sumPerI(finalObjI);
}

// Get Challenger Object
var getChallengers = function() {
  console.log('getChallengers');
  var $state = $(".stateForm").val();
  var chamber = $("#chamberSearch").val();
  $.ajax({
    url: "https://api.open.fec.gov/v1/candidates/?page=1&sort=state&candidate_status=C&incumbent_challenge=C&state=" + $state + "&office=" + chamber + "&per_page=100&api_key=" + apiKey,
    method: 'GET',
    success: function(challengers) {
      var results = challengers.results;
      for (var i = 0; i < results.length; i++) {
        challengersFinalKeys.push(results[i].candidate_id);
        $("#challengerView").append("<article id=" + results[i].candidate_id + " class=" + results[i].party + ">" + results[i].name + " (" + results[i].party.toLowerCase() + ")</article>");
      }
      return getCommitteesC(results);
    }
  })
}

var getCommitteesC = function(arr) { // arr is array of candidates
  console.log('getCommitteesC');
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
          valsC.push(tmp);
          if (valsC.length === arr.length) {
            makeObjC(arr,valsC);
          }
        }
      }
    })
  }
}

var makeObjC = function(keys, values) {
  console.log('makeObjC');
  for (var i = 0; i < keys.length; i++) {
    finalObjC[keys[i].candidate_id] = values[i];
  }
  console.log(finalObjC);
  // Send finalObjC to calculate receipts
}
