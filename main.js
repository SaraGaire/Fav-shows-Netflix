import { SeriesManager } from './modules/seriesManager.js';
import { SuggestionManager } from './modules/suggestionManager.js';
import { ShareManager } from './modules/shareManager.js';
import { TabManager } from './modules/tabManager.js';
import { UIManager } from './modules/uiManager.js';

// Main application class
class NetflixFavoritesApp {
  constructor() {
    this.seriesManager = new SeriesManager();
    this.suggestionManager = new SuggestionManager();
    this.shareManager = new ShareManager();
    this.tabManager = new TabManager();
    this.uiManager = new UIManager();
    
    this.init();
  }

  init() {
    // Initialize all managers
    this.seriesManager.init();
    this.suggestionManager.init();
    this.shareManager.init();
    this.tabManager.init();
    this.uiManager.init();

    // Setup global event listeners
    this.setupGlobalListeners();
    
    // Initial render
    this.render();
  }

  setupGlobalListeners() {
    // Search functionality
    document.getElementById('searchInput').addEventListener('input', (e) => {
      this.seriesManager.handleSearch(e.target.value);
    });

    // Genre filter
    document.getElementById('genreFilter').addEventListener('change', (e) => {
      this.seriesManager.handleFilter(e.target.value);
    });

    // Update stats when favorites change
    document.addEventListener('favoritesUpdated', () => {
      this.updateStats();
      this.shareManager.updateFavoritesPreview();
    });

    // Update suggestions list when new suggestion is added
    document.addEventListener('suggestionAdded', () => {
      this.suggestionManager.renderSuggestions();
    });
  }

  render() {
    this.seriesManager.renderSeries();
    this.updateStats();
    this.suggestionManager.renderSuggestions();
    this.shareManager.updateFavoritesPreview();
  }

  updateStats() {
    const totalSeries = this.seriesManager.getFilteredSeries().length;
    const favoriteCount = this.seriesManager.getFavorites().length;
    
    document.getElementById('totalSeries').textContent = totalSeries;
    document.getElementById('favoriteCount').textContent = favoriteCount;
  }
}

// Global functions for HTML onclick handlers
window.toggleFavorite = (seriesId) => {
  app.seriesManager.toggleFavorite(seriesId);
};

window.submitSuggestion = () => {
  app.suggestionManager.submitSuggestion();
};

window.shareToTwitter = () => {
  app.shareManager.shareToTwitter();
};

window.shareToFacebook = () => {
  app.shareManager.shareToFacebook();
};

window.shareToWhatsApp = () => {
  app.shareManager.shareToWhatsApp();
};

window.shareViaEmail = () => {
  app.shareManager.shareViaEmail();
};

window.copyShareLink = () => {
  app.shareManager.copyShareLink();
};

window.voteSuggestion = (id, type) => {
  app.suggestionManager.voteSuggestion(id, type);
};

// Initialize the application
const app = new NetflixFavoritesApp();

// Export for debugging
window.app = app;
