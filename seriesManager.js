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
    // In a real app, you would load from localStorage
    this.favorites = [];
  }

  saveFavorites() {
    // In a real app, you would save to localStorage
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
      const matchesSearch = series.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = genre === 'all' || series.genre === genre;
      return matchesSearch && matchesGenre;
    });
    this.renderSeries();
  }

  renderSeries() {
    const seriesGrid = document.getElementById('seriesGrid');
    
    if (this.filteredSeries.length === 0) {
      seriesGrid.innerHTML = '<div class="no-results
