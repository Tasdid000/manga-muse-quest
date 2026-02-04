-- Add database constraints to validate comment content
-- This ensures server-side validation that cannot be bypassed by malicious clients

-- Add constraint to prevent empty/whitespace-only comments
ALTER TABLE public.comments
ADD CONSTRAINT content_not_empty CHECK (length(trim(content)) > 0);

-- Add constraint to enforce maximum length (1000 characters)
ALTER TABLE public.comments
ADD CONSTRAINT content_max_length CHECK (length(content) <= 1000);