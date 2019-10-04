import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BetComponent } from '../components/bet/bet.component';
import { BetsListComponent } from '../components/bets/bets-list.component';
import { IntroComponent } from '../components/intro/intro.component';
import { AuthGuard } from './auth-guard.service';


const routes: Routes = [
  { path: '', component: IntroComponent},
  { path: 'bets', component: BetsListComponent},
  { path: 'bets/:id', component: BetComponent, canActivate: [AuthGuard]},
  { path: '**', pathMatch: 'full', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
