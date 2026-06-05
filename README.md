# Эпидемия самокатов — лонгрид

Редакторский одностраничник: полный текст репортажа, фото, хронология, интервью.

## Запуск

```bash
cd scooter-epidemic
python -m http.server 5173
```

Открыть: http://localhost:5173

## GitHub Pages — важно!

Папка `images/` **обязательно** должна быть в репозитории:

```
index.html
styles.css
app.js
images/        ← все 11 картинок
  cover-scooters.jpg
  hospital.png
  ...
```

При пуше на GitHub:

```bash
git add images/
git add .
git commit -m "add images"
git push
```

Без папки `images/` на GitHub картинки не появятся — только HTML/CSS.

## Структура

- Обложка с лидом
- Вступление
- Хронология 2021–2025
- Три интервью с фото
- Карта конфликтов (5 точек с иллюстрациями)
- Блок о регулировании
- Финал
