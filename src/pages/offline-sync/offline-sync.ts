import { ManageDocumentPage } from './../manage-document/manage-document';
import { DatabaseSyncService } from './../../providers/database-sync/database-sync.service';
import { Component } from '@angular/core';
import { NavController, LoadingController, Loading, ToastController } from 'ionic-angular';
import { Observable } from '@firebase/util';


@Component({
  selector: 'page-offline-sync',
  templateUrl: 'offline-sync.html',
})
export class OfflineSyncPage {

  public icon  : string = 'wifi';
  private _COLL: string = "Britain";
  private _DOC: string = "Xy76Re34SdFR1";
  private _CONTENT: any;
  public locations: Observable<Location[]>;



  constructor(
    public loadingCtrl : LoadingController,
    public navCtrl: NavController,
    private _DB: DatabaseSyncService,
    private toastCtrl: ToastController) {
    this._CONTENT = {
      city: "London",
      population: "8,787,892",
      established: "C. 43 AD"
    };

    this._DB.usersPresence(this);
  }
  ionViewDidEnter() {
    this.retrieveCollection();
  }
  
  private showLoading(): Loading {
    let loading: Loading = this.loadingCtrl.create({
      content: 'Please Wait'
    });
    loading.present();
    return loading;
  }
  generateCollectionAndDocument(): void {
    this._DB.createAndPopulateDocument(this._COLL,
      this._DOC,
      this._CONTENT)
      .then((data: any) => {
        console.dir(data);
      })
      .catch((error: any) => {
        console.dir(error);
      });
  }
  retrieveCollection(): void {
    let load = this.showLoading();
    this._DB.getDocuments(this._COLL)
      .then((data) => {

        // IF we don't have any documents then the collection doesn't exist
        // so we create it!
        if (data.length === 0) {
          this.generateCollectionAndDocument();
        }

        // Otherwise the collection does exist and we assign the returned
        // documents to the public property of locations so this can be
        // iterated through in the component template
        else {
          this.locations = data;      
        }
        load.dismiss();
      })
      .catch(err => console.log(err));
  }
  addDocument(): void {
    this.navCtrl.push(ManageDocumentPage);
  }
  updateDocument(obj): void {
    let params: any = {
      collection: this._COLL,
      location: obj
    };
    this.navCtrl.push(ManageDocumentPage, { record: params, isEdited: true });
  }
  deleteDocument(obj): void {
    console.log(obj);
    try{
    this._DB.deleteDocument(this._COLL,obj.id)
      .then((data: any) => {
        console.log('Success the record on server ' + obj.city + ' was successfully removed');
      })
      .catch((error: any) => {
        console.log('Error deleting on server'+error.message);
      });
    this.showToast('Success the record ' + obj.city + ' was successfully removed');
    this.retrieveCollection();
    }catch(error) {
      this.showToast('Error '+error.message);
    };
  }
  private showToast(message : string): void{
    this.toastCtrl.create({
      message:message,
      duration : 5000,
      position : 'bottom'
    }).present();
  }
 
}

