function breakTheText(){
var h1 = document.querySelector("h1")
var h1Text = document.querySelector("h1").textContent

var splittedText = h1Text.split("")
// console.log(splittedText);

var clutter = ""

var halfValue = splittedText.length/2
console.log(halfValue);

splittedText.forEach((elem,idx)=>{
    if(idx < halfValue){
        // console.log(elem)
        clutter += `<span class="a">${elem}</span>`
    }else{
        clutter += `<span class="b">${elem}</span>`
    }
})
h1.innerHTML = clutter
}
breakTheText()

gsap.from("h1 .a",{
    y:80,
    duartion:0.6,
    delay:0.5,
    opacity:0,
    stagger:0.2
})

gsap.from("h1 .b",{
    y:80,
    duartion:0.6,
    delay:0.5,
    opacity:0,
    stagger:-0.2
})