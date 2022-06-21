/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
//On importe le package de unsplash (https://github.com/unsplash/unsplash-js#installation)


function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _unsplashJs = __webpack_require__(3);

//On se connecte à l'API de unsplash (https://github.com/unsplash/unsplash-js#usage)
var unsplash = (0, _unsplashJs.createApi)({ accessKey: 'Qj3FYvMNkII7Jytb0DMDWUzu8NR2ww0KcCGCJkMa-XM' });

var form = document.querySelector(".search-form__form");
var input = document.querySelector(".search-form__input");
var button = document.querySelector('.search-form__submit');
var msg = document.querySelector(".search-form__msg");
var cities = document.querySelector(".cities");
var save_search = document.querySelector(".save-search__list");
var apiKey = "1f3b48fa7c4b0931df614338674f9a69";

//Function pour lancer la recherche
var searchWeather = function searchWeather() {
  var customCity = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

  var inputVal = input.value;

  //check if there's already a city
  var listItems = cities.querySelectorAll(".city");
  var listItemsArray = Array.from(listItems);

  if (listItemsArray.length > 0) {
    listItemsArray.forEach(function (item) {
      item.remove();
    });

    var filteredArray = listItemsArray.filter(function (el) {
      var content = "";
      //athens,gr
      if (inputVal.includes(",")) {
        //athens,grrrrrr->invalid country code, so we keep only the first part of inputVal
        if (inputVal.split(",")[1].length > 2) {
          inputVal = inputVal.split(",")[0];
          content = el.querySelector(".city-name span").textContent.toLowerCase();
        } else {
          content = el.querySelector(".city-name").dataset.name.toLowerCase();
        }
      } else {
        //athens
        content = el.querySelector(".city-name span").textContent.toLowerCase();
      }
      return content == inputVal.toLowerCase();
    });

    if (filteredArray.length > 0) {
      msg.textContent = 'Vous connaissez déjà la météo pour ' + filteredArray[0].querySelector(".city-name span").textContent + ' ...sinon, soyez plus précis en indiquant également le code du pays. 😉';
      form.reset();
      input.focus();
      return;
    }
  }

  if (customCity != '') {
    inputVal = customCity;
    input.val = customCity;
  }
  //ajax here
  var url = 'https://api.openweathermap.org/data/2.5/forecast?q=' + inputVal + '&appid=' + apiKey + '&units=metric&lang=fr';

  fetch(url).then(function (response) {
    return response.json();
  }).then(function (data) {
    var city = data.city;
    var list = data.list;

    document.querySelector('.search-form__city').textContent = city.name;

    //On crée un tableau pour stocker le résulat des 5 prochains jours
    var days = [];

    //On créer une variable pour stocker l'index de chaque élément du tableau du résulat final
    var day_index = 0;

    //Date de la 1ere tranche horaire
    var date = new Date(list[0].dt_txt);
    var hour = date.getHours();
    var index_next_day = (24 - hour) / 3;

    //On va stocker toutes les donneés de la journée en cours puis les supprimer de la liste
    var current_day = getCurrentDayData(list, date, false, index_next_day);

    //On va stocker les données de la journée actuelle pour ajouter un block supplémentaire si on est pas encore la nuit
    var current_day_extra = false;
    current_day_extra = getCurrentDayData(list, date, true, index_next_day);

    //On supprime les éléments du tableau du jour actuel jusqu'au jour suivant
    list.splice(0, index_next_day); // 0 = index de départ et index_next_day = le nombre d'éléments du tableau à supprimer

    //On parcoure chaque élément retournées par l'API
    list.forEach(function (item, index) {
      var _item$main = item.main;
      var temp = _item$main.temp;
      var humidity = _item$main.humidity;
      var _item$wind = item.wind;
      var speed = _item$wind.speed;
      var deg = _item$wind.deg;

      var icon = item.weather[0].icon;
      var weather_desc = item.weather[0].description;

      var date_txt = item.dt_txt;
      var date = new Date(date_txt);
      var day = date.toLocaleDateString("fr-FR", { weekday: "long" }); // toLocaleDateString convertit une date au format de la lang souhaitée

      if (index == 0 || index % 8 == 0 && index < 32) {
        days[day_index] = {};
        days[day_index].temp = [];
        days[day_index].icon = [];
        days[day_index].weather_desc = [];
        days[day_index].humidity = humidity;
        days[day_index].day = day;
        days[day_index].wind_speed = speed;
        days[day_index].wind_deg = deg;
        day_index++;
      }

      //On stocke dans un tableau pour chaque jour, les températures de toute la jounrée (0:00,3:00,6:00...)
      if (index >= 0 && index < 8) {
        days[0].temp.push(temp);
        days[0].icon.push(icon);
        days[0].weather_desc.push(weather_desc);
      } else if (index >= 8 && index < 16) {
        days[1].temp.push(temp);
        days[1].icon.push(icon);
        days[1].weather_desc.push(weather_desc);
      } else if (index >= 16 && index < 24) {
        days[2].temp.push(temp);
        days[2].icon.push(icon);
        days[2].weather_desc.push(weather_desc);
      } else if (index >= 24 && index < 32) {
        days[3].temp.push(temp);
        days[3].icon.push(icon);
        days[3].weather_desc.push(weather_desc);
      }
    });

    //On ajoute les données supplémentaires de la journée en cours si celui-ci doit s'afficher (donc si on est pas la nuit)
    if (current_day_extra != false) {
      days.unshift(current_day_extra);
    }

    //On ajoute les données de la journée actuelle au tableau avant d'afficher les résultats
    days.unshift(current_day);

    days.forEach(function (item, index) {
      //On récupère la température min de la journée et la maximum
      var temp_min = Math.min.apply(Math, _toConsumableArray(item.temp));
      var temp_max = Math.max.apply(Math, _toConsumableArray(item.temp));

      //On crée une variable pour stocker l'icone lorsqu'il est 6h du matin et 21h (ex: item.icon['00:00','03:00','06:00','09:00','12:00'..])
      var icon_from = '';
      var icon_to = '';
      if (item.icon.length > 1) {
        icon_from = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/' + item.icon[2] + '.svg';
        icon_to = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/' + item.icon[6] + '.svg';
      } else {
        icon_from = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/' + item.icon[0] + '.svg';
        icon_to = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/' + item.icon[0] + '.svg';
      }

      //On crée une variable pour stocker la description du temps à 6h et 21h
      var weather_desc_from = '';
      var weather_desc_to = '';
      if (item.weather_desc.length > 1) {
        weather_desc_from = item.weather_desc[2];
        weather_desc_to = item.weather_desc[7];
      } else {
        weather_desc_from = item.weather_desc[0];
        weather_desc_to = item.weather_desc[0];
      }
      /*
      <h2 className="city-name">
        <img src="https://countryflagsapi.com/svg/${city.country}" width="40" height="30">
      </h2>*/
      //On créer l'élément HTML pour afficher chaque résulat
      var li = document.createElement("li");
      li.classList.add("city");

      var markup = '\n          <span class="city__day">' + item.day + '</span>\n          <span class="city-name" style="display: none">\n            <span>' + city.name + '</span>\n          </span>';
      markup += '\n          <figure class="city__icon">';

      //Si les icones représentant le temps de la journée sont identique alors on affiche qu'une des deux
      if (icon_from != icon_to) {
        markup += '\n              <img src="' + icon_from + '" alt="' + weather_desc_from + '">\n              <img src="' + icon_to + '" alt="' + weather_desc_to + '">';
      } else {
        markup += '\n              <img src="' + icon_from + '" alt="' + weather_desc_from + '">';
      }
      markup += '\n          </figure>\n          <span class="city__humidity"><i class="humidity"></i> ' + item.humidity + ' %</span>\n          <span class="city__wind">' + item.wind_speed + ' <i class="wind" style="display: inline-block;transform: rotate(-' + item.wind_deg + 'deg)"></i></span>\n        ';
      markup += '<div class="city__temp">';
      //Si le temps min et max sont identique alors on affiche qu'une des deux temperatures
      if (Math.round(temp_min) != Math.round(temp_max)) {
        markup += '\n            <div class="city__temp__item">' + Math.round(temp_min) + '<sup>°C</sup></div>\n            <div class="city__temp__item">' + Math.round(temp_max) + '<sup>°C</sup></div>';
      } else {
        markup += '\n            <div class="city__temp__item">' + Math.round(temp_max) + '<sup>°C</sup></div>';
      }
      markup += '</div>';
      li.innerHTML = markup;
      cities.appendChild(li);
    });

    //On change le backgroud de la page
    changeBackground(city.name);

    //On sauvegarde la recherche dans le localstorage
    saveSearch(city.name);

    //On affiche la charte
    getChart(list, index_next_day);
  })['catch'](function (error) {
    console.log(error);
    msg.textContent = "Veuillez rechercher une ville valide 😩";
  });
};

//Function pour récupérer une série de photo sur Unsplash et en afficher une au hasard
var changeBackground = function changeBackground(city) {
  unsplash.search.getPhotos({
    query: city,
    page: 1,
    perPage: 10,
    orientation: 'portrait'
  }).then(function (data) {
    //On stocker dans une variable le nombre de résulat
    var nbr_result = data.response.results.length;

    if (data.errors) {
      console.log('error occurred: ', data.errors[0]);
    } else if (nbr_result == 0) {
      console.log('Aucun résultat');
    } else {
      //On récupère une image au hasard (entre 0 et le nombre maximum d'élément)
      var random_index = Math.floor(Math.random() * (nbr_result + 1));
      var bg_url = data.response.results[random_index].urls.regular;
      document.querySelector('.app-bg').style.backgroundImage = 'url(' + bg_url + ')';
    }
  });
};

//Function pour récupérer le moment de la journée
var getDayMoment = function getDayMoment(hour) {
  if (hour >= 12 && hour <= 17) {
    return 'afternoon';
  } else if (hour >= 17 || hour < 6) {
    return 'night';
  } else {
    return 'morning';
  }
};

var getCurrentDayData = function getCurrentDayData(list, date, extra, to) {
  if (extra === undefined) extra = false;

  var current_day = {};
  var hour = date.getHours();
  var day = date.toLocaleDateString("fr-FR", { weekday: "long" }); // toLocaleDateString convertit une date au format de la lang souhaitée
  var moment = getDayMoment(hour);
  var i = undefined;

  if (extra) {
    i = 2;
    if (moment == 'morning' || moment == 'night') {
      current_day.day = day;
    } else if (moment == 'afternoon') {
      current_day.day = 'Ce soir';
    }
  } else {
    i = 0;
    if (moment == 'morning') {
      current_day.day = 'Ce matin';
    } else if (moment == 'afternoon') {
      current_day.day = day;
    } else if (moment == 'night') {
      current_day.day = 'Cette nuit';
    }
  }

  if (i == 0) {
    //Si c'est le 1er bloc, on affiche que la temperature et le temps actuels
    current_day.temp = [list[i].main.temp];
    current_day.icon = [list[i].weather[0].icon];
  } else {
    //Si c'est le 2eme on affiche le min et max comme pour les autres jours et la variabilité du temps tout au long de la journée
    current_day.temp = getCurrentDayDataAverage(list, to, 'temp');
    current_day.icon = getCurrentDayDataAverage(list, to, 'icon');
  }
  current_day.weather_desc = list[i].weather[0].description;
  current_day.humidity = list[i].main.humidity;
  current_day.wind_speed = list[i].wind.speed;
  current_day.wind_deg = list[i].wind.deg;

  return current_day;
};

//Récupérer toutes les tranches de temperature de la journée en cours dans un tableau
var getCurrentDayDataAverage = function getCurrentDayDataAverage(list, to, type) {
  var arr = [];
  for (var i = 0; i < to; i++) {
    if (type == 'temp') {
      arr.push(list[i].main.temp);
    } else if (type == 'icon') {
      arr.push(list[i].weather[0].icon);
    }
  }
  return arr;
};

//Enregistrer le choix de l'utilisateur
var saveSearch = function saveSearch(query) {
  var queries = [];

  // On parse (parcoure) en JSON le résultat stocké dans le locale storage
  queries = JSON.parse(localStorage.getItem('queries')) || [];

  // On ajoute la dernière recherche aux sauvegardes
  console.log(queries.indexOf(query) == -1);
  if (queries.indexOf(query) == -1) {
    queries.push(query);
  }

  // On stocke le nouveau tableau avec tous les résultats dans le localstorage
  localStorage.setItem('queries', JSON.stringify(queries));
};

//Remplir la liste des anciennes recherches
var displayOldSearch = function displayOldSearch() {
  var queries = [];
  queries = JSON.parse(localStorage.getItem('queries')) || [];

  queries.forEach(function (item) {
    var li = document.createElement("li");
    li.classList.add("save-search__item");
    var markup = '<a href="#">' + item + '</a>';
    li.innerHTML = markup;
    save_search.appendChild(li);

    li.addEventListener('click', function (e) {
      input.value = item;
      button.click();
    });
  });
};

//Création de la charte avec Chart.js
var getChart = function getChart(list, to) {
  var canvas = document.getElementById("canvas");

  if (typeof window.chart != 'undefined') {
    chart.destroy();
  }

  // Apply multiply blend when drawing datasets
  var multiply = {
    beforeDatasetsDraw: function beforeDatasetsDraw(chart, options, el) {
      chart.ctx.globalCompositeOperation = 'multiply';
    },
    afterDatasetsDraw: function afterDatasetsDraw(chart, options) {
      chart.ctx.globalCompositeOperation = 'source-over';
    }
  };

  // Gradient color - this week
  var gradientThisWeek = canvas.getContext('2d').createLinearGradient(0, 0, 0, 150);
  gradientThisWeek.addColorStop(0, 'rgba(85, 85, 255,0.5)');
  gradientThisWeek.addColorStop(1, 'rgba(151, 135, 255,0.5)');

  // Gradient color - previous week
  var gradientPrevWeek = canvas.getContext('2d').createLinearGradient(0, 0, 0, 150);
  gradientPrevWeek.addColorStop(0, 'rgba(255, 85, 184,0.5)');
  gradientPrevWeek.addColorStop(1, 'rgba(255, 135, 135,0.5)');

  //On récup la date du 1er bloc de la liste des tranches de temperatures
  var date = new Date(list[0].dt_txt);
  var hour = date.getHours();
  var labels = [];
  for (var i = 0; i < 7; i++) {
    if (hour > 23) {
      hour = 0;
    }
    labels.push(hour + 'h');
    hour = hour + 3;
  }

  var config = {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Temperature',
        data: getCurrentDayDataAverage(list, to, 'temp'),
        fill: false,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 2,
        pointBackgroundColor: 'transparent',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 3,
        pointHoverBorderColor: 'rgba(255, 255, 255, 0.2)',
        pointHoverBorderWidth: 10,
        lineTension: 0
      }]
    },
    options: {
      responsive: false,
      elements: {
        point: {
          radius: 6,
          hitRadius: 6,
          hoverRadius: 6
        }
      },
      legend: {
        display: false
      },
      plugins: {
        legend: {
          labels: {
            color: "white"
          }
        }
      },
      scales: {
        y: {
          ticks: {
            color: "white"
          }
        },
        x: {
          ticks: {
            color: "white"
          }
        }
      }
    }
  };

  window.chart = new Chart(canvas, config);
};

//Lorsque qu'on soumet le formulaire de recherche
form.addEventListener("submit", function (e) {
  e.preventDefault();
  searchWeather();
  msg.textContent = "";
  form.reset();
  input.focus();
});

//On charge la météo par défaut pour Liège
searchWeather('Liège');

//On charge les anciennes recherches
displayOldSearch();

/*
EXEMPLE DE CONCATENATION
let nom = 'latifa';
console.log('Bonjour' + nom);
console.log(`Bonjour' ${nom}`);

let exemple_1 = '<h2 class="city-name" data-name="'+ name + ','+ sys.country +'">';
let exemple_2 = `<h2 class="city-name" data-name="${name},${sys.country}">`;
 
*/

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * content-type
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * RegExp to match *( ";" parameter ) in RFC 7231 sec 3.1.1.1
 *
 * parameter     = token "=" ( token / quoted-string )
 * token         = 1*tchar
 * tchar         = "!" / "#" / "$" / "%" / "&" / "'" / "*"
 *               / "+" / "-" / "." / "^" / "_" / "`" / "|" / "~"
 *               / DIGIT / ALPHA
 *               ; any VCHAR, except delimiters
 * quoted-string = DQUOTE *( qdtext / quoted-pair ) DQUOTE
 * qdtext        = HTAB / SP / %x21 / %x23-5B / %x5D-7E / obs-text
 * obs-text      = %x80-FF
 * quoted-pair   = "\" ( HTAB / SP / VCHAR / obs-text )
 */
