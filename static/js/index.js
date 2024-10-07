// fetch("/get_tt").then(r =>  r.json().then(data => (new PublicGoogleSheetsParser(data["table"], {"useFormat": true}).parse().then((data) => {json = data; render_vacancies(data)}))))
(new PublicGoogleSheetsParser("14jj4QBrpZOzzasHKKv-XzECEK5C2m20B1FLOBULodng", {"useFormat": true}).parse().then((data) => {json = data; render_vacancies(data)}))
let fields = {"cities": {}, "jobs": {}, "housings": {}, "nutritions": {}, "payments": {}, "pay_rates": {}, "paperworks": {}}
let filter_set = {"cities": new Set(), "jobs": new Set(), "housings": new Set(), "nutritions": new Set(), "payments": new Set(), "pay_rates": new Set(), "paperworks": new Set()}
let currentScroll = 0;

function render_vacancies(json) {
    let vacancies = "", cities_items = "", pay_rates_items = "", jobs_items = "", paperworks_items = "";
    json.forEach((item, index) => {
        let city = item["Город"]
        let job = item["Должность"]
        let pay_rate = item["Частота выплат"]
        let paperwork = item["Вид оформления"]
        if (pay_rate != undefined) {
            if (!fields["pay_rates"].hasOwnProperty(pay_rate)) fields["pay_rates"][pay_rate] = [];
            fields["pay_rates"][pay_rate].push(index);
        }
        if (paperwork != undefined) {
            if (!fields["paperworks"].hasOwnProperty(paperwork)) fields["paperworks"][paperwork] = [];
            fields["paperworks"][paperwork].push(index);
        }
        if (!fields["cities"].hasOwnProperty(city)) fields["cities"][city] = [];
        if (!fields["jobs"].hasOwnProperty(job)) fields["jobs"][job] = [];
        fields["cities"][city].push(index);
        fields["jobs"][job].push(index);
    });
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
    for (let i in fields["paperworks"]) {
        if (i != undefined) paperworks_items += `
            <li class="filter_item" data="paperworks" onclick="filter_item_click(this);"><p>${i}</p><span class="material-symbols-rounded">check_box_outline_blank</span></li>
        `;
    }
    document.getElementById("cities").innerHTML = cities_items;
    document.getElementById("jobs").innerHTML = jobs_items;
    document.getElementById("pay_rates").innerHTML = pay_rates_items;
    document.getElementById("paperworks").innerHTML = paperworks_items;
    // document.getElementById("vacancies").innerHTML = html_vacancies_list;
}

function render_vacancy(index) {
    let vacancy_div = document.getElementById("vacancy")
    let vacancy_div_html = `<div id="vacancy_card"><div class="name"><h1 id="project">${json[index]["Проект"]}</h1></div><div class="description">`;
    for (let key in json[index]) {
        let value = json[index][key];
        if (value != undefined) vacancy_div_html += `<div><span class="header">${key}</span><span>${value}</span></div>`;
    }
    // if (json[index]["Должность"] != undefined) vacancy_div_html += `<div><span class="header">Должность</span><span>${json[index]["Должность"]}</span></div>`;
    // if (json[index]["Город"] != undefined) vacancy_div_html += `<div><span class="header">Город</span><span>${json[index]["Город"]}</span></div>`;
    // if (json[index]["Адрес"] != undefined) vacancy_div_html += `<div><span class="header">Адрес</span><span>${json[index]["Адрес"]}</span></div>`;
    // // if (json[index]["Общая потребность 8 только день"] != undefined) vacancy_div_html += `<span>Общая потребность</b>: ${json[index]["Общая потребность 8 только день"]}</span></div>`;
    // if (json[index]["Возраст"] != undefined) vacancy_div_html += `<div><span class="header">Возраст</span><span>${json[index]["Возраст"]}</span></div>`;
    // if (json[index]["Гражданство"] != undefined) vacancy_div_html += `<div><span class="header">Гражданство</span><span>${json[index]["Гражданство"]}</span></div>`;
    // if (json[index]["График"] != undefined) vacancy_div_html += `<div><span class="header">График</span><span>${json[index]["График"]}</span></div>`;
    // if (json[index]["Частота выплат"] != undefined) vacancy_div_html += `<div><span class="header">Частота выплат</span><span>${json[index]["Частота выплат"]}</span></div>`;
    // if (json[index]["Оплата за смену ВАХТА"] != undefined) vacancy_div_html += `<div><span class="header">Оплата за смену ВАХТА</span><span>${json[index]["Оплата за смену ВАХТА"]}</span></div>`;
    // if (json[index]["Оплата за смену МЕСТНЫЕ"] != undefined) vacancy_div_html += `<div><span class="header">Оплата за смену МЕСТНЫЕ</span><span>${json[index]["Оплата за смену МЕСТНЫЕ"]}</span></div>`;
    vacancy_div_html += `</div></div>
            <div id="request">
                    <div id="name"><label>Имя</label><input type="text"></div>
                    <div id="phone"><label>Номер телефона</label><input type="text"></div>
                    <div id="client_city"><label>Ваш город</label><input type="text"></div>
                    <div id="communication"><label>Удобный способ связи</label><textarea type="text" rows="5"></textarea></div>
            </div>`;
    vacancy_div.innerHTML = vacancy_div_html;
}

