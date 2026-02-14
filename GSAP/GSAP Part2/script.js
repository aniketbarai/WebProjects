// gsap.from("#page1 #box",{
//     scale:0,
//     delay:1,
//     duration:1.5,
//     rotate:360
// })

// gsap.from("#page2 #box",{
//     scale:0,
//     opacity:0,
//     delay:1,
//     duration:1.5,
//     rotate:720,
//     scrollTrigger:{
//         trigger:"#page2 #box",
//         scroller:"body",
//         markers:true,
//         start:"top 60%",
//         end:"top 30%",
//         // scrub:true
//         scrub:2
//     }
// })

// gsap.from("#page3 #box",{
//     scale:0,
//     delay:1,
//     duration:1.5,
//     rotate:360
// })

// gsap.from("#page2 h1",{
//     opacity:0,
//     x:500,
//     duration:2,
//     scrollTrigger:{
//         trigger:"#page2 h1",
//         scroller:"body",
//         markers:true,
//         start:"top 50%"
//     }
// })

// gsap.from("#page2 h2",{
//     opacity:0,
//     x:-500,
//     duration:2,
//     scrollTrigger:{
//         trigger:"#page2 h2",
//         scroller:"body",
//         markers:true,
//         start:"top 50%"
//     }
// })

gsap.to("#page2 h1",{
    transform:"translateX(-170%)",
    scrollTrigger:{
        trigger:"#page2",
        scroller:"body",
        markers:true,
        start:"top 0%",
        end:"top -100%",
        scrub:2,
        pin:true
    }
})