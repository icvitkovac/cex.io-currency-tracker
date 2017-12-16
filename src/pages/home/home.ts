import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';
import { LastPriceService } from '../../app/shared/LastPrice.service';




@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public items = [];
  public coin = '';
  public currency = '';


  addItem() {
    let key = `${this.coin}/${this.currency}`.toUpperCase();
    this.getLastPrice(key);
  }

  removeItem(key: string, i: number) {
    this.storage.remove(key);
    this.items.splice(i, 1);
  }

  getLastPrice(key: string) {
    this.lastPriceService.getLastPriceForPair(key)
      .subscribe(data => {
        this.items.push({ header: key, value: data.lprice });
        this.storage.set(key, data.lprice);
      })
  }


  refreshPrices(refresher) {
    this.items = [];
    this.storage.forEach((value, key) => {
      this.getLastPrice(key);
      if(refresher) refresher.complete();
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
            this.items = [];
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
    this.refreshPrices(null);
  }


}
