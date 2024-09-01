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