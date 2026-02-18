# Node.js LTS sürümü
FROM node:20-alpine

# Çalışma dizini
WORKDIR /app

# Paket dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install

# Kaynak kodları kopyala
COPY . .

# Uygulamayı build et (Next.js ise bu adım şarttır)
RUN npm run build

# Cloud Run'ın beklediği portu ortam değişkeni olarak ayarla
ENV PORT=8080

# Dışarıya 8080 portunu açtığımızı belirtelim
EXPOSE 8080

# BAŞLATMA KOMUTU (EN ÖNEMLİ KISIM BURASI)
# Next.js veya Express fark etmez, bu komut portu 8080'e zorlar.
# "--" işareti, npm'e "bundan sonraki parametreleri uygulamaya ilet" der.
CMD ["npm", "start", "--", "-p", "8080"]