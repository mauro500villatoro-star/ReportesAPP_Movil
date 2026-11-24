import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonContent,
  IonButton,
  IonIcon,
  ToastController
} from '@ionic/angular';

import { addIcons } from 'ionicons';

import {
  scanOutline,
  informationCircleOutline,
  arrowForwardOutline,
  scanCircleOutline,
  peopleOutline,
  shieldCheckmarkOutline,
  personAddOutline,
  chevronForwardOutline,
  fingerPrintOutline,
  timeOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonContent,
    IonButton,
    IonIcon
  ],
})
export class HomePage {

  // Estadísticas iniciales
  totalPersonas = 0;
  totalVerificaciones = 0;

  constructor(
    private toastController: ToastController
  ) {
    addIcons({
      scanOutline,
      informationCircleOutline,
      arrowForwardOutline,
      scanCircleOutline,
      peopleOutline,
      shieldCheckmarkOutline,
      personAddOutline,
      chevronForwardOutline,
      fingerPrintOutline,
      timeOutline
    });
  }

  // Mostrar mensaje de las secciones pendientes
  async mostrarProximamente(seccion: string) {

    const toast = await this.toastController.create({
      message: `${seccion}: módulo en desarrollo.`,
      duration: 2500,
      position: 'bottom',
      color: 'primary',
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        }
      ]
    });

    await toast.present();
  }

  // Información de la aplicación
  async mostrarInfo() {

    const toast = await this.toastController.create({
      message: 'FaceVerify: sistema de registro y verificación de identidad mediante reconocimiento facial.',
      duration: 3500,
      position: 'bottom',
      color: 'dark'
    });

    await toast.present();
  }

}
