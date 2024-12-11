# Scrable Pub

Bu proje, kullanıcıların kelime bulmacaları oluşturmasına ve düzenlemesine olanak tanıyan bir web uygulamasıdır. Kullanıcılar, bulmacalarını özelleştirebilir, arka plan resimleri ekleyebilir ve bulmacalarını kaydedebilirler.

## Kurulum

Projeyi çalıştırmak için aşağıdaki adımları izleyin:

1. Depoyu klonlayın:
    ```sh
    git clone <repository-url>
    cd scrable-pub
    ```

2. Gerekli bağımlılıkları yükleyin:
    ```sh
    npm install
    ```

3. Projeyi başlatın:
    ```sh
    npm start
    ```

## Kullanım

Uygulama başlatıldıktan sonra, tarayıcınızda `http://localhost:3000` adresine giderek uygulamayı kullanabilirsiniz.

### Özellikler

- **Kelime Bulmacası Düzenleme**: Kullanıcılar bulmacalarını düzenleyebilir, ipuçlarını ve cevapları değiştirebilir.
- **Özelleştirme Seçenekleri**: Kullanıcılar bulmacalarını özelleştirebilir, arka plan resimleri ekleyebilir ve bulmaca kontrastını ayarlayabilir.
- **Görüntü Kaydetme**: Kullanıcılar oluşturdukları bulmacaları kaydedebilir ve daha sonra kullanmak üzere saklayabilirler.

## Proje Yapısı

- `controllers/`: Uygulama mantığını yöneten kontrolörler.
  - `imageController.js`
  - `puzzleController.js`
- `public/`: Statik dosyalar (CSS, JS, görüntüler).
  - `css/`
  - `images/`
  - `js/`
    - `convertPng.js`
    - `script.js`
- `routers/`: Uygulama rotalarını yöneten dosyalar.
  - `imageRouter.js`
  - `puzzleRouter.js`
- `views/`: EJS şablon dosyaları.
  - `index.ejs`
  - `puzzle.ejs`
- `server.js`: Uygulamanın ana giriş noktası.

## Bağımlılıklar

- `canvas`: Canvas API'sini Node.js ortamında kullanmak için.
- `ejs`: Sunucu tarafında HTML şablonları oluşturmak için.
- `express`: Web sunucusu oluşturmak için.
- `node-fetch`: HTTP istekleri yapmak için.
- `request`: HTTP istekleri yapmak için.

## Katkıda Bulunma

Katkıda bulunmak isterseniz, lütfen bir pull request gönderin veya bir issue açın.

## Lisans

Bu proje [ISC Lisansı](LICENSE) ile lisanslanmıştır.