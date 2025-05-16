import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment.prod';
import {SimulationModel} from '../model/simulation-model';

@Injectable({
  providedIn: 'root'
})
export class SimulationService {

  private http = inject(HttpClient);
  private base = environment.beUrl + '/portfolio';

  simulatePortfolio(months: number) {
    return this.http.post<SimulationModel>(this.base + '/simulate', months);
  }

}
