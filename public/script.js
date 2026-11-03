const API_BASE = 'http://localhost:4000';

let allBooks = [];
let activeCategory = 'ALL';
let currentSearchQuery = '';
let activeSortOption = 'id-asc';
let pendingDeleteId = null;

const booksGrid = document.getElementById('books-grid');
const loadingState = document.getElementById('loading-state');
const emptyState = document.getElementById('empty-state');
const searchInput = document.getElementById('search-input');
const btnClearSearch = document.getElementById('btn-clear-search');
const sortSelect = document.getElementById('sort-select');
const categoryTabs = document.getElementById('category-filters');
const btnRefresh = document.getElementById('btn-refresh');
const btnOpenAdd = document.getElementById('btn-open-add');
const emptyBtnAdd = document.getElementById('empty-btn-add');

const statTotalBooks = document.getElementById('stat-total-books');
const statTotalValue = document.getElementById('stat-total-value');
const statCategories = document.getElementById('stat-categories');
const statPowerLevel = document.getElementById('stat-power-level');
const barBooks = document.getElementById('bar-books');
const barValue = document.getElementById('bar-value');
const barCategories = document.getElementById('bar-categories');
const visibleCountBadge = document.getElementById('visible-count-badge');

const addModal = document.getElementById('add-modal');
const editModal = document.getElementById('edit-modal');
const deleteModal = document.getElementById('delete-modal');

const addBookForm = document.getElementById('add-book-form');
const editBookForm = document.getElementById('edit-book-form');
const btnConfirmDelete = document.getElementById('btn-confirm-delete');
const toastContainer = document.getElementById('toast-container');

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const textSpan = document.createElement('span');
  textSpan.textContent = message;

  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '&times;';
  closeBtn.style.background = 'none';
  closeBtn.style.border = 'none';
  closeBtn.style.color = '#cbd5e1';
  closeBtn.style.fontSize = '18px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.marginLeft = '12px';
  closeBtn.onclick = () => removeToast(toast);

  toast.appendChild(textSpan);
  toast.appendChild(closeBtn);
  toastContainer.appendChild(toast);

  setTimeout(() => {
    removeToast(toast);
  }, 4000);
}

function removeToast(toast) {
  toast.style.opacity = '0';
  toast.style.transform = 'translateX(30px)';
  setTimeout(() => {
    if (toast.parentElement) {
      toast.parentElement.removeChild(toast);
    }
  }, 200);
}

function openModal(modal) {
  modal.classList.remove('hidden');
}

function closeModal(modal) {
  modal.classList.add('hidden');
}

document.querySelectorAll('[data-close]').forEach(button => {
  button.addEventListener('click', () => {
    const targetModalId = button.getAttribute('data-close');
    const targetModal = document.getElementById(targetModalId);
    if (targetModal) {
      closeModal(targetModal);
    }
  });
});

[addModal, editModal, deleteModal].forEach(modal => {
  modal.addEventListener('click', event => {
    if (event.target === modal) {
      closeModal(modal);
    }
  });
});

async function fetchBooks() {
  loadingState.classList.remove('hidden');
  emptyState.classList.add('hidden');
  booksGrid.innerHTML = '';

  try {
    const response = await fetch(`${API_BASE}/books`);
    if (!response.ok) {
      throw new Error(`Failed to fetch books: HTTP ${response.status}`);
    }
    allBooks = await response.json();
    renderDashboard();
    showToast('Tome database synchronized successfully', 'success');
  } catch (error) {
    console.error(error);
    showToast('Unable to connect to Express API on port 4000. Ensure expressApp.js is running.', 'error');
    allBooks = [];
    renderDashboard();
  } finally {
    loadingState.classList.add('hidden');
  }
}

