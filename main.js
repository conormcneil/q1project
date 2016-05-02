$(document).ready(function() {
  console.log("I'm ready!");
  // $.ajax({
  //   url: "https://api.open.fec.gov/v1/candidates/search/?api_key=CmRwot11VrUfsEUf9IYGRJSNNacFhOzjQP5ULx7f",
  //   method: 'GET',
  //   origin: 'http://localhost:8080',
  //   success: function(data) {
  //     console.log(data);
  //   }
  // });

  var states = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Deleware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];
  var statesAbbr = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];

  // Use function to display states
  var content = $('.content');
  content.append("<section class='states'></section>");
  var stateList = $("section");
  var displayStates = function(arr) {
    for (var i = 0; i < arr.length; i++) {
      stateList.append("<article class='state'>" + arr[i] + "</article>");
      stateList.append("<p>House</p><p>Senate</p>");
    }
  }
  displayStates(states);

  // Create click events on state names
  $("td").click(function() {
    var activeState = '';
    // var activeStateAbbr = ''; Set abbr at the same time; useful for data parsing w API?
    activeState = event.target.innerHTML;
    console.log(activeState);
  });


  // Toggle House/Senate view on state click
  // $(".tdHide").hide();
  // $("table").click(function(event) {
  //   event.stopPropagation();
  //   var $target = $(event.target);
  //   if ($target.closest("td").hasClass("tdHide")) {
  //     $target.slideUp('fast');
  //   } else {
  //     $target.closest("tr").next().find("td").slideToggle();
  //   }
  //   console.log(event.target);
  //   $("p").click(function(event) {
  //     console.log(event.target);
  //   })
  // })


})
