fetch("/get_tt").then(r =>  r.json().then(data => (new PublicGoogleSheetsParser(data["table"], {"useFormat": true}).parse().then((data) => {json = data; render_vacancies(data); filter_vacancies()}))))
let fields = {"cities": {}, "jobs": {}, "housings": {}, "nutritions": {}, "payments": {}, "pay_rates": {}, "paperworks": {}}
let filter_set = {"cities": new Set(), "jobs": new Set(), "housings": new Set(), "nutritions": new Set(), "payments": new Set(), "pay_rates": new Set(), "paperworks": new Set()}
let current_scroll = 0, current_vacancy_id = -1;
let apply_button_active = false;

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
            if (!paperwork.includes(",")) {
                if (!fields["paperworks"].hasOwnProperty(paperwork)) fields["paperworks"][paperwork] = [];
                fields["paperworks"][paperwork].push(index);
            } else {
                let split = paperwork.split(",");
                for (let i in split) {
                    if (!split[i].replaceAll(" ", "").size) {
                        if (!fields["paperworks"].hasOwnProperty(split[i])) fields["paperworks"][split[i]] = [];
                        fields["paperworks"][split[i]].push(index);
                    }
                }
            }
        }
        if (!fields["cities"].hasOwnProperty(city)) fields["cities"][city] = [];
        if (!fields["jobs"].hasOwnProperty(job)) fields["jobs"][job] = [];
        fields["cities"][city].push(index);
        fields["jobs"][job].push(index);
        for (let i in fields["jobs"]) {
            if (job.toLowerCase().includes(i.toLowerCase().trim())) {
                fields["jobs"][i].push(index);
            }
        }
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
}

function render_vacancy(index) {
    let vacancy_div = document.getElementById("this_vacancy");
    let vacancy_div_html = `<div id="vacancy_card"><div class="name"><h1 id="project">${json[index]["Проект"]}</h1></div><div class="description">`;
    for (let key in json[index]) {
        let value = json[index][key];
        if (value != undefined) vacancy_div_html += `<div><span class="header">${key}</span><span>${value}</span></div>`;
    }
    vacancy_div_html += `</div></div>`;
    vacancy_div.innerHTML = vacancy_div_html;
}

function render_faq() {
    fetch("/get_faq").then(response => response.json().then((json) => {
        faq_html = ``;
        faq_json = json;
        for (let item in json) {
            faq_html += `
                <li>
                    <div class="question" onclick="open_answer(${item})"><p>${json[item]["question"]}</p></div>
                </li>
            `;
        }
        document.getElementById("faq_list").innerHTML = `
            <ul>
                ${faq_html}
            </ul>
        `;
    }));
}

function render_answer(item) {
    document.getElementById("answer").innerHTML = faq_json[item]["answer"] + '<br><br><br><br><br>';
}

function open_answer(item) {
    let main = document.getElementById("main");
    let answer_div = document.getElementById("answer");
    render_answer(item);
    answer_div.classList.replace("close-right", "open-right");
    if (!answer_div.classList.contains("open-right")) answer_div.classList.add("open-right");
    current_scroll = window.scrollY;
    setTimeout(() => {main.style.maxHeight = "0"; }, 500);
    main.style.overflowY = "hidden";
    window.Telegram.WebApp.BackButton.onClick(back_to_main);
    window.Telegram.WebApp.BackButton.show();
}

function open_vacancy(vacancy_index) {
    let main = document.getElementById("main");
    let vacancy_div = document.getElementById("vacancy")
    render_vacancy(vacancy_index);
    current_vacancy_id = vacancy_index;
    vacancy_div.classList.replace("close-right", "open-right");
    if (!vacancy_div.classList.contains("open-right")) vacancy_div.classList.add("open-right");
    current_scroll = window.scrollY;
    setTimeout(() => {main.style.maxHeight = "0"; }, 500);
    main.style.overflowY = "hidden";
    window.Telegram.WebApp.BackButton.onClick(back_to_main);
    window.Telegram.WebApp.BackButton.show();
    window.Telegram.WebApp.MainButton.text = "Откликнуться";
    window.Telegram.WebApp.MainButton.color = "#ff5e00";
    window.Telegram.WebApp.MainButton.offClick(apply_filter);
    window.Telegram.WebApp.MainButton.onClick(open_request);
    window.Telegram.WebApp.MainButton.show();
}

