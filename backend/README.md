# Betsys FE Developer

You can find the description [here](http://www.betsys.com/en/career/javavscript-developer-polandcz/)

## Assessment

The goal for this assesment is create a live sports bet dashboard.

You can use those websites as inspiration (but don't let then block your creativity).
- https://www.sts.pl
- https://www.bet365.com
- https://sports.betway.com

## Tech stack

*If you have something extra to bring or change, you are more than welcome to suprise us :)*
- Angular (~7)
- Socket.io
- RxJS
- SCSS
- Protractor
- Jest


## Evaluation
We understand that even being a developer, you have a life, so if something would be repetitive, or you could improve something, just leave a comment that our bots will understand why this technical decision

- Application performance
- Design
    - Resposive
    - Using mixin or helpers to re-use style
- Code quality
- Tests
- Inovation
- Techinical decisions
  - Code reusability
  - Components architectures

### Extra

- Use schematics for components
- Multi-language
- Multi-currency

# API

You must use the give backend in this project (the application can be develop in a different repo).

For running this app you must:

```
npm i
npm run start
```

Note that the production API must be https://betsys-fe-assessment.herokuapp.com/.


### Bets

Available services:


`GET /bets` - returns an array of `bet`.
Example:
```
Resquest: GET /bets
Response: 
[
  {
    "id": 0,
    "teams": [
      {
        "name": "Big Xan",
        "win": 5.201864081220064
      },

      {
        "name": "Ill Fork Baby",
        "win": 8.27769125625313
      }
    ],
    "draw": 0.7884923091602247
  }
]
```


`GET /bets/:id` - returns the `bet` object for the given id

Example:
```
Resquest: GET /bets/2
Response: 
{
  "id": 2,
  "teams": [
    {
      "name": "Sick Dripper",
      "win": 6.376873983877747
    },
    {
      "name": "Young Strap",
      "win": 3.08505967677865
    }
  ],
  "draw": 3.535358166735343
}
```

`GET /bets-generate?size=<number>` - generates random bets for the given size

Example:
```
Resquest: GET /bets-generate?size=2
Response: 
{
  "ok": 1,
  "bets": [<generate bets>]
}
```

### Pulling websocket controls
`GET /pulling/start?rate=<number>` - starts the websocket pulling (rate is in request by second, for example, `rate=2` means one request every .5s)

Example:
```
Resquest: GET /pulling/start?rate=3
Response:
{
  "ok": 1
}
```

`GET /pulling/stop` - Stop websocket pulling

Example:
```
Resquest: GET /pulling/stop
Response:
{
  "ok": 1
}
```

### Websocket

`EVENT bet-updated` - gives an list with updated odds.

```
Response:
[
  {
    "id": 0,
    "teams": [
      {
        "name": "Big Xan",
        "win": 5.201864081220064
      },

      {
        "name": "Ill Fork Baby",
        "win": 8.27769125625313
      }
    ],
    "draw": 0.7884923091602247
  }
]
```
