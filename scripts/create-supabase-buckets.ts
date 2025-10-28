import { supabaseAdmin } from '../lib/supabase'

/**
 * Create required Supabase Storage buckets
 */
export async function createStorageBuckets(): Promise<void> {
  console.log('🚀 Creating Supabase Storage buckets...')
  
  const buckets = [
    {
      name: 'product-images',
      public: true,
      description: 'Product images and photos'
    },
    {
      name: 'product-attachments',
      public: true,
      description: 'Product documents, PDFs, and attachments'
    },
    {
      name: 'vendor-logos',
      public: true,
      description: 'Vendor logo images'
    },
    {
      name: 'assets',
      public: true,
      description: 'General site assets and icons'
    }
  ]
  
  for (const bucket of buckets) {
    try {
      console.log(`📁 Creating bucket: ${bucket.name}`)
      
      const { data, error } = await supabaseAdmin.storage.createBucket(bucket.name, {
        public: bucket.public,
        fileSizeLimit: 10 * 1024 * 1024, // 10MB
        allowedMimeTypes: bucket.name === 'assets' 
          ? ['image/png', 'image/jpeg', 'image/svg+xml', 'image/gif', 'image/webp']
          : ['image/png', 'image/jpeg', 'image/svg+xml', 'image/gif', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      })
      
      if (error) {
        if (error.message.includes('already exists')) {
          console.log(`   ✅ Bucket ${bucket.name} already exists`)
        } else {
          console.log(`   ❌ Error creating bucket ${bucket.name}: ${error.message}`)
        }
      } else {
        console.log(`   ✅ Created bucket: ${bucket.name}`)
      }
      
    } catch (error) {
      console.log(`   ❌ Failed to create bucket ${bucket.name}: ${error}`)
    }
  }
  
  console.log('\n🎉 Bucket creation completed!')
  console.log('\n📝 Next steps:')
  console.log('1. Go to your Supabase dashboard → Storage')
  console.log('2. Verify all buckets are created')
  console.log('3. Set up bucket policies for public access if needed')
  console.log('4. Run the file migration script: npx tsx scripts/migrate-files-to-supabase.ts')
}

// Run if this script is executed directly
if (require.main === module) {
  createStorageBuckets()
    .then(() => {
      console.log('🎉 Setup completed successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Setup failed:', error)
      process.exit(1)
    })
}
