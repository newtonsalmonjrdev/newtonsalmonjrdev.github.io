Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZTA0MTg3NS05MDI3LTRkODgtOWY4MC0wN2FhZmI5MmIwNDciLCJpZCI6MTA1OTM2LCJpYXQiOjE2NjczMzc5NjV9.XYrEYpTnMof8gTJYhXaQmIu3Pj2CAcnvE2fB0DxYcVU";

const { BoundingSphere, BoundingSphereState, Cartesian3, Color, Viewer } =
  window.Cesium;
const viewer = new Cesium.Viewer("cesiumContainer", {
  selectionIndicator: false,
  infoBox: false,
});

const scene = viewer.scene;
const camera = viewer.camera.position;
let camPos = viewer.camera.positionCartographic;
let latitude;
let longitude;
let windowPosition = "";
let entities = "";
let geoJSONDataList = "";
let objectDetected = false;
let ObjDetected_Long;
let ObjDetected_Lat;
const cssCircleOverlayX = viewer.container.clientWidth / 2;
const cssCircleOverlayY = viewer.container.clientHeight / 2;
const minimumzoomHeight = 2000000;
const maximumzoomHeight = 10000000;
let promise1 = [];

//Welcome Heading
document.getElementById("artistname").innerHTML = "Welcome!";
document.getElementById("artistname").style.fontSize = "20px";

//Disabling timeline and animation widgets
viewer.animation.container.style.visibility = "hidden";
viewer.timeline.container.style.visibility = "hidden";
viewer.forceResize();

//Centering the HTML circle around the point position
document.getElementById("overlay").style.left = `${cssCircleOverlayX - 57}px`;
document.getElementById("overlay").style.top = `${cssCircleOverlayY - 63}px`;

//Setting the minimum and maximum zoom in level
viewer.scene.screenSpaceCameraController.minimumZoomDistance =
  minimumzoomHeight;
viewer.scene.screenSpaceCameraController.maximumZoomDistance =
  maximumzoomHeight;

//Loading geoJSON files
function loadJSONPointsPolys() {
  promise1 = Cesium.GeoJsonDataSource.load(
    "https://cdn.jsdelivr.net/gh/newtonsalmonjrdev/CesiumWorldMusicGenres@main/GMGD_NeonPointBuffGeoJSON.json"
  );

  promise1.then(function (dataSource1) {
    //Adding Polygon Points
    entities = dataSource1.entities.values;
    geoJSONDataList = dataSource1.entities;
    viewer.dataSources.add(
      Cesium.GeoJsonDataSource.load(
        "https://cdn.jsdelivr.net/gh/newtonsalmonjrdev/CesiumWorldMusicGenres@main/GMGD_NeonPointBuffGeoJSON.json",
        {
          stroke: Cesium.Color.fromCssColorString("white"),
          fill: Cesium.Color.fromCssColorString("#00ff82").withAlpha(1),
          strokeWidth: 3,
        }
      )
    );

    //Adding Polygons- to be converted into buffer ellipses
    const promise2 = Cesium.GeoJsonDataSource.load(
      "https://cdn.jsdelivr.net/gh/newtonsalmonjrdev/CesiumWorldMusicGenres@main/GMGD_PointsBuffers_300.geojson"
    );
    promise2.then(function (dataSource2) {
      viewer.dataSources.add(
        Cesium.GeoJsonDataSource.load(
          "https://cdn.jsdelivr.net/gh/newtonsalmonjrdev/CesiumWorldMusicGenres@main/GMGD_PointsBuffers_300.geojson",
          {
            stroke: Cesium.Color.TRANSPARENT,
            fill: Cesium.Color.TRANSPARENT.withAlpha(0.1),
            strokeWidth: 3,
          }
        )
      );
    });
  });
}

//Getting the Cartesian point of the center window position
function getPosition() {
  windowPosition = new Cesium.Cartesian2(
    viewer.container.clientWidth / 2,
    viewer.container.clientHeight / 2
  );

  var pickRay = viewer.scene.camera.getPickRay(windowPosition);
  var pickPosition = viewer.scene.globe.pick(pickRay, viewer.scene);
  var pickPositionCartographic =
    viewer.scene.globe.ellipsoid.cartesianToCartographic(pickPosition);

  longitude = pickPositionCartographic.longitude * (180 / Math.PI);
  latitude = pickPositionCartographic.latitude * (180 / Math.PI);
}

