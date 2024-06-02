	mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container : 'map', // container ID
        center: coordi, // starting position [lng, lat]
        zoom: 10 // starting zoom
    });

    console.log(coordi);

    const marker = new mapboxgl.Marker({color: "red"})
    .setLngLat(coordi)      //location of the geometry in the database
    .setPopup(new mapboxgl.Popup({offset: 25}).setHTML("<h4>Welcome to RENTit!</h4>"))
    .addTo(map);

