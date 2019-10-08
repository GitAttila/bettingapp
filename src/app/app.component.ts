import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  param = {value: 'world'};

  constructor(private translateSvc: TranslateService) {
    this.translateSvc.setDefaultLang('en');
    this.translateSvc.use('en');
  }

}
