var myLatitude = 0;
var myLongitude = 0;
var map;
var typeSelect = 'None';
var layerSelected = 'Panoramica';
var draw;
var selectedFeatures;
var nationName = 'Non hai selezionato nessuna feature'


//creazione del primo layer con OpenStreetMap
var raster = new ol.layer.Tile({
    source: new ol.source.OSM()
});


//creazione di un secondo layer vettoriale per gestire i disegni
var source = new ol.source.Vector({ wrapX: false });

var vector = new ol.layer.Vector({
    source: source
});

//creazione di un terzo layer contenente i vettori delle nazioni
var vectorSourceNation = new ol.source.Vector({
    url: 'https://openlayers.org/en/v4.3.2/examples/data/geojson/countries.geojson',
    format: new ol.format.GeoJSON()
});

var vectorNation = new ol.layer.Vector({
    source: vectorSourceNation
});

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
            raster, vector
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

    // a normal select interaction to handle click
    var select = new ol.interaction.Select();
    map.addInteraction(select);

    selectedFeatures = select.getFeatures();

    selectedFeatures.on(['add', 'remove'], function() {
        var names = selectedFeatures.getArray().map(function(feature) {
            return feature.get('name');
        });
        if (names.length > 0) {
            nationName = names.join(', ');
            if (layerSelected == 'sourceNation') {
                $("#alertNation").text('Hai selezionato: ' + nationName);
            }
        } else {
            nationName = 'Non hai selezionato nessuna feature';
            if (layerSelected == 'sourceNation') {
                $("#alertNation").text('');
            }
        }
    });

    map.on('click', function(evt) {
        if (typeSelect == 'None' || typeSelect == 'Point') {
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
        }

    });

    var closer = document.getElementById('popup-closer');
    closer.onclick = function() {
        popup.setPosition(undefined);
        closer.blur();
        window.initPopup = true;
        console.log('cliccato il closer');
        return false;
    };


    // a DragBox interaction used to select features by drawing boxes
    var dragBox = new ol.interaction.DragBox({
        condition: ol.events.condition.platformModifierKeyOnly
    });

    map.addInteraction(dragBox);

    dragBox.on('boxend', function() {
        // features that intersect the box are added to the collection of
        // selected features
        var extent = dragBox.getGeometry().getExtent();
        vectorSourceNation.forEachFeatureIntersectingExtent(extent, function(feature) {
            selectedFeatures.push(feature);
        });
    });

    // clear selection when drawing a new box and when clicking on the map
    dragBox.on('boxstart', function() {
        selectedFeatures.clear();
    });

}

//Funzione per il set della variabile che definisce il tipo di disegno
function setTypeDraw(typeSelected) {
    typeSelect = typeSelected;
    map.removeInteraction(draw);
    addInteraction();
};


function addInteraction() {
    var value = typeSelect;
    if (value !== 'None') {
        draw = new ol.interaction.Draw({
            source: source,
            type: /** @type {ol.geom.GeometryType} */ (typeSelect)
        });
        map.addInteraction(draw);
    }
}

function addLayer(layer) {
    map.addLayer(layer);
}

function removeLayer(layer) {
    map.removeLayer(layer);
}

$(".nav a").on("click", function() {
    $(".nav").find(".active").removeClass("active");
    $(this).parent().addClass("active");
    var id = $(this).attr('id');
    console.log('cliccato ' + id);
    if (id == 'sourceNation') {
        addLayer(vectorNation);
        layerSelected = id;
    } else {
        removeLayer(vectorNation);
    }
});





getLocation();

addInteraction();