const formSearch = document.querySelector('.form-search'),
    inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
    dropdownCititesFrom = formSearch.querySelector('.dropdown__cities-from'),
    inputCitiesTo = formSearch.querySelector('.input__cities-to'),
    dropdownCititesTo = formSearch.querySelector('.dropdown__cities-to'),
    inputDataDepart = formSearch.querySelector('.input__date-depart'),
    cheapestTicket = document.getElementById('cheapest-ticket'),
    otherCheapTickets = document.getElementById('other-cheap-tickets');

const citiesApi = 'http://api.travelpayouts.com/data/ru/cities.json',
    proxy = 'https://cors-anywhere.herokuapp.com/',
    TOKEN = '0b2fd82ae69de9d16f0677c10ac606fe',
    calendar = 'http://min-prices.aviasales.ru/calendar_preload';

const MAX_COUNT = 10;

let city = [];

// функции
const getData = (url, callBack) => {
    const request = new XMLHttpRequest();

    request.open('GET', url);

    request.addEventListener('readystatechange', ()=>{
        if(request.readyState !== 4) return;

        if(request.status === 200){
            callBack(request.response);
        } else {
            console.error(request.status);
        }
    });

    request.send();
};

const showCity = (input, list)=> {
    list.textContent = '';

    if(input.value === '') return;

        const filterCity = city.filter((item) => {   
            const fixItem = item.name.toLowerCase();
            return fixItem.startsWith(input.value.toLowerCase());
        });
        
        filterCity.forEach((item)=> {
            const li = document.createElement('li');
            li.classList.add('dropdown__city');
            li.textContent = item.name;
            list.append(li);
        });
};

const selectCity = (event, input, list) =>{
    const target = event.target;
    if(target.tagName.toLowerCase() === 'li'){
        input.value = target.textContent;
        list.textContent = '';
    }
};

const getNameCity = (code) => {
    const objCity = city.find((item) => item.code === code);

    return objCity.name;
};

const getDate = (date) => {
    return new Date(date).toLocaleDateString('ru', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const getChanges = (num) => {
    if(num) {
        return num === 1 ? 'С одной пересадкой' : 'С двумя пересадками';
    } else {
        return 'Без пересадок';
    }
};

const getLinkAviasales = (data) => {
    let link = 'https://www.aviasales.ru/search/';

    link += data.origin;

    const date = new Date(data.depart_date);

    const day = date.getDate();

    link += day < 10 ? '0' + day : day;

    const month = date.getMonth() + 1;

    link += month < 10 ? '0' + month : month;

    link += data.destination;

    link += '1';

    return link;
};

const createCard = (data) => {
    const ticket = document.createElement('article');
    ticket.classList.add('ticket');
    
    let deep = '';

    if(data){
        deep = `
            <h3 class="agent">${data.gate}</h3>
            <div class="ticket__wrapper">
                <div class="left-side">
                    <a href="${getLinkAviasales(data)}" target="_blank" class="button button__buy">Купить
                        за ${data.value}₽</a>
                </div>
                <div class="right-side">
                    <div class="block-left">
                        <div class="city__from">Вылет из города
                            <span class="city__name">${getNameCity(data.origin)}</span>
                        </div>
                        <div class="date">${getDate(data.depart_date)}</div>
                    </div>

                    <div class="block-right">
                        <div class="changes">${getChanges(data.number_of_changes)}</div>
                        <div class="city__to">Город назначения:
                            <span class="city__name">${getNameCity(data.destination)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else {
        deep = '<h3>К сожалению, на текущую дату билетов не нашлось!</h3>';
    }

    ticket.insertAdjacentHTML('afterbegin', deep);

    return ticket;
};

const renderCheapDay = (cheapTicket) => {
    cheapestTicket.style.display = 'block';
    cheapestTicket.innerHTML = '<h2>Самый дешевый билет на выбранную дату</h2>';

    const ticket = createCard(cheapTicket[0]);

    cheapestTicket.append(ticket);
};

const renderCheapAll = (cheapTicketAll) => {
    otherCheapTickets.style.display = 'block';
    otherCheapTickets.innerHTML = '<h2>Самые дешевые билеты на другие даты</h2>';

    cheapTicketAll.sort((a, b) => a.value - b.value);

    for (let i = 0; i < cheapTicketAll.length && i <= MAX_COUNT; i++) {
        const ticket = createCard(cheapTicketAll[0]);
        otherCheapTickets.append(ticket);
    }
};

const renderCheap = (data, date) => {
    const cheapTicket = JSON.parse(data).best_prices;

    const cheapTickeDay = cheapTicket.filter((item) => {
        return item.depart_date === date;
    });

    renderCheapDay(cheapTickeDay);
    renderCheapAll(cheapTicket);
};

// обработчики
inputCitiesFrom.addEventListener('input', () =>{
    showCity(inputCitiesFrom, dropdownCititesFrom);
});

inputCitiesTo.addEventListener('input', () =>{
    showCity(inputCitiesTo, dropdownCititesTo);
});

dropdownCititesFrom.addEventListener('click', (event) =>{
    selectCity(event, inputCitiesFrom, dropdownCititesFrom);
});

dropdownCititesTo.addEventListener('click', (event) =>{
    selectCity(event, inputCitiesTo, dropdownCititesTo);
});

formSearch.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = {
        from: city.find((item) => inputCitiesFrom.value === item.name),
        to: city.find((item) => inputCitiesTo.value === item.name),
        when: inputDataDepart.value
    };

    if(formData.from && formData.to) {
        const requestData = `?depart_date=${formData.when}&origin=${formData.from.code}&destination=${formData.to.code}&one_way=true`;

        getData(calendar + requestData, (response) => {
            renderCheap(response, formData.when);
        });

    } else {
        alert('Введите корректное название города');
    }
});

// вызоды
getData(proxy + citiesApi, (data) => {
    city = JSON.parse(data).filter(item => item.name );

    city.sort((a,b) => {
        if(a.name > b.name) {
            return 1;
        }
        if(a.name < b.name) {
            return -1;
        }
        return 0;
    });
});

