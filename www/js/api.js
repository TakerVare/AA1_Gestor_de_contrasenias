// Clase para manejar las operaciones de la API de Categorías
class CategoriesAPI {
  constructor(baseURL = 'http://localhost:3000') {
    this.baseURL = baseURL;
  }

  // Obtener todas las categorías
  async getAll() {
    const response = await fetch(`${this.baseURL}/categories`);
    if (!response.ok) throw new Error('Error al obtener categorías');
    return await response.json();
  }

  // Obtener una categoría por ID
  async getById(id) {
    const response = await fetch(`${this.baseURL}/categories/${id}`);
    if (!response.ok) throw new Error('Error al obtener la categoría');
    return await response.json();
  }

  // Crear una nueva categoría
  async create(categoryData) {
    const response = await fetch(`${this.baseURL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(categoryData)
    });
    if (!response.ok) throw new Error('Error al crear la categoría');
    return await response.json();
  }

  // Eliminar una categoría
  async delete(id) {
    const response = await fetch(`${this.baseURL}/categories/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Error al eliminar la categoría');
    return response.ok;
  }

  // Obtener sites de una categoría
  async getSites(id) {
    const response = await fetch(`${this.baseURL}/categories/${id}`);
    if (!response.ok) throw new Error('Error al obtener sites de la categoría');
    return await response.json();
  }
}

// Clase para manejar las operaciones de la API de Sites
class SitesAPI {
  constructor(baseURL = 'http://localhost:3000') {
    this.baseURL = baseURL;
  }

  // Obtener todos los sites
  async getAll() {
    const response = await fetch(`${this.baseURL}/sites`);
    if (!response.ok) throw new Error('Error al obtener sites');
    return await response.json();
  }

  // Obtener un site por ID
  async getById(id) {
    const response = await fetch(`${this.baseURL}/sites/${id}`);
    if (!response.ok) throw new Error('Error al obtener el site');
    return await response.json();
  }

  // Crear un nuevo site en una categoría
  async create(categoryId, siteData) {
    const response = await fetch(`${this.baseURL}/categories/${categoryId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(siteData)
    });
    if (!response.ok) throw new Error('Error al crear el site');
    return await response.json();
  }

  // Actualizar un site
  async update(id, siteData) {
    const response = await fetch(`${this.baseURL}/sites/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(siteData)
    });
    if (!response.ok) throw new Error('Error al actualizar el site');
    return response.ok;
  }

  // Eliminar un site
  async delete(id) {
    const response = await fetch(`${this.baseURL}/sites/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Error al eliminar el site');
    return response.ok;
  }
}

// Exportar instancias de las clases
const categoriesAPI = new CategoriesAPI();
const sitesAPI = new SitesAPI();
