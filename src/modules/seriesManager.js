import { netflixSeriesData } from '../data/seriesData.js';

export class SeriesManager {
  constructor() {
    this.series = [...netflixSeriesData];
    this.filteredSeries = [...this.series];
    this.favorites = [];
  }

  init() {
    this.loadFavorites();
  }

  loadFavorites() {
    // In a real app with localStorage:
    // const stored = localStorage.getItem('netflix-favorites');
    // this.favorites = stored ? JSON.parse(stored) : [];
    this.favorites = [];
  }

  saveFavorites() {
    // In a real app with localStorage:
    // localStorage.setItem('netflix-favorites', JSON.stringify(this.favorites));
    console.log('Favorites saved:', this.favorites);
  }

  getSeries() {
    return this.series;
  }

  getFilteredSeries() {
    return this.filteredSeries;
  }

  getFavorites() {
    return this.favorites;
  }

  getFavoritesSeries() {
    return this.series.filter(series => this.favorites.includes(series.id));
  }

  handleSearch(searchTerm) {
    this.applyFilters(searchTerm, document.getElementById('genreFilter').value);
  }

  handleFilter(genre) {
    this.applyFilters(document.getElementById('searchInput').value, genre);
  }

  applyFilters(searchTerm, genre) {
    this.filteredSeries = this.series.filter(series => {
      const matchesSearch = series.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           series.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = genre === 'all' || series.genre === genre;
      return matchesSearch && matchesGenre;
    });
    this.renderSeries();
  }

  renderSeries() {
    const seriesGrid = document.getElementById('seriesGrid');
    
    if (this.filteredSeries.length === 0) {
      seriesGrid.innerHTML = `
        <div class="no-results">
          <div class="no-results-emoji">🔍</div>
          <h3>No series found</h3>
          <p>Try adjusting your search terms or filters</p>
        </div>
      `;
      return;
    }

    seriesGrid.innerHTML = this.filteredSeries.map(series => `
      <div class="series-card fade-in-up" data-id="${series.id}">
        <div class="series-image">
          <span style="z-index: 1;">${series.emoji}</span>
          <div class="series-year">${series.year}</div>
        </div>
        <div class="series-info">
          <div class="series-title">${series.title}</div>
          <div class="series-genre">${series.genre}</div>
          <div class="series-rating">
            <div class="stars">${this.generateStars(series.rating)}</div>
            <span>${series.rating}/5</span>
          </div>
          <div class="series-description">${series.description}</div>
          <button class="favorite-btn ${this.favorites.includes(series.id) ? 'favorite' : 'not-favorite'}" 
                  onclick="toggleFavorite(${series.id})"
                  title="${this.favorites.includes(series.id) ? 'Remove from favorites' : 'Add to favorites'}">
            ${this.favorites.includes(series.id) ? '❤️ In Favorites' : '🤍 Add to Favorites'}
          </button>
        </div>
      </div>
    `).join('');

    // Add intersection observer for animations
    this.addScrollAnimations();
  }

  generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
      stars += '⭐';
    }
    
    if (hasHalfStar) {
      stars += '💫';
    }
    
    return stars;
  }

  toggleFavorite(seriesId) {
    const index = this.favorites.indexOf(seriesId);
    const series = this.series.find(s => s.id === seriesId);
    
    if (index > -1) {
      this.favorites.splice(index, 1);
      this.showToast(`${series.title} removed from favorites`, 'info');
    } else {
      this.favorites.push(seriesId);
      this.showToast(`${series.title} added to favorites! ❤️`, 'success');
    }
    
    this.saveFavorites();
    this.renderSeries();
    
    // Dispatch custom event for other components
    document.dispatchEvent(new CustomEvent('favoritesUpdated', {
      detail: { favorites: this.favorites }
    }));
    
    // Add pulse animation to the card
    const card = document.querySelector(`[data-id="${seriesId}"]`);
    if (card) {
      card.classList.add('pulse');
      setTimeout(() => card.classList.remove('pulse'), 600);
    }
  }

  addScrollAnimations() {
    const cards = document.querySelectorAll('.series-card');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(card);
    });
  }

  showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
