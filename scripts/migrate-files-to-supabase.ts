import { readdir, readFile, stat } from 'fs/promises'
import { join } from 'path'
import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma'
import { uploadFile, getPublicUrl } from '../lib/supabase-storage'

interface FileMigrationResult {
  success: boolean
  oldPath: string
  newPath: string
  error?: string
}

/**
 * Migrate files from local storage to Supabase Storage
 */
export async function migrateFilesToSupabase(): Promise<void> {
  console.log('🚀 Starting file migration to Supabase Storage...')
  
  const results: FileMigrationResult[] = []
  
  try {
    // Migrate product attachments
    console.log('📁 Migrating product attachments...')
    const attachmentResults = await migrateProductAttachments()
    results.push(...attachmentResults)
    
    // Migrate assets
    console.log('🎨 Migrating assets...')
    const assetResults = await migrateAssets()
    results.push(...assetResults)
    
    // Print summary
    const successful = results.filter(r => r.success).length
    const failed = results.filter(r => !r.success).length
    
    console.log(`\n✅ Migration completed!`)
    console.log(`   Successful: ${successful}`)
    console.log(`   Failed: ${failed}`)
    
    if (failed > 0) {
      console.log('\n❌ Failed migrations:')
      results.filter(r => !r.success).forEach(r => {
        console.log(`   ${r.oldPath} -> ${r.error}`)
      })
    }
    
  } catch (error) {
    console.error('💥 Migration failed:', error)
    throw error
  }
}

/**
 * Migrate product attachments from local storage to Supabase
 */
async function migrateProductAttachments(): Promise<FileMigrationResult[]> {
  const results: FileMigrationResult[] = []
  
  try {
    // Get all product attachments from database
    const attachments = await prisma.productAttachment.findMany({
      where: {
        filePath: {
          startsWith: '/uploads/attachments/'
        }
      }
    })
    
    console.log(`   Found ${attachments.length} attachments to migrate`)
    
    for (const attachment of attachments) {
      try {
        // Read the local file
        const localPath = join(process.cwd(), 'public', attachment.filePath)
        const fileBuffer = await readFile(localPath)
        
        // Generate new path in Supabase Storage
        const fileName = attachment.fileName
        const newPath = `${attachment.productId}/${fileName}`
        
        // Upload to Supabase Storage
        const uploadResult = await uploadFile(
          'product-attachments',
          newPath,
          fileBuffer,
          {
            contentType: attachment.mimeType,
            upsert: false
          }
        )
        
        if (uploadResult.error) {
          throw new Error(uploadResult.error.message)
        }
        
        // Get public URL
        const { data: { publicUrl } } = getPublicUrl('product-attachments', newPath)
        
        // Update database record
        await prisma.productAttachment.update({
          where: { id: attachment.id },
          data: { filePath: publicUrl }
        })
        
        results.push({
          success: true,
          oldPath: attachment.filePath,
          newPath: publicUrl
        })
        
        console.log(`   ✅ Migrated: ${attachment.originalName}`)
        
      } catch (error) {
        results.push({
          success: false,
          oldPath: attachment.filePath,
          newPath: '',
          error: error instanceof Error ? error.message : 'Unknown error'
        })
        
        console.log(`   ❌ Failed: ${attachment.originalName} - ${error}`)
      }
    }
    
  } catch (error) {
    console.error('Error migrating product attachments:', error)
  }
  
  return results
}

/**
 * Migrate assets from local storage to Supabase
 */
async function migrateAssets(): Promise<FileMigrationResult[]> {
  const results: FileMigrationResult[] = []
  
  try {
    const assetsDir = join(process.cwd(), 'public', 'assets')
    
    // Check if assets directory exists
    try {
      await stat(assetsDir)
    } catch {
      console.log('   No assets directory found, skipping asset migration')
      return results
    }
    
    // Read all files in assets directory
    const files = await readdir(assetsDir)
    console.log(`   Found ${files.length} asset files to migrate`)
    
    for (const file of files) {
      try {
        const localPath = join(assetsDir, file)
        const fileBuffer = await readFile(localPath)
        
        // Determine content type based on file extension
        const extension = file.split('.').pop()?.toLowerCase()
        let contentType = 'application/octet-stream'
        
        switch (extension) {
          case 'png':
            contentType = 'image/png'
            break
          case 'jpg':
          case 'jpeg':
            contentType = 'image/jpeg'
            break
          case 'svg':
            contentType = 'image/svg+xml'
            break
          case 'gif':
            contentType = 'image/gif'
            break
          case 'webp':
            contentType = 'image/webp'
            break
        }
        
        // Upload to Supabase Storage
        const uploadResult = await uploadFile(
          'assets',
          file,
          fileBuffer,
          {
            contentType,
            upsert: false
          }
        )
        
        if (uploadResult.error) {
          throw new Error(uploadResult.error.message)
        }
        
        // Get public URL
        const { data: { publicUrl } } = getPublicUrl('assets', file)
        
        results.push({
          success: true,
          oldPath: `/assets/${file}`,
          newPath: publicUrl
        })
        
        console.log(`   ✅ Migrated: ${file}`)
        
      } catch (error) {
        results.push({
          success: false,
          oldPath: `/assets/${file}`,
          newPath: '',
          error: error instanceof Error ? error.message : 'Unknown error'
        })
        
        console.log(`   ❌ Failed: ${file} - ${error}`)
      }
    }
    
  } catch (error) {
    console.error('Error migrating assets:', error)
  }
  
  return results
}

/**
 * Update product images and thumbnails to use Supabase URLs
 */
export async function updateProductImageUrls(): Promise<void> {
  console.log('🖼️ Updating product image URLs...')
  
  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { images: { isEmpty: false } },
          { thumbnail: { not: null } }
        ]
      }
    })
    
    console.log(`   Found ${products.length} products with images to update`)
    
    for (const product of products) {
      try {
        const updates: any = {}
        
        // Update thumbnail
        if (product.thumbnail && typeof product.thumbnail === 'string') {
          if (product.thumbnail.startsWith('/assets/')) {
            const fileName = product.thumbnail.replace('/assets/', '')
            updates.thumbnail = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/${fileName}`
          }
        }
        
        // Update images array
        if (product.images && Array.isArray(product.images)) {
          updates.images = product.images.map((image: string) => {
            if (image.startsWith('/assets/')) {
              const fileName = image.replace('/assets/', '')
              return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/assets/${fileName}`
            }
            return image
          })
        }
        
        if (Object.keys(updates).length > 0) {
          await prisma.product.update({
            where: { id: product.id },
            data: updates
          })
          
          console.log(`   ✅ Updated: ${product.name}`)
        }
        
      } catch (error) {
        console.log(`   ❌ Failed to update: ${product.name} - ${error}`)
      }
    }
    
  } catch (error) {
    console.error('Error updating product image URLs:', error)
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateFilesToSupabase()
    .then(() => {
      console.log('🎉 Migration completed successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error)
      process.exit(1)
    })
}
