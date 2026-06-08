import { PrismaClient } from '@prisma/marketplace-client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import bcrypt from 'bcryptjs'

const adapter = new PrismaLibSql(
  process.env.TURSO_AUTH_TOKEN
    ? { url: process.env.DATABASE_URL ?? 'file:./dev.db', authToken: process.env.TURSO_AUTH_TOKEN }
    : { url: process.env.DATABASE_URL ?? 'file:./dev.db' },
)
const prisma = new PrismaClient({ adapter })

// All passwords are 'likha2026' for demo purposes
const PASSWORD = 'likha2026'

// =====================================================
// DATA
// =====================================================

const USERS = [
  // Vendors
  {
    email: 'maria@likha.ph',
    name: 'Maria Santos',
    role: 'VENDOR' as const,
    avatar: '/avatars/maria-santos.jpg',
    bio: 'Third-generation weaver from the Cordilleras. We work with Kalinga and Ifugao master weavers to keep the tradition alive.',
    location: 'Baguio City, Benguet',
  },
  {
    email: 'juan@likha.ph',
    name: 'Juan dela Cruz',
    role: 'VENDOR' as const,
    avatar: '/avatars/juan-dela-cruz.jpg',
    bio: 'Sixth-generation potter. We throw clay the same way my great-great-grandfather did — by hand, on a kick wheel, fired in a wood kiln.',
    location: 'Taal, Batangas',
  },
  {
    email: 'lorna@likha.ph',
    name: 'Lorna Garcia',
    role: 'VENDOR' as const,
    avatar: '/avatars/lorna-garcia.jpg',
    bio: 'We restore heritage homes for a living, and source the abel, narra, and molave that go into them.',
    location: 'Vigan, Ilocos Sur',
  },
  {
    email: 'rico@likha.ph',
    name: 'Rico Morales',
    role: 'VENDOR' as const,
    avatar: '/avatars/rico-morales.jpg',
    bio: 'My family has been growing cacao on the foothills of Mt. Apo since 1962. We farm-to-bar every batch.',
    location: 'Davao City, Davao del Sur',
  },
  {
    email: 'teresa@likha.ph',
    name: 'Teresa Lim',
    role: 'VENDOR' as const,
    avatar: '/avatars/teresa-lim.jpg',
    bio: 'Cebuano craftswoman specializing in capiz, mother-of-pearl, and sustainably-sourced shells.',
    location: 'Cebu City, Cebu',
  },
  {
    email: 'andres@likha.ph',
    name: 'Chef Andres',
    role: 'VENDOR' as const,
    avatar: '/avatars/chef-andres.jpg',
    bio: 'Kapampangan culinary tradition. We make everything in small batches, the way Lola taught me.',
    location: 'Angeles, Pampanga',
  },
  // Admin
  {
    email: 'admin@likha.ph',
    name: 'Likha Admin',
    role: 'ADMIN' as const,
    avatar: '/avatars/likha-admin.jpg',
    bio: 'Platform administrator.',
    location: 'Manila, Metro Manila',
  },
  // Buyers
  {
    email: 'isabel@test.ph',
    name: 'Isabel Reyes',
    role: 'BUYER' as const,
    avatar: '/avatars/isabel-reyes.jpg',
    bio: 'Artisan goods collector and proud Lola.',
    location: 'Quezon City, Metro Manila',
  },
  {
    email: 'paolo@test.ph',
    name: 'Paolo Cruz',
    role: 'BUYER' as const,
    avatar: '/avatars/paolo-cruz.jpg',
    bio: 'Coffee enthusiast and home chef.',
    location: 'Makati City, Metro Manila',
  },
  {
    email: 'liza@test.ph',
    name: 'Liza Mendoza',
    role: 'BUYER' as const,
    avatar: '/avatars/liza-mendoza.jpg',
    bio: 'Interior designer, supports local artisans.',
    location: 'Cebu City, Cebu',
  },
]

const CATEGORIES = [
  { slug: 'textiles', name: 'Handwoven & Textiles', icon: 'Shirt', cover: '/categories/textiles.jpg' },
  { slug: 'pottery', name: 'Pottery & Ceramics', icon: 'Coffee', cover: '/categories/pottery.jpg' },
  { slug: 'woodcraft', name: 'Woodcraft & Furniture', icon: 'TreeDeciduous', cover: '/categories/woodcraft.jpg' },
  { slug: 'food-drink', name: 'Artisan Food & Drinks', icon: 'Utensils', cover: '/categories/food-drink.jpg' },
  { slug: 'fashion', name: 'Fashion & Accessories', icon: 'Gem', cover: '/categories/fashion.jpg' },
  { slug: 'home-decor', name: 'Home & Decor', icon: 'Lamp', cover: '/categories/home-decor.jpg' },
  { slug: 'art-prints', name: 'Art & Prints', icon: 'Palette', cover: '/categories/art-prints.jpg' },
]

// Prices in PHP cents (₱1 = 100 cents)
const php = (pesos: number) => Math.round(pesos * 100)

