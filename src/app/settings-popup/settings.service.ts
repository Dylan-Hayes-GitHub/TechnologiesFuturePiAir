import { Injectable } from '@angular/core';
import { getDatabase, ref, update } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor() { }

  public storeCo2WarningLevel(value: number): void {
    const db = getDatabase();
    const storeRef = ref(db,"settings");

    update(storeRef, {
      'co2WarningLevel': value
    });

    
  }
}
