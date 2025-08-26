// js/portfolio.js - simple data-driven renderer
// Loads data/portfolio.json and injects thumbnails and modals into the page.

// Una vez que el DOM esta cargado, carga los datos del JSON central
document.addEventListener('DOMContentLoaded', async () => {
  const data = await loadPortfolioData();
  if (!data || data.length === 0) {
    console.warn('portfolio.js: no data found or empty array. Check Network tab for data/portfolio.json');
    return;
  }
  try {
    render(data);
  } catch (e) {
    console.error('portfolio.js: error while rendering portfolio items', e);
  }
});

//Busca en rutas concretas el JSON que contiene los datos a utilizar
async function loadPortfolioData() {
  try {
    const tryPaths = [
      'data/portfolio.json',
      '/data/portfolio.json',
      window.location.origin + '/data/portfolio.json'
    ];

    for (const p of tryPaths) {
      try {
        const res = await fetch(p, { cache: 'no-cache' });
        if (!res.ok) {
          console.debug('portfolio.js: fetch', p, 'returned', res.status);
          continue;
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          console.log(`portfolio.js: loaded ${data.length} items from ${p}`);
          return data;
        }
      } catch (e) {
        console.debug('portfolio.js: fetch failed for', p, e);
      }
    }
    throw new Error('Could not fetch data/portfolio.json from any known path');
  } catch (e) {
    console.warn('Could not load data/portfolio.json:', e);
    return [];
  }
}

//Crea la miniatura del elemento
function createImageThumb(item) {
  const img = document.createElement('img');
  img.className = 'img-fluid';
  img.alt = item.title || '';
  img.loading = 'lazy';
  img.src = item.thumb || item.large;
  return img;
}

//Crea la miniatura del video
function createVideoThumb(item) {
  if (item.poster) {
    const img = document.createElement('img');
    img.className = 'img-fluid';
    img.alt = item.title || '';
    img.loading = 'lazy';
    img.src = item.poster;
    return img;
  }
  const video = document.createElement('video');
  video.className = 'img-fluid';
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = 'metadata';
  const s = document.createElement('source');
  s.src = item.thumb || item.large;
  s.type = 'video/mp4';
  video.appendChild(s);
  video.addEventListener('canplay', () => { try { video.play(); } catch (e) {} });
  return video;
}

