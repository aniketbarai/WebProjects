var initialPath = `M 50 100 Q 500 100 990 100`
var finalPath = `M 50 100 Q 500 100 990 100`

var string = document.querySelector("#string")
string.addEventListener("mousemove",(dets)=>{
    path = `M 50 100 Q ${dets.x} ${dets.y} 990 100`,
    gsap.to("svg path",{
        attr:{d:path},
        duration:0.2,
        ease:"power3.out"
    })
})
// string.addEventListener("mouseenter",(e)=>{
// console.log("entered");
// })
string.addEventListener("mouseleave",(e)=>{
    gsap.to("svg path",{
        attr:{d:finalPath},
        duration:1.5,
        ease:"elastic.out(1,0.2)"

    })
})