'use strict';
var COUNT = 8;
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

var OFFER_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];

var OFFER_TYPES = [
  {'en': 'flat', 'ru': 'квартира'},
  {'en': 'house', 'ru': 'дом'},
  {'en': 'bungalo', 'ru': 'бунгало'}
];

var OFFER_CHECKS = ['12:00', '13:00', '14:00'];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

var randomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
var arrRandomElem = function (arrName) {
  return arrName[randomNumber(0, arrName.length - 1)];
};
var randomFeatures = function (data) {
  var features = data.slice();
  features.length = randomNumber(1, data.length);
  return features;
};
var checkOut = function (time) {
  if (time === '12:00') {
    return time;
  } else if (time === '13:00') {
    return OFFER_CHECKS[randomNumber(0, 1)];
  } else {
    return arrRandomElem(OFFER_CHECKS);
  }
};

var sentence = function (imgNum, caption, time) {
  return {
    'author': {
      'avatar': 'img/avatars/user0' + imgNum + '.png'
    },
    'offer': {
      'title': caption,
      'adress': randomNumber(300, 900) + ',' + randomNumber(100, 500),
      'price': randomNumber(1000, 1000000),
      'type': arrRandomElem(OFFER_TYPES),
      'rooms': randomNumber(1, 5),
      'guests': randomNumber(1, 10),
      'checkin': time,
      'checkout': checkOut(time),
      'features': randomFeatures(OFFER_FEATURES),
      'description': '',
      'photos': []
    },
    'location': {
      'x': randomNumber(300, 900),
      'y': randomNumber(100, 500)
    }
  };
};

var sentences = [];
var createOffers = function () {
  for (var i = 0; i < COUNT; i++) {
    var avatarNumber = i + 1;
    var title = OFFER_TITLES[i];
    var checkin = arrRandomElem(OFFER_CHECKS);
    sentences.push(sentence(avatarNumber, title, checkin));
  }
};
createOffers();

var pinMap = document.querySelector('.tokyo__pin-map');
var pinWidth = 56;
var pinHeight = 75;

var renderPin = function (data) {
  var newPin = document.createElement('div');
  newPin.className = 'pin';
  newPin.style = 'left: ' + (data.location.x + pinWidth / 2) + 'px; top: ' + (data.location.y + pinHeight) + 'px';
  newPin.innerHTML = '<img src="' + data.author.avatar + '" class="rounded" width="40" height="40">';
  newPin.tabIndex = 0;
  return newPin;
};

var renderMap = function () {
  var fragment = document.createDocumentFragment();
  for (var n = 0; n < sentences.length; n++) {
    fragment.appendChild(renderPin(sentences[n]));
  }
  return fragment;
};
pinMap.appendChild(renderMap());

var lodgeTemplate = document.querySelector('#lodge-template').content;
var offerDialog = document.querySelector('#offer-dialog');
offerDialog.classList.add('hidden');

var dialogTitleAvatar = offerDialog.querySelector('.dialog__title img');

var servicesList = function (data) {
  var services = document.createDocumentFragment();
  for (var i = 0; i < data.length; i++) {
    var service = document.createElement('span');
    service.className = 'feature__image feature__image--' + data[i];
    services.appendChild(service);
  }
  return services;
};

var renderLodge = function (data) {
  var dialogPanel = offerDialog.querySelector('.dialog__panel');
  var sentenceElement = lodgeTemplate.cloneNode(true);
  sentenceElement.querySelector('.lodge__title').textContent = data.offer.title;
  sentenceElement.querySelector('.lodge__address').textContent = data.offer.adress;
  sentenceElement.querySelector('.lodge__price').textContent = data.offer.price + '₽/ночь';
  sentenceElement.querySelector('.lodge__type').textContent = data.offer.type.ru;
  sentenceElement.querySelector('.lodge__rooms-and-guests').textContent = 'Для ' + data.offer.guests + ' гостей в ' + data.offer.rooms + ' комнатах';
  sentenceElement.querySelector('.lodge__checkin-time').textContent = 'Заезд после ' + data.offer.checkin + ', выезд до ' + data.offer.checkout;
  sentenceElement.querySelector('.lodge__features').appendChild(servicesList(data.offer.features));
  sentenceElement.querySelector('.lodge__description').textContent = data.offer.description;

  offerDialog.replaceChild(sentenceElement, dialogPanel);

  dialogTitleAvatar.src = data.author.avatar;
};

var removeActiveClass = function () {
  var pin = pinMap.querySelector('.pin--active');
  if (pin !== null) {
    pin.classList.remove('pin--active');
  }
};

var openCard = function () {
  offerDialog.classList.remove('hidden');
  removeActiveClass();
};

var targetCard = function (data) {
  var targetObject = {};
  sentences.forEach(function (item, index) {
    if (data.indexOf(item.author.avatar) >= 0) {
      targetObject = sentences[index];
    }
  });
  renderLodge(targetObject);
};

var onMapClick = function (evt) {
  openCard();
  var src = '';
  if (evt.target.classList.contains('pin')) {
    src = evt.target.firstChild.src;
    evt.target.classList.add('pin--active');
  } else if (evt.target.tagName === 'IMG') {
    src = evt.target.src;
    evt.target.parentElement.classList.add('pin--active');
  }
  targetCard(src);
};

pinMap.addEventListener('click', onMapClick);

var onPinPressEnt = function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    var focused = document.activeElement;
    var pins = pinMap.querySelectorAll('.pin');
    pins.forEach(function (item) {
      if (item === focused) {
        openCard();
        focused.classList.add('pin--active');
        var src = focused.firstChild.src;
        targetCard(src);
      }
    });
  }
};

pinMap.addEventListener('keydown', onPinPressEnt);

var dialogClose = offerDialog.querySelector('.dialog__close');
dialogClose.tabIndex = 0;

var closeCard = function () {
  offerDialog.classList.add('hidden');
  removeActiveClass();
};

var onCardClose = function (evt) {
  evt.preventDefault();
  closeCard();
};

dialogClose.addEventListener('click', onCardClose);

dialogClose.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    onCardClose;
  }
});

document.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeCard();
  }
});
