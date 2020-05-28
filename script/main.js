
const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const SERVER = 'https://api.themoviedb.org/3';
const API_KEY = '6fcb9620a842bea26304d7962404e1fe';

const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger'),
    tvShowsList = document.querySelector('.tv-shows__list'),
    modal = document.querySelector('.modal'),
    tvShows = document.querySelector('.tv-shows'),
    tvCardImg = document.querySelector('.tv-card__img'),
    modalTitle = document.querySelector('.modal__title'),
    genresList = document.querySelector('.genres-list'),
    modalLink = document.querySelector('.modal__link'),
    rating = document.querySelector('.rating'),
    description = document.querySelector('.description'),
    searchForm = document.querySelector('.search__form'),
    searchFormInput = document.querySelector('.search__form-input'),
    preloader = document.querySelector('.preloader');

const loading = document.createElement('div');
loading.className = 'loading';

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

    getTestCard = async () => {
        return this.getData('card.json');
    }

    getSearchResults = query => {
        return this.getData(SERVER + '/search/tv?api_key=' + API_KEY + 
            '&query=' + query + '&language=ru-RU&page=1&include_adult=true');
    }

    getTvShow = id => {
        return this.getData(SERVER + '/tv/' + id + 
            '?api_key=' + API_KEY + '&language=ru-RU');
    }
};

//console.log(new DBService().getSearchResults('Mother'));

const renderCard = response => {
    tvShowsList.textContent = '';

    if (response.total_results) {
        response.results.forEach(item => {
            const { 
                name: title, 
                vote_average: vote, 
                backdrop_path: backdrop, 
                poster_path: poster,
                id
                } = item;

            const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg';
            const backdropIMG = backdrop ? ` data-backdrop="${IMG_URL + backdrop}" ` : '';
            const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : '';

            const card = document.createElement('li');
            card.className = 'tv-shows__item';
            card.innerHTML = `
                <a id="${id}" href="#" class="tv-card">                
                    ${voteElem}
                    <img class="tv-card__img"
                        src="${posterIMG}"
                        ${backdropIMG}
                        alt="${title}">
                    <h4 class="tv-card__head">${title}</h4>
                </a>
            `;
            loading.remove();
            tvShowsList.append(card);
        });
    } else {
        loading.remove();
        tvShows.insertAdjacentHTML('beforeend', 'По вашему запросу сериалов не найдено');
    }
};

searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const val = searchFormInput.value.trim();
    if (val) {
        tvShows.append(loading);    
        new DBService().getSearchResults(val).then(renderCard);  
        console.log(new DBService().getSearchResults(val));  
    }
    searchFormInput.value = '';
});


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
    preloader.style.display = 'block';
    document.body.style.overflow = 'hidden';

    const target = event.target;
    const card = target.closest('.tv-card');

    if (card) {

        new DBService().getTvShow(card.id)
            .then(({ 
                poster_path: img,
                name: title,
                genres,
                homepage: link,
                vote_average: vote,
                overview
            }) => {
                
                if (img) {
                    tvCardImg.src = IMG_URL + img;
                    tvCardImg.parentNode.style.display = '';
                } else {
                    tvCardImg.parentNode.style.display = 'none';
                }
                modalTitle.textContent = title;

                if (genres.length > 0) {
                    genresList.innerHTML = genres.reduce((acc, item) => `${acc}<li>${item.name[0].toUpperCase() + item.name.substring(1)}</li>`, '');               
                    genresList.parentNode.style.display = '';
                } else {
                    genresList.parentNode.style.display = 'none';
                }

                if (link) {
                    modalLink.href = link;
                    modalLink.style.display = '';
                } else {
                    modalLink.style.display = 'none';
                }
                
                if (vote) {
                    rating.textContent = vote;
                    rating.parentNode.style.display = '';
                } else {
                    rating.parentNode.style.display = 'none';
                }
                
                if (overview.length > 0) {
                    description.textContent = overview;
                    description.closest('.header__info').style.display = '';
                } else {
                    description.closest('.header__info').style.display = 'none';
                }                
            })
            .then(() => {
                preloader.style.display = 'none';                
                modal.classList.remove('hide');      
            });
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
