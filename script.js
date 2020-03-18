const formSearch = document.querySelector('.form-search'),
    inputCitiesFrom = document.querySelector('.input__cities-from'),
    dropdownCititesFrom = document.querySelector('.dropdown__cities-from'),
    inputCitiesTo = document.querySelector('.input__cities-to'),
    dropdownCititesTo = document.querySelector('.dropdown__cities-to');

const citiesApi = 'dataBase/airports.json',
    proxy = 'https://cors-anywhere.herokuapp.com/',
    TOKEN = '0b2fd82ae69de9d16f0677c10ac606fe',
    calendar = 'http://min-prices.aviasales.ru/calendar_preload';

let city = [];

// функции

const getData = (url, callBack)=> {
    const request = new XMLHttpRequest();

    request.open('GET', url);

    request.addEventListener('readystatechange', ()=>{
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
}

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

// вызоды

getData(citiesApi, (data) => {
    city = JSON.parse(data).filter(item => item.name );
});