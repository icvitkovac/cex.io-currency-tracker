import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';
import { LastPriceService } from '../../app/shared/LastPrice.service';
import { LastPrice } from '../../app/shared/lastPrice';
import { MapToIterablePipe } from '../../app/shared/mapToIterable.pipe';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [MapToIterablePipe]
})
export class HomePage {

  public items = new Map();
  public coin = '';
  public currency = '';

  addPair() {
    let key = `${this.coin}/${this.currency}`.toUpperCase();
    this.getLastPrice(key);
  }

  removePair(key: string, i: number) {
    this.storage.remove(key);
    this.items.delete(key);
  }

  getLastPrice(key: string) {
    this.lastPriceService.getLastPriceForPair(key)
      .subscribe(data => {
        this.storePrice(key, data.lprice);
      })
  }

  getLastPrices(refresher) {
    this.lastPriceService.getLastPrices()
      .subscribe(rawDataObj => {
        this.extractRawPrices(rawDataObj.data);
        if (refresher) refresher.complete();
      })
  }

  extractRawPrices(rawData: LastPrice[]) {
    rawData.forEach(element => {

      let elementPair = `${element.symbol1}/${element.symbol2}`.toUpperCase()

      if (this.items.has(elementPair)) {
        this.storePrice(elementPair, element.lprice);
      }
    });

  }

  storePrice(key, value) {
    this.items.set(key, value);
    this.storage.set(key, value);
  }

  readStorageData() {
    this.storage.forEach((value, key) => {
      this.items.set(key, value);
    })
  }

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Delete storage?',
      message: 'Warning: this will remove ALL data!',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.storage.clear();
            this.items.clear();
          }
        },
        {
          text: 'Cancel'
        }
      ]
    });
    confirm.present();
  }

  constructor(public navCtrl: NavController, private storage: Storage, public alertCtrl: AlertController, private lastPriceService: LastPriceService) { }

  ngOnInit() {
    this.readStorageData();
    this.getLastPrices(null);
  }

}
