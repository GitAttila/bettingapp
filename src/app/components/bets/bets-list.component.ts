import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { IBet } from '../../models/bet.model';
import { CommunicationService } from '../../services/comm.service';
import { ITransformedBet } from '../../models/bet-transformed.model';
import { Subscription } from 'rxjs';
import { delay, map } from 'rxjs/operators';

@Component({
  selector: 'app-bets-list',
  templateUrl: './bets-list.component.html',
  styleUrls: ['./bets-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class BetsListComponent implements OnInit, OnDestroy {
  dataSource: ITransformedBet[];
  dataBeforeChange: ITransformedBet[];
  subBets: Subscription;
  subStream: Subscription;
  columnsToDisplay = ['match', 'home', 'draw', 'away', 'detail'];
  expandedElement: IBet | null;
  isLoading = true;
  btnLivePullText = 'BETS.BTN_LIVE_START';

  slider = {
    disabled: false,
    value: 20,
    min: 0,
    max: 100
  };

  constructor(public communicationSvc: CommunicationService) { }

  generateNewBets() {
    this.isLoading = true;
    this.communicationSvc.generateNewSetOfBets(this.slider.value);
  }

  onLivePullBtnClicked() {
    if (this.btnLivePullText === 'BETS.BTN_LIVE_STOP') {
      this.communicationSvc.stopSocketStream().subscribe(
        () => {
          this.btnLivePullText = 'BETS.BTN_LIVE_START';
          this.subStream.unsubscribe();
        }
      );
    } else if (this.btnLivePullText === 'BETS.BTN_LIVE_START') {
      this.btnLivePullText = 'BETS.BTN_LIVE_STOP';
      this.subStream = this.communicationSvc.startSocketStream()
        .pipe(
          map((betsData) => {
            console.log(betsData);
            return this.updateTableData(betsData);
          })
        )
        .subscribe(
          (betsData) => {
            this.dataSource = betsData;
          }
        );
    }
  }

  updateTableData(dataToUpdate: ITransformedBet[]) {
    return this.dataSource.map((itemDataSource) => {
      let res: ITransformedBet;
      const foundItem = dataToUpdate.find((item) => item.id === itemDataSource.id);
      if (foundItem) {
        res = {
          match: foundItem.match,
          teams: foundItem.teams,
          id: foundItem.id,
          draw: foundItem.draw,
          home: foundItem.home,
          away: foundItem.away,
          updated: {
            draw: foundItem.draw !== itemDataSource.draw,
            home: foundItem.home !== itemDataSource.home,
            away: foundItem.away !== itemDataSource.away
          }
        };
      } else {
        res = {
          match: itemDataSource.match,
          teams: itemDataSource.teams,
          id: itemDataSource.id,
          draw: itemDataSource.draw,
          home: itemDataSource.home,
          away: itemDataSource.away,
          updated: {
            draw: false,
            home: false,
            away: false
          }
        };
      }
      return res;
    });
  }

  tableDataUpdated(el, col) {
    if (col !== 'match' && col !== 'detail') {
      return el.updated[col];
    }
  }

  ngOnInit() {
    this.communicationSvc.getBets();
    this.subBets = this.communicationSvc.getBetsListener()
      .pipe(
        delay(500)
      )
      .subscribe((betsData: {bets: ITransformedBet[], betsCount: number}) => {
        this.dataSource = betsData.bets;
        this.slider.value = betsData.betsCount;
        this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.communicationSvc.stopSocketStream();
    this.subBets.unsubscribe();
    if (this.btnLivePullText === 'BETS.BTN_LIVE_STOP') {
    this.communicationSvc.stopSocketStream()
      .subscribe(
        () => {
          this.subStream.unsubscribe();
        });
    }
  }
}
