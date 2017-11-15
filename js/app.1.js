var myLatitude = 0;
var myLongitude = 0;

function viewMap() {


    var map = new ol.Map({
        target: 'map',
        renderer: 'canvas',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: ol.proj.transform([myLongitude, myLatitude], 'EPSG:4326', 'EPSG:3857'),
            zoom: 2.5
        })
    });
}

viewMap();