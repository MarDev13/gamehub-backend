import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const RAWG_API_KEY = process.env.RAWG_API_KEY;
const RAWG_URL = "https://api.rawg.io/api/games";

async function fetchRawgGames(page = 1) {
  const res = await fetch(
    `${RAWG_URL}?key=${RAWG_API_KEY}&page=${page}&page_size=40&dates=1980-01-01,2005-12-31&tags=relaxing,pixel-art,cute&ordering=-rating`
  );

  if (!res.ok) {
    throw new Error("RAWG fetch failed");
  }

  return res.json();
}

function generatePrice() {
  return Number((Math.random() * 40 + 20).toFixed(2)); // 20€ – 60€
}

async function getOrCreateGenre(name: string) {
  return prisma.genre.upsert({
    where: { name },
    update: {},
    create: { name },
  });
}

async function getOrCreateTag(name: string) {
  return prisma.tag.upsert({
    where: { name },
    update: {},
    create: { name },
  });
}

async function getOrCreatePlatform(name: string) {
  return prisma.platform.upsert({
    where: { name },
    update: {},
    create: { name },
  });
}

async function importGames() {
  console.log("🚀 Importando juegos desde RAWG...");

  const genre = await getOrCreateGenre("Retro");

  const cozyTag = await getOrCreateTag("cozy");
  const retroTag = await getOrCreateTag("retro");

  let imported = 0;
  let page = 1;

  while (imported < 80) {
    const data = await fetchRawgGames(page);

    for (const game of data.results) {
      const exists = await prisma.game.findFirst({
        where: { title: game.name },
      });

      if (exists) continue;

      const platforms = await Promise.all(
        (game.platforms || []).map((p: any) =>
          getOrCreatePlatform(p.platform.name)
        )
      );

      await prisma.game.create({
        data: {
          title: game.name,
          description:
            game.slug ||
            "Juego retro con estética cozy y relajante.",
          imageUrl: game.background_image,
          price: generatePrice(),
          stock: 999,
          isPublished: true,
          genreId: genre.id,
          tags: {
            connect: [{ id: cozyTag.id }, { id: retroTag.id }],
          },
          platforms: {
            connect: platforms.map((p) => ({ id: p.id })),
          },
        },
      });

      imported++;
      console.log(`${game.name}`);
      if (imported >= 80) break;
    }

    page++;
  }

  console.log("Importación completada");
}

importGames()
  .catch((e) => {
    console.error("Error importando:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
