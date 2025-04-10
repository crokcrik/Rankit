# Album Ranking App

Un'applicazione web per creare e gestire classifiche personalizzate di album musicali utilizzando l'API di Spotify.

## Caratteristiche

- 🎵 Ricerca album tramite l'API di Spotify
- 📊 Crea classifiche personalizzate
- ➕ Aggiungi album alle tue classifiche
- 🎨 Interfaccia moderna e reattiva

## Deployment Rapido

Il modo più veloce per deployare l'applicazione è utilizzare Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYOUR_USERNAME%2Falbum-ranking)

## Configurazione

1. Crea un'applicazione su [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Copia il Client ID e Client Secret
3. Durante il deployment su Vercel, aggiungi le seguenti variabili d'ambiente:
   - `SPOTIFY_CLIENT_ID`
   - `SPOTIFY_CLIENT_SECRET`
   - `DATABASE_URL` (se stai utilizzando un database)

## Sviluppo Locale

1. Clona il repository
```bash
git clone https://github.com/YOUR_USERNAME/album-ranking.git
cd album-ranking
```

2. Installa le dipendenze
```bash
npm install
# or
yarn install
```

3. Copia il file `.env.example` in `.env.local` e aggiungi le tue credenziali

4. Avvia il server di sviluppo
```bash
npm run dev
# or
yarn dev
```

5. Apri [http://localhost:3000](http://localhost:3000) nel tuo browser

## Tecnologie Utilizzate

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- [Tailwind CSS](https://tailwindcss.com/)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
