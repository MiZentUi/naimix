const parser = new PublicGoogleSheetsParser('16xDhs8r3eNPia1ByrI4dbNxqwrXyymhalXvB8NmrnLs', {"useFormat": true});
parser.parse().then((data) => {json = data; render_vacancies(data)});

function render_vacancies(json) {
    let vacancies = "";
    json.forEach((item, index) => {
        vacancies += `
            <li onclick="open_vacancy(${index});">
                <h3 class="project">${item["Проект КСП Стеклозавод Орехово-Зуево"]}</h5>
                <span class="job">Должность</b>: ${item["Должность Упаковщик/Разнорабочий"]}</span>
                <br>
                <span class="age">Возраст</b>: ${item["Возраст от 18 до 55 (старше по согласованию)"]}</span>
                <br>
                <span class="city">Город</b>: ${item["Город Мос.обл, г. Орехово-Зуево"]}</span>
            </li>
        <br>`;
    });
    const html_vacancies_list = `
        <ul>
            ${vacancies}
        </ul>
    <br>`;
    document.getElementById("vacancies").innerHTML = html_vacancies_list;
}

function render_vacancy(index) {
    let vacancy_div = document.getElementById("vacancy")
    let vacancy_div_html = `
        <div id="vacancy_card">
            <h1 id="project">${json[index]["Проект КСП Стеклозавод Орехово-Зуево"]}</h1>`;
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
    vacancy_div_html += `</div>`;
    vacancy_div.innerHTML = vacancy_div_html;
}

function open_vacancy(vacancy_index) {
    let main = document.getElementById("main");
    let vacancy_div = document.getElementById("vacancy")
    main.style.display = "none";
    render_vacancy(vacancy_index);
    vacancy_div.style.display = "block";
    window.Telegram.WebApp.BackButton.show();
    window.Telegram.WebApp.MainButton.text = "Оставить заявку";
    window.Telegram.WebApp.MainButton.color = "#ff5e00";
    window.Telegram.WebApp.MainButton.show();
    window.Telegram.WebApp.BackButton.onClick(back_to_main);
}

function back_to_main() {
    let main = document.getElementById("main");
    let vacancy_div = document.getElementById("vacancy")
    main.style.display = "block";
    vacancy_div.style.display = "none";
    window.Telegram.WebApp.BackButton.hide();
    window.Telegram.WebApp.MainButton.hide();
}

window.onload = () => {
    let filter = document.getElementById("filter");
    let navigation = document.getElementById("navigation")
    document.getElementById("filter_button").addEventListener("click", () => {
        console.log(filter.style.display)
        if (filter.style.display == "none" || filter.style.display == "") {
            filter.style.display = "block";
            navigation.style.marginBottom = "20px";
        } else {
            filter.style.display = "none";
            navigation.style.marginBottom = "70px";
        }
    });
}