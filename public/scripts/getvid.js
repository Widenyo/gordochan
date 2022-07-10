const buscarInput = document.getElementById('buscarInput')
const buscar = document.getElementById('buscar')
const videoContainer = document.getElementById('videoContainer')



buscar.addEventListener('click', async () => {
    const dataReq = await fetch(`/tomp3/videosearch/${buscarInput.value}`)
    const data = await dataReq.json()
    let videosHTML = ''
    data.forEach((v, i)  => {
        videosHTML += `
        <div class="video" id=${i}>
        <h2>${v.title}</h2>
        <h5>${v.channel}</h5>
        Duracion: ${v.length}<br>
        <a id="${i}__click" url="${v.thumbnail}" onclick=sauceNAO(${i}) href="javascript:void(0);"><img src="${v.thumbnail}" class='vidimg'><br></a>
        <a href='/tomp3/download/${v.id}?title=${v.parsedTitle}'>Descargar</a>
        <div id="${i}__saucenao"></div>
        <br>
        </div>
        `
    })
    videoContainer.innerHTML = videosHTML
})

async function sauceNAO(id){

    const anchor = document.getElementById(id+'__click')
    const div = document.getElementById(`${id}__saucenao`)
    const url = (anchor.getAttribute('url'))

    const dataReq = await fetch(`/utils/saucenao/search/?url=${url}`)
    const data = await dataReq.json()
    console.log(data)
    for(let i = 0; i < data.length; i++){
        let HTML = ""
        HTML += `
        <div class="sauce">
        ${data[i].material}: ${data[i].characters}.<br>
        By: ${data[i].creator}.<br>
        Similarity: ${data[i].similarity}<br>
        `

        data[i].urls && data[i].urls.forEach(u =>{
            HTML += `<a target="_blank" href="${u}">Ver</a><br>`
        })

        HTML += `</div>`

        div.innerHTML += HTML

    }

}