//Renderiza los elementos del portfolio segun su categoria
function render(items) {
  items.forEach(item => {
    const section = document.getElementById(item.section); //Busca el contenedor con el id asociado al elemento
    if (!section) return; // si no lo encuentra, se lo salta

    // Busca el contenedor hijo preferido de la sección .container para seguir la estructura HTML en index.html
    const containerEl = section.querySelector('.container') || section;

    //Busca siguiente contenedor
    let sectionModalsContainer = containerEl.querySelector('.row.justify-content-center');

    //Crea el contenedor del elemento del portfolio
    
        const col = document.createElement('div');
        // usar las mismas clases que en el HTML estático para mantener spacing y responsive
        col.className = 'col-md-6 col-lg-4 mb-5 mb-lg-0';

        // Crear el contenedor .portfolio-item que contiene el overlay y la media
        const itemWrap = document.createElement('div');
        itemWrap.className = 'portfolio-item mx-auto';
        itemWrap.setAttribute('data-bs-toggle', 'modal');
        itemWrap.setAttribute('data-bs-target', `#${item.id}-modal`);

        // overlay (lo que aparece al hover) — copia del HTML estático
        const overlay = document.createElement('div');
        overlay.className = 'portfolio-item-caption d-flex align-items-center justify-content-center h-100 w-100';

        // map section 
        const sectionIcons = {
          videojuegos: 'fas fa-gamepad fa-3x',
          modelos3d: 'fa-solid fa-laptop fa-3x',
          animacion: 'fa-solid fa-paintbrush fa-3x',
          concept: 'fa-solid fa-image fa-3x'
        };
        const iconClass = sectionIcons[item.section] || 'fas fa-gamepad fa-3x';
        overlay.innerHTML = `<div class="portfolio-item-caption-content text-center text-white"><p class="lead">Haz click para ver más detalles sobre este proyecto</p><i class="${iconClass}"></i></div>`;

        itemWrap.appendChild(overlay);

        // Thumbnail: si es video usamos createVideoThumb, si es imagen createImageThumb
        const thumb = (item.type === 'video') ? createVideoThumb(item) : createImageThumb(item);
        // añadir estilo redondeado para que coincida con los otros elementos
        if (thumb.tagName && thumb.tagName.toLowerCase() === 'img') {
          thumb.classList.add('rounded');
        } else if (thumb.tagName && thumb.tagName.toLowerCase() === 'video') {
          thumb.classList.add('rounded');
          thumb.classList.add('w-100');
        }
        itemWrap.appendChild(thumb);

        // Añadir al grid
        col.appendChild(itemWrap);
        sectionModalsContainer.appendChild(col);

    // modal
    const modal = document.createElement('div');
    modal.className = 'portfolio-modal modal fade';
    modal.id = `${item.id}-modal`;
    modal.tabIndex = -1;
    modal.setAttribute('aria-hidden', 'true');

    // Build modal HTML with optional sections: subtitle, icon, platforms, embed, responsibilities, github
    const iconHtml = item.icon ? `<div class="divider-custom"><div class="divider-custom-line"></div><div class="divider-custom-icon"><i class="${item.icon}"></i></div><div class="divider-custom-line"></div></div>` : '';
    const subtitleHtml = item.subtitle ? `<h3>${item.subtitle}</h3>` : '';

    modal.innerHTML = `
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0">
            <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body text-center pb-5">
            <div class="container">
              <div class="row justify-content-center">
                <div class="col-lg-8">
                  <h2 class="portfolio-modal-title text-secondary text-uppercase mb-0">${item.title || ''}</h2>
                  ${iconHtml}
                  ${subtitleHtml}
                  <div class="modal-media mb-4"></div>
                  <p class="mb-1">${item.description || ''}</p>
                  <div class="platforms mb-3"></div>
                  <div class="embed-area mb-3"></div>
                  <div class="responsibilities mb-3"></div>
                  <div class="images mb-3"></div>
                  <div class="videos mb-3"></div>
                  <div class="github-link mb-3"></div>
                  <button class="btn btn-primary" data-bs-dismiss="modal">Cerrar Ventana</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // fill media
    const media = modal.querySelector('.modal-media');
    if (item.type === 'video') {
      const v = document.createElement('video');
      v.controls = true;
      v.className = 'w-100';
      if (item.poster) v.poster = item.poster;
      const s = document.createElement('source');
      s.src = item.large;
      s.type = 'video/mp4';
      v.appendChild(s);
      media.appendChild(v);
    } else {
      const i = document.createElement('img');
      i.className = 'img-fluid rounded mb-3';
      i.src = item.large || item.thumb;
      i.alt = item.title || '';
      media.appendChild(i);
    }

    // platforms
    if (Array.isArray(item.platforms) && item.platforms.length) {
      const platformsEl = modal.querySelector('.platforms');
      const h5 = document.createElement('h5');
      h5.textContent = 'Herramientas Utilizadas:';
      platformsEl.appendChild(h5);
      item.platforms.forEach(p => {
        const img = document.createElement('img');
        img.className = 'img-fluid me-2';
        img.src = p;
        img.style.width = '200px';
        img.alt = '';
        platformsEl.appendChild(img);
      });
    }

    // embed (iframe)
    if (item.embed && item.embed.type === 'iframe') {
      const embedEl = modal.querySelector('.embed-area');
      const iframe = document.createElement('iframe');
      iframe.frameBorder = 0;
      iframe.src = item.embed.src;
      iframe.width = item.embed.width || 552;
      iframe.height = item.embed.height || 167;
      iframe.setAttribute('allowfullscreen', '');
      embedEl.appendChild(iframe);
      if (item.embed.href && item.embed.text) {
        const a = document.createElement('a');
        a.href = item.embed.href;
        a.textContent = item.embed.text;
        a.target = '_blank';
        embedEl.appendChild(document.createElement('br'));
        embedEl.appendChild(a);
      }
    }

    // responsibilities
    if (Array.isArray(item.responsibilities) && item.responsibilities.length) {
      const respEl = modal.querySelector('.responsibilities');
      const p = document.createElement('p');
      p.className = 'text-center';
      p.textContent = 'Durante el desarrollo del juego, me encargué de los siguientes aspectos:';
      respEl.appendChild(p);
      const ul = document.createElement('ul');
      ul.style.textAlign = 'left';
      item.responsibilities.forEach(r => {
        const li = document.createElement('li');
        li.textContent = r;
        ul.appendChild(li);
      });
      respEl.appendChild(ul);
    }

    // images - each image opens in a new tab when clicked
    if (item.images && item.images.length) {
      const imagesEl = modal.querySelector('.images');
      const h5 = document.createElement('h5');
      h5.textContent = 'Imágenes del Proyecto:';
      imagesEl.appendChild(h5);
      item.images.forEach(src => {
        const link = document.createElement('a');
        link.href = src;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';

        const img = document.createElement('img');
        img.className = 'img-fluid rounded mb-5';
        img.src = src;
        img.alt = item.title || '';

        link.appendChild(img);
        imagesEl.appendChild(link);
      });
    }

    //videos
    if(item.videos && item.videos.length) {
      const videosEl = modal.querySelector('.videos');
      const h5 = document.createElement('h5');
      h5.textContent = 'Videos del Proyecto:';
      videosEl.appendChild(h5);
      item.videos.forEach(video => {
        const videoEl = document.createElement('video');
        const title = document.createElement('h2');
        title.textContent = video.title;
        videoEl.className = 'img-fluid rounded mb-5';
        videoEl.src = video.src;
        videoEl.controls = true;
        videoEl.muted = true;
        videoEl.loop = true;
        videoEl.type = 'video/mp4';
        videosEl.appendChild(title);
        videosEl.appendChild(videoEl);
      });
    }

    // github link
    if (item.github && item.github.url) {
      const gh = modal.querySelector('.github-link');
      const a = document.createElement('a');
      a.href = item.github.url;
      a.target = '_blank';
      const img = document.createElement('img');
      img.src = item.github.image || '';
      if (item.github.imageWidth) img.style.width = item.github.imageWidth + 'px';
      img.className = 'img-fluid';
      a.appendChild(img);
      gh.appendChild(a);
      const h = document.createElement('h5');
      h.textContent = 'Haz click para visitar el repositorio de Github';
      gh.appendChild(h);
    }

  // Prefer a container inside the same section (class="modals-container"),
  // fall back to global #modals-container, otherwise append to the section itself.
  // append modal into the section-specific modals container (we created/ensured it above)
  sectionModalsContainer.appendChild(modal);
  });
}


