import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
const url = process.env.SUPABASE_URL;
const anon = process.env.SUPABASE_ANON_KEY;
if (!url || !anon) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');
  process.exit(1);
}
const supabase = createClient(url, anon);
const inspect = async (table) => {
  const { data, error } = await supabase
    .from('pg_table_def')
    .select('column, type')
    .eq('tablename', table);
  console.log('TABLE', table, 'ERROR', error);
  console.log(JSON.stringify(data, null, 2));
};
(async () => {
  await inspect('products');
  await inspect('products_legacy_backup_20260628150253');
})();
