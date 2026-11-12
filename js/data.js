/*
  CONTENIDO DE LAS GUÍAS
  ======================
  Este es el único archivo que hay que tocar para agregar o corregir una guía.

  Cada guía tiene:
    id         nombre corto sin espacios (se usa en el enlace, por ejemplo index.html#router-fabrica)
    grupo      id de uno de los GRUPOS de abajo
    titulo     título completo
    resumen    una o dos frases de qué se logra con la guía
    portada    imagen de la tarjeta (ruta dentro de img/)
    necesitas  lista de lo que hay que tener antes de empezar
    pasos      lista de pasos. Cada paso puede tener:
                 h     título del paso (obligatorio)
                 p     explicación
                 img   captura que se muestra dentro del computador dibujado
                 cmd   comando para copiar (si no hay img, se muestra como terminal en la pantalla)
                 nota  consejo extra
    ojo        cosas que hay que tener en cuenta
    pendientes cosas que faltan por confirmar (puede quedar vacío: [])

  Ayudas para escribir:
    R("This PC","Properties")  dibuja una ruta de menús
    K("Ctrl","C")              dibuja teclas
*/

const CHEV = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>';
const R = (...a) => `<span class="ruta">${a.map(x => `<span>${x}</span>`).join(CHEV)}</span>`;
const K = (...a) => a.map(x => `<kbd>${x}</kbd>`).join(" + ");

const GRUPOS = [
  { id: "copias",  titulo: "Gestión de copias",  resumen: "Pasar ISOs o carpetas a otros equipos por la red y arrancar Clonezilla desde la USB de Ventoy para clonar o restaurar." },
  { id: "dominio", titulo: "Gestión de dominio", resumen: "Sacar un equipo del dominio labinfo cuando pierde la relación de confianza y volver a ingresarlo con las credenciales de rescate." },
  { id: "router",  titulo: "Gestión de routers", resumen: "Dejar los routers Cisco de fábrica para la siguiente práctica y recuperar el acceso cuando piden contraseña." }
];

