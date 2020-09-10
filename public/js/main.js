let formRoutes = document.forms.routes;

let createRouteButton = formRoutes.createRoute

let YaMap = document.querySelector('#YaMap')

let addMoreButton = formRoutes.addMore

let inputsContainer = document.querySelector('.inputs_container')

createRouteButton.disabled = true

formRoutes.addEventListener('submit', async (event) => {
  event.preventDefault()

  if (YaMap.children.length) YaMap.children[0].remove()
  let data = []
  let inputs = document.getElementsByTagName('input')
  for (let i = 0; i < inputs.length; i++) {
    data.push(inputs[i].value)
  }
  if (data.length > 2) {
    await findOptimalPath(data)
  } else {
    data.push(inputs[0].value)
    init(data)
  }
})

let apiLoaded = async () => {
  await ymaps.ready();
  createRouteButton.disabled = false
}

apiLoaded()

addMoreButton.addEventListener('click', () => {
  let newInput = `<div class="form-control"><input placeholder="Add address" name="address" type="text" pattern=".{3,}" required title="3 characters minimum"></div>`
  let inputs = document.getElementsByTagName('input')

  if (inputs.length < 9) {
    inputsContainer.insertAdjacentHTML('beforeend', newInput)
  } else {
    addMoreButton.disabled = true
  }
})

createRouteButton.addEventListener('submit', async (event) => {

});

function shoufle(arr) {
  const result = [];
  const l = arr.length;
  for (let i = 0; i < l; i++) {
    const temp = arr[i];
    arr.splice(i, 1);
    for (let j = 1; j < l; j++) {
      arr.splice(j, 0, temp);
      result.push(JSON.parse(JSON.stringify(arr)));
      arr.splice(j, 1);
    }
    arr.splice(i, 0, temp);
  }
  return result;
}


let findOptimalPath = async (arr) => {
  console.log(arr, 'arr')

  let hospital = arr[0]

  console.log(hospital, 'hosp')

  const shoufledArr = shoufle(arr.slice(1));

  console.log(shoufledArr, 'shuf')


  const result2 = await Promise.all(shoufledArr.map(async (el) => {
    const route = await ymaps.route([hospital,...el, hospital]);
    const tempDist = await route.getLength();
    const dist = Math.round(tempDist);
    return { el, dist };
  }));

  console.log(result2.sort((a, b) => a.dist - b.dist));
  const path = result2[0].el;
  console.log(path);
  console.log([hospital,...path, hospital])
  init([hospital,...path, hospital])
}


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

