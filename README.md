# Air China 2.5
##Visualization of Chinese Air Pollutant PM2.5

Wenhan Rao, Xitao Wang, Shuai Yuan

Air China 2.5 is a web application that allows users to visualize and explore two available datasets of PM2.5 in China. It is implemented in JavaScript with a variety of libraries including D3, jQuery, Backbone and GeoJSON.

It is available at https://syuanivy.github.io/AirGlobal/

The code can be found in the branch: "final" of this repository. Data, Libraries, html templates, JS, data model, can be found in folders with relevant names. Other branches have work that may not be included in the final product of this project.

Its final features include the following parts:

### An Intro Page

A static page with introduction to the problem, sample pictures of the toxic haze caused by high concentration of PM2.5 in three major cities in China, as well as the color scheme of Air Quality Index according to WHO standard, explaining how hazardous PM2.5 is at different concentrations.

### Chinese City Map

We use geojson to generate the chinese map. Base on the data, we translate the PM2.5 into AQI color and fill it to each city. This way you can easily see how severe the pollution is in that city. 

Also, the map is showing the same cities as the small multiples. After search or filter, it will show only the cities of the user’s interest, helping the user to locate the city geographically on the map.

The map also provides tooltip showing the name of the city.
By clicking on the cities on the map, the user can add/remove city data in the line graph as well, allowing the user to check the time-series data more closely.

### Small Multiples

We use circular graph to implement our small multiples. Base on the “from” date and “end” date, we get the data from our data model API and evenly divide a circle into stripes base on the number of days (by default it takes the entire time-series dataset). After that, each stripe will be color coded based on the PM2.5 color scheme. The name of the city and the median(by default) value of PM2.5 concentration are shown in the center bar of the circle.

This visualization allows the user to first get an overall idea of the pollution of the city within the period of interest, and to compare the conditions among different cities very easily. 

We also provide a variety of user interactions through small multiples. When you move the mouse to a particular stripe on any circle, all the circles will change to show the data of that particular date in the center bar, together with the color encoding, one can easily compare the pollution on a particular date based on his/her observation across a bunch of cities of interest.

The small multiples respond to search, select dates, sorting and  filtering in the navigation bar, it coordinates with the map to show the location of the cities, by clicking on a particular circle you can also add/remove line graph in the panel below.

### Line Graph

The x-axis represents the range of date. The left y-axis represents the range of the air pollution. The right y-axis represents the rank of the air pollution such as good, moderate and so on. And at the rightmost, there is the list of chosen cities for comparison.

Users can zoom in or out this line graph based on a specific date or drag around. Also users can add cities as needed. Then all the chosen cities will appear at the rightmost with different colors.

Last point is that when you move mouse over to a specific point, there will be a tooltip to show some details such as specific date and value of air pollution.

### Navigation Bar

The navigation bar have 6 functions.

####The link to the intro page.
	
	When you click the INTRO, the browser will open a new tab to the intro page.

####Change data source.

	There will be two data sources, one is Berkely and the other one is Embassy.

####Change the from and to date.

	When you click the input of the FROM and TO, it will trigger an UI widget to let you select the date.

####Search by city name.
	
	You can type the city name you want to search in the search input. If you want to search multiple cities, you can use the ‘,’ as the separator.

####Sort by different attributes.
	
	There are 4 kinds of attributes to sort, name, max, min and med.

####Filter by the value range.
	
	The filter of the value range based on the AQI values standard.

