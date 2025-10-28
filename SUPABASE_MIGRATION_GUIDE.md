# Supabase Migration Setup Guide

## Prerequisites

1. **Supabase Account**: Create a free account at [supabase.com](https://supabase.com)
2. **Supabase Project**: Create a new project in your Supabase dashboard

## Step 1: Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Database Configuration (Supabase PostgreSQL)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
```

### How to get these values:

1. **Supabase URL & Keys**: Go to your Supabase project dashboard → Settings → API
2. **Database URL**: Go to Settings → Database → Connection string → URI

## Step 2: Create Storage Buckets

In your Supabase dashboard, go to Storage and create these buckets:

### Required Buckets:
- `product-images` (public)
- `product-attachments` (public)
- `vendor-logos` (public)
- `assets` (public)

### Bucket Policies:
For public buckets, create policies that allow public read access:

```sql
-- Example policy for public read access
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');
```

## Step 3: Database Migration

1. **Apply Prisma Schema**:
   ```bash
   npx prisma migrate dev
   ```

2. **Seed Database**:
   ```bash
   npx prisma db seed
   ```

## Step 4: File Migration

Run the migration script to move existing files to Supabase Storage:

```bash
npx tsx scripts/migrate-files-to-supabase.ts
```

## Step 5: Test the Migration

1. **Start Development Server**:
   ```bash
   npm run dev
   ```

2. **Test File Operations**:
   - Upload a product image
   - Upload a product attachment
   - Verify images load correctly
   - Test file downloads

## Step 6: Deploy to Production

1. **Add Environment Variables to Vercel**:
   - Go to your Vercel project settings
   - Add all the environment variables from Step 1

2. **Deploy**:
   ```bash
   vercel --prod
   ```

## Troubleshooting

### Common Issues:

1. **"Invalid image optimize request"**: Make sure Supabase URL is correct and remote patterns are configured
2. **File upload fails**: Check Supabase service role key and bucket policies
3. **Images not loading**: Verify bucket is public and files are uploaded correctly

### Verification Commands:

```bash
# Check if Supabase connection works
npx prisma db pull

# Verify storage buckets exist
# Check in Supabase dashboard → Storage

# Test file upload
# Try uploading a product image in the admin panel
```

## Cleanup (After Migration)

Once everything is working:

1. **Remove Local Files**:
   ```bash
   rm -rf public/uploads
   ```

2. **Update Documentation**: Update README with Supabase setup instructions

## Support

If you encounter issues:
1. Check Supabase logs in the dashboard
2. Verify all environment variables are set correctly
3. Ensure bucket policies allow the required operations
