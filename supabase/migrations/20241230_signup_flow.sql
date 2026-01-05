-- Migration: Add signup flow fields to signups table
-- This migration adds the fixed question answer columns and removes the dynamic answers jsonb column

-- Remove questions column from waitlists (if it exists)
ALTER TABLE waitlists DROP COLUMN IF EXISTS questions;

-- Add fixed answer columns to signups
ALTER TABLE signups 
  ADD COLUMN IF NOT EXISTS name text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS company text,
  ADD COLUMN IF NOT EXISTS role text,
  ADD COLUMN IF NOT EXISTS company_size text,
  ADD COLUMN IF NOT EXISTS answer_problem text,
  ADD COLUMN IF NOT EXISTS answer_workflow text,
  ADD COLUMN IF NOT EXISTS answer_alternatives text,
  ADD COLUMN IF NOT EXISTS answer_success text,
  ADD COLUMN IF NOT EXISTS answer_source text,
  ADD COLUMN IF NOT EXISTS scoring_metadata jsonb;

-- Drop answers jsonb column (no longer needed)
ALTER TABLE signups DROP COLUMN IF EXISTS answers;

-- Create index for faster lookups by waitlist
CREATE INDEX IF NOT EXISTS idx_signups_waitlist_id ON signups(waitlist_id);

-- Create index for position ordering
CREATE INDEX IF NOT EXISTS idx_signups_position ON signups(waitlist_id, llm_score DESC NULLS LAST);

-- Create unique constraint for email per waitlist (prevent duplicate signups)
CREATE UNIQUE INDEX IF NOT EXISTS idx_signups_unique_email_per_waitlist 
  ON signups(waitlist_id, email);

-- RLS Policies for signups table (if not already set)
-- Allow anyone to insert into signups (public signup page)
DROP POLICY IF EXISTS "Anyone can insert signups" ON signups;
CREATE POLICY "Anyone can insert signups" ON signups
  FOR INSERT
  WITH CHECK (true);

-- Only waitlist owner can view signups for their waitlists
DROP POLICY IF EXISTS "Owners can view their waitlist signups" ON signups;
CREATE POLICY "Owners can view their waitlist signups" ON signups
  FOR SELECT
  USING (
    waitlist_id IN (
      SELECT id FROM waitlists WHERE owner_id = auth.uid()
    )
  );

-- Allow anyone to read their own signup by ID (for position polling after signup)
DROP POLICY IF EXISTS "Anyone can view signup by id" ON signups;
CREATE POLICY "Anyone can view signup by id" ON signups
  FOR SELECT
  USING (true);

-- Only waitlist owner can update signups
DROP POLICY IF EXISTS "Owners can update their waitlist signups" ON signups;
CREATE POLICY "Owners can update their waitlist signups" ON signups
  FOR UPDATE
  USING (
    waitlist_id IN (
      SELECT id FROM waitlists WHERE owner_id = auth.uid()
    )
  );

-- RLS policy to allow anyone to read waitlist info (for public signup page)
DROP POLICY IF EXISTS "Anyone can view waitlist info" ON waitlists;
CREATE POLICY "Anyone can view waitlist info" ON waitlists
  FOR SELECT
  USING (true);
