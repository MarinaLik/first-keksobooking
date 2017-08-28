'use strict';
var randomNumber = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
var arrRandomElem = function(arrName) {
  return arrName[randomNumber(0, arrName.length-1)];
};

var offerTitles = ["Большая уютная квартира", "Маленькая неуютная квартира", "Огромный прекрасный дворец", "Маленький ужасный дворец", "Красивый гостевой домик", "Некрасивый негостеприимный домик", "Уютное бунгало далеко от моря", "Неуютное бунгало по колено в воде"];
var offerTypes = ['flat', 'house', 'bungalo'];
var offerChecks = ['12:00', '13:00', '14:00'];
var offerFeatures = ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"];

var neighbor = {
  "author": {
    "avatar": 'img/avatars/user{{0' + randomNumber(1, 8) + '}}.png'
  },
  "offer": {
    "title": arrRandomElem(offerTitles),
    "adress": '{{location.x}}, {{location.y}}', //?
    "price": randomNumber(1000, 1000000),
    "type": arrRandomElem(offerTypes),
    "rooms": randomNumber(1, 5),
    "guests": randomNumber(1, 10), // max взят произвольно
    "checkin": arrRandomElem(offerChecks),
    "checkout": arrRandomElem(offerChecks), // д.б. расчет, т.к. checkout <= checkin
    "features": function() {
      var randomFeatures = offerFeatures.slice();
      randomFeatures.length = randomNumber(1, offerFeatures.length);
      return randomFeatures;
    },
    "description": '',
    "photos": []
  },
  "location": {
    "x": randomNumber(300, 900),
    "y": randomNumber(100, 500)
  }
};

var neighbors = [];
for (var i = 0; i < 7; i++) {
  neighbors[i] = neighbor;
  var n = neighbors[i];
  neighbors.push(n);
}; // почему при i<8 получается 9 элементов массива?

var pinMap = document.querySelector('.tokyo__pin-map');
var pinWidth = 75;
var pinHeight = 94;

var fragment = document.createDocumentFragment();
for (var n = 0; n < neighbors.length; n++) {
var newPin = document.createElement('div');
newPin.className = 'pin';
newPin.style = 'left: {{' + (neighbors[n].location.x - pinWidth / 2) + '}}px; top: {{' + (neighbors[n].location.y - pinHeight) + '}}px';
newPin.innerHTML = '<img src="{{' + neighbors[n].author.avatar + '}}" class="rounded" width="40" height="40">';
// не определяется значение style, не находит src в img
fragment.appendChild(newPin); // добавляется один и тот же div
}
pinMap.appendChild(fragment);

var lodgeTemplate = document.querySelector('#lodge-template').content;
for (var i = 0; i < neighbors.length; i++) {
  var neighborElement = lodgeTemplate.cloneNode(true);
  neighborElement.querySelector('.lodge__title').textContent = neighbors[i].offer.title;
  neighborElement.querySelector('.lodge__address').textContent = neighbors[i].offer.adress;
  neighborElement.querySelector('.lodge__price').textContent = '{{' + neighbors[i].offer.price + '}}&#x20bd;/ночь';
  var neighborType = function() {
  if (neighbors[i].offer.type === 'flat') {
  return 'Квартира';
  } else if (neighbors[i].offer.type === 'bungalo') {
  return 'Бунгало';
  } else {
    return 'Дом';
  }
};
  neighborElement.querySelector('.lodge__type').textContent = neighborType();
  neighborElement.querySelector('..lodge__rooms-and-guests').textContent = 'Для {{' + neighbors[i].offer.guests + '}} гостей в {{' + neighbors[i].offer.rooms + '}} комнатах';
  neighborElement.querySelector('.lodge__checkin-time').textContent = 'Заезд после {{' + neighbors[i].offer.checkin + '}}, выезд до {{' + neighbors[i].offer.checkout + '}}';
  // neighborElement.querySelector('.lodge__features').innerHTML = '<span class="feature__image feature__image--{{' + neighbors[i].offer.features[] + '}}"</span>';
  neighborElement.querySelector('.lodge__description').textContent = neighbors[i].offer.description;
}
