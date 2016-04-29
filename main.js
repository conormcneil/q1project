$(document).ready(function() {
  console.log("I'm ready!");
  $.ajax({
    url: "https://api.propublica.org/campaign-finance/v1?api_key=4jVRBAKrhn4nniRoSo5Gf4AWuM8DaA9G3GUC9pqN",
    headers: {'Access-Control-Allow-Origin': '*'},
    method: 'GET',
    success: function(data) {
      console.log(data);
    }
  })
})