const LISTINGS = [
  // ===== Maria — Likha Weaves (6 total: 5 products + 1 service) =====
  {
    title: 'Inabel Blanket (Twin)',
    slug: 'inabel-blanket-twin',
    description:
      'Handwoven in Ilocos Sur using 100% cotton. White and natural indigo, the patterns run deep into the fabric — this is not printed. Twin size 60×80 inches. Machine washable on gentle cycle. Each piece takes about a week to weave on a traditional backstrap loom.',
    price: php(3200),
    stock: 5,
    vendor: 'maria@likha.ph',
    category: 'textiles',
    image: '/products/inabel-blanket.jpg',
  },
  {
    title: 'Kalinga Wrap Skirt',
    slug: 'kalinga-wrap-skirt',
    description:
      'Traditional wrap skirt in red and black stripes — the colors of the Kalinga people. Hand-woven on a backstrap loom using natural dye from the achuete seed. One size fits most (adjustable wrap).',
    price: php(1850),
    stock: 8,
    vendor: 'maria@likha.ph',
    category: 'fashion',
    image: '/products/kalinga-skirt.jpg',
  },
  {
    title: "T'boli T'nalak Cloth (per meter)",
    slug: 'tboli-tnalak-cloth',
    description:
      "Authentic T'nalak weaved by T'boli dream weavers from Lake Sebu. Abaca fiber, dyed with natural materials (the dream weavers say the patterns come to them in dreams). Sold per running meter, 36 inches wide.",
    price: php(950),
    stock: 12,
    vendor: 'maria@likha.ph',
    category: 'textiles',
    image: '/products/tnalak-cloth.jpg',
  },
  {
    title: 'Ifugao Sungka Board',
    slug: 'ifugao-sungka-board',
    description:
      'Hand-carved from a single piece of narra wood in the Ifugao tradition. The traditional Filipino two-player mancala game. Includes 14 small shells (capiz). 60cm × 18cm.',
    price: php(1400),
    stock: 4,
    vendor: 'maria@likha.ph',
    category: 'home-decor',
    image: '/products/ifugao-sungka.jpg',
  },
  {
    title: 'Cordillera Shoulder Bag',
    slug: 'cordillera-shoulder-bag',
    description:
      'Hand-woven strap with leather body. The strap alone takes 3 days to weave. Adjustable length, internal pocket, magnetic closure. Brown leather with natural-colored weave.',
    price: php(980),
    stock: 10,
    vendor: 'maria@likha.ph',
    category: 'fashion',
    image: '/products/cordillera-bag.jpg',
  },
  // Maria's service
  {
    title: 'Custom Weave Consultation',
    slug: 'custom-weave-consultation',
    description:
      '30-minute video consultation with Maria. Discuss your custom textile project — color, pattern, size, timeline. Bookable online; available Tuesdays, Thursdays, and Saturdays.',
    price: php(500),
    stock: 20,
    vendor: 'maria@likha.ph',
    category: 'textiles',
    image: '/products/weave-consultation.jpg',
    isService: true,
    bookingDuration: 30,
  },
  // Maria's new products
  {
    title: 'Heritage Kamiseta',
    slug: 'heritage-kamiseta',
    description:
      'Hand-embroidered traditional Filipino blouse made from piña-seda (pineapple-silk blend). The embroidery pattern is inspired by the Cordillera rice terraces. Each piece takes two weeks to complete by master embroiderers from Lumban, Laguna.',
    price: php(4500),
    stock: 0,
    vendor: 'maria@likha.ph',
    category: 'fashion',
    image: '/products/heritage-kamiseta.jpg',
  },
  {
    title: 'Handwoven Banig Mat (Single)',
    slug: 'handwoven-banig-mat',
    description:
      'Traditional sleeping mat handwoven from pandan leaves. Natural beige with indigo stripes. Single size 36×72 inches. Rolled for shipping. These mats are used in Filipino homes for afternoon naps and as picnic blankets.',
    price: php(1200),
    stock: 2,
    vendor: 'maria@likha.ph',
    category: 'textiles',
    image: '/products/banig-mat.jpg',
  },
  {
    title: 'Pinukpok Abaca Wall Hanging',
    slug: 'pinukpok-abaca-wall-hanging',
    description:
      'Hand-beaten abaca fiber wall art. The "pinukpok" technique involves pounding abaca stalks until the fibers separate, then weaving them into intricate patterns. 60×90cm. Natural ecru color with earth-tone stripes.',
    price: php(2800),
    stock: 7,
    vendor: 'maria@likha.ph',
    category: 'textiles',
    image: '/products/pinukpok-abaca.jpg',
  },
  {
    title: 'Pineapple Fiber Scarf',
    slug: 'pineapple-fiber-scarf',
    description:
      'Luxuriously soft scarf woven from piña (pineapple fiber). The fiber is hand-stripped from pineapple leaves, a tradition that dates back to the Spanish colonial era. Lightweight, breathable, and naturally lustrous. 30×150cm.',
    price: php(1800),
    stock: 6,
    vendor: 'maria@likha.ph',
    category: 'fashion',
    image: '/products/pineapple-scarf.jpg',
  },
  {
    title: 'Abaca Market Tote',
    slug: 'abaca-market-tote',
    description:
      'Eco-friendly market bag woven from abaca fiber. Reinforced leather handles, internal pocket, folds flat for storage. 40×35cm. Strong enough for your weekly wet market run, beautiful enough for the office.',
    price: php(750),
    stock: 15,
    vendor: 'maria@likha.ph',
    category: 'textiles',
    image: '/products/abaca-tote.jpg',
  },

  // ===== Juan — Taal Pottery (6 total: 5 products + 1 service) =====
  {
    title: 'Burnay Clay Jar (25cm)',
    slug: 'burnay-clay-jar',
    description:
      'Traditional palayok jar, the kind we have been making in Taal since the 1800s. Earthy terracotta, food-safe glaze inside. Holds 3 liters. Each jar is signed by the potter who threw it.',
    price: php(1800),
    stock: 6,
    vendor: 'juan@likha.ph',
    category: 'pottery',
    image: '/products/burnay-jar.jpg',
  },
  {
    title: 'Mini Pot Trio (set of 3)',
    slug: 'mini-pot-trio',
    description:
      'Set of 3 mini clay pots with matching tiny spoons. Perfect for salt, spice, or succulents. Unglazed terracotta — develops character with use. 6cm tall each.',
    price: php(450),
    stock: 15,
    vendor: 'juan@likha.ph',
    category: 'home-decor',
    image: '/products/mini-pot-trio.jpg',
  },
  {
    title: 'Ceramic Pour-Over Set',
    slug: 'ceramic-pour-over',
    description:
      'Hand-thrown ceramic dripper with matching carafe. Holds 4 cups. The pour-over is sized to fit a #02 paper filter, but works beautifully with our locally-made abaca filters too.',
    price: php(2200),
    stock: 7,
    vendor: 'juan@likha.ph',
    category: 'pottery',
    image: '/products/pour-over.jpg',
  },
  {
    title: 'Tagay Pitcher (Large)',
    slug: 'tagay-pitcher',
    description:
      'Traditional carafe with two ears. For water, juice, or arrack (the local coconut spirit). Holds 1.5 liters. Glazed interior, unglazed exterior — the natural clay breathes.',
    price: php(1650),
    stock: 5,
    vendor: 'juan@likha.ph',
    category: 'pottery',
    image: '/products/tagay-pitcher.jpg',
  },
  {
    title: 'Terracotta Planter (30cm)',
    slug: 'terracotta-planter-30',
    description:
      'Wide-mouth planter with drainage hole. Unglazed terracotta — perfect for plants that prefer to dry out between waterings. 30cm diameter, 25cm tall.',
    price: php(1100),
    stock: 9,
    vendor: 'juan@likha.ph',
    category: 'home-decor',
    image: '/products/terracotta-planter.jpg',
  },
  // Juan's service
  {
    title: 'Pottery Wheel Workshop (Taal)',
    slug: 'pottery-wheel-workshop',
    description:
      'In-person workshop at our Taal studio. 2 hours, all materials included. Learn to throw a bowl on the wheel, then take home your own piece (fired and glazed in 2 weeks, shipped anywhere in PH). Saturdays only, max 4 participants per session.',
    price: php(1500),
    stock: 8,
    vendor: 'juan@likha.ph',
    category: 'pottery',
    image: '/products/pottery-workshop.jpg',
    isService: true,
    bookingDuration: 120,
  },
  // Juan's new products
  {
    title: 'Ceramic Vase (Tall)',
    slug: 'ceramic-vase-tall',
    description:
      'Tall ceramic vase with a narrow neck, thrown on a wheel in two sections and joined by hand. Glazed in celadon green. 40cm tall. Holds a generous bouquet of native flowers — santan, sampaguita, or wild ferns.',
    price: php(2500),
    stock: 0,
    vendor: 'juan@likha.ph',
    category: 'pottery',
    image: '/products/ceramic-vase.jpg',
  },
  {
    title: 'Itneg Wine Goblet (set of 2)',
    slug: 'itneg-wine-goblet',
    description:
      'Hand-thrown wine goblets inspired by traditional Itneg drinking vessels. Each goblet is unique — the glaze creates unpredictable patterns during firing. 12cm tall. Dishwasher safe on gentle cycle.',
    price: php(1500),
    stock: 8,
    vendor: 'juan@likha.ph',
    category: 'home-decor',
    image: '/products/itneg-wine-glass.jpg',
  },
  {
    title: 'Garden Ceramic Turtle',
    slug: 'garden-ceramic-turtle',
    description:
      'Whimsical garden ornament hand-sculpted from terracotta. Each turtle has a unique expression and shell pattern. 20×25cm. Suitable for garden, patio, or as a quirky indoor planter (succulents recommended).',
    price: php(1200),
    stock: 7,
    vendor: 'juan@likha.ph',
    category: 'pottery',
    image: '/products/garden-turtle.jpg',
  },

  // ===== Lorna — Ilocos Heritage (5 products, no service) =====
  {
    title: 'Narra Salad Bowl',
    slug: 'narra-salad-bowl',
    description:
      'Turned from sustainably-sourced narra wood. 25cm diameter, food-safe oil finish. The grain on this piece is exceptional — we waited three months for the right log.',
    price: php(1200),
    stock: 8,
    vendor: 'lorna@likha.ph',
    category: 'woodcraft',
    image: '/products/narra-bowl.jpg',
  },
  {
    title: 'Vigan Wooden Chair',
    slug: 'vigan-wooden-chair',
    description:
      'Hand-crafted in the Vigan tradition. Solid molave (one of the hardest woods in PH). H 90cm × W 45cm × D 45cm. Pairs with our Ilocos dining tables, or stands alone as a statement piece.',
    price: php(4500),
    stock: 3,
    vendor: 'lorna@likha.ph',
    category: 'woodcraft',
    image: '/products/vigan-chair.jpg',
  },
  {
    title: 'Abel Iloco Table Runner',
    slug: 'abel-iloco-table-runner',
    description:
      'Hand-loomed abel fabric from Ilocos Sur. 30×180 cm. White with a subtle weave pattern that catches the light. Cotton, machine washable.',
    price: php(1400),
    stock: 10,
    vendor: 'lorna@likha.ph',
    category: 'textiles',
    image: '/products/abel-runner.jpg',
  },
  {
    title: 'Bamboo Tray (set of 2)',
    slug: 'bamboo-tray-set',
    description:
      'Round bamboo trays, woven edge. Small (20cm) + medium (30cm). Lightweight, food-safe, perfect for serving or as a base for plants and candles.',
    price: php(680),
    stock: 12,
    vendor: 'lorna@likha.ph',
    category: 'home-decor',
    image: '/products/bamboo-tray.jpg',
  },
  {
    title: 'Hardwood Mortar & Pestle',
    slug: 'hardwood-mortar-pestle',
    description:
      'For pounding spices, making dinuguan, or crushing garlic the way Lola did. Heavy molave, will last generations. 18cm diameter.',
    price: php(850),
    stock: 11,
    vendor: 'lorna@likha.ph',
    category: 'woodcraft',
    image: '/products/mortar-pestle.jpg',
  },
  // Lorna's new products
  {
    title: 'Rattan Sunburst Mirror',
    slug: 'rattan-sunburst-mirror',
    description:
      'Round mirror framed in hand-woven rattan strips radiating outward like the sun. 60cm diameter. A statement piece that brings warmth and texture to any wall. The rattan is sourced from sustainable farms in Palawan.',
    price: php(3800),
    stock: 0,
    vendor: 'lorna@likha.ph',
    category: 'home-decor',
    image: '/products/rattan-mirror.jpg',
  },
  {
    title: 'Small Bamboo Basket',
    slug: 'small-bamboo-basket',
    description:
      'Hand-woven bamboo basket with a tight weave. Perfect for storing fruits, bread, or as a catch-all on your entryway table. 20cm diameter, 15cm tall. Made from locally-harvested bamboo treated against pests.',
    price: php(580),
    stock: 3,
    vendor: 'lorna@likha.ph',
    category: 'woodcraft',
    image: '/products/bamboo-basket.jpg',
  },
  {
    title: 'Wood Carved Serving Platter',
    slug: 'wood-carved-platter',
    description:
      'Hand-carved from a single slab of acacia wood. The natural grain runs the length of the platter — no two pieces are alike. Food-safe oil finish. 45×20cm. Perfect for cheese, charcuterie, or as a serving piece for lechon.',
    price: php(2200),
    stock: 6,
    vendor: 'lorna@likha.ph',
    category: 'woodcraft',
    image: '/products/wood-platter.jpg',
  },
  {
    title: 'Mahogany Picture Frame (A4)',
    slug: 'mahogany-picture-frame',
    description:
      'Solid Philippine mahogany picture frame. Hand-mitered corners, brass hanging hardware, and a standing easel back. Holds A4 (21×29.7cm) photos or artwork. The rich reddish-brown wood darkens beautifully with age.',
    price: php(980),
    stock: 12,
    vendor: 'lorna@likha.ph',
    category: 'woodcraft',
    image: '/products/mahogany-frame.jpg',
  },
  {
    title: 'Hand-painted Mural Canvas (60×90cm)',
    slug: 'hand-painted-mural-canvas',
    description:
      'Original acrylic painting on stretched canvas by a collaborating Ilocano artist. Depicts scenes from daily life in the Ilocos region — farmers in the field, carabaos, and the iconic Vigan cobblestone streets. 60×90cm, ready to hang.',
    price: php(6500),
    stock: 5,
    vendor: 'lorna@likha.ph',
    category: 'art-prints',
    image: '/products/mural-canvas.jpg',
  },

  // ===== Rico — Davao Gold (6 total: 5 products + 1 service) =====
  {
    title: 'Sagada Arabica 250g',
    slug: 'sagada-arabica-250g',
    description:
      'Single-origin, medium roast. Notes of dark chocolate, walnut, and citrus. Grown at 1,500m elevation in the Cordillera mountains. Whole bean (we can grind for you on request).',
    price: php(480),
    stock: 25,
    vendor: 'rico@likha.ph',
    category: 'food-drink',
    image: '/products/sagada-arabica.jpg',
  },
  {
    title: 'Tablea de Cacao (6-pack)',
    slug: 'tablea-de-cacao-6pack',
    description:
      'Pure cacao tablets. For tsokolate (traditional Filipino hot chocolate) or baking. Stone-ground, no sugar added. 6×30g tablets per pack.',
    price: php(380),
    stock: 30,
    vendor: 'rico@likha.ph',
    category: 'food-drink',
    image: '/products/tablea-cacao.jpg',
  },
  {
    title: 'Cacao Nibs 100g',
    slug: 'cacao-nibs-100g',
    description:
      'Roasted, crushed cacao beans. For toppings on smoothie bowls, baking, or eating by the handful. 100% cacao, no sugar.',
    price: php(280),
    stock: 20,
    vendor: 'rico@likha.ph',
    category: 'food-drink',
    image: '/products/cacao-nibs.jpg',
  },
  {
    title: 'Barako Coffee 200g',
    slug: 'barako-coffee-200g',
    description:
      'Liberica beans from Batangas. Bold, strong, with smoky notes and a distinctive jackfruit aroma — this is the coffee your grandparents remember. Whole bean.',
    price: php(420),
    stock: 18,
    vendor: 'rico@likha.ph',
    category: 'food-drink',
    image: '/products/barako-coffee.jpg',
  },
  {
    title: 'Single-Origin Bundle (3)',
    slug: 'coffee-bundle-3',
    description:
      'Sagada Arabica + Barako + Benguet. Three 100g bags. A flight of Filipino coffee terroir — highland, lowland, and mid-elevation. Save ₱150 vs buying separately.',
    price: php(1250),
    stock: 15,
    vendor: 'rico@likha.ph',
    category: 'food-drink',
    image: '/products/coffee-bundle.jpg',
  },
  {
    title: 'Sagada Arabica (Single Origin)',
    slug: 'sagada-arabica-single-origin',
    description:
      'Single-origin arabica from Sagada, Mountain Province. Bright acidity, citrus notes, clean finish. 200g bag — hand-sorted, sun-dried, small-batch roasted.',
    price: php(450),
    stock: 30,
    vendor: 'rico@likha.ph',
    category: 'food-drink',
    image: '/products/sagada-arabica.jpg',
  },
  // Rico's service
  {
    title: 'Private Coffee Cupping',
    slug: 'private-coffee-cupping',
    description:
      '60-minute guided coffee tasting. Learn about origin, roast, and brewing. 5 single-origin samples included. Held in Davao or online (we ship the samples).',
    price: php(800),
    stock: 10,
    vendor: 'rico@likha.ph',
    category: 'food-drink',
    image: '/products/coffee-cupping.jpg',
    isService: true,
    bookingDuration: 60,
  },
  // Rico's new products
  {
    title: 'Benguet Arabica Coffee 200g',
    slug: 'benguet-arabica-200g',
    description:
      'Single-origin Arabica from the highlands of Benguet. Grown at 1,400m elevation, this coffee has a bright acidity with notes of green apple and honey. Medium roast. Whole bean, 200g.',
    price: php(420),
    stock: 3,
    vendor: 'rico@likha.ph',
    category: 'food-drink',
    image: '/products/benguet-arabica.jpg',
  },
  {
    title: 'Davao Wild Honey 250g',
    slug: 'davao-wild-honey-250g',
    description:
      'Raw, unfiltered honey harvested from stingless bees (Kiwot) in the forests of Davao. The bees forage on wild coffee blossoms and native fruiting trees, giving the honey a complex floral-citrus profile. 250g jar.',
    price: php(550),
    stock: 12,
    vendor: 'rico@likha.ph',
    category: 'food-drink',
    image: '/products/davao-honey.jpg',
  },
  {
    title: 'Cacao Tea Bags (12-pack)',
    slug: 'cacao-tea-bags-12pack',
    description:
      'Roasted cacao shell tea bags. Made from the husks of our single-origin Davao cacao beans. Naturally caffeine-free, rich in antioxidants, with a subtle chocolate aroma. 12 individually wrapped tea bags.',
    price: php(280),
    stock: 20,
    vendor: 'rico@likha.ph',
    category: 'food-drink',
    image: '/products/cacao-tea.jpg',
  },

  // ===== Teresa — Cebu Craft (5 products, no service) =====
  {
    title: 'Capiz Shell Pendant Light',
    slug: 'capiz-pendant-light',
    description:
      'Drum-shaped pendant, hand-laid capiz shells. 35cm diameter. Bulb not included (we recommend a warm E27 LED). Comes with 2m of black cloth cord and a ceiling canopy.',
    price: php(2800),
    stock: 4,
    vendor: 'teresa@likha.ph',
    category: 'home-decor',
    image: '/products/capiz-pendant.jpg',
  },
  {
    title: 'Shell-Crafted Earrings',
    slug: 'shell-craft-earrings',
    description:
      'Lightweight capiz shell earrings. Hypoallergenic stainless hooks. Multiple designs — let us know your preference (round, leaf, fish, or geometric). Pairs beautifully with linen and cotton.',
    price: php(350),
    stock: 30,
    vendor: 'teresa@likha.ph',
    category: 'fashion',
    image: '/products/shell-earrings.jpg',
  },
  {
    title: 'Cebu Guitar Pick (set of 6)',
    slug: 'cebu-guitar-pick',
    description:
      'Hand-cut shell picks. 6 designs in a small fabric pouch (made from scrap abaca). A tiny piece of Cebu in your pocket.',
    price: php(220),
    stock: 50,
    vendor: 'teresa@likha.ph',
    category: 'art-prints',
    image: '/products/guitar-pick.jpg',
  },
  {
    title: 'Mother-of-Pearl Bracelet',
    slug: 'mother-of-pearl-bracelet',
    description:
      'Polished shell discs on stretch cord. Adjustable 16–20cm. Each disc is unique — we hand-sort the shells to get the right iridescence.',
    price: php(580),
    stock: 18,
    vendor: 'teresa@likha.ph',
    category: 'fashion',
    image: '/products/mother-of-pearl-bracelet.jpg',
  },
  {
    title: 'Capiz Window Panel (set of 3)',
    slug: 'capiz-window-panel',
    description:
      'Three panel capiz window covering. Each panel 40×80 cm. Hand-laid shells in a traditional Capiz pattern. Lets light in but provides privacy.',
    price: php(2200),
    stock: 6,
    vendor: 'teresa@likha.ph',
    category: 'home-decor',
    image: '/products/capiz-window.jpg',
  },
  // Teresa's new products
  {
    title: 'Limited Edition Shell Necklace',
    slug: 'limited-shell-necklace',
    description:
      'Statement necklace hand-strung with capiz discs, mother-of-pearl drops, and small cowrie shells. Each piece is one-of-a-kind — the shells are hand-selected for color and luster. 45cm length with adjustable chain.',
    price: php(2800),
    stock: 0,
    vendor: 'teresa@likha.ph',
    category: 'fashion',
    image: '/products/shell-necklace.jpg',
  },
  {
    title: 'Puka Shell Anklet',
    slug: 'puka-shell-anklet',
    description:
      'Hand-strung puka shell anklet with gold-tone accent beads. Adjustable from 23cm to 28cm. Lightweight and comfortable for daily wear. The puka shells are naturally tumbled by the sea — no two are the same.',
    price: php(380),
    stock: 1,
    vendor: 'teresa@likha.ph',
    category: 'fashion',
    image: '/products/puka-anklet.jpg',
  },
  {
    title: 'Capiz Coaster Set (4)',
    slug: 'capiz-coaster-set-4',
    description:
      'Set of 4 hexagonal capiz shell coasters mounted on cork backing. 10cm diameter each. The iridescent shells catch the light beautifully — each coaster shimmers differently depending on the angle. Wipe clean with a damp cloth.',
    price: php(680),
    stock: 15,
    vendor: 'teresa@likha.ph',
    category: 'home-decor',
    image: '/products/capiz-coaster.jpg',
  },
  {
    title: 'Shell Wind Chime',
    slug: 'shell-wind-chime',
    description:
      'Capiz shell wind chime with a bamboo top piece and coconut shell striker. 8 strings of graduated shell discs. The shells produce a soft, tinkling sound — like waves on a Cebu shoreline. 60cm total length.',
    price: php(1400),
    stock: 10,
    vendor: 'teresa@likha.ph',
    category: 'home-decor',
    image: '/products/shell-wind-chime.jpg',
  },
  {
    title: 'Capiz Candle Holder (Set of 3)',
    slug: 'capiz-candle-holder-set-3',
    description:
      'Set of 3 hand-assembled capiz shell candle holders. Holds standard tea light candles. The shells cast a warm, dancing glow when lit. Heights: 8cm, 12cm, 15cm. Perfect for dinner parties or a relaxing evening.',
    price: php(1200),
    stock: 8,
    vendor: 'teresa@likha.ph',
    category: 'home-decor',
    image: '/products/capiz-candle-holder.jpg',
  },

  // ===== Chef Andres — Pampanga Kitchen (5 products, no service) =====
  {
    title: 'Tocino Slices (500g)',
    slug: 'tocino-slices-500g',
    description:
      'Sweet cured pork, family recipe. Frozen, ready to fry. Serves 4–6. The sweetness is just right, not overly so. Fry till edges are crispy.',
    price: php(480),
    stock: 20,
    vendor: 'andres@likha.ph',
    category: 'food-drink',
    image: '/products/tocino.jpg',
  },
  {
    title: 'Longganisa Sausage (10pc)',
    slug: 'longganisa-10pc',
    description:
      'Garlic-rich Kapampangan longganisa. Vacuum-sealed. 10 pieces per pack. Sweet variant (our family recipe). Best pan-fried from frozen.',
    price: php(420),
    stock: 25,
    vendor: 'andres@likha.ph',
    category: 'food-drink',
    image: '/products/longganisa.jpg',
  },
  {
    title: 'Tsokolate Tablet (250g)',
    slug: 'tsokolate-tablet-250g',
    description:
      'Stone-ground tablea from Davao. For traditional hot tsokolate ah — melt in hot water, add milk and sugar to taste. 250g, makes about 8 cups.',
    price: php(320),
    stock: 30,
    vendor: 'andres@likha.ph',
    category: 'food-drink',
    image: '/products/tsokolate-tablet.jpg',
  },
  {
    title: 'Suka ng Tuba (500ml)',
    slug: 'suka-ng-tuba',
    description:
      'Coconut sap vinegar, aged 1 year. Unpasteurized, so the "mother" is intact. For sinigang, or drizzle on grilled fish. Tastes like nowhere else.',
    price: php(180),
    stock: 40,
    vendor: 'andres@likha.ph',
    category: 'food-drink',
    image: '/products/suka-vinegar.jpg',
  },
  {
    title: 'Pampanga Buko Pie (3pc)',
    slug: 'pampanga-buko-pie',
    description:
      'Frozen, ready to bake. 3 individual pies. 12cm diameter. The famous pie from the culinary capital of the Philippines — tender young coconut in a flaky crust.',
    price: php(580),
    stock: 15,
    vendor: 'andres@likha.ph',
    category: 'food-drink',
    image: '/products/buko-pie.jpg',
  },
  // Andres' new products
  {
    title: 'Mangosteen Vinegar 250ml',
    slug: 'mangosteen-vinegar-250ml',
    description:
      'Artisanal vinegar made from fermented mangosteen peel. Fruity and tangy with a distinctive purple-pink hue. A specialty of the Davao region. Perfect for salad dressings, dipping sauces, or deglazing pans.',
    price: php(280),
    stock: 3,
    vendor: 'andres@likha.ph',
    category: 'food-drink',
    image: '/products/mangosteen-vinegar.jpg',
  },
  {
    title: 'Coconut Sugar 500g',
    slug: 'coconut-sugar-500g',
    description:
      'Organic coconut sugar from the sap of coconut blossoms. Low glycemic index, rich in minerals. Caramel-like flavor that works beautifully in coffee, baking, and traditional Filipino desserts. 500g resealable pack.',
    price: php(320),
    stock: 25,
    vendor: 'andres@likha.ph',
    category: 'food-drink',
    image: '/products/coconut-sugar.jpg',
  },
  {
    title: 'Dried Mangoes 200g',
    slug: 'dried-mangoes-200g',
    description:
      'Sun-dried carabao mangoes from Guimaras — the sweetest mangoes in the world. No added sugar, no preservatives. Naturally sweet and chewy. 200g resealable pack. A classic Filipino pasalubong.',
    price: php(250),
    stock: 30,
    vendor: 'andres@likha.ph',
    category: 'food-drink',
    image: '/products/dried-mangoes.jpg',
  },

  // ===== Banaue Rice Terraces Print (art-prints, vendor Lorna) =====
  {
    title: 'Banaue Rice Terraces Photo Print',
    slug: 'banaue-rice-terraces-print',
    description:
      'Limited-edition fine art photograph of the Banaue Rice Terraces. Printed on archival matte paper (A3, 11.7×16.5 inches) with pigment inks. Each print is signed and numbered by the photographer. Shipped flat in a rigid mailer.',
    price: php(8500),
    stock: 20,
    vendor: 'lorna@likha.ph',
    category: 'art-prints',
    image: '/products/banaue-terraces.jpg',
  },
  // Lorna's art prints
  {
    title: 'Cordillera Mountain Landscape Print',
    slug: 'cordillera-landscape-print',
    description:
      'Fine art photograph of the Cordillera mountain range at sunrise. Printed on archival matte paper (A3, 11.7×16.5 inches) with pigment inks. The mist rising over the pine forests creates a serene, meditative composition.',
    price: php(5500),
    stock: 10,
    vendor: 'lorna@likha.ph',
    category: 'art-prints',
    image: '/products/cordillera-print.jpg',
  },
  {
    title: 'Katipunan Flag Replica Print',
    slug: 'katipunan-flag-replica-print',
    description:
      'Reproduction of the original Katipunan flag from 1892, scanned from the archives of the National Museum. Printed on textured cotton canvas using archival inks. 40×60cm, unframed. A powerful piece of Filipino heritage for your wall.',
    price: php(2500),
    stock: 8,
    vendor: 'lorna@likha.ph',
    category: 'art-prints',
    image: '/products/katipunan-flag.jpg',
  },
]

