let posts = document.getElementsByClassName('post')
let cambiarFuente = document.getElementById('cambiarFuente')

cambiarFuente.addEventListener(('click'), () => {
    for (let post of posts) {
        console.log(post.style)
        post.style.fontFamily = 'Comic Sans MS'
        console.log(post.style)
    }
})