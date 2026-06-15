
-- Add font management to branding
ALTER TABLE public.branding_settings
  ADD COLUMN IF NOT EXISTS font_family text NOT NULL DEFAULT 'Geist',
  ADD COLUMN IF NOT EXISTS font_display_family text NOT NULL DEFAULT 'Geist',
  ADD COLUMN IF NOT EXISTS font_weights text NOT NULL DEFAULT '100;200;300';
