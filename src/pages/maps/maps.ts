import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, AlertController, AlertOptions } from 'ionic-angular';
import { GoogleMap, GoogleMapOptions, GoogleMaps, GoogleMapsEvent, LatLng, HtmlInfoWindow } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { Vibration } from '@ionic-native/vibration';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { LocalNotifications} from '@ionic-native/local-notifications';

@Component({
  selector: 'page-maps',
  templateUrl: 'maps.html',
})
export class MapsPage {
  @ViewChild('map') mapElement: ElementRef;
   map: GoogleMap;
   latlong : LatLng;
   isEnabled: string;
  constructor(
    private localNotifications: LocalNotifications,
    private alertCtrl: AlertController,
    public locationAccuracy:LocationAccuracy,
    private diagnostic: Diagnostic,
    private vibration: Vibration,
    public navCtrl: NavController,
    public navParams: NavParams,
    public geolocation:Geolocation) {  }

  ionViewDidLoad() {
   
    this.checkIfGpsEnabled();
    
  }
  pushNotification(){
  
    this.localNotifications.schedule({
      id: 1,
      text: 'GPS ATIVO !',
      title: 'Ionic Native ',
      icon: 'https://www.shareicon.net/data/128x128/2016/08/18/810022_success_512x512.png'
    });
  }
  showAlert(title : string):void{
    let alertOptions:AlertOptions = {
      title: title,
      buttons:[
        'Ok'
      ]
    } 

    this.alertCtrl.create(alertOptions).present();
  }
  
  checkIfGpsEnabled():void{
    console.log('checkIfGpsEnabled');
    
    this.diagnostic.isGpsLocationEnabled().then((enabled)=>{
      if(enabled){
        this.loadMap();
        this.isEnabled = 'Enabled'
      }
      else{
        this.isEnabled = 'Disabled'
        this.locationAccuracy.canRequest().then((canRequest)=>{
          if(canRequest){
            this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
            .then(()=>{
                  this.checkIfGpsEnabled();
                  this.showAlert("Request successful");
                })
                .catch((error)=>{
                  this.showAlert("Request failed");
                  if(error){
                      // Android only
                      console.error("error code="+error.code+"; error message="+error.message);
                      if(error.code !== this.locationAccuracy.ERROR_USER_DISAGREED){
                          if(alert("Failed to automatically set Location Mode to 'High Accuracy'. Would you like to switch to the Location Settings page and do this manually?")){
                              this.diagnostic.switchToLocationSettings();
                          }
                      }
                  }
              }
              );
          }
      });
      }
     });
  }
  markOnMap(lat : number , lng : number , timestamp : number){

      let infoWindowContent = 
      `<div id="content"><p> Você está aqui!  ${new Date(timestamp)}</p></div>`;
      let infowindow :HtmlInfoWindow = new HtmlInfoWindow();
      infowindow.setContent(infoWindowContent);
     
          this.map.addMarker({
              title: 'Você está aqui',
              position: {
                lat: lat,
                lng: lng
              }
            })
            .then(marker => {
              infowindow.open(marker);    
              this.map.moveCamera({ target:  {lat: lat, lng: lng }});
              
            });
  
  }
  loadSubscribe(){

      let watch = this.geolocation.watchPosition({ maximumAge: 3000, timeout: 10000});
      watch.subscribe((data) => {
        console.log(`Location ${data.coords.longitude} e ${data.coords.latitude}`);
        if(this.map !== undefined){
          this.map.clear().then(()=>{
            this.markOnMap(data.coords.latitude,data.coords.longitude,data.timestamp);
          }).catch(err => console.log('sinal de gps perdeu',err));
        }
      
      });
    
  }
  loadMap() {
    console.log('loadMap');
    this.geolocation.getCurrentPosition().then((resp)=>{
       
        let mapOptions: GoogleMapOptions = {
          controls: {
            compass:false
          },
          camera: {
            target: {
              lat: resp.coords.latitude,
              lng: resp.coords.longitude
            },
            zoom: 18,
            tilt: 30
          }
        };
        this.map = GoogleMaps.create(this.mapElement.nativeElement, mapOptions);

        this.map.one(GoogleMapsEvent.MAP_READY)
        .then(() => {
          this.vibration.vibrate(1000);
          this.markOnMap(resp.coords.latitude,resp.coords.longitude ,resp.timestamp);
          this.loadSubscribe();
          this.pushNotification();
        });

        

        console.log('created map');
    });  
    
   
  }
}

