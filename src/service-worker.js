// service-worker.js — fichier minimaliste pour activer l'option d'installation de l'application

self.addEventListener("install", () => {
  // Activation immédiate
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  // Prend le contrôle sans attendre
  clients.claim();
});

// Aucun fetch handler → aucun cache, aucun offline