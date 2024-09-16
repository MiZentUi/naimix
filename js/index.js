const parser = new PublicGoogleSheetsParser('16xDhs8r3eNPia1ByrI4dbNxqwrXyymhalXvB8NmrnLs', {"useFormat": true});
parser.parse().then((data) => {json = data; render_vacancies(data)});
let fields = {"cities": {}, "jobs": {}, "housings": {}, "nutritions": {}, "payments": {}, "pay_rates": {}}

function render_vacancies(json) {
    let vacancies = "", cities_items = "", pay_rates_items = "", jobs_items = "";
    json.forEach((item, index) => {
        let city = item["Город Мос.обл, г. Орехово-Зуево"]
        let job = item["Должность Упаковщик/Разнорабочий"]
        let pay_rate = item["Частота выплат Еженедельно без отсрочки"]
        if (pay_rate != undefined) {
            if (!fields["pay_rates"].hasOwnProperty(pay_rate)) fields["pay_rates"][pay_rate] = [];
            fields["pay_rates"][pay_rate].push(index);
        }
        if (!fields["cities"].hasOwnProperty(city)) fields["cities"][city] = [];
        if (!fields["jobs"].hasOwnProperty(job)) fields["jobs"][job] = [];
        fields["cities"][city].push(index);
        fields["jobs"][job].push(index);
        vacancies += `
            <li onclick="open_vacancy(${index});">
                <div class="name"><h3 class="project">${item["Проект КСП Стеклозавод Орехово-Зуево"]}</h5></div>
                <div class="description">
                    <span class="job">Должность</b>: ${job}</span>
                    <br>
                    <span class="age">Возраст</b>: ${item["Возраст от 18 до 55 (старше по согласованию)"]}</span>
                    <br>
                    <span class="city">Город</b>: ${city}</span>
                </div>
            </li>
        <br>`;
    });
    const html_vacancies_list = `
        <ul>
            ${vacancies}
        </ul>
    <br>`;
    for (let i in fields["cities"]) {
        if (i != undefined) cities_items += `
            <li class="filter_item" onclick="filter_item_click(this);"><p>${i}</p></li>
        `;
    }
    for (let i in fields["jobs"]) {
        if (i != undefined) jobs_items += `
            <li class="filter_item" onclick="filter_item_click(this);"><p>${i}</p></li>
        `;
    }
    for (let i in fields["pay_rates"]) {
        if (i != undefined) pay_rates_items += `
            <li class="filter_item" onclick="filter_item_click(this);"><p>${i}</p></li>
        `;
    }
    document.getElementById("cities").innerHTML = cities_items;
    document.getElementById("jobs").innerHTML = jobs_items;
    document.getElementById("pay_rates").innerHTML = pay_rates_items;
    document.getElementById("vacancies").innerHTML = html_vacancies_list;
}

function render_vacancy(index) {
    let vacancy_div = document.getElementById("vacancy")
    let vacancy_div_html = `
        <div id="vacancy_card">
            <div class="name"><h1 id="project">${json[index]["Проект КСП Стеклозавод Орехово-Зуево"]}</h1></div><div class="description">`;
    if (json[index]["Город Мос.обл, г. Орехово-Зуево"] != undefined) vacancy_div_html += `<span><b>Город</b>: ${json[index]["Город Мос.обл, г. Орехово-Зуево"]}</span><br>`;
    if (json[index]["Общая потребность 8 только день"] != undefined) vacancy_div_html += `<span><b>Общая потребность</b>: ${json[index]["Общая потребность 8 только день"]}</span><br>`;
    if (json[index]["М "] != undefined) vacancy_div_html += `<span><b>М</b>: ${json[index]["М "]}</span><br>`;
    if (json[index]["Ж "] != undefined) vacancy_div_html += `<span><b>Ж</b>: ${json[index]["Ж "]}</span><br>`;
    if (json[index]["Возраст от 18 до 55 (старше по согласованию)"] != undefined) vacancy_div_html += `<span><b>Возраст</b>: ${json[index]["Возраст от 18 до 55 (старше по согласованию)"]}</span><br>`;
    if (json[index]["Гражданство РФ,Кирзизия, Казахстан, РБ,"] != undefined) vacancy_div_html += `<span><b>Гражданство</b>: ${json[index]["Гражданство РФ,Кирзизия, Казахстан, РБ,"]}</span><br>`;
    if (json[index]["Должность Упаковщик/Разнорабочий"] != undefined) vacancy_div_html += `<span><b>Должность</b>: ${json[index]["Должность Упаковщик/Разнорабочий"]}</span><br>`;
    if (json[index]["Адрес Адрес объекта: МО, г. Орехово-Зуево, проезд Заготзерно, 10. Адрес общежития ДЛЯ РФ (без прописки или вр.рег. не заселят)"] != undefined) vacancy_div_html += `<span><b>Адрес</b>: ${json[index]["Адрес Адрес объекта: МО, г. Орехово-Зуево, проезд Заготзерно, 10. Адрес общежития ДЛЯ РФ (без прописки или вр.рег. не заселят)"]}</span><br>`;
    if (json[index]["График Вахта:15/30/45/60/90/120 смен. График 6/1, 7/0, ДЕНЬ/НОЧЬ! смены с 08:00 до 20:00 или с 20:00 до 08:00. Местные - 2/2, 6/1, 7/0. ДЕНЬ/НОЧЬ! смены с 08:00 до 20:00 или с 20:00 до 08:00"] != undefined) vacancy_div_html += `<span><b>График</b>: ${json[index]["График Вахта:15/30/45/60/90/120 смен. График 6/1, 7/0, ДЕНЬ/НОЧЬ! смены с 08:00 до 20:00 или с 20:00 до 08:00. Местные - 2/2, 6/1, 7/0. ДЕНЬ/НОЧЬ! смены с 08:00 до 20:00 или с 20:00 до 08:00"]}</span><br>`;
    if (json[index]["Оплата за смену ВАХТА с 05.08.24 за смену 3500р ( СТАЖИРОВОЧНАЯ СМЕНА ОПЛАЧИВАЕТСЯ, ЕСЛИ КАНДИДАТ ОТРАБАТЫВАЕТ МИНИМУМ 6 СМЕН)"] != undefined) vacancy_div_html += `<span><b>Оплата за смену ВАХТА</b>: ${json[index]["Оплата за смену ВАХТА с 05.08.24 за смену 3500р ( СТАЖИРОВОЧНАЯ СМЕНА ОПЛАЧИВАЕТСЯ, ЕСЛИ КАНДИДАТ ОТРАБАТЫВАЕТ МИНИМУМ 6 СМЕН)"]}</span><br>`;
    if (json[index]["Оплата за смену МЕСТНЫЕ С 05.08.24 за смену 3500р СТАЖИРОВОЧНАЯ СМЕНА ОПЛАЧИВАЕТСЯ, ЕСЛИ КАНДИДАТ ОТРАБАТЫВАЕТ МИНИМУМ 6 СМЕН)"] != undefined) vacancy_div_html += `<span><b>Оплата за смену МЕСТНЫЕ</b>: ${json[index]["Оплата за смену МЕСТНЫЕ С 05.08.24 за смену 3500р СТАЖИРОВОЧНАЯ СМЕНА ОПЛАЧИВАЕТСЯ, ЕСЛИ КАНДИДАТ ОТРАБАТЫВАЕТ МИНИМУМ 6 СМЕН)"]}</span><br>`;
    if (json[index]["Частота выплат Еженедельная без отсрочки"] != undefined) vacancy_div_html += `<span><b>Частота выплат</b>: ${json[index]["Частота выплат Еженедельная без отсрочки"]}</span><br>`;
    vacancy_div_html = vacancy_div_html.substring(0, vacancy_div_html.length - 1 - 4);
    vacancy_div_html += `</divs></div>`;
    vacancy_div.innerHTML = vacancy_div_html;
}

