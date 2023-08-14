

  const sayOk = document.getElementById('ok')
function alert (){
    console.log ('alert')
    // location.replace("homePage.html")
    window.open("homePage.html")
}
sayOk.addEventListener ('click',()=> {
    alert();
})