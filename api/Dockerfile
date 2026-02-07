# ============================================================
#  CASHFLOW API — Dockerfile
#  Imagem leve com Node.js Alpine
# ============================================================

FROM node:20-alpine

LABEL maintainer="CASHFLOW Team"
LABEL description="CASHFLOW API - Sistema de Controle Financeiro Profissional"

WORKDIR /app

# Instalar dependências primeiro (cache de camadas)
COPY package*.json ./
RUN npm install --production

# Copiar código
COPY . .

# Criar pasta de dados
RUN mkdir -p /app/data

# Variáveis de ambiente
ENV PORT=3000
ENV NODE_ENV=production
ENV JWT_SECRET=sua-chave-secreta-aqui-mude-em-producao
ENV JWT_EXPIRES=7d

# Expor porta
EXPOSE 3000

# Volume para persistência
VOLUME ["/app/data"]

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Iniciar
CMD ["node", "index.js"]
