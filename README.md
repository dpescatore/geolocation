# geolocation
This is a javascript demo application for geolocating client built for a talk at University of Sannio.

The project has the only goal of building a simple javascript client able to change layers, get data from layers, draw some features.

The solution is based on [Bootstrap](http://getbootstrap.com/) and [OpenLayers](https://openlayers.org/).

Each page has an html file and a specific js file with the same id number.

## Template.html
This is a demo page that use Bootstrap to built a web page that could be used as a template to embed a map. Has an upper navbar, a left sidebar useful to manage map layers, and an area designed for embed map.

## map.1.html Embed Map
This page uses ol.js lib to embed an OpenStreetMap component. It uses OpenLayers v4.3.2 and add a ol.map object to html div with id 'map'.

## map.2.html Gelocate me
Added support to in browser geolocation using HTML5 api. In more details the function getLocation() does the following:

* Check if Geolocation is supported

* If supported, run the getCurrentPosition() method. If not, display a message to the user

* If the getCurrentPosition() method is successful, it returns a coordinates object to the function specified in the parameter (viewMap)

* The viewMap() function get coords and use it on the map

You can find more details [here](https://www.w3schools.com/html/html5_geolocation.asp)

## map.3.html Show me
This page simply add an [ol.overlay object](https://openlayers.org/en/latest/apidoc/ol.Overlay.html) to my map to show the user his current position obtained in the previous example. 
The animation is obtained with some css tricks.

## map.4.html
In this page we add another overlay representing a label for our location, it is also clickable and customizable as needed.

## map.5.html
This example shows how manage click events on a map element adding a popover used to show clicked coordinates.

## map.6.html
A more complex example related to drawing feature.

To add this feature we need to add another vector layer on top of the map when we create the map.

A selectTypeDraw() js function is created and invoked when the user click on 'Disegna' menu on the upper navbar, this function enable drawing on new added layer.

## map.7.html
This example shows how manage geojson file and map features layer.

Some others advanced selection functionalities are added on this layer. It is possible to select a single feature adding an ol.interaction object on map, and also to select multiple features using ctrl+click and dragging mouse.

This vector layer is enabled on click of specific 'Nazioni' menu on the left sidebar. Clicking on that label the nations layer is added on the map.

## map.8.html
In order to work with [Bing maps](https://www.bing.com/maps?cc=it) you have to edit js/app.8.js file adding your own registered bing key.

