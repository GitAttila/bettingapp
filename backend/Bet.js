const rapperName = require('rapper-name-generator');
const loremHipsum = require('lorem-hipsum');
const imgs = ['arsenal', 'irish', 'kings', 'liberty', 'riverkings', 'romans', 'sabers', 'tigers', 'titans', 'vikings'];
lastRandom = -1;
class Bet {
  constructor(id = Math.round(Math.random() * 1000)) {
    this.id = id;
    this.teams = [{
      name: rapperName(),
      win: Math.random() * 10,
      description: loremHipsum(),
      logoPath: this.generateLogo() + '.png'
    }, {
      name: rapperName(),
      win: Math.random() * 10,
      description: loremHipsum(),
      logoPath: this.generateLogo() + '.png'
    }];
    this.draw = Math.random() * 10;
  }

  generateLogo() {
    const random = Math.floor(Math.random() * imgs.length);
    if (random !== lastRandom) {
      lastRandom = random;
      return imgs[random];
    } else {
      return this.generateLogo();
    }
  }

  randomize() {
    const random = Math.random() * 3;

    if (random > 2) {
      this.teams[0].win = Math.random() * 10;
    } else if (random > 1) {
      this.teams[1].win = Math.random() * 10;
    } else {
      this.draw = Math.random() * 10;
    }
  }
}

module.exports = Bet;
