-- Add soft delete functionality to contact_messages
-- Run this in Supabase SQL Editor

-- Add deleted_at column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'contact_messages' 
        AND column_name = 'deleted_at'
    ) THEN
        ALTER TABLE contact_messages 
        ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;
        
        -- Create index for faster trash queries
        CREATE INDEX idx_contact_messages_deleted_at ON contact_messages(deleted_at);
        
        -- Add comment
        COMMENT ON COLUMN contact_messages.deleted_at IS 'Timestamp when message was moved to trash. NULL means not deleted.';
        
        RAISE NOTICE 'Column deleted_at added successfully';
    ELSE
        RAISE NOTICE 'Column deleted_at already exists';
    END IF;
END $$;