const REVIEWS = [
  {
    listing: 'inabel-blanket-twin',
    author: 'isabel@test.ph',
    rating: 5,
    text: 'Beautifully woven, even better in person. The indigo is deep and the cotton is soft. Worth every peso.',
  },
  {
    listing: 'burnay-jar',
    author: 'isabel@test.ph',
    rating: 5,
    text: 'I use mine for sinigang now. The jar has a soul to it. Came perfectly packed in wood shavings.',
  },
  {
    listing: 'sagada-arabica-250g',
    author: 'isabel@test.ph',
    rating: 5,
    text: 'Best Filipino coffee I have had. Rich, complex, not bitter. Will reorder.',
  },
  {
    listing: 'capiz-pendant-light',
    author: 'liza@test.ph',
    rating: 4,
    text: 'Gorgeous. The shells catch the light beautifully. Took 20 minutes to install, worth it.',
  },
  {
    listing: 'tboli-tnalak-cloth',
    author: 'isabel@test.ph',
    rating: 5,
    text: 'You can feel the work in this. Each inch is handwoven. I had a jacket made and it is my favorite piece.',
  },
  {
    listing: 'narra-bowl',
    author: 'liza@test.ph',
    rating: 5,
    text: 'Heavy, gorgeous grain. Already oily from the wood — will only get better with use.',
  },
  {
    listing: 'tocino',
    author: 'isabel@test.ph',
    rating: 5,
    text: 'Tastes like my Lola\'s. The sweetness is just right, not overly so. Fry till edges are crispy.',
  },
  {
    listing: 'shell-craft-earrings',
    author: 'isabel@test.ph',
    rating: 4,
    text: 'Lightweight, look expensive. Bought two pairs as gifts.',
  },
  {
    listing: 'cordillera-shoulder-bag',
    author: 'paolo@test.ph',
    rating: 5,
    text: 'My wife uses this daily. The weave is tight, the leather trim is quality. Got compliments everywhere.',
  },
  {
    listing: 'terracotta-planter-30',
    author: 'liza@test.ph',
    rating: 4,
    text: 'Beautiful warm terracotta color. Fits a large monstera perfectly. Only wish it had a drainage hole.',
  },
  {
    listing: 'ceramic-pour-over',
    author: 'isabel@test.ph',
    rating: 5,
    text: 'Makes my morning coffee ritual feel intentional. The pour is smooth, no drips. Stunning glaze.',
  },
  {
    listing: 'pineapple-fiber-scarf',
    author: 'isabel@test.ph',
    rating: 5,
    text: 'So soft and elegant. The pineapple fiber has a natural sheen. Bought one for myself and one as a gift.',
  },
  {
    listing: 'benguet-arabica-200g',
    author: 'paolo@test.ph',
    rating: 5,
    text: 'Bright, clean finish. My new favorite morning coffee.',
  },
  {
    listing: 'davao-wild-honey-250g',
    author: 'isabel@test.ph',
    rating: 5,
    text: 'Extraordinary honey. Complex floral notes, drizzle on kesong puti — perfection.',
  },
  {
    listing: 'hand-painted-mural-canvas',
    author: 'liza@test.ph',
    rating: 5,
    text: 'The painting captures Ilocos perfectly. I tear up every time I look at it — reminds me of my grandmother\'s province.',
  },
  {
    listing: 'capiz-coaster-set-4',
    author: 'isabel@test.ph',
    rating: 4,
    text: 'Beautiful on the dining table. The shells catch light differently throughout the day.',
  },
  {
    listing: 'cordillera-landscape-print',
    author: 'liza@test.ph',
    rating: 5,
    text: 'Stunning photograph. The morning mist over the mountains is breathtaking. High quality print.',
  },
  {
    listing: 'dried-mangoes-200g',
    author: 'paolo@test.ph',
    rating: 4,
    text: 'Tastes like summer. Sweet, chewy, no preservatives. My kids finished the pack in one sitting.',
  },
  {
    listing: 'abaca-market-tote',
    author: 'liza@test.ph',
    rating: 5,
    text: 'Perfect market bag. Sturdy, expands to fit a lot, folds flat. The leather handles are a nice touch.',
  },
  {
    listing: 'inabel-blanket-twin',
    author: 'liza@test.ph',
    rating: 5,
    text: 'Added a second one to my home. The quality is consistent and the indigo blue is beautiful.',
  },
  {
    listing: 'narra-bowl',
    author: 'isabel@test.ph',
    rating: 4,
    text: 'Bought this as a gift for my niece\'s wedding. The wood grain is spectacular.',
  },
  {
    listing: 'cebu-guitar-pick',
    author: 'paolo@test.ph',
    rating: 5,
    text: 'My guitarist friend loved these. The shell picks produce a brighter tone than plastic.',
  },
]

