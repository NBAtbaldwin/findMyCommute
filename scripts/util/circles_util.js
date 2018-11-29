import * as TransitUtil from './../transit_util';

export const genCircles = (locations, time) => {
  const circlePolygon = [];
  locations.forEach((loc, idx) => {
    let subwayRadius = (((time * 60) - loc.commuteTime) * 1.4) * 0.000621371;
    if (subwayRadius > 0) {
      let circle = drawCircle(loc, subwayRadius, 1);
      circlePolygon.push(circle);
    }
  })
  return circlePolygon;
}

// export const displayCircle = (marker, time, map) => {
//   let lngLat = TransitUtil.parseCoords(marker.lngLat);
//   let circle = new google.maps.Circle({
//     map: map,
//     center: {lat: lngLat.lat(), lng: lngLat.lng()},
//     radius: time,
//   });
//   return circle;
// }


function drawCircle(point, radius, dir) {
  point = TransitUtil.parseCoords(point.lngLat);
  var d2r = Math.PI / 180;   // degrees to radians
  var r2d = 180 / Math.PI;   // radians to degrees
  var earthsradius = 3963; // 3963 is the radius of the earth in miles
  var points = 32;

  // find the raidus in lat/lon
  var rlat = (radius / earthsradius) * r2d;
  var rlng = rlat / Math.cos(point.lat() * d2r);

  var extp = new Array();
  if (dir==1) {var start=0;var end=points+1} // one extra here makes sure we connect the
  else{var start=points+1;var end=0}
  for (var i=start; (dir==1 ? i < end : i > end); i=i+dir)
  {
      var theta = Math.PI * (i / (points/2));
      let ey = point.lng() + (rlng * Math.cos(theta)); // center a + radius x * cos(theta)
      let ex = point.lat() + (rlat * Math.sin(theta)); // center b + radius y * sin(theta)
      extp.push(new google.maps.LatLng(ex, ey));
  }
  return extp;
}
