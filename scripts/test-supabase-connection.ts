/**
 * Test Supabase connection and configuration
 */
export async function testSupabaseConnection(): Promise<void> {
  console.log('🔍 Testing Supabase connection...')
  
  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  console.log('\n📋 Environment Variables:')
  console.log(`   NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`)
  console.log(`   NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? '✅ Set' : '❌ Missing'}`)
  console.log(`   SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey ? '✅ Set' : '❌ Missing'}`)
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('\n❌ Missing required environment variables!')
    console.log('\n📝 To fix this, add the following to your .env.local file:')
    console.log('')
    console.log('# Supabase Configuration')
    console.log('NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co')
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key')
    console.log('SUPABASE_SERVICE_ROLE_KEY=your-service-role-key')
    console.log('')
    console.log('🔗 Get these values from: https://supabase.com/dashboard')
    console.log('   1. Go to your project')
    console.log('   2. Settings → API')
    console.log('   3. Copy the Project URL and API keys')
    return
  }
  
  try {
    // Import Supabase client only if environment variables are set
    const { supabase, supabaseAdmin } = await import('../lib/supabase')
    
    // Test basic connection
    console.log('\n🔌 Testing basic connection...')
    const { data, error } = await supabase.from('products').select('id').limit(1)
    
    if (error) {
      console.log(`   ❌ Connection failed: ${error.message}`)
      return
    }
    
    console.log('   ✅ Basic connection successful!')
    
    // Test storage access
    console.log('\n📁 Testing storage access...')
    const { data: buckets, error: bucketsError } = await supabaseAdmin.storage.listBuckets()
    
    if (bucketsError) {
      console.log(`   ❌ Storage access failed: ${bucketsError.message}`)
    } else {
      console.log('   ✅ Storage access successful!')
      console.log(`   📦 Found ${buckets.length} buckets:`)
      buckets.forEach(bucket => {
        console.log(`      - ${bucket.name} (${bucket.public ? 'public' : 'private'})`)
      })
    }
    
    // Test database access
    console.log('\n🗄️ Testing database access...')
    const { data: products, error: productsError } = await supabase.from('products').select('id').limit(1)
    
    if (productsError) {
      console.log(`   ❌ Database access failed: ${productsError.message}`)
    } else {
      console.log('   ✅ Database access successful!')
      console.log(`   📊 Found ${products?.length || 0} products in database`)
    }
    
    console.log('\n🎉 Supabase connection test completed!')
    
  } catch (error) {
    console.log(`\n💥 Connection test failed: ${error}`)
  }
}

// Run if this script is executed directly
if (require.main === module) {
  testSupabaseConnection()
    .then(() => {
      console.log('\n✅ Test completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Test failed:', error)
      process.exit(1)
    })
}
