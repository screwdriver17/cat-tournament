const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 80;

const API_KEY = 'live_y0ft3BZP8zzKFu97XLJasSCsbjS4ad3r57nPqfHHvRxQY59pLRgxqooDKxa03bBR';

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());

let allCats = [];
let currentRound = [];
let winners = [];

async function fetchCats() {
    const response = await fetch(
        'https://api.thecatapi.com/v1/images/search?limit=16', 
        {
            headers: {
                'x-api-key': API_KEY
            }
        }
    );
    allCats = await response.json();
    currentRound = [...allCats];
    winners = [];
}

app.get('/', async (req, res) => {
    await fetchCats();
    res.render('index', { 
        cat1: currentRound[0], 
        cat2: currentRound[1],
        remainingPairs: currentRound.length / 2,
        currentRoundNumber: Math.ceil(Math.log2(allCats.length)) - Math.ceil(Math.log2(currentRound.length)) + 1
    });
});

app.post('/vote', (req, res) => {
    const winnerId = req.body.winnerId;
    const winner = currentRound.find(cat => cat.id === winnerId);
    
    if (winner) {
        winners.push(winner);
    }

    currentRound.splice(0, 2); // Remove the two cats that were just voted on

    if (currentRound.length === 0 && winners.length > 1) {
        // Start next round
        currentRound = [...winners];
        winners = [];
    }

    if (currentRound.length >= 2) {
        res.json({ 
            cat1: currentRound[0], 
            cat2: currentRound[1],
            remainingPairs: currentRound.length / 2,
            currentRoundNumber: Math.ceil(Math.log2(allCats.length)) - Math.ceil(Math.log2(currentRound.length)) + 1
        });
    } else if (winners.length === 1) {
        // We have a final winner
        res.json({ winner: winners[0] });
    }
});

app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
}); 