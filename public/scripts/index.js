



const posts = document.getElementsByClassName('post')
const cambiarFuente = document.getElementById('cambiarFuente')
const insulto = document.getElementById('insulto')
const cambiarVista = document.getElementById('vista')

const fixedVisible = document.getElementById('fixedVisible')
const showMenu = document.getElementById('showMenu')

const hideChatButton = document.getElementById('hideChatButton')
const showChatButton = document.getElementById('showChatButton')
const chatContainer = document.getElementById('chatContainer')

const fixedMenu = document.getElementById('fixedMenu')

const fixedHidden = document.getElementById('fixedHidden')
const settings = document.getElementById('settings')

const postButton = document.getElementById('postButton')
const hideMenu = document.getElementById('hideMenu')

const postMenu = document.getElementById('postMenu')


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
            console.log('a')
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


showMenu.addEventListener('click', () => {
    fixedMenu.style.display = 'flex'
    showMenu.style.display = 'none'
})

hideMenu.addEventListener('click', () => {
    fixedMenu.style.display = 'none'
    showMenu.style.display = 'block'
})

postButton.addEventListener('click', () => {
    if(postMenu.style.display === 'flex') postMenu.style.display = 'none'
    else postMenu.style.display = 'flex'
})

settingsButton.addEventListener('click', () => {
    if(settings.style.display === 'flex') settings.style.display = 'none'
    else settings.style.display = 'flex'
})




if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
    insulto.style.display = 'block'
}

showChatButton.addEventListener('click', () => {
    chatContainer.style.display = 'flex'
    showChatButton.style.display = 'none'
})

hideChatButton.addEventListener('click', () => {
    chatContainer.style.display = 'none'
    hideChatButton.style.display = 'none'
})