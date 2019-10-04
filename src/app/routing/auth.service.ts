import { Injectable } from '@angular/core';
import { CommunicationService } from '../services/comm.service';

@Injectable()
export class AuthService {
  constructor(public communocationSvc: CommunicationService) {}
  exists = false;
  IdExists(betId: number) {
    return new Promise(
      (resolve, reject) => {
        this.communocationSvc.getBets();
        this.communocationSvc.getBetsListener().subscribe(
          (betsData) => {
            if (betId >= 0 && betId < betsData.betsCount) {
              this.exists = true;
            }
            resolve(this.exists);
          }
        );
      });
  }

}