const GUIAS = [
{
  id: "traspaso-isos", grupo: "copias", portada: "img/t_36.jpg",
  titulo: "Pasar ISOs o cualquier carpeta a otros equipos por la red",
  resumen: "Copiar archivos de un equipo a los demás de la sala usando la carpeta compartida Sistemas, sin necesidad de USB.",
  necesitas: [
    "Un equipo que ya tenga los archivos. En este ejemplo están en <code>C:\\Isos</code>.",
    "La IP de cada equipo al que vas a copiar.",
    "Que los equipos estén prendidos y conectados a la red del laboratorio."
  ],
  pasos: [
    { h: "Abre el Explorador y entra al disco C:", p: `En el equipo que ya tiene todo, abre el Explorador de archivos y entra a ${R("Este equipo", "Disco local (C:)")}.`, img: "img/t_3.jpg" },
    { h: "Revisa qué hay en la carpeta Isos", p: "Entra a <code>C:\\Isos</code>. En este caso hay tres cosas: la carpeta de <b>kali-linux</b> para VirtualBox, el ISO de <b>slackware-15.0</b> y el ISO de <b>Windows Server 2025</b>. Eso es lo que se va a repartir.", img: "img/t_6.jpg" },
    { h: "Abre otra pestaña y escribe la IP del otro equipo", p: `Abre otra pestaña del Explorador, así tienes el origen en una y el destino en la otra. En la barra de direcciones escribe <code>\\\\</code> seguido de la IP del equipo destino y dale ${K("Enter")}.`, img: "img/t_24.jpg",
      nota: "La barra de direcciones guarda las IPs que ya se usaron, así que puedes escogerlas de la lista que se despliega." },
    { h: "Entra a la carpeta Isos del otro equipo", p: `Aparece una carpeta compartida llamada <b>Sistemas</b>, que es el disco C: del otro equipo. Entra a ${R("Sistemas", "Isos")}.`, img: "img/t_36.jpg" },
    { h: "Compara qué le falta", p: "En el ejemplo, el equipo destino ya tenía Slackware y Windows Server pero <b>le faltaba la carpeta de Kali</b>. No hace falta copiar todo otra vez, solo lo que falta.", img: "img/t_54.jpg" },
    { h: "Selecciona y copia en tu pestaña", p: `Vuelve a la pestaña de <code>C:\\Isos</code>, selecciona lo que falta y cópialo con ${K("Ctrl", "C")} o con clic derecho y Copiar.`, img: "img/t_63.jpg" },
    { h: "Pega en la carpeta del otro equipo", p: `Pasa a la pestaña del otro equipo, dale clic derecho en un espacio vacío y escoge <b>Pegar</b>, o usa ${K("Ctrl", "V")}.`, img: "img/t_75.jpg" },
    { h: "Deja que copie", p: "Sale una ventana con el progreso. Puedes tener varias copias al mismo tiempo: en la captura dice <b>2 Running Actions</b> porque ya se estaba copiando a dos equipos.", img: "img/t_81.jpg",
      nota: "Los ISOs pesan varios GB, así que no apagues ni cierres sesión en ninguno de los dos equipos mientras copia." },
    { h: "Para el siguiente equipo, cambia el final de la IP", p: "Edita la barra de direcciones y cambia solo el último número de la IP, por ejemplo de <code>.3</code> a <code>.4</code>. Entra a <code>Sistemas\\Isos</code> y vuelve a pegar. Así sigues con cada equipo de la sala.", img: "img/t_90.jpg" }
  ],
  ojo: [
    "Sirve para cualquier carpeta, no solo para ISOs. Cambia <code>Isos</code> por la ruta que necesites.",
    "Mira bien la IP antes de pegar, para no llenarle el disco al equipo equivocado.",
    "Si copias a muchos equipos a la vez la red se pone lenta. Mejor de a dos o tres."
  ],
  pendientes: [
    "Falta anotar el rango de IPs de la sala.",
    "Si la carpeta Sistemas llega a pedir usuario y contraseña, ¿cuáles son?"
  ]
},
{
  id: "clonezilla-ventoy", grupo: "copias", portada: "img/v_9.jpg",
  titulo: "Arrancar Clonezilla desde la USB de Ventoy",
  resumen: "Prender un equipo desde la USB, entrar a Clonezilla y dejarlo listo en modo device-image para clonar o restaurar.",
  necesitas: [
    "La USB con Ventoy (Kingston DataTraveler), que trae el ISO de Clonezilla y el de Hiren's Boot CD.",
    "Un equipo de la sala con la USB conectada a la torre.",
    "Paciencia con la carga, que se demora casi un minuto."
  ],
  pasos: [
    { h: "Conecta la USB y prende el equipo", p: "Primero sale un mensaje corto sobre Secure Boot en pantalla negra y luego aparece el menú de Ventoy.",
      nota: `Si el equipo arranca directo a Windows, toca entrar al menú de arranque y escoger la USB. En los Dell normalmente es ${K("F12")} apenas se prende.` },
    { h: "Escoge el ISO de Clonezilla", p: `En la lista de Ventoy muévete con las flechas hasta <code>clonezilla-live-…-amd64.iso</code> (el otro es Hiren's) y dale ${K("Enter")}. Luego sale un submenú donde dejas <b>Boot in normal mode</b> y das ${K("Enter")} otra vez.`, img: "img/v_3.jpg" },
    { h: "Deja la primera opción de Clonezilla", p: "En la pantalla naranja escoge <b>Clonezilla live (Default settings, VGA 1024x768)</b>, que ya viene seleccionada.", img: "img/v_9.jpg" },
    { h: "Espera a que cargue", p: "La pantalla se pone negra y empieza a salir mucho texto. Es normal, no toques nada. Se demora como 40 segundos.", img: "img/v_30.jpg" },
    { h: "Escoge idioma y teclado", p: "En la ventana azul escoge <code>es_ES.UTF-8 Spanish</code>. Cuando pregunte por la distribución del teclado, deja la que viene por defecto.", img: "img/v_61.jpg" },
    { h: "Dale a Start_Clonezilla", p: "Entre <b>Start_Clonezilla</b> y <b>Enter_shell</b>, escoge Start_Clonezilla.", img: "img/v_65.jpg" },
    { h: "Escoge el modo device-image", p: "Deja la primera opción, <b>device-image</b>, que sirve para trabajar discos o particiones con imágenes. Abajo queda escrito <i>clonezilla mode is device-image</i>.", img: "img/v_66-2.jpg" },
    { h: "Escoge dónde va la imagen", p: "Sale otra lista para escoger dónde se guarda o se lee la imagen. Normalmente es la primera, <b>local_dev</b>, que es un disco o USB conectado al equipo." },
    { h: "Espera a que detecte los discos y sigue", p: `Clonezilla dice <i>Puede insertar un dispositivo de almacenamiento…</i> y se actualiza cada 3 segundos. Aparecen <code>/dev/sda</code> (el disco WDC de 500 GB) y <code>/dev/sdb</code> (la Kingston). Cuando veas los discos que necesitas, presiona ${K("Ctrl", "C")} para seguir.`, img: "img/v_76.jpg" }
  ],
  ojo: [
    "Lo más delicado viene después, cuando pide origen y destino. Fíjate en el nombre y el tamaño del disco, porque si los cruzas borras el equivocado.",
    "La USB de Ventoy también sale en la lista. Nunca la escojas como destino.",
    "Si la carga se queda congelada mucho más de un minuto, reinicia y prueba <b>Safe graphic settings</b> en el menú naranja."
  ],
  pendientes: [
    "Confirmar si la opción del paso 8 siempre es local_dev.",
    "Falta la segunda parte: qué hacer después del Ctrl+C para guardar o restaurar la imagen."
  ]
},
{
  id: "sacar-dominio", grupo: "dominio", portada: "img/d_5.jpg",
  titulo: "Sacar un computador del dominio",
  resumen: "Pasar un equipo del dominio labinfo a un grupo de trabajo local (GROUP), por ejemplo cuando pierde la relación con el dominio y no deja entrar con usuarios del laboratorio.",
  necesitas: [
    "Que el computador esté conectado a la red, con el cable puesto y con acceso.",
    "La contraseña del usuario local <b>admin</b> o las credenciales del usuario <b>rescate</b>.",
    "Anotar el nombre del computador (por ejemplo <code>INF-B0-17</code>), porque lo vas a necesitar al ingresarlo de nuevo."
  ],
  pasos: [
    { h: "Inicia sesión como admin o rescate", p: "Entra al equipo con el usuario <b>admin</b> o <b>rescate</b> y su contraseña." },
    { h: "Abre las propiedades de Este equipo", p: "Abre el Explorador de archivos, dale clic derecho a <b>This PC</b> (Este equipo) en el panel izquierdo y escoge <b>Properties</b>.", img: "img/d_1.jpg" },
    { h: "Entra a Domain or workgroup", p: "Se abre la ventana <b>About</b> con la información del equipo. En <b>Related links</b> dale clic a <b>Domain or workgroup</b> o a <b>Advanced system settings</b>, cualquiera de las dos sirve.", img: "img/d_2.jpg" },
    { h: "Ve a Computer Name y dale Change", p: "En la ventana <b>System Properties</b>, entra a la pestaña <b>Computer Name</b> y dale clic a <b>Change...</b>", img: "img/d_3.jpg" },
    { h: "Revisa cómo está ahora", p: "En <b>Member of</b> aparece marcado <b>Domain</b> con el dominio <code>labinfo.is.escuelaing.edu.co</code>. Así se ve un equipo que sí está en el dominio.", img: "img/d_4.jpg" },
    { h: "Cambia a Workgroup y escribe GROUP", p: "Marca <b>Workgroup</b>, escribe <code>GROUP</code> y dale <b>OK</b>.", img: "img/d_5.jpg" },
    { h: "Acepta el mensaje de bienvenida", p: "Sale el mensaje <i>Welcome to the GROUP workgroup</i>. Dale <b>OK</b>.", img: "img/d_6.jpg" },
    { h: "Acepta el aviso de reinicio", p: "Windows avisa que hay que reiniciar para aplicar los cambios. Dale <b>OK</b> y cierra la ventana System Properties.", img: "img/d_7.jpg" },
    { h: "Reinicia con Restart Now", p: "En el siguiente mensaje dale clic a <b>Restart Now</b>. Después del reinicio el computador ya no está en el dominio y solo se puede entrar con usuarios locales.", img: "img/d_8.jpg" }
  ],
  ojo: [
    "Apenas sale del dominio, los usuarios del laboratorio ya no sirven para entrar. Solo funciona la cuenta local <code>.\\admin</code>.",
    "Antes de reiniciar, guarda lo que esté abierto en el equipo.",
    "Si lo sacaste para arreglarlo, ingrésalo de nuevo con la guía <a href=\"#meter-dominio\">Ingresar un computador al dominio</a>."
  ],
  pendientes: []
},
{
  id: "meter-dominio", grupo: "dominio", portada: "img/d_9.jpg",
  titulo: "Ingresar un computador al dominio",
  resumen: "Volver a unir un equipo al dominio labinfo usando la cuenta local admin y las credenciales de rescate.",
  necesitas: [
    "Que el computador esté conectado a la red.",
    "La contraseña del usuario local <b>admin</b>.",
    "Las credenciales del usuario <b>rescate</b>, que tiene permiso para unir equipos al dominio.",
    "El nombre correcto del computador (por ejemplo <code>INF-B0-17</code>)."
  ],
  pasos: [
    { h: "Inicia sesión con .\\admin", p: "Entra con el usuario <code>.\\admin</code> y su contraseña. El <code>.\\</code> antes del usuario es importante, porque como el equipo no está en el dominio tiene que entrar con la cuenta local." },
    { h: "Llega a Computer Name/Domain Changes", p: `Haz lo mismo que en los pasos 2 a 4 de la guía para sacar del dominio: ${R("This PC", "Properties", "Domain or workgroup", "Change...")}` },
    { h: "Revisa el nombre y escribe el dominio labinfo", p: "Verifica que en <b>Computer name</b> esté el nombre correcto del equipo. Luego, en <b>Member of</b>, marca <b>Domain</b>, escribe <code>labinfo</code> y dale <b>OK</b>.", img: "img/d_9.jpg" },
    { h: "Escribe las credenciales de rescate", p: "Windows pide una cuenta con permiso para unir equipos al dominio. Escribe el usuario <b>rescate</b> con su contraseña y dale <b>OK</b>.", img: "img/d_10.jpg" },
    { h: "Acepta la bienvenida y reinicia", p: "Sale un mensaje de bienvenida al dominio. Dale <b>OK</b> y después reinicia con <b>Restart Now</b>, igual que en los pasos 8 y 9 de la otra guía." },
    { h: "Verifica que quedó en el dominio", p: "Después del reinicio, entra con un usuario del dominio. También puedes revisar en la ventana <b>About</b> que el <b>Full device name</b> termine en <code>labinfo.is.escuelaing.edu.co</code>." }
  ],
  ojo: [
    "Si el nombre del equipo está mal, cámbialo en ese mismo paso antes de dar OK. Si no, queda registrado en el dominio con el nombre equivocado.",
    "Si al entrar escribes solo <code>admin</code> sin el <code>.\\</code>, Windows intenta usar el dominio y no te deja entrar.",
    "Si dice que no encuentra el dominio, revisa el cable de red antes de volver a intentar."
  ],
  pendientes: [
    "Falta la captura del mensaje de bienvenida al dominio labinfo (paso 5)."
  ]
},
{
  id: "router-fabrica", grupo: "router", portada: "img/r_0.jpg",
  titulo: "Reiniciar un router Cisco a fábrica",
  resumen: "Dejar los routers del laboratorio de redes listos para la siguiente práctica: sin configuración guardada, sin contraseñas y sin IPs, como si salieran de la caja.",
  necesitas: [
    "El router. Sirve para todos los modelos del laboratorio (1841, 2811, 2911…), porque los comandos son los mismos.",
    "El cable de consola azul de Cisco (RJ45 a DB9) y un adaptador de serial a USB, porque los PC ya no traen puerto serial.",
    "Un PC o portátil con un puerto USB libre.",
    "PuTTY instalado."
  ],
  pasos: [
    { h: "Arma y conecta el cable de consola", p: "Conecta el extremo DB9 del cable azul al adaptador de serial a USB. El extremo RJ45 va al puerto <b>Console</b> del router, en la parte de atrás (no es un puerto Ethernet). Después conecta el USB al PC.", img: "img/r_0.jpg" },
    { h: "Mira qué puerto COM le tocó", p: "Abre el <b>Administrador de dispositivos</b> y despliega <b>Puertos (COM y LPT)</b>. Ahí sale algo como <i>USB Serial Port (COM3)</i>. Ese número es el que vas a poner en PuTTY.", img: "img/r_1.jpg" },
    { h: "Configura PuTTY y dale Open", p: "Abre PuTTY. En <b>Connection type</b> escoge <b>Serial</b>, en <b>Serial line</b> pon el COM que viste (por ejemplo <code>COM3</code>), en <b>Speed</b> pon <code>9600</code> y dale <b>Open</b>.", img: "img/r_2.jpg" },
    { h: "Si sale la pantalla negra, dale Enter", p: `Si se abre una pantalla negra sin nada, dale ${K("Enter")} un par de veces. A veces el router ya está en el prompt y solo falta que la pantalla se refresque.`, img: "img/r_3.jpg",
      nota: `Si sigue sin mostrar nada, revisa en orden que el router esté prendido, que el cable esté en el puerto Console, que el COM de PuTTY sea el mismo del Administrador de dispositivos y que en ${R("Connection", "Serial")} el <b>Flow control</b> esté en <b>None</b>. Si todo está bien, cierra PuTTY y ábrelo otra vez, porque a veces el puerto se queda pegado de una sesión anterior.` },
    { h: "Entra a modo privilegiado", p: "Cuando veas el prompt <code>Router&gt;</code>, escribe:", cmd: "enable",
      nota: "Si te pide contraseña y no la sabes, el router no está de fábrica. Sigue la guía <a href=\"#router-password\">Recuperar la contraseña de un router Cisco</a>." },
    { h: "Revisa si tiene configuración guardada", p: "Si sale <i>startup-config is not present</i>, no tiene nada guardado. Si muestra una configuración con contenido, como en la captura, no está limpio y hay que resetearlo.", cmd: "show startup-config", img: "img/r_4.jpg" },
    { h: "Revisa que no tenga IPs", p: "Todas las interfaces deben decir <code>unassigned</code> en la columna IP-Address. Si las dos revisiones salen limpias, el router ya está de fábrica y terminaste. Si alguna tiene IP o hay configuración guardada, sigue con los pasos de limpieza.", cmd: "show ip interface brief", img: "img/r_5.jpg" },
    { h: "Borra la configuración guardada", p: `Escribe el comando y confirma con ${K("Enter")} cuando pregunte. En la captura se ve un router que tenía la IP <code>10.0.0.1</code> antes de limpiarlo.`, cmd: "erase startup-config", img: "img/r_6.jpg" },
    { h: "Borra el archivo de VLANs", p: `Dale ${K("Enter")} dos veces sin escribir nada.`, cmd: "delete vlan.dat",
      nota: "Si sale <code>%Error deleting flash:vlan.dat (File not found)</code>, tranquilo. No todos los routers tienen ese archivo y no es un error real." },
    { h: "Reinicia el router", p: "Si pregunta <code>Save? [yes/no]</code>, responde <b>no</b>.", cmd: "reload", img: "img/r_7.jpg" },
    { h: "Salta el diálogo de configuración inicial", p: `Cuando termina de arrancar pregunta si quieres entrar al diálogo de configuración inicial. Responde <b>no</b>, o presiona ${K("Ctrl", "C")} para saltarlo de una vez.`, img: "img/r_8.jpg",
      nota: `Si respondes <b>yes</b> por error, el router entra al diálogo y se queda preguntando cosas, como en la captura. Sal con ${K("Ctrl", "C")}.` },
    { h: "Responde no al autoinstall", p: `Si después pregunta por autoinstall, responde <b>no</b> también. Puede tardar un rato buscando una configuración por la red. Es normal, espera o dale ${K("Ctrl", "C")}.`, img: "img/r_9.jpg" },
    { h: "Confirma que quedó limpio", p: "Cuando llegues a <code>Router&gt;</code>, vuelve a entrar con <code>enable</code> y repite las dos revisiones. Debe salir <i>startup-config is not present</i> y todas las interfaces en <code>unassigned</code>.", cmd: "enable\nshow startup-config\nshow ip interface brief" }
  ],
  ojo: [
    "En el reload, si pregunta <code>Save?</code>, siempre responde <b>no</b>. Si respondes yes, se vuelve a guardar la configuración que querías borrar.",
    "Si ves el mismo texto de arranque repetido muchas veces sin parar, el router está en un ciclo de reinicio. Puede ser falla de hardware o de la fuente, así que avisa al profesor o al encargado del laboratorio. Eso no se arregla por consola.",
    "El cable va al puerto <b>Console</b>, no a un puerto Ethernet ni al AUX."
  ],
  pendientes: []
},
{
  id: "router-password", grupo: "router", portada: "img/r_10.jpg",
  titulo: "Recuperar la contraseña de un router Cisco",
  resumen: "Entrar a un router que pide contraseña al hacer enable o al conectarse por consola, para poder dejarlo de fábrica.",
  necesitas: [
    "Estar conectado al router por consola con PuTTY, como en los pasos 1 a 3 de la guía <a href=\"#router-fabrica\">Reiniciar un router Cisco a fábrica</a>.",
    `El <b>Flow control</b> de PuTTY en <b>None</b>, dentro de ${R("Connection", "Serial")}. Con XON/XOFF el Break puede no llegar.`,
    "Acceso al botón de encendido del router, porque toca apagarlo y prenderlo."
  ],
  pasos: [
    { h: "Revisa el Flow control de PuTTY", p: `En PuTTY entra a ${R("Connection", "Serial")} y verifica que <b>Flow control</b> esté en <b>None</b>. En la captura está en XON/XOFF, que es justo lo que <b>no</b> debe quedar.`, img: "img/r_10.jpg" },
    { h: "Reinicia el router con el botón", p: "Apaga el router y préndelo de nuevo con el botón." },
    { h: "Manda un Break apenas empiece a arrancar", p: `En los primeros segundos del arranque, dale clic derecho a la barra de título de PuTTY y entra a ${R("Special Command", "Break")}. Hay que mandarlo justo al inicio, antes de que salga <i>Self decompressing the image</i>.`,
      nota: "Si se te pasa el momento, el router carga normal. Toca reiniciarlo e intentar otra vez." },
    { h: "Cambia el config-register en ROMMON", p: "Si el Break funcionó, aparece el prompt <code>rommon 1 &gt;</code>. Ahí escribe:", cmd: "confreg 0x2142", prompt: "rommon 1 >" },
    { h: "Reinicia desde ROMMON", p: "El router arranca ignorando la configuración guardada, y por eso sin contraseña.", cmd: "reset", prompt: "rommon 2 >" },
    { h: "Responde no al diálogo inicial", p: "Cuando pregunte por el diálogo de configuración inicial, responde <b>no</b>." },
    { h: "Entra sin contraseña", p: "Ya en <code>Router&gt;</code>, entra a modo privilegiado. Ahora no te debe pedir nada.", cmd: "enable", prompt: "Router>" },
    { h: "Limpia el router", p: "Sigue con la limpieza normal de la guía de fábrica, pero <b>todavía no hagas el reload</b>:", cmd: "erase startup-config\ndelete vlan.dat" },
    { h: "Devuelve el config-register a 0x2102 y reinicia", p: "Antes del reload final, deja el config-register en su valor normal. Si no lo haces, el router va a seguir ignorando la configuración cada vez que arranque. Después reinicia respondiendo <b>no</b> a <code>Save?</code>.", cmd: "config terminal\nconfig-register 0x2102\nexit\nreload" }
  ],
  ojo: [
    "No olvides el paso 9. Un router que se queda en <code>0x2142</code> parece de fábrica, pero nunca carga lo que guarden los estudiantes en la práctica.",
    "Si el Break no funciona, casi siempre es el Flow control. Revisa que esté en None."
  ],
  pendientes: []
}
];
