import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io'; //hell yea, lets succ those data

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import {
  MatCardModule, MatDialogModule, MatInputModule, MatTableModule,
  MatToolbarModule, MatMenuModule, MatIconModule, MatProgressSpinnerModule 
} from '@angular/material';
import { AlertComponent } from './lobby/alert/alert.component'; //not used
import { MatListModule } from '@angular/material/list';
import { JwtInterceptor, ErrorInterceptor, fakeBackendProvider } from './_helpers'; //tokens from tutorial
import { RegisterComponent } from './lobby/register/register.component';
import { PrivacyPolicyComponent } from './lobby/privacy-policy/privacy-policy.component';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';

const Sconfig: SocketIoConfig = { url: 'http://localhost:3001, options: {} }' };

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
    AlertComponent,
    RegisterComponent,
    PrivacyPolicyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatGridListModule,
    FormsModule,
    ReactiveFormsModule,
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
    MatProgressSpinnerModule,
    MatListModule,
    SocketIoModule.forRoot(Sconfig),
    RecaptchaModule,
    RecaptchaFormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
