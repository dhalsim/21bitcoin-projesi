const { JSDOM } = require("jsdom");
const fs = require("fs").promises; // async/await için fs.promises kullanımı
const path = require("path");

// HTML dosyasının yolu
const htmlFilePath = path.join(__dirname, 'DOC-20230905-WA0005.-_1_.html');

// Görüntüleri kaydetmek için klasör yolu
const imagesDirPath = path.join(__dirname, 'images');

(async () => {
  try {
    // HTML dosyasını oku
    const htmlContent = await fs.readFile(htmlFilePath, 'utf8');
    const dom = new JSDOM(htmlContent);
    const document = dom.window.document;

    // `images` klasörünü yoksa oluştur
    await fs.mkdir(imagesDirPath, { recursive: true });

    const images = document.querySelectorAll("img");
    let count = 0;

    for (let img of images) {
      const src = img.getAttribute("src");
      if (src.startsWith("data:image/png;base64,")) {
        const base64Data = src.replace(/^data:image\/png;base64,/, "");
        const fileName = `image${++count}.png`;
        const filePath = path.join(imagesDirPath, fileName);

        // Dosyayı diske kaydet
        await fs.writeFile(filePath, base64Data, 'base64');
        console.log(`${fileName} başarıyla kaydedildi.`);

        // `<img>` etiketinin src özniteliğini güncelle
        img.setAttribute("src", `images/${fileName}`);
      }
    }

    // Güncellenmiş HTML içeriğini dosyaya yaz
    const updatedHtml = dom.serialize();
    await fs.writeFile(htmlFilePath, updatedHtml, 'utf8');

  } catch (err) {
    console.error("Bir hata oluştu:", err);
  }
})();