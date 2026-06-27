import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { createReadStream, existsSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..');
const bucketName = 'product-images';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required in server/.env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const products = [
  { slug: 'coconut-shell-bowl', name: 'Coconut Shell Bowl', folder: 'eco', file: 'project/src/assets/products/EcoProducts/coconutbowl.jpeg' },
  { slug: 'coconut-shell-lamp', name: 'Coconut Shell Lamp', folder: 'eco', file: 'project/src/assets/products/EcoProducts/coconutlamp.jpeg' },
  { slug: 'neem-wood-comb', name: 'Neem Wood Comb', folder: 'eco', file: 'project/src/assets/products/EcoProducts/comb.jpeg' },
  { slug: 'cotton-shopping-bag', name: 'Cotton Shopping Bag', folder: 'eco', file: 'project/src/assets/products/EcoProducts/cottonbag.jpeg' },
  { slug: 'organic-cotton-towels', name: 'Organic Cotton Towels', folder: 'eco', file: 'project/src/assets/products/EcoProducts/cottontowels.jpeg' },
  { slug: 'jute-tote-bag', name: 'Jute Tote Bag', folder: 'eco', file: 'project/src/assets/products/EcoProducts/jutebag.jpeg' },
  { slug: 'natural-jute-mat', name: 'Natural Jute Mat', folder: 'eco', file: 'project/src/assets/products/EcoProducts/jutemat.jpeg' },
  { slug: 'bamboo-toothbrush', name: 'Bamboo Toothbrush', folder: 'eco', file: 'project/src/assets/products/EcoProducts/toothbrush.jpeg' },
  { slug: 'eco-friendly-totes', name: 'Eco-Friendly Totes', folder: 'eco', file: 'project/src/assets/products/EcoProducts/totes.jpeg' },
  { slug: 'handcrafted-wooden-bowl', name: 'Handcrafted Wooden Bowl', folder: 'eco', file: 'project/src/assets/products/EcoProducts/woodbowl.jpeg' },
  { slug: 'wooden-cooking-spoon', name: 'Wooden Cooking Spoon', folder: 'eco', file: 'project/src/assets/products/EcoProducts/woodenspoon.jpeg' },

  { slug: 'aromatherapy-candle', name: 'Aromatherapy Candle', folder: 'wellness', file: 'project/src/assets/products/wellnessproducts/AromatherapyCandle.jpeg' },
  { slug: 'essential-oil', name: 'Essential Oil', folder: 'wellness', file: 'project/src/assets/products/wellnessproducts/Essitentialoil.jpeg' },
  { slug: 'herbal-tea-pack', name: 'Herbal Tea Pack', folder: 'wellness', file: 'project/src/assets/products/wellnessproducts/HerbalTeaPack.jpeg' },
  { slug: 'herbal-supplements', name: 'Herbal Supplements', folder: 'wellness', file: 'project/src/assets/products/wellnessproducts/Herbalsupplements.jpeg' },
  { slug: 'massage-roller', name: 'Massage Roller', folder: 'wellness', file: 'project/src/assets/products/wellnessproducts/MassageRoller.jpeg' },
  { slug: 'meditation-cushion', name: 'Meditation Cushion', folder: 'wellness', file: 'project/src/assets/products/wellnessproducts/MeditationCushion.jpeg' },
  { slug: 'organic-face-serum', name: 'Organic Face Serum', folder: 'wellness', file: 'project/src/assets/products/wellnessproducts/OrganicFaceSerum.jpeg' },
  { slug: 'vegan-soap', name: 'Vegan Soap', folder: 'wellness', file: 'project/src/assets/products/wellnessproducts/VeganSoap.jpeg' },
  { slug: 'skincare-cream', name: 'Skincare Cream', folder: 'wellness', file: 'project/src/assets/products/wellnessproducts/skincarecream.jpeg' },
  { slug: 'yoga-mat', name: 'Yoga Mat', folder: 'wellness', file: 'project/src/assets/products/wellnessproducts/yogamat.jpeg' },

  { slug: 'organic-almonds', name: 'Organic Almonds', folder: 'food', file: 'project/src/assets/products/foodproducts/almonds.jpeg' },
  { slug: 'fresh-bananas', name: 'Fresh Bananas', folder: 'food', file: 'project/src/assets/products/foodproducts/banana.jpeg' },
  { slug: 'farm-carrots', name: 'Farm Carrots', folder: 'food', file: 'project/src/assets/products/foodproducts/carrot.jpeg' },
  { slug: 'cold-pressed-coconut-oil', name: 'Cold Pressed Coconut Oil', folder: 'food', file: 'project/src/assets/products/foodproducts/coconutoil.jpeg' },
  { slug: 'premium-dates', name: 'Premium Dates', folder: 'food', file: 'project/src/assets/products/foodproducts/dates.jpeg' },
  { slug: 'raw-forest-honey', name: 'Raw Forest Honey', folder: 'food', file: 'project/src/assets/products/foodproducts/honey.jpeg' },
  { slug: 'organic-mangoes', name: 'Organic Mangoes', folder: 'food', file: 'project/src/assets/products/foodproducts/mango.jpeg' },
  { slug: 'black-pepper', name: 'Black Pepper', folder: 'food', file: 'project/src/assets/products/foodproducts/pepper.jpeg' },
  { slug: 'fresh-tomatoes', name: 'Fresh Tomatoes', folder: 'food', file: 'project/src/assets/products/foodproducts/tomata.jpeg' },
  { slug: 'turmeric-powder', name: 'Turmeric Powder', folder: 'food', file: 'project/src/assets/products/foodproducts/turmaric.jpeg' },
  { slug: 'organic-millet', name: 'Organic Millet', folder: 'food', file: 'project/src/assets/products/foodproducts/millet.jpeg' },
  { slug: 'ragi-flour', name: 'Ragi Flour', folder: 'food', file: 'project/src/assets/products/foodproducts/ragi.jpeg' },

  { slug: 'cotton-table-runner', name: 'Cotton Table Runner', folder: 'craft', file: 'project/src/assets/products/craftproducts/cottontablerunner.jpeg' },
  { slug: 'terracotta-flower-pot', name: 'Terracotta Flower Pot', folder: 'craft', file: 'project/src/assets/products/craftproducts/flowerpot.jpeg' },
  { slug: 'handmade-paper-bag', name: 'Handmade Paper Bag', folder: 'craft', file: 'project/src/assets/products/craftproducts/handmadepaperbag.jpeg' },
  { slug: 'iron-candle-holder', name: 'Iron Candle Holder', folder: 'craft', file: 'project/src/assets/products/craftproducts/ironcandleholder.jpeg' },
  { slug: 'metal-wall-hanging', name: 'Metal Wall Hanging', folder: 'craft', file: 'project/src/assets/products/craftproducts/metalwallhanging.jpeg' },
  { slug: 'handmade-paper-notebook', name: 'Handmade Paper Notebook', folder: 'craft', file: 'project/src/assets/products/craftproducts/papernotebook.jpeg' },
  { slug: 'wooden-storage-box', name: 'Wooden Storage Box', folder: 'craft', file: 'project/src/assets/products/craftproducts/storagebox.jpeg' },
  { slug: 'copper-water-bottle', name: 'Copper Water Bottle', folder: 'craft', file: 'project/src/assets/products/craftproducts/waterbottle.jpeg' },
  { slug: 'wooden-spice-box', name: 'Wooden Spice Box', folder: 'craft', file: 'project/src/assets/products/craftproducts/woodenspicebox.jpeg' },
  { slug: 'wooden-wall-shelf', name: 'Wooden Wall Shelf', folder: 'craft', file: 'project/src/assets/products/craftproducts/woodenwallshelf.jpeg' },

  { slug: 'coconut-shell-necklace', name: 'Coconut Shell Necklace', folder: 'fashion', file: 'project/src/assets/products/fashionproducts/coconutshellnecklace.jpeg' },
  { slug: 'organic-cotton-kurti', name: 'Organic Cotton Kurti', folder: 'fashion', file: 'project/src/assets/products/fashionproducts/cottonkurti.jpeg' },
  { slug: 'handloom-cotton-saree', name: 'Handloom Cotton Saree', folder: 'fashion', file: 'project/src/assets/products/fashionproducts/cottonsaree.jpeg' },
  { slug: 'eco-friendly-cotton-t-shirt', name: 'Eco-friendly Cotton T-Shirt', folder: 'fashion', file: 'project/src/assets/products/fashionproducts/cottontshirt.jpeg' },
  { slug: 'handcrafted-earrings', name: 'Handcrafted Earrings', folder: 'fashion', file: 'project/src/assets/products/fashionproducts/earings.jpeg' },
  { slug: 'sustainable-jute-handbag', name: 'Sustainable Jute Handbag', folder: 'fashion', file: 'project/src/assets/products/fashionproducts/jutehandbag.jpeg' },
  { slug: 'pure-linen-pant', name: 'Pure Linen Pant', folder: 'fashion', file: 'project/src/assets/products/fashionproducts/linenpant.jpeg' },
  { slug: 'classic-linen-shirt', name: 'Classic Linen Shirt', folder: 'fashion', file: 'project/src/assets/products/fashionproducts/linenshirt.jpeg' },

  { slug: 'wooden-wall-hanging-art', name: 'Wooden Wall Hanging Art', folder: 'decor', file: 'project/src/assets/products/decorItemproducts/Woodenwallhanging.jpeg' },
  { slug: 'handcrafted-bamboo-lamp', name: 'Handcrafted Bamboo Lamp', folder: 'decor', file: 'project/src/assets/products/decorItemproducts/bamboolamp.jpeg' },
  { slug: 'elegant-bamboo-vase', name: 'Elegant Bamboo Vase', folder: 'decor', file: 'project/src/assets/products/decorItemproducts/bomboovase.jpeg' },
  { slug: 'ceramic-centerpiece', name: 'Ceramic Centerpiece', folder: 'decor', file: 'project/src/assets/products/decorItemproducts/ceramiccenterpiece.jpeg' },
  { slug: 'eco-coconut-shell-lamp', name: 'Eco Coconut Shell Lamp', folder: 'decor', file: 'project/src/assets/products/decorItemproducts/coconutlamp.jpeg' },
  { slug: 'handwoven-cotton-rug', name: 'Handwoven Cotton Rug', folder: 'decor', file: 'project/src/assets/products/decorItemproducts/cottonrug.jpeg' },
  { slug: 'natural-jute-carpet', name: 'Natural Jute Carpet', folder: 'decor', file: 'project/src/assets/products/decorItemproducts/jutecarpet.jpeg' },
  { slug: 'rustic-metal-wall-art', name: 'Rustic Metal Wall Art', folder: 'decor', file: 'project/src/assets/products/decorItemproducts/metalwallart.jpeg' },
  { slug: 'minimalist-planter-pot', name: 'Minimalist Planter Pot', folder: 'decor', file: 'project/src/assets/products/decorItemproducts/planterpot.jpeg' },
  { slug: 'wooden-candle-holder', name: 'Wooden Candle Holder', folder: 'decor', file: 'project/src/assets/products/decorItemproducts/woodencandleholder.jpeg' },
];

const contentTypeByExtension = {
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
};

const ensureBucket = async () => {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) throw listError;

  const existingBucket = buckets.find((bucket) => bucket.id === bucketName);
  if (!existingBucket) {
    const { error } = await supabase.storage.createBucket(bucketName, {
      public: true,
      fileSizeLimit: 5242880,
      allowedMimeTypes: Object.values(contentTypeByExtension),
    });
    if (error) throw error;
    return;
  }

  const { error } = await supabase.storage.updateBucket(bucketName, {
    public: true,
    fileSizeLimit: 5242880,
    allowedMimeTypes: Object.values(contentTypeByExtension),
  });
  if (error) throw error;
};

