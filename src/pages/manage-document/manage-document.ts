import { DatabaseSyncService } from './../../providers/database-sync/database-sync.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams, ToastController } from 'ionic-angular';



@Component({
    selector: 'page-manage-document',
    templateUrl: 'manage-document.html',
})
export class ManageDocumentPage {

    public form: any;
    public records: any;
    public city: string = '';
    public population: string = '';
    public established: string = '';
    public docID: string = '';
    public isEditable: boolean = false;
    public title: string = 'Add a new document';
    private _COLL: string = "Britain";


    constructor(public navCtrl: NavController,
        public params: NavParams,
        private _FB: FormBuilder,
        private _DB: DatabaseSyncService,
        private toastCtrl: ToastController) {

        // Use Formbuilder API to create a FormGroup object
        // that will be used to programmatically control the
        // form / form fields in the component template
        this.form = _FB.group({
            'city': ['', Validators.required],
            'population': ['', Validators.required],
            'established': ['', Validators.required]
        });


        // If we have navigation parameters then we need to
        // parse these as we know these will be used for
        // editing an existing record
        if (params.get('isEdited')) {
            let record = params.get('record');

            this.city = record.location.city;
            this.population = record.location.population;
            this.established = record.location.established;
            this.docID = record.location.id;
            this.isEditable = true;
            this.title = 'Update this document';
        }
    }

    saveDocument(val: any): void {
        let city: string = this.form.controls["city"].value,
            population: string = this.form.controls["population"].value,
            established: string = this.form.controls["established"].value;


        // If we are editing an existing record then handle this scenario
        if (this.isEditable) {

            // Call the DatabaseProvider service and pass/format the data for use
            // with the updateDocument method
            try {
                this._DB.updateDocument(this._COLL,
                    this.docID,
                    {
                        city: city,
                        population: population,
                        established: established
                    })
                    .then((data) => {
                        console.log('Record added Online', 'The document ' + city + ' was successfully added');
                    })
                    .catch((error) => {
                        console.log('Adding Online document failed', error.message);
                    });
                this.clearForm();
                this.showToast('Record added Offline the document ' + city + ' was successfully added');
            } catch (error) {
                this.showToast('Adding Offline document failed ' + error.message);
            }
        }

        // Otherwise we are adding a new record
        else {

            // Call the DatabaseProvider service and pass/format the data for use
            // with the addDocument method
            try {
                this._DB.addDocument(this._COLL,
                    {
                        city: city,
                        population: population,
                        established: established
                    })
                    .then((data) => {
                        console.log('Record added Online', 'The document ' + city + ' was successfully added');
                    })
                    .catch((error) => {
                        console.log('Adding Online document failed', error.message);
                    });
                this.clearForm();
                this.showToast('Record added Offline the document ' + city + ' was successfully added');
            } catch (error) {
                this.showToast('Adding Offline document failed ' + error.message);
            }
        }
    }
    private showToast(message: string): void {
        this.toastCtrl.create({
            message: message,
            duration: 5000,
            position: 'bottom'
        }).present();
    }
    clearForm(): void {
        this.city = '';
        this.population = '';
        this.established = '';
        this.navCtrl.pop();
    }
}