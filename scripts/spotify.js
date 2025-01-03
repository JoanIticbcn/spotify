import { clientId, clientSecret } from "../env/client.js";

const inputsong = document.getElementById("inputsong");
const btnBuscar = document.getElementById("btnbuscar");
const btnBorrar = document.getElementById("btnborrar");
btnBuscar.disabled = true;
btnBorrar.disabled = true;
document.getElementById("cancons").textContent = "Fes una busqueda"
let tokenacces;

btnBorrar.addEventListener("click", function () {
  document.getElementById("cancons").innerHTML = ""
  document.getElementById("cancons").textContent = "Fes una busqueda"
})

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
      return response.json(); //Retorna la resposta com JSON
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
      document.getElementById("cancons").textContent = "";
      let infTrack = data.tracks.items
      for (let i = 0; i < data.tracks.items.length; i++) {
        let Objdiv = document.createElement("div");
        let ObjResult = document.getElementById("cancons");
        Objdiv.className = "track";
        Objdiv.textContent = data.tracks.items[i].name;
        Objdiv.addEventListener("click", function () {
          buscarartista(data.tracks.items[i].artists[0].id)
        })
        Objdiv.innerHTML = "<h1>" + data.tracks.items[i].name + "</h1>" + "<img src=" + data.tracks.items[i].album.images[0].url + ">" + "<h1>" + data.tracks.items[i].artists[0].name + "<h1>" + "<h1>" + data.tracks.items[i].album.name + "<h1>";
        ObjResult.appendChild(Objdiv);
      }
    })
    .catch((error) => {
      console.error("Error al buscar cançons:", error);
      alert("No s'han trobat cap resultat")
    });
};


const buscarartista = function (idartist) {
  const urlEndpointArtist = "https://api.spotify.com/v1/artists/" + idartist
  let imatgeArtista;
  let nomdelgrup;
  let popularitat;
  let generes;
  let seguidors;
  fetch(urlEndpointArtist, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tokenacces}`,
      "Content-Type": "application/json",
    },
  }).then((response) => { return response.json() }).then((data) => {
     imatgeArtista = data.images[0].url
     nomdelgrup = data.name
     popularitat = data.popularity
     generes = data.genres
     seguidors = data.followers.total
    artistaInformaciolateral(imatgeArtista,nomdelgrup,popularitat,generes,seguidors)
  })
}

const artistaInformaciolateral = function (imatgeArtista,nomdelgrup,popularitat,generes,seguidors) {
  document.getElementById("lateral").innerHTML = "***" + "<img src=" + imatgeArtista + ">" + "<p>" + nomdelgrup + "<p>"+ "<p>" + popularitat + "<p>" +"<p>" + generes + "<p>"+ "<p>" + seguidors + "<p>"+"<h1> TOP TRACKS<h1>"
}


//Funcio search track
const search = function () {
  let trak = document.getElementById("inputsong").value
  searchSpotifyTracks(trak, tokenacces)
}
btnBuscar.addEventListener("click", search);
getSpotifyAccessToken(clientId, clientSecret);