function updateScouterStats() {
  const total = allBooks.length;
  const totalVal = allBooks.reduce((sum, b) => sum + (Number(b.price) || 0), 0);
  const categories = new Set(allBooks.map(b => (b.category || 'General').trim().toLowerCase()));

  statTotalBooks.textContent = total;
  statTotalValue.textContent = `₹${totalVal.toLocaleString()}`;
  statCategories.textContent = categories.size;

  const power = Math.max(9001, total * 1500 + totalVal * 3);
  statPowerLevel.textContent = power.toLocaleString();

  barBooks.style.width = `${Math.min(100, total * 10)}%`;
  barValue.style.width = `${Math.min(100, (totalVal / 5000) * 100)}%`;
  barCategories.style.width = `${Math.min(100, categories.size * 20)}%`;
}

function updateCategoryPills() {
  const categories = ['ALL'];
  allBooks.forEach(b => {
    const cat = (b.category || 'General').trim();
    if (cat && !categories.some(c => c.toLowerCase() === cat.toLowerCase())) {
      categories.push(cat);
    }
  });

  categoryTabs.innerHTML = '';
  categories.forEach(cat => {
    const pill = document.createElement('button');
    pill.className = `cat-pill ${activeCategory.toLowerCase() === cat.toLowerCase() ? 'active' : ''}`;
    pill.textContent = cat === 'ALL' ? 'All Categories' : cat;
    pill.dataset.category = cat;
    pill.onclick = () => {
      activeCategory = cat;
      document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      renderBooks();
    };
    categoryTabs.appendChild(pill);
  });
}

function getFilteredAndSortedBooks() {
  let list = allBooks.filter(book => {
    const matchesCategory = activeCategory === 'ALL' ||
      (book.category && book.category.trim().toLowerCase() === activeCategory.toLowerCase());

    const titleMatch = book.title && book.title.toLowerCase().includes(currentSearchQuery);
    const authorMatch = book.author && book.author.toLowerCase().includes(currentSearchQuery);
    const matchesSearch = !currentSearchQuery || titleMatch || authorMatch;

    return matchesCategory && matchesSearch;
  });

  list.sort((a, b) => {
    if (activeSortOption === 'id-asc') return Number(a.id) - Number(b.id);
    if (activeSortOption === 'id-desc') return Number(b.id) - Number(a.id);
    if (activeSortOption === 'title-asc') return (a.title || '').localeCompare(b.title || '');
    if (activeSortOption === 'price-asc') return Number(a.price) - Number(b.price);
    if (activeSortOption === 'price-desc') return Number(b.price) - Number(a.price);
    return 0;
  });

  return list;
}

