// gsap.from("nav",{
//     y:-300,
//     duration:2,
//     opacity:0
// })
// gsap.from("nav h4",{
//     y:200,
//     duration:2,
//     stagger:0.5,
//     opacity:0
// })
function pageOneAnim(){
    var tl = gsap.timeline()
tl.from("nav h1",{
    y:-30,
    opacity:0,
    delay:0.5,
    duration:0.6
})
tl.from("nav h4, nav button",{
    y:-30,
    opacity:0,
    duration:0.5,
    stagger:0.15
})
tl.from(".center-part1 h1",{
    x:-300,
    opacity:0,
    duration:0.5
})
tl.from(".center-part1 p",{
    x:200,
    opacity:0,
    duration:0.6
})
tl.from(".center-part1 button",{
    opacity:0,
    duration:0.3
})
tl.from(".center-part2 img",{
    x:100,
    opacity:0,
    duration:0.5
},"-=0.3")
tl.from(".section1bottom img",{
    opacity:0,
    y:30,
    stagger:0.15,
    duration:0.6
})
}
pageOneAnim()
function page2Anim(){
var tl2 = gsap.timeline({
    scrollTrigger:{
        trigger:".section2",
        scroller:"body",
        markers:false,
        start:"top 50%",
        end:"top -60%",
        scrub:2
    }
})
tl2.from(".services",{
    y:30,
    opacity:0,
    duration:0.5
})
tl2.from(".elem.line1.left",{
    x:-300,
    opacity:0,
    duration:0.7
},"anim")
tl2.from(".elem.line1.right",{
    x:300,
    opacity:0,
    duration:0.7
},"anim")
tl2.from(".elem.line2.left",{
    x:-300,
    opacity:0,
    duration:0.7
},"anim2")
tl2.from(".elem.line2.right",{
    x:300,
    opacity:0,
    duration:0.7
},"anim2")
}
page2Anim()