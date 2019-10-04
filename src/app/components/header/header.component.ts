import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommunicationService } from '../../services/comm.service';
import { Subscription, Subject } from 'rxjs';
import { ITransformedBet } from '../../models/bet-transformed.model';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { IBet } from '../../models/bet.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {

  public submenuTitle = 'List of sports bets';
  public badgeHidden = true;
  public numOfBets: number;
  private betsSub: Subscription;
  private destroyed = new Subject<void>();

  constructor(
    public communicationSvc: CommunicationService,
    public router: Router ) { }

  ngOnInit() {
    this.betsSub = this.communicationSvc.getBetsListener()
      .subscribe((betsData: {bets: IBet[], betsCount: number}) => {
        this.numOfBets = betsData.betsCount;
      });
    this.router.events
      .pipe(
        takeUntil(this.destroyed),
        filter((navEnd: NavigationEnd) => {
          return navEnd instanceof NavigationEnd;
        })
      )
      .subscribe((endpoint: NavigationEnd) => {
        console.log(endpoint.urlAfterRedirects);
        if (endpoint.urlAfterRedirects === '/bets') {
          this.submenuTitle = 'List of sports bets';
          this.badgeHidden = false;
        } else if (endpoint.urlAfterRedirects.search('/bets/') >= 0 ) {
          this.submenuTitle = 'Sports bet detail';
          this.badgeHidden = true;
        } else {
          this.submenuTitle = 'Welcome to SportsBets App';
          this.badgeHidden = true;
        }
      });
  }

  ngOnDeestroy() {
    this.destroyed.next();
    this.destroyed.complete();
    this.betsSub.unsubscribe();
  }
}
