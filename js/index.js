const parser = new PublicGoogleSheetsParser('16xDhs8r3eNPia1ByrI4dbNxqwrXyymhalXvB8NmrnLs', {"useFormat": true});
parser.parse().then(data => json = data);

function render_vacancies(json) {
    let vacancies = "";
    json.forEach((item) => {
        vacancies += `
            <li>
                <span class="city">${item["Город Мос.обл, г. Орехово-Зуево"]}</span>
                <span class="job">${item["Должность Упаковщик/Разнорабочий"]}</span>
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

window.onload = () => {
    let filter = document.getElementById("filter")
    document.getElementById("filter_button").addEventListener("click", () => {
        console.log(filter.style.display)
        if (filter.style.display == "none" || filter.style.display == "") filter.style.display = "block";
        else filter.style.display = "none";
    })
}