const ORDERS = [
  {
    orderNumber: 'LIKHA-001',
    buyer: 'isabel@test.ph',
    vendor: 'maria@likha.ph',
    items: [
      { slug: 'inabel-blanket-twin', name: 'Inabel Blanket (Twin)', price: php(3200), qty: 1 },
    ],
    email: 'isabel@test.ph',
    name: 'Isabel Reyes',
    address: '24 Maginhawa St., Quezon City, Metro Manila 1101',
    paymentState: 'PAID' as const,
    fulfillmentState: 'FULFILLED' as const,
    daysAgo: 14,
  },
  {
    orderNumber: 'LIKHA-002',
    buyer: 'isabel@test.ph',
    vendor: 'rico@likha.ph',
    items: [
      { slug: 'sagada-arabica-250g', name: 'Sagada Arabica 250g', price: php(480), qty: 1 },
      { slug: 'cacao-nibs', name: 'Cacao Nibs 100g', price: php(280), qty: 1 },
    ],
    email: 'isabel@test.ph',
    name: 'Isabel Reyes',
    address: '24 Maginhawa St., Quezon City, Metro Manila 1101',
    paymentState: 'PAID' as const,
    fulfillmentState: 'PROCESSING' as const,
    daysAgo: 3,
  },
  {
    orderNumber: 'LIKHA-003',
    buyer: 'liza@test.ph',
    vendor: 'andres@likha.ph',
    items: [
      { slug: 'tocino', name: 'Tocino Slices (500g)', price: php(480), qty: 1 },
      { slug: 'longganisa-10pc', name: 'Longganisa Sausage (10pc)', price: php(420), qty: 1 },
    ],
    email: 'liza@test.ph',
    name: 'Liza Mendoza',
    address: '88 Gorordo Ave., Cebu City, Cebu 6000',
    paymentState: 'PAID' as const,
    fulfillmentState: 'UNFULFILLED' as const,
    daysAgo: 1,
  },
  {
    orderNumber: 'LIKHA-004',
    buyer: 'paolo@test.ph',
    vendor: 'juan@likha.ph',
    items: [
      { slug: 'burnay-jar', name: 'Burnay Clay Jar (25cm)', price: php(1800), qty: 2 },
    ],
    email: 'paolo@test.ph',
    name: 'Paolo Cruz',
    address: '12 Ayala Ave., Makati City, Metro Manila 1226',
    paymentState: 'PENDING_PAYMENT' as const,
    fulfillmentState: 'UNFULFILLED' as const,
    hoursAgo: 2,
  },
  {
    orderNumber: 'LIKHA-005',
    buyer: 'isabel@test.ph',
    vendor: 'teresa@likha.ph',
    items: [
      { slug: 'capiz-pendant-light', name: 'Capiz Shell Pendant Light', price: php(2800), qty: 1 },
    ],
    email: 'isabel@test.ph',
    name: 'Isabel Reyes',
    address: '24 Maginhawa St., Quezon City, Metro Manila 1101',
    paymentState: 'PAID' as const,
    fulfillmentState: 'PROCESSING' as const,
    daysAgo: 5,
  },
  {
    orderNumber: 'LIKHA-006',
    buyer: 'paolo@test.ph',
    vendor: 'lorna@likha.ph',
    items: [
      { slug: 'narra-bowl', name: 'Narra Salad Bowl', price: php(1200), qty: 1 },
    ],
    email: 'paolo@test.ph',
    name: 'Paolo Cruz',
    address: '12 Ayala Ave., Makati City, Metro Manila 1226',
    paymentState: 'PAID' as const,
    fulfillmentState: 'UNFULFILLED' as const,
    daysAgo: 0,
  },
  {
    orderNumber: 'LIKHA-007',
    buyer: 'isabel@test.ph',
    vendor: 'juan@likha.ph',
    items: [
      { slug: 'itneg-wine-goblet', name: 'Itneg Wine Goblet (set of 2)', price: php(1500), qty: 2 },
    ],
    email: 'isabel@test.ph',
    name: 'Isabel Reyes',
    address: '24 Maginhawa St., Quezon City, Metro Manila 1101',
    paymentState: 'PAID' as const,
    fulfillmentState: 'FULFILLED' as const,
    daysAgo: 10,
  },
  {
    orderNumber: 'LIKHA-008',
    buyer: 'paolo@test.ph',
    vendor: 'teresa@likha.ph',
    items: [
      { slug: 'limited-shell-necklace', name: 'Limited Edition Shell Necklace', price: php(2800), qty: 1 },
    ],
    email: 'paolo@test.ph',
    name: 'Paolo Cruz',
    address: '12 Ayala Ave., Makati City, Metro Manila 1226',
    paymentState: 'PAID' as const,
    fulfillmentState: 'RETURNED' as const,
    daysAgo: 4,
  },
  {
    orderNumber: 'LIKHA-009',
    buyer: 'liza@test.ph',
    vendor: 'andres@likha.ph',
    items: [
      { slug: 'dried-mangoes-200g', name: 'Dried Mangoes 200g', price: php(250), qty: 3 },
      { slug: 'coconut-sugar-500g', name: 'Coconut Sugar 500g', price: php(320), qty: 1 },
    ],
    email: 'liza@test.ph',
    name: 'Liza Mendoza',
    address: '88 Gorordo Ave., Cebu City, Cebu 6000',
    paymentState: 'PAID' as const,
    fulfillmentState: 'FULFILLED' as const,
    daysAgo: 6,
  },
  {
    orderNumber: 'LIKHA-010',
    buyer: 'isabel@test.ph',
    vendor: 'lorna@likha.ph',
    items: [
      { slug: 'cordillera-landscape-print', name: 'Cordillera Mountain Landscape Print', price: php(5500), qty: 1 },
    ],
    email: 'isabel@test.ph',
    name: 'Isabel Reyes',
    address: '24 Maginhawa St., Quezon City, Metro Manila 1101',
    paymentState: 'PAID' as const,
    fulfillmentState: 'PROCESSING' as const,
    daysAgo: 2,
  },
  {
    orderNumber: 'LIKHA-011',
    buyer: 'paolo@test.ph',
    vendor: 'rico@likha.ph',
    items: [
      { slug: 'benguet-arabica-200g', name: 'Benguet Arabica Coffee 200g', price: php(420), qty: 1 },
      { slug: 'davao-wild-honey-250g', name: 'Davao Wild Honey 250g', price: php(550), qty: 1 },
    ],
    email: 'paolo@test.ph',
    name: 'Paolo Cruz',
    address: '12 Ayala Ave., Makati City, Metro Manila 1226',
    paymentState: 'PENDING_PAYMENT' as const,
    fulfillmentState: 'UNFULFILLED' as const,
    hoursAgo: 1,
  },
  {
    orderNumber: 'LIKHA-012',
    buyer: 'liza@test.ph',
    vendor: 'maria@likha.ph',
    items: [
      { slug: 'pineapple-fiber-scarf', name: 'Pineapple Fiber Scarf', price: php(1800), qty: 1 },
      { slug: 'abaca-market-tote', name: 'Abaca Market Tote', price: php(750), qty: 1 },
    ],
    email: 'liza@test.ph',
    name: 'Liza Mendoza',
    address: '88 Gorordo Ave., Cebu City, Cebu 6000',
    paymentState: 'PAID' as const,
    fulfillmentState: 'PROCESSING' as const,
    daysAgo: 1,
  },
]

