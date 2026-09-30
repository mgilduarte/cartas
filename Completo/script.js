/* ============================================================
   BAR LA PONDEROSA — Carta Digital
   JavaScript vanilla: filtros por categoría, búsqueda en tiempo
   real, navegación móvil y utilidades de la interfaz.
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

    /* ---------------- Referencias del DOM ---------------- */
    const grid         = document.getElementById('drinksGrid');
    const cards        = Array.from(grid.querySelectorAll('.drink-card'));
    const filterBtns   = Array.from(document.querySelectorAll('.filter-btn'));
    const searchInput  = document.getElementById('drinkSearch');
    const resultsInfo  = document.getElementById('resultsInfo');
    const navLinksBox  = document.getElementById('navLinks');
    const menuToggle   = document.getElementById('menuToggle');
    const navbar       = document.getElementById('navbar');

    /* Etiquetas legibles de cada categoría */
    const FILTER_LABELS = {
        todos:    'Toda la carta',
        tinto:    'Vinos Tintos',
        blanco:   'Vinos Blancos',
        ginebra:  'Ginebras',
        ron:      'Rones',
        vodka:    'Vodkas',
        whisky:   'Whiskies',
        refresco: 'Refrescos, Zumos y Otras Bebidas'
    };

    let activeFilter = 'todos';

    /* ---------------- Utilidades ---------------- */
    /** Normaliza texto: minúsculas y sin acentos (búsqueda amigable). */
    function normalize(text) {
        return (text || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim();
    }

    const getName = (card) => card.querySelector('.drink-name').textContent;

    /* Texto indexado por tarjeta: nombre + categoría ("Ginebra", "Ron"...)
       para que buscar "whisky" o "vino tinto" también funcione. */
    const searchIndex = new Map();
    cards.forEach((card) => {
        const tag = card.querySelector('.cat-tag');
        searchIndex.set(card, normalize(getName(card) + ' ' + (tag ? tag.textContent : '')));
    });

    /* ---------------- Contadores por categoría ---------------- */
    const staticCounts = { todos: cards.length };
    cards.forEach((card) => {
        const cat = card.dataset.category;
        staticCounts[cat] = (staticCounts[cat] || 0) + 1;
    });

    const countBadges = Array.from(document.querySelectorAll('.tab-count'));

    function renderCounts(counts) {
        countBadges.forEach((badge) => {
            const key = badge.dataset.count;
            const value = counts[key];
            if (typeof value === 'number') badge.textContent = String(value);
        });
    }

    renderCounts(staticCounts);

    /* ---------------- Estado vacío (nodo existente en el HTML) ---------------- */
    const noResults      = document.getElementById('noResults');
    const noResultsTitle = noResults.querySelector('h3');
    const noResultsBtn   = document.getElementById('resetFilters');

    noResultsBtn.addEventListener('click', () => {
        searchInput.value = '';
        setFilter('todos');
        searchInput.focus();
    });

    /* ---------------- Filtrado combinado (categoría + búsqueda) ---------------- */
    function applyFilters() {
        const query = normalize(searchInput.value);
        const tokens = query ? query.split(/\s+/) : [];
        let visible = 0;
        const matchesPerCategory = { todos: 0 };

        cards.forEach((card) => {
            const inCategory = activeFilter === 'todos' || card.dataset.category === activeFilter;
            /* Todos los términos deben aparecer en nombre o categoría */
            const haystack = searchIndex.get(card);
            const matchesQuery = tokens.length === 0 || tokens.every((t) => haystack.includes(t));
            const show = inCategory && matchesQuery;

            card.classList.toggle('is-hidden', !show);
            if (show) visible += 1;

            /* Conteo global por categoría (ignora la categoría activa)
               para que las pestañas indiquen dónde hay coincidencias. */
            if (matchesQuery) {
                const cat = card.dataset.category;
                matchesPerCategory.todos += 1;
                matchesPerCategory[cat] = (matchesPerCategory[cat] || 0) + 1;
            }
        });

        /* Contadores vivos mientras se busca; totales en estado normal */
        renderCounts(query ? matchesPerCategory : staticCounts);

        /* Pestañas sin coincidencias durante la búsqueda */
        filterBtns.forEach((btn) => {
            const key = btn.dataset.filter;
            const n = matchesPerCategory[key] || 0;
            btn.classList.toggle('is-zero', Boolean(query) && n === 0);
        });

        /* Información de resultados (aria-live) */
        const label = FILTER_LABELS[activeFilter] || '';
        let info = '';
        if (query && visible > 0) {
            info = `<strong>${visible}</strong> ${visible === 1 ? 'coincidencia' : 'coincidencias'} para «${searchInput.value.trim()}»` +
                   (activeFilter !== 'todos' ? ` en ${label}` : '');
        } else if (query && visible === 0) {
            info = `Sin resultados para «${searchInput.value.trim()}»`;
        } else if (!query && activeFilter !== 'todos') {
            info = `<strong>${visible}</strong> ${visible === 1 ? 'bebida' : 'bebidas'} en ${label}`;
        }
        resultsInfo.innerHTML = info;
        resultsInfo.hidden = info === '';

        /* Panel de estado vacío */
        const isEmpty = visible === 0;
        noResults.hidden = !isEmpty;
        if (isEmpty) {
            noResultsTitle.textContent = query
                ? `No hemos encontrado «${searchInput.value.trim()}»`
                : 'No hemos encontrado esa bebida';
        }
    }

    /* ---------------- Pestañas / filtros ---------------- */
    function setFilter(key) {
        if (!(key in FILTER_LABELS)) return;
        activeFilter = key;
        filterBtns.forEach((btn) => {
            const isActive = btn.dataset.filter === key;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', String(isActive));
            btn.tabIndex = isActive ? 0 : -1;
        });
        applyFilters();
    }

    filterBtns.forEach((btn, index) => {
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-controls', 'drinksGrid');

        btn.addEventListener('click', () => setFilter(btn.dataset.filter));

        /* Navegación con flechas dentro del tablist */
        btn.addEventListener('keydown', (event) => {
            let next = null;
            if (event.key === 'ArrowRight') next = (index + 1) % filterBtns.length;
            else if (event.key === 'ArrowLeft') next = (index - 1 + filterBtns.length) % filterBtns.length;
            else if (event.key === 'Home') next = 0;
            else if (event.key === 'End') next = filterBtns.length - 1;
            if (next !== null) {
                event.preventDefault();
                filterBtns[next].focus();
                setFilter(filterBtns[next].dataset.filter);
            }
        });
    });

    /* ---------------- Búsqueda en tiempo real ---------------- */
    searchInput.addEventListener('input', applyFilters);

    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            searchInput.value = '';
            applyFilters();
            searchInput.blur();
        }
    });

    /* ---------------- Enlaces con data-nav-filter ---------------- */
    const navLinkEls = Array.from(document.querySelectorAll('.nav-link'));

    document.querySelectorAll('[data-nav-filter]').forEach((link) => {
        link.addEventListener('click', () => {
            const filter = link.dataset.navFilter;
            if (filter) setFilter(filter);

            /* Estado activo sólo entre los enlaces de la navbar */
            if (link.classList.contains('nav-link')) {
                navLinkEls.forEach((el) => el.classList.toggle('active', el === link));
            }
            closeMenu();
        });
    });

    /* ---------------- Menú móvil ---------------- */
    function openMenu() {
        navLinksBox.classList.add('open');
        menuToggle.classList.add('open');
        menuToggle.setAttribute('aria-expanded', 'true');
        menuToggle.setAttribute('aria-label', 'Cerrar menú');
        document.body.classList.add('nav-open');
    }

    function closeMenu() {
        navLinksBox.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menú');
        document.body.classList.remove('nav-open');
    }

    menuToggle.addEventListener('click', () => {
        navLinksBox.classList.contains('open') ? closeMenu() : openMenu();
    });

    document.addEventListener('click', (event) => {
        if (!navLinksBox.classList.contains('open')) return;
        if (navLinksBox.contains(event.target) || menuToggle.contains(event.target)) return;
        closeMenu();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 900) closeMenu();
    });

    /* ---------------- Sombra del navbar al hacer scroll ---------------- */
    function onScroll() {
        navbar.classList.toggle('scrolled', window.scrollY > 12);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ---------------- Scrollspy (Inicio / Contacto) ---------------- */
    const inicio = document.getElementById('inicio');
    const contacto = document.getElementById('contacto');

    function setActiveNav(id) {
        navLinkEls.forEach((el) => {
            const isMatch = el.getAttribute('href') === '#' + id;
            const isCategory = el.dataset.navFilter && el.dataset.navFilter !== '';
            /* Los enlaces de categoría sólo se marcan por clic explícito */
            if (isCategory) return;
            el.classList.toggle('active', isMatch);
        });
    }

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveNav(entry.target.id);
                });
            },
            { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
        );
        if (inicio) observer.observe(inicio);
        if (contacto) observer.observe(contacto);
    }

    /* ---------------- Estado "Abierto / Cerrado" en la topbar ---------------- */
    const scheduleBox = document.querySelector('.topbar-schedule');

    function updateOpenStatus() {
        if (!scheduleBox) return;
        const now = new Date();
        const hour = now.getHours() + now.getMinutes() / 60;
        const open = hour >= 11.5 || hour < 2; /* 11:30 – 2:00 */

        scheduleBox.classList.toggle('is-closed', !open);

        let status = scheduleBox.querySelector('.topbar-status');
        if (!status) {
            status = document.createElement('span');
            status.className = 'topbar-status';
            scheduleBox.appendChild(status);
        }
        status.textContent = open ? '· Abierto ahora' : '· Cerrado · Abre a las 11:30';
    }

    updateOpenStatus();
    setInterval(updateOpenStatus, 60000);

    /* ---------------- Estado inicial ---------------- */
    applyFilters();
});
