var map = L.map('map').setView([6.4611, -2.3172], 13);
// Add OpenStreetMap tile layer

// Add OpenStreetMap tile layer
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 23,
}).addTo(map);


var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
});

var googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
});

var googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
});

//Add Marker to map
var marker = L.marker([6.4611, -2.3172]).addTo(map);


//Add GeoJSon Layers

var regionStyle = {
    color: "red",
    weight: 4,
    stroke: "black"

}

var DistrictsStyle = {
    color: "purple",
    weight: 4,
    stroke: "black"

}

var placesStyle = {
    color: "black",
    radius:2,
    fillColor:"red",
}

var BABMAStyle = {
    color: "yellow",
    fillOpacity: 1,
    radius:2,
    fillColor:"yellow",
}

var rivers = L.geoJson(rivers).addTo(map)

var places = L.geoJson(places, {
    pointToLayer:function(feature, latlng) {
    return L.circleMarker(latlng, placesStyle);
}
}).addTo(map)

var Regions = L.geoJson(region, {
    style:regionStyle,
    onEachFeature:function (feature, layer) {

        var area = (turf.area(feature)/100000).toFixed(3)
        
        var centerlng = turf.center(feature).geometry.coordinates[0].toFixed(2)
        var centerlat = turf.center(feature).geometry.coordinates[1].toFixed(2)


        label= `Name: ${feature.properties.region}<br>`
        label+=`Area: ${area}<br>`
        label+=`RegionCode: ${feature.properties.reg_code}<br>`
        label+=`Center: ${centerlng}, ${centerlat}<br>`
        

        layer.bindPopup(label)
    },

}).addTo(map)

var BABMA = L.geoJson(BABMA, {
    style:BABMAStyle,
    onEachFeature:function (feature, layer) {

        label= `Name: ${feature.properties.DISTRICT}<br>`
        label+=`Area: ${feature.properties.Area_km2}<br>`
        label+=`Region: ${feature.properties.REGION}<br>`
        

        layer.bindPopup(label)
    },

}).addTo(map)

var Districts = L.geoJson(Districts, {
    style:DistrictsStyle,
    onEachFeature:function (feature, layer) {

        var centerlng = turf.center(feature).geometry.coordinates[0].toFixed(2)
        var centerlat = turf.center(feature).geometry.coordinates[1].toFixed(2)        

        label= `Name: ${feature.properties.DISTRICT}<br>`
        label+=`Area: ${feature.properties.Area_km2}<br>`
        label+=`Region: ${feature.properties.REGION}<br>`
        label+=`Center: ${centerlng}, ${centerlat}<br>`
        

        layer.bindPopup(label)
    },

}).addTo(map)

//Basemap
var baseLayers = {
    "GoogleSAT": googleSat,
    "GoogleHybrid": googleHybrid,
	"GoogleStreets": googleStreets,
    "OpenStreetMap": osm,


};

//Layers
var overlays = {
    "Marker": marker,
    "WaterBodies": rivers,
    "Towns": places,
    "Regions": Regions,
    "Districts": Districts,
    "BABMA": BABMA,
};

L.control.layers(baseLayers, overlays, {collapsed:false}).addTo(map);


//Add RiverWMS
var DistrictWMS = L.tileLayer.wms("http://localhost:8080/geoserver/BABMA/wms", {
    layers: 'BABMA:Districts',
    format: 'image/png',
    transparent: true,
    attribution: ""
}).addTo(map)

//ContoursWMS
var ContourWMS = L.tileLayer.wms("http://localhost:8080/geoserver/BABMA/wms", {
    layers: 'BABMA:Contours',
    format: 'image/png',
    transparent: true,
    attribution: ""
}).addTo(map)

//coordinate on mousemove
map.on("mousemove", function(e){

   $("#cord").html(`Lat:${e.latlng.lat.toFixed(3)}, lng:${e.latlng.lng.toFixed(3)}`)
    })

//Add Scale
L.control.scale({position: "bottomleft"}).addTo(map)

//Controllers
map.zoomControl.setPosition("topleft")

//Print map
L.control.browserPrint({position: 'topleft'}).addTo(map);