// This is what's retrieving the cursor's current postion
const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
let handlermove = handler.setInputAction(function (movement) {
  getPosition();
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
let objectDetected2 = false;

// This is retrieving the geoJSON info
function getGeoJSONProps() {
  let handler1 = new Cesium.ScreenSpaceEventHandler(scene.canvas);
  handler1.setInputAction(function () {
    const idlist = [
      "-1",
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
    ];
    const pickedObjects = scene.pick(windowPosition);
    if (Cesium.defined(pickedObjects)) {
      for (let i = 0; i < idlist.length; ++i) {
        if (pickedObjects.id.id === i) {
          //Getting Lat and Long data for fly-to-center function
          objectDetected = true;
          ObjDetected_Long = geoJSONDataList.values[i - 1].properties.Longitude;
          ObjDetected_Lat = geoJSONDataList.values[i - 1].properties.Latitude;
          //Pushing data into the DOM

          //Artist Name
          if (geoJSONDataList.values[i - 1].properties.Artist_Name != "NA") {
            document.getElementById("artistname").innerHTML =
              geoJSONDataList.values[i - 1].properties.Artist_Name;
            document.getElementById("artistname").style.color = "darkblue";
          } else {
            document.getElementById("artistname").innerHTML = "";
          }
          //Band Group
          if (
            geoJSONDataList.values[i - 1].properties.Band_Group__if_any_ != "NA"
          ) {
            document.getElementById("bandgroup").innerHTML =
              geoJSONDataList.values[i - 1].properties.Band_Group__if_any_;
          } else {
            document.getElementById("bandgroup").innerHTML = "";
          }
          //Birth Year
          if (geoJSONDataList.values[i - 1].properties.Birth_Year != "NA") {
            document.getElementById("birthyear").innerHTML =
              geoJSONDataList.values[i - 1].properties.Birth_Year + " — ";
          } else {
            document.getElementById("birthyear").innerHTML = "";
          }
          //Death Year
          if (geoJSONDataList.values[i - 1].properties.Death_Year != "NA") {
            document.getElementById("deathyear").innerHTML =
              geoJSONDataList.values[i - 1].properties.Death_Year;
          } else {
            document.getElementById("deathyear").innerHTML = "";
          }

          // Country of Birth
          if (
            geoJSONDataList.values[i - 1].properties.Country_of_Birth != "NA"
          ) {
            document.getElementById("birthcountry").innerHTML =
              geoJSONDataList.values[i - 1].properties.Country_of_Birth;
            document.getElementById("birthcountry").style.color = "cyan";
          } else {
            document.getElementById("birthcountry").innerHTML = "";
          }

          // Primary Genre
          if (geoJSONDataList.values[i - 1].properties.Primary_Genre != "NA") {
            document.getElementById("primarygen").innerHTML =
              geoJSONDataList.values[i - 1].properties.Primary_Genre + "&ensp;";
          } else {
            document.getElementById("primarygen").innerHTML = "";
          }

          // Secondary Genre
          if (
            geoJSONDataList.values[i - 1].properties.Secondary_Genre != "NA"
          ) {
            document.getElementById("secondgen").innerHTML =
              geoJSONDataList.values[i - 1].properties.Secondary_Genre +
              "&ensp;";
          } else {
            document.getElementById("secondgen").innerHTML = "";
          }

          //Tertiary Genre
          if (geoJSONDataList.values[i - 1].properties.Tertiary_Genre != "NA") {
            document.getElementById("tertgen").innerHTML =
              geoJSONDataList.values[i - 1].properties.Tertiary_Genre;
          } else {
            document.getElementById("tertgen").innerHTML = "";
          }

          //Wikipedia
          if (geoJSONDataList.values[i - 1].properties.Wikipedia_Link != "NA") {
            let wikiurl =
              geoJSONDataList.values[i - 1].properties.Wikipedia_Link;
            document.getElementById("wikilink").setAttribute("href", wikiurl);
            document.getElementById("wikilink").innerHTML = "Wikipedia";
          } else {
            document.getElementById("wikilink").innerHTML = "";
          }

          //Youtube
          if (geoJSONDataList.values[i - 1].properties.Youtube != "NA") {
            let youtubeurl = geoJSONDataList.values[i - 1].properties.Youtube;
            document
              .getElementById("youtubelink")
              .setAttribute("href", youtubeurl);
            console.log(geoJSONDataList.values[i - 1].properties);
            document.getElementById("youtubelink").innerHTML = "Youtube";
          } else {
            document.getElementById("youtubelink").innerHTML = "";
          }

          //City of Birth
          if (geoJSONDataList.values[i - 1].properties.City_of_Birth != "NA") {
            document.getElementById("birthcity").innerHTML =
              geoJSONDataList.values[i - 1].properties.City_of_Birth + ", ";
            document.getElementById("birthcity").style.color = "white";
          } else {
            document.getElementById("birthcity").innerHTML = "";
          }

          //Alias
          if (geoJSONDataList.values[i - 1].properties.Alias_Name != "NA") {
            document.getElementById("alias").innerHTML =
              geoJSONDataList.values[i - 1].properties.Alias_Name;
          } else {
            document.getElementById("alias").innerHTML = "";
          }
        } else {
          continue;
        }
      }
      flyToOnClick();
    }
  }, Cesium.ScreenSpaceEventType.LEFT_UP);
}

loadJSONPointsPolys();
getGeoJSONProps();

function flyToOnClick() {
  if (objectDetected) {
    // Get the camera height
    var cameraHeight = viewer.camera._positionCartographic.height;
    // Here position is a Cartesian3 of the camera destination
    const ObjDetectXY = Cesium.Cartesian3.fromDegrees(
      Number(ObjDetected_Long),
      Number(ObjDetected_Lat),
      1000000
    );
    var cartographicDesination = Cesium.Cartographic.fromCartesian(ObjDetectXY);

    // Override its height
    cartographicDesination.height = cameraHeight;
    // Set it back to a Cartesian3, then fly to this destination
    const ObjDetectXYZ = Cesium.Cartographic.toCartesian(
      cartographicDesination
    );
    // Flies to the destination on release of the mouse button
    viewer.camera.flyTo({
      destination: ObjDetectXYZ,
      duration: 2,
      heading: 0,
    });
  }
  const handler2 = new Cesium.ScreenSpaceEventHandler(scene.canvas);
  let handlermove2 = handler.setInputAction(function (movement) {
    scene.camera.cancelFlight();
  }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
}

viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(
    -77.2975,
    18.1096,
    minimumzoomHeight
  ),
  easingFunction: Cesium.EasingFunction.QUADRATIC_IN_OUT,
  duration: 10,
  heading: 0,
});
