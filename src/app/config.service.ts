import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private http: HttpClient) { }

  //configUrl = 'https://script.googleusercontent.com/macros/echo?user_content_key=xUGlmjrA8E8F4CMoA4BKUbwhgJ1mgZ52Ss_xTbrMcM00U3RtmRMHroZmtNVaTM5rvdHeWbm9kS5D_4khaxp8FAIEY9cAMDSUm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnHXJKIb28aHPzaXQ5nrGfFNVRy9mvetGKdlxg8ugDhYQkuW2Qe52eJsWAxzOmcxH4tveWPraiRQB&lib=MN1ajgS13ND-LejO1sw1CAe_tZcuXIiAy';
  configUrl = 'C:\Users\sprto\cookie\src\app\content\w-players\srcPlayers\MOCK_SKILL_TILES.ts'
  getTiles() {
    return this.http.get(this.configUrl);
  }

}