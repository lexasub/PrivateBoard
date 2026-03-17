# Локальное хранение CDN-ресурсов tldraw

Этот проект настроен для **полностью автономной работы** без зависимости от CDN tldraw.

## 📦 Что хранится локально

| Ресурс | Описание | Путь | Кол-во |
|--------|----------|------|--------|
| **Иконки UI** | Все иконки интерфейса (merged SVG) | `/tldraw-assets/icons/0_merged.svg` | 1 файл |
| **Переводы** | Языковые файлы JSON | `/tldraw-assets/translations/*.json` | 29 языков |
| **Шрифты** | IBM Plex + Shantell Sans | `/tldraw-assets/fonts/*.woff2` | 16 файлов |
| **Embed иконки** | Иконки внешних сервисов | `/tldraw-assets/embed-icons/*.png` | 17 файлов |

### Доступные embed-иконки

```
figma, youtube, excalidraw, codepen, codesandbox, vimeo,
tldraw, github_gist, google_calendar, google_slides,
replit, felt, spotify, observable, desmos, scratch, val_town
```

## 🚀 Быстрый старт

### 1. Скачивание ассетов

```bash
cd client
node scripts/download-tldraw-assets.js
```

Скрипт:
- Определяет установленную версию tldraw
- Скачивает все доступные ассеты с `cdn.tldraw.com`
- Сохраняет в `public/tldraw-assets/`

### 2. Сборка

```bash
bun run build
```

### 3. Запуск

```bash
# Development
bun run dev

# Production (Docker)
./build.sh
docker run -p 80:80 client-image
```

## 📁 Структура файлов

```
client/
├── public/
│   └── tldraw-assets/
│       ├── icons/
│       │   └── 0_merged.svg          # Все UI иконки
│       ├── translations/
│       │   ├── en.json
│       │   ├── ru.json
│       │   └── ...                   # 29 языков
│       ├── fonts/
│       │   ├── IBMPlexSans-*.woff2
│       │   ├── IBMPlexSerif-*.woff2
│       │   ├── IBMPlexMono-*.woff2
│       │   └── Shantell_Sans-*.woff2
│       └── embed-icons/
│           └── (опционально)
├── src/
│   ├── hooks/
│   │   └── useLocalTldrawAssets.js   # Хук для локальных URL
│   └── components/boards/
│       └── BoardEditor.jsx           # Использует assetUrls
└── scripts/
    └── download-tldraw-assets.js     # Скрипт загрузки
```

## 🔧 Как это работает

### 1. Хук `useLocalTldrawAssets`

Генерирует URLs для всех ассетов:

```javascript
import { useLocalTldrawAssets } from './hooks/useLocalTldrawAssets'

function BoardEditor() {
  const assetUrls = useLocalTldrawAssets()
  
  return <Tldraw assetUrls={assetUrls} {...props} />
}
```

### 2. Конфигурация nginx

```nginx
# Долгосрочное кэширование ассетов
location /tldraw-assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    access_log off;
}
```

### 3. Vite

Vite автоматически раздаёт файлы из `public/` как статику.

## 🔄 Обновление ассетов

При обновлении tldraw:

```bash
# 1. Обновите пакет
cd client
bun install tldraw@latest

# 2. Перескачайте ассеты
node scripts/download-tldraw-assets.js

# 3. Пересоберите
bun run build
```

## 🌐 Доступные языки

По умолчанию скачиваются 29 языков:

```
ar, ca, cs, da, de, el, en, es, fa, fi, fr,
gl, he, hr, hu, id, it, ja, ms, nl,
pl, ro, ru, sl, sv, th, tr, uk, vi
```

Для добавления языка:
1. Обновите список в `scripts/download-tldraw-assets.js`
2. Перезапустите скрипт загрузки

## ⚠️ Важные замечания

### Embed-иконки

Иконки для внешних сервисов (Figma, YouTube, etc.) могут отсутствовать в некоторых версиях tldraw. Это не критично — tldraw будет показывать иконки-заглушки.

### Шрифты

Шрифты хранятся в `/tldraw-assets/fonts/`. Если шрифт не загружается:
- Проверьте версию tldraw
- Убедитесь, что имена файлов совпадают с CDN

### Лицензия

Для production-использования tldraw требуется коммерческая лицензия от tldraw Inc.

## 🛠️ Troubleshooting

### Ошибка 404 при загрузке ассетов

```bash
# Проверьте версию tldraw
cat node_modules/tldraw/package.json | grep version

# Перескачайте ассеты
rm -rf public/tldraw-assets
node scripts/download-tldraw-assets.js
```

### Ассеты не загружаются в production

Проверьте nginx конфиг:
```bash
nginx -t  # Проверка конфигурации
nginx -s reload  # Перезагрузка
```

### WebSocket работает, но ассеты нет

Убедитесь, что `location /tldraw-assets/` находится **до** общих правил статики в nginx.conf.

## 📚 Ссылки

- [tldraw Documentation](https://tldraw.dev)
- [tldraw Assets Package](https://www.npmjs.com/package/@tldraw/assets)
- [Self-hosting Guide](https://tldraw.dev/installation)
