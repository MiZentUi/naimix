function render_vacancies(json) {
    let vacancies = "";
    json.forEach((item) => {
        vacancies += `
            <li>
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

const parser = new PublicGoogleSheetsParser('16xDhs8r3eNPia1ByrI4dbNxqwrXyymhalXvB8NmrnLs', {"useFormat": true});
parser.parse().then(data => json = data);
render_vacancies(json);

window.onload = () => {
    document.getElementById("filter_button").addEventListener("click", () => {
        let filter = document.getElementById("filter");
        let navigation = document.getElementById("navigation")
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