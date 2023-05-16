let categories = [];
const table = document.querySelector('#jeopardy');
const h1 = document.querySelector('h1');
const loader = document.querySelector('.loader');
const startBtn = document.querySelector('#start');
const restartBtn = document.createElement('button');
restartBtn.style.display = 'None';

// get 6 random categories
function getCategoryIds() {
    return Array.from({length: 6}, () => Math.floor(Math.random() * 20000));
}

function handleClick(evt) {
    let clicked = evt.target;
    let clickedIDCat = evt.target.id.charAt(0);
    let clickedClue = evt.target.id.slice(-1);
    
    for(let i in categories) {
        if (i === clickedIDCat) {
            const question = categories[i].clues[clickedClue].question;
            const answer = categories[i].clues[clickedClue].answer;
            let showing = categories[i].clues[clickedClue].showing;
            if(showing === null) {
                clicked.innerText = question;
                categories[i].clues[clickedClue].showing = true;
            }
            else if(showing === true) {
                clicked.innerText = answer;
            }    
        }
    }
}

function showLoadingView() {
    loader.style.display = 'Block';
}

function hideLoadingView() {
    if(categories.length === 6) {
        loader.style.display = 'None';
        startBtn.after(restartBtn);
        restartBtn.style.display = 'Block';
        restartBtn.innerText = 'Restart';
    }
}

async function setupAndStart() {
    const tHead = document.createElement('thead');
    table.appendChild(tHead);

    const trHead = document.createElement('tr');
    tHead.appendChild(trHead);

    const tBody = document.createElement('tbody');
    table.appendChild(tBody);

    let randomIDs = getCategoryIds();
    for(let id of randomIDs) {
        const res = await axios.get(`http://jservice.io/api/clues?category=${id}`);
        // store max 5 clues
        const clues = res.data.slice(0,5);
        // add showing property to clues array
        for (const key of clues) {
            key.showing = null;
        }
        const title = res.data[0].category.title;
        categories.push({ title: `${title}`, clues: clues });

        hideLoadingView();

        if(categories.length === 6) {
            // create header after all 6 categories are in array
            for(let item of categories) {
                const th = document.createElement('th');
                th.innerText = item.title;
                trHead.appendChild(th);
            }
        }
    }

    // create elements for table body
    for (let i = 0; i < 5; i++) {
        const trBody = document.createElement('tr');
        trBody.id = i;
        tBody.appendChild(trBody);
    }

    const tr = document.querySelectorAll('tbody > tr');
    for (let item of tr) {
        for(let i = 0; i < 6; i++) {
            const tdBody = document.createElement('td');
            tdBody.innerText = '?';
            item.appendChild(tdBody);
            tdBody.addEventListener('click', handleClick);
        }
    }

    const tr0 = document.getElementById('0').children;
    for(const [i, item] of Array.from(tr0).entries()) {
        item.id = `${i}-0`;
    }

    const tr1 = document.getElementById('1').children;
    for(const [i, item] of Array.from(tr1).entries()) {
        item.id = `${i}-1`;
    }

    const tr2 = document.getElementById('2').children;
    for(const [i, item] of Array.from(tr2).entries()) {
        item.id = `${i}-2`;
    }

    const tr3 = document.getElementById('3').children;
    for(const [i, item] of Array.from(tr3).entries()) {
        item.id = `${i}-3`;
    }
    
    const tr4 = document.getElementById('4').children;
    for(const [i, item] of Array.from(tr4).entries()) {
        item.id = `${i}-4`;
    }
}

startBtn.addEventListener('click', function() {
    showLoadingView();
    setupAndStart(); 
    startBtn.style.display = 'None';
});

restartBtn.addEventListener('click', function() {
    showLoadingView();
    restartBtn.style.display = 'None';
    categories = [];
    const removeTHead = document.querySelector('thead');
    const removeTBody = document.querySelector('tbody');
    removeTHead.remove();
    removeTBody.remove();
    setupAndStart();
});


