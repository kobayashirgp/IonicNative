import { ManageDocumentPage } from './../pages/manage-document/manage-document';
import { DatabaseSyncService } from './../providers/database-sync/database-sync.service';
import { OfflineSyncPage } from './../pages/offline-sync/offline-sync';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { MapsPage } from './../pages/maps/maps';
import { CameraPage } from './../pages/camera/camera';
import { BarcodeScannerPage } from './../pages/barcode-scanner/barcode-scanner';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera} from '@ionic-native/camera';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { FileTransfer} from '@ionic-native/file-transfer';
import { StatusBar } from '@ionic-native/status-bar';
import { FilePath } from '@ionic-native/file-path';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { File } from '@ionic-native/file';
import { Vibration } from '@ionic-native/vibration';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Network } from '@ionic-native/network';
import { FCM } from '@ionic-native/fcm';
import { Toast } from '@ionic-native/toast';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { GeradoresService } from '../providers/geradores/geradores.service';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFirestoreModule } from 'angularfire2/firestore';

export const firebaseConfig = {
  apiKey: 'AIzaSyABlzno2cJwdLCZKiyEmMHxMwgmFni0ydg',
  authDomain: 'ionicnative-9788d.firebaseapp.com',
  projectId: "ionicnative-9788d",
  messagingSenderId: "967291394300",
  databaseURL: "https://ionicnative-9788d.firebaseio.com",
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    BarcodeScannerPage,
    CameraPage,
    MapsPage,
    OfflineSyncPage,
    ManageDocumentPage
  ],
  imports: [
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFirestoreModule.enablePersistence(),
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp,{
      mode: 'ios'
   })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    BarcodeScannerPage,
    CameraPage,
    MapsPage,
    OfflineSyncPage,
    ManageDocumentPage
  ],
  providers: [
    File,
    BarcodeScanner,
    StatusBar,
    SplashScreen,
    Camera,
    FCM,
    FilePath,
    FileTransfer,
    GoogleMaps,
    Geolocation,
    Vibration,
    Toast,
    Diagnostic, 
    LocationAccuracy,
    LocalNotifications,
    Network,
    HttpClientModule,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GeradoresService,
    DatabaseSyncService
  ]
})
export class AppModule {}
