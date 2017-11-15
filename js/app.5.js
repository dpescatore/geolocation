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

    // Unisannio label
    var unisannio = new ol.Overlay({
        position: pos,
        element: document.getElementById('unisannio')
    });
    map.addOverlay(unisannio);

    // Popup showing the position the user clicked
    var popup = new ol.Overlay({
        element: document.getElementById('popup')
    });
    map.addOverlay(popup);


    map.on('click', function(evt) {
        var element = popup.getElement();
        var coordinate = evt.coordinate;
        var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(
            coordinate, 'EPSG:3857', 'EPSG:4326'));

        $(element).popover('destroy');
        popup.setPosition(coordinate);
        // the keys are quoted to prevent renaming in ADVANCED mode.
        $(element).popover({
            'placement': 'top',
            'animation': false,
            'html': true,
            'content': '<p>Hai cliccato alle coordinate:</p><code>' + hdms + '</code>'
        });
        $(element).popover('show');
    });

    var closer = document.getElementById('popup-closer');
    closer.onclick = function() {
        popup.setPosition(undefined);
        closer.blur();
        window.initPopup = true;
        console.log('cliccato il closer');
        return false;
    };

}

getLocation();