$(document).ready(function() {
  // window.localStorage.clear();
  if (!localStorage.getItem('isFirstVisit')) {
    localStorage.setItem('isFirstVisit',true);
    console.log("Welcome to my website!");
    $(".content").hide();
    $(".intro").show();
    $("#introButton").click(function() {
      $(".content").show();
      $(".intro").hide();
    })
  }

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
  var stateFull = ''

  var displayStates = function(arr) {
    for (var i = 0; i < arr.length; i++) {
      stateForm.append("<option value='" + statesAbbr[i] + "'>" + arr[i] + "</option>");
    }
  }
  displayStates(states);

  $("#submitButton").click(function() {
    var $state = $(".stateForm").val();
    if (!$state) {
      console.log("no state");
      $(".formError").html("Please select a state.");
      return;
    }
    var chamber = $("#chamberSearch").val();
    if (!chamber) {
      console.log("error");
      $(".formError").html("Please choose a chamber.");
      return;
    }

    $(".details").html("Candidates for the " + getStateFull($state) + " " + getChamberFull(chamber) + " Race: 2016");
    $("#resetButton").show()


    $(".formError").html('');
    $("#incumbentView").html('');
    $("#challengerView").html('');
    $("#incumbentCommittees").html('');
    $("#challengerCommittees").html('');
    $(".hideOnSubmit").hide();
    $("#calculateButton").show();
    getIncumbents();
    getChallengers();
  });

  $("#calculateButton").click(function() {
    // Incumbents: gather committee_id's into array to check filing
    var inComs = $("#incumbentCommittees").children();
    var inComsArr = [];
    var chComs = $("#challengerCommittees").children();
    var chComsArr = [];
    if (inComs.length === 0) {
      console.log('error no candidate selected');
      $("#incumbentCommittees").html('<p class="error">Please select a candidate.</p>');
      return;
    }
    if (chComs.length === 0) {
      console.log('error no candidate selected');
      $("#challengerCommittees").html('<p class="error">Please select a candidate.</p>');
      return;
    }
    $("#calculateButton").hide();
    for (var i = 0; i < inComs.length; i++) {
      if (inComs[i]) {
        inComsArr.push(inComs[i].id);
      }
    }
    console.log(inComsArr);
    for (var i = 0; i < chComs.length; i++) {
      if (chComs[i] !== '') {
        chComsArr.push(chComs[i].id);
      }
    }
    // Send array for filings and receipt sums
    committeeFilingsI(inComsArr);
    committeeFilingsC(chComsArr);
  })

  var committeeFilingsI = function(arr) {
    console.log(arr);
    var arrLocal = arr;
    for (var i = 0; i < arr.length; i++) {
      var totalReceiptsSum = 0;
      console.log(arrLocal[i]);
      $.ajax({
        url: "https://api.open.fec.gov/v1/committee/" + arr[i] + "/filings/?cycle=2016&page=1&per_page=20&api_key=" + apiKey,
        method: 'GET',
        success: function(filings) {
          var results = filings.results;
          console.log(arrLocal);
          console.log(results);
          for (var j = 0; j < results.length; j++) {
            totalReceiptsSum += results[j].total_receipts;
          }
          console.log(arrLocal);
          $(".committeesSumI").html("<p>Total Spent: $" + addCommas(totalReceiptsSum) + "</p>");
          console.log(totalReceiptsSum);
        }
      })
    }
  }
  var committeeFilingsC = function(arr) {
    console.log(arr);
    var arrLocal = arr;
    for (var i = 0; i < arr.length; i++) {
      var totalReceiptsSum = 0;
      console.log(arrLocal[i]);
      $.ajax({
        url: "https://api.open.fec.gov/v1/committee/" + arr[i] + "/filings/?cycle=2016&page=1&per_page=20&api_key=" + apiKey,
        method: 'GET',
        success: function(filings) {
          var results = filings.results;
          console.log(arrLocal);
          console.log(results);
          for (var j = 0; j < results.length; j++) {
            totalReceiptsSum += results[j].total_receipts;
          }
          console.log(arrLocal);
          $(".committeesSumC").html("<p>Total Spent: $" + addCommas(totalReceiptsSum) + "</p>");
          console.log(totalReceiptsSum);
        }
      })
    }
  }

  $("aside").click(function(e) {
    e.stopPropagation();
    var candId = event.target.id;
    var target = event.target;
    var id = target.closest("aside").id;
    console.log(target.innerHTML);

    if (id === "incumbentView") {
      $("#incumbentCommittees").html('');
      if (finalObjI[candId] === undefined) {
        return
      } else if (finalObjI[candId].length === 0) {
        $("#incumbentCommittees").html('<p>This candidate is not currently associated with any active committees</p>');
        $("#incumbentCommittees").prepend('<p class="name">' + target.innerHTML + '</p>');
      } else {
        $("#incumbentCommittees").prepend('<p class="name">' + target.innerHTML + '</p>');
        for (var i = 0; i < finalObjI[candId].length; i++) {
          getCommsI(finalObjI[candId][i]);
        }
      }
    } else if (id === 'challengerView') {
      $("#challengerCommittees").html('');
      if (finalObjC[candId] === undefined) {
      } else if (finalObjC[candId].length === 0) {
        $("#challengerCommittees").html('<p style="font-size: 2em">This candidate is not currently associated with any active committees</p> ');
        $("#challengerCommittees").prepend('<p class="name">' + target.innerHTML + '</p>');
      } else {
        $("#challengerCommittees").prepend('<p class="name">' + target.innerHTML + '</p>');
        for (var i = 0; i < finalObjC[candId].length; i++) {
          getCommsC(finalObjC[candId][i]);
        }
      }
    }
  })
  var getCommsI = function(committeeID) {
    $.ajax({
      url:"https://api.open.fec.gov/v1/committee/" + committeeID + "/?page=1&per_page=20&sort=name&api_key=" + apiKey,
      method: 'GET',
      success: function(committee) {
        var result = committee.results[0].name;
        $("#incumbentCommittees").append('<p id="' + committee.results[0].committee_id + '" class="committeeName">' + result + '</p>');
        return result;
      }
    })
  }
  var getCommsC = function(committeeID) {
    $.ajax({
      url:"https://api.open.fec.gov/v1/committee/" + committeeID + "/?page=1&per_page=20&sort=name&api_key=" + apiKey,
      method: 'GET',
      success: function(committee) {
        var result = committee.results[0].name;
        $("#challengerCommittees").append('<p id="' + committee.results[0].committee_id + '" class="committeeName">' + result + '</p>');
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
  }

  // Get Challenger Object
  var getChallengers = function() {
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
    for (var i = 0; i < keys.length; i++) {
      finalObjC[keys[i].candidate_id] = values[i];
    }
  }
}); // End document.ready



function getChamberFull(abbr) {
  if (abbr === "H") {
    return "House of Representatives";
  } else if (abbr === "S") {
    return "Senate";
  }
}

function getStateFull(abbr) {
  switch (abbr) {
  case 'AL':
    stateFull = 'Alabama';
    break;
  case 'AK':
    stateFull = 'Alaska';
    break;
  case 'AZ':
    stateFull = 'Arizona';
    break;
  case 'AR':
    stateFull = 'Arkansas';
    break;
  case 'CA':
    stateFull = 'California';
    break;
  case 'CO':
    stateFull = 'Colorado';
    break;
  case 'CT':
    stateFull = 'Connecticut';
    break;
  case 'DE':
    stateFull = 'Deleware';
    break;
  case 'FL':
    stateFull = 'Florida';
    break;
  case 'GA':
    stateFull = 'Georgia';
    break;
  case 'HI':
    stateFull = 'Hawaii';
    break;
  case 'ID':
    stateFull = 'Idaho';
    break;
  case 'IL':
    stateFull = 'Illinois';
    break;
  case 'IN':
    stateFull = 'Indiana';
    break;
  case 'IA':
    stateFull = 'Iowa';
    break;
  case 'KS':
    stateFull = 'Kansas';
    break;
  case 'KY':
    stateFull = 'Kentucky';
    break;
  case 'LA':
    stateFull = 'Louisiana';
    break;
  case 'ME':
    stateFull = 'Maine';
    break;
  case 'MD':
    stateFull = 'Maryland';
    break;
  case 'MA':
    stateFull = 'Massachusetts';
    break;
  case 'MI':
    stateFull = 'Michigan';
    break;
  case 'MN':
    stateFull = 'Minnesota';
    break;
  case 'MS':
    stateFull = 'Mississippi';
    break;
  case 'MO':
    stateFull = 'Missouri';
    break;
  case 'MT':
    stateFull = 'Montana';
    break;
  case 'NE':
    stateFull = 'Nebraska';
    break;
  case 'NV':
    stateFull = 'Nevada';
    break;
  case 'NH':
    stateFull = 'New Hampshire';
    break;
  case 'NJ':
    stateFull = 'New Jersey';
    break;
  case 'NM':
    stateFull = 'New Mexico';
    break;
  case 'NY':
    stateFull = 'New York';
    break;
  case 'NC':
    stateFull = 'North Carolina';
    break;
  case 'ND':
    stateFull = 'North Dakota';
    break;
  case 'OH':
    stateFull = 'Ohio';
    break;
  case 'OK':
    stateFull = 'Oklahoma';
    break;
  case 'OR':
    stateFull = 'Oregon';
    break;
  case 'PA':
    stateFull = 'Pennsylvania';
    break;
  case 'RI':
    stateFull = 'Rhode Island';
    break;
  case 'SC':
    stateFull = 'South Carolina';
    break;
  case 'SD':
    stateFull = 'South Dakota';
    break;
  case 'TN':
    stateFull = 'Tennessee';
    break;
  case 'TX':
    stateFull = 'Texas';
    break;
  case 'UT':
    stateFull = 'Utah';
    break;
  case 'VT':
    stateFull = 'Vermont';
    break;
  case 'VA':
    stateFull = 'Virginia';
    break;
  case 'WA':
    stateFull = 'Washington';
    break;
  case 'WV':
    stateFull = 'West Virginia';
    break;
  case 'WI':
    stateFull = 'Wisconsin';
    break;
  case 'WY':
    stateFull = 'Wyoming';
    break;
  }
  return stateFull;
}

function addCommas(nStr) {
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}
