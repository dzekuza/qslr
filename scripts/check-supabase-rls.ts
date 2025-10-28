import { supabase, supabaseAdmin } from '../lib/supabase'

/**
 * Check Supabase RLS policies and test unauthenticated access
 */
export async function checkSupabaseRLSPolicies(): Promise<void> {
  console.log('🔍 Checking Supabase RLS policies and access...')
  
  try {
    // Test unauthenticated access to products
    console.log('\n📊 Testing unauthenticated access to products...')
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(5)
    
    if (productsError) {
      console.log(`   ❌ Unauthenticated access failed: ${productsError.message}`)
      console.log(`   🔍 Error details: ${JSON.stringify(productsError, null, 2)}`)
    } else {
      console.log(`   ✅ Unauthenticated access successful!`)
      console.log(`   📦 Found ${products?.length || 0} products`)
      if (products && products.length > 0) {
        console.log(`   📋 Sample product: ${products[0].name}`)
      }
    }
    
    // Test authenticated access (admin client)
    console.log('\n🔐 Testing authenticated access to products...')
    const { data: authProducts, error: authError } = await supabaseAdmin
      .from('products')
      .select('*')
      .limit(5)
    
    if (authError) {
      console.log(`   ❌ Authenticated access failed: ${authError.message}`)
    } else {
      console.log(`   ✅ Authenticated access successful!`)
      console.log(`   📦 Found ${authProducts?.length || 0} products`)
    }
    
    // Check RLS policies (this requires admin access)
    console.log('\n🛡️ Checking RLS policies...')
    try {
      const { data: policies, error: policiesError } = await supabaseAdmin
        .rpc('get_rls_policies', { table_name: 'products' })
      
      if (policiesError) {
        console.log(`   ⚠️ Could not fetch policies directly: ${policiesError.message}`)
        console.log(`   💡 This is normal - policies are managed through SQL`)
      } else {
        console.log(`   📋 Found ${policies?.length || 0} policies`)
        policies?.forEach((policy: any) => {
          console.log(`      - ${policy.policyname}: ${policy.cmd}`)
        })
      }
    } catch (error) {
      console.log(`   ⚠️ Policy check failed: ${error}`)
    }
    
    // Test storage access
    console.log('\n📁 Testing storage access...')
    const { data: buckets, error: bucketsError } = await supabaseAdmin.storage.listBuckets()
    
    if (bucketsError) {
      console.log(`   ❌ Storage access failed: ${bucketsError.message}`)
    } else {
      console.log(`   ✅ Storage access successful!`)
      console.log(`   📦 Found ${buckets.length} buckets:`)
      buckets.forEach(bucket => {
        console.log(`      - ${bucket.name} (${bucket.public ? 'public' : 'private'})`)
      })
    }
    
    // Test public asset access
    console.log('\n🖼️ Testing public asset access...')
    const { data: assets, error: assetsError } = await supabaseAdmin.storage
      .from('assets')
      .list('', { limit: 5 })
    
    if (assetsError) {
      console.log(`   ❌ Asset access failed: ${assetsError.message}`)
    } else {
      console.log(`   ✅ Asset access successful!`)
      console.log(`   📁 Found ${assets?.length || 0} assets`)
      if (assets && assets.length > 0) {
        console.log(`   📋 Sample asset: ${assets[0].name}`)
      }
    }
    
    console.log('\n🎉 RLS and access check completed!')
    
  } catch (error) {
    console.log(`\n💥 Check failed: ${error}`)
  }
}

/**
 * Create RLS policies for public access to products
 */
export async function createPublicProductPolicies(): Promise<void> {
  console.log('🛡️ Creating RLS policies for public product access...')
  
  try {
    // Enable RLS on products table
    const { error: enableError } = await supabaseAdmin.rpc('exec_sql', {
      sql: 'ALTER TABLE products ENABLE ROW LEVEL SECURITY;'
    })
    
    if (enableError) {
      console.log(`   ⚠️ Could not enable RLS: ${enableError.message}`)
    } else {
      console.log('   ✅ RLS enabled on products table')
    }
    
    // Create policy for public read access to products
    const { error: policyError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE POLICY "Public read access to products" ON products
        FOR SELECT USING (true);
      `
    })
    
    if (policyError) {
      console.log(`   ⚠️ Could not create policy: ${policyError.message}`)
      console.log(`   💡 You may need to create this policy manually in Supabase dashboard`)
    } else {
      console.log('   ✅ Public read policy created for products')
    }
    
    console.log('\n📝 Manual steps if automatic creation fails:')
    console.log('1. Go to Supabase Dashboard → Authentication → Policies')
    console.log('2. Select the "products" table')
    console.log('3. Create a new policy:')
    console.log('   - Name: "Public read access to products"')
    console.log('   - Operation: SELECT')
    console.log('   - Target roles: public')
    console.log('   - USING expression: true')
    
  } catch (error) {
    console.log(`\n💥 Policy creation failed: ${error}`)
  }
}

// Run if this script is executed directly
if (require.main === module) {
  checkSupabaseRLSPolicies()
    .then(() => {
      console.log('\n✅ Check completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Check failed:', error)
      process.exit(1)
    })
}
