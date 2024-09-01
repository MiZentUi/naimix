function render_vacancies(json) {
    let vacancies = "";
    json.forEach((item, index) => {
        vacancies += `
            <li onclick="open_vacancy(${index});">
                <h3 class="project">${item["Проект КСП Стеклозавод Орехово-Зуево"]}</h5>
                <span class="job">Должность: ${item["Должность Упаковщик/Разнорабочий"]}</span>
                <br>
                <span class="age">Возраст: ${item["Возраст от 18 до 55 (старше по согласованию)"]}</span>
                <br>
                <span class="city">Город: ${item["Город Мос.обл, г. Орехово-Зуево"]}</span>
            </li>
        `;
    });
    const html_vacancies_list = `
        <ul>
            ${vacancies}
        </ul>
    `;
    document.getElementById("vacancies").innerHTML = html_vacancies_list;
}

function render_vacancy(index) {
    let vacancy_div = document.getElementById("vacancy")
    let vacancy_div_html = `
        <div id="vacancy_card">
            <h1 id="project">${json[index]["Проект КСП Стеклозавод Орехово-Зуево"]}</h1>
            <span id="job">Город: ${json[index]["Город Мос.обл, г. Орехово-Зуево"]}</span>
            <span id="job">Общая потребность: ${json[index]["Общая потребность 8 только день"]}</span>
            <span id="job">М: ${json[index]["М "]}</span>
            <span id="job">Ж: ${json[index]["Ж "]}</span>
            <span id="job">Возраст: ${json[index]["Возраст от 18 до 55 (старше по согласованию)"]}</span>
            <span id="job">Гражданство: ${json[index]["Гражданство РФ,Кирзизия, Казахстан, РБ,"]}</span>
            <span id="job">Должность: ${json[index]["Должность Упаковщик/Разнорабочий"]}</span>
            <span id="job">Адрес: ${json[index]["Адрес Адрес объекта: МО, г. Орехово-Зуево, проезд Заготзерно, 10. Адрес общежития ДЛЯ РФ (без прописки или вр.рег. не заселят)"]}</span>
            <span id="job">График: ${json[index]["График Вахта:15/30/45/60/90/120 смен. График 6/1, 7/0, ДЕНЬ/НОЧЬ! смены с 08:00 до 20:00 или с 20:00 до 08:00. Местные - 2/2, 6/1, 7/0. ДЕНЬ/НОЧЬ! смены с 08:00 до 20:00 или с 20:00 до 08:00"]}</span>
            <span id="job">Оплата за смену ВАХТА: ${json[index]["Оплата за смену ВАХТА с 05.08.24 за смену 3500р ( СТАЖИРОВОЧНАЯ СМЕНА ОПЛАЧИВАЕТСЯ, ЕСЛИ КАНДИДАТ ОТРАБАТЫВАЕТ МИНИМУМ 6 СМЕН)"]}</span>
            <span id="job">Оплата за смену МЕСТНЫЕ: ${json[index]["Оплата за смену МЕСТНЫЕ С 05.08.24 за смену 3500р СТАЖИРОВОЧНАЯ СМЕНА ОПЛАЧИВАЕТСЯ, ЕСЛИ КАНДИДАТ ОТРАБАТЫВАЕТ МИНИМУМ 6 СМЕН)"]}</span>
            <span id="job">Частота выплат: ${json[index]["Частота выплат Еженедельная без отсрочки"]}</span>
        </div>
    `
    vacancy_div.innerHTML = vacancy_div_html;
}

function open_vacancy(vacancy_index) {
    let main = document.getElementById("main");
    let vacancy_div = document.getElementById("vacancy")
    main.style.display = "none";
    render_vacancy(vacancy_index);
    vacancy_div.style.display = "block";
    window.Telegram.WebApp.BackButton.show();
    window.Telegram.WebApp.BackButton.onClick(back_to_main);
}

function back_to_main() {
    let main = document.getElementById("main");
    let vacancy_div = document.getElementById("vacancy")
    main.style.display = "block";
    vacancy_div.style.display = "none";
    window.Telegram.WebApp.BackButton.hide();
}

window.onload = () => {
    const parser = new PublicGoogleSheetsParser('16xDhs8r3eNPia1ByrI4dbNxqwrXyymhalXvB8NmrnLs', {"useFormat": true});
    parser.parse().then((data) => {json = data; render_vacancies(data)});
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