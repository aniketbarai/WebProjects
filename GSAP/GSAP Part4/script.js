var main = document.querySelector("#main")
var cursor = document.querySelector("#cursor")
var imageDiv = document.querySelector("#image")

main.addEventListener("mousemove",(dets)=>{
    gsap.to(cursor,{
        x:dets.x,
        y:dets.y,
        duration:0.6,
        ease:"back.out"
    })
})
imageDiv.addEventListener("mouseenter",()=>{
    cursor.textContent = "View more"
    gsap.to(cursor,{
        scale:4,
        backgroundColor:"rgba(202, 201, 201,  0.300)"
    })
})
imageDiv.addEventListener("mouseleave",()=>{
    cursor.textContent = ""
    gsap.to(cursor,{
        scale:1,
        backgroundColor:"#fff"
    })
})