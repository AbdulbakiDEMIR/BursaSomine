# Node.js'in hafif sürümünü kullan
FROM node:18-alpine

# Çalışma klasörünü ayarla
WORKDIR /app

# Paket dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install

# Tüm proje dosyalarını kopyala
COPY . .

# Uygulamanın çalışacağı port (Cloud Run 8080 bekler)
EXPOSE 8080

# Başlatma komutu (package.json'da start scriptin varsa)
CMD ["npm", "start"]
