document.addEventListener("DOMContentLoaded",()=>{


const links=document.querySelectorAll("a[href^='#']");


links.forEach(link=>{

link.addEventListener("click",function(e){

e.preventDefault();

document.querySelector(this.getAttribute("href"))
.scrollIntoView({

behavior:"smooth"

});

});

});


});
