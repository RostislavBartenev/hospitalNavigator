// не удаляй пока то что закомментировано, уже сегодня нету сил 
// разбираться что еще может пригодиться
// то что раскоментировано работает достаточно быстро
// лучше чем сложные алгоритмы если в радиусе 30км пациенты.

// если даже 6 пациентов и расстояние между ними больше 10000км ждем не дольше 2 минут
// яндекс меня наверное навечно забанит от такого количества запросов 

function shoufle(arr) {
  // это просто генератор комбинаций координат пациентов
  // сам алгоритм хреновый, но это абсолютно не мешает
  
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
async function wrapper(arr) {
  ymaps.ready(async () => {
    // тут нужно будет работать, что-то я не нашел у вас в коде где вы там карту подключили
    // но в любом случае где-то должна быть ymaps.ready или похожий обработчик
    //вот внутрь него и придется всё загнать
    // обертку написал только для проверки
    // превысил лимит обращений к яндексу в сутки(25000)
    // теперь они меня выбрасывают

    // после тго как проинициализировалась карта
    // пользователь вводит адреса адреса записываются в массив
    const shoufledArr = shoufle(arr); // сюда передается этот массив
    // дальше ждем маршрут к блекджеку и шлюхам
    // const result = [];
    let hospital = [42.941595, 71.372918]; // координаты больницы захардкодил для тестов
    // без Promise.all работает еще быстрее, но у меня не получилось добиться стабильности
    const result2 = await Promise.all(shoufledArr.map(async (el) => {
      const route = await ymaps.route([hospital,...el,hospital]);

      // условий добавлять не нужно
      // объект старался максимально облегчить чтобы быстро работало

      const tempDist = await route.getLength();
      const dist = Math.round(tempDist);
      return { el, dist };
    }));
    console.log(result2.sort((a, b) => a.dist - b.dist));

    // это наш самый оптимальный(ну почти) массив координат
    const path = result2[0].el;
    
    console.log(path); 

    // shoufledArr.forEach(async (el) => {
    //   const route = await ymaps.route(el);
    //   const tempDist = await route.getLength();
    //   const dist = Math.round(tempDist);
    //   // console.log(length);
    //   await result.push([el, dist]); // await тут тоже писал мля
    //   console.log(result, '<<<<<<<<<<<<');
    // });
    // console.log(result.sort((a, b) => a.dist - b.dist));
    // console.log(result.length);
    // console.log('>>>>>>>>>>>>>>>', result);
    // console.log(typeof result);
    // console.log(Array.isArray(result));
    // console.log(result.length);
    // let minDist = result[0].dist;
    // let minPath = result[0].path;
    // for (let i = 0; i < result.length; i++) {
    // if (minDist > result[i].dist) {
    //   minDist = result[i].dist;
    //   minPath = result[i].path;
    // }
    //   console.log(result[i]);
    // }
    // console.log(minDist);
    // console.log(minPath);
  });
}
wrapper([
  [42.902243, 71.377017],
  [42.911595, 71.372918],
  [42.897734, 71.375816],
  [42.899861, 71.37351],
  [42.902243, 71.377017],
  [42.918595, 71.362918],
]);
// const newArr = shoufle([
//   [42.902243, 71.377017],
//   [42.911595, 71.372918],
//   [42.897734, 71.375816],
//   [42.899861, 71.37351],
// [55.753994, 37.622093],
// [55.811511, 37.312518],
// ]);

// Promise.all(newArr.map((el) => opt(el)))
//   .then((data) => console.log(data));

// function DistanceFinder(points) {
//   this.points = points;

//   this.data = {};
//   this.dataItems = 0;

//   this.onCompleteCallback = null;

//   this.okayPoints = [];

//   this.failedRoutes = [];
//   // точки, которые Яндекс не смог декодировать
//   this.failedPoints = [];

//   // максимальное количество точек на один запрос к Яндексу
//   this.maxLength = 40;

//   // был ли запущен таймаут для вывода сообщения об ошибке
//   this.errorTimeout = 0;
// }

// DistanceFinder.prototype = {

//   onComplete(callback) {
//     this.onCompleteCallback = callback;
//   },

//   callOnCompleteCallback() {
//     if (this.onCompleteCallback) {
//       this.onCompleteCallback(this.data);
//     } else {
//       throw "onComlete callback hasn't been provided, it should be set explicitely via DistanceFinder.onComplete()";
//     }
//   },

//   findDistances() {

//     const routes = this.prepareRoutes();

//     for (let i = 0; i < routes.length; i++) {
//       this.processRoute(routes[i]);
//     }
//     return this;
//   },

//   prepareRoutes() {
//     const routes = [];

//     for (let i = 0; i < this.points.length - 1; i++) {
//       let currentRoute = [i];

//       for (let j = 0; j < this.points.length; j++) {
//         if (i < j) {
//           currentRoute.push(j);
//           currentRoute.push(i);

//           if (currentRoute.length > this.maxLength) {
//             routes.push(currentRoute);
//             currentRoute = [i];
//           }
//         }
//       }

//       if (currentRoute.length > 1) {
//         routes.push(currentRoute);
//       }
//     }

//     return routes;
//   },

//   getPointsNames(route) {
//     const result = [];

//     for (let i = 0; i < route.length; i++) {
//       result.push(this.points[route[i]]);
//     }
//     return result;
//   },

//   processRoute(route) {
//     const points = this.getPointsNames(route);
//     const self = this;

//     ymaps.route(points, {
//       mapStateAutoApply: false,
//     }).then((response) => {
//       const paths = response.getPaths();
//       paths.each((path, index) => {
//         const data = { length: path.getLength(), time: path.getTime() };

//         const pointAIndex = route[index];
//         const pointBIndex = route[index + 1];

//         self.addPointsData(pointAIndex, pointBIndex, data);
//       });
//     }, (error) => {
//       console.log(`Возникла ошибка: ${error.message}`);

//       self.addFailedRoute(route);
//     });
//   },

//   addPointsData(i, j, data) {
//     this.data[`${i}-${j}`] = data;

//     const itemsNeeded = Math.pow(this.points.length, 2) - this.points.length;
//     this.dataItems++;

//     this.okayPoints = this.arrayUnique(this.okayPoints.concat([i, j]));

//     // Если пришли все данные - вызываем коллбек и передаем ему эти данные
//     if (this.dataItems == itemsNeeded) {
//       this.callOnCompleteCallback();
//     }
//   },

//   addFailedRoute(route) {
//     this.failedRoutes.push(route);
//     this.failedPoints = this.arrayUnique(this.arrayUnique(route).concat(this.failedPoints));

//     if (!this.errorTimeout) { // добавить таймер для вывода сообщения об ошибке
//       const self = this;
//       this.errorTimeout = setTimeout(() => { self.reportErrors(); }, 5000);
//     }
//   },

//   /
//   arrayUnique(arr) {
//     const u = {}; const
//       a = [];
//     for (let i = 0; i < arr.length; ++i) {
//       if (u.hasOwnProperty(arr[i])) {
//         continue;
//       }
//       a.push(arr[i]);
//       u[arr[i]] = 1;
//     }
//     return a;
//   },

//   arrayDiff(arr1, arr2) {
//     return arr1.filter((i) => !(arr2.indexOf(i) > -1));
//   },

//   reportErrors() {
//     const errorPoints = this.arrayDiff(this.failedPoints, this.okayPoints);

//     const errorNames = [];
//     for (let i = 0; i < errorPoints.length; i++) {
//       errorNames.push(this.points[errorPoints[i]]);
//     }

//     $('#status img').hide();
//     $('#error').html(`Невозможно определить расстояние до точек: <br />${errorNames.join('<br />')}`);

//     $('#error').after('<br /><br /><a href="">Загрузить исправленный файл</a>');
//   },
// };

// /**
//    * Класс, оптимизирующий маршрут
//    *
//    */
// function RouteOptimizer(data, options) {
//   options = options || {};
//   this.data = data;

//   // подготовка матрицы расстояний
//   this.distances = this.prepareDistances(data);

//   // параметры алгоритма
//   this.temperatureStart = Math.pow(10, 10);
//   this.temperatureEnd = typeof options.temperatureEnd !== 'undefined' ? options.temperatureEnd : 0.00001;
//   this.coolingFactor = typeof options.coolingFactor !== 'undefined' ? options.coolingFactor : 0.99;
//   this.iterations = typeof options.iterations !== 'undefined' ? options.iterations : 15;

//   this.optimalRoute = [];
//   this.optimalDistance = Infinity;

//   this.topRoutes = [];
//   this.topCosts = [];
// }

// RouteOptimizer.prototype = {

//   /**
//        * Заполняет матрицу расстояний
//        *
//        */
//   prepareDistances(data) {
//     const result = [];

//     for (key in data) {
//       const index = key.split('-');

//       if (typeof result[index[0]] === 'undefined') {
//         result[index[0]] = [];
//       }
//       result[index[0]][index[1]] = data[key].length;
//     }

//     return result;
//   },

//   /**
//        * Находит оптимальный маршрут за this.iterations итераций, выбирает из них наилучший
//        *
//        */
//   getOptimal() {
//     const self = this;

//     const route = this.getInitialRoute();
//     const cost = this.getTotalDistance(route);

//     const routes = [];
//     const costs = [];
//     const routesHash = {};

//     for (let i = 0; i < this.iterations; i++) {
//       result = this.runOneIteration();

//       if (result.cost < this.optimalDistance) {
//         this.optimalDistance = result.cost;
//         this.optimalRoute = result.route;
//       }

//       const hash = result.route.join('-');
//       if (!routesHash.hasOwnProperty(hash)) {
//         routesHash[hash] = true;
//         routes.push(result.route);
//         costs.push(result.cost);
//       }
//     }

//     this.findTopRoutes(costs, routes);
//     return { route: this.optimalRoute, distance: this.optimalDistance };
//   },

//   /**
//        * Находит 5 лучших маршрутов
//        *
//        */
//   findTopRoutes(costs, routes) {
//     const n = 5;
//     for (let i = 0; i < n; i++) {
//       min = Infinity;
//       minIndex = -1;
//       for (let j = 0; j < costs.length; j++) {
//         if (costs[j] < min) {
//           min = costs[j];
//           minIndex = j;
//         }
//       }

//       this.topCosts.push(min);
//       this.topRoutes.push(routes[minIndex]);

//       delete costs[minIndex];
//     }
//   },

//   /**
//        * Возвращает лучшие маршруты
//        *
//        */
//   getTopRoutes() {
//     return { routes: this.topRoutes, lengths: this.topCosts };
//   },

//   /**
//        * Выполняет одну итерацию оптимизатора: находит наилучший маршрут
//        * по алгоритму, описанному на
//        * http://codecapsule.com/2010/04/06/simulated-annealing-traveling-salesman/
//        *
//        */
//   runOneIteration() {
//     let route = this.getInitialRoute();
//     let routeNew = [];
//     let cost = this.getTotalDistance(route);
//     let costNew = 0;
//     let difference = 0;

//     let indices = [];
//     let newRouteData = {};

//     let temperature = this.temperatureStart;

//     let routeBest = route;
//     let costBest = cost;

//     while (temperature > this.temperatureEnd) {
//       // меняем две точки случайным образом
//       indices = this.getIndicesToSwap();

//       routeNew = route.slice(0);
//       // вычисляем длину нового маршрута
//       newRouteData = this.getNewRouteData(routeNew, indices, cost);

//       routeNew = newRouteData.route;
//       costNew = newRouteData.cost;

//       difference = cost - costNew;

//       // если он лучше старого или он хуже, но "температура" достаточно высока, так что мы
//       // можем себе позволить пробовать разные варианты - принимаем данный маршрут в
//       // качестве текущего
//       if (difference > 0 || Math.exp(difference / temperature) > Math.random()) {
//         cost = costNew;
//         route = routeNew;

//         if (cost < costBest) {
//           routeBest = route;
//           costBest = cost;
//         }
//       }

//       // "охлаждаем" алгоритм, так что все с большей вероятностью будем идти к локальному оптимуму
//       temperature *= this.coolingFactor;
//     }

//     return { route: routeBest, cost: costBest };
//   },

//   /**
//        * Возвращает расстояние между двумя точками
//        *
//        */
//   getDistance(a, b) {
//     return this.distances[a][b];
//   },

//   /**
//        * Расчитывает полное расстояние маршрута
//        *
//        */
//   getTotalDistance(route) {
//     let result = 0;

//     for (let i = 0; i < route.length - 1; i++) {
//       result += this.getDistance(route[i], route[i + 1]);
//     }
//     return result;
//   },

//   /**
//        * Предлагает начальный маршрут случайным образом
//        *
//        */
//   getInitialRoute() {
//     let points = [];

//     for (let i = 0; i < this.distances.length; i++) {
//       points[i] = i;
//     }

//     // 0 индекс никогда не меняет своей позиции - перемешываются только остальные
//     points = [points[0]].concat(this.shuffleArray(points.slice(1)));

//     return points;
//   },

//   /**
//        * Возвращает пару индексов - точки маршрута, которые меняются местами друг с другом
//        *
//        */
//   getIndicesToSwap() {
//     const i = this.getRandomIndexToSwap();
//     let j = 0;

//     do {
//       j = this.getRandomIndexToSwap();
//     } while (j == i);

//     return [i, j];
//   },

//   /**
//        * Возвращает новый маршрут после перестановки двух точек и его расстояние
//        * Чтобы не пересчитывать полное расстояние каждый раз, пересчитываем
//        * только изменившееся части маршрута
//        */
//   getNewRouteData(route, indices, cost) {
//     // before swap
//     const paths = this.findPathsAffectedBySwap(indices, route.length);
//     cost = this.calculateCostOnSwap(route, cost, paths, false);

//     const swap = route[indices[0]];
//     route[indices[0]] = route[indices[1]];
//     route[indices[1]] = swap;

//     // after swap
//     cost = this.calculateCostOnSwap(route, cost, paths, true);
//     return { route, cost };
//   },

//   /**
//        * Находит участки пути, которые изменяются из-за перестановки двух точек
//        *
//        */
//   findPathsAffectedBySwap(indices, length) {
//     const result = [];
//     const hash = {};

//     for (let k = 0; k < 2; ++k) {
//       const i = indices[k];
//       let j = i - 1;
//       if (j >= 0) {
//         hash[`${j}-${i}`] = true;
//       }

//       j = i + 1;
//       if (j < length) {
//         hash[`${i}-${j}`] = true;
//       }
//     }

//     for (key in hash) {
//       result.push(key.split('-'));
//     }
//     return result;
//   },

//   /**
//        * Считает изменение общего расстояния при перестановке двух точек маршрута
//        *
//        */
//   calculateCostOnSwap(route, cost, paths, plus) {
//     var plus = plus || false;
//     const sign = plus ? 1 : -1;
//     for (let k = 0; k < paths.length; ++k) {
//       const i = route[paths[k][0]];
//       const j = route[paths[k][1]];
//       cost += sign * this.getDistance(i, j);
//     }
//     return cost;
//   },

//   /**
//        * Возвращает случайный индекс(от 1 до максимального)
//        *
//        */
//   getRandomIndexToSwap() {
//     return this.getRandomNumber(this.distances.length - 1) + 1;
//   },

//   /**
//        * Возвращает случайное число 0 до n-1
//        *
//        */
//   getRandomNumber(n) {
//     const fraction = 1 / n;
//     return Math.floor(Math.random() / fraction);
//   },

//   /**
//        * http://dzone.com/snippets/array-shuffle-javascript
//        * Перемешивает массив случайным образом
//        */
//   shuffleArray(o) {
//     for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
//     return o;
//   },
// };

// /**
//    * Класс, который отображает маршрут на карте и выводит другие результаты
//    *
//    *
//    */
// function RouteMapper(points, times, distanceData, currentRoute, allRoutes) {
//   this.points = points;
//   this.times = times;
//   this.distanceData = distanceData;
//   this.optimal = currentRoute;
//   this.routes = allRoutes;

//   this.map = new ymaps.Map('map', {
//     center: [57.931311, 34.576128],
//     zoom: 6,
//   });

//   const trafficControl = new ymaps.control.TrafficControl({ shown: false });
//   this.map.controls.add(trafficControl, { top: 10, right: 10 }); // добавление возможности показывать пробки
//   this.map.controls.add('zoomControl', { top: 10, left: 10 }); // добавление управления масштабами

//   this.displayedRoute = null;
// }

// RouteMapper.prototype = {

//   /**
//        * Отобразить маршрут на карте
//        *
//        *
//        */
//   // mapRoute(routeNum) {
//   //   routeNum = routeNum || 0;

//   //   currentRoute = this.getRoute(this.routes.routes[routeNum]);

//   //   const self = this;

//   //   $('#status').hide();
//   //   ymaps.route(currentRoute.names, {
//   //     mapStateAutoApply: true,
//   //   }).then((route) => {
//   //     if (self.displayedRoute) {
//   //       self.map.geoObjects.remove(self.displayedRoute);
//   //     }
//   //     self.map.geoObjects.add(route);
//   //     self.displayedRoute = route;

//   //     // output
//   //     const lines = [];
//   //     let totalTime = 0;
//   //     let totalLength = 0;

// //       for (let k = 1; k < currentRoute.ids.length; k++) {
// //         var i = currentRoute.ids[k - 1];
// //         const j = currentRoute.ids[k];

// //         const key = `${i}-${j}`;
// //         const stopTime = self.times[j] * 60;
// //         lines.push(`<b>${currentRoute.names[k - 1]} - ${currentRoute.names[k]}</b>: ${
// //           self.getHumanLength(self.distanceData[key].length)}, ${
// //           self.getHumanTime(self.distanceData[key].time)} + остановка ${
// //           self.getHumanTime(stopTime)}`);

// //         totalTime += self.distanceData[key].time + stopTime;
// //         totalLength += self.distanceData[key].length;
// //       }

// //       const $total = $('#route h3');
// //       $total.html(`Полный маршрут: ${self.getHumanLength(totalLength)}, ${self.getHumanTime(totalTime)}`);

// //       const $routeAlternate = $('#route a');
// //       $routeAlternate.show();

// //       const $list = $('#route ol.list');
// //       $list.html('');

// //       for (var i = 0; i < lines.length; i++) {
// //         $list.append(`<li>${lines[i]}</li>`);
// //       }

// //       const $alternate = $('#alternate ol');
// //       $alternate.html('');

// //       for (var i = 0; i < self.routes.routes.length; i++) {
// //         $alternate.append(`<li><a class="js${i == routeNum ? ' current' : ''}" onclick="Mapper.mapRoute(${i});">${self.getHumanLength(self.routes.lengths[i])}</a></li>`);
// //       }
// //     }, (error) => {
// //       alert(`Возникла ошибка: ${error.message}`);
// //       console.log(error);
// //     });
// //   },

// //   /**
// //        * Получение данных о маршруте
// //        *
// //        *
// //        */
// //   getRoute(route) {
// //     const result = { ids: [], names: [] };

// //     for (let i = 0; i < route.length; i++) {
// //       result.ids.push(route[i]);
// //       result.names.push(this.points[route[i]]);
// //     }
// //     return result;
// //   },

// //   /**
// //        * Вернуть время в человекочитаемом формате :)
// //        *
// //        *
// //        */
// //   getHumanTime(seconds) {
// //     let hours = seconds / 3600;
// //     const minutes = Math.round((seconds % 3600) / 60);
// //     hours = Math.floor(hours);
// //     let result = '';

// //     if (hours) {
// //       result = `${hours} ч. `;
// //     }
// //     return `${result + minutes} мин.`;
// //   },

// //   /**
// //        * Вернуть расстояние в человеческом формате :)
// //        *
// //        *
// //        */
// //   getHumanLength(meters) {
// //     return `${(meters / 1000).toFixed(1)} км.`;
// //   },
// // };
