import { clientId,clientSecret } from "../env/client.js";

const inputsong = document.getElementById("inputsong")
const btnBuscar = document.getElementById("btnbuscar")
const btnBorrar = document.getElementById("btnborrar")
btnBuscar.disabled = true;
btnBorrar.disabled = true;
let tokenacces;

//Primer Endpoint
const getSpotifyAccessToken = function (clientId, clientSecret) {
    // Url de l'endpont de spotify
    const url = "https://accounts.spotify.com/api/token";
    // ClientId i ClienSecret generat en la plataforma de spotify
    const credentials = btoa(`${clientId}:${clientSecret}`);
    //Es crear un header on se li passa les credencials
    const header = {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    };
    fetch(url, {
      method: "POST",
      headers: header,
      body: "grant_type=client_credentials", // Paràmetres del cos de la sol·licitud
    })
      .then((response) => {
        // Controlar si la petició ha anat bé o hi ha alguna error.
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return response.json(); // Retorna la resposta com JSON
      })
      .then((data) => {
        // Al data retorna el token d'accés que necessitarem
        // Haurem d’habilitar els botons “Buscar” i “Borrar”
        tokenacces = data.access_token
        btnBuscar.disabled = false
        btnBorrar.disabled = false
      })
      .catch((error) => {
        // SI durant el fetch hi ha hagut algun error arribarem aquí.
        console.error("Error a l'obtenir el token:", error);
      });
    };

//Segon endpoint
const searchSpotifyTracks = function (query, accessToken) {
  // Definim l’endpoint, la query és el valor de búsqueda.
  // Limitem la búsqueda a cançons i retornarà 12 resultats.
  const searchUrl =
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      query
    )}&type=track&limit=12`;


  // Al headers sempre s’ha de posar la mateixa informació.
  fetch(searchUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
     // Controlem si la petició i la resposta han anat bé. 
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data)
    })
    .catch((error) => {
      console.error("Error al buscar cançons:", error);
    });
};
//Funcio search track
const search = function(){
  let trak = document.getElementById("inputsong").value
  searchSpotifyTracks(trak,tokenacces)
}
btnBuscar.addEventListener("click",search)
getSpotifyAccessToken(clientId,clientSecret)