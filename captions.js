/* ─────────────────────────────────────────────────────────────
   ALTYAZILAR / CAPTIONS — düzenlenebilir.
   Kısa, tek fikir, 6. sınıf dili. start/end saniye cinsinden.
   note: öğretmen için önerilen seslendirme cümlesi.
   ───────────────────────────────────────────────────────────── */
(function (root) {
  const CAPTIONS = [
    { scene: 1, start: 4.4, end: 10.0, tr: 'Mağaza A: %25 indirim. Mağaza B: fiyatın 3/4’ü', en: 'Shop A: 25% off. Shop B: 3/4 of the price',
      note: 'Aynı çanta 80 TL. Mağaza A yüzde 25 indirim yapıyor, mağaza B fiyatın dörtte üçünü istiyor. Hangisi daha ucuz?' },
    { scene: 2, start: 10.8, end: 17.8, tr: 'Verilen, istenen ve bir tahmin', en: 'What is given, what is asked, and a guess',
      note: 'Önce verilenleri ve istenenleri ayıralım. Verilen: 80 TL, yüzde 25 indirim, fiyatın dörtte üçü. İstenen: hangisi daha ucuz. Bir tahminde bulunalım: belki ikisi aynıdır?' },
    { scene: 2, start: 18.0, end: 23.4, tr: 'Şerit model: 80 TL 4 parça, her parça 20 TL', en: 'A bar model: 80 TL in 4 parts, 20 TL each',
      note: 'Şekille gösterelim. 80 TL’yi 4 eşit parçaya bölelim; her parça 20 TL. Yüzde 25, dörtte bir demek: A’da bir parça indirim, ödenen 60 TL.' },
    { scene: 2, start: 23.6, end: 29.8, tr: 'B’de 4 parçanın 3’ü: yine 60 TL', en: 'In B, 3 of the 4 parts: 60 TL again',
      note: 'B’de fiyatın dörtte üçünü ödüyoruz: 4 parçanın 3’ü, yine 60 TL. Şekle göre ikisi aynı.' },
    { scene: 3, start: 30.6, end: 38.2, tr: 'İşlemle: 80 − 20 = 60 ve 80 × 3/4 = 60', en: 'By calculation: 80 − 20 = 60 and 80 × 3/4 = 60',
      note: 'İşlemle çözelim. 80’in yüzde 25’i 20; 80 eksi 20, 60 TL. B’de 80 çarpı dörtte üç, 60 TL.' },
    { scene: 3, start: 38.4, end: 45.8, tr: 'Tahmin doğru: ikisi de 60 TL', en: 'The guess was right: both are 60 TL',
      note: 'Kontrol ettik, tahminimiz doğru: ikisi de 60 TL. Çünkü yüzde 25 indirim, fiyatın dörtte birini çıkarmak; bu da dörtte üçünü ödemek demek.' },
    { scene: 4, start: 46.6, end: 53.4, tr: '1/4 = 0,25 = %25 ve 3/4 = 0,75 = %75', en: '1/4 = 0.25 = 25% and 3/4 = 0.75 = 75%',
      note: 'Aynı sayıyı üç şekilde yazabiliriz: dörtte bir, sıfır virgül yirmi beş, yüzde yirmi beş. Dörtte üç de sıfır virgül yetmiş beş, yani yüzde yetmiş beş: 100 karenin 75’i.' },
    { scene: 4, start: 53.6, end: 59.8, tr: 'Kısa yol: 80 × 0,75 = 60', en: 'The short way: 80 × 0.75 = 60',
      note: 'Yüzde 25 indirimde fiyatın yüzde 75’ini ödersin. Kısa yol: 80 çarpı 0,75, tek işlemde 60 TL.' },
    { scene: 5, start: 60.6, end: 66.8, tr: 'İki kez %25 indirim, %50 indirim mi?', en: 'Is 25% off twice the same as 50% off?',
      note: 'Bir genelleme deneyelim: iki kez yüzde 25 indirim, yüzde 50 indirim eder mi? O zaman fiyat 40 TL olurdu.' },
    { scene: 5, start: 67.0, end: 72.8, tr: 'Hayır: 60’ın %25’i 15, fiyat 45 TL', en: 'No: 25% of 60 is 15, the price is 45 TL',
      note: 'Kontrol edelim. İlk indirimden sonra fiyat 60 TL. İkinci indirim 60 TL’nin yüzde 25’i, yani 15 TL. Fiyat 45 TL oluyor, 40 değil. Genelleme geçersiz.' },
    { scene: 5, start: 73.0, end: 79.8, tr: 'Her indirim o anki fiyata uygulanır', en: 'Each discount applies to the current price',
      note: 'Stratejimizi düzeltelim: her indirimi o anki fiyata uygularız. 0,75 çarpı 0,75, 0,5625; fiyatın yüzde 56,25’ini ödersin.' },
    { scene: 6, start: 80.6, end: 86.4, tr: 'Verilen, şekil, tahmin, çözüm, kontrol', en: 'Given, picture, guess, solve, check',
      note: 'Aklında kalsın: verilenleri ve istenenleri ayır, şekil ya da tabloyla göster, tahmin et, çöz ve kontrol et. Kısa yolları ve genellemeleri de mutlaka sına.' },
    { scene: 6, start: 86.8, end: 91.0, tr: '%25 indirim = fiyat × 0,75', en: '25% off = price × 0.75',
      note: 'Yüzde 25 indirim, fiyatı 0,75 ile çarpmaktır.' },
  ];
  if (typeof module !== 'undefined' && module.exports) module.exports = CAPTIONS;
  else { root.LI = root.LI || {}; root.LI.CAPTIONS = CAPTIONS; }
})(typeof window !== 'undefined' ? window : globalThis);
