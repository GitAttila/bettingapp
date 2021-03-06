import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IBet } from '../models/bet.model';
import { map } from 'rxjs/operators';
import { Subject, Observable, Subscription } from 'rxjs';
import { ITransformedBet } from '../models/bet-transformed.model';
import { Socket } from 'ngx-socket-io';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.socketConfig.url;
const API_ENDPOINT = '/api';
const BETS_ENDPOINT = API_ENDPOINT + '/bets/';
const SOCKET_ENDPOINT_START = API_ENDPOINT + '/pulling/start';
const SOCKET_ENDPOINT_STOP = API_ENDPOINT + '/pulling/stop';
const GENERATE_BETS_ENDPOINT = API_ENDPOINT + '/bets-generate/';

@Injectable()
export class CommunicationService {
  private lastBets = new Subject<{bets: ITransformedBet[], betsCount: number}>();

  constructor(
    public http: HttpClient,
    private socket: Socket
  ) {}

  startSocketStream(rate?: number) {
    rate = rate || 2;
    const queryParams = `?rate=${rate}`;
    this.http.get(BACKEND_URL + SOCKET_ENDPOINT_START + queryParams).subscribe();
    return this.socket.fromEvent<IBet[]>('bet-updated')
      .pipe(
        map((betsData) => {
          return this.transferToTable(betsData);
        })
      );
  }

  stopSocketStream() {
    return this.http.get(BACKEND_URL + SOCKET_ENDPOINT_STOP);
  }

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
        updated: {
          draw: false,
          home: false,
          away: false
        },
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
