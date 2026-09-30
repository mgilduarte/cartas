/* ==========================================================================
   BAR LA PONDEROSA - CARTA DIGITAL DE VINOS
   JavaScript Lógica Interactiva
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initFilterCounts();
    initScrollEffects();
});

/* --------------------------------------------------------------------------
   1. MÓVIL MENU Y NAVEGACIÓN
   -------------------------------------------------------------------------- */
function initNavigation() {
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileBtn.classList.toggle('active');
        });

        // Cerrar menú móvil al hacer clic en un enlace
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileBtn.classList.remove('active');
            });
        });
    }
}

/* --------------------------------------------------------------------------
   2. FILTRADO Y BÚSQUEDA DE VINOS
   -------------------------------------------------------------------------- */
let currentCategory = 'todos';

function filterWines(category) {
    currentCategory = category;

    // Actualizar botones de pestaña activos
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        if (btn.getAttribute('data-filter') === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    applyFilters();
}

function searchWines() {
    applyFilters();
}

function applyFilters() {
    const searchInput = document.getElementById('wineSearch');
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const wineCards = document.querySelectorAll('.wine-card');
    const noResults = document.getElementById('noResults');
    let visibleCount = 0;

    wineCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        const cardName = card.getAttribute('data-name');

        const matchesCategory = (currentCategory === 'todos' || cardCategory === currentCategory);
        const matchesSearch = (searchTerm === '' || cardName.includes(searchTerm));

        if (matchesCategory && matchesSearch) {
            card.style.display = 'flex';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    if (noResults) {
        if (visibleCount === 0) {
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
        }
    }
}

function initFilterCounts() {
    const wineCards = document.querySelectorAll('.wine-card');
    let total = wineCards.length;
    let tintos = 0;
    let blancos = 0;

    wineCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (cat === 'tinto') tintos++;
        if (cat === 'blanco') blancos++;
    });

    const countTodos = document.getElementById('count-todos');
    const countTinto = document.getElementById('count-tinto');
    const countBlanco = document.getElementById('count-blanco');

    if (countTodos) countTodos.textContent = total;
    if (countTinto) countTinto.textContent = tintos;
    if (countBlanco) countBlanco.textContent = blancos;
}

/* --------------------------------------------------------------------------
   3. MODAL DE VISTA DETALLADA
   -------------------------------------------------------------------------- */
function openModal(title, category, price, imgPath, description) {
    const modal = document.getElementById('wineModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalCategory = document.getElementById('modalCategory');
    const modalPrice = document.getElementById('modalPrice');
    const modalImg = document.getElementById('modalImg');
    const modalDescription = document.getElementById('modalDescription');

    if (modalTitle) modalTitle.textContent = title;
    if (modalCategory) modalCategory.textContent = category;
    if (modalPrice) modalPrice.textContent = price;
    if (modalImg) modalImg.src = imgPath;
    if (modalDescription) modalDescription.textContent = description;

    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Previene scroll de fondo
    }
}

function closeModal() {
    const modal = document.getElementById('wineModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function closeModalOnOverlay(event) {
    if (event.target.id === 'wineModal') {
        closeModal();
    }
}

// Cerrar modal con tecla Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

/* --------------------------------------------------------------------------
   4. EFECTOS DE SCROLL Y NAVBAR DESTACADO
   -------------------------------------------------------------------------- */
function initScrollEffects() {
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id], footer[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Sombra en Navbar al scroll
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.8)';
        } else {
            navbar.style.boxShadow = 'none';
        }

        // Resaltar sección activa en menú
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });
}
