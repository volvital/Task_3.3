const $ul = document.querySelector('#people_list');
const $visible = document.querySelector('div.visible');

const addPersonItem = (person) => {
    const secondFilm = _.get(person, '["films"][1]', 'Unknown');
    const $li = document.createElement('li');
    $li.className = 'list-group-item';
    $li.innerText = `
        ${person['name']}
        (birth year: ${person['birth_year']})
        - second film: ${secondFilm}
    `;
    $ul.appendChild($li);
};

function invisibleSpinner(){
    return $visible.setAttribute("class", "invisible");
}

function visibleSpinner() {
    return $visible.setAttribute("class", "visible");
}

const path1 = 'https://swapi.dev/api/people/?page=1';
const path2 = 'https://swapi.dev/api/people/?page=2';
const path3 = 'https://swapi.dev/api/people/?page=3';

const getPersonPage1 = fetch(path1);
const getPersonPage2 = fetch(path1);
const getPersonPage3 = fetch(path1);

Promise.all([getPersonPage1, getPersonPage2, getPersonPage3])
    .then(() => {
        alert('all promises are done!');
    })
    .catch(() => {
        alert("Error!!!");
    })
    .finally(invisibleSpinner);

class Swapi {
  constructor(){}

  async getPeople (page) {
      const result = await fetch(page);
      const data = await result.json();
      // this.page = page;
      return data;
  }

}

function loadingPage(path) {
  if($ul.hasChildNodes()){
      while ($ul.firstChild) {
          $ul.removeChild($ul.firstChild);
      }
  }
    const swapiApi = new Swapi();
    swapiApi
        .getPeople(path)
        .then((json) => {
            json.results.forEach(person => {
                addPersonItem(person);
            });
        });
}

loadingPage(path1);