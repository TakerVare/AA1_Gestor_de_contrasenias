window.onload = (event) => {
  //console.log("page is fully loaded");
  loadCategories();
  initModalAddCategory();
  initAddSiteButton();
  initTableActions();
  initSearch();
};

async function loadCategories(){
  try {
    const data = await categoriesAPI.getAll();
    drawCategories(data);
  } catch(error) {
    console.error('Error al cargar las categorías:', error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Error al cargar las categorías"
    });
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
    const data = await sitesAPI.getAll();
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

// Función para inicializar el modal de añadir categoría
function initModalAddCategory() {
  const modal = document.getElementById('modal-add-category');
  const btnAddCategory = document.getElementById('btn-add-category');
  const btnCancel = document.getElementById('btn-cancel-category');
  const btnOk = document.getElementById('btn-ok-category');
  const inputName = document.getElementById('category-name');
  const inputIcon = document.getElementById('category-icon');

  // Abrir modal al hacer clic en "Add category"
  btnAddCategory.addEventListener('click', () => {
    modal.classList.add('show');
    inputName.value = '';
    inputIcon.value = '📁'; // Seleccionar el primer icono por defecto
    inputName.focus();
  });

  // Cerrar modal al hacer clic en "Cancel"
  btnCancel.addEventListener('click', () => {
    modal.classList.remove('show');
  });

  // Cerrar modal al hacer clic fuera del contenido
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('show');
    }
  });

  // Crear categoría al hacer clic en "OK"
  btnOk.addEventListener('click', async () => {
    const categoryName = inputName.value.trim();
    const categoryIcon = inputIcon.value.trim() || '📁';

    if (categoryName === '') {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor, introduce un nombre para la categoría"
      });
      return;
    }

    try {
      await categoriesAPI.create({ name: categoryName, icon: categoryIcon });
      modal.classList.remove('show');
      await loadCategories();
    } catch(error) {
      console.error('Error al crear la categoría:', error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al crear la categoría"
      });
    }
  });

  // Permitir crear con Enter
  inputName.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      btnOk.click();
    }
  });
}

// Función para eliminar una categoría
async function deleteCategory(categoryId, categoryName) {
  const confirmed = confirm(`¿Estás seguro de que quieres eliminar la categoría "${categoryName}"?`);
  if (!confirmed) return;

  try {
    await categoriesAPI.delete(categoryId);
    Swal.fire({
      icon: "success",
      title: "Yeah",
      text: "Categoría eliminada correctamente"
    });
    await loadCategories();
  } catch(error) {
    console.error('Error al eliminar la categoría:', error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Error al eliminar la categoría"
    });
  }
}

// Función para inicializar el botón Add site
function initAddSiteButton() {
  const btnAddSite = document.querySelector('.cta-add-sites');

  btnAddSite.addEventListener('click', () => {
    const selectedCategory = document.querySelector('input[name="category"]:checked');

    if (!selectedCategory) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor, selecciona una categoría primero"
      });
      return;
    }

    const categoryId = selectedCategory.value;
    window.location.href = `pass_saver.html?categoryId=${categoryId}`;
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
    Swal.fire({
      icon: "success",
      title: "Yeah",
      text: "Sitio eliminado correctamente"
    });
    const selectedCategory = document.querySelector('input[name="category"]:checked');
    if (selectedCategory) {
      loadSites(selectedCategory.value);
    }
  } catch(error) {
    console.error('Error al eliminar el sitio:', error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Error al eliminar el sitio"
    });
    
  }
}

// Función para inicializar el buscador
function initSearch() {
  const searchInput = document.getElementById('search-input');
  const btnSearch = document.getElementById('btn-search');

  const performSearch = () => {
    const searchTerm = searchInput.value.toLowerCase().trim();

    // Filtrar categorías
    const categories = document.querySelectorAll('.categories-list li');
    categories.forEach(category => {
      const categoryName = category.getAttribute('data-category-name');
      if (categoryName && categoryName.includes(searchTerm)) {
        category.classList.remove('hidden');
      } else {
        category.classList.add('hidden');
      }
    });

    // Filtrar sitios
    const sites = document.querySelectorAll('#main-sites-table tbody tr');
    sites.forEach(site => {
      const url = site.getAttribute('data-site-url') || '';
      const user = site.getAttribute('data-site-user') || '';
      if (url.includes(searchTerm) || user.includes(searchTerm)) {
        site.style.display = '';
      } else {
        site.style.display = 'none';
      }
    });
  };

  // Búsqueda en tiempo real mientras escribes
  searchInput.addEventListener('input', performSearch);

  // Búsqueda al hacer clic en el botón
  btnSearch.addEventListener('click', performSearch);

  // Búsqueda al presionar Enter
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  });
}
