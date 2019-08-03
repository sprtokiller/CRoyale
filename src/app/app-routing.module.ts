import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GameMainComponent }    from './game/game-main.component';
import { LobbyMainComponent }   from './lobby/lobby-main.component';
import { AuthGuard }            from './_guards'
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LobbyMainComponent },
 // { path: 'play/:id', component: GameMainComponent }, dodělat až bude víc zápasů --> server
  { path: 'play', component: GameMainComponent /*, canActivate: [AuthGuard] */ },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}