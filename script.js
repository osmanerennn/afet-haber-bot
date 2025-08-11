async function haberleriYukle() {
  // Haberlerin gösterileceği kutuyu seçiyoruz
  const liste = document.getElementById("haber-listesi");
  liste.innerHTML = "Yükleniyor...";

  try {
    // Haber API’si adresi (burada örnek API kullanıldı)
    const apiURL = "const apiURL = "https://newsapi.org/v2/top-headlines?country=tr&apiKey=70604d607009430a83bc49f57e1331d8";

    // API’den haberleri çekiyoruz
    const res = await fetch(apiURL);
    const data = await res.json();

    // Haber listesini temizle
    liste.innerHTML = "";

    // Gelen haberler arasında dolaş ve her birini kutu yaparak ekle
    data.articles.forEach(haber => {
      const div = document.createElement("div");
      div.className = "haber";
      div.innerHTML = `
        <h3>${haber.title}</h3>
        <p>${haber.description || ""}</p>
        <a href="${haber.url}" target="_blank">Habere git</a>
      `;
      liste.appendChild(div);
    });
  } catch (err) {
    // Hata olursa kullanıcıya bildir
    liste.innerHTML = "Haberler yüklenemedi.";
  }
}

// Sayfa yüklendiğinde haberleri çek ve göster
haberleriYukle();
