import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CestyService {

  getAvatarPath(aID:number) : string{
    return("assets/resx/cookie" + aID.toString() + ".png");
  }
  constructor() { }
}
