import { MapsPage } from './../pages/maps/maps';
import { BarcodeScannerPage } from './../pages/barcode-scanner/barcode-scanner';
import { Component, ViewChild } from '@angular/core';
import { Platform, Nav} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Toast } from '@ionic-native/toast';
import { HomePage } from '../pages/home/home';
import { CameraPage } from '../pages/camera/camera';
import { FCM } from '@ionic-native/fcm';
import { Network } from '@ionic-native/network';
import { OfflineSyncPage } from '../pages/offline-sync/offline-sync';


@Component({
  templateUrl: 'app.html'
})

export class MyApp {

  @ViewChild(Nav) nav : Nav;
  pages: {title: string, component: any}[];
  rootPage:any = HomePage;


  
  constructor(
    private toast: Toast,
    private fcm: FCM,
    private network: Network,
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen) {

      this.pages = [
      {title: 'Barcode', component: BarcodeScannerPage},
      {title: 'Camera', component: CameraPage},
      {title:'Google Maps',component:MapsPage},
      {title:'Offline Sync',component:OfflineSyncPage}
    ];

    platform.ready().then(() => {
      this.firebaseCloudMessageConfig();
      this.internetConfig();
      statusBar.styleDefault();
      splashScreen.hide();
    });
    
  }
  openPage(page: {title:string,component:any}){
    this.nav.push(page.component);
  }
  firebaseCloudMessageConfig(){
    this.fcm.subscribeToTopic('marketing');

    this.fcm.getToken();
    
    

    this.fcm.onNotification().subscribe(data=>{
        if(data.wasTapped){
          this.toast.show('App fechado recebi : ' +data.email, '5000', 'center').subscribe(
            toast => {
              console.log(toast);
            }
          ); 
          console.log('App fechado recebi : ',data);        
        } else {
          this.toast.show('App aberto recebi : '+data.email, '5000', 'center').subscribe(
            toast => {
              console.log(toast);
            }
          );
          console.log('App aberto recebi : ',data);
        };
      })

    this.fcm.onTokenRefresh().subscribe(token=>{
        console.log('refresh token');
    });
  }
  internetConfig(){
    console.log('netWorkSubscribers :',this.network.downlinkMax);
    console.log('netWorkSubscribers :',this.network.type);
     this.network.onchange().subscribe(() => {
      console.log('Net changed');
      
    })
 
    this.network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-(');
    });


    this.network.onConnect().subscribe(() => {
      console.log('network connected!');
     
      setTimeout(() => {
        if (this.network.type === 'wifi') {
          console.log('we got a wifi connection, woohoo!');
        }
        else {
           // unknown, ethernet, wifi, 2g, 3g, 4g, cellular, none      
           console.log(this.network.type);
                  
        }
      }, 3000);
    });
  }
}