const BOOKINGS = [
  {
    buyer: 'liza@test.ph',
    listing: 'pottery-wheel-workshop',
    daysAhead: 6,
    status: 'CONFIRMED' as const,
  },
  {
    buyer: 'isabel@test.ph',
    listing: 'custom-weave-consultation',
    daysAhead: 1,
    status: 'PENDING' as const,
  },
  {
    buyer: 'paolo@test.ph',
    listing: 'private-coffee-cupping',
    daysAhead: 3,
    status: 'PENDING' as const,
  },
]

const NOTIFICATIONS = [
  {
    user: 'isabel@test.ph',
    type: 'order_update',
    title: 'Your order LIKHA-002 has shipped!',
    message: 'Rico Morales marked your order as shipped. Tracking info will arrive by email.',
    isRead: true,
    link: '/orders',
    daysAgo: 2,
  },
  {
    user: 'isabel@test.ph',
    type: 'review_reply',
    title: 'Maria responded to your review',
    message: 'Maria Santos replied to your review of the Inabel Blanket.',
    isRead: true,
    daysAgo: 7,
  },
  {
    user: 'maria@likha.ph',
    type: 'order_update',
    title: 'New order received',
    message: 'Isabel Reyes placed order LIKHA-001 for ₱3,200.00',
    isRead: true,
    daysAgo: 14,
  },
  {
    user: 'maria@likha.ph',
    type: 'message',
    title: 'New booking inquiry',
    message: 'Paolo Cruz is interested in Custom Weave Consultation',
    isRead: false,
    daysAgo: 1,
  },
  {
    user: 'isabel@test.ph',
    type: 'order_update',
    title: 'Your order LIKHA-007 has been delivered!',
    message: 'Juan dela Cruz marked your order as delivered. We hope you love your Itneg Wine Goblets!',
    isRead: false,
    link: '/orders',
    daysAgo: 10,
  },
  {
    user: 'liza@test.ph',
    type: 'order_update',
    title: 'Your order LIKHA-009 has been delivered!',
    message: 'Chef Andres marked your order as delivered. Enjoy your dried mangoes and coconut sugar!',
    isRead: true,
    link: '/orders',
    daysAgo: 6,
  },
  {
    user: 'paolo@test.ph',
    type: 'message',
    title: 'Teresa replied to your inquiry',
    message: 'Teresa Lim responded to your message about the Limited Edition Shell Necklace.',
    isRead: false,
    daysAgo: 2,
  },
  {
    user: 'liza@test.ph',
    type: 'review_reply',
    title: 'Maria responded to your review',
    message: 'Maria Santos replied to your review of the Abaca Market Tote.',
    isRead: false,
    daysAgo: 1,
  },
]

