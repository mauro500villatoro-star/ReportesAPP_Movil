
import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonInput,
  IonCard,
  IonCardContent,
  ToastController
} from '@ionic/angular';

import {
  Camera,
  CameraResultType,
  CameraSource
} from '@capacitor/camera';

import { Filesystem } from '@capacitor/filesystem';

import { addIcons } from 'ionicons';

import {
  cameraOutline,
  imagesOutline,
  personOutline,
  saveOutline,
  arrowBackOutline
} from 'ionicons/icons';

import { PersonasService } from '../../services/personas.service';

@Component({
  selector: 'app-register-person',
  templateUrl: './register-person.page.html',
  styleUrls: ['./register-person.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonInput,
    IonCard,
    IonCardContent
  ]
})
export class RegisterPersonPage {

  nombre = '';
  apellidos = '';
  identificacion = '';

  fotoPreview: string | null = null;

  constructor(
    private toastController: ToastController,
    private ngZone: NgZone,
    private personasService: PersonasService
  ) {
    addIcons({
      cameraOutline,
      imagesOutline,
      personOutline,
      saveOutline,
      arrowBackOutline
    });
  }

  // Seleccionar fotografía desde cámara o galería
  async seleccionarFoto(origen: 'cámara' | 'galería') {

    try {

      const imagen = await Camera.getPhoto({
        quality: 85,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: origen === 'cámara'
          ? CameraSource.Camera
          : CameraSource.Photos
      });

      this.ngZone.run(() => {
        this.fotoPreview = imagen.webPath ?? null;
      });

      if (this.fotoPreview) {
        await this.mostrarMensaje(
          'Fotografía seleccionada correctamente.',
          'success'
        );
      }

    } catch (error) {

      console.error('Error al obtener fotografía:', error);

      await this.mostrarMensaje(
        'No se pudo obtener la fotografía.',
        'warning'
      );

    }
  }

  // Mostrar notificaciones
  async mostrarMensaje(
    mensaje: string,
    color: 'primary' | 'success' | 'warning' | 'danger' = 'primary'
  ) {

    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2500,
      color,
      position: 'bottom'
    });

    await toast.present();
  }

  // Convertir fotografía a Base64
  private async convertirFotoBase64(): Promise<string> {

    if (!this.fotoPreview) {
      throw new Error('No hay fotografía seleccionada.');
    }

    const respuesta = await fetch(this.fotoPreview);
    const blob = await respuesta.blob();

    return await new Promise((resolve, reject) => {

      const lector = new FileReader();

      lector.onload = () => {

        const resultado = lector.result as string;
        const base64 = resultado.split(',')[1];

        if (base64) {
          resolve(base64);
        } else {
          reject(new Error('No se pudo convertir la fotografía.'));
        }

      };

      lector.onerror = () => {
        reject(new Error('Error al leer la fotografía.'));
      };

      lector.readAsDataURL(blob);

    });
  }

  // Guardar persona
  async guardarPersona() {

  if (
    !this.nombre.trim() ||
    !this.apellidos.trim() ||
    !this.identificacion.trim()
  ) {
    await this.mostrarMensaje(
      'Completa todos los campos de información personal.',
      'warning'
    );
    return;
  }

  if (!this.fotoPreview) {
    await this.mostrarMensaje(
      'Debes agregar una fotografía de referencia.',
      'warning'
    );
    return;
  }

  try {

    await this.mostrarMensaje(
      'Guardando información...',
      'primary'
    );

    const fotoBase64 = await this.convertirFotoBase64();

    await this.personasService.guardarPersona(
      {
        nombre: this.nombre.trim(),
        apellidos: this.apellidos.trim(),
        identificacion: this.identificacion.trim()
      },
      fotoBase64
    );

    await this.mostrarMensaje(
      '¡Persona registrada correctamente!',
      'success'
    );

    this.nombre = '';
    this.apellidos = '';
    this.identificacion = '';
    this.fotoPreview = null;

  } catch (error) {

    console.error('Error al guardar persona:', error);

    const mensaje = error instanceof Error
      ? error.message
      : 'No se pudo guardar la persona.';

    await this.mostrarMensaje(mensaje, 'danger');

  }
} 
}
