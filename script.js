// Harita oluşturma
const map = L.map('map').setView([39, 35], 5);

// OpenStreetMap katmanı
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Fay hattı verisini yükle ve göster
fetch('turkey_fault_lines.geojson')
  .then(res => res.json())
  .then(data => {
    L.geoJSON(data, {
      style: { color: 'orange', weight: 2 },
      onEachFeature: (feature, layer) => {
        layer.bindPopup(`<b>Fay Hattı:</b> ${feature.properties.Name || feature.properties.name || "Bilinmeyen"}`);
      }
    }).addTo(map);
  });

// Deprem ikon ayarı
const depremIcon = L.icon({
  iconUrl: 'https://img.icons8.com/color/48/000000/earthquake.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});

// USGS’den son depremleri çek ve haritada göster
fetch('https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&limit=50&orderby=time&minmagnitude=3')
  .then(res => res.json())
  .then(data => {
    data.features.forEach(deprem => {
      const coords = deprem.geometry.coordinates;
      const mag = deprem.properties.mag;
      const place = deprem.properties.place;
      const time = new Date(deprem.properties.time).toLocaleString();

      const marker = L.marker([coords[1], coords[0]], { icon: depremIcon }).addTo(map);

      const etkiYaricapi = mag * 10000;
      L.circle([coords[1], coords[0]], {
        radius: etkiYaricapi,
        color: 'red',
        fillOpacity: 0.15
      }).addTo(map);

      marker.bindPopup(`
        <b>${place}</b><br>
        Şiddet: ${mag}<br>
        Tarih: ${time}<br>
        Tahmini Etki Alanı: ${Math.round(etkiYaricapi / 1000)} km yarıçapında
      `);
    });
  });

// Afet haberleri için (örnek: NewsAPI veya kendi seçtiğin API)
// Örnek fonksiyon şablonu (kendi API anahtarını eklemelisin)
async function getDisasterNews() {
  const url = 'https://newsapi.org/v2/everything?q=fire OR flood OR earthquake&language=tr&apiKey=YOUR_API_KEY';
  const res = await fetch(url);
  const data = await res.json();
  
  data.articles.forEach(article => {
    console.log('Afet Haberi:', article.title, article.url);
    // İstersen haritada veya sayfada göster
  });
}
getDisasterNews();
