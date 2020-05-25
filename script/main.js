// menu 

const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');

// open/shut menu

hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
});

const dropdowns = document.querySelectorAll('.dropdown');

document.addEventListener('click', (event) => {
    if (!event.target.closest('.left-menu')) {
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
        dropdowns.forEach((item) => item.classList.remove('active'));
    }
});

leftMenu.addEventListener('click', (event) => {
    const target = event.target;
    const dropdown = target.closest('.dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');    
    }
});

const tvCardImgs = document.querySelectorAll('.tv-card__img');

tvCardImgs.forEach((item) => {
    item.addEventListener('mouseover', (event) => {
        const target = event.target;
        if (target) {
            const backdropSrc = target.dataset.backdrop;
            if (backdropSrc) {
                target.dataset.backdrop = target.src;        
                target.src = backdropSrc;
            }            
        }        
     });

     item.addEventListener('mouseleave', (event) => {
        const target = event.target;
        if (target) {
            const originSrc = target.dataset.backdrop;
            if (originSrc) {
                target.dataset.backdrop = target.src;       
                target.src = originSrc;
            }            
        }        
     });
});