const ensureProductImageColumns = async () => {
  const { error } = await supabase
    .from('products')
    .select('image_url,image_path')
    .limit(1);

  if (error) {
    throw new Error(
      `products.image_url/image_path columns are required. Run server/supabase/add_product_image_columns.sql first. Supabase said: ${error.message}`
    );
  }
};

const verifyFrontendFiles = async () => {
  if (products.length !== 61) {
    throw new Error(`Expected 61 products, found ${products.length}.`);
  }

  const missingFiles = products
    .map((product) => ({ ...product, absolutePath: path.join(repoRoot, product.file) }))
    .filter((product) => !existsSync(product.absolutePath));

  if (missingFiles.length > 0) {
    throw new Error(`Missing image files:\n${missingFiles.map((product) => product.file).join('\n')}`);
  }
};

const uploadAndUpdateProducts = async () => {
  for (const product of products) {
    const absolutePath = path.join(repoRoot, product.file);
    const extension = path.extname(product.file).toLowerCase();
    const storagePath = `${product.folder}/${product.slug}${extension}`;
    const fileStats = await stat(absolutePath);

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(storagePath, createReadStream(absolutePath), {
        cacheControl: '31536000',
        contentType: contentTypeByExtension[extension] || 'application/octet-stream',
        duplex: 'half',
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Upload failed for ${product.name}: ${uploadError.message}`);
    }

    const { data } = supabase.storage.from(bucketName).getPublicUrl(storagePath);
    const imageUrl = data.publicUrl;

    const { data: updatedRows, error: updateError } = await supabase
      .from('products')
      .update({
        image_path: storagePath,
        image_url: imageUrl,
      })
      .eq('slug', product.slug)
      .select('id,slug');

    if (updateError) {
      throw new Error(`Database update failed for ${product.name}: ${updateError.message}`);
    }

    if (!updatedRows || updatedRows.length !== 1) {
      throw new Error(`Expected one database row for ${product.name} (${product.slug}), updated ${updatedRows?.length || 0}.`);
    }

    console.log(`Uploaded ${product.name} (${Math.round(fileStats.size / 1024)} KB) -> ${storagePath}`);
  }
};

const verifyMigration = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('id,name,slug,image_url,image_path')
    .or('image_url.is.null,image_path.is.null');

  if (error) throw error;

  if (data.length > 0) {
    throw new Error(`Products missing image URLs:\n${data.map((product) => `${product.slug} - ${product.name}`).join('\n')}`);
  }

  console.log('Verified: every product has image_url and image_path.');
};

const main = async () => {
  await verifyFrontendFiles();
  await ensureBucket();
  await ensureProductImageColumns();
  await uploadAndUpdateProducts();
  await verifyMigration();
  console.log('Product image migration completed successfully.');
};

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