function back_to_main() {
    let main = document.getElementById("main");
    let vacancy_div = document.getElementById("vacancy");
    let answer_div = document.getElementById("answer");
    main.style.maxHeight = "max-content";
    vacancy_div.classList.replace("open-right", "close-right");
    answer_div.classList.replace("open-right", "close-right");
    window.scrollTo(0, current_scroll);
    document.getElementById("contacts").style.display = "none";
    document.getElementById("support").style.display = "none";
    document.getElementById("request").style.maxHeight = "0";
    window.Telegram.WebApp.MainButton.offClick(send_request_data);
    window.Telegram.WebApp.MainButton.offClick(open_request);
    window.Telegram.WebApp.BackButton.hide();
    if (apply_button_active)
        show_filter_apply_button()
    else
        window.Telegram.WebApp.MainButton.hide();
}

function open_request() {
    let request = document.getElementById("request");
    let vacancy = document.getElementById("vacancy");
    window.Telegram.WebApp.MainButton.offClick(open_request);
    window.Telegram.WebApp.MainButton.onClick(send_request_data);
    request.style.maxHeight = request.scrollHeight + "px";
    setTimeout(() => {vacancy.scrollTo({top: document.getElementById("this_vacancy").scrollHeight, behavior: 'smooth'})}, 400);
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
        });
        [...document.getElementById("filter").getElementsByTagName("ul")].forEach((item) => {
            item.style.maxHeight = "0px";
            if (item.classList.contains("open")) item.classList.toggle("open");
        });
        let payment_from = document.getElementById("payment_from");
        payment_from.style.padding = "0";
        payment_from.style.maxHeight = "0px";
        if (payment_from.classList.contains("open")) payment_from.classList.toggle("open");
        arrow.style.transform = "rotate(90deg)";
        arrow.style.transition = "transform 0.5s";
        ul.style.maxHeight = ul.scrollHeight + "px";
    } else {
        arrow.style.transform = "rotate(0)";
        arrow.style.transition = "transform 0.5s";
        ul.style.maxHeight = "0px";
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
    show_filter_apply_button();
}

function show_filter_apply_button() {
    window.Telegram.WebApp.MainButton.text = "Применить фильтры";
    window.Telegram.WebApp.MainButton.color = "#ff5e00";
    window.Telegram.WebApp.MainButton.onClick(apply_filter);
    window.Telegram.WebApp.MainButton.show();
    apply_button_active = true;
}

