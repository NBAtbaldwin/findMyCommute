export const latLngObj = (arr) => {
  const output = {};
  output.lat = arr[1];
  output.lng = arr[0];
  return output;
}

export const toLatLng = (geoJ) => {
  let output = [];
  geoJ.forEach(arr1 => {
    arr1.forEach(arr2 => {
      arr2.forEach((arr3, idx) => {
        arr2[idx] = latLngObj(arr3);
      })
      output.push(arr2);
    })
  })
  return output
}

export const createPolgygons = (geoJ, container) => {
  const boroughs = ["manhattan", "bronx", "staten_island", "brooklyn", "queens"];
  geoJ.features.forEach((borough, idx) => {
    let boroughObj = {};
    let path = toLatLng(borough.geometry.coordinates);
    boroughObj[boroughs[idx]] = new google.maps.Polygon({
        paths: path,
      });
    container.push(boroughObj);
  });
  return container;
}
