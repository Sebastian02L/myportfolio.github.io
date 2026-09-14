window.addEventListener('DOMContentLoaded', async event => {
  //Suscripcion de eventos
  document.querySelectorAll(".overlay").forEach(game => {
    game.addEventListener("click", OnGameClicked);
  });

  //Cargamos los datos de los juegos en memoria
  await LoadGames();
});

//VARIABLES GLOBALES
var gameCoverShowcased = null;
var videogamesData = null;

//Metodo que carga los datos de los juegos desde un JSON local
async function LoadGames() {
  var dataRoute = selectedLanguage == 0 ? './data/spanish-games-data.json' : './data/english-games-data.json';
  const response = await fetch(dataRoute);
  if (!response.ok) {
    console.error("Error al cargar los datos de los juegos: " + response.status);
    return;
  }

  const data = await response.json(); //Convierte la respuesta a JSON
  videogamesData = data;
  console.log("Datos de juegos cargados correctamente");
}

//Se ejecuta cuando el usuario hace click en la portada de alguno de los juegos
async function OnGameClicked() {
  let videogameShowcase = document.querySelector("#videogame-showcase");
  let container = videogameShowcase.querySelector(".container");

  if (gameCoverShowcased == null) {
    gameCoverShowcased = this.id.slice(1); //Guarda el ID del elemento pulsado (G0, G1, G2...)
  }
  else if (gameCoverShowcased == this.id.slice(1)) {
    videogameShowcase.classList.remove("expanded");
    gameCoverShowcased = null;
    return;
  }
  else {
    gameCoverShowcased = this.id.slice(1);

  }

  const videogameInfo = SearchGameInfo(gameCoverShowcased);
  await CreateVideogameShowcase(container, videogameInfo);

  //Muestra el contenido
  videogameShowcase.classList.add("expanded");

  //Ancla al contenido
  videogameShowcase.scrollIntoView({ behavior: 'smooth' });
}

//Busca un juego por su ID (G0, G1, G2...) y devuelve su información
function SearchGameInfo(gameid) {
  return videogamesData[gameid];
}

//Metodo que crea la ventana de información de un juego
async function CreateVideogameShowcase(container, videogameInfo) {
  container.innerHTML = `
      <div id="showcase-content">
        <div id="showcase-title">
          <h2>${videogameInfo.title}</h2>
          <h3>${videogameInfo.subtitleIntroduction} <a style="text-decoration: none; color: inherit;" href="${videogameInfo.developerPage}" target="_blank">${videogameInfo.subtitle}</a></h3>
          <h3>${videogameInfo.timeStamp}</h3>
          <img class="gamepad-icon" src="${videogameInfo.icon}" alt="${videogameInfo.title} Icon"/>
        </div>

        <div id="showcase-columns">
          <div class="showcase-column">
            <div id="youtube-embed"></div>
            <img id="thumb" src="${videogameInfo.thumb}" alt="${videogameInfo.title} Thumbnail"/>
            <br>
            <div id= "itchio-embed-2"></div>
          </div>

          <div class="showcase-column">
            <p id="description" style="text-align: justify;">${videogameInfo.description}</p>
            <h3 id="responsibilities-title">${videogameInfo["responsibilities-title"]}</h3>
            <ul id="responsibilities">
              ${videogameInfo.responsibilities.map(r =>
                typeof r === 'string'
                  ? `<li>${r}</li>`
                  : `<li>${r.group}<ul>${r.items.map(item => `<li>${item}</li>`).join('')}</ul></li>`
              ).join('')}
            </ul>
            <h3 id="developed-in-title">${videogameInfo["developed-with-title"]}</h3>
            <img id="developedIn" src="${videogameInfo.developedIn}"/>
            <div id= "itchio-embed-1"></div>
          </div>
        </div>
      </div>
    `;

  if (videogameInfo.itchio) {
    const itchioEmbed = (videogameInfo.videoYoutube) ? document.querySelector("#itchio-embed-1") : document.querySelector("#itchio-embed-2");
    itchioEmbed.innerHTML = `
            <iframe frameborder="0" width="${videogameInfo.itchio.width}" 
            height="${videogameInfo.itchio.height}" 
            src="${videogameInfo.itchio.src}"
            href="${videogameInfo.itchio.href}"
            >${videogameInfo.itchio.text}</iframe>
        `;
  }

    if (videogameInfo.videoYoutube) {
      const youtubeEmbed = document.querySelector("#youtube-embed");
      youtubeEmbed.innerHTML = `
            <iframe width="${videogameInfo.videoYoutube.width}" height="${videogameInfo.videoYoutube.height}" 
            src="${videogameInfo.videoYoutube.src}" 
            title="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; 
            encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
    }
}

//Metodo llamado cuando se cambia el idioma de la pagina
function OnLanguageChanged() {
  let videogameShowcase = document.querySelector("#videogame-showcase");
  videogameShowcase.classList.remove("expanded");
  gameCoverShowcased = null;
}
