import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { CommunicationService } from '../../services/comm.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ITransformedBet } from '../../models/bet-transformed.model';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-bet',
  templateUrl: './bet.component.html',
  styleUrls: ['./bet.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BetComponent implements OnInit, OnDestroy {
  betSub: Subscription;
  cardData: ITransformedBet;
  isLoading = false;

  constructor(
    public commSvc: CommunicationService,
    public route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.route.url.subscribe((url) => {
      const urlSeg = url[0].path || '';
      const urlSegId = parseInt(url[1].path, 10);
      if (urlSeg === 'bets' && typeof urlSegId === 'number') {
        this.betSub = this.commSvc.getBet(urlSegId)
          // this is a short delay to show the spinner
          .pipe(
            delay(500)
          )
          .subscribe((singleBet) => {
            this.cardData = singleBet[0];
            this.isLoading = false;
          });
      }
    });
  }

  ngOnDestroy() {
    this.betSub.unsubscribe();
  }

}
