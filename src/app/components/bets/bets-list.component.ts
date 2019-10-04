import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { IBet } from '../../models/bet.model';
import { CommunicationService } from '../../services/comm.service';
import { ITransformedBet } from '../../models/bet-transformed.model';
import { Subscription } from 'rxjs';

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
  subBets: Subscription;

  columnsToDisplay = ['match', 'home', 'draw', 'away'];
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
    this.btnLivePullText === 'stop live pull' ? this.btnLivePullText = 'start live pull' : this.btnLivePullText = 'stop live pull';
  }

  ngOnInit() {
    this.communicationSvc.getBets();
    this.subBets = this.communicationSvc.getBetsListener()
      .subscribe((betsData: {bets: ITransformedBet[], betsCount: number}) => {
        this.dataSource = betsData.bets;
        this.slider.value = betsData.betsCount;
        console.log(this.dataSource);
      });
  }

  ngOnDestroy() {
    this.subBets.unsubscribe();
  }
}
