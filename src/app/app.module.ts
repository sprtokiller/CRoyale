import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { WPlayersComponent } from './game/w-players/w-players.component';
import { WUpgradesComponent } from './game/w-upgrades/w-upgrades.component';
import { WClickerComponent } from './game/w-clicker/w-clicker.component';
import { WStatsComponent } from './game/w-stats/w-stats.component';
import { PlayerDetailComponent } from './game/w-players/player-detail/player-detail.component';
import { GameMainComponent } from './game/game-main.component';

import { LoginComponent } from './lobby/login/login.component';
import { LobbyMainComponent } from './lobby/lobby-main.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatGridListModule } from '@angular/material/grid-list'; //zmena
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import {
  MatCardModule, MatDialogModule, MatInputModule, MatTableModule,
  MatToolbarModule, MatMenuModule,MatIconModule, MatProgressSpinnerModule
} from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    WPlayersComponent,
    WUpgradesComponent,
    WClickerComponent,
    WStatsComponent,
    PlayerDetailComponent,
    LoginComponent,
    GameMainComponent,  
    LobbyMainComponent  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatGridListModule,
    FormsModule,
    MatExpansionModule,
    MatDividerModule,
    HttpClientModule,
    CommonModule, 
    MatToolbarModule,
    MatButtonModule, 
    MatCardModule,
    MatInputModule,
    MatDialogModule,
    MatTableModule,
    MatMenuModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
