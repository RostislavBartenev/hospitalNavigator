let formRoutes = document.forms.routes;

formRoutes.addEventListener('submit', (event) => {
  event.preventDefault()
  let centerPos = formRoutes.center.value;

  ymaps.ready(init(centerPos));
});

function init(centerPos) {
  var myMap;
  ymaps.geocode(centerPos).then(function (res) {
    myMap = new ymaps.Map('YaMap', {
      center: res.geoObjects.get(0).geometry.getCoordinates(),
      zoom: 16
    });
  });
}