function open_vacancy(vacancy_index) {
    let main = document.getElementById("main");
    let vacancy_div = document.getElementById("vacancy")
    render_vacancy(vacancy_index);
    vacancy_div.classList.replace("close-right", "open-right");
    if (!vacancy_div.classList.contains("open-right")) vacancy_div.classList.add("open-right");
    currentScroll = window.scrollY;
    setTimeout(() => {main.style.maxHeight = "0"; document.getElementById("menu").style.display = "none";}, 500);
    main.style.overflowY = "hidden";
    window.Telegram.WebApp.BackButton.onClick(back_to_main);
    window.Telegram.WebApp.BackButton.show();
    window.Telegram.WebApp.MainButton.text = "Откликнуться";
    window.Telegram.WebApp.MainButton.color = "#ff5e00";
    window.Telegram.WebApp.MainButton.onClick(open_request);
    window.Telegram.WebApp.MainButton.show();
}

function back_to_main() {
    let main = document.getElementById("main");
    let vacancy_div = document.getElementById("vacancy");
    main.style.maxHeight = "max-content";
    // main.style.overflowY = "auto";
    vacancy_div.classList.replace("open-right", "close-right");
    // vacancy_div.style.display = "none";
    window.scrollTo(0, currentScroll);
    document.getElementById("contacts").style.display = "none";
    document.getElementById("support").style.display = "none";
    // document.getElementById("request").style.display = "none";
    document.getElementById("request").style.maxHeight = "0";
    // document.getElementById("menu").style.display = "flex";
    window.Telegram.WebApp.BackButton.hide();
    window.Telegram.WebApp.MainButton.hide();
}

function open_request() {
    let request = document.getElementById("request");
    // request.style.display = "block";
    request.style.maxHeight = request.scrollHeight + "px";
    window.Telegram.WebApp.MainButton.text = "Отправить";
}

function filter_click(event, ul_id) {
    let ul = document.getElementById(ul_id);
    let arrow = event.currentTarget.getElementsByTagName("span")[0]
    if (!ul.classList.contains("open")) {
        [...document.getElementsByClassName("item")].forEach((item) => {
            let arrow = item.getElementsByTagName("span")[0];
            arrow.style.transform = "rotate(0)";
            arrow.style.transition = "transform 0.5s";
            ul.style.maxHeight = "0px";
            // ul.style.transition = "max-height, 0.5s linear";
        });
        [...document.getElementById("filter").getElementsByTagName("ul")].forEach((item) => {
            item.style.maxHeight = "0px";
            // item.style.transition = "max-height, 0.5s linear";
            if (item.classList.contains("open")) item.classList.toggle("open");
        });
        let payment_from = document.getElementById("payment_from");
        payment_from.style.padding = "0";
        payment_from.style.maxHeight = "0px";
        // payment_from.style.transition = "max-height, 0.5s linear";
        if (payment_from.classList.contains("open")) payment_from.classList.toggle("open");
        // ul.style.display = "block";
        
        arrow.style.transform = "rotate(90deg)";
        arrow.style.transition = "transform 0.5s";
        ul.style.maxHeight = ul.scrollHeight + "px";
        // ul.style.transition = "max-height, 0.5s linear";
    } else {
        arrow.style.transform = "rotate(0)";
        arrow.style.transition = "transform 0.5s";
        ul.style.maxHeight = "0px";
        // ul.style.transition = "max-height, 0.5s linear";
        // ul.style.display = "none";
    }
    ul.classList.toggle("open");
}

