import { supabaseAdmin } from './src/config/supabase.js';

async function createBucket() {
  try {
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
    if (listError) throw listError;

    const avatarsBucket = buckets.find((b) => b.name === 'avatars');
    if (!avatarsBucket) {
      console.log('Bucket "avatars" not found. Creating...');
      const { data, error } = await supabaseAdmin.storage.createBucket('avatars', {
        public: true,
      });
      if (error) throw error;
      console.log('Bucket "avatars" created successfully.');
    } else {
      console.log('Bucket "avatars" already exists.');
    }
  } catch (error) {
    console.error('Error ensuring bucket:', error.message);
  }
}

createBucket();
