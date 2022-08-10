const $ul = document.querySelector('#people_list1');
const $visible = document.querySelector('div#spinner-visible');

function invisibleSpinner(){
    return $visible.className = "invisible";
}

function visibleSpinner() {
    return $visible.className = "visible";
}

const path = 'https://swapi.dev/api/people/?page=';

const getPersonPage1 = fetch(path + 1);
const getPersonPage2 = fetch(path + 2);
const getPersonPage3 = fetch(path + 3);



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

        const $activeItem = this.$parentPaginate.querySelectorAll('a');
        if ($activeItem.length) {
            $activeItem.forEach(($item, index) => {
                $item.classList.toggle('active', index + 1 === currentPage);
            })
        }
        this.getPeople(currentPage);
    }

    _isLoading = true;
    get isLoading(){
        return this._isLoading;
    }

    set isLoading(value){
        this._isLoading = value;
        document.querySelector('.spinner-border').classList.toggle('d-none', !value);
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
        $li.innerText = `
            ${person['name']}
            (birth year: ${person['birth_year']})
            - second film: ${secondFilm}
        `;
        this.$parentList.appendChild($li);
    }

    renderPaginate(count) {
        const itemLength = Math.ceil(count / 10);

        for(let i = 1; i <= itemLength; i++) {
            // <li class="page-item"><a class="page-link" href="#">1</a></li>
            const $li = document.createElement('li');
            $li.className = 'page-item';
            const $a = document.createElement('a');
            $a.className = 'page-link';
            $a.href = '#';
            if (i === 1) {
                $a.className += ' active';
            }
            $a.innerText = i;
            $a.addEventListener('click', (event) => {
                this.page = i;
                event.preventDefault();
            });
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
    parentPaginate: document.querySelector('.pagination'),
});

swapiApi.getPeople(1).then((res) => {
    swapiApi.renderPaginate(res.count);
});
