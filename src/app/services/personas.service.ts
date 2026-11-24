
import { Injectable } from '@angular/core';

import { Preferences } from '@capacitor/preferences';

import {
  Directory,
  Filesystem
} from '@capacitor/filesystem';

export interface Persona {
  id: string;
  nombre: string;
  apellidos: string;
  identificacion: string;
  fotoPath: string;
  fechaRegistro: string;
}

@Injectable({
  providedIn: 'root'
})
export class PersonasService {

  private readonly CLAVE_PERSONAS = 'faceverify_personas';

  // Obtener todas las personas registradas
  async obtenerPersonas(): Promise<Persona[]> {

    const resultado = await Preferences.get({
      key: this.CLAVE_PERSONAS
    });

    if (!resultado.value) {
      return [];
    }

    try {
      return JSON.parse(resultado.value) as Persona[];
    } catch (error) {
      console.error('Error al leer personas:', error);
      return [];
    }

  }

  // Guardar una persona y su fotografía
  async guardarPersona(
    datos: Omit<Persona, 'id' | 'fotoPath' | 'fechaRegistro'>,
    fotoBase64: string
  ): Promise<Persona> {

    const personas = await this.obtenerPersonas();

    // Evitar identificaciones duplicadas
    const duplicada = personas.some(
      persona => persona.identificacion === datos.identificacion
    );

    if (duplicada) {
      throw new Error('Ya existe una persona con esa identificación.');
    }

    const id = Date.now().toString();

    const rutaFoto = `personas/${id}.jpeg`;

    // Guardar fotografía en almacenamiento privado
    await Filesystem.writeFile({
      path: rutaFoto,
      data: fotoBase64,
      directory: Directory.Data,
      recursive: true
    });

    const nuevaPersona: Persona = {
      id,
      nombre: datos.nombre,
      apellidos: datos.apellidos,
      identificacion: datos.identificacion,
      fotoPath: rutaFoto,
      fechaRegistro: new Date().toISOString()
    };

    personas.push(nuevaPersona);

    // Guardar información de las personas
    await Preferences.set({
      key: this.CLAVE_PERSONAS,
      value: JSON.stringify(personas)
    });

    return nuevaPersona;

  }

  // Recuperar fotografía para mostrarla
  async obtenerFotografia(ruta: string): Promise<string> {

    const resultado = await Filesystem.readFile({
      path: ruta,
      directory: Directory.Data
    });

    if (typeof resultado.data === 'string') {
      return `data:image/jpeg;base64,${resultado.data}`;
    }

    throw new Error('No se pudo recuperar la fotografía.');

  }

  // Eliminar una persona
  async eliminarPersona(id: string): Promise<void> {

    const personas = await this.obtenerPersonas();

    const persona = personas.find(p => p.id === id);

    if (!persona) {
      return;
    }

    await Filesystem.deleteFile({
      path: persona.fotoPath,
      directory: Directory.Data
    });

    const actualizadas = personas.filter(
      p => p.id !== id
    );

    await Preferences.set({
      key: this.CLAVE_PERSONAS,
      value: JSON.stringify(actualizadas)
    });

  }

}
