# Base image
FROM node:18-alpine

# Tạo thư mục làm việc
WORKDIR /app

# Copy file cấu hình
COPY package*.json ./

# Cài dependencies
RUN npm install

# Copy toàn bộ source code
COPY . .

# Biên dịch TypeScript → JavaScript
RUN npm run build

# Expose port ứng dụng
EXPOSE 5000

# Chạy ứng dụng
CMD ["node", "dist/server.js"]
