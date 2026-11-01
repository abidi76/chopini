import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const tree: Record<string, string[]> = {
  Mode: ['Femme', 'Homme', 'Enfant', 'Chaussures', 'Sacs et accessoires'],
  'Beauté et cosmétiques': ['Maquillage', 'Soins visage', 'Parfums', 'Cheveux'],
  Électronique: ['Téléphones', 'Ordinateurs', 'Audio', 'Jeux vidéo'],
  'Maison et déco': ['Meubles', 'Électroménager', 'Décoration'],
  'Enfants et bébé': ['Jouets', 'Puériculture'],
  'Sport et loisirs': ['Sport', 'Livres', 'Instruments'],
  Véhicules: ['Voitures', 'Motos', 'Pièces'],
};

const slug = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

async function main() {
  for (const [parent, children] of Object.entries(tree)) {
    const p = await prisma.category.upsert({
      where: { slug: slug(parent) },
      update: {},
      create: { name: parent, slug: slug(parent) },
    });
    for (const child of children) {
      await prisma.category.upsert({
        where: { slug: slug(`${parent}-${child}`) },
        update: {},
        create: { name: child, slug: slug(`${parent}-${child}`), parentId: p.id },
      });
    }
  }
}

main().finally(() => prisma.$disconnect());
