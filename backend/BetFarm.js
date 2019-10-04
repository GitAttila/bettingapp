const Bet = require('./Bet');
const DEFAULT_RPS = 10; // RPS = request per second
class BetFarm {
  constructor(size = 10) {
    this.bets = new Array(size).fill(null).map((i, index) => new Bet(index));
  }

  updateRandomItem() {
    const bet = this.bets[Math.floor(Math.random() * this.bets.length)];
    bet.randomize();

    return bet;
  }

  updateRandomItems() {
    const times = Math.floor(Math.random() * Math.floor(19)) + 1; // from 1 to max 20 updates on UI
    const bets = [];

    for(let i = 0; i < times; i++) {
      bets.push(this.updateRandomItem())
    }

    return bets;
  }

  startPulling(rps = DEFAULT_RPS, pullingFunction) {
    this.stopPulling();

    if (!pullingFunction) {
      return;
    }

    pullingFunction();

    this.pullingInterval = setInterval(() => pullingFunction(), 1000/rps);
  }

  stopPulling() {
    clearInterval(this.pullingInterval);
  }
}

module.exports = BetFarm;
