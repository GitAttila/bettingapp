import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { CommunicationService } from '../../services/comm.service';
import { Subscription, Subject } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { IBet } from '../../models/bet.model';
import { LangService } from '../../services/lang.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit, OnDestroy {

  public submenuTitle = 'INTRO.TITLE';
  public badgeHidden = true;
  public numOfBets: number;
  private betsSub: Subscription;
  private langSub: Subscription;
  private destroyed = new Subject<void>();
  public langSelected = {en: true, cz: false};

  constructor(
    private langSvc: LangService,
    private translateSvc: TranslateService,
    public communicationSvc: CommunicationService,
    public router: Router ) { }

  onLangSelect(lang?: string) {
    lang = (lang || 'en').toLowerCase();
    if (lang === 'en') {
      this.langSvc.setActiveLang(lang);
      this.langSelected.en = true;
      this.langSelected.cz = false;
    } else if (lang === 'cz') {
      this.langSvc.setActiveLang(lang);
      this.langSelected.en = false;
      this.langSelected.cz = true;
    }
  }

  ngOnInit() {
    this.langSub = this.langSvc.getActiveLang()
      .subscribe((lngData) => {
        if (lngData.lang === 'en') {
          this.langSelected = { en: true, cz: false };
          this.translateSvc.use(lngData.lang);
        } else if (lngData.lang === 'cz') {
          this.langSelected = { en: false, cz: true };
          this.translateSvc.use(lngData.lang);
        }
      });

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
        if (endpoint.urlAfterRedirects === '/bets') {
          this.submenuTitle = 'BETS.TITLE';
          this.badgeHidden = false;
        } else if (endpoint.urlAfterRedirects.search('/bets/') >= 0 ) {
          this.submenuTitle = 'BET_DETAIL.TITLE';
          this.badgeHidden = true;
        } else {
          this.submenuTitle = 'INTRO.TITLE';
          this.badgeHidden = true;
        }
      });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
    this.betsSub.unsubscribe();
    this.langSub.unsubscribe();
  }
}