function apply_filter() {
    let filter = document.getElementById("filter");
    filter.style.maxHeight = "0px";
    filter.classList.toggle("open");
    window.Telegram.WebApp.MainButton.offClick(apply_filter);
    window.Telegram.WebApp.MainButton.hide();
    apply_button_active = false;
    filter_vacancies();
    setTimeout(() => {window.scrollTo({top: document.getElementById("head").scrollHeight + document.getElementById("navigation").scrollHeight + 50, behavior: 'smooth'})}, 400);
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
                <div class="vacancy_button"><span>Подробнее</span></div>
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
                    try { JSON.stringify(json[fields[i][j][k]]["Оплата за смену"]).match(/[0-9 ]+/g).forEach((item) => {if (item.replaceAll(" ", "").length > 2 && parseInt(item.replaceAll(" ", "")) < min_price) min_price = parseInt(item.replaceAll(" ", ""));}); } catch (e) {};
                    try {housing = JSON.stringify(json[fields[i][j][k]]["Наличие проживания"]).toLowerCase().includes("да");} catch (e) {};
                    try {nutrition = JSON.stringify(json[fields[i][j][k]]["Наличие питания"]).toLowerCase().includes("да");} catch (e) {};
                    if (min_price >= parseInt(document.getElementById("payment_from").getElementsByTagName("input")[0].value) || !parseInt(document.getElementById("payment_from").getElementsByTagName("input")[0].value)) {
                        let exists = true;
                        try {
                            if (document.getElementById("housings").getElementsByClassName("active")[0].getElementsByTagName("p")[0].innerText.toLowerCase() == "да" && !housing) exists = false;
                            else if (document.getElementById("housings").getElementsByClassName("active")[0].getElementsByTagName("p")[0].innerText.toLowerCase() == "нет" && housing) exists = false;
                        } catch (e) {}
                        try {
                            if (document.getElementById("nutritions").getElementsByClassName("active")[0].getElementsByTagName("p")[0].innerText.toLowerCase() == "да" && !nutrition) exists = false;
                            else if (document.getElementById("nutritions").getElementsByClassName("active")[0].getElementsByTagName("p")[0].innerText.toLowerCase() == "нет" && nutrition) exists = false;
                        } catch (e) {} 
                        if (exists) filtered_indexes.add(fields[i][j][k]);
                    }
                }
            } else {
                filtered_indexes.forEach((index) => {
                    try { if (!fields[i][j].includes(index)) filtered_indexes.delete(index); } catch (e) {}
                });
            }
        })
    }
    console.log(filtered_indexes.size);
    if (!filter_set["cities"].size && !filter_set["jobs"].size && !filter_set["pay_rates"].size && !filter_set["paperworks"].size)
        for (let i in json)
        {
            let min_price = Infinity;
    try { JSON.stringify(json[i]["Оплата за смену"]).match(/[0-9 ]+/g).forEach((item) => {if (item.replaceAll(" ", "").length > 2 && parseInt(item.replaceAll(" ", "")) < min_price) min_price = parseInt(item.replaceAll(" ", ""));}); } catch (e) {};
            if (min_price >= parseInt(document.getElementById("payment_from").getElementsByTagName("input")[0].value) || !parseInt(document.getElementById("payment_from").getElementsByTagName("input")[0].value)) {
                let exists = true;
                try {if (document.getElementById("housings").getElementsByClassName("active")[0].getElementsByTagName("p")[0].innerText.toLowerCase() == "да" != JSON.stringify(json[i]["Наличие проживания"]).toLowerCase().includes("да")) exists = false;} catch (e) {};
                try {if (document.getElementById("nutritions").getElementsByClassName("active")[0].getElementsByTagName("p")[0].innerText.toLowerCase() == "да" != JSON.stringify(json[i]["Наличие питания"]).toLowerCase().includes("да")) exists = false;} catch (e) {};
                if (exists) filtered_indexes.add(i);
            }
        }
    render_filter(filtered_indexes);
}

function send_support_data() {
    let email_input = document.getElementById("email").getElementsByTagName("input")[0];
    let topic_input = document.getElementById("topic").getElementsByTagName("input")[0];
    let description_textarea = document.getElementById("description").getElementsByTagName("textarea")[0];
    email_input.style.borderColor = "#E1E1E1";
    topic_input.style.borderColor = "#E1E1E1";
    description_textarea.style.borderColor = "#E1E1E1";
    let send = true, correct_email = true;
    if (!email_input.value.trim().includes(".") || !email_input.value.trim().includes(".")) {
        correct_email = false;
        email_input.style.borderColor = "red";
        send = false;
    }
    if (email_input.value.trim() == "") {
        email_input.style.borderColor = "red";
        send = false;
    }
    if (topic_input.value.trim() == "") {
        topic_input.style.borderColor = "red";
        send = false;
    }
    if (description_textarea.value.trim() == "") {
        description_textarea.style.borderColor = "red";
        send = false;
    }
    if (send) {
        let body = {"type": "support", "data": {"email": email_input.value.trim(), "topic": topic_input.value.trim(), "description": description_textarea.value.trim()}}
        fetch("/send", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        }).then((responce) => {
            if (responce.status == 200) {
                snackbar_alert("Отправлено");
            } else if (responce.status == 208) {
                snackbar_alert("Уже отправлено!");
            } else if (responce.status == 230) snackbar_alert("Пожалуйста подождите");
            else snackbar_alert("Oшибка!")
        });
    } else if (!correct_email && email_input.value.trim() != "") snackbar_alert("Введите корректную почту!");
    else snackbar_alert("Заполните поля!");
}

