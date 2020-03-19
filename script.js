const formSearch = document.querySelector('.form-search'),
    inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
    dropdownCititesFrom = formSearch.querySelector('.dropdown__cities-from'),
    inputCitiesTo = formSearch.querySelector('.input__cities-to'),
    dropdownCititesTo = formSearch.querySelector('.dropdown__cities-to'),
    inputDataDepart = formSearch.querySelector('.input__date-depart');

const citiesApi = 'http://api.travelpayouts.com/data/ru/cities.json',
    proxy = 'https://cors-anywhere.herokuapp.com/',
    TOKEN = '0b2fd82ae69de9d16f0677c10ac606fe',
    calendar = 'http://min-prices.aviasales.ru/calendar_preload';

let city = [];

// функции
const getData = (url, callBack)=> {
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
}

const showCity = (input, list)=> {
    list.textContent = '';

    if(input.value === '') return;

        const filterCity = city.filter((item) => {   
            const fixItem = item.name.toLowerCase();
            return fixItem.includes(input.value.toLowerCase());
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

const renderCheapDay = (cheapTicket) => {

};

const renderCheapAll = (cheapTicketAll) => {

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

dropdownCititesFrom.addEventListener('click', (event)=>{
    selectCity(event, inputCitiesFrom, dropdownCititesFrom);
});

dropdownCititesTo.addEventListener('click', (event)=>{
    selectCity(event, inputCitiesTo, dropdownCititesTo);
});

formSearch.addEventListener('submit', (event)=> {
    event.preventDefault();

    const formData = {
        from: city.find((item) => inputCitiesFrom.value === item.name).code,
        to: city.find((item) => inputCitiesTo.value === item.name).code,
        when: inputDataDepart.value
    };

    const requestData = `?depart_date=${formData.when}&origin=${formData.from}&destination=${formData.to}&one_way=true`;

    getData(calendar + requestData, (response) => {
        renderCheap(response, formData.when);
    });
});

// вызоды
getData(proxy + citiesApi, (data) => {
    city = JSON.parse(data).filter(item => item.name );
});

