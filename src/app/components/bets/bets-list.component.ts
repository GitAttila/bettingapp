import { Component, ViewEncapsulation, OnInit, OnDestroy, wtfLeave } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { IBet } from '../../models/bet.model';
import { CommunicationService } from '../../services/comm.service';
import { ITransformedBet } from '../../models/bet-transformed.model';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
  private destroyed = new Subject<void>();

  columnsToDisplay = ['match', 'home', 'draw', 'away', 'detail'];
  expandedElement: IBet | null;

  btnLivePullText = 'start live pull';

  slider = {
    disabled: false,
    value: 20,
    min: 0,
    max: 100
  };

  constructor(public communicationSvc: CommunicationService) { }

  generateNewBets() {
    this.communicationSvc.generateNewSetOfBets(this.slider.value);
  }

  onLivePullBtnClicked() {
    if (this.btnLivePullText === 'stop live pull') {
      this.btnLivePullText = 'start live pull';
      this.communicationSvc.stopSocketStream();
      this.dataBeforeChange = this.dataSource;
      this.destroyed.next();
      this.destroyed.complete();
    } else if (this.btnLivePullText === 'start live pull') {
      this.btnLivePullText = 'stop live pull';
      this.communicationSvc.startSocketStream()
        .pipe(
          takeUntil(this.destroyed)
        )
        .subscribe(
          (data) => {
            this.dataBeforeChange = this.dataSource;
            const updatedData = this.updateTableData(data);
            this.dataSource = updatedData;
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
          away: foundItem.away
        };
      } else {
        res = {
          match: itemDataSource.match,
          teams: itemDataSource.teams,
          id: itemDataSource.id,
          draw: itemDataSource.draw,
          home: itemDataSource.home,
          away: itemDataSource.away,
        };
      }
      return res;
    });
  }

  tableDataUpdated(el, col) {
    if (col !== 'match' && col !== 'detail') {
      if (el[col] !== this.dataBeforeChange[el.id][col]) {
        return true;
      }
      return false;
    }
  }

  ngOnInit() {
    this.communicationSvc.getBets();
    this.subBets = this.communicationSvc.getBetsListener()
      .subscribe((betsData: {bets: ITransformedBet[], betsCount: number}) => {
        this.dataSource = betsData.bets;
        this.dataBeforeChange = this.dataSource;
      });
  }

  ngOnDestroy() {
    this.communicationSvc.stopSocketStream();
    this.subBets.unsubscribe();
    this.destroyed.next();
    this.destroyed.complete();
  }
}
