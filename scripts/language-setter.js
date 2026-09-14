window.addEventListener('DOMContentLoaded', event => {
    //Suscripcion de eventos
    document.querySelector("#spanish").addEventListener("click", OnSpanishClicked);
    document.querySelector("#english").addEventListener("click", OnEnglishClicked);

    LoadTexts();
});

//VARIABLES GLOBALES
var selectedLanguage = 1; //0 = Spanish, 1 = English
var indexTexts;

//Carga los datos de los textos desde un JSON local
async function LoadTexts() {
  const response = await fetch('./data/texts-index.json');
  if (!response.ok) {
    console.error("Error al cargar los datos de los textos: " + response.status);
    return;
  }

  const data = await response.json(); //Convierte la respuesta a JSON
  indexTexts = data;
  console.log("Textos cargados correctamente");
}

//Metodo que reacciona cuando se pulsa la bandera de españa
function OnSpanishClicked() {
    if (selectedLanguage == 0) return;
    selectedLanguage = 0;
    console.log("Idioma cambiado a español");
    UpdateIndexTexts();
    LoadGames();
    OnLanguageChanged();
    UpdateFormsLanguage();
}

//Metodo qiue reacciona cuando se pulsa la bandera de inglaterra
function OnEnglishClicked() {
    if (selectedLanguage == 1) return;
    selectedLanguage = 1;
    console.log("Idioma cambiado a inglés");
    UpdateIndexTexts();
    LoadGames(); //Mandamos a cargar los datos para que cachee el JSON en el idioma seleccionado
    OnLanguageChanged();
    UpdateFormsLanguage();
}   

//Metodo que recorre los elementos del Index.html y actualiza sus textos
function UpdateIndexTexts(){
    indexTexts.forEach(element => {
        var selector = document.querySelector(`#${element.id}`) //Cuando el elemento es por ID
        if(selector != null)
        {
            selector.innerHTML = element.texts[selectedLanguage];
        }
        else{
            selector = document.querySelectorAll(`.${element.class}`); //Cuando el elemento es por clase
            if(selector != null)
            {
                selector.forEach(el => {
                    el.innerHTML = element.texts[selectedLanguage];
                });
            }
        }
    });
}

function UpdateFormsLanguage(){
    document.querySelector("#forms-name").placeholder = selectedLanguage == 0 ? "Tu nombre" : "Your Name";
    document.querySelector("#forms-email").placeholder = selectedLanguage == 0 ? "nombre@ejemplo.com" : "name@example.com";
    document.querySelector("#forms-message").placeholder = selectedLanguage == 0 ? "Escribe tu mensaje aquí..." : "Enter your message here...";
    document.querySelector("#submitButton").textContent = selectedLanguage == 0 ? "Enviar" : "Send";
}