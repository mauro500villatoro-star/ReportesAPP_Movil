import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  AlertController,
  ToastController
} from '@ionic/angular';

import { addIcons } from 'ionicons';

import {
  personOutline,
  trashOutline,
  peopleOutline
} from 'ionicons/icons';

import {
  Persona,
  PersonasService
} from '../../services/personas.service';

@Component({
  selector: 'app-personas-registradas',
  templateUrl: './personas-registradas.page.html',
  styleUrls: ['./personas-registradas.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonCard,
    IonCardContent,
    IonButton,
    IonIcon
  ]
})
export class PersonasRegistradasPage {

  // Personas almacenadas
  personas: Persona[] = [];

  // Fotografías recuperadas
  fotografias: { [id: string]: string } = {};

  // Estado de carga
  cargando = true;

  constructor(
    private personasService: PersonasService,
    private alertController: AlertController,
    private toastController: ToastController,
    private cdr: ChangeDetectorRef
  ) {

    addIcons({
      personOutline,
      trashOutline,
      peopleOutline
    });

  }

  // Se ejecuta cada vez que ingresamos a la página
  ionViewWillEnter() {

    console.log('Entrando a Personas registradas');

    void this.cargarPersonas();

  }

  // Cargar personas almacenadas
  async cargarPersonas() {

    this.cargando = true;
    this.fotografias = {};

    this.cdr.detectChanges();

    console.log('1. Iniciando carga de personas');

    try {

      console.log('2. Consultando PersonasService');

      // Recuperar los registros
      const registros =
        await this.personasService.obtenerPersonas();

      this.personas = registros;

      console.log(
        '3. Personas recuperadas:',
        JSON.stringify(this.personas, null, 2)
      );

      // Mostrar la lista sin esperar las fotografías
      this.cargando = false;
      this.cdr.detectChanges();

      console.log(
        'Personas mostradas en pantalla:',
        this.personas.length
      );

      // Recuperar las fotografías
      for (const persona of this.personas) {

        try {

          console.log(
            '4. Recuperando fotografía:',
            persona.id
          );

          const fotografia =
            await this.personasService.obtenerFotografia(
              persona.fotoPath
            );

          this.fotografias[persona.id] = fotografia;

          this.cdr.detectChanges();

        } catch (error) {

          console.error(
            'Error al recuperar fotografía:',
            persona.id,
            error
          );

        }

      }

      console.log('5. Carga de registros finalizada');

    } catch (error) {

      console.error(
        'Error al cargar personas:',
        error
      );

      this.personas = [];
      this.fotografias = {};
      this.cargando = false;

      this.cdr.detectChanges();

      await this.mostrarMensaje(
        'No se pudieron cargar los registros.',
        'danger'
      );

    }

  }

  // Confirmar eliminación de una persona
  async confirmarEliminar(persona: Persona) {

    const alerta = await this.alertController.create({

      header: 'Eliminar registro',

      message:
        `¿Deseas eliminar a ${persona.nombre} ${persona.apellidos}?`,

      buttons: [

        {
          text: 'Cancelar',
          role: 'cancel'
        },

        {
          text: 'Eliminar',
          role: 'destructive',

          handler: () => {

            void this.eliminarPersona(persona);

          }
        }

      ]

    });

    await alerta.present();

  }

  // Eliminar persona y fotografía
  async eliminarPersona(persona: Persona) {

    try {

      console.log(
        'Eliminando persona:',
        persona.id
      );

      await this.personasService.eliminarPersona(
        persona.id
      );

      // Eliminar fotografía de la vista
      delete this.fotografias[persona.id];

      // Actualizar lista
      this.personas = this.personas.filter(
        p => p.id !== persona.id
      );

      this.cdr.detectChanges();

      await this.mostrarMensaje(
        'Registro eliminado correctamente.',
        'success'
      );

    } catch (error) {

      console.error(
        'Error al eliminar persona:',
        error
      );

      await this.mostrarMensaje(
        'No se pudo eliminar el registro.',
        'danger'
      );

    }

  }

  // Mostrar notificaciones
  async mostrarMensaje(
    mensaje: string,
    color: 'success' | 'warning' | 'danger' = 'success'
  ) {

    const toast = await this.toastController.create({

      message: mensaje,

      duration: 2500,

      color,

      position: 'bottom'

    });

    await toast.present();

  }

}
