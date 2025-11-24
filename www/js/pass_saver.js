window.onload = () => {
  initPassSaverForm();
  initValidations();
};

function initPassSaverForm() {
  const form = document.getElementById('site-form');
  const btnCancel = document.getElementById('btn-cancel-form');
  const btnGeneratePassword = document.getElementById('btn-generate-password');
  const passwordInput = document.getElementById('site-password');

  // Obtener categoryId de la URL si existe
  const urlParams = new URLSearchParams(window.location.search);
  const categoryId = urlParams.get('categoryId');
  const siteId = urlParams.get('siteId');

  // Si hay un siteId, cargar los datos del sitio para editar
  if (siteId) {
    loadSiteData(siteId);
  }

  // Manejar envío del formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
      name: document.getElementById('site-user').value,
      url: document.getElementById('site-url').value,
      user: document.getElementById('site-user').value,
      password: document.getElementById('site-password').value,
      description: document.getElementById('site-description').value
    };

    if (siteId) {
      // Actualizar sitio existente
      await updateSite(siteId, formData);
    } else if (categoryId) {
      // Crear nuevo sitio en la categoría
      await createSite(categoryId, formData);
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No se especificó la categoría"
      });
    }
  });

  // Botón cancelar
  btnCancel.addEventListener('click', () => {
    window.location.href = 'index.html';
  });

  // Botón generar contraseña
  btnGeneratePassword.addEventListener('click', () => {
    const password = generatePassword(12);
    passwordInput.value = password;
    passwordInput.type = 'text';

    // Volver a ocultar después de 3 segundos
    setTimeout(() => {
      passwordInput.type = 'password';
    }, 3000);
  });
}

// Función para inicializar validaciones dinámicas
function initValidations() {
  const urlInput = document.getElementById('site-url');
  const userInput = document.getElementById('site-user');
  const passwordInput = document.getElementById('site-password');

  // Validación de URL
  urlInput.addEventListener('blur', function() {
    const value = this.value.trim();
    if (value === '') {
      showFieldError(this, 'La URL es obligatoria');
    } else if (value.length < 4) {
      showFieldError(this, 'La URL debe tener al menos 4 caracteres');
    } else {
      clearFieldError(this);
    }
  });

  // Validación de Usuario
  userInput.addEventListener('blur', function() {
    const value = this.value.trim();
    if (value === '') {
      showFieldError(this, 'El usuario es obligatorio');
    } else if (value.length < 3) {
      showFieldError(this, 'El usuario debe tener al menos 3 caracteres');
    } else {
      clearFieldError(this);
    }
  });

  // Validación de Contraseña
  passwordInput.addEventListener('blur', function() {
    const value = this.value;
    if (value === '') {
      showFieldError(this, 'La contraseña es obligatoria');
    } else if (value.length < 8) {
      showFieldError(this, 'La contraseña debe tener al menos 8 caracteres');
    } else {
      clearFieldError(this);
    }
  });

  // Limpiar errores al escribir
  urlInput.addEventListener('input', function() {
    if (this.classList.contains('error')) {
      clearFieldError(this);
    }
  });

  userInput.addEventListener('input', function() {
    if (this.classList.contains('error')) {
      clearFieldError(this);
    }
  });

  passwordInput.addEventListener('input', function() {
    if (this.classList.contains('error')) {
      clearFieldError(this);
    }
  });
}

// Función para mostrar error en un campo
function showFieldError(input, message) {
  input.classList.add('error');

  // Eliminar mensaje de error previo si existe
  const existingError = input.parentElement.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }

  // Crear nuevo mensaje de error
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  input.parentElement.appendChild(errorDiv);
}

// Función para limpiar error de un campo
function clearFieldError(input) {
  input.classList.remove('error');
  const errorMessage = input.parentElement.querySelector('.error-message');
  if (errorMessage) {
    errorMessage.remove();
  }
}

// Función para generar contraseña aleatoria
function generatePassword(length = 12) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

// Función para crear un nuevo sitio usando la clase API
async function createSite(categoryId, formData) {
  try {
    await sitesAPI.create(categoryId, formData);
    Swal.fire({
      icon: "success",
      title: "Yeah",
      text: "Sitio creado correctamente"
    });
    window.location.href = 'index.html';
  } catch(error) {
    console.error('Error al crear el sitio:', error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Error al crear el sitio"
    });
  }
}

// Función para actualizar un sitio existente usando la clase API
async function updateSite(siteId, formData) {
  try {
    await sitesAPI.update(siteId, formData);
    Swal.fire({
      icon: "success",
      title: "Yeah",
      text: "Sitio actualizado correctamente"
    });
    window.location.href = 'index.html';
  } catch(error) {
    console.error('Error al actualizar el sitio:', error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Error al actualizar el sitio"
    });
  }
}

// Función para cargar datos de un sitio existente usando la clase API
async function loadSiteData(siteId) {
  try {
    const site = await sitesAPI.getById(siteId);
    document.getElementById('site-url').value = site.url;
    document.getElementById('site-user').value = site.user;
    document.getElementById('site-password').value = site.password;
    document.getElementById('site-description').value = site.description || '';
  } catch(error) {
    console.error('Error al cargar el sitio:', error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Error al cargar los datos del sitio"
    });
  }
}
