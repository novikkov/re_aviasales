const formSearch = document.querySelector('.form-search'),
    inputCitiesFrom = document.querySelector('.input__cities-from'),
    dropdownCititesFrom = document.querySelector('.dropdown__cities-from'),
    inputCitiesTo = document.querySelector('.input__cities-to'),
    dropdownCititesTo = document.querySelector('.dropdown__cities-to');

const city = ['Москва', 'Санкт-Петербург', 'Минск', 'Караганда', 'Челябинск', 'Керч',
    'Волгоград', 'Самара', 'Днепропетровск', 'Екатеринбург', 'Одесса', 'Ухань', 'Шымкен',
    'Нижний Новгород', 'Калининград', 'Ростов-на-Дону'];

const showCity = (input, list)=> {
    list.textContent = '';

    if(input.value === '') return;

        const filterCity = city.filter((item) => {
            const fixItem = item.toLowerCase();
            return fixItem.includes(input.value.toLowerCase());
        });
        
        filterCity.forEach((item)=> {
            const li = document.createElement('li');
            li.classList.add('dropdown__city');
            li.textContent = item;
            list.append(li);
        });
};

inputCitiesFrom.addEventListener('input', () =>{
    showCity(inputCitiesFrom, dropdownCititesFrom);
});

inputCitiesTo.addEventListener('input', () =>{
    showCity(inputCitiesTo, dropdownCititesTo);
});

dropdownCititesFrom.addEventListener('click', (event)=>{
    const target = event.target;
    if(target.tagName.toLowerCase() === 'li'){
        inputCitiesFrom.value = target.textContent;
        dropdownCititesFrom.textContent = '';
    }
});

dropdownCititesTo.addEventListener('click', (event)=>{
    const target = event.target;
    if(target.tagName.toLowerCase() === 'li'){
        inputCitiesTo.value = target.textContent;
        dropdownCititesTo.textContent = '';
    }
});