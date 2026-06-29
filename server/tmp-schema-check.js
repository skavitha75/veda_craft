import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const anon = process.env.SUPABASE_ANON_KEY;
if (!url || !anon) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(url, anon);

const checkColumn = async (table, selectStr) => {
  console.log('Checking', table, selectStr);
  const { data, error } = await supabase.from(table).select(selectStr).limit(0);
  console.log('ERROR', error);
  console.log('DATA', data);
};

(async () => {
  await checkColumn('products', 'id');
  await checkColumn('products', 'id,image_url');
  await checkColumn('products', 'id,image_path');
  await checkColumn('products', 'id,image_url,image_path');
  await checkColumn('products_legacy_backup_20260628150253', 'id,image_url,image_path');
})();
