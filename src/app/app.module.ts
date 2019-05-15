import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WPlayersComponent } from './content/w-players/w-players.component';
import { WUpgradesComponent } from './content/w-upgrades/w-upgrades.component';
import { WClickerComponent } from './content/w-clicker/w-clicker.component';
import { WStatsComponent } from './content/w-stats/w-stats.component';
import { PlayerDetailComponent } from './content/w-players/player-detail/player-detail.component';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatGridListModule } from '@angular/material/grid-list'; //zmena
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { SkillTileDetailComponent } from './content/w-upgrades/skill-tile-detail/skill-tile-detail.component';
@NgModule({
  declarations: [
    AppComponent,
    WPlayersComponent,
    WUpgradesComponent,
    WClickerComponent,
    WStatsComponent,
    PlayerDetailComponent,
    SkillTileDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatGridListModule,
    FormsModule,
    MatExpansionModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
