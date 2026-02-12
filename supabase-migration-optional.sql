-- Run in Supabase SQL Editor if vehicles table is missing document URL columns.

alter table public.vehicles
add column if not exists carfax_url text;

alter table public.vehicles
add column if not exists window_sticker_url text;
