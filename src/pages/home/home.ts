import { GeradoresService } from './../../providers/geradores/geradores.service';
import { Component } from '@angular/core';
import { NavController, LoadingController, Loading} from 'ionic-angular';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  users : any;
  constructor(
    public loadingCtrl : LoadingController,
    private geradoresService:GeradoresService,
    public navCtrl: NavController) { }

    ionViewDidLoad(){
        
        this.users = this.getUsers();
    }
    getUsers() {
      let load = this.showLoading();
      this.geradoresService.getUsers()
      .then(data => {
        this.users = data;
        load.dismiss();
      }).catch(err => {console.log(err); load.dismiss();}
      );
    }
    private showLoading(): Loading {
      let loading: Loading = this.loadingCtrl.create({
        content: 'Please Wait'
      });
      loading.present();
      return loading;
    }
}
