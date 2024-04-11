// Definición de la función changeImage
function changeImage(imageId) {
  const imagenActual = document.getElementById('imagenActual');
  const images = {
    'imagen1': { src: 'img/imagen_ficha1.png', alt: 'Imagen 1' },
    'imagen2': { src: 'img/imagen_ficha2.png', alt: 'Imagen 2' },
    'imagen3': { src: 'img/imagen_ficha3.png', alt: 'Imagen 3' }
  };

  const image = images[imageId];
  if (image) {
    imagenActual.src = image.src;
    imagenActual.alt = image.alt;
  }
}

// Manejo del evento DOMContentLoaded
document.addEventListener("DOMContentLoaded", function() {
  const buttons = document.querySelectorAll('.ficha_boton');
  const contenidoTexto = document.getElementById("contenido_texto");

  buttons.forEach(button => {
    button.addEventListener('click', function() {
      buttons.forEach(btn => {
        btn.classList.remove('activo');
      });
      button.classList.add('activo');

      // Llama a la función changeImage con el ID correspondiente
      const imageId = button.dataset.imageId;
      changeImage(imageId);

      console.log("Botón clicado, llamando a changeImage con ID:", imageId);
    });
  });

  // Actualizar contenido de texto en función del botón
  const textUpdates = {
    'boton1': { title: "Implementación de plataformas e-learning", content: "En Etiza, ofrecemos soluciones de implementación de plataformas e-learning para empresas y organizaciones de todos los tamaños. Trabajamos en estrecha colaboración con nuestros clientes para comprender sus necesidades, objetivos específicos y metodologías educativas." },
    'boton2': { title: "Administración de plataformas e-learning", content: "En la administración de plataformas e-learning, nos encargamos de todo; desde la creación y actualización de contenidos hasta el soporte técnico y la solución de problemas. Otorgamos la asistencia y capacitación necesarias para garantizar una experiencia de aprendizaje exitosa dentro de la plataforma." },
    'boton3': { title: "Creación de material educativo", content: "Nuestro equipo de diseñadores gráficos y especialistas en multimedia está capacitado para realizar contenido visualmente atractivo que se adapte a tu marca y resuene con tu público objetivo. Nos aseguramos de que el material sea de alta calidad, que se adapte a estrategias de marketing, que sea fácil de usar y se integre en los cursos e-learning complementando la experiencia de aprendizaje y comunicación de diferentes institutos." }
  };

  buttons.forEach(button => {
    button.addEventListener('click', function() {
      const buttonId = button.id;
      const updates = textUpdates[buttonId];
      if (updates) {
        contenidoTexto.querySelector("h2").innerText = updates.title;
        contenidoTexto.querySelector("p").innerText = updates.content;
      }
    });
  });

});

// Navbar Functionality
document.addEventListener('DOMContentLoaded', function () {
  const navBarBackground = document.querySelector('.navbar');
  const navBarToggler = document.querySelector('.navbar-toggler-icon');
  const navBarLogo = document.querySelector('.navbar_logo');
  const body = document.body;
  navBarLogo.style.content = "url('img/etiza_logocolor.png')";
  
  function toggleNavbar() {
      navBarBackground.classList.toggle('navbar-blue');
      navBarLogo.classList.toggle('navbar-blue--logo');
  }

  $(document).ready(function() {
      $(".navbar-nav a").on('click', function(event) {
          toggleNavbar();
          const hash = this.hash;
          if (hash !== "") {
              $('.navbar-collapse').collapse('hide');
              $('html, body').animate({
                  scrollTop: $(hash).offset().top
              }, 800, function(){ 
                  if(history.pushState) {
                      history.pushState(null, null, hash);
                  } else {
                      window.location.hash = hash;
                  }
              });
              event.preventDefault();
          }
      });
  });
  
  navBarToggler.addEventListener('click', debounce(toggleNavbar, 300));

  window.addEventListener('scroll', () => {
    if (window.scrollY >= 56) {
        navBarBackground.classList.add('navbar-white');
        navBarLogo.style.content = "url('img/etiza_logoblanco.svg')";
      } else {
        navBarBackground.classList.remove('navbar-white');
        navBarLogo.style.content = "url('img/etiza_logocolor.png')"
      }
});

  setTimeout(() => {
      body.style.opacity = '1';
  }, 100);
});

function debounce(func, wait) {
  let timeout;
  return function () {
      const context = this,
          args = arguments;
      const later = function () {
          timeout = null;
          func.apply(context, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
  };
}
