const parser = new PublicGoogleSheetsParser('16xDhs8r3eNPia1ByrI4dbNxqwrXyymhalXvB8NmrnLss')
parser.parse().then(data => console.log(data))
(await fetch("https://docs.google.com/spreadsheets/d/16xDhs8r3eNPia1ByrI4dbNxqwrXyymhalXvB8NmrnLs/gviz/tq?sheet=null")).text().then()
let json = JSON.parse(json_text.substring(47, json_text.length - 2))