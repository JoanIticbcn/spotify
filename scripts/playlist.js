//Funcio gettoken
let token = "";
let user_id = "";
let selectedPlayList = "";
document.getElementById("div2").textContent = "Selecciona una playlist"
//Funcio per agafar el token
function getToken() {
    token = window.location.href.split("access_token=")[1];
}
//Funcio get user_id + get_user_playlistst de aquest user_id
const getUser = async function () {
    const url = "https://api.spotify.com/v1/me";
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        if (data) {
            user_id = data.id
            const url = `https://api.spotify.com/v1/users/${user_id}/playlists`;
            const resposta = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            dades = await resposta.json()
            console.log(dades)
            for (let i = 0; i < dades.items.length; i++) {
                let objDiv = document.createElement("div")
                let ObjResult = document.getElementById("div1")
                objDiv.textContent = dades.items[i].name
                objDiv.addEventListener("click", function () {
                    selectedPlayList = dades.items[i].id
                    document.getElementById("inputplaylist").value = dades.items[i].name
                    getTracksFromPlaylist()
                })
                ObjResult.appendChild(objDiv)
            }
        } else {
            console.log("No hi ha usuari");
        }
    } catch (error) {
        console.error("Error en obtenir l'usuari:", error);
    }
};
//Agafa i carrega les tracks desde el localstorage amb els botons ADD i DEL i informacio del track
const getMultipleTracks = async function () {
    let trackIds = localStorage.getItem("listid").replaceAll("null", "").substring(1)
    const url = `https://api.spotify.com/v1/tracks?ids=${trackIds}`;
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        dada = await response.json()
        if (dada) {
            console.log(dada)
            for (let i = 0; i < dada.tracks.length; i++) {
                let objDiv3 = document.createElement("div")
                let btnAdd = document.createElement("button")
                btnAdd.textContent = "ADD"
                btnAdd.addEventListener("click", function () {
                    let userresponses = confirm("Estas segur que vols afegir aquesta canço a la playlist seleccionada?")
                    if (userresponses && selectedPlayList) {
                        afegirCancoaLaPlaylist(dada.tracks[i].uri)
                        getTracksFromPlaylist()
                        //alert("Canco afegida correctament")
                    } else {
                        alert("Has de seleccionar una playlist per poder afegir la canço")
                    }
                })
                let btnDel = document.createElement("button")
                btnDel.textContent = "DEL"
                btnDel.addEventListener("click", function () {

                })
                objDiv3.textContent = dada.tracks[i].name + " - " + dada.tracks[i].artists[0].name
                objDiv3.appendChild(btnAdd)
                objDiv3.appendChild(btnDel)
                let ObjResult3 = document.getElementById("div3")
                ObjResult3.appendChild(objDiv3)

            }
        } else {
            console.log("No hi ha cancons")
        }

    } catch (error) {
        console.log("Error", error)
    }
}
//Agafa i carrega totes les cancons de la playlist i les renderitza
const getTracksFromPlaylist = async function () {
    //La variable selectedPlayList és la playlist que hem seleccionem
    const url = `https://api.spotify.com/v1/playlists/${selectedPlayList}/tracks`;
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
    
        const dades = await response.json()
        if (dades) {
            document.getElementById("div2").innerHTML = ""
            for (let i = 0; i < dades.items.length; i++) {
                let objDiv = document.createElement("div")
                objDiv.textContent = dades.items[i].track.name + " - " + dades.items[i].track.artists[0].name + " - " + dades.items[i].added_at
                let btnDel = document.createElement("button")
                btnDel.textContent = "DEL"
                btnDel.addEventListener("click", function () {
                    let userResponse = confirm("Estas segur que vols borrar aquesta canço de la playlist?");
                    if (userResponse) {
                        borrarCancodeLaPlaylist(dades.items[i].track.uri)
                        getTracksFromPlaylist()
                    }
                })
                objDiv.appendChild(btnDel)
                let ObjResult2 = document.getElementById("div2")
                ObjResult2.appendChild(objDiv)
            }
        }else{
            console.log("No hi ha cancons per mostrar")
        }
    } catch (error) {
        console.log("Error"+error)
    }
}
//Borrar canco de la playlist donada el seu trackURI metode que va quan clickem a DEL
const borrarCancodeLaPlaylist = async function (trackUri) {
    //La variable selectedPlayList és la playlist que hem seleccionem
    const url = `https://api.spotify.com/v1/playlists/${selectedPlayList}/tracks`;
    // Realizar la solicitud a la API
    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                tracks: [{ uri: trackUri }] // Afegir la URIs que volem eliminar
            })
        });
        
    } catch (error) {
        console.log(error)
    }
}
//Afegir canco a la playlist endpoint donada el trackUri que s'ha d'afegir
const afegirCancoaLaPlaylist = async function (trackUri) {
    const url = `https://api.spotify.com/v1/playlists/${selectedPlayList}/tracks`;
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                uris: [trackUri], // Afegir la llista de URIs que volem afegir
            }),
        });
        
    } catch (error) {
        console.log(error)
    }
    
}

//Actualitzar el nom de la playlist
const updateSpotifyPlaylistName = async function (new_name) {
    const url = `https://api.spotify.com/v1/playlists/${selectedPlayList}`
    try {
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "name": new_name
            })
    
        })
    } catch (error) {
        console.log(error)
    }
    
}

//Actualitzar el nom de la playlist
document.getElementById("saveplaylistname").addEventListener("click", function () {
    updateSpotifyPlaylistName(document.getElementById("inputplaylist").value)
})

getToken()
getUser()
getMultipleTracks()