import { createClient } from '@libsql/client';

const url = process.env.DATABASE_URL;
const authToken = process.env.DATABASE_AUTH_TOKEN;

if (!url) { console.error('DATABASE_URL not set'); process.exit(1); }

const client = createClient({ url, authToken });

async function run() {
  console.log('Dropping existing tables...');
  await client.execute('PRAGMA foreign_keys=OFF');
  
  const tables = ['OrderItem','Order','ReturnRequest','Notification','ProductQA','UserLike','StockAlert','Referral','FlashSale','Bundle','Product','Category','User','Address','AppSetting'];
  for (const t of tables) {
    await client.execute(`DROP TABLE IF EXISTS "${t}"`);
  }
  
  await client.execute(`DROP TABLE IF EXISTS "Review"`);
  
  await client.execute('PRAGMA foreign_keys=ON');

  console.log('Creating User...');
  await client.execute(`CREATE TABLE IF NOT EXISTS "User" ("id" TEXT NOT NULL PRIMARY KEY, "email" TEXT NOT NULL UNIQUE, "password" TEXT NOT NULL, "name" TEXT NOT NULL, "role" TEXT NOT NULL DEFAULT 'customer', "mobile" TEXT, "avatar" TEXT, "isActive" INTEGER NOT NULL DEFAULT 1, "deletedAt" DATETIME, "sukiPoints" INTEGER NOT NULL DEFAULT 0, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`);

  console.log('Creating Address...');
  await client.execute(`CREATE TABLE IF NOT EXISTS "Address" ("id" TEXT NOT NULL PRIMARY KEY, "userId" TEXT NOT NULL, "label" TEXT NOT NULL, "region" TEXT NOT NULL, "province" TEXT NOT NULL, "city" TEXT NOT NULL, "barangay" TEXT NOT NULL, "street" TEXT NOT NULL, "isDefault" INTEGER NOT NULL DEFAULT 0, FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE)`);

  console.log('Creating Category...');
  await client.execute(`CREATE TABLE IF NOT EXISTS "Category" ("id" TEXT NOT NULL PRIMARY KEY, "nameEn" TEXT NOT NULL, "nameTl" TEXT NOT NULL, "slug" TEXT NOT NULL UNIQUE)`);

  console.log('Creating Product...');
  await client.execute(`CREATE TABLE IF NOT EXISTS "Product" ("id" TEXT NOT NULL PRIMARY KEY, "nameEn" TEXT NOT NULL, "nameTl" TEXT NOT NULL, "slug" TEXT NOT NULL UNIQUE, "descriptionEn" TEXT NOT NULL, "descriptionTl" TEXT NOT NULL, "price" INTEGER NOT NULL, "image" TEXT NOT NULL, "categoryId" TEXT NOT NULL, "inventory" INTEGER NOT NULL DEFAULT 0, "vendorName" TEXT NOT NULL DEFAULT 'Aling Nena''s Sari-Sari', "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY ("categoryId") REFERENCES "Category"("id"))`);

  console.log('Creating FlashSale...');
  await client.execute(`CREATE TABLE IF NOT EXISTS "FlashSale" ("id" TEXT NOT NULL PRIMARY KEY, "productId" TEXT NOT NULL, "discountPercent" INTEGER NOT NULL, "startTime" DATETIME NOT NULL, "endTime" DATETIME NOT NULL, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE)`);

  console.log('Creating Bundle...');
  await client.execute(`CREATE TABLE IF NOT EXISTS "Bundle" ("id" TEXT NOT NULL PRIMARY KEY, "name" TEXT NOT NULL, "productIds" TEXT NOT NULL, "discountTotal" INTEGER NOT NULL, "active" INTEGER NOT NULL DEFAULT 1)`);

  console.log('Creating Order...');
  await client.execute(`CREATE TABLE IF NOT EXISTS "Order" ("id" TEXT NOT NULL PRIMARY KEY, "orderNumber" TEXT NOT NULL UNIQUE, "status" TEXT NOT NULL DEFAULT 'draft', "paymentState" TEXT NOT NULL DEFAULT 'pending_payment', "fulfillmentState" TEXT NOT NULL DEFAULT 'unfulfilled', "total" INTEGER NOT NULL, "email" TEXT, "name" TEXT, "mobile" TEXT, "region" TEXT NOT NULL, "province" TEXT NOT NULL, "city" TEXT NOT NULL, "barangay" TEXT NOT NULL, "paymentMethod" TEXT NOT NULL DEFAULT 'cod', "paymentRef" TEXT, "pointsUsed" INTEGER NOT NULL DEFAULT 0, "notes" TEXT, "riderName" TEXT, "eta" TEXT, "deliveryOption" TEXT, "scheduledDate" TEXT, "userId" TEXT, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY ("userId") REFERENCES "User"("id"))`);

  console.log('Creating OrderItem...');
  await client.execute(`CREATE TABLE IF NOT EXISTS "OrderItem" ("id" TEXT NOT NULL PRIMARY KEY, "orderId" TEXT NOT NULL, "productId" TEXT NOT NULL, "productName" TEXT NOT NULL, "productImage" TEXT NOT NULL, "quantity" INTEGER NOT NULL, "priceAtPurchase" INTEGER NOT NULL, FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE)`);

  console.log('Creating ReturnRequest...');
  await client.execute(`CREATE TABLE IF NOT EXISTS "ReturnRequest" ("id" TEXT NOT NULL PRIMARY KEY, "orderId" TEXT NOT NULL, "reason" TEXT NOT NULL, "status" TEXT NOT NULL DEFAULT 'pending', "adminNotes" TEXT, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE)`);

  console.log('Creating Notification...');
  await client.execute(`CREATE TABLE IF NOT EXISTS "Notification" ("id" TEXT NOT NULL PRIMARY KEY, "userId" TEXT NOT NULL, "orderId" TEXT, "type" TEXT NOT NULL, "message" TEXT NOT NULL, "isRead" INTEGER NOT NULL DEFAULT 0, "link" TEXT, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE)`);

  console.log('Creating ProductQA...');
  await client.execute(`CREATE TABLE IF NOT EXISTS "ProductQA" ("id" TEXT NOT NULL PRIMARY KEY, "productId" TEXT NOT NULL, "askerName" TEXT NOT NULL, "question" TEXT NOT NULL, "answer" TEXT, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE)`);

  console.log('Creating UserLike...');
  await client.execute(`CREATE TABLE IF NOT EXISTS "UserLike" ("id" TEXT NOT NULL PRIMARY KEY, "userId" TEXT NOT NULL, "productId" TEXT NOT NULL, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE, FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE, UNIQUE("userId","productId"))`);

  console.log('Creating Referral...');
  await client.execute(`CREATE TABLE IF NOT EXISTS "Referral" ("id" TEXT NOT NULL PRIMARY KEY, "code" TEXT NOT NULL UNIQUE, "referrerId" TEXT NOT NULL, "usedById" TEXT, "rewardGiven" INTEGER NOT NULL DEFAULT 0, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY ("referrerId") REFERENCES "User"("id"), FOREIGN KEY ("usedById") REFERENCES "User"("id"))`);

  console.log('Creating StockAlert...');
  await client.execute(`CREATE TABLE IF NOT EXISTS "StockAlert" ("id" TEXT NOT NULL PRIMARY KEY, "email" TEXT NOT NULL, "productId" TEXT NOT NULL, "notified" INTEGER NOT NULL DEFAULT 0, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE)`);

  console.log('Creating AppSetting...');
  await client.execute(`CREATE TABLE IF NOT EXISTS "AppSetting" ("key" TEXT NOT NULL PRIMARY KEY, "value" TEXT NOT NULL)`);

  console.log('Creating Review...');
  await client.execute(`CREATE TABLE IF NOT EXISTS "Review" ("id" TEXT NOT NULL PRIMARY KEY, "productId" TEXT NOT NULL, "userId" TEXT, "author" TEXT NOT NULL, "rating" INTEGER NOT NULL, "comment" TEXT NOT NULL, "imageUrl" TEXT, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE, FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL)`);

  // Create indexes
  await client.execute('CREATE INDEX IF NOT EXISTS "OrderItem_orderId_idx" ON "OrderItem"("orderId")');
  await client.execute('CREATE INDEX IF NOT EXISTS "Address_userId_idx" ON "Address"("userId")');
  await client.execute('CREATE INDEX IF NOT EXISTS "Notification_userId_idx" ON "Notification"("userId")');

  await client.execute('CREATE INDEX IF NOT EXISTS "Review_productId_idx" ON "Review"("productId")');

  console.log('All tables created! Ready for seeding.');
}

run().catch(e => console.error('Error:', e)).finally(() => client.close());
