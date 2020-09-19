import { Component, OnInit } from '@angular/core';
import { Downloader, DownloadRequest, NotificationVisibility } from '@ionic-native/downloader/ngx';
import { File } from '@ionic-native/file/ngx';
import { Zip } from '@ionic-native/zip/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Observable, interval, Subscription } from 'rxjs';
//import { JJzip } from 'cordova-android';
//import {DecompressZip} from 'decompress-zip';
import { LoadingController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  subscription: Subscription;
  runWB:boolean = false;
  userWeb:any;
  isDownloadedFile:boolean = true;

  constructor(private downloader: Downloader,
              private file: File,
              private zip: Zip,
              private transfer: FileTransfer,
              private filePath:FilePath,
              private http: HttpClient,
              private fileOpener: FileOpener,
              private loadingController: LoadingController,
              private iab: InAppBrowser,
              private toastController: ToastController
            ) 
  {
    const source = interval(1000);
    this.subscription = source.subscribe(val => this.checkFileAvailability());
    this.presentToast();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Please extract downloaded zip file only at \n\n'+'file/storage/emulated/0/Android/data/io.ionic.starter/'+'\n/files/'+'\n and dont change name of zip file or folder',
      //duration: 2000
    });
    toast.present();
  }

  showLoader() {
    this.loadingController.create({
      message: 'Please wait...'
    }).then((res) => {
      res.present();
    });
  }

  hideLoader() {
    this.loadingController.dismiss().then((res) => {
      console.log('Loading dismissed!', res);
    }).catch((error) => {
      console.log('error', error);
    });
  }

  checkFileAvailability(){
    var ZipExtractDirectory = this.file.externalRootDirectory+'/Android/data/io.ionic.starter/files/simpleWebsiteHTMLCSSJavaScript/examples'
                  var ZipExtractFile = ZipExtractDirectory+'/user.html';

                  var downloadedZipFile = this.file.externalRootDirectory+'/Android/data/io.ionic.starter/files/simpleWebsiteHTMLCSSJavaScript.zip';
                  this.file.checkFile(downloadedZipFile,'').then(
                    ()=>{
                      this.isDownloadedFile = false;
                    }
                  ).catch(
                    ()=>{
                      this.isDownloadedFile = true;
                    }
                  )

                  this.file.checkDir(ZipExtractDirectory,'').then(
                    ()=>{
                      this.file.checkFile(ZipExtractFile,'').then(
                        ()=>{
                          this.runWB = true;
                          this.userWeb = ZipExtractFile;
                        }
                      ).catch(
                        ()=>{
                          this.runWB = false;
                          //alert('checkFile error')
                        }
                      )
                    }
                  ).catch(
                    ()=>{
                      this.runWB = false;
                      //alert('checkDir error')
                    }
                  )
  }

  runWeb(){
    //window.open(this.userWeb,'_system');
    //var ref = cordova.InAppBrowser.open(this.userWeb, '_blank', 'location=yes');
    this.iab.create(this.userWeb, '_blank', 'location=yes');
  }

  downloadWeb(url){

    var request: DownloadRequest = {
      uri: url,
      title: 'MyDownload',
      description: '',
      mimeType: '',
      visibleInDownloadsUi: true,
      notificationVisibility: NotificationVisibility.VisibleNotifyCompleted,
      destinationInExternalFilesDir: {
        dirType: '',
        subPath: 'simpleWebsiteHTMLCSSJavaScript.zip'
      }
    };

    this.showLoader();
    this.downloader.download(request)
              .then(
                (location: string) => {

                  this.hideLoader();

                  this.isDownloadedFile = false;

                  alert('plz extract your downloaded zip file at this location \n\n'+this.file.externalRootDirectory+'Android/data/io.ionic.starter/files/')

                  var ZipPath = location;
                  this.fileOpener.open(ZipPath, 'application/zip')
                  .then(
                    () => {
                    }
                  ).catch(
                    e => alert('Error opening file = '+e)
                  );
                }
              ).catch(
                (error: any) => {
                  this.hideLoader();
                  alert('downloader error = '+error)
                }
              );
  }



  // downloadWeb(){

  //   var request: DownloadRequest = {
  //     uri: "https://salestrip.blob.core.windows.net/tst-container/simpleWebsiteHTMLCSSJavaScricpt.zip",
  //     title: 'MyDownload',
  //     description: '',
  //     mimeType: '',
  //     visibleInDownloadsUi: true,
  //     notificationVisibility: NotificationVisibility.VisibleNotifyCompleted,
  //     destinationInExternalFilesDir: {
  //       dirType: 'Downloads',
  //       subPath: 'simpleWebsiteHTMLCSSJavaScript.zip'
  //     }
  //   };

  //   this.downloader.download(request)
  //             .then(
  //               (location: string) => {
  //                 alert('File downloaded at= '+location);

  //                 this.filePath.resolveNativePath(location).then((nativepath)=>{

  //                   alert('nativepath = '+nativepath);
  //                   var ZipPath = nativepath;
  //                   var ZipExtractDirectory = this.file.externalRootDirectory+'/Android/data/io.ionic.starter/files/Downloads/';

  //                   this.file.checkDir(ZipExtractDirectory,'').then(
  //                     ()=>{
  //                       this.file.checkFile(ZipPath,'').then(
  //                         ()=>{
  //                           this.zip.unzip(
  //                             ZipPath,
  //                             ZipExtractDirectory, 
  //                             (progress) => console.log('Unzipping, ' + Math.round((progress.loaded / progress.total) * 100) + '%')
  //                           )
  //                           .then(
  //                             (result) => {
  //                               alert('zip SUCCESS: '+ result);
  //                             }
  //                           ).
  //                           catch(
  //                             (error: any) => alert('zip error = '+error)
  //                           );
  //                         }
  //                       ).catch(
  //                         (error: any) => alert('checkFile error = '+error)
  //                       )
  //                     }
  //                   ).catch(
  //                     (error: any) => alert('checkDir error = '+error)
  //                   )

  //                 }).
  //                 catch(
  //                   (error: any) => alert('filePath error = '+error)
  //                 );
  //               }
  //             )
  //             .catch(
  //               (error: any) => alert('downloader error = '+error)
  //             );
  // }


  // downloadWeb(){

  //   var request: DownloadRequest = {
  //     uri: "https://salestrip.blob.core.windows.net/tst-container/simpleWebsiteHTMLCSSJavaScricpt.zip",
  //     title: 'MyDownload',
  //     description: '',
  //     mimeType: '',
  //     visibleInDownloadsUi: true,
  //     notificationVisibility: NotificationVisibility.VisibleNotifyCompleted,
  //     destinationInExternalFilesDir: {
  //       //dirType: this.file.externalRootDirectory,
  //       dirType: 'Downloads',
  //       subPath: 'simpleWebsiteHTMLCSSJavaScript.zip'
  //     }
  //   };

  //   this.downloader.download(request)
  //             .then(
  //               (location: string) => {
  //                 // var fileLocation = location;
  //                 // var fileLocation0thPosition = fileLocation.indexOf('0');
  //                 // var fileDestLocation = fileLocation.substring(0,fileLocation0thPosition);
  //                 alert('File downloaded at= '+location);
  //                 alert('root dir = '+this.file.externalRootDirectory);
  //                 //alert('File dest location = '+fileDestLocation);

  //                 this.filePath.resolveNativePath(location).then((nativepath)=>{

  //                   alert('nativepath = '+nativepath);
  //                   var ZipPath = nativepath;
  //                   var ZipExtractDirectory = this.file.externalRootDirectory+'/Android/data/io.ionic.starter/simpleWebsiteHTMLCSSJavaScript/';

  //                   // this.fileOpener.open(ZipPath, 'application/zip')
  //                   // .then(() => alert('File is opened'))
  //                   // .catch(e => alert('Error opening file = '+e));
                    

  //                   this.zip.unzip(
  //                     ZipPath,
  //                     //location,
  //                     //this.file.externalRootDirectory+'/Android/data/io.ionic.starter/files/file%3A/storage/emulated/0/simpleWebsiteHTMLCSSJavaScript.zip', 
  //                     ZipExtractDirectory, 
  //                     (progress) => console.log('Unzipping, ' + Math.round((progress.loaded / progress.total) * 100) + '%'))
  //                     .then(
  //                       (result) => {
  //                         alert('zip SUCCESS: '+ result);
  //                       }
  //                     ).
  //                     catch(
  //                       (error: any) => alert('zip error = '+error)
  //                     );


                    

  //                 }).
  //                 catch(
  //                   (error: any) => alert('filePath error = '+error)
  //                 );
                  
  //               }
  //             )
  //             .catch(
  //               (error: any) => alert('downloader error = '+error)
  //             );
  // }

}
