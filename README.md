# ZΞN-BOT BASE

**Está es una base profesional para el desarrollo y mantenimiento de bots de WhatsApp. Este documento proporciona una guía concisa para su instalación en Termux, así como enlaces a recursos oficiales del proyecto.

## Requisitos previos

Para la instalación y ejecución del bot en un entorno Termux, se requieren las siguientes herramientas:

*   **Termux**: Un emulador de terminal para Android. **Es crucial descargar Termux desde F-Droid [1] y no desde Google Play Store**, ya que la versión de Play Store está desactualizada y puede causar problemas de compatibilidad.
*   **Node.js**: Entorno de ejecución de JavaScript. Se recomienda una versión moderna para asegurar la compatibilidad.
*   **Git**: Sistema de control de versiones, necesario para clonar el repositorio del bot.
*   **FFmpeg**: Biblioteca para el procesamiento de audio y video, fundamental para las funcionalidades multimedia del bot (ej. creación de stickers, conversiones).

## Instalación en Termux

Siga los siguientes pasos para configurar y ejecutar el bot en su dispositivo Android utilizando Termux:

1.  **Actualización de Termux e instalación de dependencias del sistema:**
    ```bash
    pkg update && pkg upgrade
    pkg install git nodejs yarn ffmpeg -y
    ```

2.  **Clonación del repositorio de la base:**
    ```bash
    git clone https://github.com/Axelixx09/zenbot-base.git
    cd zenbot-base
    ```
    *(Nota: Asegúrese de utilizar la URL correcta del repositorio si esta difiere.)*

3.  **Instalación de dependencias de Node.js:**
    ```bash
    npm install o yarn install
    ```

4.  **Inicio del bot:**
    ```bash
    npm start
    ```

    Durante el primer inicio, si la opción `usePairingCode` está habilitada en la configuración, se le solicitará un número de teléfono (sin el prefijo `+`). Posteriormente, se generará un código de emparejamiento que deberá introducir en la sección de dispositivos vinculados de su aplicación de WhatsApp principal.

## Configuración inicial

El archivo `config.js` centraliza los parámetros de configuración del bot. Es indispensable ajustar el `ownerNumber` para habilitar los comandos exclusivos del propietario.

1.  **Edición de `config.js`:**
    Acceda al archivo `config.js` utilizando un editor de texto (ej. `nano config.js` en Termux).

2.  **Actualización de `ownerNumber`:**
    Localice la propiedad `ownerNumber: [\'549XXXXXXXXXX\'],` y sustituya `549XXXXXXXXXX` por su número de WhatsApp completo, incluyendo el código de país pero sin el signo `+`.

    ```javascript
    // Ejemplo en config.js
    const config = {
      // ... otras configuraciones
      ownerNumber: [\'TUNUMEROCOMPLETO\'], // Reemplace con su número de teléfono
      // ... otras configuraciones
    }
    ```

3.  **Guardar y reiniciar:**
    Guarde los cambios y reinicie el bot (`npm start`) para aplicar la nueva configuración.

## Apoyo al proyecto

Si este proyecto le resulta de utilidad, considere mostrar su apoyo dejando una estrella (⭐) en el repositorio de GitHub. Su contribución es valiosa para el mantenimiento y desarrollo continuo.

## Enlaces oficiales

Le invitamos a unirse a nuestros canales oficiales para recibir actualizaciones, soporte y participar en la comunidad:

*   **Canal oficial de WhatsApp:** [https://whatsapp.com/channel/0029Vb6OR9O2v1IvoXO5oT2c](https://whatsapp.com/channel/0029Vb6OR9O2v1IvoXO5oT2c)
*   **Grupo oficial de WhatsApp:** [https://chat.whatsapp.com/L2i8cX4uDbxFht6oD2c2sf](https://chat.whatsapp.com/L2i8cX4uDbxFht6oD2c2sf)

## Créditos

Base desarrollada por AXELDEV09.

## Referencias

[1]: https://f-droid.org/en/packages/com.termux/ "Termux en F-Droid"