function send_request_data() {
    let name_input = document.getElementById("name").getElementsByTagName("input")[0];
    let phone_input = document.getElementById("phone").getElementsByTagName("input")[0];
    let client_city_input = document.getElementById("client_city").getElementsByTagName("input")[0];
    let communication_textarea = document.getElementById("communication").getElementsByTagName("textarea")[0];
    name_input.style.borderColor = "#E1E1E1";
    phone_input.style.borderColor = "#E1E1E1";
    client_city_input.style.borderColor = "#E1E1E1";
    communication_textarea.style.borderColor = "#E1E1E1";
    let send = true, correct_phone = true;
    if (name_input.value.trim() == "") {
        name_input.style.borderColor = "red";
        send = false;
    }
    if (phone_input.value.trim() == "") {
        phone_input.style.borderColor = "red";
        send = false;
    }
    if (!/^[+0-9 ()-]+$/g.test(phone_input.value.trim())) {
        correct_phone = false;
        phone_input.style.borderColor = "red";
        send = false;
    }
    if (client_city_input.value.trim() == "") {
        client_city_input.style.borderColor = "red";
        send = false;
    }
    if (communication_textarea.value.trim() == "") {
        communication_textarea.style.borderColor = "red";
        send = false;
    }
    if (send) {
        let body = {"type": "request", "user_info": Telegram.WebApp.initDataUnsafe, "data": {"name": name_input.value.trim(), "phone": phone_input.value.trim(), "client_city": client_city_input.value.trim(), "communication": communication_textarea.value.trim(), "vacancy": json[current_vacancy_id]}}
        // console.log(body)
        fetch("/send", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        }).then((responce) => {
            if (responce.status == 200) {
                snackbar_alert("Отправлено");
            } else if (responce.status == 208) {
                snackbar_alert("Уже отправлено!");
            } else if (responce.status == 230) snackbar_alert("Пожалуйста подождите");
            else snackbar_alert("Oшибка!")
        });
    } else if (!correct_phone && phone_input.value.trim() != "") snackbar_alert("Введите корректный номер!");
    else snackbar_alert("Заполните поля!")
}

function snackbar_alert(message) {
    let snackbar = document.getElementById("snackbar");
    snackbar.getElementsByTagName("p")[0].textContent = message;
    snackbar.style.display = "grid";
    setTimeout(() => {snackbar.style.display = "none"}, 3000);
}

window.onload = () => {
    let filter = document.getElementById("filter");
    let filter_button = document.getElementById("filter_button");   
    document.getElementById("filter_button").addEventListener("click", () => {
        if (!filter.classList.contains("open")) {
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
            if (filter.classList.contains("open")) filter.classList.toggle("open");
        } else {
            filter.style.maxHeight = "0px";
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
                document.getElementById("faq").style.display = "none";
                if (apply_button_active) show_filter_apply_button();
                window.scrollTo(0, current_scroll);
                break;
            case "support-button":
                window.open("https://t.me/Help_Resource", '_blank').focus()
                // current_scroll = window.scrollY;
                // document.getElementById("main").style.display = "none";
                // document.getElementById("contacts").style.display = "none";
                // document.getElementById("support").style.display = "block";
                // document.getElementById("faq").style.display = "none";
                break;
            case "faq-button":
                window.Telegram.WebApp.MainButton.hide();
                current_scroll = window.scrollY;
                document.getElementById("main").style.display = "none";
                document.getElementById("contacts").style.display = "none";
                document.getElementById("support").style.display = "none";
                document.getElementById("faq").style.display = "block";
                break;
            case "contacts-button":
                window.Telegram.WebApp.MainButton.hide();
                current_scroll = window.scrollY;
                document.getElementById("main").style.display = "none";
                document.getElementById("support").style.display = "none";
                document.getElementById("contacts").style.display = "block";
                document.getElementById("faq").style.display = "none";
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
    document.getElementById("support_button").addEventListener("click", send_support_data);
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
    render_faq();
    [...document.getElementsByTagName("input")].forEach((element) => {
        element.addEventListener('keyup', (keyboardEvent) => {
            if (keyboardEvent.code === 'Enter' || keyboardEvent.code == 'Escape') {
                element.blur();
            }
        });
    });
    [...document.getElementsByTagName("textarea")].forEach((element) => {
        element.addEventListener('keyup', (keyboardEvent) => {
            if (keyboardEvent.code === 'Escape' || keyboardEvent.code === 'Return') {
                element.blur();
            }
        });
    });
}