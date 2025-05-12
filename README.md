# Proyecto ICP-Developer  
Ejemplo rápido de un proyecto de certificación que utiliza el *Protocolo de Internet Computer* para desarrollar una red social simple.

## Detalles:
* Frontend desarrollado usando React
* Backend implementado en un canister social escrito en lenguaje Motoko. Contiene los siguientes métodos invocables:
    *  whoami () -> Principal : Devuelve el principal del llamador
    *  createPost (Text, Text) -> () : los inputs son una descripción de imagen y la URL de la imagen, añade la información a una cuenta asociada al principal del llamador
    *  getPosts () -> [(Text, Post)] : Post es un tipo personalizado, contiene información de createPost y su cuenta principal
    *  getPost (Text) -> ?Post : mismo caso que el anterior para un post específico seleccionado por un id
    *  updatePost (Text, Text) -> Bool : Cambia la descripción de la imagen (también llamada mensaje) seleccionada por el id del post
    *  deletePost (Text) -> Bool : Elimina el post seleccionado

# Instrucciones para despliegue local
Para comenzar, ejecuta los siguientes comandos:
* Instalar dependencias con: `npm install`
* Inicializar la réplica local de la red ICP: `dfx start --background --clean`
* Generar los archivos .did, **importante** para conectar backend con frontend: `dfx generate` Esto puede causar un error de panic ignorable, continúa con los siguientes pasos
* Desplegar los canisters en la red local: `dfx deploy`
* Inicializar y acceder al frontend: `npm run serve`

# Funcionalidad
* Para proceder con la actualización de imagen y obtención de posts, los usuarios necesitarán iniciar sesión en Internet Identity primero.
* Una vez iniciada sesión, los usuarios podrán crear nuevos posts completando los campos de descripción y al subir una imagen, puedes proceder haciendo clic en el botón "Create".
* Puedes editar la descripción de un post o eliminar cualquier post.
* Si los posts no se actualizan automáticamente, por favor haz clic en el botón "Refresh".

# Importante:
Se recomienda borrar la cache del navegador constantemente para evitar problemas con las identidades guardadas en el navegador. Para esto es necesario acceder a las herramientas de inspección mediante click derecho, proceder a entrar a la opción "Aplicación" que se encuentra en el menú donde aparecen los elementos "Elementos" y "Consola", finalmente se debe presionar la opción "Eliminar la información del sitio" o "Clear site data".
