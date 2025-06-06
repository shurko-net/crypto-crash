#############################################
#  STAGE 1: deps — устанавливаем зависимости монорепо
#############################################
FROM node:18-alpine AS deps

WORKDIR /app

# Corepack (Yarn 3+)
RUN corepack enable

# 1) Копируем корневые файлы монорепо
COPY package.json      yarn.lock      ./
COPY .yarnrc.yml       ./
COPY .yarn              ./.yarn

# 2) Копируем package.json фронтенда (workspace)
COPY packages/nextjs/package.json    packages/nextjs/package.json

# 3) Устанавливаем зависимости для всего репо (чтобы Yarn “знал” про workspace)
RUN yarn install --immutable


#############################################
#  STAGE 2: builder — внутри workspace делаем build
#############################################
FROM node:18-alpine AS builder

WORKDIR /app

# 1) Копируем node_modules из deps (чтобы Yarn мог быстро переиспользовать пакеты cache)
COPY --from=deps /app/node_modules        ./node_modules

# 2) Копируем весь исходник (включая workspace-папки)
COPY . .

# 3) Переходим в workspace packages/nextjs и делаем собственную установку 
WORKDIR /app/packages/nextjs

# (3a) Копируем отдельный .yarnrc.yml в рабочую папку (нужно Yarn v3).
#      Если .yarnrc.yml нужен, иначе пропустите.
# COPY ../../.yarnrc.yml ./
# COPY ../../.yarn    ./.yarn

# 3b) Устанавливаем зависимости **именно для workspace @se-2/nextjs**
RUN yarn install --immutable

# 4) Запускаем сборку Next.js
RUN yarn build


#############################################
#  STAGE 3: runner — готовим production-образ
#############################################
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# 1) Копируем билд из builder:
#    - папку .next
#    - папку public
COPY --from=builder /app/packages/nextjs/.next          ./packages/nextjs/.next
COPY --from=builder /app/packages/nextjs/public         ./packages/nextjs/public

# 2) Копируем node_modules из builder (он уже содержит только production-зависимости yarn workspace)
COPY --from=builder /app/packages/nextjs/node_modules   ./packages/nextjs/node_modules

# 3) Копируем package.json workspace
COPY --from=builder /app/packages/nextjs/package.json   ./packages/nextjs/package.json

# 4) Открываем порт 3000
EXPOSE 3000

# 5) Работаем в папке фронтенда и запускаем production-сервер Next.js
WORKDIR /app/packages/nextjs
CMD ["yarn", "start"]

