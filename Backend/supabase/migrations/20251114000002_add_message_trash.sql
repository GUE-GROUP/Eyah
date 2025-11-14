-- Add soft delete functionality to contact_messages
-- Messages can be moved to trash and restored or permanently deleted

-- Add deleted_at column for soft deletes
ALTER TABLE contact_messages 
ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;

-- Create index for faster trash queries
CREATE INDEX idx_contact_messages_deleted_at ON contact_messages(deleted_at);

-- Comment
COMMENT ON COLUMN contact_messages.deleted_at IS 'Timestamp when message was moved to trash. NULL means not deleted.';
