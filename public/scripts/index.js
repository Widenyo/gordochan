let posts = document.getElementsByClassName('post')
let cambiarFuente = document.getElementById('cambiarFuente')

cambiarFuente.addEventListener(('click'), () => {
    for (let post of posts) {
        if(post.style.fontFamily === `"Comic Sans MS"`) post.style.fontFamily = ''
        else post.style.fontFamily = 'Comic Sans MS'
    }
})