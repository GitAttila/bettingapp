const path = require('path');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

const BetFarmerBuilder = require('./BetFarm');

let betFarm = new BetFarmerBuilder(100);
let PULLING_RATE = 3;

app.use('/backend/logos', express.static(path.join('backend/logos')));

app.use((req, res, next) => {
  res.header(`Access-Control-Allow-Origin`, `*`);
  res.header(`Access-Control-Allow-Headers`, `Origin, X-Requested-With, Content-Type, Accept`);
  next();
});

app.get('/',(req, resp) => {
  resp.json({ ok: 1 });
});

app.get('/bets', (req, resp) => {
  resp.json(betFarm.bets);
});

app.get('/bets/:id', (req, resp) => {
  const id = req.params.id;
  resp.json(betFarm.bets[id]);
});

app.get('/bets-generate', (req, resp) => {
  let { size } = req.query;

  size = Number(size);

  if (Number.isNaN(size)) {
    size = null;
  }

  betFarm = new BetFarmerBuilder(size);

  resp.json({ ok: 1, bets: betFarm.bets });
});

app.get('/pulling/start', (req, resp) => {
  let { rate } = req.query;

  rate = Number(rate);

  if (Number.isNaN(rate)) {
    rate = PULLING_RATE;
  }

  betFarm.startPulling(rate, () => {
    const updatedBets = betFarm.updateRandomItems();
    updatedBets.map(updatedBet => console.log(`[#${updatedBet.id}] emiting updated bet\n\t${updatedBet.teams[0].name}: ${updatedBet.teams[0].win} ${updatedBet.teams[1].name}: ${updatedBet.teams[1].win} draw: ${updatedBet.draw}`))
    io.emit('bet-updated', updatedBets);
  });

  resp.json({ ok: 1 });
});

app.get('/pulling/stop', (req, resp) => {
  betFarm.stopPulling();
  resp.json({ ok: 1 });
});

http.listen(port, () => console.log(`listening on port ${port}`));