const WISHLIST = [
  { user: 'isabel@test.ph', listings: ['capiz-pendant-light', 'sagada-arabica-250g', 'vigan-chair', 'pineapple-fiber-scarf', 'itneg-wine-goblet', 'cordillera-landscape-print', 'davao-wild-honey-250g', 'abaca-market-tote', 'hand-painted-mural-canvas', 'garden-ceramic-turtle'] },
  { user: 'paolo@test.ph', listings: ['benguet-arabica-200g', 'cacao-tea-bags-12pack', 'capiz-candle-holder-set-3', 'small-bamboo-basket', 'wood-carved-platter'] },
  { user: 'liza@test.ph', listings: ['inabel-blanket-twin', 'bamboo-tray-set', 'pineapple-fiber-scarf', 'ceramic-vase-tall', 'hand-painted-mural-canvas', 'coconut-sugar-500g', 'shell-wind-chime', 'mangosteen-vinegar-250ml'] },
]

const COUPONS = [
  {
    code: 'LIKHA10',
    kind: 'PERCENTAGE',
    value: 10,
    label: '10% off your order',
    maxUses: 100,
    useCount: 0,
    active: true,
  },
  {
    code: 'WELCOME',
    kind: 'FIXED',
    value: 20000,
    label: '₱200 off your first order',
    maxUses: 50,
    useCount: 0,
    active: true,
  },
  {
    code: 'FREESHIP',
    kind: 'FIXED',
    value: 10000,
    label: 'Free shipping on your next order',
    maxUses: 30,
    useCount: 0,
    active: true,
  },
  {
    code: 'SUMMER15',
    kind: 'PERCENTAGE',
    value: 15,
    label: '15% off summer collection',
    maxUses: 20,
    useCount: 0,
    active: true,
  },
]

