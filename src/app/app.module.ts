import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './routing/app-routing.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { BetsListComponent } from './components/bets/bets-list.component';
import { IntroComponent } from './components/intro/intro.component';
import { BetComponent } from './components/bet/bet.component';
import { TeamCardComponent } from './components/team-card/team-card.component';
import { AppMaterialModule } from './app-material.module';
import { CommunicationService } from './services/comm.service';
import { AuthGuard } from './routing/auth-guard.service';
import { AuthService } from './routing/auth.service';
import { environment } from '../environments/environment';

import { SocketIoModule } from 'ngx-socket-io';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LangService } from './services/lang.service';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/locales/', '.json');
}
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    IntroComponent,
    BetsListComponent,
    BetComponent,
    TeamCardComponent
  ],
  imports: [
    BrowserModule,
    SocketIoModule.forRoot(environment.socketConfig),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  }),
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppMaterialModule
  ],
  providers: [
    CommunicationService,
    LangService,
    AuthGuard,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
