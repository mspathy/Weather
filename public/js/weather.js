
window.onload = function getWeather() {
  //var apiURI = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=06170c100199dbae1e223cc3dfad960b";
  var apiURI = "http://api.openweathermap.org/data/2.5/forecast?q=Chennai,India&appid=06170c100199dbae1e223cc3dfad960b";
  var tempMode = 1;
  var dayLimit = 5;
  var fahr= [];
  var cels= [];
  $.ajax({
    url: apiURI,
    dataType: "json",
    type: "GET",
    async: "false",
    success: function(resp) {

      $("#tempMode").on("click", function() {
        if (this.checked) {
	for(var i = 0; i < dayLimit; i++) {
          $("#temp-textdate"+i).html(cels[i].toFixed(1) + " C&deg");
          console.log("checked");
	}
        } else
        {
	for(var i = 0; i < dayLimit; i++) {
          $("#temp-textdate"+i).html(fahr[i].toFixed(0) + " F&deg");
	}
        }
      });
      console.log(apiURI);
      console.log(resp);
      if (resp.name) {
        $("#city-text").html(resp.name + ", " + resp.sys.country);
      }
      var tempJSONArray = resp.list;
      console.log(tempJSONArray);
	  var currentHours = new Date().getHours();
	  var pastDate = new Date().getDate()-1;
      if (tempJSONArray ) {
		var j =0;
		for(var i = 0; i < tempJSONArray.length; i++) {
			var dayTempObj = tempJSONArray[i];
			var d = dayTempObj.dt_txt;
			var ds=	d.split(" ")[0],
				year = ds.split("-")[0],
				month = ds.split("-")[1],
				day = ds.split("-")[2],
				time = d.split(" ")[1],
				hour = time.split(":")[0],
				minute =  time.split(":")[1],
				second =  time.split(":")[2];
			var date = new Date ( year, month, day, hour, minute, second );
			var currentDate = date.getDate();
			console.log(dayTempObj.main);
			if(pastDate < currentDate){
				if(hour >= currentHours){
					pastDate = currentDate;
					fahr[j]= (dayTempObj.main.temp * 9 / 5) - 459.67;
					cels[j] = (dayTempObj.main.temp - 273.15);
					if (cels[j] > 24){ 
					  $("#temp-textdate"+j).css("color", "red");
					} else if (cels[j] < 18){
					  $("#temp-textdate"+j).css("color", "blue");
					}
					$("#temp-textdate"+j).html((tempMode === 1 ? fahr[j].toFixed(0) + " F&deg" : cels[j].toFixed(0) + " C&deg"));
					
                                        $("#prediction"+j).html(dayTempObj.weather[0].main);
					$("#temp-textday"+j).html(day+"/"+month+"/"+year);
					j++;
				}
			}
		}
      }
      if (resp.weather) {
        var imgURL = "http://openweathermap.org/img/w/" + resp.weather[0].icon + ".png";
        console.log(imgURL)
        $("#weatherImg").attr("src", imgURL);
        $("#weather-text").html(resp.weather[0].description);
      }   
    },
    error: function(resp) {
       alert("Error: " + "We are not able to fetch the temprature data at this moment as host is not reachable. Please try again later");
       clearInterval(updateinter);
    }
  });  
}
