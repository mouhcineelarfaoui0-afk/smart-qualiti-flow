-- Fix security settings for all database functions
-- Add SECURITY DEFINER and SET search_path = public to prevent search path manipulation attacks

-- Fix generate_nc_number function
CREATE OR REPLACE FUNCTION public.generate_nc_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  next_num INTEGER;
  year_part TEXT;
BEGIN
  year_part := TO_CHAR(NOW(), 'YYYY');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(nc_number FROM 'NC-\d{4}-(\d+)') AS INTEGER)), 0) + 1
  INTO next_num
  FROM public.non_conformities
  WHERE nc_number LIKE 'NC-' || year_part || '-%';
  
  RETURN 'NC-' || year_part || '-' || LPAD(next_num::TEXT, 3, '0');
END;
$function$;

-- Fix generate_audit_number function
CREATE OR REPLACE FUNCTION public.generate_audit_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  next_num INTEGER;
  year_part TEXT;
BEGIN
  year_part := TO_CHAR(NOW(), 'YYYY');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(audit_number FROM 'AUD-\d{4}-(\d+)') AS INTEGER)), 0) + 1
  INTO next_num
  FROM public.audits
  WHERE audit_number LIKE 'AUD-' || year_part || '-%';
  
  RETURN 'AUD-' || year_part || '-' || LPAD(next_num::TEXT, 3, '0');
END;
$function$;

-- Fix generate_action_number function
CREATE OR REPLACE FUNCTION public.generate_action_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  next_num INTEGER;
  year_part TEXT;
BEGIN
  year_part := TO_CHAR(NOW(), 'YYYY');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(action_number FROM 'ACT-\d{4}-(\d+)') AS INTEGER)), 0) + 1
  INTO next_num
  FROM public.actions
  WHERE action_number LIKE 'ACT-' || year_part || '-%';
  
  RETURN 'ACT-' || year_part || '-' || LPAD(next_num::TEXT, 3, '0');
END;
$function$;

-- Fix set_nc_number trigger function
CREATE OR REPLACE FUNCTION public.set_nc_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF NEW.nc_number IS NULL OR NEW.nc_number = '' THEN
    NEW.nc_number := generate_nc_number();
  END IF;
  RETURN NEW;
END;
$function$;

-- Fix set_audit_number trigger function
CREATE OR REPLACE FUNCTION public.set_audit_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF NEW.audit_number IS NULL OR NEW.audit_number = '' THEN
    NEW.audit_number := generate_audit_number();
  END IF;
  RETURN NEW;
END;
$function$;

-- Fix set_action_number trigger function
CREATE OR REPLACE FUNCTION public.set_action_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF NEW.action_number IS NULL OR NEW.action_number = '' THEN
    NEW.action_number := generate_action_number();
  END IF;
  RETURN NEW;
END;
$function$;