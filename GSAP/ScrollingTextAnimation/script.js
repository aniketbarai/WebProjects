function marqueAnimation(){
    
window.addEventListener("wheel", (dets) => {
    // console.log(dets.deltaY);
    if (dets.deltaY > 0) {
        // console.log("right....");
        gsap.to(".marque", {
            transform: "translateX(-200%)",
            duration: 4,
            ease: "none",
            repeat: -1
        })

        gsap.to(".marque img",{
            rotate:180
        })
    }
    else {
        // console.log("left...");
        gsap.to(".marque", {
            transform: "translateX(0%)",
            duration: 4,
            ease: "none",
            repeat: -1
        })
        gsap.to(".marque img",{
            rotate:360
        })
    }
})
}
marqueAnimation()