function filter_item_click(item) {
    if (!item.className.includes("active")) {
        [...item.parentNode.getElementsByClassName("filter_item")].forEach((i) => {
            filter_set[i.getAttribute("data")].delete(i.getElementsByTagName("p")[0].innerText);
            i.className = i.className.split(" ")[0];
            if (i.getAttribute("data") == "housings" || item.getAttribute("data") == "nutritions") i.getElementsByTagName("span")[0].innerText = "radio_button_unchecked";
            else i.getElementsByTagName("span")[0].innerText = "check_box_outline_blank";
            i.getElementsByTagName("p")[0].style.color = "black";
            i.getElementsByTagName("span")[0].style.color = "black";
        });
        filter_set[item.getAttribute("data")].add(item.getElementsByTagName("p")[0].innerText);
        if (item.getAttribute("data") != "housings" && item.getAttribute("data") != "nutritions") item.getElementsByTagName("span")[0].innerText = "select_check_box";
        else item.getElementsByTagName("span")[0].innerText = "radio_button_checked";
        item.className += " active";
        item.getElementsByTagName("p")[0].style.color = "#FE5E00";
        item.getElementsByTagName("span")[0].style.color = "#FE5E00";
    } else {
        filter_set[item.getAttribute("data")].delete(item.getElementsByTagName("p")[0].innerText);
        item.className = item.className.split(" ")[0];
        if (item.getAttribute("data") == "housings" || item.getAttribute("data") == "nutritions") item.getElementsByTagName("span")[0].innerText = "radio_button_unchecked";
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
                    <div><span class="header">Город</span><span>${city}</span></div>
                    <div><span class="header">Оплата за смену</span><span>${json[index]["Оплата за смену"]}</span></div>
                </div>
            </li>
        <br>`;
    });
    const html_vacancies_list = `
        <ul>
            ${vacancies}
        </ul>
    <br>`;
    if (!indexes.size && document.getElementsByClassName("active").length) document.getElementById("vacancies").innerHTML = `<p class="not_found">Вакансии не найдены. Попробуйте другие фильтры</p>`;
    else document.getElementById("vacancies").innerHTML = html_vacancies_list;
}

function filter_vacancies() {
    let filtered_indexes = new Set();
    for (let i in filter_set) {
        filter_set[i].forEach((j) => {
            if (filtered_indexes.size == 0) {
                for (let k in fields[i][j]) {
                    let min_price = Infinity;
                    try { JSON.stringify(json[fields[i][j][k]]["Оплата за смену"]).match(/[0-9 ]+/g).forEach((item) => {if (item.replaceAll(" ", "").length > 2 && parseInt(item.replaceAll(" ", "")) < min_price) min_price = parseInt(item.replaceAll(" ", ""));}); } catch (e) {}
                    // try { JSON.stringify(json[fields[i][j][k]]["Оплата за смену МЕСТНЫЕ"]).match(/[0-9 ]+/g).forEach((item) => {if (item.replaceAll(" ", "").length > 2 && parseInt(item.replaceAll(" ", "")) < min_price) min_price = parseInt(item.replaceAll(" ", ""));}); } catch (e) {}
                    let housing = JSON.stringify(json[fields[i][j][k]]["Наличие проживания"]).toLowerCase().includes("да");
                    let nutrition = JSON.stringify(json[fields[i][j][k]]["Наличие питания"]).toLowerCase().includes("да");
                    if (min_price > parseInt(document.getElementById("payment_from").getElementsByTagName("input")[0].value) || !parseInt(document.getElementById("payment_from").getElementsByTagName("input")[0].value)) {
                        try {
                            let exists = true;
                            if (document.getElementById("housings").getElementsByClassName("active")[0].getElementsByTagName("p")[0].innerText.toLowerCase() == "да" && !housing) exists = false;
                            else if (document.getElementById("housings").getElementsByClassName("active")[0].getElementsByTagName("p")[0].innerText.toLowerCase() == "нет" && housing) exists = false;
                            if (document.getElementById("nutritions").getElementsByClassName("active")[0].getElementsByTagName("p")[0].innerText.toLowerCase() == "да" && !nutrition) exists = false;
                            else if (document.getElementById("nutritions").getElementsByClassName("active")[0].getElementsByTagName("p")[0].innerText.toLowerCase() == "нет" && nutrition) exists = false;
                            if (exists) filtered_indexes.add(fields[i][j][k]);
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
    let filter = document.getElementById("filter");
    let filter_button = document.getElementById("filter_button");   
    document.getElementById("filter_button").addEventListener("click", () => {
        if (!filter.classList.contains("open")) {
            // filter.style.display = "block";
            filter.style.padding = "0";
            let max_height = 0;
            let uls = filter.getElementsByTagName("ul");
            for (let i = 0; i < uls.length; i++) {
                // max_height += uls[i].scrollHeight;
                if (uls[i].scrollHeight > max_height) max_height = uls[i].scrollHeight;
                console.log(uls[i].scrollHeight)
            }
            max_height += filter.scrollHeight + 500;
            filter.style.maxHeight = "0px";
            filter.style.maxHeight = max_height + "px";
            setTimeout(() => { filter_button.style.position = "relative"; }, 0);
            // filter.style.transition = "max-height, 0.5s linear";
            if (filter.classList.contains("open")) filter.classList.toggle("open");
        } else {
            // filter.style.padding = "0";
            filter.style.maxHeight = "0px";
            // filter.style.transition = "max-height, 0.5s linear";
            // filter.style.display = "none";
            setTimeout(() => { filter_button.style.position = "absolute"; }, 500);
        }
        filter.classList.toggle("open");
    });
    document.getElementById("menu").addEventListener("click", (event) => {
        let element = event.target.closest("div");
        switch (element.getAttribute("id")) {
            case "main-button":
                document.getElementById("main").style.display = "block";
                document.getElementById("contacts").style.display = "none";
                document.getElementById("support").style.display = "none";
                window.scrollTo(0, currentScroll);
                break;
            case "support-button":
                currentScroll = window.scrollY;
                document.getElementById("main").style.display = "none";
                document.getElementById("contacts").style.display = "none";
                document.getElementById("support").style.display = "block";
                break;
            case "contacts-button":
                currentScroll = window.scrollY;
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
    document.getElementById("paperwork").addEventListener("click", event => filter_click(event, "paperworks"));
    document.getElementById("housing").addEventListener("click", event => filter_click(event, "housings"));
    document.getElementById("nutrition").addEventListener("click", event => filter_click(event, "nutritions"));
    document.getElementById("payment").addEventListener("click", (event) => {
        let payment_from = document.getElementById("payment_from");
        let arrow = event.currentTarget.getElementsByTagName("span")[0];
        if (!payment_from.classList.contains("open")) {
            [...document.getElementsByClassName("item")].forEach((item) => {
                let arrow = item.getElementsByTagName("span")[0];
                arrow.style.transform = "rotate(0)";
                arrow.style.transition = "transform 0.5s";
                payment_from.style.maxHeight = "0px";
                payment_from.style.transition = "max-height, 0.5s linear";
            });
            [...document.getElementById("filter").getElementsByTagName("ul")].forEach((item) => {
                item.style.padding = "0";
                item.style.maxHeight = "0px";
                item.style.transition = "max-height, 0.5s linear";
                if (item.classList.contains("open")) item.classList.toggle("open");
            });
            payment_from.style.padding = "10px";
            arrow.style.transform = "rotate(90deg)";
            arrow.style.transition = "transform 0.5s";
            payment_from.style.maxHeight = payment_from.scrollHeight * 4 + "px";
            payment_from.style.transition = "max-height, 0.5s linear";
        } else {
            payment_from.style.padding = "0";
            
            arrow.style.transform = "rotate(0)";
            arrow.style.transition = "transform 0.5s";
            payment_from.style.maxHeight = "0px";
            payment_from.style.transition = "max-height, 0.5s linear";
        }
        payment_from.classList.toggle("open");
    });
}