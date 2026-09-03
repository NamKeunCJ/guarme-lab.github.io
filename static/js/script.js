/* ==========================================================================
   SCRIPT PRINCIPAL - GUARME LAB
   Este archivo agrupa toda la interactividad del sitio: navegación,
   animaciones de aparición, filtros de servicios y proyectos, contador de
   estadísticas, validación del formulario de contacto y botón "volver arriba".
   Todo el código se ejecuta una vez el documento HTML termina de cargarse.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ------------------------------------------------------------------------
     1. AÑO ACTUAL EN EL PIE DE PÁGINA
     Se calcula automáticamente para que el sitio no requiera actualizarse
     manualmente cada año.
     ------------------------------------------------------------------------ */
  var elementoAnio = document.getElementById('anioActual');
  if (elementoAnio) {
    elementoAnio.textContent = new Date().getFullYear();
  }


  /* ------------------------------------------------------------------------
     2. COMPORTAMIENTO DEL MENÚ AL DESPLAZARSE
     Se añade una sombra y se reduce el tamaño del menú cuando la página
     se desplaza hacia abajo, para diferenciarlo del contenido.
     ------------------------------------------------------------------------ */
  var barraNavegacion = document.getElementById('navegacionPrincipal');

  function actualizarEstiloNavegacion() {
    if (!barraNavegacion) return;
    if (window.scrollY > 20) {
      barraNavegacion.classList.add('navegacion-principal--fija');
    } else {
      barraNavegacion.classList.remove('navegacion-principal--fija');
    }
  }
  actualizarEstiloNavegacion();
  window.addEventListener('scroll', actualizarEstiloNavegacion);


  /* ------------------------------------------------------------------------
     3. CIERRE AUTOMÁTICO DEL MENÚ MÓVIL AL SELECCIONAR UN ENLACE
     Mejora la experiencia en dispositivos pequeños, evitando que el menú
     colapsable quede abierto tras navegar a una sección.
     ------------------------------------------------------------------------ */
  var menuMovil = document.getElementById('menuGuarme');
  var enlacesMenu = document.querySelectorAll('.enlace-menu');

  enlacesMenu.forEach(function (enlace) {
    enlace.addEventListener('click', function () {
      if (menuMovil && menuMovil.classList.contains('show')) {
        var instanciaColapso = bootstrap.Collapse.getInstance(menuMovil) || new bootstrap.Collapse(menuMovil);
        instanciaColapso.hide();
      }
    });
  });


  /* ------------------------------------------------------------------------
     4. RESALTADO DEL ENLACE ACTIVO SEGÚN LA SECCIÓN VISIBLE
     Se observa cada sección principal y se marca en el menú el enlace
     correspondiente cuando esa sección ocupa la mayor parte de la pantalla.
     ------------------------------------------------------------------------ */
  var seccionesPagina = document.querySelectorAll('main section[id]');

  var observadorSecciones = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      var enlaceCorrespondiente = document.querySelector('.enlace-menu[href="#' + entrada.target.id + '"]');
      if (!enlaceCorrespondiente) return;

      if (entrada.isIntersecting) {
        enlacesMenu.forEach(function (enlace) {
          enlace.classList.remove('enlace-menu--activo');
        });
        enlaceCorrespondiente.classList.add('enlace-menu--activo');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  seccionesPagina.forEach(function (seccion) {
    observadorSecciones.observe(seccion);
  });


  /* ------------------------------------------------------------------------
     5. ANIMACIÓN DE REVELADO AL DESPLAZARSE (SCROLL REVEAL)
     Los elementos marcados con el atributo data-revelar se muestran con una
     transición suave la primera vez que ingresan al área visible del usuario.
     ------------------------------------------------------------------------ */
  var elementosRevelar = document.querySelectorAll('[data-revelar]');

  var observadorRevelado = new IntersectionObserver(function (entradas, observador) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        var elemento = entrada.target;
        var retraso = elemento.getAttribute('data-revelar-retraso') || 0;

        setTimeout(function () {
          elemento.classList.add('elemento-visible');
        }, retraso);

        observador.unobserve(elemento);
      }
    });
  }, { threshold: 0.15 });

  elementosRevelar.forEach(function (elemento) {
    observadorRevelado.observe(elemento);
  });


  /* ------------------------------------------------------------------------
     6. CONTADOR ANIMADO DE ESTADÍSTICAS
     Los números de la sección "Sobre nosotros" suben progresivamente desde
     cero hasta su valor final cuando el bloque de estadísticas se hace visible.
     ------------------------------------------------------------------------ */
  var contadores = document.querySelectorAll('[data-contador]');

  function iniciarContador(elemento) {
    var valorFinal = parseInt(elemento.getAttribute('data-valor-final'), 10) || 0;
    var duracionMs = 1400;
    var tiempoInicio = null;

    function avanzarAnimacion(marcaTiempo) {
      if (!tiempoInicio) tiempoInicio = marcaTiempo;
      var progreso = Math.min((marcaTiempo - tiempoInicio) / duracionMs, 1);
      var valorActual = Math.floor(progreso * valorFinal);
      elemento.textContent = valorActual;

      if (progreso < 1) {
        window.requestAnimationFrame(avanzarAnimacion);
      } else {
        elemento.textContent = valorFinal;
      }
    }
    window.requestAnimationFrame(avanzarAnimacion);
  }

  if (contadores.length) {
    var observadorContadores = new IntersectionObserver(function (entradas, observador) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          iniciarContador(entrada.target);
          observador.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.6 });

    contadores.forEach(function (contador) {
      observadorContadores.observe(contador);
    });
  }


  /* ------------------------------------------------------------------------
     7. PESTAÑAS DE SERVICIOS POR CATEGORÍA
     Al seleccionar una pestaña se muestran únicamente las tarjetas de
     servicio que pertenecen a la categoría elegida (tecnología, publicidad
     o fabricación).
     ------------------------------------------------------------------------ */
  var pestanasServicio = document.querySelectorAll('.pestana-servicio');
  var tarjetasServicio = document.querySelectorAll('.tarjeta-servicio-contenedor');

  pestanasServicio.forEach(function (pestana) {
    pestana.addEventListener('click', function () {
      var categoriaElegida = pestana.getAttribute('data-categoria');

      // Se actualiza la pestaña activa visualmente
      pestanasServicio.forEach(function (elemento) {
        elemento.classList.remove('activa');
      });
      pestana.classList.add('activa');

      // Se muestran solo las tarjetas que coinciden con la categoría elegida
      tarjetasServicio.forEach(function (tarjeta) {
        var perteneceACategoria = tarjeta.getAttribute('data-categoria') === categoriaElegida;
        tarjeta.classList.toggle('d-none', !perteneceACategoria);
      });
    });
  });


  /* ------------------------------------------------------------------------
     8. FILTRO DEL PORTAFOLIO DE PROYECTOS
     Funciona de forma similar a las pestañas de servicios, pero incluye la
     opción "Todos" y un mensaje cuando una categoría no tiene proyectos.
     ------------------------------------------------------------------------ */
  var botonesFiltroProyectos = document.querySelectorAll('.filtro-proyectos__boton');
  var tarjetasProyecto = document.querySelectorAll('.tarjeta-proyecto-contenedor');
  var mensajeSinProyectos = document.getElementById('mensajeSinProyectos');

  botonesFiltroProyectos.forEach(function (boton) {
    boton.addEventListener('click', function () {
      var filtroElegido = boton.getAttribute('data-filtro');

      botonesFiltroProyectos.forEach(function (elemento) {
        elemento.classList.remove('activo');
      });
      boton.classList.add('activo');

      var proyectosVisibles = 0;

      tarjetasProyecto.forEach(function (tarjeta) {
        var coincideConFiltro = filtroElegido === 'todos' || tarjeta.getAttribute('data-categoria') === filtroElegido;
        tarjeta.classList.toggle('d-none', !coincideConFiltro);
        if (coincideConFiltro) proyectosVisibles++;
      });

      if (mensajeSinProyectos) {
        mensajeSinProyectos.classList.toggle('d-none', proyectosVisibles !== 0);
      }
    });
  });


  /* ------------------------------------------------------------------------
     9. VALIDACIÓN Y ENVÍO DEL FORMULARIO DE CONTACTO
     Se aplican las validaciones nativas de Bootstrap y, si el formulario es
     válido, el mensaje se envía mediante "fetch" al servicio configurado en
     el atributo "action" del formulario (Formspree). Como GitHub Pages no
     tiene servidor propio, este servicio externo es el que se encarga de
     reenviar el mensaje al correo real de Guarme Lab (guarmelab@gmail.com).
     Mientras el ID de Formspree en el HTML no se reemplace por uno real,
     el envío fallará y se mostrará el mensaje de error.
     ------------------------------------------------------------------------ */
  var formularioContacto = document.getElementById('formularioContacto');
  var alertaEnvioExitoso = document.getElementById('alertaEnvioExitoso');
  var alertaEnvioError = document.getElementById('alertaEnvioError');
  var botonEnviarMensaje = document.getElementById('botonEnviarMensaje');

  if (formularioContacto) {
    formularioContacto.addEventListener('submit', function (evento) {
      evento.preventDefault();
      evento.stopPropagation();

      if (alertaEnvioExitoso) alertaEnvioExitoso.classList.add('d-none');
      if (alertaEnvioError) alertaEnvioError.classList.add('d-none');

      if (!formularioContacto.checkValidity()) {
        formularioContacto.classList.add('was-validated');
        return;
      }

      formularioContacto.classList.remove('was-validated');

      var textoOriginalBoton = botonEnviarMensaje ? botonEnviarMensaje.innerHTML : '';
      if (botonEnviarMensaje) {
        botonEnviarMensaje.disabled = true;
        botonEnviarMensaje.innerHTML = 'Enviando... <i class="bi bi-arrow-repeat"></i>';
      }

      var datosFormulario = new FormData(formularioContacto);

      // No se añaden encabezados personalizados a propósito: Google Apps Script
      // solo responde con los permisos de CORS necesarios cuando la solicitud
      // se mantiene "simple" (sin encabezados extra como Content-Type manual).
      fetch(formularioContacto.action, {
        method: 'POST',
        body: datosFormulario
      })
        .then(function (respuesta) { return respuesta.json(); })
        .then(function (datosRespuesta) {
          if (datosRespuesta.resultado === 'exito') {
            if (alertaEnvioExitoso) {
              alertaEnvioExitoso.classList.remove('d-none');
              alertaEnvioExitoso.setAttribute('tabindex', '-1');
              alertaEnvioExitoso.focus();
            }
            formularioContacto.reset();
            formularioContacto.classList.remove('was-validated');
          } else {
            if (alertaEnvioError) alertaEnvioError.classList.remove('d-none');
          }
        })
        .catch(function () {
          if (alertaEnvioError) alertaEnvioError.classList.remove('d-none');
        })
        .finally(function () {
          if (botonEnviarMensaje) {
            botonEnviarMensaje.disabled = false;
            botonEnviarMensaje.innerHTML = textoOriginalBoton;
          }
        });
    });
  }


  /* ------------------------------------------------------------------------
     10. BOTÓN "VOLVER ARRIBA"
     El botón permanece oculto y aparece únicamente después de que el
     usuario se desplaza más allá de la altura de una pantalla completa.
     ------------------------------------------------------------------------ */
  var botonVolverArriba = document.getElementById('botonVolverArriba');

  function actualizarVisibilidadBoton() {
    if (!botonVolverArriba) return;
    if (window.scrollY > window.innerHeight) {
      botonVolverArriba.classList.add('boton-volver-arriba--visible');
    } else {
      botonVolverArriba.classList.remove('boton-volver-arriba--visible');
    }
  }
  actualizarVisibilidadBoton();
  window.addEventListener('scroll', actualizarVisibilidadBoton);

  if (botonVolverArriba) {
    botonVolverArriba.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});