function open_vacancy(vacancy_index) {
    let main = document.getElementById("main");
    let vacancy_div = document.getElementById("vacancy")
    main.style.display = "none";
    render_vacancy(vacancy_index);
    vacancy_div.style.display = "block";
    window.Telegram.WebApp.BackButton.onClick(back_to_main);
    window.Telegram.WebApp.BackButton.show();
    window.Telegram.WebApp.MainButton.text = "Оставить заявку";
    window.Telegram.WebApp.MainButton.color = "#ff5e00";
    window.Telegram.WebApp.MainButton.onClick(open_request);
    window.Telegram.WebApp.MainButton.show();
}

function back_to_main() {
    let main = document.getElementById("main");
    let vacancy_div = document.getElementById("vacancy")
    main.style.display = "block";
    vacancy_div.style.display = "none";
    document.getElementById("request").style.display = "none";
    window.Telegram.WebApp.BackButton.hide();
    window.Telegram.WebApp.MainButton.hide();
}

function open_request() {
    let request = document.getElementById("request");
    request.style.display = "block";
    window.Telegram.WebApp.MainButton.text = "Отправить";
}

function filter_click(event, ul_id) {
    let ul = document.getElementById(ul_id);
    let arrow = event.currentTarget.getElementsByTagName("span")[0]
    if (ul.style.display == "none" || ul.style.display == "") {
        ul.style.display = "block";
        arrow.style.transform = "rotate(90deg)";
        arrow.style.transition = "transform 0.5s";
    } else {
        ul.style.display = "none";
        arrow.style.transform = "rotate(0)";
        arrow.style.transition = "transform 0.5s";
    }
}

function filter_item_click(item) {
    console.log(item);
}

window.onload = () => {
    let filter = document.getElementById("filter");
    let navigation = document.getElementById("navigation")
    let filter_arrow_span = document.getElementById("filter_arrow").getElementsByTagName("span")[0];
    document.getElementById("filter_button").addEventListener("click", () => {
        if (filter.style.display == "none" || filter.style.display == "") {
            filter.style.display = "block";
            filter.style.position = "relative";
            filter_arrow_span.style.transform = "rotate(90deg)";
            filter_arrow_span.style.transition = "transform 0.5s";
        } else {
            filter.style.display = "none";
            filter.style.position = "absolute";
            filter_arrow_span.style.transform = "rotate(0)";
            filter_arrow_span.style.transition = "transform 0.5s";
        }
    });
    document.getElementById("job").addEventListener("click", event => filter_click(event, "jobs"));
    document.getElementById("city").addEventListener("click", event => filter_click(event, "cities"));
    document.getElementById("pay_rate").addEventListener("click", event => filter_click(event, "pay_rates"));
    document.getElementById("payment").addEventListener("click", (event) => {
        let payment_from = document.getElementById("payment_from");
        let arrow = event.currentTarget.getElementsByTagName("span")[0];
        if (payment_from.style.display == "none" || payment_from.style.display == "") {
            payment_from.style.display = "flex";
            arrow.style.transform = "rotate(90deg)";
            arrow.style.transition = "transform 0.5s";
        } else {
            payment_from.style.display = "none";
            arrow.style.transform = "rotate(0)";
            arrow.style.transition = "transform 0.5s";
        }
    });
}