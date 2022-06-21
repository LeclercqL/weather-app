//On importe le package de unsplash (https://github.com/unsplash/unsplash-js#installation)
import { createApi } from 'unsplash-js';

//On se connecte à l'API de unsplash (https://github.com/unsplash/unsplash-js#usage)
const unsplash = createApi({ accessKey: 'Qj3FYvMNkII7Jytb0DMDWUzu8NR2ww0KcCGCJkMa-XM' });

const form = document.querySelector(".search-form__form");
const input = document.querySelector(".search-form__input");
const button = document.querySelector('.search-form__submit')
const msg = document.querySelector(".search-form__msg");
const cities = document.querySelector(".cities");
const save_search = document.querySelector(".save-search__list");
const apiKey = "1f3b48fa7c4b0931df614338674f9a69";

//Function pour lancer la recherche
const searchWeather = (customCity = '') => {
  let inputVal = input.value;

  //check if there's already a city
  const listItems = cities.querySelectorAll(".city");
  const listItemsArray = Array.from(listItems);

  if (listItemsArray.length > 0) {
    listItemsArray.forEach(item => {
      item.remove();
    });

    const filteredArray = listItemsArray.filter(el => {
      let content = "";
      //athens,gr
      if (inputVal.includes(",")) {
        //athens,grrrrrr->invalid country code, so we keep only the first part of inputVal
        if (inputVal.split(",")[1].length > 2) {
          inputVal = inputVal.split(",")[0];
          content = el
            .querySelector(".city-name span")
            .textContent.toLowerCase();
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
      msg.textContent = `Vous connaissez déjà la météo pour ${filteredArray[0].querySelector(".city-name span").textContent
        } ...sinon, soyez plus précis en indiquant également le code du pays. 😉`;
      form.reset();
      input.focus();
      return;
    }
  }

  if(customCity != '') {
    inputVal = customCity;
    input.val = customCity;
  }
  //ajax here
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${inputVal}&appid=${apiKey}&units=metric&lang=fr`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const { city, list } = data;

      document.querySelector('.search-form__city').textContent = city.name;

      //On crée un tableau pour stocker le résulat des 5 prochains jours
      let days = [];

      //On créer une variable pour stocker l'index de chaque élément du tableau du résulat final
      let day_index = 0;

      //Date de la 1ere tranche horaire
      const date = new Date(list[0].dt_txt);
      const hour = date.getHours();
      const index_next_day = (24 - hour) / 3;

      //On va stocker toutes les donneés de la journée en cours puis les supprimer de la liste
      let current_day = getCurrentDayData(list, date, false, index_next_day);

      //On va stocker les données de la journée actuelle pour ajouter un block supplémentaire si on est pas encore la nuit
      let current_day_extra = false;
      current_day_extra = getCurrentDayData(list, date, true, index_next_day);

      //On supprime les éléments du tableau du jour actuel jusqu'au jour suivant
      list.splice(0, index_next_day); // 0 = index de départ et index_next_day = le nombre d'éléments du tableau à supprimer

      //On parcoure chaque élément retournées par l'API
      list.forEach((item, index) => {
        const { temp, humidity } = item.main;
        const { speed, deg } = item.wind;
        const icon = item.weather[0].icon;
        const weather_desc = item.weather[0].description;

        const date_txt = item.dt_txt;
        const date = new Date(date_txt);
        const day = date.toLocaleDateString("fr-FR", { weekday: "long" }); // toLocaleDateString convertit une date au format de la lang souhaitée

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
        }
        else if (index >= 8 && index < 16) {
          days[1].temp.push(temp);
          days[1].icon.push(icon);
          days[1].weather_desc.push(weather_desc);
        }
        else if (index >= 16 && index < 24) {
          days[2].temp.push(temp);
          days[2].icon.push(icon);
          days[2].weather_desc.push(weather_desc);
        }
        else if (index >= 24 && index < 32) {
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

      days.forEach((item, index) => {
        //On récupère la température min de la journée et la maximum
        let temp_min = Math.min(...item.temp);
        let temp_max = Math.max(...item.temp);

        //On crée une variable pour stocker l'icone lorsqu'il est 6h du matin et 21h (ex: item.icon['00:00','03:00','06:00','09:00','12:00'..])
        let icon_from = '';
        let icon_to = '';
        if (item.icon.length > 1) {
          icon_from = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${item.icon[2]}.svg`;
          icon_to = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${item.icon[6]}.svg`;
        } else {
          icon_from = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${item.icon[0]}.svg`;
          icon_to = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${item.icon[0]}.svg`;
        }

        //On crée une variable pour stocker la description du temps à 6h et 21h
        let weather_desc_from = '';
        let weather_desc_to = '';
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
        const li = document.createElement("li");
        li.classList.add("city");

        let markup = `
          <span class="city__day">${item.day}</span>
          <span class="city-name" style="display: none">
            <span>${city.name}</span>
          </span>`;
        markup += `
          <figure class="city__icon">`;

        //Si les icones représentant le temps de la journée sont identique alors on affiche qu'une des deux
        if (icon_from != icon_to) {
          markup += `
              <img src="${icon_from}" alt="${weather_desc_from}">
              <img src="${icon_to}" alt="${weather_desc_to}">`;
        } else {
          markup += `
              <img src="${icon_from}" alt="${weather_desc_from}">`;
        }
        markup += `
          </figure>
          <span class="city__humidity"><i class="humidity"></i> ${item.humidity} %</span>
          <span class="city__wind">${item.wind_speed} <i class="wind" style="display: inline-block;transform: rotate(-${item.wind_deg}deg)"></i></span>
        `;
        markup += '<div class="city__temp">';
        //Si le temps min et max sont identique alors on affiche qu'une des deux temperatures
        if (Math.round(temp_min) != Math.round(temp_max)) {
          markup += `
            <div class="city__temp__item">${Math.round(temp_min)}<sup>°C</sup></div>
            <div class="city__temp__item">${Math.round(temp_max)}<sup>°C</sup></div>`;
        } else {
          markup += `
            <div class="city__temp__item">${Math.round(temp_max)}<sup>°C</sup></div>`;
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
      getChart(list,index_next_day);
    })
    .catch((error) => {
      console.log(error);
      msg.textContent = "Veuillez rechercher une ville valide 😩";
    });
}


//Function pour récupérer une série de photo sur Unsplash et en afficher une au hasard
const changeBackground = (city) => {
  unsplash.search.getPhotos({
    query: city,
    page: 1,
    perPage: 10,
    orientation: 'portrait',
  }).then(data => {
    //On stocker dans une variable le nombre de résulat
    let nbr_result = data.response.results.length;

    if (data.errors) {
      console.log('error occurred: ', data.errors[0]);
    }
    else if (nbr_result == 0) {
      console.log('Aucun résultat');
    }
    else {
      //On récupère une image au hasard (entre 0 et le nombre maximum d'élément)
      const random_index = Math.floor(Math.random() * (nbr_result + 1));
      const bg_url = data.response.results[random_index].urls.regular;
      document.querySelector('.app-bg').style.backgroundImage = `url(${bg_url})`;
    }
  });
}

//Function pour récupérer le moment de la journée
const getDayMoment = (hour) => {
  if (hour >= 12 && hour <= 17) {
    return 'afternoon';
  } else if (hour >= 17 || hour < 6) {
    return 'night';
  } else {
    return 'morning';
  }
}

const getCurrentDayData = (list, date, extra = false, to) => {
  const current_day = {};
  const hour = date.getHours();
  const day = date.toLocaleDateString("fr-FR", { weekday: "long" }); // toLocaleDateString convertit une date au format de la lang souhaitée
  const moment = getDayMoment(hour);
  let i;

  if (extra) {
    i = 2;
    if (moment == 'morning' || moment == 'night') {
      current_day.day = day;
    }
    else if (moment == 'afternoon') {
      current_day.day = `Ce soir`;
    }
  } else {
    i = 0;
    if (moment == 'morning') {
      current_day.day = 'Ce matin';
    }
    else if (moment == 'afternoon') {
      current_day.day = day;
    }
    else if (moment == 'night') {
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
}

//Récupérer toutes les tranches de temperature de la journée en cours dans un tableau
const getCurrentDayDataAverage = (list, to, type) => {
  let arr = [];
  for (let i = 0; i < to; i++) {
    if (type == 'temp') {
      arr.push(list[i].main.temp);
    } else if (type == 'icon') {
      arr.push(list[i].weather[0].icon);
    }
  }
  return arr;
}

//Enregistrer le choix de l'utilisateur
const saveSearch = (query) => {
  let queries = [];

  // On parse (parcoure) en JSON le résultat stocké dans le locale storage
  queries = JSON.parse(localStorage.getItem('queries')) || [];

  // On ajoute la dernière recherche aux sauvegardes
  console.log(queries.indexOf(query) == -1);
  if(queries.indexOf(query) == -1) {
    queries.push(query);
  }

  // On stocke le nouveau tableau avec tous les résultats dans le localstorage
  localStorage.setItem('queries', JSON.stringify(queries));
}

//Remplir la liste des anciennes recherches
const displayOldSearch = () => {
  var queries = [];
  queries = JSON.parse(localStorage.getItem('queries')) || [];

  queries.forEach((item) => {
    const li = document.createElement("li");
    li.classList.add("save-search__item");
    let markup = `<a href="#">${item}</a>`;
    li.innerHTML = markup;
    save_search.appendChild(li);

    li.addEventListener('click', e => {
      input.value = item;
      button.click();
    });
  });
}

//Création de la charte avec Chart.js
const getChart = (list,to) => {
  var canvas = document.getElementById("canvas");

  if(typeof window.chart != 'undefined') {
    chart.destroy();
  }

  // Apply multiply blend when drawing datasets
  var multiply = {
    beforeDatasetsDraw: function(chart, options, el) {
      chart.ctx.globalCompositeOperation = 'multiply';
    },
    afterDatasetsDraw: function(chart, options) {
      chart.ctx.globalCompositeOperation = 'source-over';
    },
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
  const date = new Date(list[0].dt_txt);
  let hour = date.getHours();
  let labels = [];
  for (let i = 0;i < 7;i++) {
    if(hour > 23) {
      hour = 0;
    }
    labels.push(hour + 'h');
    hour = hour + 3;
  }

  var config = {
      type: 'line',
      data: {
          labels: labels,
          datasets: [
            {
                label: 'Temperature',
                data: getCurrentDayDataAverage(list,to,'temp'),
                fill: false,
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 2,
                pointBackgroundColor: 'transparent',
                pointBorderColor: '#FFFFFF',
                pointBorderWidth: 3,
                pointHoverBorderColor: 'rgba(255, 255, 255, 0.2)',
                pointHoverBorderWidth: 10,
                lineTension: 0,
            }
          ],
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
          display: false,
        },
        plugins: { 
          legend: {
            labels: {
              color: "white", 
            }
          }
        },
        scales: {
          y: { 
            ticks: {
              color: "white",
            }
          },
          x: { 
            ticks: {
              color: "white", 
            }
          }
        }
      },
  };

  window.chart = new Chart(canvas, config);
}




//Lorsque qu'on soumet le formulaire de recherche
form.addEventListener("submit", e => {
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