$(document).ready(function() {
  console.log("I'm ready!");
  $.ajax({
    url: "https://api.propublica.org/campaign-finance/v1?api_key=4jVRBAKrhn4nniRoSo5Gf4AWuM8DaA9G3GUC9pqN",
    method: 'GET',
    success: function(data) {
      console.log(data);
    }
  })
})
