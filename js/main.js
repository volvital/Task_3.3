const $visible = document.querySelector('div#spinner-visible');

function invisibleSpinner(){
    return $visible.className = "invisible";
}

function visibleSpinner() {
    return $visible.className = "visible";
}

const path = 'https://swapi.dev/api/people/?page=';

function getPersonPage(count){
    let arrPerson = [];
    for(let i = 1; i <= count; i+=1){
        arrPerson.push(fetch(path + i));
    }
    return arrPerson;
}

class Swapi {
    $parentList = null;
    $parentPaginate = null;

    constructor({ parentList, parentPaginate }){
        this.$parentList = parentList;
        this.$parentPaginate = parentPaginate;
    }

    _page = 1;
    get page(){
        return this._page;
    }

    set page(currentPage){
        this._page = currentPage;

        const $activeItem = this.$parentPaginate.querySelectorAll('li');

        if ($activeItem.length) {
            $activeItem[0].classList.toggle('disabled', currentPage === 1);
            $activeItem.forEach(($item, index) => {
                $item.classList.toggle('active', index === currentPage);
            })
            $activeItem[$activeItem.length - 1].classList.toggle('disabled', currentPage === $activeItem.length - 2);
        }
        this.getPeople(currentPage);
    }

    async getPeople (page) {
        if(this.$parentList.hasChildNodes()){
            visibleSpinner();
            while (this.$parentList.firstChild) {
                this.$parentList.removeChild(this.$parentList.firstChild);
            }
        }
        const result = await fetch(path + page);
        const data = await result.json();
        this.renderList(data.results);
        invisibleSpinner();
        return data;
    }

    renderList(list) {
                list.forEach(person => {
                    this.addPersonItem(person);
                });
            }

    addPersonItem = (person) => {
        const secondFilm = _.get(person, '["films"][1]', 'Unknown');
        const $li = document.createElement('li');
        $li.className = 'list-group-item';
        $li.innerText = `${person['name']} (birth year: ${person['birth_year']}) - second film: ${secondFilm}
        `;
        this.$parentList.appendChild($li);
    }

    renderPaginate(count) {
        const itemLength = Math.ceil(count / 10);

        for(let i = 0; i <= itemLength + 1; i++) {

            const $li = document.createElement('li');
            $li.className = 'page-item';
            const $a = document.createElement('a');
            $a.className = 'page-link';
            $a.href = '#';
            if (i === 1) {
                $li.className += ' active';
            }
            if(i === 0){
                $li.className += ' disabled';
                $a.innerText = 'Last';
                $a.addEventListener('click', (event) => {
                    this.page -= 1;
                    event.preventDefault();
                });
            } else if(i === itemLength + 1){
                $a.innerText = 'Next';
                $a.addEventListener('click', (event) => {
                    this.page += 1;
                    event.preventDefault();
                });
            } else {
            $a.innerText = i;
            $a.addEventListener('click', (event) => {
                this.page = i;
                event.preventDefault();
            });
            }

            $li.appendChild($a);
            this.$parentPaginate.appendChild($li);
        }
    }
}

function getPromise (item) {
    Promise.all(item)
    .then(() => {
        alert('all promises are done!');
    })
    .catch(() => {
        alert("Error!!!");
    })
    .finally(invisibleSpinner);
}

const swapiApi = new Swapi({
    parentList: document.querySelector('#people_list'),
    parentPaginate: document.querySelector('.pagination')
});

swapiApi.getPeople(1).then((res) => {
    swapiApi.renderPaginate(res.count);
    getPromise(getPersonPage(res.count));
});
