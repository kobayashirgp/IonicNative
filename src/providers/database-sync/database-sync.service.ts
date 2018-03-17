import { OfflineSyncPage } from './../../pages/offline-sync/offline-sync';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { AngularFirestore } from 'angularfire2/firestore';
import firebase from 'firebase';
@Injectable()
export class DatabaseSyncService {





    constructor(public _DB: AngularFirestore, public http: HttpClient) {

    }

    public usersPresence(page : OfflineSyncPage) {

        const oldRealTimeDb = firebase.database();
  
        const onlineRef = oldRealTimeDb.ref('.info/connected'); // Get a reference to the list of connections
     
        const userStatusDatabaseRef = firebase.database().ref("onlineState");
        // Firestore uses a different server timestamp value, so we'll
        // create two more constants for Firestore state.
     
        const isOfflineForDatabase = {
            state: "offline",
            last_changed: firebase.database.ServerValue.TIMESTAMP,
        };      
        onlineRef.on('value', snapshot => {   
            if (snapshot.val() == false) {
                console.log("estou offline"); 
                page.icon  = 'alert'      ;     
                return;
            };
        
            userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function () {
                page.icon  = 'wifi'  
                console.log("estou online");
                
            });
            
        });



    }
    createAndPopulateDocument(collectionObj: string,
        docID: string,
        dataObj: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._DB
                .collection(collectionObj)
                .doc(docID)
                .set(dataObj, { merge: true })
                .then((data: any) => {
                    resolve(data);
                })
                .catch((error: any) => {
                    reject(error);
                });
        });
    }

    getDocuments(collectionObj: string): Promise<any> {
        let obj = this._DB.collection<Location>(collectionObj);

        let valor = obj.snapshotChanges().map(actions => {
            return actions.map(a => {
                const data = a.payload.doc.data() as Location;
                const id = a.payload.doc.id;
                const fromCache = a.payload.doc.metadata.fromCache ? 'Cache' : 'Servidor';
                return { id, fromCache, ...data };
            })
        });
        return new Promise((resolve, reject) => {
            resolve(valor);
        });
    }

    addDocument(collectionObj: string,
        dataObj: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._DB.collection(collectionObj).add(dataObj)
                .then((obj: any) => {

                    resolve(obj);
                })
                .catch((error: any) => {
                    reject(error);
                });
        });
    }

    deleteDocument(collectionObj: string,
        docID: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this._DB
                .collection(collectionObj)
                .doc(docID)
                .delete()
                .then((obj: any) => {
                    resolve(obj);
                })
                .catch((error: any) => {
                    reject(error);
                });
        });
    }
    updateDocument(collectionObj: string,
        docID: string,
        dataObj: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this._DB
                .collection(collectionObj)
                .doc(docID)
                .update(dataObj)
                .then((obj: any) => {
                    resolve(obj);
                })
                .catch((error: any) => {
                    reject(error);
                });
        });
    }

}