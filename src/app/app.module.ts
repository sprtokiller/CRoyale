import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WPlayersComponent } from './content/w-players/w-players.component';
import { WUpgradesComponent } from './content/w-upgrades/w-upgrades.component';
import { WClickerComponent } from './content/w-clicker/w-clicker.component';
import { WStatsComponent } from './content/w-stats/w-stats.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatGridListModule } from '@angular/material/grid-list'; 

@NgModule({
  declarations: [
    AppComponent,
    WPlayersComponent,
    WUpgradesComponent,
    WClickerComponent,
    WStatsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatGridListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
