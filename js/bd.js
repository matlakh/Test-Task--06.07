document.addEventListener('DOMContentLoaded', function(event) {

    document.querySelector('.form__countries')
        .addEventListener('change', function(event) {
            read_text_file("../bd.json", on_сhange_value_countries);
        });

    document.querySelector('.form__visa')
        .addEventListener('change', function(event) {
            calculate_price();
        });

    document.querySelector('.form__try')
        .addEventListener('change', function(event) {
            calculate_price();
        });

    document.querySelector('.form__timespent')
        .addEventListener('change', function(event) {
            calculate_price();
        });

    read_text_file("../bd.json", fill_value_from_response);
})

function read_text_file(file, callback) {

    let rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json")
    rawFile.crossDomain = true;;
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.response);
        }
    }
    rawFile.send(null);
}

function fill_value_from_response(jsonObject) {
    let data = JSON.parse(jsonObject);

    fill_countries(data['countries']);
    fill_visa(data['types']);
    fill_arrivals(data['try']);
    fill_timespent(data['timespent']);
    calculate_price();
}

function on_сhange_value_countries(jsonObject) {

    let data = JSON.parse(jsonObject);
    fill_arrivals(data['try']);
    fill_timespent(data['timespent']);
    calculate_price();
}

function create_option(arrayObj, selectObj) {
    selectObj.innerHTML = null;

    arrayObj.forEach(element => {
        let option = document.createElement('option');
        option.value = element.price;
        option.innerHTML = element.name;
        option.price = element.price;

        selectObj.add(option);
    });
}

function create_option_with_addiction(arrayObj, selectObj, relative) {
    selectObj.innerHTML = null;
    arrayObj.forEach(element => {
        if (element.relative == relative) {
            let option = document.createElement('option');
            option.value = element.price;
            option.innerHTML = element.name;
            option.price = element.price;
            selectObj.add(option);
        }
    })
}

function fill_countries(arrayCountries) {
    let selectCountries = document.querySelector('.form__countries');

    arrayCountries.forEach(element => {
        let option = document.createElement('option');
        option.value = element.id;
        option.innerHTML = element.name;
        selectCountries.add(option);
    });
}

function fill_visa(arrayTypes) {
    let selectVisa = document.querySelector('.form__visa');
    create_option(arrayTypes, selectVisa);
}

function fill_arrivals(arrayTry) {
    let selectCountries = document.querySelector('.form__countries');
    let selectTry = document.querySelector('.form__try');
    let valueCountries = selectCountries.value;

    create_option_with_addiction(arrayTry, selectTry, valueCountries);
}


function fill_timespent(arrayTimespent) {
    let selectTimespent = document.querySelector('.form__timespent');
    let selectCountries = document.querySelector('.form__countries');
    let valueCountries = selectCountries.value;

    create_option_with_addiction(arrayTimespent, selectTimespent, valueCountries);
}

function custom_parse_number(stringValue) {

    stringValue = stringValue.trim();
    var result = stringValue.replace(/[^0-9]/g, '');
    if (/[,\.]\d{2}$/.test(stringValue)) {
        result = result.replace(/(\d{2})$/, '.$1');
    } else if (/[,\.]\d{1}$/.test(stringValue)) {
        result = result.replace(/(\d{1})$/, '.$1');
    }

    return parseFloat(result);
}

function calculate_price() {

    var convert = new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'EUR' })

    let selectTry = document.querySelector('.form__try').value;
    let selectVisa = document.querySelector('.form__visa').value;
    let selectTimespent = document.querySelector('.form__timespent').value;
    let priceValue = document.querySelector('.cost__value');
    priceValue.innerHTML = null;

    let priceElement = custom_parse_number(selectTry) + custom_parse_number(selectVisa) + custom_parse_number(selectTimespent);
    priceValue.innerHTML = convert.format(priceElement);
}