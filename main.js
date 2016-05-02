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

  // Create click events on state names
  $("aside").addClass('hide');
  $("article").click(function(event) {
    var activeState = '';
    event.stopPropagation();
    activeState = event.target.innerHTML;
    console.log(activeState);
  });


  $("button").click(function() {
    var firstName = $("#firstName").val();
    var lastName = $("#lastName").val();
    var searchName = "https://api.open.fec.gov/v1/candidates/search/?q=" + lastName + "," + firstName + "&cycles=2016&api_key=CmRwot11VrUfsEUf9IYGRJSNNacFhOzjQP5ULx7f"
    var $state = $(".stateForm").val();
    var searchState = "https://api.open.fec.gov/v1/candidates/?election_year=2014&page=1&incumbent_challenge=I&sort=state&state=" + searchState + "&per_page=100&api_key=CmRwot11VrUfsEUf9IYGRJSNNacFhOzjQP5ULx7f";
    var chamber = $("#chamberSearch").val();
    var searchChamber = "https://api.open.fec.gov/v1/candidates/?page=1&sort=state&incumbent_challenge=I&candidate_status=F&candidate_status=C&state=" + $state + "&office=" + chamber + "&per_page=100&api_key=CmRwot11VrUfsEUf9IYGRJSNNacFhOzjQP5ULx7f";
    console.log(chamber);
    console.log(searchChamber);
    $.ajax({
      url: searchChamber,
      method: 'GET',
      origin: 'http://localhost:8080',
      success: function(data) {
        console.log(data);
        for (var i = 0; i < data.results.length; i++) {
          $("#resultView").append('<p class="candidate">' + data.results[i].name + ': ' + data.results[i].candidate_id + '</p>');
        }
      },
      error: function(error) {
        console.log(error);
      }
    });
  })
})

$("p").click(function() {
  $(this).hide();
})
