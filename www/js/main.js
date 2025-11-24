window.onload = (event) => {
  //console.log("page is fully loaded");
  loadCategories();
  initAddSiteButton();
  initTableActions();
};

async function loadCategories(){
  try {
    const response = await fetch(`http://localhost:3000/categories`);
    if (!response.ok) throw new Error('Error al obtener categorías');
    const data = await response.json();
    drawCategories(data);
  } catch(error) {
    console.error('Error al cargar las categorías:', error);
    alert('Error al cargar las categorías');
  }
}

function drawCategories(data) {
  const parent = document.getElementById('categories-list-body');
  parent.innerHTML = '';

  data.forEach((category, index) => {
    let child = document.createElement('li');
    const icon = category.icon || '📁';

    let $rdButton = `
      <input class="radio-button" type="radio"
      name="category"
      id="rd-${category.id}"
      value="${category.id}"
      ${index === 0 ? 'checked' : ''}
      >
      <label for="rd-${category.id}">
        <span class="category-icon">${icon}</span>
        <span class="category-name">${category.name}</span>
        <button class="category-delete-btn" data-category-id="${category.id}" data-category-name="${category.name}" title="Eliminar categoría">🗑️</button>
      </label>
    `;
    child.innerHTML = $rdButton;
    child.setAttribute('data-category-name', category.name.toLowerCase());

    parent.appendChild(child);

    // Añadir event listener al radio button
    const radioButton = child.querySelector('input[type="radio"]');
    radioButton.addEventListener('change', function() {
      if (this.checked) {
        loadSites(this.value);
      }
    });

    // Añadir event listener al botón de eliminar
    const deleteBtn = child.querySelector('.category-delete-btn');
    deleteBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const categoryId = e.target.getAttribute('data-category-id');
      const categoryName = e.target.getAttribute('data-category-name');
      await deleteCategory(categoryId, categoryName);
    });

    // Cargar sitios de la primera categoría por defecto
    if(index === 0){
      loadSites(category.id);
    }
  });
}

async function loadSites(categoryId){
  const table = document.getElementById('main-sites-table');
  const tbody = table.querySelector('tbody');
  tbody.innerHTML = '';

  try {
    const response = await fetch(`http://localhost:3000/sites`);
    if (!response.ok) throw new Error('Error al obtener sites');
    const data = await response.json();
    const filteredSites = data.filter(site => site.categoryId === parseInt(categoryId));
    drawSites(filteredSites);
  } catch(error) {
    console.error('Error al cargar los sitios:', error);
  }
}

function drawSites(data) {
  const table = document.getElementById('main-sites-table');
  const tbody = table.querySelector('tbody');

  data.forEach(site => {
    let child = document.createElement('tr');

    let $row = `
      <td>${site.url}</td>
      <td>${site.user}</td>
      <td>${site.createdAt}</td>
      <td class="actions-cell">
        <button class="action-btn open-url" data-url="${site.url}" title="Abrir URL">🔗</button>
        <button class="action-btn delete-site" data-site-id="${site.id}" title="Eliminar">🗑️</button>
        <button class="action-btn edit-site" data-site-id="${site.id}" title="Editar">✏️</button>
      </td>
    `;
    child.innerHTML = $row;
    child.setAttribute('data-site-url', site.url.toLowerCase());
    child.setAttribute('data-site-user', site.user.toLowerCase());

    tbody.appendChild(child);
  });
}


// Función para inicializar las acciones de la tabla (abrir, editar, eliminar)
function initTableActions() {
  const table = document.getElementById('main-sites-table');
  const tbody = table.querySelector('tbody');

  tbody.addEventListener('click', (e) => {
    const target = e.target;

    // Botón Open URL
    if (target.classList.contains('open-url')) {
      const url = target.getAttribute('data-url');
      if (url) {
        let fullUrl = url;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          fullUrl = 'http://' + url;
        }
        window.open(fullUrl, '_blank');
      }
    }

    // Botón Delete Site
    if (target.classList.contains('delete-site')) {
      const siteId = target.getAttribute('data-site-id');
      if (siteId) {
        const confirmed = confirm('¿Estás seguro de que quieres eliminar este sitio?');
        if (confirmed) {
          deleteSite(siteId);
        }
      }
    }

    // Botón Edit Site
    if (target.classList.contains('edit-site')) {
      const siteId = target.getAttribute('data-site-id');
      if (siteId) {
        window.location.href = `pass_saver.html?siteId=${siteId}`;
      }
    }
  });
}

// Función para eliminar un sitio
async function deleteSite(siteId) {
  try {
    await sitesAPI.delete(siteId);
    alert('Sitio eliminado correctamente');
    const selectedCategory = document.querySelector('input[name="category"]:checked');
    if (selectedCategory) {
      loadSites(selectedCategory.value);
    }
  } catch(error) {
    console.error('Error al eliminar el sitio:', error);
    alert('Error al eliminar el sitio');
  }
}

