import { clientId, clientSecret } from "../env/client.js";

const inputsong = document.getElementById("inputsong");
const btnBuscar = document.getElementById("btnbuscar");
const btnBorrar = document.getElementById("btnborrar");

const URL = "https://accounts.spotify.com/authorize";
const redirectUri = "http://127.0.0.1:5500/html/playlist.html";
const scopes =
  "playlist-modify-private user-library-modify playlist-modify-public";


const autoritzar = function () {
  const authUrl =
    URL +
    `?client_id=${clientId}` +
    `&response_type=token` +
    `&redirect_uri=${redirectUri}` +
    `&scope=${scopes}`;


  window.location.assign(authUrl);
};

document.getElementById("creaplaylist").addEventListener("click",autoritzar)

btnBuscar.disabled = true;
btnBorrar.disabled = true;
document.getElementById("cancons").textContent = "Fes una busqueda"
let tokenacces;
let topTrackstext;

btnBorrar.addEventListener("click", function () {
  document.getElementById("cancons").innerHTML = ""
  document.getElementById("cancons").textContent = "Fes una busqueda"
  document.getElementById("lateral").innerHTML = "<p>" + "Informació artista" + "</p>" + "<p>" + "Llista cançons" + "</p>"
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
  if (!query) {
    alert("No has entrat cap canço")
  }
  if (query.length < 3) {
    alert("Has d'introduir 2 o més caracters")
  }
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
        let ButtonAfegir = document.createElement("button");
        ButtonAfegir.textContent = "+ Afegir cançó"
        ButtonAfegir.className = "afegirc"
        ButtonAfegir.addEventListener("click", function () {
          localStorage.setItem("listid", localStorage.getItem("listid") + ";" + data.tracks.items[i].id)
          console.log(localStorage.getItem("listid"))
        })
        Objdiv.className = "track";
        Objdiv.textContent = data.tracks.items[i].name;
        Objdiv.addEventListener("click", function () {
          buscarartista(data.tracks.items[i].artists[0].id)
        })
        Objdiv.innerHTML = "<h1>" + data.tracks.items[i].name + "</h1>" + "<img src=" + data.tracks.items[i].album.images[0].url + ">" + "<h1>" + data.tracks.items[i].artists[0].name + "</h1>" + "<h1>" + data.tracks.items[i].album.name + "</h1>";
        Objdiv.appendChild(ButtonAfegir)
        ObjResult.appendChild(Objdiv);
      }
      document.getElementById("dotzemes").addEventListener("click", function () {
        dotzemes(data.tracks.next, tokenacces)
      })
    })
    .catch((error) => {
      console.error("Error al buscar cançons:", error);
      alert("No s'han trobat cap resultat")
    });
};


const dotzemes = function (urlnext, accessToken) {
  fetch(urlnext, {
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
      let infTrack = data.tracks.items
      for (let i = 0; i < data.tracks.items.length; i++) {
        let Objdiv = document.createElement("div");
        let ObjResult = document.getElementById("cancons");
        let ButtonAfegir = document.createElement("button");
        ButtonAfegir.textContent = "+ Afegir cançó"
        ButtonAfegir.className = "afegirc"
        ButtonAfegir.addEventListener("click", function () {
          localStorage.setItem("listid", localStorage.getItem("listid") + ";" + data.tracks.items[i].id)
          console.log(localStorage.getItem("listid"))
        })
        Objdiv.className = "track";
        Objdiv.textContent = data.tracks.items[i].name;
        Objdiv.addEventListener("click", function () {
          buscarartista(data.tracks.items[i].artists[0].id)
        })
        Objdiv.innerHTML = "<h1>" + data.tracks.items[i].name + "</h1>" + "<img src=" + data.tracks.items[i].album.images[0].url + ">" + "<h1>" + data.tracks.items[i].artists[0].name + "</h1>" + "<h1>" + data.tracks.items[i].album.name + "</h1>";
        Objdiv.appendChild(ButtonAfegir)
        ObjResult.appendChild(Objdiv);
      }
    })
}
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
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    return response.json()
  }).then((data) => {
    imatgeArtista = data.images[0].url
    nomdelgrup = data.name
    popularitat = data.popularity
    generes = data.genres
    seguidors = data.followers.total
    artistaInformaciolateral(imatgeArtista, nomdelgrup, popularitat, generes, seguidors, idartist)
  }).catch((error) => {
    console.error("Error al buscar l'artista:", error);
  });
}

const artistaInformaciolateral = function (imatgeArtista, nomdelgrup, popularitat, generes, seguidors, idartist) {
  getTopTracks(imatgeArtista, nomdelgrup, popularitat, generes, seguidors, idartist)
}

const getTopTracks = function (imatgeArtista, nomdelgrup, popularitat, generes, seguidors, idartist) {
  const url = `https://api.spotify.com/v1/artists/${idartist}/top-tracks`;
  fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tokenacces}`,
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    return response.json()
  }).then((data) => {
    document.getElementById("lateral").innerHTML = "***" + "<img src=" + imatgeArtista + ">" + "<h1>" + nomdelgrup + "</h1>" + "<h4>Populartitat </h4>" + "<p>" + popularitat + "</p>" + "<h4>Generes </h4>" + "<p>" + generes + "</p>" + "<h4>Seguidors </h4>" + "<p>" + seguidors + "</p>" + "<h1> TOP TRACKS</h1>" + "<p>" + data.tracks[0].name + "</p>" + "<p>" + data.tracks[1].name + "</p>" + "<p>" + data.tracks[2].name + "</p>"
  })

}


//Funcio search track
const search = function () {
  let trak = document.getElementById("inputsong").value
  searchSpotifyTracks(trak, tokenacces)
}
btnBuscar.addEventListener("click", search);
getSpotifyAccessToken(clientId, clientSecret);