var PARAM_REGEXP = /; *([!#$%&'*+.^_`|~0-9A-Za-z-]+) *= *("(?:[\u000b\u0020\u0021\u0023-\u005b\u005d-\u007e\u0080-\u00ff]|\\[\u000b\u0020-\u00ff])*"|[!#$%&'*+.^_`|~0-9A-Za-z-]+) */g;
var TEXT_REGEXP = /^[\u000b\u0020-\u007e\u0080-\u00ff]+$/;
var TOKEN_REGEXP = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/;

/**
 * RegExp to match quoted-pair in RFC 7230 sec 3.2.6
 *
 * quoted-pair = "\" ( HTAB / SP / VCHAR / obs-text )
 * obs-text    = %x80-FF
 */
var QESC_REGEXP = /\\([\u000b\u0020-\u00ff])/g;

/**
 * RegExp to match chars that must be quoted-pair in RFC 7230 sec 3.2.6
 */
var QUOTE_REGEXP = /([\\"])/g;

/**
 * RegExp to match type in RFC 7231 sec 3.1.1.1
 *
 * media-type = type "/" subtype
 * type       = token
 * subtype    = token
 */
var TYPE_REGEXP = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+\/[!#$%&'*+.^_`|~0-9A-Za-z-]+$/;

/**
 * Module exports.
 * @public
 */

exports.format = format;
exports.parse = parse;

/**
 * Format object to media type.
 *
 * @param {object} obj
 * @return {string}
 * @public
 */

function format(obj) {
  if (!obj || typeof obj !== 'object') {
    throw new TypeError('argument obj is required');
  }

  var parameters = obj.parameters;
  var type = obj.type;

  if (!type || !TYPE_REGEXP.test(type)) {
    throw new TypeError('invalid type');
  }

  var string = type;

  // append parameters
  if (parameters && typeof parameters === 'object') {
    var param;
    var params = Object.keys(parameters).sort();

    for (var i = 0; i < params.length; i++) {
      param = params[i];

      if (!TOKEN_REGEXP.test(param)) {
        throw new TypeError('invalid parameter name');
      }

      string += '; ' + param + '=' + qstring(parameters[param]);
    }
  }

  return string;
}

/**
 * Parse media type to object.
 *
 * @param {string|object} string
 * @return {Object}
 * @public
 */

function parse(string) {
  if (!string) {
    throw new TypeError('argument string is required');
  }

  // support req/res-like objects as argument
  var header = typeof string === 'object' ? getcontenttype(string) : string;

  if (typeof header !== 'string') {
    throw new TypeError('argument string is required to be a string');
  }

  var index = header.indexOf(';');
  var type = index !== -1 ? header.substr(0, index).trim() : header.trim();

  if (!TYPE_REGEXP.test(type)) {
    throw new TypeError('invalid media type');
  }

  var obj = new ContentType(type.toLowerCase());

  // parse parameters
  if (index !== -1) {
    var key;
    var match;
    var value;

    PARAM_REGEXP.lastIndex = index;

    while (match = PARAM_REGEXP.exec(header)) {
      if (match.index !== index) {
        throw new TypeError('invalid parameter format');
      }

      index += match[0].length;
      key = match[1].toLowerCase();
      value = match[2];

      if (value[0] === '"') {
        // remove quotes and escapes
        value = value.substr(1, value.length - 2).replace(QESC_REGEXP, '$1');
      }

      obj.parameters[key] = value;
    }

    if (index !== header.length) {
      throw new TypeError('invalid parameter format');
    }
  }

  return obj;
}

/**
 * Get content-type from req/res objects.
 *
 * @param {object}
 * @return {Object}
 * @private
 */

function getcontenttype(obj) {
  var header;

  if (typeof obj.getHeader === 'function') {
    // res-like
    header = obj.getHeader('content-type');
  } else if (typeof obj.headers === 'object') {
    // req-like
    header = obj.headers && obj.headers['content-type'];
  }

  if (typeof header !== 'string') {
    throw new TypeError('content-type header is missing from object');
  }

  return header;
}

/**
 * Quote a string if necessary.
 *
 * @param {string} val
 * @return {string}
 * @private
 */

function qstring(val) {
  var str = String(val);

  // no need to quote tokens
  if (TOKEN_REGEXP.test(str)) {
    return str;
  }

  if (str.length > 0 && !TEXT_REGEXP.test(str)) {
    throw new TypeError('invalid parameter value');
  }

  return '"' + str.replace(QUOTE_REGEXP, '\\$1') + '"';
}

/**
 * Class to represent a content type.
 * @private
 */
function ContentType(type) {
  this.parameters = Object.create(null);
  this.type = type;
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', {
  value: true
});

var _contentType = __webpack_require__(2);

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

var checkIsString = /*#__PURE__*/getRefinement(function (value) {
  return typeof value === 'string' ? value : null;
});
var isDefined = function isDefined(x) {
  return x !== null && x !== undefined;
};
function getRefinement(getB) {
  return function (a) {
    return isDefined(getB(a));
  };
}
var checkIsNonEmptyArray = function checkIsNonEmptyArray(a) {
  return a.length > 0;
};

/** Takes a dictionary containing nullish values and returns a dictionary of all the defined
 * (non-nullish) values.
 */

var compactDefined = function compactDefined(obj) {
  return Object.keys(obj).reduce(function (acc, key) {
    var _ref;

    var value = obj[key];
    return _extends({}, acc, isDefined(value) ? (_ref = {}, _ref[key] = value, _ref) : {});
  }, {});
};
function flow() {
  for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  var len = fns.length - 1;
  return function () {
    for (var _len2 = arguments.length, x = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      x[_key2] = arguments[_key2];
    }

    var y = fns[0].apply(this, x);

    for (var i = 1; i <= len; i++) {
      y = fns[i].call(this, y);
    }

    return y;
  };
}

var checkIsObject = /*#__PURE__*/getRefinement(function (response) {
  return isDefined(response) && typeof response === 'object' && !Array.isArray(response) ? response : null;
});
var checkIsErrors = /*#__PURE__*/getRefinement(function (errors) {
  return Array.isArray(errors) && errors.every(checkIsString) && checkIsNonEmptyArray(errors) ? errors : null;
});
var checkIsApiError = /*#__PURE__*/getRefinement(function (response) {
  return checkIsObject(response) && 'errors' in response && checkIsErrors(response.errors) ? {
    errors: response.errors
  } : null;
});
var getErrorForBadStatusCode = function getErrorForBadStatusCode(jsonResponse) {
  if (checkIsApiError(jsonResponse)) {
    return {
      errors: jsonResponse.errors,
      source: 'api'
    };
  } else {
    return {
      errors: ['Responded with a status code outside the 2xx range, and the response body is not recognisable.'],
      source: 'decoding'
    };
  }
};
var DecodingError = function DecodingError(message) {
  this.message = message;
};

var CONTENT_TYPE_RESPONSE_HEADER = 'content-type';
var CONTENT_TYPE_JSON = 'application/json';

var checkIsJsonResponse = function checkIsJsonResponse(response) {
  var contentTypeHeader = response.headers.get(CONTENT_TYPE_RESPONSE_HEADER);
  return isDefined(contentTypeHeader) && (0, _contentType.parse)(contentTypeHeader).type === CONTENT_TYPE_JSON;
};
/**
 * Note: restrict the type of JSON to `AnyJson` so that `any` doesn't leak downstream.
 */

var getJsonResponse = function getJsonResponse(response) {
  if (checkIsJsonResponse(response)) {
    return response.json()["catch"](function (_err) {
      throw new DecodingError('unable to parse JSON response.');
    });
  } else {
    throw new DecodingError('expected JSON response from server.');
  }
};

var handleFetchResponse = function handleFetchResponse(handleResponse) {
  return function (response) {
    return (response.ok ? handleResponse({
      response: response
    }).then(function (handledResponse) {
      return {
        type: 'success',
        status: response.status,
        response: handledResponse,
        originalResponse: response
      };
    }) : getJsonResponse(response).then(function (jsonResponse) {
      return _extends({
        type: 'error',
        status: response.status
      }, getErrorForBadStatusCode(jsonResponse), {
        originalResponse: response
      });
    }))["catch"](function (error) {
      /**
       * We want to separate expected decoding errors from unknown ones. We do so by throwing a custom
       * `DecodingError` whenever we encounter one within `handleFetchResponse` and catch them all
       * here. This allows us to easily handle all of these errors at once. Unexpected errors are not
       * caught, so that they bubble up and fail loudly.
       *
       * Note: Ideally we'd use an Either type, but this does the job without introducing dependencies
       * like `fp-ts`.
       */
      if (error instanceof DecodingError) {
        return {
          type: 'error',
          source: 'decoding',
          status: response.status,
          originalResponse: response,
          errors: [error.message]
        };
      } else {
        throw error;
      }
    });
  };
};
var castResponse = function castResponse() {
  return function (_ref) {
    var response = _ref.response;
    return getJsonResponse(response);
  };
};

var addQueryToUrl = function addQueryToUrl(query) {
  return function (url) {
    Object.keys(query).forEach(function (queryKey) {
      return url.searchParams.set(queryKey, query[queryKey].toString());
    });
  };
};

var addPathnameToUrl = function addPathnameToUrl(pathname) {
  return function (url) {
    // When there is no existing pathname, the value is `/`. Appending would give us a URL with two
    // forward slashes. This is why we replace the value in that scenario.
    if (url.pathname === '/') {
      url.pathname = pathname;
    } else {
      url.pathname += pathname;
    }
  };
};

var buildUrl = function buildUrl(_ref) {
  var pathname = _ref.pathname,
      query = _ref.query;
  return function (apiUrl) {
    var url = new URL(apiUrl);
    addPathnameToUrl(pathname)(url);
    addQueryToUrl(query)(url);
    return url.toString();
  };
};

var getQueryFromSearchParams = function getQueryFromSearchParams(searchParams) {
  var query = {};
  searchParams.forEach(function (value, key) {
    query[key] = value;
  });
  return query;
};

var parseQueryAndPathname = function parseQueryAndPathname(url) {
  var _URL = new URL(url),
      pathname = _URL.pathname,
      searchParams = _URL.searchParams;

  var query = getQueryFromSearchParams(searchParams);
  return {
    query: query,
    pathname: pathname === '/' ? undefined : pathname
  };
};

/**
 * helper used to type-check the arguments, and add default params for all requests
 */

var createRequestHandler = function createRequestHandler(fn) {
  return function (a, additionalFetchOptions) {
    if (additionalFetchOptions === void 0) {
      additionalFetchOptions = {};
    }

    var _fn = fn(a),
        headers = _fn.headers,
        query = _fn.query,
        baseReqParams = _objectWithoutPropertiesLoose(_fn, ["headers", "query"]);

    return _extends({}, baseReqParams, additionalFetchOptions, {
      query: query,
      headers: _extends({}, headers, additionalFetchOptions.headers)
    });
  };
};
var makeEndpoint = function makeEndpoint(endpoint) {
  return endpoint;
};
var initMakeRequest = function initMakeRequest(_ref) {
  var accessKey = _ref.accessKey,
      _ref$apiVersion = _ref.apiVersion,
      apiVersion = _ref$apiVersion === void 0 ? 'v1' : _ref$apiVersion,
      _ref$apiUrl = _ref.apiUrl,
      apiUrl = _ref$apiUrl === void 0 ? 'https://api.unsplash.com' : _ref$apiUrl,
      generalHeaders = _ref.headers,
      providedFetch = _ref.fetch,
      generalFetchOptions = _objectWithoutPropertiesLoose(_ref, ["accessKey", "apiVersion", "apiUrl", "headers", "fetch"]);

  return function (_ref2) {
    var handleResponse = _ref2.handleResponse,
        handleRequest = _ref2.handleRequest;
    return flow(handleRequest, function (_ref3) {
      var pathname = _ref3.pathname,
          query = _ref3.query,
          _ref3$method = _ref3.method,
          method = _ref3$method === void 0 ? 'GET' : _ref3$method,
          endpointHeaders = _ref3.headers,
          body = _ref3.body,
          signal = _ref3.signal;
      var url = buildUrl({
        pathname: pathname,
        query: query
      })(apiUrl);

      var fetchOptions = _extends({
        method: method,
        headers: _extends({}, generalHeaders, endpointHeaders, {
          'Accept-Version': apiVersion
        }, isDefined(accessKey) ? {
          Authorization: "Client-ID " + accessKey
        } : {}),
        body: body,
        signal: signal
      }, generalFetchOptions);

      var fetchToUse = providedFetch != null ? providedFetch : fetch;
      return fetchToUse(url, fetchOptions).then(handleFetchResponse(handleResponse));
    });
  };
};

var TOTAL_RESPONSE_HEADER = 'x-total';

var getTotalFromApiFeedResponse = function getTotalFromApiFeedResponse(response) {
  var totalsStr = response.headers.get(TOTAL_RESPONSE_HEADER);

  if (isDefined(totalsStr)) {
    var total = parseInt(totalsStr);

    if (Number.isInteger(total)) {
      return total;
    } else {
      throw new DecodingError("expected " + TOTAL_RESPONSE_HEADER + " header to be valid integer.");
    }
  } else {
    throw new DecodingError("expected " + TOTAL_RESPONSE_HEADER + " header to exist.");
  }
};

var handleFeedResponse = function handleFeedResponse() {
  return function (_ref) {
    var response = _ref.response;
    return castResponse()({
      response: response
    }).then(function (results) {
      return {
        results: results,
        total: getTotalFromApiFeedResponse(response)
      };
    });
  };
};

var getCollections = function getCollections(collectionIds) {
  return isDefined(collectionIds) ? {
    collections: collectionIds.join()
  } : {};
};
var getTopics = function getTopics(topicIds) {
  return isDefined(topicIds) ? {
    topics: topicIds.join()
  } : {};
};
var getFeedParams = function getFeedParams(_ref) {
  var page = _ref.page,
      perPage = _ref.perPage,
      orderBy = _ref.orderBy;
  return compactDefined({
    per_page: perPage,
    order_by: orderBy,
    page: page
  });
};

var COLLECTIONS_PATH_PREFIX = '/collections';
var getPhotos = /*#__PURE__*/(function () {
  var getPathname = function getPathname(_ref) {
    var collectionId = _ref.collectionId;
    return COLLECTIONS_PATH_PREFIX + "/" + collectionId + "/photos";
  };

  return makeEndpoint({
    getPathname: getPathname,
    handleRequest: createRequestHandler(function (_ref2) {
      var collectionId = _ref2.collectionId,
          orientation = _ref2.orientation,
          paginationParams = _objectWithoutPropertiesLoose(_ref2, ["collectionId", "orientation"]);

      return {
        pathname: getPathname({
          collectionId: collectionId
        }),
        query: compactDefined(_extends({}, getFeedParams(paginationParams), {
          orientation: orientation
        }))
      };
    }),
    handleResponse: handleFeedResponse()
  });
})();
var get = /*#__PURE__*/(function () {
  var getPathname = function getPathname(_ref3) {
    var collectionId = _ref3.collectionId;
    return COLLECTIONS_PATH_PREFIX + "/" + collectionId;
  };

  return makeEndpoint({
    getPathname: getPathname,
    handleRequest: createRequestHandler(function (_ref4) {
      var collectionId = _ref4.collectionId;
      return {
        pathname: getPathname({
          collectionId: collectionId
        }),
        query: {}
      };
    }),
    handleResponse: castResponse()
  });
})();
var list = /*#__PURE__*/(function () {
  var getPathname = function getPathname() {
    return COLLECTIONS_PATH_PREFIX;
  };

  return makeEndpoint({
    getPathname: getPathname,
    handleRequest: createRequestHandler(function (paginationParams) {
      if (paginationParams === void 0) {
        paginationParams = {};
      }

      return {
        pathname: getPathname(),
        query: getFeedParams(paginationParams)
      };
    }),
    handleResponse: handleFeedResponse()
  });
})();
var getRelated = /*#__PURE__*/(function () {
  var getPathname = function getPathname(_ref5) {
    var collectionId = _ref5.collectionId;
    return COLLECTIONS_PATH_PREFIX + "/" + collectionId + "/related";
  };

  return makeEndpoint({
    getPathname: getPathname,
    handleRequest: createRequestHandler(function (_ref6) {
      var collectionId = _ref6.collectionId;
      return {
        pathname: getPathname({
          collectionId: collectionId
        }),
        query: {}
      };
    }),
    handleResponse: castResponse()
  });
})();

var index = {
  __proto__: null,
  getPhotos: getPhotos,
  get: get,
  list: list,
  getRelated: getRelated
};

var PHOTOS_PATH_PREFIX = '/photos';
var list$1 = /*#__PURE__*/(function () {
  var _getPathname = function getPathname() {
    return PHOTOS_PATH_PREFIX;
  };

  return makeEndpoint({
    // Wrapper uses type trick to allow 0 args
    getPathname: function getPathname(_params) {
      return _getPathname();
    },
    handleRequest: createRequestHandler(function (feedParams) {
      if (feedParams === void 0) {
        feedParams = {};
      }

      return {
        pathname: PHOTOS_PATH_PREFIX,
        query: compactDefined(getFeedParams(feedParams))
      };
    }),
    handleResponse: handleFeedResponse()
  });
})();
var get$1 = /*#__PURE__*/(function () {
  var getPathname = function getPathname(_ref) {
    var photoId = _ref.photoId;
    return PHOTOS_PATH_PREFIX + "/" + photoId;
  };

  return makeEndpoint({
    getPathname: getPathname,
    handleRequest: createRequestHandler(function (_ref2) {
      var photoId = _ref2.photoId;
      return {
        pathname: getPathname({
          photoId: photoId
        }),
        query: {}
      };
    }),
    handleResponse: castResponse()
  });
})();
var getStats = /*#__PURE__*/(function () {
  var getPathname = function getPathname(_ref3) {
    var photoId = _ref3.photoId;
    return PHOTOS_PATH_PREFIX + "/" + photoId + "/statistics";
  };

  return makeEndpoint({
    getPathname: getPathname,
    handleRequest: createRequestHandler(function (_ref4) {
      var photoId = _ref4.photoId;
      return {
        pathname: getPathname({
          photoId: photoId
        }),
        query: {}
      };
    }),
    handleResponse: castResponse()
  });
})();
var getRandom = /*#__PURE__*/(function () {
  var getPathname = function getPathname() {
    return PHOTOS_PATH_PREFIX + "/random";
  };

  return makeEndpoint({
    getPathname: getPathname,
    handleRequest: createRequestHandler(function (_temp) {
      var _ref5 = _temp === void 0 ? {} : _temp,
          collectionIds = _ref5.collectionIds,
          contentFilter = _ref5.contentFilter,
          topicIds = _ref5.topicIds,
          queryParams = _objectWithoutPropertiesLoose(_ref5, ["collectionIds", "contentFilter", "topicIds"]);

      return {
        pathname: getPathname(),
        query: compactDefined(_extends({}, queryParams, {
          content_filter: contentFilter
        }, getCollections(collectionIds), getTopics(topicIds))),
        headers: {
          /**
           * Avoid response caching
           */
          'cache-control': 'no-cache'
        }
      };
    }),
    handleResponse: castResponse()
  });
})();
var trackDownload = {
  handleRequest: /*#__PURE__*/createRequestHandler(function (_ref6) {
    var downloadLocation = _ref6.downloadLocation;

    var _parseQueryAndPathnam = parseQueryAndPathname(downloadLocation),
        pathname = _parseQueryAndPathnam.pathname,
        query = _parseQueryAndPathnam.query;

    if (!isDefined(pathname)) {
      throw new Error('Could not parse pathname from url.');
    }

    return {
      pathname: pathname,
      query: compactDefined(query)
    };
  }),
  handleResponse: /*#__PURE__*/castResponse()
};

var index$1 = {
  __proto__: null,
  list: list$1,
  get: get$1,
  getStats: getStats,
  getRandom: getRandom,
  trackDownload: trackDownload
};

var SEARCH_PATH_PREFIX = "/search";
var getPhotos$1 = /*#__PURE__*/(function () {
  var _getPathname = function getPathname() {
    return SEARCH_PATH_PREFIX + "/photos";
  };

  return makeEndpoint({
    // Wrapper uses type trick to allow 0 args
    getPathname: function getPathname(_params) {
      return _getPathname();
    },
    handleRequest: createRequestHandler(function (_ref) {
      var query = _ref.query,
          page = _ref.page,
          perPage = _ref.perPage,
          orderBy = _ref.orderBy,
          collectionIds = _ref.collectionIds,
          lang = _ref.lang,
          contentFilter = _ref.contentFilter,
          filters = _objectWithoutPropertiesLoose(_ref, ["query", "page", "perPage", "orderBy", "collectionIds", "lang", "contentFilter"]);

      return {
        pathname: _getPathname(),
        query: compactDefined(_extends({
          query: query,
          content_filter: contentFilter,
          lang: lang,
          order_by: orderBy
        }, getFeedParams({
          page: page,
          perPage: perPage
        }), getCollections(collectionIds), filters))
      };
    }),
    handleResponse: castResponse()
  });
})();
var getCollections$1 = /*#__PURE__*/(function () {
  var _getPathname2 = function getPathname() {
    return SEARCH_PATH_PREFIX + "/collections";
  };

  return makeEndpoint({
    // Wrapper uses type trick to allow 0 args
    getPathname: function getPathname(_params) {
      return _getPathname2();
    },
    handleRequest: createRequestHandler(function (_ref2) {
      var query = _ref2.query,
          paginationParams = _objectWithoutPropertiesLoose(_ref2, ["query"]);

      return {
        pathname: _getPathname2(),
        query: _extends({
          query: query
        }, getFeedParams(paginationParams))
      };
    }),
    handleResponse: castResponse()
  });
})();
var getUsers = /*#__PURE__*/(function () {
  var _getPathname3 = function getPathname() {
    return SEARCH_PATH_PREFIX + "/users";
  };

  return makeEndpoint({
    // Wrapper uses type trick to allow 0 args
    getPathname: function getPathname(_params) {
      return _getPathname3();
    },
    handleRequest: createRequestHandler(function (_ref3) {
      var query = _ref3.query,
          paginationParams = _objectWithoutPropertiesLoose(_ref3, ["query"]);

      return {
        pathname: _getPathname3(),
        query: _extends({
          query: query
        }, getFeedParams(paginationParams))
      };
    }),
    handleResponse: castResponse()
  });
})();

var index$2 = {
  __proto__: null,
  getPhotos: getPhotos$1,
  getCollections: getCollections$1,
  getUsers: getUsers
};

var USERS_PATH_PREFIX = '/users';
var get$2 = /*#__PURE__*/(function () {
  var getPathname = function getPathname(_ref) {
    var username = _ref.username;
    return USERS_PATH_PREFIX + "/" + username;
  };

  return makeEndpoint({
    getPathname: getPathname,
    handleRequest: createRequestHandler(function (_ref2) {
      var username = _ref2.username;
      return {
        pathname: getPathname({
          username: username
        }),
        query: {}
      };
    }),
    handleResponse: castResponse()
  });
})();
var getPhotos$2 = /*#__PURE__*/(function () {
  var getPathname = function getPathname(_ref3) {
    var username = _ref3.username;
    return USERS_PATH_PREFIX + "/" + username + "/photos";
  };

  return makeEndpoint({
    getPathname: getPathname,
    handleRequest: createRequestHandler(function (_ref4) {
      var username = _ref4.username,
          stats = _ref4.stats,
          orientation = _ref4.orientation,
          paginationParams = _objectWithoutPropertiesLoose(_ref4, ["username", "stats", "orientation"]);

      return {
        pathname: getPathname({
          username: username
        }),
        query: compactDefined(_extends({}, getFeedParams(paginationParams), {
          orientation: orientation,
          stats: stats
        }))
      };
    }),
    handleResponse: handleFeedResponse()
  });
})();
var getLikes = /*#__PURE__*/(function () {
  var getPathname = function getPathname(_ref5) {
    var username = _ref5.username;
    return USERS_PATH_PREFIX + "/" + username + "/likes";
  };

  return makeEndpoint({
    getPathname: getPathname,
    handleRequest: createRequestHandler(function (_ref6) {
      var username = _ref6.username,
          orientation = _ref6.orientation,
          paginationParams = _objectWithoutPropertiesLoose(_ref6, ["username", "orientation"]);

      return {
        pathname: getPathname({
          username: username
        }),
        query: compactDefined(_extends({}, getFeedParams(paginationParams), {
          orientation: orientation
        }))
      };
    }),
    handleResponse: handleFeedResponse()
  });
})();
var getCollections$2 = /*#__PURE__*/(function () {
  var getPathname = function getPathname(_ref7) {
    var username = _ref7.username;
    return USERS_PATH_PREFIX + "/" + username + "/collections";
  };

  return makeEndpoint({
    getPathname: getPathname,
    handleRequest: createRequestHandler(function (_ref8) {
      var username = _ref8.username,
          paginationParams = _objectWithoutPropertiesLoose(_ref8, ["username"]);

      return {
        pathname: getPathname({
          username: username
        }),
        query: getFeedParams(paginationParams)
      };
    }),
    handleResponse: handleFeedResponse()
  });
})();

var index$3 = {
  __proto__: null,
  get: get$2,
  getPhotos: getPhotos$2,
  getLikes: getLikes,
  getCollections: getCollections$2
};

var BASE_TOPIC_PATH = '/topics';

var getTopicPath = function getTopicPath(_ref) {
  var topicIdOrSlug = _ref.topicIdOrSlug;
  return BASE_TOPIC_PATH + "/" + topicIdOrSlug;
};

var list$2 = /*#__PURE__*/makeEndpoint({
  getPathname: getTopicPath,
  handleRequest: function handleRequest(_ref2) {
    var page = _ref2.page,
        perPage = _ref2.perPage,
        orderBy = _ref2.orderBy,
        topicIdsOrSlugs = _ref2.topicIdsOrSlugs;
    return {
      pathname: BASE_TOPIC_PATH,
      query: compactDefined(_extends({}, getFeedParams({
        page: page,
        perPage: perPage
      }), {
        ids: topicIdsOrSlugs == null ? void 0 : topicIdsOrSlugs.join(','),
        order_by: orderBy
      }))
    };
  },
  handleResponse: /*#__PURE__*/handleFeedResponse()
});
var get$3 = /*#__PURE__*/makeEndpoint({
  getPathname: getTopicPath,
  handleRequest: function handleRequest(_ref3) {
    var topicIdOrSlug = _ref3.topicIdOrSlug;
    return {
      pathname: getTopicPath({
        topicIdOrSlug: topicIdOrSlug
      }),
      query: {}
    };
  },
  handleResponse: /*#__PURE__*/castResponse()
});
var getPhotos$3 = /*#__PURE__*/(function () {
  var getPathname = /*#__PURE__*/flow(getTopicPath, function (topicPath) {
    return topicPath + "/photos";
  });
  return makeEndpoint({
    getPathname: getPathname,
    handleRequest: function handleRequest(_ref4) {
      var topicIdOrSlug = _ref4.topicIdOrSlug,
          orientation = _ref4.orientation,
          feedParams = _objectWithoutPropertiesLoose(_ref4, ["topicIdOrSlug", "orientation"]);

      return {
        pathname: getPathname({
          topicIdOrSlug: topicIdOrSlug
        }),
        query: compactDefined(_extends({}, getFeedParams(feedParams), {
          orientation: orientation
        }))
      };
    },
    handleResponse: handleFeedResponse()
  });
})();

var index$4 = {
  __proto__: null,
  list: list$2,
  get: get$3,
  getPhotos: getPhotos$3
};

var trackNonHotLinkedPhotoView = function trackNonHotLinkedPhotoView(_ref) {
  var appId = _ref.appId;
  return function (_ref2) {
    var photoId = _ref2.photoId;
    var ids = !Array.isArray(photoId) ? [photoId] : photoId;

    if (ids.length > 20) {
      throw new Error('You cannot track more than 20 photos at once. Please try again with fewer photos.');
    }

    return fetch("views.unsplash.com/v?photo_id=" + ids.join() + "&app_id=" + appId);
  };
};

var internals = {
  __proto__: null,
  collections: index,
  photos: index$1,
  search: index$2,
  users: index$3,
  topics: index$4,
  trackNonHotLinkedPhotoView: trackNonHotLinkedPhotoView
};

var Language;

(function (Language) {
  Language["Afrikaans"] = "af";
  Language["Amharic"] = "am";
  Language["Arabic"] = "ar";
  Language["Azerbaijani"] = "az";
  Language["Belarusian"] = "be";
  Language["Bulgarian"] = "bg";
  Language["Bengali"] = "bn";
  Language["Bosnian"] = "bs";
  Language["Catalan"] = "ca";
  Language["Cebuano"] = "ceb";
  Language["Corsican"] = "co";
  Language["Czech"] = "cs";
  Language["Welsh"] = "cy";
  Language["Danish"] = "da";
  Language["German"] = "de";
  Language["Greek"] = "el";
  Language["English"] = "en";
  Language["Esperanto"] = "eo";
  Language["Spanish"] = "es";
  Language["Estonian"] = "et";
  Language["Basque"] = "eu";
  Language["Persian"] = "fa";
  Language["Finnish"] = "fi";
  Language["French"] = "fr";
  Language["Frisian"] = "fy";
  Language["Irish"] = "ga";
  Language["ScotsGaelic"] = "gd";
  Language["Galician"] = "gl";
  Language["Gujarati"] = "gu";
  Language["Hausa"] = "ha";
  Language["Hawaiian"] = "haw";
  Language["Hindi"] = "hi";
  Language["Hmong"] = "hmn";
  Language["Croatian"] = "hr";
  Language["HaitianCreole"] = "ht";
  Language["Hungarian"] = "hu";
  Language["Armenian"] = "hy";
  Language["Indonesian"] = "id";
  Language["Igbo"] = "ig";
  Language["Icelandic"] = "is";
  Language["Italian"] = "it";
  Language["Hebrew"] = "iw";
  Language["Japanese"] = "ja";
  Language["Javanese"] = "jw";
  Language["Georgian"] = "ka";
  Language["Kazakh"] = "kk";
  Language["Khmer"] = "km";
  Language["Kannada"] = "kn";
  Language["Korean"] = "ko";
  Language["Kurdish"] = "ku";
  Language["Kyrgyz"] = "ky";
  Language["Latin"] = "la";
  Language["Luxembourgish"] = "lb";
  Language["Lao"] = "lo";
  Language["Lithuanian"] = "lt";
  Language["Latvian"] = "lv";
  Language["Malagasy"] = "mg";
  Language["Maori"] = "mi";
  Language["Macedonian"] = "mk";
  Language["Malayalam"] = "ml";
  Language["Mongolian"] = "mn";
  Language["Marathi"] = "mr";
  Language["Malay"] = "ms";
  Language["Maltese"] = "mt";
  Language["Myanmar"] = "my";
  Language["Nepali"] = "ne";
  Language["Dutch"] = "nl";
  Language["Norwegian"] = "no";
  Language["Nyanja"] = "ny";
  Language["Oriya"] = "or";
  Language["Punjabi"] = "pa";
  Language["Polish"] = "pl";
  Language["Pashto"] = "ps";
  Language["Portuguese"] = "pt";
  Language["Romanian"] = "ro";
  Language["Russian"] = "ru";
  Language["Kinyarwanda"] = "rw";
  Language["Sindhi"] = "sd";
  Language["Sinhala"] = "si";
  Language["Slovak"] = "sk";
  Language["Slovenian"] = "sl";
  Language["Samoan"] = "sm";
  Language["Shona"] = "sn";
  Language["Somali"] = "so";
  Language["Albanian"] = "sq";
  Language["Serbian"] = "sr";
  Language["Sesotho"] = "st";
  Language["Sundanese"] = "su";
  Language["Swedish"] = "sv";
  Language["Swahili"] = "sw";
  Language["Tamil"] = "ta";
  Language["Telugu"] = "te";
  Language["Tajik"] = "tg";
  Language["Thai"] = "th";
  Language["Turkmen"] = "tk";
  Language["Filipino"] = "tl";
  Language["Turkish"] = "tr";
  Language["Tatar"] = "tt";
  Language["Uighur"] = "ug";
  Language["Ukrainian"] = "uk";
  Language["Urdu"] = "ur";
  Language["Uzbek"] = "uz";
  Language["Vietnamese"] = "vi";
  Language["Xhosa"] = "xh";
  Language["Yiddish"] = "yi";
  Language["Yoruba"] = "yo";
  Language["ChineseSimplified"] = "zh";
  Language["ChineseTraditional"] = "zh-TW";
  Language["Zulu"] = "zu";
})(Language || (exports.Language = Language = {}));

var OrderBy;

(function (OrderBy) {
  OrderBy["LATEST"] = "latest";
  OrderBy["POPULAR"] = "popular";
  OrderBy["VIEWS"] = "views";
  OrderBy["DOWNLOADS"] = "downloads";
  OrderBy["OLDEST"] = "oldest";
})(OrderBy || (exports.OrderBy = OrderBy = {}));

var createApi = /*#__PURE__*/flow(initMakeRequest, function (makeRequest) {
  return {
    photos: {
      get: makeRequest(get$1),
      list: makeRequest(list$1),
      getStats: makeRequest(getStats),
      getRandom: makeRequest(getRandom),
      trackDownload: makeRequest(trackDownload)
    },
    users: {
      getPhotos: makeRequest(getPhotos$2),
      getCollections: makeRequest(getCollections$2),
      getLikes: makeRequest(getLikes),
      get: makeRequest(get$2)
    },
    search: {
      getCollections: makeRequest(getCollections$1),
      getPhotos: makeRequest(getPhotos$1),
      getUsers: makeRequest(getUsers)
    },
    collections: {
      getPhotos: makeRequest(getPhotos),
      get: makeRequest(get),
      list: makeRequest(list),
      getRelated: makeRequest(getRelated)
    },
    topics: {
      list: makeRequest(list$2),
      get: makeRequest(get$3),
      getPhotos: makeRequest(getPhotos$3)
    }
  };
});

exports.Language = Language;
exports.OrderBy = OrderBy;
exports._internals = internals;
exports.createApi = createApi;

//# sourceMappingURL=unsplash-js.esm.js.map

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(0);
module.exports = __webpack_require__(1);


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMmY5M2Q5ZGJlOWUwN2QyNzQ4ZjMiLCJ3ZWJwYWNrOi8vLy4vanMvc2NyaXB0LmpzIiwid2VicGFjazovLy8uL3Njc3Mvc3R5bGUuc2NzcyIsIndlYnBhY2s6Ly8vLi9+L2NvbnRlbnQtdHlwZS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L3Vuc3BsYXNoLWpzL2Rpc3QvdW5zcGxhc2gtanMuZXNtLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0EsMkNBQTJDLGNBQWM7O1FBRXpEO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsS0FBSztRQUNMO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7O1FBRUE7UUFDQTs7Ozs7Ozs7Ozs7OztzQ0MvRDBCLENBQWE7OztBQUd2QyxJQUFNLFFBQVEsR0FBRywyQkFBVSxFQUFFLFNBQVMsRUFBRSw2Q0FBNkMsRUFBRSxDQUFDLENBQUM7O0FBRXpGLElBQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUMxRCxJQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDNUQsSUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxzQkFBc0IsQ0FBQztBQUM3RCxJQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFD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QUFDekIsVUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUMzQixVQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQzNCLFVBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDMUIsVUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQztBQUN6QixVQUFRLENBQUMsV0FBVyxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQzdCLFVBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDMUIsVUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQztBQUN6QixVQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQzNCLFVBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDMUIsVUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUMxQixVQUFRLENBQUMsWUFBWSxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQzlCLFVBQVEsQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDNUIsVUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUMzQixVQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQy9CLFVBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDMUIsVUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUMzQixVQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQzFCLFVBQVEsQ0FBQyxXQUFXLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDN0IsVUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUMxQixVQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQ3pCLFVBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDMUIsVUFBUSxDQUFDLFVBQVUsQ0FBQyxHQUFHLElBQUksQ0FB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O0tBQ3hCO0FBQ0QsVUFBTSxFQUFFO0FBQ04sb0JBQWMsRUFBRSxXQUFXLENBQUMsZ0JBQWdCLENBQUM7QUFDN0MsZUFBUyxFQUFFLFdBQVcsQ0FBQyxXQUFXLENBQUM7QUFDbkMsY0FBUSxFQUFFLFdBQVcsQ0FBQyxRQUFRLENBQUM7S0FDaEM7QUFDRCxlQUFXLEVBQUU7QUFDWCxlQUFTLEVBQUUsV0FBVyxDQUFDLFNBQVMsQ0FBQztBQUNqQyxTQUFHLEVBQUUsV0FBVyxDQUFDLEdBQUcsQ0FBQztBQUNyQixVQUFJLEVBQUUsV0FBVyxDQUFDLElBQUksQ0FBQztBQUN2QixnQkFBVSxFQUFFLFdBQVcsQ0FBQyxVQUFVLENBQUM7S0FDcEM7QUFDRCxVQUFNLEVBQUU7QUFDTixVQUFJLEVBQUUsV0FBVyxDQUFDLE1BQU0sQ0FBQztBQUN6QixTQUFHLEVBQUUsV0FBVyxDQUFDLEtBQUssQ0FBQztBQUN2QixlQUFTLEVBQUUsV0FBVyxDQUFDLFdBQVcsQ0FBQztLQUNwQztHQUNGLENBQUM7Q0FDSCxDQUFDLENBQUM7O1FBRU0sUUFBUSxHQUFSLFFBQVE7UUFBRSxPQUFPLEdBQVAsT0FBTztRQUFlLFVBQVUsR0FBdkIsU0FBUztRQUFnQixTQUFTLEdBQVQsU0FBUyIsImZpbGUiOiJzY3JpcHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDQpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDJmOTNkOWRiZTllMDdkMjc0OGYzIiwiLy9PbiBpbXBvcnRlIGxlIHBhY2thZ2UgZGUgdW5zcGxhc2ggKGh0dHBzOi8vZ2l0aHViLmNvbS91bnNwbGFzaC91bnNwbGFzaC1qcyNpbnN0YWxsYXRpb24pXHJcbmltcG9ydCB7IGNyZWF0ZUFwaSB9IGZyb20gJ3Vuc3BsYXNoLWpzJztcclxuXHJcbi8vT24gc2UgY29ubmVjdGUgw6AgbCdBUEkgZGUgdW5zcGxhc2ggKGh0dHBzOi8vZ2l0aHViLmNvbS91bnNwbGFzaC91bnNwbGFzaC1qcyN1c2FnZSlcclxuY29uc3QgdW5zcGxhc2ggPSBjcmVhdGVBcGkoeyBhY2Nlc3NLZXk6ICdRajNGWXZNTmtJSTdKeXRiMERNRFdVenU4TlIyd3cwS2NDR0NKa01hLVhNJyB9KTtcclxuXHJcbmNvbnN0IGZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNlYXJjaC1mb3JtX19mb3JtXCIpO1xyXG5jb25zdCBpbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2VhcmNoLWZvcm1fX2lucHV0XCIpO1xyXG5jb25zdCBidXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2VhcmNoLWZvcm1fX3N1Ym1pdCcpXHJcbmNvbnN0IG1zZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2VhcmNoLWZvcm1fX21zZ1wiKTtcclxuY29uc3QgY2l0aWVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jaXRpZXNcIik7XHJcbmNvbnN0IHNhdmVfc2VhcmNoID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zYXZlLXNlYXJjaF9fbGlzdFwiKTtcclxuY29uc3QgYXBpS2V5ID0gXCIxZjNiNDhmYTdjNGIwOTMxZGY2MTQzMzg2NzRmOWE2OVwiO1xyXG5cclxuLy9GdW5jdGlvbiBwb3VyIGxhbmNlciBsYSByZWNoZXJjaGVcclxuY29uc3Qgc2VhcmNoV2VhdGhlciA9IChjdXN0b21DaXR5ID0gJycpID0+IHtcclxuICBsZXQgaW5wdXRWYWwgPSBpbnB1dC52YWx1ZTtcclxuXHJcbiAgLy9jaGVjayBpZiB0aGVyZSdzIGFscmVhZHkgYSBjaXR5XHJcbiAgY29uc3QgbGlzdEl0ZW1zID0gY2l0aWVzLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2l0eVwiKTtcclxuICBjb25zdCBsaXN0SXRlbXNBcnJheSA9IEFycmF5LmZyb20obGlzdEl0ZW1zKTtcclxuXHJcbiAgaWYgKGxpc3RJdGVtc0FycmF5Lmxlbmd0aCA+IDApIHtcclxuICAgIGxpc3RJdGVtc0FycmF5LmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgIGl0ZW0ucmVtb3ZlKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBmaWx0ZXJlZEFycmF5ID0gbGlzdEl0ZW1zQXJyYXkuZmlsdGVyKGVsID0+IHtcclxuICAgICAgbGV0IGNvbnRlbnQgPSBcIlwiO1xyXG4gICAgICAvL2F0aGVucyxnclxyXG4gICAgICBpZiAoaW5wdXRWYWwuaW5jbHVkZXMoXCIsXCIpKSB7XHJcbiAgICAgICAgLy9hdGhlbnMsZ3JycnJyci0+aW52YWxpZCBjb3VudHJ5IGNvZGUsIHNvIHdlIGtlZXAgb25seSB0aGUgZmlyc3QgcGFydCBvZiBpbnB1dFZhbFxyXG4gICAgICAgIGlmIChpbnB1dFZhbC5zcGxpdChcIixcIilbMV0ubGVuZ3RoID4gMikge1xyXG4gICAgICAgICAgaW5wdXRWYWwgPSBpbnB1dFZhbC5zcGxpdChcIixcIilbMF07XHJcbiAgICAgICAgICBjb250ZW50ID0gZWxcclxuICAgICAgICAgICAgLnF1ZXJ5U2VsZWN0b3IoXCIuY2l0eS1uYW1lIHNwYW5cIilcclxuICAgICAgICAgICAgLnRleHRDb250ZW50LnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnRlbnQgPSBlbC5xdWVyeVNlbGVjdG9yKFwiLmNpdHktbmFtZVwiKS5kYXRhc2V0Lm5hbWUudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy9hdGhlbnNcclxuICAgICAgICBjb250ZW50ID0gZWwucXVlcnlTZWxlY3RvcihcIi5jaXR5LW5hbWUgc3BhblwiKS50ZXh0Q29udGVudC50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBjb250ZW50ID09IGlucHV0VmFsLnRvTG93ZXJDYXNlKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAoZmlsdGVyZWRBcnJheS5sZW5ndGggPiAwKSB7XHJcbiAgICAgIG1zZy50ZXh0Q29udGVudCA9IGBWb3VzIGNvbm5haXNzZXogZMOpasOgIGxhIG3DqXTDqW8gcG91ciAke2ZpbHRlcmVkQXJyYXlbMF0ucXVlcnlTZWxlY3RvcihcIi5jaXR5LW5hbWUgc3BhblwiKS50ZXh0Q29udGVudFxyXG4gICAgICAgIH0gLi4uc2lub24sIHNveWV6IHBsdXMgcHLDqWNpcyBlbiBpbmRpcXVhbnQgw6lnYWxlbWVudCBsZSBjb2RlIGR1IHBheXMuIPCfmIlgO1xyXG4gICAgICBmb3JtLnJlc2V0KCk7XHJcbiAgICAgIGlucHV0LmZvY3VzKCk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmKGN1c3RvbUNpdHkgIT0gJycpIHtcclxuICAgIGlucHV0VmFsID0gY3VzdG9tQ2l0eTtcclxuICAgIGlucHV0LnZhbCA9IGN1c3RvbUNpdHk7XHJcbiAgfVxyXG4gIC8vYWpheCBoZXJlXHJcbiAgY29uc3QgdXJsID0gYGh0dHBzOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9kYXRhLzIuNS9mb3JlY2FzdD9xPSR7aW5wdXRWYWx9JmFwcGlkPSR7YXBpS2V5fSZ1bml0cz1tZXRyaWMmbGFuZz1mcmA7XHJcblxyXG4gIGZldGNoKHVybClcclxuICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcclxuICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICBjb25zdCB7IGNpdHksIGxpc3QgfSA9IGRhdGE7XHJcblxyXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2VhcmNoLWZvcm1fX2NpdHknKS50ZXh0Q29udGVudCA9IGNpdHkubmFtZTtcclxuXHJcbiAgICAgIC8vT24gY3LDqWUgdW4gdGFibGVhdSBwb3VyIHN0b2NrZXIgbGUgcsOpc3VsYXQgZGVzIDUgcHJvY2hhaW5zIGpvdXJzXHJcbiAgICAgIGxldCBkYXlzID0gW107XHJcblxyXG4gICAgICAvL09uIGNyw6llciB1bmUgdmFyaWFibGUgcG91ciBzdG9ja2VyIGwnaW5kZXggZGUgY2hhcXVlIMOpbMOpbWVudCBkdSB0YWJsZWF1IGR1IHLDqXN1bGF0IGZpbmFsXHJcbiAgICAgIGxldCBkYXlfaW5kZXggPSAwO1xyXG5cclxuICAgICAgLy9EYXRlIGRlIGxhIDFlcmUgdHJhbmNoZSBob3JhaXJlXHJcbiAgICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZShsaXN0WzBdLmR0X3R4dCk7XHJcbiAgICAgIGNvbnN0IGhvdXIgPSBkYXRlLmdldEhvdXJzKCk7XHJcbiAgICAgIGNvbnN0IGluZGV4X25leHRfZGF5ID0gKDI0IC0gaG91cikgLyAzO1xyXG5cclxuICAgICAgLy9PbiB2YSBzdG9ja2VyIHRvdXRlcyBsZXMgZG9ubmXDqXMgZGUgbGEgam91cm7DqWUgZW4gY291cnMgcHVpcyBsZXMgc3VwcHJpbWVyIGRlIGxhIGxpc3RlXHJcbiAgICAgIGxldCBjdXJyZW50X2RheSA9IGdldEN1cnJlbnREYXlEYXRhKGxpc3QsIGRhdGUsIGZhbHNlLCBpbmRleF9uZXh0X2RheSk7XHJcblxyXG4gICAgICAvL09uIHZhIHN0b2NrZXIgbGVzIGRvbm7DqWVzIGRlIGxhIGpvdXJuw6llIGFjdHVlbGxlIHBvdXIgYWpvdXRlciB1biBibG9jayBzdXBwbMOpbWVudGFpcmUgc2kgb24gZXN0IHBhcyBlbmNvcmUgbGEgbnVpdFxyXG4gICAgICBsZXQgY3VycmVudF9kYXlfZXh0cmEgPSBmYWxzZTtcclxuICAgICAgY3VycmVudF9kYXlfZXh0cmEgPSBnZXRDdXJyZW50RGF5RGF0YShsaXN0LCBkYXRlLCB0cnVlLCBpbmRleF9uZXh0X2RheSk7XHJcblxyXG4gICAgICAvL09uIHN1cHByaW1lIGxlcyDDqWzDqW1lbnRzIGR1IHRhYmxlYXUgZHUgam91ciBhY3R1ZWwganVzcXUnYXUgam91ciBzdWl2YW50XHJcbiAgICAgIGxpc3Quc3BsaWNlKDAsIGluZGV4X25leHRfZGF5KTsgLy8gMCA9IGluZGV4IGRlIGTDqXBhcnQgZXQgaW5kZXhfbmV4dF9kYXkgPSBsZSBub21icmUgZCfDqWzDqW1lbnRzIGR1IHRhYmxlYXUgw6Agc3VwcHJpbWVyXHJcblxyXG4gICAgICAvL09uIHBhcmNvdXJlIGNoYXF1ZSDDqWzDqW1lbnQgcmV0b3VybsOpZXMgcGFyIGwnQVBJXHJcbiAgICAgIGxpc3QuZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcclxuICAgICAgICBjb25zdCB7IHRlbXAsIGh1bWlkaXR5IH0gPSBpdGVtLm1haW47XHJcbiAgICAgICAgY29uc3QgeyBzcGVlZCwgZGVnIH0gPSBpdGVtLndpbmQ7XHJcbiAgICAgICAgY29uc3QgaWNvbiA9IGl0ZW0ud2VhdGhlclswXS5pY29uO1xyXG4gICAgICAgIGNvbnN0IHdlYXRoZXJfZGVzYyA9IGl0ZW0ud2VhdGhlclswXS5kZXNjcmlwdGlvbjtcclxuXHJcbiAgICAgICAgY29uc3QgZGF0ZV90eHQgPSBpdGVtLmR0X3R4dDtcclxuICAgICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoZGF0ZV90eHQpO1xyXG4gICAgICAgIGNvbnN0IGRheSA9IGRhdGUudG9Mb2NhbGVEYXRlU3RyaW5nKFwiZnItRlJcIiwgeyB3ZWVrZGF5OiBcImxvbmdcIiB9KTsgLy8gdG9Mb2NhbGVEYXRlU3RyaW5nIGNvbnZlcnRpdCB1bmUgZGF0ZSBhdSBmb3JtYXQgZGUgbGEgbGFuZyBzb3VoYWl0w6llXHJcblxyXG4gICAgICAgIGlmIChpbmRleCA9PSAwIHx8IGluZGV4ICUgOCA9PSAwICYmIGluZGV4IDwgMzIpIHtcclxuICAgICAgICAgIGRheXNbZGF5X2luZGV4XSA9IHt9O1xyXG4gICAgICAgICAgZGF5c1tkYXlfaW5kZXhdLnRlbXAgPSBbXTtcclxuICAgICAgICAgIGRheXNbZGF5X2luZGV4XS5pY29uID0gW107XHJcbiAgICAgICAgICBkYXlzW2RheV9pbmRleF0ud2VhdGhlcl9kZXNjID0gW107XHJcbiAgICAgICAgICBkYXlzW2RheV9pbmRleF0uaHVtaWRpdHkgPSBodW1pZGl0eTtcclxuICAgICAgICAgIGRheXNbZGF5X2luZGV4XS5kYXkgPSBkYXk7XHJcbiAgICAgICAgICBkYXlzW2RheV9pbmRleF0ud2luZF9zcGVlZCA9IHNwZWVkO1xyXG4gICAgICAgICAgZGF5c1tkYXlfaW5kZXhdLndpbmRfZGVnID0gZGVnO1xyXG4gICAgICAgICAgZGF5X2luZGV4Kys7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL09uIHN0b2NrZSBkYW5zIHVuIHRhYmxlYXUgcG91ciBjaGFxdWUgam91ciwgbGVzIHRlbXDDqXJhdHVyZXMgZGUgdG91dGUgbGEgam91bnLDqWUgKDA6MDAsMzowMCw2OjAwLi4uKVxyXG4gICAgICAgIGlmIChpbmRleCA+PSAwICYmIGluZGV4IDwgOCkge1xyXG4gICAgICAgICAgZGF5c1swXS50ZW1wLnB1c2godGVtcCk7XHJcbiAgICAgICAgICBkYXlzWzBdLmljb24ucHVzaChpY29uKTtcclxuICAgICAgICAgIGRheXNbMF0ud2VhdGhlcl9kZXNjLnB1c2god2VhdGhlcl9kZXNjKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoaW5kZXggPj0gOCAmJiBpbmRleCA8IDE2KSB7XHJcbiAgICAgICAgICBkYXlzWzFdLnRlbXAucHVzaCh0ZW1wKTtcclxuICAgICAgICAgIGRheXNbMV0uaWNvbi5wdXNoKGljb24pO1xyXG4gICAgICAgICAgZGF5c1sxXS53ZWF0aGVyX2Rlc2MucHVzaCh3ZWF0aGVyX2Rlc2MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChpbmRleCA+PSAxNiAmJiBpbmRleCA8IDI0KSB7XHJcbiAgICAgICAgICBkYXlzWzJdLnRlbXAucHVzaCh0ZW1wKTtcclxuICAgICAgICAgIGRheXNbMl0uaWNvbi5wdXNoKGljb24pO1xyXG4gICAgICAgICAgZGF5c1syXS53ZWF0aGVyX2Rlc2MucHVzaCh3ZWF0aGVyX2Rlc2MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChpbmRleCA+PSAyNCAmJiBpbmRleCA8IDMyKSB7XHJcbiAgICAgICAgICBkYXlzWzNdLnRlbXAucHVzaCh0ZW1wKTtcclxuICAgICAgICAgIGRheXNbM10uaWNvbi5wdXNoKGljb24pO1xyXG4gICAgICAgICAgZGF5c1szXS53ZWF0aGVyX2Rlc2MucHVzaCh3ZWF0aGVyX2Rlc2MpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvL09uIGFqb3V0ZSBsZXMgZG9ubsOpZXMgc3VwcGzDqW1lbnRhaXJlcyBkZSBsYSBqb3VybsOpZSBlbiBjb3VycyBzaSBjZWx1aS1jaSBkb2l0IHMnYWZmaWNoZXIgKGRvbmMgc2kgb24gZXN0IHBhcyBsYSBudWl0KVxyXG4gICAgICBpZiAoY3VycmVudF9kYXlfZXh0cmEgIT0gZmFsc2UpIHtcclxuICAgICAgICBkYXlzLnVuc2hpZnQoY3VycmVudF9kYXlfZXh0cmEpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvL09uIGFqb3V0ZSBsZXMgZG9ubsOpZXMgZGUgbGEgam91cm7DqWUgYWN0dWVsbGUgYXUgdGFibGVhdSBhdmFudCBkJ2FmZmljaGVyIGxlcyByw6lzdWx0YXRzXHJcbiAgICAgIGRheXMudW5zaGlmdChjdXJyZW50X2RheSk7XHJcblxyXG4gICAgICBkYXlzLmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XHJcbiAgICAgICAgLy9PbiByw6ljdXDDqHJlIGxhIHRlbXDDqXJhdHVyZSBtaW4gZGUgbGEgam91cm7DqWUgZXQgbGEgbWF4aW11bVxyXG4gICAgICAgIGxldCB0ZW1wX21pbiA9IE1hdGgubWluKC4uLml0ZW0udGVtcCk7XHJcbiAgICAgICAgbGV0IHRlbXBfbWF4ID0gTWF0aC5tYXgoLi4uaXRlbS50ZW1wKTtcclxuXHJcbiAgICAgICAgLy9PbiBjcsOpZSB1bmUgdmFyaWFibGUgcG91ciBzdG9ja2VyIGwnaWNvbmUgbG9yc3F1J2lsIGVzdCA2aCBkdSBtYXRpbiBldCAyMWggKGV4OiBpdGVtLmljb25bJzAwOjAwJywnMDM6MDAnLCcwNjowMCcsJzA5OjAwJywnMTI6MDAnLi5dKVxyXG4gICAgICAgIGxldCBpY29uX2Zyb20gPSAnJztcclxuICAgICAgICBsZXQgaWNvbl90byA9ICcnO1xyXG4gICAgICAgIGlmIChpdGVtLmljb24ubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgaWNvbl9mcm9tID0gYGh0dHBzOi8vczMtdXMtd2VzdC0yLmFtYXpvbmF3cy5jb20vcy5jZHBuLmlvLzE2MjY1Ni8ke2l0ZW0uaWNvblsyXX0uc3ZnYDtcclxuICAgICAgICAgIGljb25fdG8gPSBgaHR0cHM6Ly9zMy11cy13ZXN0LTIuYW1hem9uYXdzLmNvbS9zLmNkcG4uaW8vMTYyNjU2LyR7aXRlbS5pY29uWzZdfS5zdmdgO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpY29uX2Zyb20gPSBgaHR0cHM6Ly9zMy11cy13ZXN0LTIuYW1hem9uYXdzLmNvbS9zLmNkcG4uaW8vMTYyNjU2LyR7aXRlbS5pY29uWzBdfS5zdmdgO1xyXG4gICAgICAgICAgaWNvbl90byA9IGBodHRwczovL3MzLXVzLXdlc3QtMi5hbWF6b25hd3MuY29tL3MuY2Rwbi5pby8xNjI2NTYvJHtpdGVtLmljb25bMF19LnN2Z2A7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL09uIGNyw6llIHVuZSB2YXJpYWJsZSBwb3VyIHN0b2NrZXIgbGEgZGVzY3JpcHRpb24gZHUgdGVtcHMgw6AgNmggZXQgMjFoXHJcbiAgICAgICAgbGV0IHdlYXRoZXJfZGVzY19mcm9tID0gJyc7XHJcbiAgICAgICAgbGV0IHdlYXRoZXJfZGVzY190byA9ICcnO1xyXG4gICAgICAgIGlmIChpdGVtLndlYXRoZXJfZGVzYy5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICB3ZWF0aGVyX2Rlc2NfZnJvbSA9IGl0ZW0ud2VhdGhlcl9kZXNjWzJdO1xyXG4gICAgICAgICAgd2VhdGhlcl9kZXNjX3RvID0gaXRlbS53ZWF0aGVyX2Rlc2NbN107XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHdlYXRoZXJfZGVzY19mcm9tID0gaXRlbS53ZWF0aGVyX2Rlc2NbMF07XHJcbiAgICAgICAgICB3ZWF0aGVyX2Rlc2NfdG8gPSBpdGVtLndlYXRoZXJfZGVzY1swXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLypcclxuICAgICAgICA8aDIgY2xhc3NOYW1lPVwiY2l0eS1uYW1lXCI+XHJcbiAgICAgICAgICA8aW1nIHNyYz1cImh0dHBzOi8vY291bnRyeWZsYWdzYXBpLmNvbS9zdmcvJHtjaXR5LmNvdW50cnl9XCIgd2lkdGg9XCI0MFwiIGhlaWdodD1cIjMwXCI+XHJcbiAgICAgICAgPC9oMj4qL1xyXG4gICAgICAgIC8vT24gY3LDqWVyIGwnw6lsw6ltZW50IEhUTUwgcG91ciBhZmZpY2hlciBjaGFxdWUgcsOpc3VsYXRcclxuICAgICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcclxuICAgICAgICBsaS5jbGFzc0xpc3QuYWRkKFwiY2l0eVwiKTtcclxuXHJcbiAgICAgICAgbGV0IG1hcmt1cCA9IGBcclxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2l0eV9fZGF5XCI+JHtpdGVtLmRheX08L3NwYW4+XHJcbiAgICAgICAgICA8c3BhbiBjbGFzcz1cImNpdHktbmFtZVwiIHN0eWxlPVwiZGlzcGxheTogbm9uZVwiPlxyXG4gICAgICAgICAgICA8c3Bhbj4ke2NpdHkubmFtZX08L3NwYW4+XHJcbiAgICAgICAgICA8L3NwYW4+YDtcclxuICAgICAgICBtYXJrdXAgKz0gYFxyXG4gICAgICAgICAgPGZpZ3VyZSBjbGFzcz1cImNpdHlfX2ljb25cIj5gO1xyXG5cclxuICAgICAgICAvL1NpIGxlcyBpY29uZXMgcmVwcsOpc2VudGFudCBsZSB0ZW1wcyBkZSBsYSBqb3VybsOpZSBzb250IGlkZW50aXF1ZSBhbG9ycyBvbiBhZmZpY2hlIHF1J3VuZSBkZXMgZGV1eFxyXG4gICAgICAgIGlmIChpY29uX2Zyb20gIT0gaWNvbl90bykge1xyXG4gICAgICAgICAgbWFya3VwICs9IGBcclxuICAgICAgICAgICAgICA8aW1nIHNyYz1cIiR7aWNvbl9mcm9tfVwiIGFsdD1cIiR7d2VhdGhlcl9kZXNjX2Zyb219XCI+XHJcbiAgICAgICAgICAgICAgPGltZyBzcmM9XCIke2ljb25fdG99XCIgYWx0PVwiJHt3ZWF0aGVyX2Rlc2NfdG99XCI+YDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbWFya3VwICs9IGBcclxuICAgICAgICAgICAgICA8aW1nIHNyYz1cIiR7aWNvbl9mcm9tfVwiIGFsdD1cIiR7d2VhdGhlcl9kZXNjX2Zyb219XCI+YDtcclxuICAgICAgICB9XHJcbiAgICAgICAgbWFya3VwICs9IGBcclxuICAgICAgICAgIDwvZmlndXJlPlxyXG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJjaXR5X19odW1pZGl0eVwiPjxpIGNsYXNzPVwiaHVtaWRpdHlcIj48L2k+ICR7aXRlbS5odW1pZGl0eX0gJTwvc3Bhbj5cclxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2l0eV9fd2luZFwiPiR7aXRlbS53aW5kX3NwZWVkfSA8aSBjbGFzcz1cIndpbmRcIiBzdHlsZT1cImRpc3BsYXk6IGlubGluZS1ibG9jazt0cmFuc2Zvcm06IHJvdGF0ZSgtJHtpdGVtLndpbmRfZGVnfWRlZylcIj48L2k+PC9zcGFuPlxyXG4gICAgICAgIGA7XHJcbiAgICAgICAgbWFya3VwICs9ICc8ZGl2IGNsYXNzPVwiY2l0eV9fdGVtcFwiPic7XHJcbiAgICAgICAgLy9TaSBsZSB0ZW1wcyBtaW4gZXQgbWF4IHNvbnQgaWRlbnRpcXVlIGFsb3JzIG9uIGFmZmljaGUgcXUndW5lIGRlcyBkZXV4IHRlbXBlcmF0dXJlc1xyXG4gICAgICAgIGlmIChNYXRoLnJvdW5kKHRlbXBfbWluKSAhPSBNYXRoLnJvdW5kKHRlbXBfbWF4KSkge1xyXG4gICAgICAgICAgbWFya3VwICs9IGBcclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNpdHlfX3RlbXBfX2l0ZW1cIj4ke01hdGgucm91bmQodGVtcF9taW4pfTxzdXA+wrBDPC9zdXA+PC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjaXR5X190ZW1wX19pdGVtXCI+JHtNYXRoLnJvdW5kKHRlbXBfbWF4KX08c3VwPsKwQzwvc3VwPjwvZGl2PmA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIG1hcmt1cCArPSBgXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjaXR5X190ZW1wX19pdGVtXCI+JHtNYXRoLnJvdW5kKHRlbXBfbWF4KX08c3VwPsKwQzwvc3VwPjwvZGl2PmA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1hcmt1cCArPSAnPC9kaXY+JztcclxuICAgICAgICBsaS5pbm5lckhUTUwgPSBtYXJrdXA7XHJcbiAgICAgICAgY2l0aWVzLmFwcGVuZENoaWxkKGxpKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvL09uIGNoYW5nZSBsZSBiYWNrZ3JvdWQgZGUgbGEgcGFnZVxyXG4gICAgICBjaGFuZ2VCYWNrZ3JvdW5kKGNpdHkubmFtZSk7XHJcblxyXG4gICAgICAvL09uIHNhdXZlZ2FyZGUgbGEgcmVjaGVyY2hlIGRhbnMgbGUgbG9jYWxzdG9yYWdlXHJcbiAgICAgIHNhdmVTZWFyY2goY2l0eS5uYW1lKTtcclxuXHJcbiAgICAgIC8vT24gYWZmaWNoZSBsYSBjaGFydGVcclxuICAgICAgZ2V0Q2hhcnQobGlzdCxpbmRleF9uZXh0X2RheSk7XHJcbiAgICB9KVxyXG4gICAgLmNhdGNoKChlcnJvcikgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgIG1zZy50ZXh0Q29udGVudCA9IFwiVmV1aWxsZXogcmVjaGVyY2hlciB1bmUgdmlsbGUgdmFsaWRlIPCfmKlcIjtcclxuICAgIH0pO1xyXG59XHJcblxyXG5cclxuLy9GdW5jdGlvbiBwb3VyIHLDqWN1cMOpcmVyIHVuZSBzw6lyaWUgZGUgcGhvdG8gc3VyIFVuc3BsYXNoIGV0IGVuIGFmZmljaGVyIHVuZSBhdSBoYXNhcmRcclxuY29uc3QgY2hhbmdlQmFja2dyb3VuZCA9IChjaXR5KSA9PiB7XHJcbiAgdW5zcGxhc2guc2VhcmNoLmdldFBob3Rvcyh7XHJcbiAgICBxdWVyeTogY2l0eSxcclxuICAgIHBhZ2U6IDEsXHJcbiAgICBwZXJQYWdlOiAxMCxcclxuICAgIG9yaWVudGF0aW9uOiAncG9ydHJhaXQnLFxyXG4gIH0pLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAvL09uIHN0b2NrZXIgZGFucyB1bmUgdmFyaWFibGUgbGUgbm9tYnJlIGRlIHLDqXN1bGF0XHJcbiAgICBsZXQgbmJyX3Jlc3VsdCA9IGRhdGEucmVzcG9uc2UucmVzdWx0cy5sZW5ndGg7XHJcblxyXG4gICAgaWYgKGRhdGEuZXJyb3JzKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdlcnJvciBvY2N1cnJlZDogJywgZGF0YS5lcnJvcnNbMF0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAobmJyX3Jlc3VsdCA9PSAwKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdBdWN1biByw6lzdWx0YXQnKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAvL09uIHLDqWN1cMOocmUgdW5lIGltYWdlIGF1IGhhc2FyZCAoZW50cmUgMCBldCBsZSBub21icmUgbWF4aW11bSBkJ8OpbMOpbWVudClcclxuICAgICAgY29uc3QgcmFuZG9tX2luZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG5icl9yZXN1bHQgKyAxKSk7XHJcbiAgICAgIGNvbnN0IGJnX3VybCA9IGRhdGEucmVzcG9uc2UucmVzdWx0c1tyYW5kb21faW5kZXhdLnVybHMucmVndWxhcjtcclxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFwcC1iZycpLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoJHtiZ191cmx9KWA7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuXHJcbi8vRnVuY3Rpb24gcG91ciByw6ljdXDDqXJlciBsZSBtb21lbnQgZGUgbGEgam91cm7DqWVcclxuY29uc3QgZ2V0RGF5TW9tZW50ID0gKGhvdXIpID0+IHtcclxuICBpZiAoaG91ciA+PSAxMiAmJiBob3VyIDw9IDE3KSB7XHJcbiAgICByZXR1cm4gJ2FmdGVybm9vbic7XHJcbiAgfSBlbHNlIGlmIChob3VyID49IDE3IHx8IGhvdXIgPCA2KSB7XHJcbiAgICByZXR1cm4gJ25pZ2h0JztcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuICdtb3JuaW5nJztcclxuICB9XHJcbn1cclxuXHJcbmNvbnN0IGdldEN1cnJlbnREYXlEYXRhID0gKGxpc3QsIGRhdGUsIGV4dHJhID0gZmFsc2UsIHRvKSA9PiB7XHJcbiAgY29uc3QgY3VycmVudF9kYXkgPSB7fTtcclxuICBjb25zdCBob3VyID0gZGF0ZS5nZXRIb3VycygpO1xyXG4gIGNvbnN0IGRheSA9IGRhdGUudG9Mb2NhbGVEYXRlU3RyaW5nKFwiZnItRlJcIiwgeyB3ZWVrZGF5OiBcImxvbmdcIiB9KTsgLy8gdG9Mb2NhbGVEYXRlU3RyaW5nIGNvbnZlcnRpdCB1bmUgZGF0ZSBhdSBmb3JtYXQgZGUgbGEgbGFuZyBzb3VoYWl0w6llXHJcbiAgY29uc3QgbW9tZW50ID0gZ2V0RGF5TW9tZW50KGhvdXIpO1xyXG4gIGxldCBpO1xyXG5cclxuICBpZiAoZXh0cmEpIHtcclxuICAgIGkgPSAyO1xyXG4gICAgaWYgKG1vbWVudCA9PSAnbW9ybmluZycgfHwgbW9tZW50ID09ICduaWdodCcpIHtcclxuICAgICAgY3VycmVudF9kYXkuZGF5ID0gZGF5O1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAobW9tZW50ID09ICdhZnRlcm5vb24nKSB7XHJcbiAgICAgIGN1cnJlbnRfZGF5LmRheSA9IGBDZSBzb2lyYDtcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgaSA9IDA7XHJcbiAgICBpZiAobW9tZW50ID09ICdtb3JuaW5nJykge1xyXG4gICAgICBjdXJyZW50X2RheS5kYXkgPSAnQ2UgbWF0aW4nO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAobW9tZW50ID09ICdhZnRlcm5vb24nKSB7XHJcbiAgICAgIGN1cnJlbnRfZGF5LmRheSA9IGRheTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKG1vbWVudCA9PSAnbmlnaHQnKSB7XHJcbiAgICAgIGN1cnJlbnRfZGF5LmRheSA9ICdDZXR0ZSBudWl0JztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmIChpID09IDApIHtcclxuICAgIC8vU2kgYydlc3QgbGUgMWVyIGJsb2MsIG9uIGFmZmljaGUgcXVlIGxhIHRlbXBlcmF0dXJlIGV0IGxlIHRlbXBzIGFjdHVlbHNcclxuICAgIGN1cnJlbnRfZGF5LnRlbXAgPSBbbGlzdFtpXS5tYWluLnRlbXBdO1xyXG4gICAgY3VycmVudF9kYXkuaWNvbiA9IFtsaXN0W2ldLndlYXRoZXJbMF0uaWNvbl07XHJcbiAgfSBlbHNlIHtcclxuICAgIC8vU2kgYydlc3QgbGUgMmVtZSBvbiBhZmZpY2hlIGxlIG1pbiBldCBtYXggY29tbWUgcG91ciBsZXMgYXV0cmVzIGpvdXJzIGV0IGxhIHZhcmlhYmlsaXTDqSBkdSB0ZW1wcyB0b3V0IGF1IGxvbmcgZGUgbGEgam91cm7DqWVcclxuICAgIGN1cnJlbnRfZGF5LnRlbXAgPSBnZXRDdXJyZW50RGF5RGF0YUF2ZXJhZ2UobGlzdCwgdG8sICd0ZW1wJyk7XHJcbiAgICBjdXJyZW50X2RheS5pY29uID0gZ2V0Q3VycmVudERheURhdGFBdmVyYWdlKGxpc3QsIHRvLCAnaWNvbicpO1xyXG4gIH1cclxuICBjdXJyZW50X2RheS53ZWF0aGVyX2Rlc2MgPSBsaXN0W2ldLndlYXRoZXJbMF0uZGVzY3JpcHRpb247XHJcbiAgY3VycmVudF9kYXkuaHVtaWRpdHkgPSBsaXN0W2ldLm1haW4uaHVtaWRpdHk7XHJcbiAgY3VycmVudF9kYXkud2luZF9zcGVlZCA9IGxpc3RbaV0ud2luZC5zcGVlZDtcclxuICBjdXJyZW50X2RheS53aW5kX2RlZyA9IGxpc3RbaV0ud2luZC5kZWc7XHJcblxyXG4gIHJldHVybiBjdXJyZW50X2RheTtcclxufVxyXG5cclxuLy9Sw6ljdXDDqXJlciB0b3V0ZXMgbGVzIHRyYW5jaGVzIGRlIHRlbXBlcmF0dXJlIGRlIGxhIGpvdXJuw6llIGVuIGNvdXJzIGRhbnMgdW4gdGFibGVhdVxyXG5jb25zdCBnZXRDdXJyZW50RGF5RGF0YUF2ZXJhZ2UgPSAobGlzdCwgdG8sIHR5cGUpID0+IHtcclxuICBsZXQgYXJyID0gW107XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0bzsgaSsrKSB7XHJcbiAgICBpZiAodHlwZSA9PSAndGVtcCcpIHtcclxuICAgICAgYXJyLnB1c2gobGlzdFtpXS5tYWluLnRlbXApO1xyXG4gICAgfSBlbHNlIGlmICh0eXBlID09ICdpY29uJykge1xyXG4gICAgICBhcnIucHVzaChsaXN0W2ldLndlYXRoZXJbMF0uaWNvbik7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBhcnI7XHJcbn1cclxuXHJcbi8vRW5yZWdpc3RyZXIgbGUgY2hvaXggZGUgbCd1dGlsaXNhdGV1clxyXG5jb25zdCBzYXZlU2VhcmNoID0gKHF1ZXJ5KSA9PiB7XHJcbiAgbGV0IHF1ZXJpZXMgPSBbXTtcclxuXHJcbiAgLy8gT24gcGFyc2UgKHBhcmNvdXJlKSBlbiBKU09OIGxlIHLDqXN1bHRhdCBzdG9ja8OpIGRhbnMgbGUgbG9jYWxlIHN0b3JhZ2VcclxuICBxdWVyaWVzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncXVlcmllcycpKSB8fCBbXTtcclxuXHJcbiAgLy8gT24gYWpvdXRlIGxhIGRlcm5pw6hyZSByZWNoZXJjaGUgYXV4IHNhdXZlZ2FyZGVzXHJcbiAgY29uc29sZS5sb2cocXVlcmllcy5pbmRleE9mKHF1ZXJ5KSA9PSAtMSk7XHJcbiAgaWYocXVlcmllcy5pbmRleE9mKHF1ZXJ5KSA9PSAtMSkge1xyXG4gICAgcXVlcmllcy5wdXNoKHF1ZXJ5KTtcclxuICB9XHJcblxyXG4gIC8vIE9uIHN0b2NrZSBsZSBub3V2ZWF1IHRhYmxlYXUgYXZlYyB0b3VzIGxlcyByw6lzdWx0YXRzIGRhbnMgbGUgbG9jYWxzdG9yYWdlXHJcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3F1ZXJpZXMnLCBKU09OLnN0cmluZ2lmeShxdWVyaWVzKSk7XHJcbn1cclxuXHJcbi8vUmVtcGxpciBsYSBsaXN0ZSBkZXMgYW5jaWVubmVzIHJlY2hlcmNoZXNcclxuY29uc3QgZGlzcGxheU9sZFNlYXJjaCA9ICgpID0+IHtcclxuICB2YXIgcXVlcmllcyA9IFtdO1xyXG4gIHF1ZXJpZXMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdxdWVyaWVzJykpIHx8IFtdO1xyXG5cclxuICBxdWVyaWVzLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO1xyXG4gICAgbGkuY2xhc3NMaXN0LmFkZChcInNhdmUtc2VhcmNoX19pdGVtXCIpO1xyXG4gICAgbGV0IG1hcmt1cCA9IGA8YSBocmVmPVwiI1wiPiR7aXRlbX08L2E+YDtcclxuICAgIGxpLmlubmVySFRNTCA9IG1hcmt1cDtcclxuICAgIHNhdmVfc2VhcmNoLmFwcGVuZENoaWxkKGxpKTtcclxuXHJcbiAgICBsaS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xyXG4gICAgICBpbnB1dC52YWx1ZSA9IGl0ZW07XHJcbiAgICAgIGJ1dHRvbi5jbGljaygpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbi8vQ3LDqWF0aW9uIGRlIGxhIGNoYXJ0ZSBhdmVjIENoYXJ0LmpzXHJcbmNvbnN0IGdldENoYXJ0ID0gKGxpc3QsdG8pID0+IHtcclxuICB2YXIgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYW52YXNcIik7XHJcblxyXG4gIGlmKHR5cGVvZiB3aW5kb3cuY2hhcnQgIT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgIGNoYXJ0LmRlc3Ryb3koKTtcclxuICB9XHJcblxyXG4gIC8vIEFwcGx5IG11bHRpcGx5IGJsZW5kIHdoZW4gZHJhd2luZyBkYXRhc2V0c1xyXG4gIHZhciBtdWx0aXBseSA9IHtcclxuICAgIGJlZm9yZURhdGFzZXRzRHJhdzogZnVuY3Rpb24oY2hhcnQsIG9wdGlvbnMsIGVsKSB7XHJcbiAgICAgIGNoYXJ0LmN0eC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnbXVsdGlwbHknO1xyXG4gICAgfSxcclxuICAgIGFmdGVyRGF0YXNldHNEcmF3OiBmdW5jdGlvbihjaGFydCwgb3B0aW9ucykge1xyXG4gICAgICBjaGFydC5jdHguZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gJ3NvdXJjZS1vdmVyJztcclxuICAgIH0sXHJcbiAgfTtcclxuXHJcbiAgLy8gR3JhZGllbnQgY29sb3IgLSB0aGlzIHdlZWtcclxuICB2YXIgZ3JhZGllbnRUaGlzV2VlayA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpLmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDAsIDE1MCk7XHJcbiAgZ3JhZGllbnRUaGlzV2Vlay5hZGRDb2xvclN0b3AoMCwgJ3JnYmEoODUsIDg1LCAyNTUsMC41KScpO1xyXG4gIGdyYWRpZW50VGhpc1dlZWsuYWRkQ29sb3JTdG9wKDEsICdyZ2JhKDE1MSwgMTM1LCAyNTUsMC41KScpO1xyXG5cclxuICAvLyBHcmFkaWVudCBjb2xvciAtIHByZXZpb3VzIHdlZWtcclxuICB2YXIgZ3JhZGllbnRQcmV2V2VlayA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpLmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDAsIDE1MCk7XHJcbiAgZ3JhZGllbnRQcmV2V2Vlay5hZGRDb2xvclN0b3AoMCwgJ3JnYmEoMjU1LCA4NSwgMTg0LDAuNSknKTtcclxuICBncmFkaWVudFByZXZXZWVrLmFkZENvbG9yU3RvcCgxLCAncmdiYSgyNTUsIDEzNSwgMTM1LDAuNSknKTtcclxuXHJcbiAgLy9PbiByw6ljdXAgbGEgZGF0ZSBkdSAxZXIgYmxvYyBkZSBsYSBsaXN0ZSBkZXMgdHJhbmNoZXMgZGUgdGVtcGVyYXR1cmVzXHJcbiAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKGxpc3RbMF0uZHRfdHh0KTtcclxuICBsZXQgaG91ciA9IGRhdGUuZ2V0SG91cnMoKTtcclxuICBsZXQgbGFiZWxzID0gW107XHJcbiAgZm9yIChsZXQgaSA9IDA7aSA8IDc7aSsrKSB7XHJcbiAgICBpZihob3VyID4gMjMpIHtcclxuICAgICAgaG91ciA9IDA7XHJcbiAgICB9XHJcbiAgICBsYWJlbHMucHVzaChob3VyICsgJ2gnKTtcclxuICAgIGhvdXIgPSBob3VyICsgMztcclxuICB9XHJcblxyXG4gIHZhciBjb25maWcgPSB7XHJcbiAgICAgIHR5cGU6ICdsaW5lJyxcclxuICAgICAgZGF0YToge1xyXG4gICAgICAgICAgbGFiZWxzOiBsYWJlbHMsXHJcbiAgICAgICAgICBkYXRhc2V0czogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBsYWJlbDogJ1RlbXBlcmF0dXJlJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IGdldEN1cnJlbnREYXlEYXRhQXZlcmFnZShsaXN0LHRvLCd0ZW1wJyksXHJcbiAgICAgICAgICAgICAgICBmaWxsOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGJvcmRlckNvbG9yOiAncmdiYSgyNTUsIDI1NSwgMjU1LCAwLjIpJyxcclxuICAgICAgICAgICAgICAgIGJvcmRlcldpZHRoOiAyLFxyXG4gICAgICAgICAgICAgICAgcG9pbnRCYWNrZ3JvdW5kQ29sb3I6ICd0cmFuc3BhcmVudCcsXHJcbiAgICAgICAgICAgICAgICBwb2ludEJvcmRlckNvbG9yOiAnI0ZGRkZGRicsXHJcbiAgICAgICAgICAgICAgICBwb2ludEJvcmRlcldpZHRoOiAzLFxyXG4gICAgICAgICAgICAgICAgcG9pbnRIb3ZlckJvcmRlckNvbG9yOiAncmdiYSgyNTUsIDI1NSwgMjU1LCAwLjIpJyxcclxuICAgICAgICAgICAgICAgIHBvaW50SG92ZXJCb3JkZXJXaWR0aDogMTAsXHJcbiAgICAgICAgICAgICAgICBsaW5lVGVuc2lvbjogMCxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgXSxcclxuICAgICAgfSxcclxuICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgIHJlc3BvbnNpdmU6IGZhbHNlLFxyXG4gICAgICAgIGVsZW1lbnRzOiB7XHJcbiAgICAgICAgICBwb2ludDoge1xyXG4gICAgICAgICAgICByYWRpdXM6IDYsXHJcbiAgICAgICAgICAgIGhpdFJhZGl1czogNixcclxuICAgICAgICAgICAgaG92ZXJSYWRpdXM6IDZcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGxlZ2VuZDoge1xyXG4gICAgICAgICAgZGlzcGxheTogZmFsc2UsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBwbHVnaW5zOiB7IFxyXG4gICAgICAgICAgbGVnZW5kOiB7XHJcbiAgICAgICAgICAgIGxhYmVsczoge1xyXG4gICAgICAgICAgICAgIGNvbG9yOiBcIndoaXRlXCIsIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzY2FsZXM6IHtcclxuICAgICAgICAgIHk6IHsgXHJcbiAgICAgICAgICAgIHRpY2tzOiB7XHJcbiAgICAgICAgICAgICAgY29sb3I6IFwid2hpdGVcIixcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHg6IHsgXHJcbiAgICAgICAgICAgIHRpY2tzOiB7XHJcbiAgICAgICAgICAgICAgY29sb3I6IFwid2hpdGVcIiwgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgfTtcclxuXHJcbiAgd2luZG93LmNoYXJ0ID0gbmV3IENoYXJ0KGNhbnZhcywgY29uZmlnKTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuLy9Mb3JzcXVlIHF1J29uIHNvdW1ldCBsZSBmb3JtdWxhaXJlIGRlIHJlY2hlcmNoZVxyXG5mb3JtLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgZSA9PiB7XHJcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gIHNlYXJjaFdlYXRoZXIoKTtcclxuICBtc2cudGV4dENvbnRlbnQgPSBcIlwiO1xyXG4gIGZvcm0ucmVzZXQoKTtcclxuICBpbnB1dC5mb2N1cygpO1xyXG59KTtcclxuXHJcbi8vT24gY2hhcmdlIGxhIG3DqXTDqW8gcGFyIGTDqWZhdXQgcG91ciBMacOoZ2Vcclxuc2VhcmNoV2VhdGhlcignTGnDqGdlJyk7XHJcblxyXG4vL09uIGNoYXJnZSBsZXMgYW5jaWVubmVzIHJlY2hlcmNoZXNcclxuZGlzcGxheU9sZFNlYXJjaCgpO1xyXG5cclxuXHJcbi8qXHJcbkVYRU1QTEUgREUgQ09OQ0FURU5BVElPTlxyXG5sZXQgbm9tID0gJ2xhdGlmYSc7XHJcbmNvbnNvbGUubG9nKCdCb25qb3VyJyArIG5vbSk7XHJcbmNvbnNvbGUubG9nKGBCb25qb3VyJyAke25vbX1gKTtcclxuXHJcbmxldCBleGVtcGxlXzEgPSAnPGgyIGNsYXNzPVwiY2l0eS1uYW1lXCIgZGF0YS1uYW1lPVwiJysgbmFtZSArICcsJysgc3lzLmNvdW50cnkgKydcIj4nO1xyXG5sZXQgZXhlbXBsZV8yID0gYDxoMiBjbGFzcz1cImNpdHktbmFtZVwiIGRhdGEtbmFtZT1cIiR7bmFtZX0sJHtzeXMuY291bnRyeX1cIj5gO1xyXG4gXHJcbiovXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vanMvc2NyaXB0LmpzIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3Njc3Mvc3R5bGUuc2Nzc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKiFcbiAqIGNvbnRlbnQtdHlwZVxuICogQ29weXJpZ2h0KGMpIDIwMTUgRG91Z2xhcyBDaHJpc3RvcGhlciBXaWxzb25cbiAqIE1JVCBMaWNlbnNlZFxuICovXG5cbid1c2Ugc3RyaWN0J1xuXG4vKipcbiAqIFJlZ0V4cCB0byBtYXRjaCAqKCBcIjtcIiBwYXJhbWV0ZXIgKSBpbiBSRkMgNzIzMSBzZWMgMy4xLjEuMVxuICpcbiAqIHBhcmFtZXRlciAgICAgPSB0b2tlbiBcIj1cIiAoIHRva2VuIC8gcXVvdGVkLXN0cmluZyApXG4gKiB0b2tlbiAgICAgICAgID0gMSp0Y2hhclxuICogdGNoYXIgICAgICAgICA9IFwiIVwiIC8gXCIjXCIgLyBcIiRcIiAvIFwiJVwiIC8gXCImXCIgLyBcIidcIiAvIFwiKlwiXG4gKiAgICAgICAgICAgICAgIC8gXCIrXCIgLyBcIi1cIiAvIFwiLlwiIC8gXCJeXCIgLyBcIl9cIiAvIFwiYFwiIC8gXCJ8XCIgLyBcIn5cIlxuICogICAgICAgICAgICAgICAvIERJR0lUIC8gQUxQSEFcbiAqICAgICAgICAgICAgICAgOyBhbnkgVkNIQVIsIGV4Y2VwdCBkZWxpbWl0ZXJzXG4gKiBxdW90ZWQtc3RyaW5nID0gRFFVT1RFICooIHFkdGV4dCAvIHF1b3RlZC1wYWlyICkgRFFVT1RFXG4gKiBxZHRleHQgICAgICAgID0gSFRBQiAvIFNQIC8gJXgyMSAvICV4MjMtNUIgLyAleDVELTdFIC8gb2JzLXRleHRcbiAqIG9icy10ZXh0ICAgICAgPSAleDgwLUZGXG4gKiBxdW90ZWQtcGFpciAgID0gXCJcXFwiICggSFRBQiAvIFNQIC8gVkNIQVIgLyBvYnMtdGV4dCApXG4gKi9cbnZhciBQQVJBTV9SRUdFWFAgPSAvOyAqKFshIyQlJicqKy5eX2B8fjAtOUEtWmEtei1dKykgKj0gKihcIig/OltcXHUwMDBiXFx1MDAyMFxcdTAwMjFcXHUwMDIzLVxcdTAwNWJcXHUwMDVkLVxcdTAwN2VcXHUwMDgwLVxcdTAwZmZdfFxcXFxbXFx1MDAwYlxcdTAwMjAtXFx1MDBmZl0pKlwifFshIyQlJicqKy5eX2B8fjAtOUEtWmEtei1dKykgKi9nXG52YXIgVEVYVF9SRUdFWFAgPSAvXltcXHUwMDBiXFx1MDAyMC1cXHUwMDdlXFx1MDA4MC1cXHUwMGZmXSskL1xudmFyIFRPS0VOX1JFR0VYUCA9IC9eWyEjJCUmJyorLl5fYHx+MC05QS1aYS16LV0rJC9cblxuLyoqXG4gKiBSZWdFeHAgdG8gbWF0Y2ggcXVvdGVkLXBhaXIgaW4gUkZDIDcyMzAgc2VjIDMuMi42XG4gKlxuICogcXVvdGVkLXBhaXIgPSBcIlxcXCIgKCBIVEFCIC8gU1AgLyBWQ0hBUiAvIG9icy10ZXh0IClcbiAqIG9icy10ZXh0ICAgID0gJXg4MC1GRlxuICovXG52YXIgUUVTQ19SRUdFWFAgPSAvXFxcXChbXFx1MDAwYlxcdTAwMjAtXFx1MDBmZl0pL2dcblxuLyoqXG4gKiBSZWdFeHAgdG8gbWF0Y2ggY2hhcnMgdGhhdCBtdXN0IGJlIHF1b3RlZC1wYWlyIGluIFJGQyA3MjMwIHNlYyAzLjIuNlxuICovXG52YXIgUVVPVEVfUkVHRVhQID0gLyhbXFxcXFwiXSkvZ1xuXG4vKipcbiAqIFJlZ0V4cCB0byBtYXRjaCB0eXBlIGluIFJGQyA3MjMxIHNlYyAzLjEuMS4xXG4gKlxuICogbWVkaWEtdHlwZSA9IHR5cGUgXCIvXCIgc3VidHlwZVxuICogdHlwZSAgICAgICA9IHRva2VuXG4gKiBzdWJ0eXBlICAgID0gdG9rZW5cbiAqL1xudmFyIFRZUEVfUkVHRVhQID0gL15bISMkJSYnKisuXl9gfH4wLTlBLVphLXotXStcXC9bISMkJSYnKisuXl9gfH4wLTlBLVphLXotXSskL1xuXG4vKipcbiAqIE1vZHVsZSBleHBvcnRzLlxuICogQHB1YmxpY1xuICovXG5cbmV4cG9ydHMuZm9ybWF0ID0gZm9ybWF0XG5leHBvcnRzLnBhcnNlID0gcGFyc2VcblxuLyoqXG4gKiBGb3JtYXQgb2JqZWN0IHRvIG1lZGlhIHR5cGUuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IG9ialxuICogQHJldHVybiB7c3RyaW5nfVxuICogQHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGZvcm1hdCAob2JqKSB7XG4gIGlmICghb2JqIHx8IHR5cGVvZiBvYmogIT09ICdvYmplY3QnKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignYXJndW1lbnQgb2JqIGlzIHJlcXVpcmVkJylcbiAgfVxuXG4gIHZhciBwYXJhbWV0ZXJzID0gb2JqLnBhcmFtZXRlcnNcbiAgdmFyIHR5cGUgPSBvYmoudHlwZVxuXG4gIGlmICghdHlwZSB8fCAhVFlQRV9SRUdFWFAudGVzdCh0eXBlKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2ludmFsaWQgdHlwZScpXG4gIH1cblxuICB2YXIgc3RyaW5nID0gdHlwZVxuXG4gIC8vIGFwcGVuZCBwYXJhbWV0ZXJzXG4gIGlmIChwYXJhbWV0ZXJzICYmIHR5cGVvZiBwYXJhbWV0ZXJzID09PSAnb2JqZWN0Jykge1xuICAgIHZhciBwYXJhbVxuICAgIHZhciBwYXJhbXMgPSBPYmplY3Qua2V5cyhwYXJhbWV0ZXJzKS5zb3J0KClcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFyYW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBwYXJhbSA9IHBhcmFtc1tpXVxuXG4gICAgICBpZiAoIVRPS0VOX1JFR0VYUC50ZXN0KHBhcmFtKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdpbnZhbGlkIHBhcmFtZXRlciBuYW1lJylcbiAgICAgIH1cblxuICAgICAgc3RyaW5nICs9ICc7ICcgKyBwYXJhbSArICc9JyArIHFzdHJpbmcocGFyYW1ldGVyc1twYXJhbV0pXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHN0cmluZ1xufVxuXG4vKipcbiAqIFBhcnNlIG1lZGlhIHR5cGUgdG8gb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfG9iamVjdH0gc3RyaW5nXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAcHVibGljXG4gKi9cblxuZnVuY3Rpb24gcGFyc2UgKHN0cmluZykge1xuICBpZiAoIXN0cmluZykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2FyZ3VtZW50IHN0cmluZyBpcyByZXF1aXJlZCcpXG4gIH1cblxuICAvLyBzdXBwb3J0IHJlcS9yZXMtbGlrZSBvYmplY3RzIGFzIGFyZ3VtZW50XG4gIHZhciBoZWFkZXIgPSB0eXBlb2Ygc3RyaW5nID09PSAnb2JqZWN0J1xuICAgID8gZ2V0Y29udGVudHR5cGUoc3RyaW5nKVxuICAgIDogc3RyaW5nXG5cbiAgaWYgKHR5cGVvZiBoZWFkZXIgIT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignYXJndW1lbnQgc3RyaW5nIGlzIHJlcXVpcmVkIHRvIGJlIGEgc3RyaW5nJylcbiAgfVxuXG4gIHZhciBpbmRleCA9IGhlYWRlci5pbmRleE9mKCc7JylcbiAgdmFyIHR5cGUgPSBpbmRleCAhPT0gLTFcbiAgICA/IGhlYWRlci5zdWJzdHIoMCwgaW5kZXgpLnRyaW0oKVxuICAgIDogaGVhZGVyLnRyaW0oKVxuXG4gIGlmICghVFlQRV9SRUdFWFAudGVzdCh0eXBlKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2ludmFsaWQgbWVkaWEgdHlwZScpXG4gIH1cblxuICB2YXIgb2JqID0gbmV3IENvbnRlbnRUeXBlKHR5cGUudG9Mb3dlckNhc2UoKSlcblxuICAvLyBwYXJzZSBwYXJhbWV0ZXJzXG4gIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICB2YXIga2V5XG4gICAgdmFyIG1hdGNoXG4gICAgdmFyIHZhbHVlXG5cbiAgICBQQVJBTV9SRUdFWFAubGFzdEluZGV4ID0gaW5kZXhcblxuICAgIHdoaWxlICgobWF0Y2ggPSBQQVJBTV9SRUdFWFAuZXhlYyhoZWFkZXIpKSkge1xuICAgICAgaWYgKG1hdGNoLmluZGV4ICE9PSBpbmRleCkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdpbnZhbGlkIHBhcmFtZXRlciBmb3JtYXQnKVxuICAgICAgfVxuXG4gICAgICBpbmRleCArPSBtYXRjaFswXS5sZW5ndGhcbiAgICAgIGtleSA9IG1hdGNoWzFdLnRvTG93ZXJDYXNlKClcbiAgICAgIHZhbHVlID0gbWF0Y2hbMl1cblxuICAgICAgaWYgKHZhbHVlWzBdID09PSAnXCInKSB7XG4gICAgICAgIC8vIHJlbW92ZSBxdW90ZXMgYW5kIGVzY2FwZXNcbiAgICAgICAgdmFsdWUgPSB2YWx1ZVxuICAgICAgICAgIC5zdWJzdHIoMSwgdmFsdWUubGVuZ3RoIC0gMilcbiAgICAgICAgICAucmVwbGFjZShRRVNDX1JFR0VYUCwgJyQxJylcbiAgICAgIH1cblxuICAgICAgb2JqLnBhcmFtZXRlcnNba2V5XSA9IHZhbHVlXG4gICAgfVxuXG4gICAgaWYgKGluZGV4ICE9PSBoZWFkZXIubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdpbnZhbGlkIHBhcmFtZXRlciBmb3JtYXQnKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvYmpcbn1cblxuLyoqXG4gKiBHZXQgY29udGVudC10eXBlIGZyb20gcmVxL3JlcyBvYmplY3RzLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fVxuICogQHJldHVybiB7T2JqZWN0fVxuICogQHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBnZXRjb250ZW50dHlwZSAob2JqKSB7XG4gIHZhciBoZWFkZXJcblxuICBpZiAodHlwZW9mIG9iai5nZXRIZWFkZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAvLyByZXMtbGlrZVxuICAgIGhlYWRlciA9IG9iai5nZXRIZWFkZXIoJ2NvbnRlbnQtdHlwZScpXG4gIH0gZWxzZSBpZiAodHlwZW9mIG9iai5oZWFkZXJzID09PSAnb2JqZWN0Jykge1xuICAgIC8vIHJlcS1saWtlXG4gICAgaGVhZGVyID0gb2JqLmhlYWRlcnMgJiYgb2JqLmhlYWRlcnNbJ2NvbnRlbnQtdHlwZSddXG4gIH1cblxuICBpZiAodHlwZW9mIGhlYWRlciAhPT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdjb250ZW50LXR5cGUgaGVhZGVyIGlzIG1pc3NpbmcgZnJvbSBvYmplY3QnKVxuICB9XG5cbiAgcmV0dXJuIGhlYWRlclxufVxuXG4vKipcbiAqIFF1b3RlIGEgc3RyaW5nIGlmIG5lY2Vzc2FyeS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdmFsXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKiBAcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHFzdHJpbmcgKHZhbCkge1xuICB2YXIgc3RyID0gU3RyaW5nKHZhbClcblxuICAvLyBubyBuZWVkIHRvIHF1b3RlIHRva2Vuc1xuICBpZiAoVE9LRU5fUkVHRVhQLnRlc3Qoc3RyKSkge1xuICAgIHJldHVybiBzdHJcbiAgfVxuXG4gIGlmIChzdHIubGVuZ3RoID4gMCAmJiAhVEVYVF9SRUdFWFAudGVzdChzdHIpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignaW52YWxpZCBwYXJhbWV0ZXIgdmFsdWUnKVxuICB9XG5cbiAgcmV0dXJuICdcIicgKyBzdHIucmVwbGFjZShRVU9URV9SRUdFWFAsICdcXFxcJDEnKSArICdcIidcbn1cblxuLyoqXG4gKiBDbGFzcyB0byByZXByZXNlbnQgYSBjb250ZW50IHR5cGUuXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBDb250ZW50VHlwZSAodHlwZSkge1xuICB0aGlzLnBhcmFtZXRlcnMgPSBPYmplY3QuY3JlYXRlKG51bGwpXG4gIHRoaXMudHlwZSA9IHR5cGVcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL34vY29udGVudC10eXBlL2luZGV4LmpzIiwiaW1wb3J0IHsgcGFyc2UgfSBmcm9tICdjb250ZW50LXR5cGUnO1xuXG5mdW5jdGlvbiBfZXh0ZW5kcygpIHtcbiAgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcblxuICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkge1xuICAgICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9O1xuXG4gIHJldHVybiBfZXh0ZW5kcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuXG5mdW5jdGlvbiBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShzb3VyY2UsIGV4Y2x1ZGVkKSB7XG4gIGlmIChzb3VyY2UgPT0gbnVsbCkgcmV0dXJuIHt9O1xuICB2YXIgdGFyZ2V0ID0ge307XG4gIHZhciBzb3VyY2VLZXlzID0gT2JqZWN0LmtleXMoc291cmNlKTtcbiAgdmFyIGtleSwgaTtcblxuICBmb3IgKGkgPSAwOyBpIDwgc291cmNlS2V5cy5sZW5ndGg7IGkrKykge1xuICAgIGtleSA9IHNvdXJjZUtleXNbaV07XG4gICAgaWYgKGV4Y2x1ZGVkLmluZGV4T2Yoa2V5KSA+PSAwKSBjb250aW51ZTtcbiAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxudmFyIGNoZWNrSXNTdHJpbmcgPSAvKiNfX1BVUkVfXyovZ2V0UmVmaW5lbWVudChmdW5jdGlvbiAodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgPyB2YWx1ZSA6IG51bGw7XG59KTtcbnZhciBpc0RlZmluZWQgPSBmdW5jdGlvbiBpc0RlZmluZWQoeCkge1xuICByZXR1cm4geCAhPT0gbnVsbCAmJiB4ICE9PSB1bmRlZmluZWQ7XG59O1xuZnVuY3Rpb24gZ2V0UmVmaW5lbWVudChnZXRCKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoYSkge1xuICAgIHJldHVybiBpc0RlZmluZWQoZ2V0QihhKSk7XG4gIH07XG59XG52YXIgY2hlY2tJc05vbkVtcHR5QXJyYXkgPSBmdW5jdGlvbiBjaGVja0lzTm9uRW1wdHlBcnJheShhKSB7XG4gIHJldHVybiBhLmxlbmd0aCA+IDA7XG59O1xuXG4vKiogVGFrZXMgYSBkaWN0aW9uYXJ5IGNvbnRhaW5pbmcgbnVsbGlzaCB2YWx1ZXMgYW5kIHJldHVybnMgYSBkaWN0aW9uYXJ5IG9mIGFsbCB0aGUgZGVmaW5lZFxyXG4gKiAobm9uLW51bGxpc2gpIHZhbHVlcy5cclxuICovXG5cbnZhciBjb21wYWN0RGVmaW5lZCA9IGZ1bmN0aW9uIGNvbXBhY3REZWZpbmVkKG9iaikge1xuICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5yZWR1Y2UoZnVuY3Rpb24gKGFjYywga2V5KSB7XG4gICAgdmFyIF9yZWY7XG5cbiAgICB2YXIgdmFsdWUgPSBvYmpba2V5XTtcbiAgICByZXR1cm4gX2V4dGVuZHMoe30sIGFjYywgaXNEZWZpbmVkKHZhbHVlKSA/IChfcmVmID0ge30sIF9yZWZba2V5XSA9IHZhbHVlLCBfcmVmKSA6IHt9KTtcbiAgfSwge30pO1xufTtcbmZ1bmN0aW9uIGZsb3coKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBmbnMgPSBuZXcgQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgZm5zW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICB9XG5cbiAgdmFyIGxlbiA9IGZucy5sZW5ndGggLSAxO1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGZvciAodmFyIF9sZW4yID0gYXJndW1lbnRzLmxlbmd0aCwgeCA9IG5ldyBBcnJheShfbGVuMiksIF9rZXkyID0gMDsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgICAgeFtfa2V5Ml0gPSBhcmd1bWVudHNbX2tleTJdO1xuICAgIH1cblxuICAgIHZhciB5ID0gZm5zWzBdLmFwcGx5KHRoaXMsIHgpO1xuXG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPD0gbGVuOyBpKyspIHtcbiAgICAgIHkgPSBmbnNbaV0uY2FsbCh0aGlzLCB5KTtcbiAgICB9XG5cbiAgICByZXR1cm4geTtcbiAgfTtcbn1cblxudmFyIGNoZWNrSXNPYmplY3QgPSAvKiNfX1BVUkVfXyovZ2V0UmVmaW5lbWVudChmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgcmV0dXJuIGlzRGVmaW5lZChyZXNwb25zZSkgJiYgdHlwZW9mIHJlc3BvbnNlID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheShyZXNwb25zZSkgPyByZXNwb25zZSA6IG51bGw7XG59KTtcbnZhciBjaGVja0lzRXJyb3JzID0gLyojX19QVVJFX18qL2dldFJlZmluZW1lbnQoZnVuY3Rpb24gKGVycm9ycykge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShlcnJvcnMpICYmIGVycm9ycy5ldmVyeShjaGVja0lzU3RyaW5nKSAmJiBjaGVja0lzTm9uRW1wdHlBcnJheShlcnJvcnMpID8gZXJyb3JzIDogbnVsbDtcbn0pO1xudmFyIGNoZWNrSXNBcGlFcnJvciA9IC8qI19fUFVSRV9fKi9nZXRSZWZpbmVtZW50KGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICByZXR1cm4gY2hlY2tJc09iamVjdChyZXNwb25zZSkgJiYgJ2Vycm9ycycgaW4gcmVzcG9uc2UgJiYgY2hlY2tJc0Vycm9ycyhyZXNwb25zZS5lcnJvcnMpID8ge1xuICAgIGVycm9yczogcmVzcG9uc2UuZXJyb3JzXG4gIH0gOiBudWxsO1xufSk7XG52YXIgZ2V0RXJyb3JGb3JCYWRTdGF0dXNDb2RlID0gZnVuY3Rpb24gZ2V0RXJyb3JGb3JCYWRTdGF0dXNDb2RlKGpzb25SZXNwb25zZSkge1xuICBpZiAoY2hlY2tJc0FwaUVycm9yKGpzb25SZXNwb25zZSkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZXJyb3JzOiBqc29uUmVzcG9uc2UuZXJyb3JzLFxuICAgICAgc291cmNlOiAnYXBpJ1xuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGVycm9yczogWydSZXNwb25kZWQgd2l0aCBhIHN0YXR1cyBjb2RlIG91dHNpZGUgdGhlIDJ4eCByYW5nZSwgYW5kIHRoZSByZXNwb25zZSBib2R5IGlzIG5vdCByZWNvZ25pc2FibGUuJ10sXG4gICAgICBzb3VyY2U6ICdkZWNvZGluZydcbiAgICB9O1xuICB9XG59O1xudmFyIERlY29kaW5nRXJyb3IgPSBmdW5jdGlvbiBEZWNvZGluZ0Vycm9yKG1lc3NhZ2UpIHtcbiAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbn07XG5cbnZhciBDT05URU5UX1RZUEVfUkVTUE9OU0VfSEVBREVSID0gJ2NvbnRlbnQtdHlwZSc7XG52YXIgQ09OVEVOVF9UWVBFX0pTT04gPSAnYXBwbGljYXRpb24vanNvbic7XG5cbnZhciBjaGVja0lzSnNvblJlc3BvbnNlID0gZnVuY3Rpb24gY2hlY2tJc0pzb25SZXNwb25zZShyZXNwb25zZSkge1xuICB2YXIgY29udGVudFR5cGVIZWFkZXIgPSByZXNwb25zZS5oZWFkZXJzLmdldChDT05URU5UX1RZUEVfUkVTUE9OU0VfSEVBREVSKTtcbiAgcmV0dXJuIGlzRGVmaW5lZChjb250ZW50VHlwZUhlYWRlcikgJiYgcGFyc2UoY29udGVudFR5cGVIZWFkZXIpLnR5cGUgPT09IENPTlRFTlRfVFlQRV9KU09OO1xufTtcbi8qKlxyXG4gKiBOb3RlOiByZXN0cmljdCB0aGUgdHlwZSBvZiBKU09OIHRvIGBBbnlKc29uYCBzbyB0aGF0IGBhbnlgIGRvZXNuJ3QgbGVhayBkb3duc3RyZWFtLlxyXG4gKi9cblxuXG52YXIgZ2V0SnNvblJlc3BvbnNlID0gZnVuY3Rpb24gZ2V0SnNvblJlc3BvbnNlKHJlc3BvbnNlKSB7XG4gIGlmIChjaGVja0lzSnNvblJlc3BvbnNlKHJlc3BvbnNlKSkge1xuICAgIHJldHVybiByZXNwb25zZS5qc29uKClbXCJjYXRjaFwiXShmdW5jdGlvbiAoX2Vycikge1xuICAgICAgdGhyb3cgbmV3IERlY29kaW5nRXJyb3IoJ3VuYWJsZSB0byBwYXJzZSBKU09OIHJlc3BvbnNlLicpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBEZWNvZGluZ0Vycm9yKCdleHBlY3RlZCBKU09OIHJlc3BvbnNlIGZyb20gc2VydmVyLicpO1xuICB9XG59O1xuXG52YXIgaGFuZGxlRmV0Y2hSZXNwb25zZSA9IGZ1bmN0aW9uIGhhbmRsZUZldGNoUmVzcG9uc2UoaGFuZGxlUmVzcG9uc2UpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgIHJldHVybiAocmVzcG9uc2Uub2sgPyBoYW5kbGVSZXNwb25zZSh7XG4gICAgICByZXNwb25zZTogcmVzcG9uc2VcbiAgICB9KS50aGVuKGZ1bmN0aW9uIChoYW5kbGVkUmVzcG9uc2UpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6ICdzdWNjZXNzJyxcbiAgICAgICAgc3RhdHVzOiByZXNwb25zZS5zdGF0dXMsXG4gICAgICAgIHJlc3BvbnNlOiBoYW5kbGVkUmVzcG9uc2UsXG4gICAgICAgIG9yaWdpbmFsUmVzcG9uc2U6IHJlc3BvbnNlXG4gICAgICB9O1xuICAgIH0pIDogZ2V0SnNvblJlc3BvbnNlKHJlc3BvbnNlKS50aGVuKGZ1bmN0aW9uIChqc29uUmVzcG9uc2UpIHtcbiAgICAgIHJldHVybiBfZXh0ZW5kcyh7XG4gICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzXG4gICAgICB9LCBnZXRFcnJvckZvckJhZFN0YXR1c0NvZGUoanNvblJlc3BvbnNlKSwge1xuICAgICAgICBvcmlnaW5hbFJlc3BvbnNlOiByZXNwb25zZVxuICAgICAgfSk7XG4gICAgfSkpW1wiY2F0Y2hcIl0oZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAvKipcclxuICAgICAgICogV2Ugd2FudCB0byBzZXBhcmF0ZSBleHBlY3RlZCBkZWNvZGluZyBlcnJvcnMgZnJvbSB1bmtub3duIG9uZXMuIFdlIGRvIHNvIGJ5IHRocm93aW5nIGEgY3VzdG9tXHJcbiAgICAgICAqIGBEZWNvZGluZ0Vycm9yYCB3aGVuZXZlciB3ZSBlbmNvdW50ZXIgb25lIHdpdGhpbiBgaGFuZGxlRmV0Y2hSZXNwb25zZWAgYW5kIGNhdGNoIHRoZW0gYWxsXHJcbiAgICAgICAqIGhlcmUuIFRoaXMgYWxsb3dzIHVzIHRvIGVhc2lseSBoYW5kbGUgYWxsIG9mIHRoZXNlIGVycm9ycyBhdCBvbmNlLiBVbmV4cGVjdGVkIGVycm9ycyBhcmUgbm90XHJcbiAgICAgICAqIGNhdWdodCwgc28gdGhhdCB0aGV5IGJ1YmJsZSB1cCBhbmQgZmFpbCBsb3VkbHkuXHJcbiAgICAgICAqXHJcbiAgICAgICAqIE5vdGU6IElkZWFsbHkgd2UnZCB1c2UgYW4gRWl0aGVyIHR5cGUsIGJ1dCB0aGlzIGRvZXMgdGhlIGpvYiB3aXRob3V0IGludHJvZHVjaW5nIGRlcGVuZGVuY2llc1xyXG4gICAgICAgKiBsaWtlIGBmcC10c2AuXHJcbiAgICAgICAqL1xuICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRGVjb2RpbmdFcnJvcikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgc291cmNlOiAnZGVjb2RpbmcnLFxuICAgICAgICAgIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgICAgIG9yaWdpbmFsUmVzcG9uc2U6IHJlc3BvbnNlLFxuICAgICAgICAgIGVycm9yczogW2Vycm9yLm1lc3NhZ2VdXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn07XG52YXIgY2FzdFJlc3BvbnNlID0gZnVuY3Rpb24gY2FzdFJlc3BvbnNlKCkge1xuICByZXR1cm4gZnVuY3Rpb24gKF9yZWYpIHtcbiAgICB2YXIgcmVzcG9uc2UgPSBfcmVmLnJlc3BvbnNlO1xuICAgIHJldHVybiBnZXRKc29uUmVzcG9uc2UocmVzcG9uc2UpO1xuICB9O1xufTtcblxudmFyIGFkZFF1ZXJ5VG9VcmwgPSBmdW5jdGlvbiBhZGRRdWVyeVRvVXJsKHF1ZXJ5KSB7XG4gIHJldHVybiBmdW5jdGlvbiAodXJsKSB7XG4gICAgT2JqZWN0LmtleXMocXVlcnkpLmZvckVhY2goZnVuY3Rpb24gKHF1ZXJ5S2V5KSB7XG4gICAgICByZXR1cm4gdXJsLnNlYXJjaFBhcmFtcy5zZXQocXVlcnlLZXksIHF1ZXJ5W3F1ZXJ5S2V5XS50b1N0cmluZygpKTtcbiAgICB9KTtcbiAgfTtcbn07XG5cbnZhciBhZGRQYXRobmFtZVRvVXJsID0gZnVuY3Rpb24gYWRkUGF0aG5hbWVUb1VybChwYXRobmFtZSkge1xuICByZXR1cm4gZnVuY3Rpb24gKHVybCkge1xuICAgIC8vIFdoZW4gdGhlcmUgaXMgbm8gZXhpc3RpbmcgcGF0aG5hbWUsIHRoZSB2YWx1ZSBpcyBgL2AuIEFwcGVuZGluZyB3b3VsZCBnaXZlIHVzIGEgVVJMIHdpdGggdHdvXG4gICAgLy8gZm9yd2FyZCBzbGFzaGVzLiBUaGlzIGlzIHdoeSB3ZSByZXBsYWNlIHRoZSB2YWx1ZSBpbiB0aGF0IHNjZW5hcmlvLlxuICAgIGlmICh1cmwucGF0aG5hbWUgPT09ICcvJykge1xuICAgICAgdXJsLnBhdGhuYW1lID0gcGF0aG5hbWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHVybC5wYXRobmFtZSArPSBwYXRobmFtZTtcbiAgICB9XG4gIH07XG59O1xuXG52YXIgYnVpbGRVcmwgPSBmdW5jdGlvbiBidWlsZFVybChfcmVmKSB7XG4gIHZhciBwYXRobmFtZSA9IF9yZWYucGF0aG5hbWUsXG4gICAgICBxdWVyeSA9IF9yZWYucXVlcnk7XG4gIHJldHVybiBmdW5jdGlvbiAoYXBpVXJsKSB7XG4gICAgdmFyIHVybCA9IG5ldyBVUkwoYXBpVXJsKTtcbiAgICBhZGRQYXRobmFtZVRvVXJsKHBhdGhuYW1lKSh1cmwpO1xuICAgIGFkZFF1ZXJ5VG9VcmwocXVlcnkpKHVybCk7XG4gICAgcmV0dXJuIHVybC50b1N0cmluZygpO1xuICB9O1xufTtcblxudmFyIGdldFF1ZXJ5RnJvbVNlYXJjaFBhcmFtcyA9IGZ1bmN0aW9uIGdldFF1ZXJ5RnJvbVNlYXJjaFBhcmFtcyhzZWFyY2hQYXJhbXMpIHtcbiAgdmFyIHF1ZXJ5ID0ge307XG4gIHNlYXJjaFBhcmFtcy5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgcXVlcnlba2V5XSA9IHZhbHVlO1xuICB9KTtcbiAgcmV0dXJuIHF1ZXJ5O1xufTtcblxudmFyIHBhcnNlUXVlcnlBbmRQYXRobmFtZSA9IGZ1bmN0aW9uIHBhcnNlUXVlcnlBbmRQYXRobmFtZSh1cmwpIHtcbiAgdmFyIF9VUkwgPSBuZXcgVVJMKHVybCksXG4gICAgICBwYXRobmFtZSA9IF9VUkwucGF0aG5hbWUsXG4gICAgICBzZWFyY2hQYXJhbXMgPSBfVVJMLnNlYXJjaFBhcmFtcztcblxuICB2YXIgcXVlcnkgPSBnZXRRdWVyeUZyb21TZWFyY2hQYXJhbXMoc2VhcmNoUGFyYW1zKTtcbiAgcmV0dXJuIHtcbiAgICBxdWVyeTogcXVlcnksXG4gICAgcGF0aG5hbWU6IHBhdGhuYW1lID09PSAnLycgPyB1bmRlZmluZWQgOiBwYXRobmFtZVxuICB9O1xufTtcblxuLyoqXHJcbiAqIGhlbHBlciB1c2VkIHRvIHR5cGUtY2hlY2sgdGhlIGFyZ3VtZW50cywgYW5kIGFkZCBkZWZhdWx0IHBhcmFtcyBmb3IgYWxsIHJlcXVlc3RzXHJcbiAqL1xuXG52YXIgY3JlYXRlUmVxdWVzdEhhbmRsZXIgPSBmdW5jdGlvbiBjcmVhdGVSZXF1ZXN0SGFuZGxlcihmbikge1xuICByZXR1cm4gZnVuY3Rpb24gKGEsIGFkZGl0aW9uYWxGZXRjaE9wdGlvbnMpIHtcbiAgICBpZiAoYWRkaXRpb25hbEZldGNoT3B0aW9ucyA9PT0gdm9pZCAwKSB7XG4gICAgICBhZGRpdGlvbmFsRmV0Y2hPcHRpb25zID0ge307XG4gICAgfVxuXG4gICAgdmFyIF9mbiA9IGZuKGEpLFxuICAgICAgICBoZWFkZXJzID0gX2ZuLmhlYWRlcnMsXG4gICAgICAgIHF1ZXJ5ID0gX2ZuLnF1ZXJ5LFxuICAgICAgICBiYXNlUmVxUGFyYW1zID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UoX2ZuLCBbXCJoZWFkZXJzXCIsIFwicXVlcnlcIl0pO1xuXG4gICAgcmV0dXJuIF9leHRlbmRzKHt9LCBiYXNlUmVxUGFyYW1zLCBhZGRpdGlvbmFsRmV0Y2hPcHRpb25zLCB7XG4gICAgICBxdWVyeTogcXVlcnksXG4gICAgICBoZWFkZXJzOiBfZXh0ZW5kcyh7fSwgaGVhZGVycywgYWRkaXRpb25hbEZldGNoT3B0aW9ucy5oZWFkZXJzKVxuICAgIH0pO1xuICB9O1xufTtcbnZhciBtYWtlRW5kcG9pbnQgPSBmdW5jdGlvbiBtYWtlRW5kcG9pbnQoZW5kcG9pbnQpIHtcbiAgcmV0dXJuIGVuZHBvaW50O1xufTtcbnZhciBpbml0TWFrZVJlcXVlc3QgPSBmdW5jdGlvbiBpbml0TWFrZVJlcXVlc3QoX3JlZikge1xuICB2YXIgYWNjZXNzS2V5ID0gX3JlZi5hY2Nlc3NLZXksXG4gICAgICBfcmVmJGFwaVZlcnNpb24gPSBfcmVmLmFwaVZlcnNpb24sXG4gICAgICBhcGlWZXJzaW9uID0gX3JlZiRhcGlWZXJzaW9uID09PSB2b2lkIDAgPyAndjEnIDogX3JlZiRhcGlWZXJzaW9uLFxuICAgICAgX3JlZiRhcGlVcmwgPSBfcmVmLmFwaVVybCxcbiAgICAgIGFwaVVybCA9IF9yZWYkYXBpVXJsID09PSB2b2lkIDAgPyAnaHR0cHM6Ly9hcGkudW5zcGxhc2guY29tJyA6IF9yZWYkYXBpVXJsLFxuICAgICAgZ2VuZXJhbEhlYWRlcnMgPSBfcmVmLmhlYWRlcnMsXG4gICAgICBwcm92aWRlZEZldGNoID0gX3JlZi5mZXRjaCxcbiAgICAgIGdlbmVyYWxGZXRjaE9wdGlvbnMgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShfcmVmLCBbXCJhY2Nlc3NLZXlcIiwgXCJhcGlWZXJzaW9uXCIsIFwiYXBpVXJsXCIsIFwiaGVhZGVyc1wiLCBcImZldGNoXCJdKTtcblxuICByZXR1cm4gZnVuY3Rpb24gKF9yZWYyKSB7XG4gICAgdmFyIGhhbmRsZVJlc3BvbnNlID0gX3JlZjIuaGFuZGxlUmVzcG9uc2UsXG4gICAgICAgIGhhbmRsZVJlcXVlc3QgPSBfcmVmMi5oYW5kbGVSZXF1ZXN0O1xuICAgIHJldHVybiBmbG93KGhhbmRsZVJlcXVlc3QsIGZ1bmN0aW9uIChfcmVmMykge1xuICAgICAgdmFyIHBhdGhuYW1lID0gX3JlZjMucGF0aG5hbWUsXG4gICAgICAgICAgcXVlcnkgPSBfcmVmMy5xdWVyeSxcbiAgICAgICAgICBfcmVmMyRtZXRob2QgPSBfcmVmMy5tZXRob2QsXG4gICAgICAgICAgbWV0aG9kID0gX3JlZjMkbWV0aG9kID09PSB2b2lkIDAgPyAnR0VUJyA6IF9yZWYzJG1ldGhvZCxcbiAgICAgICAgICBlbmRwb2ludEhlYWRlcnMgPSBfcmVmMy5oZWFkZXJzLFxuICAgICAgICAgIGJvZHkgPSBfcmVmMy5ib2R5LFxuICAgICAgICAgIHNpZ25hbCA9IF9yZWYzLnNpZ25hbDtcbiAgICAgIHZhciB1cmwgPSBidWlsZFVybCh7XG4gICAgICAgIHBhdGhuYW1lOiBwYXRobmFtZSxcbiAgICAgICAgcXVlcnk6IHF1ZXJ5XG4gICAgICB9KShhcGlVcmwpO1xuXG4gICAgICB2YXIgZmV0Y2hPcHRpb25zID0gX2V4dGVuZHMoe1xuICAgICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgICAgaGVhZGVyczogX2V4dGVuZHMoe30sIGdlbmVyYWxIZWFkZXJzLCBlbmRwb2ludEhlYWRlcnMsIHtcbiAgICAgICAgICAnQWNjZXB0LVZlcnNpb24nOiBhcGlWZXJzaW9uXG4gICAgICAgIH0sIGlzRGVmaW5lZChhY2Nlc3NLZXkpID8ge1xuICAgICAgICAgIEF1dGhvcml6YXRpb246IFwiQ2xpZW50LUlEIFwiICsgYWNjZXNzS2V5XG4gICAgICAgIH0gOiB7fSksXG4gICAgICAgIGJvZHk6IGJvZHksXG4gICAgICAgIHNpZ25hbDogc2lnbmFsXG4gICAgICB9LCBnZW5lcmFsRmV0Y2hPcHRpb25zKTtcblxuICAgICAgdmFyIGZldGNoVG9Vc2UgPSBwcm92aWRlZEZldGNoICE9IG51bGwgPyBwcm92aWRlZEZldGNoIDogZmV0Y2g7XG4gICAgICByZXR1cm4gZmV0Y2hUb1VzZSh1cmwsIGZldGNoT3B0aW9ucykudGhlbihoYW5kbGVGZXRjaFJlc3BvbnNlKGhhbmRsZVJlc3BvbnNlKSk7XG4gICAgfSk7XG4gIH07XG59O1xuXG52YXIgVE9UQUxfUkVTUE9OU0VfSEVBREVSID0gJ3gtdG90YWwnO1xuXG52YXIgZ2V0VG90YWxGcm9tQXBpRmVlZFJlc3BvbnNlID0gZnVuY3Rpb24gZ2V0VG90YWxGcm9tQXBpRmVlZFJlc3BvbnNlKHJlc3BvbnNlKSB7XG4gIHZhciB0b3RhbHNTdHIgPSByZXNwb25zZS5oZWFkZXJzLmdldChUT1RBTF9SRVNQT05TRV9IRUFERVIpO1xuXG4gIGlmIChpc0RlZmluZWQodG90YWxzU3RyKSkge1xuICAgIHZhciB0b3RhbCA9IHBhcnNlSW50KHRvdGFsc1N0cik7XG5cbiAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcih0b3RhbCkpIHtcbiAgICAgIHJldHVybiB0b3RhbDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IERlY29kaW5nRXJyb3IoXCJleHBlY3RlZCBcIiArIFRPVEFMX1JFU1BPTlNFX0hFQURFUiArIFwiIGhlYWRlciB0byBiZSB2YWxpZCBpbnRlZ2VyLlwiKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IERlY29kaW5nRXJyb3IoXCJleHBlY3RlZCBcIiArIFRPVEFMX1JFU1BPTlNFX0hFQURFUiArIFwiIGhlYWRlciB0byBleGlzdC5cIik7XG4gIH1cbn07XG5cbnZhciBoYW5kbGVGZWVkUmVzcG9uc2UgPSBmdW5jdGlvbiBoYW5kbGVGZWVkUmVzcG9uc2UoKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoX3JlZikge1xuICAgIHZhciByZXNwb25zZSA9IF9yZWYucmVzcG9uc2U7XG4gICAgcmV0dXJuIGNhc3RSZXNwb25zZSgpKHtcbiAgICAgIHJlc3BvbnNlOiByZXNwb25zZVxuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3VsdHMpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHJlc3VsdHM6IHJlc3VsdHMsXG4gICAgICAgIHRvdGFsOiBnZXRUb3RhbEZyb21BcGlGZWVkUmVzcG9uc2UocmVzcG9uc2UpXG4gICAgICB9O1xuICAgIH0pO1xuICB9O1xufTtcblxudmFyIGdldENvbGxlY3Rpb25zID0gZnVuY3Rpb24gZ2V0Q29sbGVjdGlvbnMoY29sbGVjdGlvbklkcykge1xuICByZXR1cm4gaXNEZWZpbmVkKGNvbGxlY3Rpb25JZHMpID8ge1xuICAgIGNvbGxlY3Rpb25zOiBjb2xsZWN0aW9uSWRzLmpvaW4oKVxuICB9IDoge307XG59O1xudmFyIGdldFRvcGljcyA9IGZ1bmN0aW9uIGdldFRvcGljcyh0b3BpY0lkcykge1xuICByZXR1cm4gaXNEZWZpbmVkKHRvcGljSWRzKSA/IHtcbiAgICB0b3BpY3M6IHRvcGljSWRzLmpvaW4oKVxuICB9IDoge307XG59O1xudmFyIGdldEZlZWRQYXJhbXMgPSBmdW5jdGlvbiBnZXRGZWVkUGFyYW1zKF9yZWYpIHtcbiAgdmFyIHBhZ2UgPSBfcmVmLnBhZ2UsXG4gICAgICBwZXJQYWdlID0gX3JlZi5wZXJQYWdlLFxuICAgICAgb3JkZXJCeSA9IF9yZWYub3JkZXJCeTtcbiAgcmV0dXJuIGNvbXBhY3REZWZpbmVkKHtcbiAgICBwZXJfcGFnZTogcGVyUGFnZSxcbiAgICBvcmRlcl9ieTogb3JkZXJCeSxcbiAgICBwYWdlOiBwYWdlXG4gIH0pO1xufTtcblxudmFyIENPTExFQ1RJT05TX1BBVEhfUFJFRklYID0gJy9jb2xsZWN0aW9ucyc7XG52YXIgZ2V0UGhvdG9zID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgdmFyIGdldFBhdGhuYW1lID0gZnVuY3Rpb24gZ2V0UGF0aG5hbWUoX3JlZikge1xuICAgIHZhciBjb2xsZWN0aW9uSWQgPSBfcmVmLmNvbGxlY3Rpb25JZDtcbiAgICByZXR1cm4gQ09MTEVDVElPTlNfUEFUSF9QUkVGSVggKyBcIi9cIiArIGNvbGxlY3Rpb25JZCArIFwiL3Bob3Rvc1wiO1xuICB9O1xuXG4gIHJldHVybiBtYWtlRW5kcG9pbnQoe1xuICAgIGdldFBhdGhuYW1lOiBnZXRQYXRobmFtZSxcbiAgICBoYW5kbGVSZXF1ZXN0OiBjcmVhdGVSZXF1ZXN0SGFuZGxlcihmdW5jdGlvbiAoX3JlZjIpIHtcbiAgICAgIHZhciBjb2xsZWN0aW9uSWQgPSBfcmVmMi5jb2xsZWN0aW9uSWQsXG4gICAgICAgICAgb3JpZW50YXRpb24gPSBfcmVmMi5vcmllbnRhdGlvbixcbiAgICAgICAgICBwYWdpbmF0aW9uUGFyYW1zID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UoX3JlZjIsIFtcImNvbGxlY3Rpb25JZFwiLCBcIm9yaWVudGF0aW9uXCJdKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcGF0aG5hbWU6IGdldFBhdGhuYW1lKHtcbiAgICAgICAgICBjb2xsZWN0aW9uSWQ6IGNvbGxlY3Rpb25JZFxuICAgICAgICB9KSxcbiAgICAgICAgcXVlcnk6IGNvbXBhY3REZWZpbmVkKF9leHRlbmRzKHt9LCBnZXRGZWVkUGFyYW1zKHBhZ2luYXRpb25QYXJhbXMpLCB7XG4gICAgICAgICAgb3JpZW50YXRpb246IG9yaWVudGF0aW9uXG4gICAgICAgIH0pKVxuICAgICAgfTtcbiAgICB9KSxcbiAgICBoYW5kbGVSZXNwb25zZTogaGFuZGxlRmVlZFJlc3BvbnNlKClcbiAgfSk7XG59KCk7XG52YXIgZ2V0ID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgdmFyIGdldFBhdGhuYW1lID0gZnVuY3Rpb24gZ2V0UGF0aG5hbWUoX3JlZjMpIHtcbiAgICB2YXIgY29sbGVjdGlvbklkID0gX3JlZjMuY29sbGVjdGlvbklkO1xuICAgIHJldHVybiBDT0xMRUNUSU9OU19QQVRIX1BSRUZJWCArIFwiL1wiICsgY29sbGVjdGlvbklkO1xuICB9O1xuXG4gIHJldHVybiBtYWtlRW5kcG9pbnQoe1xuICAgIGdldFBhdGhuYW1lOiBnZXRQYXRobmFtZSxcbiAgICBoYW5kbGVSZXF1ZXN0OiBjcmVhdGVSZXF1ZXN0SGFuZGxlcihmdW5jdGlvbiAoX3JlZjQpIHtcbiAgICAgIHZhciBjb2xsZWN0aW9uSWQgPSBfcmVmNC5jb2xsZWN0aW9uSWQ7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwYXRobmFtZTogZ2V0UGF0aG5hbWUoe1xuICAgICAgICAgIGNvbGxlY3Rpb25JZDogY29sbGVjdGlvbklkXG4gICAgICAgIH0pLFxuICAgICAgICBxdWVyeToge31cbiAgICAgIH07XG4gICAgfSksXG4gICAgaGFuZGxlUmVzcG9uc2U6IGNhc3RSZXNwb25zZSgpXG4gIH0pO1xufSgpO1xudmFyIGxpc3QgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICB2YXIgZ2V0UGF0aG5hbWUgPSBmdW5jdGlvbiBnZXRQYXRobmFtZSgpIHtcbiAgICByZXR1cm4gQ09MTEVDVElPTlNfUEFUSF9QUkVGSVg7XG4gIH07XG5cbiAgcmV0dXJuIG1ha2VFbmRwb2ludCh7XG4gICAgZ2V0UGF0aG5hbWU6IGdldFBhdGhuYW1lLFxuICAgIGhhbmRsZVJlcXVlc3Q6IGNyZWF0ZVJlcXVlc3RIYW5kbGVyKGZ1bmN0aW9uIChwYWdpbmF0aW9uUGFyYW1zKSB7XG4gICAgICBpZiAocGFnaW5hdGlvblBhcmFtcyA9PT0gdm9pZCAwKSB7XG4gICAgICAgIHBhZ2luYXRpb25QYXJhbXMgPSB7fTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcGF0aG5hbWU6IGdldFBhdGhuYW1lKCksXG4gICAgICAgIHF1ZXJ5OiBnZXRGZWVkUGFyYW1zKHBhZ2luYXRpb25QYXJhbXMpXG4gICAgICB9O1xuICAgIH0pLFxuICAgIGhhbmRsZVJlc3BvbnNlOiBoYW5kbGVGZWVkUmVzcG9uc2UoKVxuICB9KTtcbn0oKTtcbnZhciBnZXRSZWxhdGVkID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgdmFyIGdldFBhdGhuYW1lID0gZnVuY3Rpb24gZ2V0UGF0aG5hbWUoX3JlZjUpIHtcbiAgICB2YXIgY29sbGVjdGlvbklkID0gX3JlZjUuY29sbGVjdGlvbklkO1xuICAgIHJldHVybiBDT0xMRUNUSU9OU19QQVRIX1BSRUZJWCArIFwiL1wiICsgY29sbGVjdGlvbklkICsgXCIvcmVsYXRlZFwiO1xuICB9O1xuXG4gIHJldHVybiBtYWtlRW5kcG9pbnQoe1xuICAgIGdldFBhdGhuYW1lOiBnZXRQYXRobmFtZSxcbiAgICBoYW5kbGVSZXF1ZXN0OiBjcmVhdGVSZXF1ZXN0SGFuZGxlcihmdW5jdGlvbiAoX3JlZjYpIHtcbiAgICAgIHZhciBjb2xsZWN0aW9uSWQgPSBfcmVmNi5jb2xsZWN0aW9uSWQ7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwYXRobmFtZTogZ2V0UGF0aG5hbWUoe1xuICAgICAgICAgIGNvbGxlY3Rpb25JZDogY29sbGVjdGlvbklkXG4gICAgICAgIH0pLFxuICAgICAgICBxdWVyeToge31cbiAgICAgIH07XG4gICAgfSksXG4gICAgaGFuZGxlUmVzcG9uc2U6IGNhc3RSZXNwb25zZSgpXG4gIH0pO1xufSgpO1xuXG52YXIgaW5kZXggPSB7XG4gIF9fcHJvdG9fXzogbnVsbCxcbiAgZ2V0UGhvdG9zOiBnZXRQaG90b3MsXG4gIGdldDogZ2V0LFxuICBsaXN0OiBsaXN0LFxuICBnZXRSZWxhdGVkOiBnZXRSZWxhdGVkXG59O1xuXG52YXIgUEhPVE9TX1BBVEhfUFJFRklYID0gJy9waG90b3MnO1xudmFyIGxpc3QkMSA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIHZhciBfZ2V0UGF0aG5hbWUgPSBmdW5jdGlvbiBnZXRQYXRobmFtZSgpIHtcbiAgICByZXR1cm4gUEhPVE9TX1BBVEhfUFJFRklYO1xuICB9O1xuXG4gIHJldHVybiBtYWtlRW5kcG9pbnQoe1xuICAgIC8vIFdyYXBwZXIgdXNlcyB0eXBlIHRyaWNrIHRvIGFsbG93IDAgYXJnc1xuICAgIGdldFBhdGhuYW1lOiBmdW5jdGlvbiBnZXRQYXRobmFtZShfcGFyYW1zKSB7XG4gICAgICByZXR1cm4gX2dldFBhdGhuYW1lKCk7XG4gICAgfSxcbiAgICBoYW5kbGVSZXF1ZXN0OiBjcmVhdGVSZXF1ZXN0SGFuZGxlcihmdW5jdGlvbiAoZmVlZFBhcmFtcykge1xuICAgICAgaWYgKGZlZWRQYXJhbXMgPT09IHZvaWQgMCkge1xuICAgICAgICBmZWVkUGFyYW1zID0ge307XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHBhdGhuYW1lOiBQSE9UT1NfUEFUSF9QUkVGSVgsXG4gICAgICAgIHF1ZXJ5OiBjb21wYWN0RGVmaW5lZChnZXRGZWVkUGFyYW1zKGZlZWRQYXJhbXMpKVxuICAgICAgfTtcbiAgICB9KSxcbiAgICBoYW5kbGVSZXNwb25zZTogaGFuZGxlRmVlZFJlc3BvbnNlKClcbiAgfSk7XG59KCk7XG52YXIgZ2V0JDEgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICB2YXIgZ2V0UGF0aG5hbWUgPSBmdW5jdGlvbiBnZXRQYXRobmFtZShfcmVmKSB7XG4gICAgdmFyIHBob3RvSWQgPSBfcmVmLnBob3RvSWQ7XG4gICAgcmV0dXJuIFBIT1RPU19QQVRIX1BSRUZJWCArIFwiL1wiICsgcGhvdG9JZDtcbiAgfTtcblxuICByZXR1cm4gbWFrZUVuZHBvaW50KHtcbiAgICBnZXRQYXRobmFtZTogZ2V0UGF0aG5hbWUsXG4gICAgaGFuZGxlUmVxdWVzdDogY3JlYXRlUmVxdWVzdEhhbmRsZXIoZnVuY3Rpb24gKF9yZWYyKSB7XG4gICAgICB2YXIgcGhvdG9JZCA9IF9yZWYyLnBob3RvSWQ7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwYXRobmFtZTogZ2V0UGF0aG5hbWUoe1xuICAgICAgICAgIHBob3RvSWQ6IHBob3RvSWRcbiAgICAgICAgfSksXG4gICAgICAgIHF1ZXJ5OiB7fVxuICAgICAgfTtcbiAgICB9KSxcbiAgICBoYW5kbGVSZXNwb25zZTogY2FzdFJlc3BvbnNlKClcbiAgfSk7XG59KCk7XG52YXIgZ2V0U3RhdHMgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICB2YXIgZ2V0UGF0aG5hbWUgPSBmdW5jdGlvbiBnZXRQYXRobmFtZShfcmVmMykge1xuICAgIHZhciBwaG90b0lkID0gX3JlZjMucGhvdG9JZDtcbiAgICByZXR1cm4gUEhPVE9TX1BBVEhfUFJFRklYICsgXCIvXCIgKyBwaG90b0lkICsgXCIvc3RhdGlzdGljc1wiO1xuICB9O1xuXG4gIHJldHVybiBtYWtlRW5kcG9pbnQoe1xuICAgIGdldFBhdGhuYW1lOiBnZXRQYXRobmFtZSxcbiAgICBoYW5kbGVSZXF1ZXN0OiBjcmVhdGVSZXF1ZXN0SGFuZGxlcihmdW5jdGlvbiAoX3JlZjQpIHtcbiAgICAgIHZhciBwaG90b0lkID0gX3JlZjQucGhvdG9JZDtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHBhdGhuYW1lOiBnZXRQYXRobmFtZSh7XG4gICAgICAgICAgcGhvdG9JZDogcGhvdG9JZFxuICAgICAgICB9KSxcbiAgICAgICAgcXVlcnk6IHt9XG4gICAgICB9O1xuICAgIH0pLFxuICAgIGhhbmRsZVJlc3BvbnNlOiBjYXN0UmVzcG9uc2UoKVxuICB9KTtcbn0oKTtcbnZhciBnZXRSYW5kb20gPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICB2YXIgZ2V0UGF0aG5hbWUgPSBmdW5jdGlvbiBnZXRQYXRobmFtZSgpIHtcbiAgICByZXR1cm4gUEhPVE9TX1BBVEhfUFJFRklYICsgXCIvcmFuZG9tXCI7XG4gIH07XG5cbiAgcmV0dXJuIG1ha2VFbmRwb2ludCh7XG4gICAgZ2V0UGF0aG5hbWU6IGdldFBhdGhuYW1lLFxuICAgIGhhbmRsZVJlcXVlc3Q6IGNyZWF0ZVJlcXVlc3RIYW5kbGVyKGZ1bmN0aW9uIChfdGVtcCkge1xuICAgICAgdmFyIF9yZWY1ID0gX3RlbXAgPT09IHZvaWQgMCA/IHt9IDogX3RlbXAsXG4gICAgICAgICAgY29sbGVjdGlvbklkcyA9IF9yZWY1LmNvbGxlY3Rpb25JZHMsXG4gICAgICAgICAgY29udGVudEZpbHRlciA9IF9yZWY1LmNvbnRlbnRGaWx0ZXIsXG4gICAgICAgICAgdG9waWNJZHMgPSBfcmVmNS50b3BpY0lkcyxcbiAgICAgICAgICBxdWVyeVBhcmFtcyA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlKF9yZWY1LCBbXCJjb2xsZWN0aW9uSWRzXCIsIFwiY29udGVudEZpbHRlclwiLCBcInRvcGljSWRzXCJdKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcGF0aG5hbWU6IGdldFBhdGhuYW1lKCksXG4gICAgICAgIHF1ZXJ5OiBjb21wYWN0RGVmaW5lZChfZXh0ZW5kcyh7fSwgcXVlcnlQYXJhbXMsIHtcbiAgICAgICAgICBjb250ZW50X2ZpbHRlcjogY29udGVudEZpbHRlclxuICAgICAgICB9LCBnZXRDb2xsZWN0aW9ucyhjb2xsZWN0aW9uSWRzKSwgZ2V0VG9waWNzKHRvcGljSWRzKSkpLFxuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgKiBBdm9pZCByZXNwb25zZSBjYWNoaW5nXHJcbiAgICAgICAgICAgKi9cbiAgICAgICAgICAnY2FjaGUtY29udHJvbCc6ICduby1jYWNoZSdcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KSxcbiAgICBoYW5kbGVSZXNwb25zZTogY2FzdFJlc3BvbnNlKClcbiAgfSk7XG59KCk7XG52YXIgdHJhY2tEb3dubG9hZCA9IHtcbiAgaGFuZGxlUmVxdWVzdDogLyojX19QVVJFX18qL2NyZWF0ZVJlcXVlc3RIYW5kbGVyKGZ1bmN0aW9uIChfcmVmNikge1xuICAgIHZhciBkb3dubG9hZExvY2F0aW9uID0gX3JlZjYuZG93bmxvYWRMb2NhdGlvbjtcblxuICAgIHZhciBfcGFyc2VRdWVyeUFuZFBhdGhuYW0gPSBwYXJzZVF1ZXJ5QW5kUGF0aG5hbWUoZG93bmxvYWRMb2NhdGlvbiksXG4gICAgICAgIHBhdGhuYW1lID0gX3BhcnNlUXVlcnlBbmRQYXRobmFtLnBhdGhuYW1lLFxuICAgICAgICBxdWVyeSA9IF9wYXJzZVF1ZXJ5QW5kUGF0aG5hbS5xdWVyeTtcblxuICAgIGlmICghaXNEZWZpbmVkKHBhdGhuYW1lKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb3VsZCBub3QgcGFyc2UgcGF0aG5hbWUgZnJvbSB1cmwuJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHBhdGhuYW1lOiBwYXRobmFtZSxcbiAgICAgIHF1ZXJ5OiBjb21wYWN0RGVmaW5lZChxdWVyeSlcbiAgICB9O1xuICB9KSxcbiAgaGFuZGxlUmVzcG9uc2U6IC8qI19fUFVSRV9fKi9jYXN0UmVzcG9uc2UoKVxufTtcblxudmFyIGluZGV4JDEgPSB7XG4gIF9fcHJvdG9fXzogbnVsbCxcbiAgbGlzdDogbGlzdCQxLFxuICBnZXQ6IGdldCQxLFxuICBnZXRTdGF0czogZ2V0U3RhdHMsXG4gIGdldFJhbmRvbTogZ2V0UmFuZG9tLFxuICB0cmFja0Rvd25sb2FkOiB0cmFja0Rvd25sb2FkXG59O1xuXG52YXIgU0VBUkNIX1BBVEhfUFJFRklYID0gXCIvc2VhcmNoXCI7XG52YXIgZ2V0UGhvdG9zJDEgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICB2YXIgX2dldFBhdGhuYW1lID0gZnVuY3Rpb24gZ2V0UGF0aG5hbWUoKSB7XG4gICAgcmV0dXJuIFNFQVJDSF9QQVRIX1BSRUZJWCArIFwiL3Bob3Rvc1wiO1xuICB9O1xuXG4gIHJldHVybiBtYWtlRW5kcG9pbnQoe1xuICAgIC8vIFdyYXBwZXIgdXNlcyB0eXBlIHRyaWNrIHRvIGFsbG93IDAgYXJnc1xuICAgIGdldFBhdGhuYW1lOiBmdW5jdGlvbiBnZXRQYXRobmFtZShfcGFyYW1zKSB7XG4gICAgICByZXR1cm4gX2dldFBhdGhuYW1lKCk7XG4gICAgfSxcbiAgICBoYW5kbGVSZXF1ZXN0OiBjcmVhdGVSZXF1ZXN0SGFuZGxlcihmdW5jdGlvbiAoX3JlZikge1xuICAgICAgdmFyIHF1ZXJ5ID0gX3JlZi5xdWVyeSxcbiAgICAgICAgICBwYWdlID0gX3JlZi5wYWdlLFxuICAgICAgICAgIHBlclBhZ2UgPSBfcmVmLnBlclBhZ2UsXG4gICAgICAgICAgb3JkZXJCeSA9IF9yZWYub3JkZXJCeSxcbiAgICAgICAgICBjb2xsZWN0aW9uSWRzID0gX3JlZi5jb2xsZWN0aW9uSWRzLFxuICAgICAgICAgIGxhbmcgPSBfcmVmLmxhbmcsXG4gICAgICAgICAgY29udGVudEZpbHRlciA9IF9yZWYuY29udGVudEZpbHRlcixcbiAgICAgICAgICBmaWx0ZXJzID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UoX3JlZiwgW1wicXVlcnlcIiwgXCJwYWdlXCIsIFwicGVyUGFnZVwiLCBcIm9yZGVyQnlcIiwgXCJjb2xsZWN0aW9uSWRzXCIsIFwibGFuZ1wiLCBcImNvbnRlbnRGaWx0ZXJcIl0pO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBwYXRobmFtZTogX2dldFBhdGhuYW1lKCksXG4gICAgICAgIHF1ZXJ5OiBjb21wYWN0RGVmaW5lZChfZXh0ZW5kcyh7XG4gICAgICAgICAgcXVlcnk6IHF1ZXJ5LFxuICAgICAgICAgIGNvbnRlbnRfZmlsdGVyOiBjb250ZW50RmlsdGVyLFxuICAgICAgICAgIGxhbmc6IGxhbmcsXG4gICAgICAgICAgb3JkZXJfYnk6IG9yZGVyQnlcbiAgICAgICAgfSwgZ2V0RmVlZFBhcmFtcyh7XG4gICAgICAgICAgcGFnZTogcGFnZSxcbiAgICAgICAgICBwZXJQYWdlOiBwZXJQYWdlXG4gICAgICAgIH0pLCBnZXRDb2xsZWN0aW9ucyhjb2xsZWN0aW9uSWRzKSwgZmlsdGVycykpXG4gICAgICB9O1xuICAgIH0pLFxuICAgIGhhbmRsZVJlc3BvbnNlOiBjYXN0UmVzcG9uc2UoKVxuICB9KTtcbn0oKTtcbnZhciBnZXRDb2xsZWN0aW9ucyQxID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgdmFyIF9nZXRQYXRobmFtZTIgPSBmdW5jdGlvbiBnZXRQYXRobmFtZSgpIHtcbiAgICByZXR1cm4gU0VBUkNIX1BBVEhfUFJFRklYICsgXCIvY29sbGVjdGlvbnNcIjtcbiAgfTtcblxuICByZXR1cm4gbWFrZUVuZHBvaW50KHtcbiAgICAvLyBXcmFwcGVyIHVzZXMgdHlwZSB0cmljayB0byBhbGxvdyAwIGFyZ3NcbiAgICBnZXRQYXRobmFtZTogZnVuY3Rpb24gZ2V0UGF0aG5hbWUoX3BhcmFtcykge1xuICAgICAgcmV0dXJuIF9nZXRQYXRobmFtZTIoKTtcbiAgICB9LFxuICAgIGhhbmRsZVJlcXVlc3Q6IGNyZWF0ZVJlcXVlc3RIYW5kbGVyKGZ1bmN0aW9uIChfcmVmMikge1xuICAgICAgdmFyIHF1ZXJ5ID0gX3JlZjIucXVlcnksXG4gICAgICAgICAgcGFnaW5hdGlvblBhcmFtcyA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlKF9yZWYyLCBbXCJxdWVyeVwiXSk7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHBhdGhuYW1lOiBfZ2V0UGF0aG5hbWUyKCksXG4gICAgICAgIHF1ZXJ5OiBfZXh0ZW5kcyh7XG4gICAgICAgICAgcXVlcnk6IHF1ZXJ5XG4gICAgICAgIH0sIGdldEZlZWRQYXJhbXMocGFnaW5hdGlvblBhcmFtcykpXG4gICAgICB9O1xuICAgIH0pLFxuICAgIGhhbmRsZVJlc3BvbnNlOiBjYXN0UmVzcG9uc2UoKVxuICB9KTtcbn0oKTtcbnZhciBnZXRVc2VycyA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIHZhciBfZ2V0UGF0aG5hbWUzID0gZnVuY3Rpb24gZ2V0UGF0aG5hbWUoKSB7XG4gICAgcmV0dXJuIFNFQVJDSF9QQVRIX1BSRUZJWCArIFwiL3VzZXJzXCI7XG4gIH07XG5cbiAgcmV0dXJuIG1ha2VFbmRwb2ludCh7XG4gICAgLy8gV3JhcHBlciB1c2VzIHR5cGUgdHJpY2sgdG8gYWxsb3cgMCBhcmdzXG4gICAgZ2V0UGF0aG5hbWU6IGZ1bmN0aW9uIGdldFBhdGhuYW1lKF9wYXJhbXMpIHtcbiAgICAgIHJldHVybiBfZ2V0UGF0aG5hbWUzKCk7XG4gICAgfSxcbiAgICBoYW5kbGVSZXF1ZXN0OiBjcmVhdGVSZXF1ZXN0SGFuZGxlcihmdW5jdGlvbiAoX3JlZjMpIHtcbiAgICAgIHZhciBxdWVyeSA9IF9yZWYzLnF1ZXJ5LFxuICAgICAgICAgIHBhZ2luYXRpb25QYXJhbXMgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShfcmVmMywgW1wicXVlcnlcIl0pO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBwYXRobmFtZTogX2dldFBhdGhuYW1lMygpLFxuICAgICAgICBxdWVyeTogX2V4dGVuZHMoe1xuICAgICAgICAgIHF1ZXJ5OiBxdWVyeVxuICAgICAgICB9LCBnZXRGZWVkUGFyYW1zKHBhZ2luYXRpb25QYXJhbXMpKVxuICAgICAgfTtcbiAgICB9KSxcbiAgICBoYW5kbGVSZXNwb25zZTogY2FzdFJlc3BvbnNlKClcbiAgfSk7XG59KCk7XG5cbnZhciBpbmRleCQyID0ge1xuICBfX3Byb3RvX186IG51bGwsXG4gIGdldFBob3RvczogZ2V0UGhvdG9zJDEsXG4gIGdldENvbGxlY3Rpb25zOiBnZXRDb2xsZWN0aW9ucyQxLFxuICBnZXRVc2VyczogZ2V0VXNlcnNcbn07XG5cbnZhciBVU0VSU19QQVRIX1BSRUZJWCA9ICcvdXNlcnMnO1xudmFyIGdldCQyID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgdmFyIGdldFBhdGhuYW1lID0gZnVuY3Rpb24gZ2V0UGF0aG5hbWUoX3JlZikge1xuICAgIHZhciB1c2VybmFtZSA9IF9yZWYudXNlcm5hbWU7XG4gICAgcmV0dXJuIFVTRVJTX1BBVEhfUFJFRklYICsgXCIvXCIgKyB1c2VybmFtZTtcbiAgfTtcblxuICByZXR1cm4gbWFrZUVuZHBvaW50KHtcbiAgICBnZXRQYXRobmFtZTogZ2V0UGF0aG5hbWUsXG4gICAgaGFuZGxlUmVxdWVzdDogY3JlYXRlUmVxdWVzdEhhbmRsZXIoZnVuY3Rpb24gKF9yZWYyKSB7XG4gICAgICB2YXIgdXNlcm5hbWUgPSBfcmVmMi51c2VybmFtZTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHBhdGhuYW1lOiBnZXRQYXRobmFtZSh7XG4gICAgICAgICAgdXNlcm5hbWU6IHVzZXJuYW1lXG4gICAgICAgIH0pLFxuICAgICAgICBxdWVyeToge31cbiAgICAgIH07XG4gICAgfSksXG4gICAgaGFuZGxlUmVzcG9uc2U6IGNhc3RSZXNwb25zZSgpXG4gIH0pO1xufSgpO1xudmFyIGdldFBob3RvcyQyID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgdmFyIGdldFBhdGhuYW1lID0gZnVuY3Rpb24gZ2V0UGF0aG5hbWUoX3JlZjMpIHtcbiAgICB2YXIgdXNlcm5hbWUgPSBfcmVmMy51c2VybmFtZTtcbiAgICByZXR1cm4gVVNFUlNfUEFUSF9QUkVGSVggKyBcIi9cIiArIHVzZXJuYW1lICsgXCIvcGhvdG9zXCI7XG4gIH07XG5cbiAgcmV0dXJuIG1ha2VFbmRwb2ludCh7XG4gICAgZ2V0UGF0aG5hbWU6IGdldFBhdGhuYW1lLFxuICAgIGhhbmRsZVJlcXVlc3Q6IGNyZWF0ZVJlcXVlc3RIYW5kbGVyKGZ1bmN0aW9uIChfcmVmNCkge1xuICAgICAgdmFyIHVzZXJuYW1lID0gX3JlZjQudXNlcm5hbWUsXG4gICAgICAgICAgc3RhdHMgPSBfcmVmNC5zdGF0cyxcbiAgICAgICAgICBvcmllbnRhdGlvbiA9IF9yZWY0Lm9yaWVudGF0aW9uLFxuICAgICAgICAgIHBhZ2luYXRpb25QYXJhbXMgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShfcmVmNCwgW1widXNlcm5hbWVcIiwgXCJzdGF0c1wiLCBcIm9yaWVudGF0aW9uXCJdKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcGF0aG5hbWU6IGdldFBhdGhuYW1lKHtcbiAgICAgICAgICB1c2VybmFtZTogdXNlcm5hbWVcbiAgICAgICAgfSksXG4gICAgICAgIHF1ZXJ5OiBjb21wYWN0RGVmaW5lZChfZXh0ZW5kcyh7fSwgZ2V0RmVlZFBhcmFtcyhwYWdpbmF0aW9uUGFyYW1zKSwge1xuICAgICAgICAgIG9yaWVudGF0aW9uOiBvcmllbnRhdGlvbixcbiAgICAgICAgICBzdGF0czogc3RhdHNcbiAgICAgICAgfSkpXG4gICAgICB9O1xuICAgIH0pLFxuICAgIGhhbmRsZVJlc3BvbnNlOiBoYW5kbGVGZWVkUmVzcG9uc2UoKVxuICB9KTtcbn0oKTtcbnZhciBnZXRMaWtlcyA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIHZhciBnZXRQYXRobmFtZSA9IGZ1bmN0aW9uIGdldFBhdGhuYW1lKF9yZWY1KSB7XG4gICAgdmFyIHVzZXJuYW1lID0gX3JlZjUudXNlcm5hbWU7XG4gICAgcmV0dXJuIFVTRVJTX1BBVEhfUFJFRklYICsgXCIvXCIgKyB1c2VybmFtZSArIFwiL2xpa2VzXCI7XG4gIH07XG5cbiAgcmV0dXJuIG1ha2VFbmRwb2ludCh7XG4gICAgZ2V0UGF0aG5hbWU6IGdldFBhdGhuYW1lLFxuICAgIGhhbmRsZVJlcXVlc3Q6IGNyZWF0ZVJlcXVlc3RIYW5kbGVyKGZ1bmN0aW9uIChfcmVmNikge1xuICAgICAgdmFyIHVzZXJuYW1lID0gX3JlZjYudXNlcm5hbWUsXG4gICAgICAgICAgb3JpZW50YXRpb24gPSBfcmVmNi5vcmllbnRhdGlvbixcbiAgICAgICAgICBwYWdpbmF0aW9uUGFyYW1zID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UoX3JlZjYsIFtcInVzZXJuYW1lXCIsIFwib3JpZW50YXRpb25cIl0pO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBwYXRobmFtZTogZ2V0UGF0aG5hbWUoe1xuICAgICAgICAgIHVzZXJuYW1lOiB1c2VybmFtZVxuICAgICAgICB9KSxcbiAgICAgICAgcXVlcnk6IGNvbXBhY3REZWZpbmVkKF9leHRlbmRzKHt9LCBnZXRGZWVkUGFyYW1zKHBhZ2luYXRpb25QYXJhbXMpLCB7XG4gICAgICAgICAgb3JpZW50YXRpb246IG9yaWVudGF0aW9uXG4gICAgICAgIH0pKVxuICAgICAgfTtcbiAgICB9KSxcbiAgICBoYW5kbGVSZXNwb25zZTogaGFuZGxlRmVlZFJlc3BvbnNlKClcbiAgfSk7XG59KCk7XG52YXIgZ2V0Q29sbGVjdGlvbnMkMiA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIHZhciBnZXRQYXRobmFtZSA9IGZ1bmN0aW9uIGdldFBhdGhuYW1lKF9yZWY3KSB7XG4gICAgdmFyIHVzZXJuYW1lID0gX3JlZjcudXNlcm5hbWU7XG4gICAgcmV0dXJuIFVTRVJTX1BBVEhfUFJFRklYICsgXCIvXCIgKyB1c2VybmFtZSArIFwiL2NvbGxlY3Rpb25zXCI7XG4gIH07XG5cbiAgcmV0dXJuIG1ha2VFbmRwb2ludCh7XG4gICAgZ2V0UGF0aG5hbWU6IGdldFBhdGhuYW1lLFxuICAgIGhhbmRsZVJlcXVlc3Q6IGNyZWF0ZVJlcXVlc3RIYW5kbGVyKGZ1bmN0aW9uIChfcmVmOCkge1xuICAgICAgdmFyIHVzZXJuYW1lID0gX3JlZjgudXNlcm5hbWUsXG4gICAgICAgICAgcGFnaW5hdGlvblBhcmFtcyA9IF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlKF9yZWY4LCBbXCJ1c2VybmFtZVwiXSk7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHBhdGhuYW1lOiBnZXRQYXRobmFtZSh7XG4gICAgICAgICAgdXNlcm5hbWU6IHVzZXJuYW1lXG4gICAgICAgIH0pLFxuICAgICAgICBxdWVyeTogZ2V0RmVlZFBhcmFtcyhwYWdpbmF0aW9uUGFyYW1zKVxuICAgICAgfTtcbiAgICB9KSxcbiAgICBoYW5kbGVSZXNwb25zZTogaGFuZGxlRmVlZFJlc3BvbnNlKClcbiAgfSk7XG59KCk7XG5cbnZhciBpbmRleCQzID0ge1xuICBfX3Byb3RvX186IG51bGwsXG4gIGdldDogZ2V0JDIsXG4gIGdldFBob3RvczogZ2V0UGhvdG9zJDIsXG4gIGdldExpa2VzOiBnZXRMaWtlcyxcbiAgZ2V0Q29sbGVjdGlvbnM6IGdldENvbGxlY3Rpb25zJDJcbn07XG5cbnZhciBCQVNFX1RPUElDX1BBVEggPSAnL3RvcGljcyc7XG5cbnZhciBnZXRUb3BpY1BhdGggPSBmdW5jdGlvbiBnZXRUb3BpY1BhdGgoX3JlZikge1xuICB2YXIgdG9waWNJZE9yU2x1ZyA9IF9yZWYudG9waWNJZE9yU2x1ZztcbiAgcmV0dXJuIEJBU0VfVE9QSUNfUEFUSCArIFwiL1wiICsgdG9waWNJZE9yU2x1Zztcbn07XG5cbnZhciBsaXN0JDIgPSAvKiNfX1BVUkVfXyovbWFrZUVuZHBvaW50KHtcbiAgZ2V0UGF0aG5hbWU6IGdldFRvcGljUGF0aCxcbiAgaGFuZGxlUmVxdWVzdDogZnVuY3Rpb24gaGFuZGxlUmVxdWVzdChfcmVmMikge1xuICAgIHZhciBwYWdlID0gX3JlZjIucGFnZSxcbiAgICAgICAgcGVyUGFnZSA9IF9yZWYyLnBlclBhZ2UsXG4gICAgICAgIG9yZGVyQnkgPSBfcmVmMi5vcmRlckJ5LFxuICAgICAgICB0b3BpY0lkc09yU2x1Z3MgPSBfcmVmMi50b3BpY0lkc09yU2x1Z3M7XG4gICAgcmV0dXJuIHtcbiAgICAgIHBhdGhuYW1lOiBCQVNFX1RPUElDX1BBVEgsXG4gICAgICBxdWVyeTogY29tcGFjdERlZmluZWQoX2V4dGVuZHMoe30sIGdldEZlZWRQYXJhbXMoe1xuICAgICAgICBwYWdlOiBwYWdlLFxuICAgICAgICBwZXJQYWdlOiBwZXJQYWdlXG4gICAgICB9KSwge1xuICAgICAgICBpZHM6IHRvcGljSWRzT3JTbHVncyA9PSBudWxsID8gdm9pZCAwIDogdG9waWNJZHNPclNsdWdzLmpvaW4oJywnKSxcbiAgICAgICAgb3JkZXJfYnk6IG9yZGVyQnlcbiAgICAgIH0pKVxuICAgIH07XG4gIH0sXG4gIGhhbmRsZVJlc3BvbnNlOiAvKiNfX1BVUkVfXyovaGFuZGxlRmVlZFJlc3BvbnNlKClcbn0pO1xudmFyIGdldCQzID0gLyojX19QVVJFX18qL21ha2VFbmRwb2ludCh7XG4gIGdldFBhdGhuYW1lOiBnZXRUb3BpY1BhdGgsXG4gIGhhbmRsZVJlcXVlc3Q6IGZ1bmN0aW9uIGhhbmRsZVJlcXVlc3QoX3JlZjMpIHtcbiAgICB2YXIgdG9waWNJZE9yU2x1ZyA9IF9yZWYzLnRvcGljSWRPclNsdWc7XG4gICAgcmV0dXJuIHtcbiAgICAgIHBhdGhuYW1lOiBnZXRUb3BpY1BhdGgoe1xuICAgICAgICB0b3BpY0lkT3JTbHVnOiB0b3BpY0lkT3JTbHVnXG4gICAgICB9KSxcbiAgICAgIHF1ZXJ5OiB7fVxuICAgIH07XG4gIH0sXG4gIGhhbmRsZVJlc3BvbnNlOiAvKiNfX1BVUkVfXyovY2FzdFJlc3BvbnNlKClcbn0pO1xudmFyIGdldFBob3RvcyQzID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgdmFyIGdldFBhdGhuYW1lID0gLyojX19QVVJFX18qL2Zsb3coZ2V0VG9waWNQYXRoLCBmdW5jdGlvbiAodG9waWNQYXRoKSB7XG4gICAgcmV0dXJuIHRvcGljUGF0aCArIFwiL3Bob3Rvc1wiO1xuICB9KTtcbiAgcmV0dXJuIG1ha2VFbmRwb2ludCh7XG4gICAgZ2V0UGF0aG5hbWU6IGdldFBhdGhuYW1lLFxuICAgIGhhbmRsZVJlcXVlc3Q6IGZ1bmN0aW9uIGhhbmRsZVJlcXVlc3QoX3JlZjQpIHtcbiAgICAgIHZhciB0b3BpY0lkT3JTbHVnID0gX3JlZjQudG9waWNJZE9yU2x1ZyxcbiAgICAgICAgICBvcmllbnRhdGlvbiA9IF9yZWY0Lm9yaWVudGF0aW9uLFxuICAgICAgICAgIGZlZWRQYXJhbXMgPSBfb2JqZWN0V2l0aG91dFByb3BlcnRpZXNMb29zZShfcmVmNCwgW1widG9waWNJZE9yU2x1Z1wiLCBcIm9yaWVudGF0aW9uXCJdKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcGF0aG5hbWU6IGdldFBhdGhuYW1lKHtcbiAgICAgICAgICB0b3BpY0lkT3JTbHVnOiB0b3BpY0lkT3JTbHVnXG4gICAgICAgIH0pLFxuICAgICAgICBxdWVyeTogY29tcGFjdERlZmluZWQoX2V4dGVuZHMoe30sIGdldEZlZWRQYXJhbXMoZmVlZFBhcmFtcyksIHtcbiAgICAgICAgICBvcmllbnRhdGlvbjogb3JpZW50YXRpb25cbiAgICAgICAgfSkpXG4gICAgICB9O1xuICAgIH0sXG4gICAgaGFuZGxlUmVzcG9uc2U6IGhhbmRsZUZlZWRSZXNwb25zZSgpXG4gIH0pO1xufSgpO1xuXG52YXIgaW5kZXgkNCA9IHtcbiAgX19wcm90b19fOiBudWxsLFxuICBsaXN0OiBsaXN0JDIsXG4gIGdldDogZ2V0JDMsXG4gIGdldFBob3RvczogZ2V0UGhvdG9zJDNcbn07XG5cbnZhciB0cmFja05vbkhvdExpbmtlZFBob3RvVmlldyA9IGZ1bmN0aW9uIHRyYWNrTm9uSG90TGlua2VkUGhvdG9WaWV3KF9yZWYpIHtcbiAgdmFyIGFwcElkID0gX3JlZi5hcHBJZDtcbiAgcmV0dXJuIGZ1bmN0aW9uIChfcmVmMikge1xuICAgIHZhciBwaG90b0lkID0gX3JlZjIucGhvdG9JZDtcbiAgICB2YXIgaWRzID0gIUFycmF5LmlzQXJyYXkocGhvdG9JZCkgPyBbcGhvdG9JZF0gOiBwaG90b0lkO1xuXG4gICAgaWYgKGlkcy5sZW5ndGggPiAyMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgY2Fubm90IHRyYWNrIG1vcmUgdGhhbiAyMCBwaG90b3MgYXQgb25jZS4gUGxlYXNlIHRyeSBhZ2FpbiB3aXRoIGZld2VyIHBob3Rvcy4nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmV0Y2goXCJ2aWV3cy51bnNwbGFzaC5jb20vdj9waG90b19pZD1cIiArIGlkcy5qb2luKCkgKyBcIiZhcHBfaWQ9XCIgKyBhcHBJZCk7XG4gIH07XG59O1xuXG5cblxudmFyIGludGVybmFscyA9IHtcbiAgX19wcm90b19fOiBudWxsLFxuICBjb2xsZWN0aW9uczogaW5kZXgsXG4gIHBob3RvczogaW5kZXgkMSxcbiAgc2VhcmNoOiBpbmRleCQyLFxuICB1c2VyczogaW5kZXgkMyxcbiAgdG9waWNzOiBpbmRleCQ0LFxuICB0cmFja05vbkhvdExpbmtlZFBob3RvVmlldzogdHJhY2tOb25Ib3RMaW5rZWRQaG90b1ZpZXdcbn07XG5cbnZhciBMYW5ndWFnZTtcblxuKGZ1bmN0aW9uIChMYW5ndWFnZSkge1xuICBMYW5ndWFnZVtcIkFmcmlrYWFuc1wiXSA9IFwiYWZcIjtcbiAgTGFuZ3VhZ2VbXCJBbWhhcmljXCJdID0gXCJhbVwiO1xuICBMYW5ndWFnZVtcIkFyYWJpY1wiXSA9IFwiYXJcIjtcbiAgTGFuZ3VhZ2VbXCJBemVyYmFpamFuaVwiXSA9IFwiYXpcIjtcbiAgTGFuZ3VhZ2VbXCJCZWxhcnVzaWFuXCJdID0gXCJiZVwiO1xuICBMYW5ndWFnZVtcIkJ1bGdhcmlhblwiXSA9IFwiYmdcIjtcbiAgTGFuZ3VhZ2VbXCJCZW5nYWxpXCJdID0gXCJiblwiO1xuICBMYW5ndWFnZVtcIkJvc25pYW5cIl0gPSBcImJzXCI7XG4gIExhbmd1YWdlW1wiQ2F0YWxhblwiXSA9IFwiY2FcIjtcbiAgTGFuZ3VhZ2VbXCJDZWJ1YW5vXCJdID0gXCJjZWJcIjtcbiAgTGFuZ3VhZ2VbXCJDb3JzaWNhblwiXSA9IFwiY29cIjtcbiAgTGFuZ3VhZ2VbXCJDemVjaFwiXSA9IFwiY3NcIjtcbiAgTGFuZ3VhZ2VbXCJXZWxzaFwiXSA9IFwiY3lcIjtcbiAgTGFuZ3VhZ2VbXCJEYW5pc2hcIl0gPSBcImRhXCI7XG4gIExhbmd1YWdlW1wiR2VybWFuXCJdID0gXCJkZVwiO1xuICBMYW5ndWFnZVtcIkdyZWVrXCJdID0gXCJlbFwiO1xuICBMYW5ndWFnZVtcIkVuZ2xpc2hcIl0gPSBcImVuXCI7XG4gIExhbmd1YWdlW1wiRXNwZXJhbnRvXCJdID0gXCJlb1wiO1xuICBMYW5ndWFnZVtcIlNwYW5pc2hcIl0gPSBcImVzXCI7XG4gIExhbmd1YWdlW1wiRXN0b25pYW5cIl0gPSBcImV0XCI7XG4gIExhbmd1YWdlW1wiQmFzcXVlXCJdID0gXCJldVwiO1xuICBMYW5ndWFnZVtcIlBlcnNpYW5cIl0gPSBcImZhXCI7XG4gIExhbmd1YWdlW1wiRmlubmlzaFwiXSA9IFwiZmlcIjtcbiAgTGFuZ3VhZ2VbXCJGcmVuY2hcIl0gPSBcImZyXCI7XG4gIExhbmd1YWdlW1wiRnJpc2lhblwiXSA9IFwiZnlcIjtcbiAgTGFuZ3VhZ2VbXCJJcmlzaFwiXSA9IFwiZ2FcIjtcbiAgTGFuZ3VhZ2VbXCJTY290c0dhZWxpY1wiXSA9IFwiZ2RcIjtcbiAgTGFuZ3VhZ2VbXCJHYWxpY2lhblwiXSA9IFwiZ2xcIjtcbiAgTGFuZ3VhZ2VbXCJHdWphcmF0aVwiXSA9IFwiZ3VcIjtcbiAgTGFuZ3VhZ2VbXCJIYXVzYVwiXSA9IFwiaGFcIjtcbiAgTGFuZ3VhZ2VbXCJIYXdhaWlhblwiXSA9IFwiaGF3XCI7XG4gIExhbmd1YWdlW1wiSGluZGlcIl0gPSBcImhpXCI7XG4gIExhbmd1YWdlW1wiSG1vbmdcIl0gPSBcImhtblwiO1xuICBMYW5ndWFnZVtcIkNyb2F0aWFuXCJdID0gXCJoclwiO1xuICBMYW5ndWFnZVtcIkhhaXRpYW5DcmVvbGVcIl0gPSBcImh0XCI7XG4gIExhbmd1YWdlW1wiSHVuZ2FyaWFuXCJdID0gXCJodVwiO1xuICBMYW5ndWFnZVtcIkFybWVuaWFuXCJdID0gXCJoeVwiO1xuICBMYW5ndWFnZVtcIkluZG9uZXNpYW5cIl0gPSBcImlkXCI7XG4gIExhbmd1YWdlW1wiSWdib1wiXSA9IFwiaWdcIjtcbiAgTGFuZ3VhZ2VbXCJJY2VsYW5kaWNcIl0gPSBcImlzXCI7XG4gIExhbmd1YWdlW1wiSXRhbGlhblwiXSA9IFwiaXRcIjtcbiAgTGFuZ3VhZ2VbXCJIZWJyZXdcIl0gPSBcIml3XCI7XG4gIExhbmd1YWdlW1wiSmFwYW5lc2VcIl0gPSBcImphXCI7XG4gIExhbmd1YWdlW1wiSmF2YW5lc2VcIl0gPSBcImp3XCI7XG4gIExhbmd1YWdlW1wiR2VvcmdpYW5cIl0gPSBcImthXCI7XG4gIExhbmd1YWdlW1wiS2F6YWtoXCJdID0gXCJra1wiO1xuICBMYW5ndWFnZVtcIktobWVyXCJdID0gXCJrbVwiO1xuICBMYW5ndWFnZVtcIkthbm5hZGFcIl0gPSBcImtuXCI7XG4gIExhbmd1YWdlW1wiS29yZWFuXCJdID0gXCJrb1wiO1xuICBMYW5ndWFnZVtcIkt1cmRpc2hcIl0gPSBcImt1XCI7XG4gIExhbmd1YWdlW1wiS3lyZ3l6XCJdID0gXCJreVwiO1xuICBMYW5ndWFnZVtcIkxhdGluXCJdID0gXCJsYVwiO1xuICBMYW5ndWFnZVtcIkx1eGVtYm91cmdpc2hcIl0gPSBcImxiXCI7XG4gIExhbmd1YWdlW1wiTGFvXCJdID0gXCJsb1wiO1xuICBMYW5ndWFnZVtcIkxpdGh1YW5pYW5cIl0gPSBcImx0XCI7XG4gIExhbmd1YWdlW1wiTGF0dmlhblwiXSA9IFwibHZcIjtcbiAgTGFuZ3VhZ2VbXCJNYWxhZ2FzeVwiXSA9IFwibWdcIjtcbiAgTGFuZ3VhZ2VbXCJNYW9yaVwiXSA9IFwibWlcIjtcbiAgTGFuZ3VhZ2VbXCJNYWNlZG9uaWFuXCJdID0gXCJta1wiO1xuICBMYW5ndWFnZVtcIk1hbGF5YWxhbVwiXSA9IFwibWxcIjtcbiAgTGFuZ3VhZ2VbXCJNb25nb2xpYW5cIl0gPSBcIm1uXCI7XG4gIExhbmd1YWdlW1wiTWFyYXRoaVwiXSA9IFwibXJcIjtcbiAgTGFuZ3VhZ2VbXCJNYWxheVwiXSA9IFwibXNcIjtcbiAgTGFuZ3VhZ2VbXCJNYWx0ZXNlXCJdID0gXCJtdFwiO1xuICBMYW5ndWFnZVtcIk15YW5tYXJcIl0gPSBcIm15XCI7XG4gIExhbmd1YWdlW1wiTmVwYWxpXCJdID0gXCJuZVwiO1xuICBMYW5ndWFnZVtcIkR1dGNoXCJdID0gXCJubFwiO1xuICBMYW5ndWFnZVtcIk5vcndlZ2lhblwiXSA9IFwibm9cIjtcbiAgTGFuZ3VhZ2VbXCJOeWFuamFcIl0gPSBcIm55XCI7XG4gIExhbmd1YWdlW1wiT3JpeWFcIl0gPSBcIm9yXCI7XG4gIExhbmd1YWdlW1wiUHVuamFiaVwiXSA9IFwicGFcIjtcbiAgTGFuZ3VhZ2VbXCJQb2xpc2hcIl0gPSBcInBsXCI7XG4gIExhbmd1YWdlW1wiUGFzaHRvXCJdID0gXCJwc1wiO1xuICBMYW5ndWFnZVtcIlBvcnR1Z3Vlc2VcIl0gPSBcInB0XCI7XG4gIExhbmd1YWdlW1wiUm9tYW5pYW5cIl0gPSBcInJvXCI7XG4gIExhbmd1YWdlW1wiUnVzc2lhblwiXSA9IFwicnVcIjtcbiAgTGFuZ3VhZ2VbXCJLaW55YXJ3YW5kYVwiXSA9IFwicndcIjtcbiAgTGFuZ3VhZ2VbXCJTaW5kaGlcIl0gPSBcInNkXCI7XG4gIExhbmd1YWdlW1wiU2luaGFsYVwiXSA9IFwic2lcIjtcbiAgTGFuZ3VhZ2VbXCJTbG92YWtcIl0gPSBcInNrXCI7XG4gIExhbmd1YWdlW1wiU2xvdmVuaWFuXCJdID0gXCJzbFwiO1xuICBMYW5ndWFnZVtcIlNhbW9hblwiXSA9IFwic21cIjtcbiAgTGFuZ3VhZ2VbXCJTaG9uYVwiXSA9IFwic25cIjtcbiAgTGFuZ3VhZ2VbXCJTb21hbGlcIl0gPSBcInNvXCI7XG4gIExhbmd1YWdlW1wiQWxiYW5pYW5cIl0gPSBcInNxXCI7XG4gIExhbmd1YWdlW1wiU2VyYmlhblwiXSA9IFwic3JcIjtcbiAgTGFuZ3VhZ2VbXCJTZXNvdGhvXCJdID0gXCJzdFwiO1xuICBMYW5ndWFnZVtcIlN1bmRhbmVzZVwiXSA9IFwic3VcIjtcbiAgTGFuZ3VhZ2VbXCJTd2VkaXNoXCJdID0gXCJzdlwiO1xuICBMYW5ndWFnZVtcIlN3YWhpbGlcIl0gPSBcInN3XCI7XG4gIExhbmd1YWdlW1wiVGFtaWxcIl0gPSBcInRhXCI7XG4gIExhbmd1YWdlW1wiVGVsdWd1XCJdID0gXCJ0ZVwiO1xuICBMYW5ndWFnZVtcIlRhamlrXCJdID0gXCJ0Z1wiO1xuICBMYW5ndWFnZVtcIlRoYWlcIl0gPSBcInRoXCI7XG4gIExhbmd1YWdlW1wiVHVya21lblwiXSA9IFwidGtcIjtcbiAgTGFuZ3VhZ2VbXCJGaWxpcGlub1wiXSA9IFwidGxcIjtcbiAgTGFuZ3VhZ2VbXCJUdXJraXNoXCJdID0gXCJ0clwiO1xuICBMYW5ndWFnZVtcIlRhdGFyXCJdID0gXCJ0dFwiO1xuICBMYW5ndWFnZVtcIlVpZ2h1clwiXSA9IFwidWdcIjtcbiAgTGFuZ3VhZ2VbXCJVa3JhaW5pYW5cIl0gPSBcInVrXCI7XG4gIExhbmd1YWdlW1wiVXJkdVwiXSA9IFwidXJcIjtcbiAgTGFuZ3VhZ2VbXCJVemJla1wiXSA9IFwidXpcIjtcbiAgTGFuZ3VhZ2VbXCJWaWV0bmFtZXNlXCJdID0gXCJ2aVwiO1xuICBMYW5ndWFnZVtcIlhob3NhXCJdID0gXCJ4aFwiO1xuICBMYW5ndWFnZVtcIllpZGRpc2hcIl0gPSBcInlpXCI7XG4gIExhbmd1YWdlW1wiWW9ydWJhXCJdID0gXCJ5b1wiO1xuICBMYW5ndWFnZVtcIkNoaW5lc2VTaW1wbGlmaWVkXCJdID0gXCJ6aFwiO1xuICBMYW5ndWFnZVtcIkNoaW5lc2VUcmFkaXRpb25hbFwiXSA9IFwiemgtVFdcIjtcbiAgTGFuZ3VhZ2VbXCJadWx1XCJdID0gXCJ6dVwiO1xufSkoTGFuZ3VhZ2UgfHwgKExhbmd1YWdlID0ge30pKTtcblxudmFyIE9yZGVyQnk7XG5cbihmdW5jdGlvbiAoT3JkZXJCeSkge1xuICBPcmRlckJ5W1wiTEFURVNUXCJdID0gXCJsYXRlc3RcIjtcbiAgT3JkZXJCeVtcIlBPUFVMQVJcIl0gPSBcInBvcHVsYXJcIjtcbiAgT3JkZXJCeVtcIlZJRVdTXCJdID0gXCJ2aWV3c1wiO1xuICBPcmRlckJ5W1wiRE9XTkxPQURTXCJdID0gXCJkb3dubG9hZHNcIjtcbiAgT3JkZXJCeVtcIk9MREVTVFwiXSA9IFwib2xkZXN0XCI7XG59KShPcmRlckJ5IHx8IChPcmRlckJ5ID0ge30pKTtcblxudmFyIGNyZWF0ZUFwaSA9IC8qI19fUFVSRV9fKi9mbG93KGluaXRNYWtlUmVxdWVzdCwgZnVuY3Rpb24gKG1ha2VSZXF1ZXN0KSB7XG4gIHJldHVybiB7XG4gICAgcGhvdG9zOiB7XG4gICAgICBnZXQ6IG1ha2VSZXF1ZXN0KGdldCQxKSxcbiAgICAgIGxpc3Q6IG1ha2VSZXF1ZXN0KGxpc3QkMSksXG4gICAgICBnZXRTdGF0czogbWFrZVJlcXVlc3QoZ2V0U3RhdHMpLFxuICAgICAgZ2V0UmFuZG9tOiBtYWtlUmVxdWVzdChnZXRSYW5kb20pLFxuICAgICAgdHJhY2tEb3dubG9hZDogbWFrZVJlcXVlc3QodHJhY2tEb3dubG9hZClcbiAgICB9LFxuICAgIHVzZXJzOiB7XG4gICAgICBnZXRQaG90b3M6IG1ha2VSZXF1ZXN0KGdldFBob3RvcyQyKSxcbiAgICAgIGdldENvbGxlY3Rpb25zOiBtYWtlUmVxdWVzdChnZXRDb2xsZWN0aW9ucyQyKSxcbiAgICAgIGdldExpa2VzOiBtYWtlUmVxdWVzdChnZXRMaWtlcyksXG4gICAgICBnZXQ6IG1ha2VSZXF1ZXN0KGdldCQyKVxuICAgIH0sXG4gICAgc2VhcmNoOiB7XG4gICAgICBnZXRDb2xsZWN0aW9uczogbWFrZVJlcXVlc3QoZ2V0Q29sbGVjdGlvbnMkMSksXG4gICAgICBnZXRQaG90b3M6IG1ha2VSZXF1ZXN0KGdldFBob3RvcyQxKSxcbiAgICAgIGdldFVzZXJzOiBtYWtlUmVxdWVzdChnZXRVc2VycylcbiAgICB9LFxuICAgIGNvbGxlY3Rpb25zOiB7XG4gICAgICBnZXRQaG90b3M6IG1ha2VSZXF1ZXN0KGdldFBob3RvcyksXG4gICAgICBnZXQ6IG1ha2VSZXF1ZXN0KGdldCksXG4gICAgICBsaXN0OiBtYWtlUmVxdWVzdChsaXN0KSxcbiAgICAgIGdldFJlbGF0ZWQ6IG1ha2VSZXF1ZXN0KGdldFJlbGF0ZWQpXG4gICAgfSxcbiAgICB0b3BpY3M6IHtcbiAgICAgIGxpc3Q6IG1ha2VSZXF1ZXN0KGxpc3QkMiksXG4gICAgICBnZXQ6IG1ha2VSZXF1ZXN0KGdldCQzKSxcbiAgICAgIGdldFBob3RvczogbWFrZVJlcXVlc3QoZ2V0UGhvdG9zJDMpXG4gICAgfVxuICB9O1xufSk7XG5cbmV4cG9ydCB7IExhbmd1YWdlLCBPcmRlckJ5LCBpbnRlcm5hbHMgYXMgX2ludGVybmFscywgY3JlYXRlQXBpIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD11bnNwbGFzaC1qcy5lc20uanMubWFwXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9+L3Vuc3BsYXNoLWpzL2Rpc3QvdW5zcGxhc2gtanMuZXNtLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==