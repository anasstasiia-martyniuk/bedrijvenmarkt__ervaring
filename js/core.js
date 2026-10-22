const sections = document.querySelectorAll(".horizontal-section");
let ticking = false;

const updateHorizontalScroll = () => {
    sections.forEach((section) => {
        const track = section.querySelector(".horizontal-track");
        if (!track) return;
        
        const rect = section.getBoundingClientRect();
        const scrollDistance = section.offsetHeight - track.offsetHeight;
        
        if (scrollDistance <= 0) return;
        
        const progress = Math.max(0, Math.min(1, -rect.top / scrollDistance));
        const maxMove = Math.max(0, track.scrollWidth - window.innerWidth);
        const direction = section.dataset.direction;
        
        let x = 0;
        
        if (direction === "right") {
            x = -progress * maxMove;
        } else if (direction === "left") {
            x = -(1 - progress) * maxMove;
        }
        
        track.style.transform = `translate3d(${x}px, 0, 0)`;
    });
    
    ticking = false;
}

const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateHorizontalScroll);
}

window.addEventListener("scroll", requestUpdate, { passive: true, });
window.addEventListener("resize", requestUpdate);
window.addEventListener("orientationchange", requestUpdate);

if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", requestUpdate);
}

window.addEventListener("load", requestUpdate);

updateHorizontalScroll();