function renderBooks() {
  const booksToDisplay = getFilteredAndSortedBooks();
  visibleCountBadge.textContent = `${booksToDisplay.length} Displayed`;

  booksGrid.innerHTML = '';

  if (booksToDisplay.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  booksToDisplay.forEach(book => {
    const card = document.createElement('div');
    card.className = 'book-card';

    const categoryText = book.category || 'General';

    card.innerHTML = `
      <div>
        <div class="card-top">
          <span class="card-id-badge">ID: #${book.id}</span>
          <span class="card-category-badge">&#9733; ${escapeHtml(categoryText)}</span>
        </div>
        <div class="card-body" style="margin-top: 14px;">
          <h3 class="card-title">${escapeHtml(book.title)}</h3>
          <div class="card-author-wrap">
            <span class="card-author-icon">&#9998;</span>
            <span>${escapeHtml(book.author)}</span>
          </div>
        </div>
      </div>
      <div>
        <div class="card-price-row">
          <span class="price-label">Price</span>
          <span class="price-value">&#8377;${Number(book.price).toLocaleString()}</span>
        </div>
        <div class="card-actions">
          <button class="card-btn card-btn-edit" data-edit-id="${book.id}">
            &#9999; Edit
          </button>
          <button class="card-btn card-btn-delete" data-delete-id="${book.id}">
            &#128465; Delete
          </button>
        </div>
      </div>
    `;

    card.querySelector(`[data-edit-id="${book.id}"]`).addEventListener('click', () => {
      openEditModal(book);
    });

    card.querySelector(`[data-delete-id="${book.id}"]`).addEventListener('click', () => {
      openDeleteModal(book);
    });

    booksGrid.appendChild(card);
  });
}

function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderDashboard() {
  updateScouterStats();
  updateCategoryPills();
  renderBooks();
}

function openEditModal(book) {
  document.getElementById('edit-id-hidden').value = book.id;
  document.getElementById('edit-id-display').value = `#${book.id}`;
  document.getElementById('edit-title').value = book.title;
  document.getElementById('edit-author').value = book.author;
  document.getElementById('edit-price').value = book.price;
  document.getElementById('edit-category').value = book.category || '';
  openModal(editModal);
}

function openDeleteModal(book) {
  pendingDeleteId = book.id;
  document.getElementById('delete-target-title').textContent = book.title;
  document.getElementById('delete-target-id').textContent = `Book ID: #${book.id} • Author: ${book.author}`;
  openModal(deleteModal);
}

addBookForm.addEventListener('submit', async event => {
  event.preventDefault();

  const id = Number(document.getElementById('add-id').value);
  const title = document.getElementById('add-title').value.trim();
  const author = document.getElementById('add-author').value.trim();
  const price = Number(document.getElementById('add-price').value);
  const category = document.getElementById('add-category').value.trim() || 'General';

  if (!id || !title || !author || isNaN(price)) {
    showToast('Please provide all required fields', 'warning');
    return;
  }

  const payload = { id, title, author, price, category };

  try {
    const response = await fetch(`${API_BASE}/books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to add book');
    }

    showToast(`Book "${data.book.title}" added successfully!`, 'success');
    addBookForm.reset();
    closeModal(addModal);
    await fetchBooks();
  } catch (error) {
    showToast(error.message, 'error');
  }
});

editBookForm.addEventListener('submit', async event => {
  event.preventDefault();

  const id = Number(document.getElementById('edit-id-hidden').value);
  const title = document.getElementById('edit-title').value.trim();
  const author = document.getElementById('edit-author').value.trim();
  const price = Number(document.getElementById('edit-price').value);
  const category = document.getElementById('edit-category').value.trim() || 'General';

  if (!title || !author || isNaN(price)) {
    showToast('Please provide all required fields', 'warning');
    return;
  }

  const payload = { title, author, price, category };

  try {
    const response = await fetch(`${API_BASE}/books/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to update book');
    }

    showToast(`Book "${data.book.title}" updated successfully!`, 'success');
    closeModal(editModal);
    await fetchBooks();
  } catch (error) {
    showToast(error.message, 'error');
  }
});

btnConfirmDelete.addEventListener('click', async () => {
  if (pendingDeleteId === null) return;

  try {
    const response = await fetch(`${API_BASE}/books/${pendingDeleteId}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete book');
    }

    showToast(`Book deleted from archives successfully`, 'success');
    closeModal(deleteModal);
    pendingDeleteId = null;
    await fetchBooks();
  } catch (error) {
    showToast(error.message, 'error');
  }
});

searchInput.addEventListener('input', () => {
  currentSearchQuery = searchInput.value.trim().toLowerCase();
  btnClearSearch.style.display = currentSearchQuery ? 'block' : 'none';
  renderBooks();
});

btnClearSearch.addEventListener('click', () => {
  searchInput.value = '';
  currentSearchQuery = '';
  btnClearSearch.style.display = 'none';
  renderBooks();
  searchInput.focus();
});

sortSelect.addEventListener('change', () => {
  activeSortOption = sortSelect.value;
  renderBooks();
});

btnRefresh.addEventListener('click', () => {
  fetchBooks();
});

btnOpenAdd.addEventListener('click', () => {
  const nextId = allBooks.length > 0 ? Math.max(...allBooks.map(b => Number(b.id) || 0)) + 1 : 1;
  document.getElementById('add-id').value = nextId;
  openModal(addModal);
});

emptyBtnAdd.addEventListener('click', () => {
  const nextId = allBooks.length > 0 ? Math.max(...allBooks.map(b => Number(b.id) || 0)) + 1 : 1;
  document.getElementById('add-id').value = nextId;
  openModal(addModal);
});

fetchBooks();
