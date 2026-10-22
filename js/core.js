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


const rouletteSection = document.querySelector(".roulette-section");
const afterRoulette = document.querySelector(".after-roulette");

if (rouletteSection) {
    const cells = rouletteSection.querySelectorAll(".roulette-cell");
    const button = rouletteSection.querySelector(".roulette-button");
    const result = rouletteSection.querySelector(".roulette-result");

    const companies = [
        { name: "Tjecco", color: "#08e8de" },
        { name: "Eudres", color: "#930f51" },
        { name: "Timemate", color: "#1e79f0" }
    ];

    const winner = companies[2];
    let spinning = false;
    let rouletteStarted = false;
    let touchStartY = 0;
    
    const preventScroll = (event) => {
        if (rouletteStarted) return;
        
        const rect = rouletteSection.getBoundingClientRect();
        const scrollingDown = event.type === "wheel" ? event.deltaY > 0 : touchStartY > event.touches[0].clientY;

        if (scrollingDown && rect.top < 1 && rect.bottom > window.innerHeight) {
            event.preventDefault();
        }
    }

    window.addEventListener("wheel", preventScroll, { passive: false });

    window.addEventListener("touchstart", event => {
        touchStartY = event.touches[0].clientY;
    }, { passive: true });

    window.addEventListener("touchmove", preventScroll, { passive: false });

    const showCompany = (cell, company) => {
        cell.textContent = company.name;
        cell.style.backgroundColor = company.color;
        cell.style.color = "#fff";
    }

    button.addEventListener("click", () => {
        rouletteStarted = true;

        if (spinning) return;

        spinning = true;
        button.disabled = true;
        result.textContent = "";

        cells.forEach((cell, index) => {
            const interval = setInterval(() => {
                showCompany(
                    cell,
                    companies[Math.floor(Math.random() * companies.length)]
                );
            }, 100);

            setTimeout(() => {
                clearInterval(interval);
                showCompany(cell, winner);

                if (index === cells.length - 1) {
                    spinning = false;
                    button.disabled = false;
                    afterRoulette.classList.add("is-visible");
                }
            }, 1500 + index * 650);
        });
    });
}