const CONVERSATIONS = [
  {
    participants: ['isabel@test.ph', 'maria@likha.ph'],
    listingSlug: 'inabel-blanket-twin',
    messages: [
      { sender: 'isabel@test.ph', content: 'Hi Maria! Is the Inabel blanket available in a custom size?' },
      { sender: 'maria@likha.ph', content: 'Hi Isabel! Yes, we can do custom. Lead time is 3 weeks. Want me to send a quote?' },
      { sender: 'isabel@test.ph', content: 'Yes please!' },
    ],
  },
  {
    participants: ['liza@test.ph', 'juan@likha.ph'],
    listingSlug: 'pottery-wheel-workshop',
    messages: [
      { sender: 'liza@test.ph', content: 'Hi! Can I bring a friend to the workshop?' },
      { sender: 'juan@likha.ph', content: 'Of course! Additional person is ₱1,000. I will update the booking.' },
    ],
  },
  {
    participants: ['liza@test.ph', 'teresa@likha.ph'],
    listingSlug: 'capiz-coaster-set-4',
    messages: [
      { sender: 'liza@test.ph', content: 'Hi Teresa! Do you do custom colors for the capiz coasters?' },
      { sender: 'teresa@likha.ph', content: 'Hello Liza! Yes, I can source different shell tones. What color scheme are you looking for?' },
    ],
  },
  {
    participants: ['paolo@test.ph', 'rico@likha.ph'],
    listingSlug: 'benguet-arabica-200g',
    messages: [
      { sender: 'paolo@test.ph', content: 'Rico, when was the Benguet batch roasted?' },
      { sender: 'rico@likha.ph', content: 'Just last week! Fresh batch, roasted on June 2. It is drinking beautifully now.' },
    ],
  },
  {
    participants: ['isabel@test.ph', 'lorna@likha.ph'],
    listingSlug: 'cordillera-landscape-print',
    messages: [
      { sender: 'isabel@test.ph', content: 'Lorna, is this print available in a larger size?' },
      { sender: 'lorna@likha.ph', content: 'Yes! We can do A2 (16.5×23.4 inches) as a special order. Just add a note to your order.' },
    ],
  },
  {
    participants: ['liza@test.ph', 'maria@likha.ph'],
    listingSlug: 'abaca-market-tote',
    messages: [
      { sender: 'liza@test.ph', content: 'Maria, do you have the abaca tote in natural (undyed) color?' },
      { sender: 'maria@likha.ph', content: 'We do! The natural ecru version is available. I will update the listing with more color options.' },
    ],
  },
]

// =====================================================
// HELPERS
// =====================================================

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000)
}
function daysAhead(days: number): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000)
}
function hoursAgo(hours: number): Date {
  return new Date(Date.now() - hours * 60 * 60 * 1000)
}

// =====================================================
// MAIN
// =====================================================

