import {
  Component,
  ChangeDetectorRef
} from '@angular/core';

import { RouterLink } from '@angular/router';

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
  fingerPrintOutline
} from 'ionicons/icons';

import { PersonasService } from '../services/personas.service';

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
    IonIcon,
    RouterLink
  ]
})
export class HomePage {

  // Total de personas registradas
  totalPersonas = 0;

  constructor(
    private toastController: ToastController,
    private personasService: PersonasService,
    private cdr: ChangeDetectorRef
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
      fingerPrintOutline
    });

  }

  // Actualizar contador cada vez que ingresamos al inicio
  ionViewWillEnter() {

    console.log('Actualizando resumen de FaceVerify');

    void this.cargarTotalPersonas();

  }

  // Consultar personas almacenadas
  async cargarTotalPersonas() {

    try {

      const personas =
        await this.personasService.obtenerPersonas();

      this.totalPersonas = personas.length;

      console.log(
        'Total de personas registradas:',
        this.totalPersonas
      );

      this.cdr.detectChanges();

    } catch (error) {

      console.error(
        'Error al consultar personas registradas:',
        error
      );

      this.totalPersonas = 0;

      this.cdr.detectChanges();

      await this.mostrarProximamente(
        'No se pudo actualizar el resumen'
      );

    }

  }

  // Mostrar notificaciones
  async mostrarProximamente(seccion: string) {

    const toast = await this.toastController.create({

      message: `${seccion}: módulo en desarrollo.`,

      duration: 2500,

      position: 'bottom',

      color: 'primary'

    });

    await toast.present();

  }

  // Información de la aplicación
  async mostrarInfo() {

    const toast = await this.toastController.create({

      message:
        'FaceVerify: sistema de registro y verificación de identidad mediante reconocimiento facial.',

      duration: 3500,

      position: 'bottom',

      color: 'dark'

    });

    await toast.present();

  }

}
