// function myCallback(data) {
//   console.log(data);
// }

$(document).ready(function() {
  console.log("I'm ready!");
  // $.ajax({
  //   url: "http://www.opensecrets.org/api/?method=candContrib&cid=N00007360&cycle=2016&apikey=d52a49dc099032a4d6cdb4eb74802be2",
  //   method: 'GET',
  //   origin: 'http://localhost:8080',
  //   success: function(data) {
  //     console.log(data);
  //   }
  // })


  var mainDiv = $('.main');
  mainDiv.append("<table class='states'></table>");
  var mainTable = $("table");

  var states = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Deleware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];
  console.log(states.length);
  var makeStatesTable = function(arr) {
    for (var i = 0; i < states.length; i++) {
      mainTable.append("<tr id=" + arr[i] + "><td>" + arr[i] + "</td></tr>");
    }
  }
  makeStatesTable(states);




})
