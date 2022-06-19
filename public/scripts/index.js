



const posts = document.getElementsByClassName('post')
const cambiarFuente = document.getElementById('cambiarFuente')
const insulto = document.getElementById('insulto')
const cambiarVista = document.getElementById('vista')


cambiarFuente.addEventListener(('click'), () => {
    for (let post of posts) {
        console.log(post.style.fontFamily)
        if(post.style.fontFamily === `"Comic Sans MS"`) post.style.fontFamily = ''
        else post.style.fontFamily = 'Comic Sans MS'
    }
})

cambiarVista.addEventListener(('click'), () => {
    for(let post of posts){
        if(post.style.display === 'inline-table'){
            post.style.width = 'fit-content';
            post.style.display = 'block';
            post.style.maxWidth = '80%';
            post.style.minWidth = '25%';
            post.style.wordWrap = 'break';
        }
        else{
            post.style.display = 'inline-table';
            post.style.maxWidth = ''
            post.style.minWidth = '';
        }
    }

})




if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
    insulto.style.display = 'block'
}

