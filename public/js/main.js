let formRoutes = document.forms.routes;

let createRouteButton = formRoutes.createRoute

let YaMap = document.querySelector('#YaMap')

let addMoreButton = formRoutes.addMore

let inputsContainer = document.querySelector('.inputs_container')

createRouteButton.disabled = true

formRoutes.addEventListener('submit', (event) => {
  event.preventDefault()
})

let apiLoaded = async () => {
  await ymaps.ready()
  createRouteButton.disabled = false
}

apiLoaded()

addMoreButton.addEventListener('click', () => {
  let newInput = `<input placeholder="Add address" name="address" type="text">`
  let inputs = document.getElementsByTagName('input')

  if (inputs.length < 4) {
    inputsContainer.insertAdjacentHTML('beforeend', newInput)
  } else {
    addMoreButton.disabled = true
  }
})

createRouteButton.addEventListener('click', async (event) => {
  if (YaMap.children.length) YaMap.children[0].remove()
  let data = []
  let inputs = document.getElementsByTagName('input')
  for (let i = 0; i < inputs.length; i++) {
    data.push(inputs[i].value)
  }
  console.log(data)
  init(data)
});

function init(data) {
    /**
     * Создаем мультимаршрут.
     * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/multiRouter.MultiRoute.xml
     */

    multiRoute = new ymaps.multiRouter.MultiRoute({
      referencePoints: data,
      params: {
        //Тип маршрутизации - пешеходная маршрутизация.
        routingMode: 'pedestrian'
      }
    }, {
      // Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком.
      boundsAutoApply: true
    });

    let myMap = new ymaps.Map('YaMap', {
      center: [55.739625, 37.54120],
      zoom: 12,
    });

    // Добавляем мультимаршрут на карту.
    myMap.geoObjects.add(multiRoute);
}

