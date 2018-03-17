import { FileTransfer, FileUploadOptions, FileTransferObject, FileUploadResult, FileTransferError } from '@ionic-native/file-transfer';
import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController,  Platform, LoadingController, ToastController, Loading } from 'ionic-angular';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';
import { File, Entry } from '@ionic-native/file';

@Component({
  selector: 'page-camera',
  templateUrl: 'camera.html',
})
export class CameraPage {

  photo : Entry;
  constructor(
    public file: File,
    public filePath: FilePath,
    public asc: ActionSheetController,
    public camera :Camera,
    public navCtrl: NavController,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public navParams: NavParams,
    public transfer : FileTransfer
  ) {
  }
  onActionSheet() : void{
    this.asc.create(
      {
        title : 'select image source',
        buttons: [
          {
          text : 'Load from library',
          handler: ()=>{
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
            }
          },
          {
            text:'Use Camera',
            handler: ()=>{
              this.takePicture(this.camera.PictureSourceType.CAMERA);
            }
          },
          {
            text:'Cancel'
          }
        ]
       },
    ).present();

  }
  onUpload():void{
    let serverURL : string = 'https://kobayashi.now.sh';

    let options  : FileUploadOptions = {
      fileKey: 'photo',
      fileName: this.photo.name,
      chunkedMode:false,
      mimeType : 'multipart/form-data',
      params : {
        upload: new Date().getTime()
      }
    };

    const fileTransfer :FileTransferObject = this.transfer.create();

    let loading : Loading = this.loadingCtrl.create({
      content: 'Loading....'
    });

    loading.present();
    fileTransfer.upload(this.photo.nativeURL,`${serverURL}/upload`,options)
      .then((data:FileUploadResult)=> {

        this.showToast('Image successfully uploaded!');
        console.log('Uploaded to: ', `${serverURL}/photo/${this.photo.name}`);
        loading.dismiss();
      }).catch((err : FileTransferError) => {
        this.showToast('Error uploud!');
        console.log('error while upload file',err);
        loading.dismiss();
      });
  }
  private showToast(message : string): void{
    this.toastCtrl.create({
      message:message,
      duration : 3000,
      position : 'top'
    }).present();
  }
  takePicture(sourceType:number):void{
      let cameraOptions : CameraOptions = {
          correctOrientation : true,
          quality: 100,
          saveToPhotoAlbum : false,
          sourceType : sourceType
      };

      this.camera.getPicture(cameraOptions)
        .then((fileUri :string)=> {
          console.log('Photo: ',fileUri);
         
          this.saveFile(fileUri,sourceType)
            .then((entry:Entry)=> {
                  this.photo = entry;
                  console.log('entry',entry);
                  
            });
          
        }).catch((err :Error) => console.log(err));
        
  }
  private correctPathAndGetFileName(fileUri: string, sourceType: number): Promise<{ oldFilePath: string, oldFileName: string }> {
    if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
          return this.filePath.resolveNativePath(fileUri)
    .then((correctFileUri: string) => {
       return {
              oldFilePath: correctFileUri.substr(0, (correctFileUri.lastIndexOf('/') + 1)),
              oldFileName: fileUri.substring(fileUri.lastIndexOf('/') + 1, fileUri.lastIndexOf('?'))
            };
    }).catch((error: Error) => {
          let errorMsg: string = 'Erro ao corrigir o caminho da imagem';
          console.log(errorMsg);
          return Promise.reject(errorMsg);
    });
    }
    return Promise.resolve({
      oldFilePath: fileUri.substr(0, fileUri.lastIndexOf('/') + 1),
      oldFileName: fileUri.substr(fileUri.lastIndexOf('/') + 1)
    });
  }
  private createNewFileName(oldFileName:string):string{
    let extension : string = oldFileName.substr(oldFileName.lastIndexOf('.')); //extensão do arquivo

    return new Date().getTime() + extension;
  }
  private saveFile(fileUri:string , sourceType:number): Promise<Entry>{
      return this.correctPathAndGetFileName(fileUri,sourceType)
      .then((data: {oldFilePath:string,oldFileName: string}) => {
         return this.file.copyFile(data.oldFilePath,data.oldFileName,this.file.dataDirectory,this.createNewFileName(data.oldFileName))
          .catch(err => Promise.reject(err));
         
      }).catch(err => Promise.reject("error saveFile"));
      ;
  }
}
