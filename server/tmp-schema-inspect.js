import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const anon = process.env.SUPABASE_ANON_KEY;
if (!url || !anon) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(url, anon);

const sample = async (table) => {
  const { data, error } = await supabase.from(table).select('*').limit(1).maybeSingle();
  console.log('TABLE', table, 'SAMPLE_ERROR', error);
  console.log(JSON.stringify(data, null, 2));
};

const count = async (table) => {
  const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
  console.log('TABLE', table, 'COUNT_ERROR', error, 'COUNT', count);
};

(async () => {
  await sample('products');
  await sample('products_legacy_backup_20260628150253');
  await count('products');
  await count('products_legacy_backup_20260628150253');
})();