async function main() {
  console.log('🌱 Seeding Likha Marketplace...')

  const password = await bcrypt.hash(PASSWORD, 10)

  // Wipe everything in dependency order
  console.log('  ↺ Clearing existing data...')
  await prisma.bundleItem.deleteMany()
  await prisma.bundle.deleteMany()
  await prisma.message.deleteMany()
  await prisma.conversation.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.coupon.deleteMany()
  await prisma.wishlistItem.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.review.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.listingImage.deleteMany()
  await prisma.listing.deleteMany()
  await prisma.category.deleteMany()
  await prisma.vendorMetrics.deleteMany()
  await prisma.user.deleteMany()

  // Users
  console.log('  👥 Seeding users...')
  const userMap = new Map<string, { id: string; role: string }>()
  for (const u of USERS) {
    const created = await prisma.user.create({
      data: {
        name: u.name,
        email: u.email,
        password,
        role: u.role,
        avatarUrl: u.avatar,
        bio: u.bio,
        location: u.location,
        socialLinks: {
          facebook: `https://facebook.com/${u.email.split('@')[0]}`,
          instagram: `https://instagram.com/${u.email.split('@')[0]}`,
        },
      },
    })
    userMap.set(u.email, { id: created.id, role: created.role })
  }
  console.log(`     Created ${userMap.size} users`)

  // Categories
  console.log('  📂 Seeding categories...')
  const catMap = new Map<string, string>()
  for (const c of CATEGORIES) {
    const created = await prisma.category.create({
      data: { name: c.name, slug: c.slug, icon: c.icon, coverUrl: c.cover },
    })
    catMap.set(c.slug, created.id)
  }
  console.log(`     Created ${catMap.size} categories`)

  // Listings
  console.log('  📦 Seeding listings...')
  const listingMap = new Map<string, string>()
  for (const l of LISTINGS) {
    const vendor = userMap.get(l.vendor)
    const categoryId = catMap.get(l.category)
    if (!vendor || !categoryId) {
      console.warn(`     Skipping ${l.slug}: missing vendor or category`)
      continue
    }
    const created = await prisma.listing.create({
      data: {
        title: l.title,
        slug: l.slug,
        description: l.description,
        price: l.price,
        stock: l.stock,
        status: 'APPROVED',
        isService: (l as any).isService ?? false,
        bookingDuration: (l as any).bookingDuration ?? null,
        vendorId: vendor.id,
        categoryId,
        images: {
          create: [
            { url: l.image, alt: l.title, sortOrder: 0 },
          ],
        },
      },
    })
    listingMap.set(l.slug, created.id)
  }
  console.log(`     Created ${listingMap.size} listings`)

  // Variants for selected listings
  const inabelId = listingMap.get('inabel-blanket-twin')
  if (inabelId) {
    await prisma.listingVariant.createMany({
      data: [
        { listingId: inabelId, label: 'Twin', priceAdj: 0, stock: 5 },
        { listingId: inabelId, label: 'Queen', priceAdj: php(800), stock: 3 },
        { listingId: inabelId, label: 'King', priceAdj: php(1500), stock: 2 },
      ],
    })
  }
  const cordilleraBagId = listingMap.get('cordillera-shoulder-bag')
  if (cordilleraBagId) {
    await prisma.listingVariant.createMany({
      data: [
        { listingId: cordilleraBagId, label: 'Brown', priceAdj: 0, stock: 10 },
        { listingId: cordilleraBagId, label: 'Black', priceAdj: 0, stock: 7 },
        { listingId: cordilleraBagId, label: 'Tan', priceAdj: 0, stock: 4 },
      ],
    })
  }

  // Reviews
  console.log('  ⭐ Seeding reviews...')
  for (const r of REVIEWS) {
    const listingId = listingMap.get(r.listing)
    const authorId = userMap.get(r.author)?.id
    if (!listingId || !authorId) continue
    await prisma.review.create({
      data: {
        rating: r.rating,
        text: r.text,
        listingId,
        authorId,
      },
    })
  }
  console.log(`     Created ${REVIEWS.length} reviews`)

  // Orders
  console.log('  🛒 Seeding orders...')
  for (const o of ORDERS) {
    const buyer = userMap.get(o.buyer)
    const vendor = userMap.get(o.vendor)
    if (!buyer || !vendor) continue
    const total = o.items.reduce((s, i) => s + i.price * i.qty, 0)
    const createdAt = o.hoursAgo ? hoursAgo(o.hoursAgo) : daysAgo(o.daysAgo ?? 0)
    await prisma.order.create({
      data: {
        orderNumber: o.orderNumber,
        total,
        currency: 'php',
        paymentState: o.paymentState,
        fulfillmentState: o.fulfillmentState,
        buyerId: buyer.id,
        vendorId: vendor.id,
        email: o.email,
        name: o.name,
        address: o.address,
        createdAt,
        items: {
          create: o.items.map((i) => {
            const listingId = listingMap.get(i.slug)
            return {
              listingId: listingId ?? '',
              productName: i.name,
              priceAtPurchase: i.price,
              quantity: i.qty,
            }
          }),
        },
      },
    })
  }
  console.log(`     Created ${ORDERS.length} orders`)

  // Bookings
  console.log('  📅 Seeding bookings...')
  for (const b of BOOKINGS) {
    const buyer = userMap.get(b.buyer)
    const listingId = listingMap.get(b.listing)
    if (!buyer || !listingId) continue
    await prisma.booking.create({
      data: {
        date: daysAhead(b.daysAhead),
        status: b.status,
        listingId,
        buyerId: buyer.id,
        message: b.status === 'CONFIRMED' ? 'See you Saturday! I will bring an apron.' : 'Looking forward to the session.',
      },
    })
  }
  console.log(`     Created ${BOOKINGS.length} bookings`)

  // Notifications
  console.log('  🔔 Seeding notifications...')
  for (const n of NOTIFICATIONS) {
    const user = userMap.get(n.user)
    if (!user) continue
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: n.type,
        title: n.title,
        message: n.message,
        isRead: n.isRead,
        link: n.link,
        createdAt: daysAgo(n.daysAgo),
      },
    })
  }
  console.log(`     Created ${NOTIFICATIONS.length} notifications`)

  // Coupons
  console.log('  🏷️  Seeding coupons...')
  for (const c of COUPONS) {
    await prisma.coupon.create({ data: c })
  }
  console.log(`     Created ${COUPONS.length} coupons`)

  // Wishlist
  console.log('  ❤️  Seeding wishlist...')
  let wishlistCount = 0
  for (const w of WISHLIST) {
    const user = userMap.get(w.user)
    if (!user) continue
    for (const slug of w.listings) {
      const listingId = listingMap.get(slug)
      if (!listingId) continue
      try {
        await prisma.wishlistItem.create({
          data: { userId: user.id, listingId },
        })
        wishlistCount++
      } catch {
        // unique constraint — skip
      }
    }
  }
  console.log(`     Created ${wishlistCount} wishlist items`)

  // Conversations
  console.log('  💬 Seeding conversations...')
  for (const c of CONVERSATIONS) {
    const a = userMap.get(c.participants[0])
    const b = userMap.get(c.participants[1])
    if (!a || !b) continue
    const listingId = c.listingSlug ? listingMap.get(c.listingSlug) ?? null : null
    const conv = await prisma.conversation.create({
      data: {
        participantAId: a.id,
        participantBId: b.id,
        listingId,
      },
    })
    for (let i = 0; i < c.messages.length; i++) {
      const m = c.messages[i]
      const sender = userMap.get(m.sender)
      if (!sender) continue
      await prisma.message.create({
        data: {
          conversationId: conv.id,
          senderId: sender.id,
          content: m.content,
          isRead: i < c.messages.length - 1,
          createdAt: new Date(Date.now() - (c.messages.length - i) * 60 * 60 * 1000),
        },
      })
    }
  }
  console.log(`     Created ${CONVERSATIONS.length} conversations`)

  // Vendor Metrics — roll up from data
  console.log('  📊 Computing vendor metrics...')
  for (const [, info] of userMap) {
    if (info.role !== 'VENDOR') continue
    const listingCount = await prisma.listing.count({ where: { vendorId: info.id } })
    const orderCount = await prisma.order.count({ where: { vendorId: info.id } })
    const totalRevenue = await prisma.order
      .aggregate({
        where: { vendorId: info.id, paymentState: 'PAID' },
        _sum: { total: true },
      })
      .then((r) => r._sum.total ?? 0)
    const reviewAgg = await prisma.review
      .aggregate({
        where: { listing: { vendorId: info.id } },
        _avg: { rating: true },
        _count: true,
      })
      .then((r) => ({ avg: r._avg.rating ?? 0, count: r._count }))
    await prisma.vendorMetrics.create({
      data: {
        vendorId: info.id,
        listingCount,
        orderCount,
        totalRevenue,
        averageRating: reviewAgg.avg,
      },
    })
  }
  console.log('     Vendor metrics computed')

  // Bundles
  console.log('  🎁 Seeding bundles...')
  const bundleData = [
    {
      title: 'Textile Lover\'s Bundle',
      description: 'Save 15% when you buy the Inabel Blanket, Kalinga Wrap Skirt, and T\'boli T\'nalak Cloth together. Perfect for bringing Filipino weaving traditions into your home.',
      discountPct: 15,
      items: ['inabel-blanket-twin', 'kalinga-wrap-skirt', 'tboli-tnalak-cloth'],
    },
    {
      title: 'Coffee Connoisseur Bundle',
      description: 'Taste three of the Philippines\' finest single-origin coffees — Sagada Arabica, Batangas Barako, and Benguet Arabica — at 12% off the individual prices.',
      discountPct: 12,
      items: ['sagada-arabica-250g', 'barako-coffee-200g', 'benguet-arabica-200g'],
    },
    {
      title: 'Home Decor Bundle',
      description: 'Save 10% on our most popular home decor items — Capiz Pendant Light, Bamboo Tray Set, and Mini Pot Trio. Light up your home with Filipino craftsmanship.',
      discountPct: 10,
      items: ['capiz-pendant-light', 'bamboo-tray-set', 'mini-pot-trio'],
    },
    {
      title: 'Kitchen Pantry Bundle',
      description: 'Stock your kitchen with the best of Filipino artisan food — Tocino, Longganisa, Coconut Sugar, and Suka ng Tuba. Save 10% when you buy the set.',
      discountPct: 10,
      items: ['tocino', 'longganisa-10pc', 'coconut-sugar-500g', 'suka-ng-tuba'],
    },
  ]
  for (const b of bundleData) {
    const listingIds = b.items.map((slug) => listingMap.get(slug)).filter(Boolean) as string[]
    if (listingIds.length < 2) continue
    const bundle = await prisma.bundle.create({
      data: {
        title: b.title,
        description: b.description,
        discountPct: b.discountPct,
        items: { create: listingIds.map((listingId) => ({ listingId })) },
      },
    })
  }
  console.log('  🎁 Bundles seeded')

  console.log('\n✅ Seed complete!')
  console.log('\n   Test accounts (password: likha2026):')
  console.log('   ─────────────────────────────────────────')
  console.log('   Vendors:    maria@likha.ph, juan@likha.ph, lorna@likha.ph')
  console.log('              rico@likha.ph, teresa@likha.ph, andres@likha.ph')
  console.log('   Admin:      admin@likha.ph')
  console.log('   Buyers:     isabel@test.ph, paolo@test.ph, liza@test.ph')
  console.log('')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
