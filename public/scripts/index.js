



const posts = document.getElementsByClassName('post')
const cambiarFuente = document.getElementById('cambiarFuente')

const text = document.getElementById('text')
const anon = document.getElementById('anonCheck')
const imageInput = document.getElementById('imageInput')
const submit = document.getElementById('postSubmit')





submit.addEventListener(('click'), () => {
    console.log(text.value)
    console.log(anon.checked)
    console.log(imageInput.value)

    var xhr = new XMLHttpRequest();
    xhr.open("POST", './post', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
    content: text.value,
    anon: anon.checked
    
}));

document.location.reload(true)

})





cambiarFuente.addEventListener(('click'), () => {
    for (let post of posts) {
        if(post.style.fontFamily === `"Comic Sans MS"`) post.style.fontFamily = ''
        else post.style.fontFamily = 'Comic Sans MS'
    }
})