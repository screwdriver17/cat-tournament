# Dockerfile
FROM node:latest

# Создание директории приложения
WORKDIR /usr/src/app

# Установка зависимостей приложения
# Используется символ подстановки для копирования обоих файлов package.json и package-lock.json
COPY package*.json ./

RUN npm install

# Копирование исходного кода приложения
COPY . .

# Привязка порта, который будет использоваться приложением
EXPOSE 3000

CMD [ "node", "app.js" ]
