// gsap.to("#box1",{
//     x:1000,
//     duration:2,
//     delay:1,
//     rotate:360,
//     backgroundColor:"green",
//     borderRadius:"50%",
//     scale:0.5
// })
gsap.from("h1",{
    opacity:0,
    y:30,
    duration:2,
    delay:1,
     stagger:0.3   //(stagger ==> one bye one)
    // stagger:-1
})
// gsap.to("#box1",{
//     x:900,
//     duration:2,
//     delay:1,
//     rotate:360,
//     repeat:-1, //infinite
//     yoyo:true
// })
// gsap.to("#box1",{
//     x:800,
//     duration:1.5,
//     delay:1,
//     rotate:360
// })
// gsap.to("#box2",{
//     x:800,
//     backgroundColor:"yellow",
//     duration:1.5,
//     delay:2.5
// })
// gsap.to("#box3",{
//     x:800,
//     scale:0.5,
//     borderRadius:"50%",
//     duration:1.5,
//     delay:4
// })

// var tl = gsap.timeline()
// tl.to("#box1",{
//     x:700,
//     rotate:360,
//     duration:1.5,
//     delay:1
// })
// tl.to("#box2",{
//     x:700,
//     rotate:360,
//     duration:1.5,
// })
// tl.to("#box3",{
//     x:700,
//     duartion:1.5,
// })

var tl = gsap.timeline()
tl.from("#nav",{
    opacity:0,
    duration:1.5,
    delay:1
})
tl.from("h2",{
    y:-50,
    duration:1,
    opacity:0,
})
tl.from("h4",{
    x:40,
    duration:1,
    opacity:0,
    stagger:0.3
})
