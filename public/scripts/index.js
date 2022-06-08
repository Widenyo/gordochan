



const posts = document.getElementsByClassName('post')
const cambiarFuente = document.getElementById('cambiarFuente')
const insulto = document.getElementById('insulto')


cambiarFuente.addEventListener(('click'), () => {
    for (let post of posts) {
        if(post.style.fontFamily === `"Comic Sans MS"`) post.style.fontFamily = ''
        else post.style.fontFamily = 'Comic Sans MS'
    }
})

if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
    insulto.style.display = 'block'
}