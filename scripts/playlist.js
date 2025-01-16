//Funcio gettoken
let token = "";
let user_id = "";
let selectedPlayList="";
document.getElementById("div2").textContent = "Selecciona una playlist"
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

const getMultipleTracks = async function () {
    let trackIds = localStorage.getItem("listid").replaceAll("null","").substring(1)
    const url = `https://api.spotify.com/v1/tracks?ids=${trackIds}`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    dada = await response.json()
    for (let i = 0; i < dada.tracks.length; i++) {
        let objDiv3 = document.createElement("div")
        let btnAdd = document.createElement("button")
        btnAdd.textContent = "ADD"
        btnAdd.addEventListener("click", function () {

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

}

const getTracksFromPlaylist = async function () {
    //La variable selectedPlayList és la playlist que hem seleccionem
    const url = `https://api.spotify.com/v1/playlists/${selectedPlayList}/tracks`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        },
    });

    const dades = await response.json()
    console.log(dades)
    document.getElementById("div2").innerHTML =""
    for(let i=0;i<dades.items.length;i++){
        let objDiv = document.createElement("div")
        objDiv.textContent=dades.items[i].track.name +" - "+ dades.items[i].track.artists[0].name+" - "+dades.items[i].added_at
        let btnDel = document.createElement("button")
        btnDel.textContent = "DEL"
        btnDel.addEventListener("click",function(){

        })
        objDiv.appendChild(btnDel)
        let ObjResult2 = document.getElementById("div2")
        ObjResult2.appendChild(objDiv)
    }
}

getToken()
getUser()
getMultipleTracks()