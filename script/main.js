
const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const API_KEY = '6fcb9620a842bea26304d7962404e1fe';

const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger'),
    tvShowsList = document.querySelector('.tv-shows__list'),
    modal = document.querySelector('.modal');


const DBService = class {
    getData =  async (url) => {
        const res = await fetch(url);
        if (res.ok) {
            return res.json();
        } else {
            throw new Error('Can not get data from url ${url}');
        }
    }

    getTestData = async () => {
        return this.getData('test.json');
    }
};

const renderCard = response => {
    tvShowsList.textContent = '';

    response.results.forEach(item => {
        const { 
            name: title, 
            vote_average: vote, 
            backdrop_path: backdrop, 
            poster_path: poster 
            } = item;

        const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg';
        const backdropIMG = backdrop ? ` data-backdrop="${IMG_URL + backdrop}" ` : '';
        const voteElem = vote > 0 ? `<span class="tv-card__vote">${vote}</span>` : '';

        const card = document.createElement('li');
        card.className = 'tv-shows__item';
        card.innerHTML = `
            <a href="#" class="tv-card">                
                ${voteElem}
                <img class="tv-card__img"
                    src="${posterIMG}"
                    ${backdropIMG}
                    alt="${title}">
                <h4 class="tv-card__head">${title}</h4>
            </a>
        `;
        tvShowsList.append(card);
    });
};

new DBService().getTestData().then(renderCard);

// open/shut menu

hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
});

const dropdowns = document.querySelectorAll('.dropdown');

document.addEventListener('click', event => {
    if (!event.target.closest('.left-menu')) {
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
        dropdowns.forEach((item) => item.classList.remove('active'));
    }
});

leftMenu.addEventListener('click', event => {
    const target = event.target;
    const dropdown = target.closest('.dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');    
    }
});

// open modal window
tvShowsList.addEventListener('click', event => {
    event.preventDefault();
    const target = event.target;
    const card = target.closest('.tv-card');

    if (card) {
        document.body.style.overflow = 'hidden';
        modal.classList.remove('hide');
    }
});

// shut modal window
modal.addEventListener('click', event => {

    if (event.target.closest('.cross') ||   
        event.target.classList.contains('modal')) {
        document.body.style.overflow = '';
        modal.classList.add('hide');
    }

});

// change image

const changeImage = event => {
    const card = event.target.closest('.tv-shows__item');

    if (card) {
        const img = card.querySelector('.tv-card__img');

        if (img.dataset.backdrop) {
            [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src];
        }
    }
}

tvShowsList.addEventListener('mouseover', changeImage);
tvShowsList.addEventListener('mouseout', changeImage);
