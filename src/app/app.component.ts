import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  param = {value: 'world'};

  constructor(private translateSvc: TranslateService) {
    this.translateSvc.setDefaultLang('en');
    this.translateSvc.use('en');
  }

  ngOnInit() {}

}
