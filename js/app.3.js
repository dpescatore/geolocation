var myLatitude = 0;
var myLongitude = 0;
var map;

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(viewMap);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}



function viewMap(position) {

    myLatitude = position.coords.latitude;
    myLongitude = position.coords.longitude;


    map = new ol.Map({
        target: 'map',
        renderer: 'canvas',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: ol.proj.transform([myLongitude, myLatitude], 'EPSG:4326', 'EPSG:3857'),
            zoom: 18
        })
    });

    var pos = ol.proj.fromLonLat([myLongitude, myLatitude]);

    // Unisannio marker
    var marker = new ol.Overlay({
        position: pos,
        positioning: 'center-center',
        element: document.getElementById('marker'),
        stopEvent: false
    });
    map.addOverlay(marker);

}

getLocation();