function render_vacancies(json) {
    let vacancies = "";
    json.forEach((item, index) => {
        vacancies += `
            <li onclick="open_vacancy(${index});">
                <span class="city">Город: ${item["Город Мос.обл, г. Орехово-Зуево"]}</span>
                <br>
                <span class="job">Должность: ${item["Должность Упаковщик/Разнорабочий"]}</span>
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
        <h1 id="project">${json[index]["Проект КСП Стеклозавод Орехово-Зуево"]}</h1>
        <h2 id="job">Должность: ${json[index]["Должность Упаковщик/Разнорабочий"]}</h2>
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