// fetch("/get_tt").then(r =>  r.json().then(data => (new PublicGoogleSheetsParser(data["table"], {"useFormat": true}).parse().then((data) => {json = data; render_vacancies(data)}))))
(new PublicGoogleSheetsParser("16xDhs8r3eNPia1ByrI4dbNxqwrXyymhalXvB8NmrnLs", {"useFormat": true}).parse().then((data) => {json = data; render_vacancies(data)}))
let fields = {"cities": {}, "jobs": {}, "housings": {}, "nutritions": {}, "payments": {}, "pay_rates": {}}
let filter_set = {"cities": new Set(), "jobs": new Set(), "housings": new Set(), "nutritions": new Set(), "payments": new Set(), "pay_rates": new Set()}

function render_vacancies(json) {
    let vacancies = "", cities_items = "", pay_rates_items = "", jobs_items = "";
    json.forEach((item, index) => {
        let city = item["Город"]
        let job = item["Должность"]
        let pay_rate = item["Частота выплат"]
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
                <div class="name"><h3 class="project">${item["Проект"]}</h5></div>
                <div class="description">
                    <div><span class="header">Должность</span><span>${job}</span></div>
                    <div><span class="header">Возраст</span><span>${item["Возраст"]}</span></div>
                    <div><span class="header">Город</span><span>${city}</span></div>
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
            <li class="filter_item" data="cities" onclick="filter_item_click(this);"><p>${i}</p><span class="material-symbols-rounded">check_box_outline_blank</span></li>
        `;
    }
    for (let i in fields["jobs"]) {
        if (i != undefined) jobs_items += `
            <li class="filter_item" data="jobs" onclick="filter_item_click(this);"><p>${i}</p><span class="material-symbols-rounded">check_box_outline_blank</span></li>
        `;
    }
    for (let i in fields["pay_rates"]) {
        if (i != undefined) pay_rates_items += `
            <li class="filter_item" data="pay_rates" onclick="filter_item_click(this);"><p>${i}</p><span class="material-symbols-rounded">check_box_outline_blank</span></li>
        `;
    }
    document.getElementById("cities").innerHTML = cities_items;
    document.getElementById("jobs").innerHTML = jobs_items;
    document.getElementById("pay_rates").innerHTML = pay_rates_items;
    // document.getElementById("vacancies").innerHTML = html_vacancies_list;
}

function render_vacancy(index) {
    let vacancy_div = document.getElementById("vacancy")
    let vacancy_div_html = `<div id="vacancy_card"><div class="name"><h1 id="project">${json[index]["Проект"]}</h1></div><div class="description">`;
    if (json[index]["Должность"] != undefined) vacancy_div_html += `<div><span class="header">Должность</span><span>${json[index]["Должность"]}</span></div>`;
    if (json[index]["Город"] != undefined) vacancy_div_html += `<div><span class="header">Город</span><span>${json[index]["Город"]}</span></div>`;
    if (json[index]["Адрес"] != undefined) vacancy_div_html += `<div><span class="header">Адрес</span><span>${json[index]["Адрес"]}</span></div>`;
    // if (json[index]["Общая потребность 8 только день"] != undefined) vacancy_div_html += `<span>Общая потребность</b>: ${json[index]["Общая потребность 8 только день"]}</span></div>`;
    if (json[index]["Возраст"] != undefined) vacancy_div_html += `<div><span class="header">Возраст</span><span>${json[index]["Возраст"]}</span></div>`;
    if (json[index]["Гражданство"] != undefined) vacancy_div_html += `<div><span class="header">Гражданство</span><span>${json[index]["Гражданство"]}</span></div>`;
    if (json[index]["График"] != undefined) vacancy_div_html += `<div><span class="header">График</span><span>${json[index]["График"]}</span></div>`;
    if (json[index]["Частота выплат"] != undefined) vacancy_div_html += `<div><span class="header">Частота выплат</span><span>${json[index]["Частота выплат"]}</span></div>`;
    if (json[index]["Оплата за смену ВАХТА"] != undefined) vacancy_div_html += `<div><span class="header">Оплата за смену ВАХТА</span><span>${json[index]["Оплата за смену ВАХТА"]}</span></div>`;
    if (json[index]["Оплата за смену МЕСТНЫЕ"] != undefined) vacancy_div_html += `<div><span class="header">Оплата за смену МЕСТНЫЕ</span><span>${json[index]["Оплата за смену МЕСТНЫЕ"]}</span></div>`;
    vacancy_div_html += `</div></div>`;
    vacancy_div.innerHTML = vacancy_div_html;
}

function open_vacancy(vacancy_index) {
    let main = document.getElementById("main");
    let vacancy_div = document.getElementById("vacancy")
    main.style.display = "none";
    document.getElementById("menu").style.display = "none";
    render_vacancy(vacancy_index);
    vacancy_div.style.display = "block";
    window.scrollTo(0, 0);
    window.Telegram.WebApp.BackButton.onClick(back_to_main);
    window.Telegram.WebApp.BackButton.show();
    window.Telegram.WebApp.MainButton.text = "Откликнуться";
    window.Telegram.WebApp.MainButton.color = "#ff5e00";
    window.Telegram.WebApp.MainButton.onClick(open_request);
    window.Telegram.WebApp.MainButton.show();
}

function back_to_main() {
    let main = document.getElementById("main");
    let vacancy_div = document.getElementById("vacancy")
    main.style.display = "block";
    vacancy_div.style.display = "none";
    window.scrollTo(0, 0);
    document.getElementById("contacts").style.display = "none";
    document.getElementById("support").style.display = "none";
    document.getElementById("request").style.display = "none";
    document.getElementById("menu").style.display = "flex";
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
        [...document.getElementsByClassName("item")].forEach((item) => {
            let arrow = item.getElementsByTagName("span")[0];
            arrow.style.transform = "rotate(0)";
            arrow.style.transition = "transform 0.5s";
        });
        [...document.getElementById("filter").getElementsByTagName("ul")].forEach((item) => {
            item.style.display = "none";
        });
        document.getElementById("payment_from").style.display = "none";
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
    if (!item.className.includes("active")) {
        [...item.parentNode.getElementsByClassName("filter_item")].forEach((i) => {
            filter_set[i.getAttribute("data")].delete(i.getElementsByTagName("p")[0].innerText);
            i.className = i.className.split(" ")[0];
            if (i.getAttribute("data") == "housings") i.getElementsByTagName("span")[0].innerText = "radio_button_unchecked";
            else i.getElementsByTagName("span")[0].innerText = "check_box_outline_blank";
            i.getElementsByTagName("p")[0].style.color = "black";
            i.getElementsByTagName("span")[0].style.color = "black";
        });
        filter_set[item.getAttribute("data")].add(item.getElementsByTagName("p")[0].innerText);
        if (item.getAttribute("data") != "housings") {
            item.getElementsByTagName("span")[0].innerText = "select_check_box";
        } else item.getElementsByTagName("span")[0].innerText = "radio_button_checked";
        item.className += " active";
        item.getElementsByTagName("p")[0].style.color = "#FE5E00";
        item.getElementsByTagName("span")[0].style.color = "#FE5E00";
    } else {
        filter_set[item.getAttribute("data")].delete(item.getElementsByTagName("p")[0].innerText);
        item.className = item.className.split(" ")[0];
        if (item.getAttribute("data") == "housings") item.getElementsByTagName("span")[0].innerText = "radio_button_unchecked";
        else item.getElementsByTagName("span")[0].innerText = "check_box_outline_blank";
        item.getElementsByTagName("p")[0].style.color = "black";
        item.getElementsByTagName("span")[0].style.color = "black";
    }   
    filter_vacancies();
}

function render_filter(indexes) {
    let vacancies = "";
    indexes.forEach((index) => {
        let city = json[index]["Город"]
        let job = json[index]["Должность"]
        vacancies += `
            <li onclick="open_vacancy(${index});">
                <div class="name"><h3 class="project">${json[index]["Проект"]}</h5></div>
                <div class="description">
                    <div><span class="header">Должность</span><span>${job}</span></div>
                    <div><span class="header">Возраст</span><span>${json[index]["Возраст"]}</span></div>
                    <div><span class="header">Город</span><span>${city}</span></div>
                    <div><span class="header">Оплата за смену ВАХТА</span><span>${json[index]["Оплата за смену ВАХТА"]}</span></div>
                    <div><span class="header">Оплата за смену МЕСТНЫЕ</span><span>${json[index]["Оплата за смену МЕСТНЫЕ"]}</span></div>
                </div>
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

function filter_vacancies() {
    let filtered_indexes = new Set();
    for (let i in filter_set) {
        filter_set[i].forEach((j) => {
            if (filtered_indexes.size == 0) {
                for (let k in fields[i][j]) {
                    let min_price = Infinity;
                    try { JSON.stringify(json[fields[i][j][k]]["Оплата за смену ВАХТА"]).match(/[0-9 ]+/g).forEach((item) => {if (item.replaceAll(" ", "").length > 2 && parseInt(item.replaceAll(" ", "")) < min_price) min_price = parseInt(item.replaceAll(" ", ""));}); } catch (e) {}
                    try { JSON.stringify(json[fields[i][j][k]]["Оплата за смену МЕСТНЫЕ"]).match(/[0-9 ]+/g).forEach((item) => {if (item.replaceAll(" ", "").length > 2 && parseInt(item.replaceAll(" ", "")) < min_price) min_price = parseInt(item.replaceAll(" ", ""));}); } catch (e) {}
                    let address = JSON.stringify(json[fields[i][j][k]]["Адрес"]).toLowerCase();
                    let housing = address.includes("общ") || address.includes("кварт") || address.includes("засел");
                    if (min_price > parseInt(document.getElementById("payment_from").getElementsByTagName("input")[0].value) || !parseInt(document.getElementById("payment_from").getElementsByTagName("input")[0].value)) {
                        try {
                            if (document.getElementById("housings").getElementsByClassName("active")[0].getElementsByTagName("p")[0].innerText.toLowerCase() == "да" && housing) filtered_indexes.add(fields[i][j][k]);
                            else if (document.getElementById("housings").getElementsByClassName("active")[0].getElementsByTagName("p")[0].innerText.toLowerCase() == "нет" && !housing) filtered_indexes.add(fields[i][j][k]);
                        } catch (e) { filtered_indexes.add(fields[i][j][k]); } 
                    }
                }
            } else {
                filtered_indexes.forEach((index) => {
                    try { if (!fields[i][j].includes(index)) filtered_indexes.delete(index); } catch (e) {}
                });
            }
        })
    }
    render_filter(filtered_indexes);
}

window.onload = () => {
    document.getElementsByTagName("p")[0].innerText = window.innerWidth + " " + window.innerHeight
    let filter = document.getElementById("filter");
    let filter_button = document.getElementById("filter_button");   
    document.getElementById("filter_button").addEventListener("click", () => {
        if (filter.style.display == "none" || filter.style.display == "") {
            filter.style.display = "block";
            filter_button.style.position = "absolute";
        } else {
            filter.style.display = "none";
            filter_button.style.position = "relative";
        }
    });
    document.getElementById("menu").addEventListener("click", (event) => {
        let element = event.target.closest("div");
        switch (element.getAttribute("id")) {
            case "main-button":
                back_to_main();
                break;
            case "support-button":
                document.getElementById("main").style.display = "none";
                document.getElementById("contacts").style.display = "none";
                document.getElementById("support").style.display = "block";
                break;
                case "contacts-button":
                    document.getElementById("main").style.display = "none";
                    document.getElementById("support").style.display = "none";
                    document.getElementById("contacts").style.display = "block";
                    default:
                        break;
        }
        [...event.currentTarget.getElementsByTagName("div")].forEach((item) => {
            item.style.color = "black";
        });
        [...event.currentTarget.getElementsByTagName("path")].forEach((item) => {
            item.style.stroke = "black";
        });
        element.style.color = "#ff5e00";
        element.getElementsByTagName("path")[0].style.stroke = "#ff5e00";
    });
    document.getElementById("job").addEventListener("click", event => filter_click(event, "jobs"));
    document.getElementById("city").addEventListener("click", event => filter_click(event, "cities"));
    document.getElementById("pay_rate").addEventListener("click", event => filter_click(event, "pay_rates"));
    document.getElementById("housing").addEventListener("click", event => filter_click(event, "housings"));
    document.getElementById("payment").addEventListener("click", (event) => {
        let payment_from = document.getElementById("payment_from");
        let arrow = event.currentTarget.getElementsByTagName("span")[0];
        if (payment_from.style.display == "none" || payment_from.style.display == "") {
            [...document.getElementsByClassName("item")].forEach((item) => {
                let arrow = item.getElementsByTagName("span")[0];
                arrow.style.transform = "rotate(0)";
                arrow.style.transition = "transform 0.5s";
            });
            [...document.getElementById("filter").getElementsByTagName("ul")].forEach((item) => {
                item.style.display = "none";
            });
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