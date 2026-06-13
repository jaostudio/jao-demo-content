# Deploy Likha to Vercel — Checklist

## 1. Update local `.env.production`

```env
DATABASE_URL="libsql://jao-content-jamesonolitoquit.aws-us-east-1.turso.io"
TURSO_AUTH_TOKEN="eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9..."

NEXTAUTH_SECRET="5bc0a3d46b308f2585814f881e6be9ccdc99be176d1fceff6875f5bcfaea5c9d"
NEXT_PUBLIC_NEW_LAYOUT=true
NEXTAUTH_URL="https://likha.vercel.app"
```

> `.env.production` is gitignored — it stays local and serves as your env reference.

## 2. Push to GitHub

```bash
git add -A
git commit -m "Likha: Zora redesign + drawing tool + community features"
git push origin main
```

## 3. Vercel CLI — Login & Deploy

```bash
vercel login
vercel link           # link to your Vercel project
vercel env add DATABASE_URL production
vercel env add TURSO_AUTH_TOKEN production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXT_PUBLIC_NEW_LAYOUT production
vercel env add NEXTAUTH_URL production
vercel --prod
```

## 4. Seed the Database

After first deploy, run the seed via Vercel CLI or a one-off script:

```bash
npx prisma db push
npx prisma db seed
```

## 5. Verify

- https://likha.vercel.app — loads homepage gallery
- Sign in with `admin@content.dev` / `password123`
- Create a drawing, publish it, see it in the feed
- Toggle locale, test likes, comments
