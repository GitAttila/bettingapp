import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IBet } from '../models/bet.model';
import { map } from 'rxjs/operators';
import { Subject, Observable, Subscription } from 'rxjs';
import { ITransformedBet } from '../models/bet-transformed.model';

const BACKEND_URL = 'http://localhost:3000';
const BETS_ENDPOINT = '/bets/';
const GENERATE_BETS_ENDPOINT = '/bets-generate/';

@Injectable()
export class CommunicationService {
  private lastBets = new Subject<{bets: ITransformedBet[], betsCount: number}>();

  constructor(public http: HttpClient) {}

  getBet(betId: number): Observable<ITransformedBet[]> {
    return this.http.get<IBet>(BACKEND_URL + BETS_ENDPOINT + betId)
      .pipe(
        map((betsData) => {
          return this.transferToTable([betsData]);
        })
      );
  }

  getBets(): Subscription {
    return this.http.get<IBet[]>(BACKEND_URL + BETS_ENDPOINT)
      .pipe(
        map((betsData) => {
          return this.transferToTable(betsData);
        })
      )
      .subscribe((transformedData) => {
        this.lastBets.next({bets: transformedData, betsCount: transformedData.length});
      });
  }

  generateNewSetOfBets(numOfBets: number): Subscription {
    const queryParams = `?size=${numOfBets}`;
    return this.http.get<{ok: number, bets: IBet[]}>(BACKEND_URL + GENERATE_BETS_ENDPOINT + queryParams)
      .pipe(
        map((betsData) => {
          return this.transferToTable(betsData.bets);
        })
      )
      .subscribe((transformedData) => {
        this.lastBets.next({bets: transformedData, betsCount: transformedData.length});
      });
  }

  transferToTable(data: IBet[]): ITransformedBet[] {
    return data.map((betItem) => {
      const match = betItem.teams[0].name + ' - ' + betItem.teams[1].name;
      const home =  Math.round(betItem.teams[0].win * 100) / 100;
      const away =  Math.round(betItem.teams[1].win * 100) / 100;
      const draw = Math.round(betItem.draw * 100) / 100;
      return {
        id: betItem.id,
        match: match,
        draw: draw,
        home: home,
        away: away,
        teams: betItem.teams.map((team) => {
          return {
            description: team.description,
            logoPath: BACKEND_URL + '/backend/logos/' + team.logoPath,
            name: team.name,
            win: Math.round(team.win * 100) / 100
          };
        })
      };
    });
  }

  getBetsListener(): Observable<{bets: ITransformedBet[], betsCount: number}> {
    return this.lastBets;
  }

}
