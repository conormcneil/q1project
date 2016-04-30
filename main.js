// function myCallback(data) {
//   console.log(data);
// }

$(document).ready(function() {
  console.log("I'm ready!");
  $.ajax({
    url: "http://www.opensecrets.org/api/?method=candContrib&cid=N00007360&cycle=2016&apikey=d52a49dc099032a4d6cdb4eb74802be2",
    method: 'GET',
    origin: 'http://localhost:8080',
    success: function(data) {
      console.log(data);
    }
  })
})
