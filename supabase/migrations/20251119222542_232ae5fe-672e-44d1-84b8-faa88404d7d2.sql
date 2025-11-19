-- Étape 1: Création des types ENUM
CREATE TYPE public.app_role AS ENUM ('admin', 'responsable_qualite', 'auditeur', 'employe');
CREATE TYPE public.nc_status AS ENUM ('ouverte', 'en_cours', 'resolue', 'cloturee', 'rejetee');
CREATE TYPE public.nc_priority AS ENUM ('basse', 'moyenne', 'haute', 'critique');
CREATE TYPE public.audit_type AS ENUM ('interne', 'externe', 'fournisseur', 'client');
CREATE TYPE public.audit_status AS ENUM ('planifie', 'en_cours', 'termine', 'reporte');
CREATE TYPE public.action_type AS ENUM ('corrective', 'preventive', 'amelioration');
CREATE TYPE public.action_status AS ENUM ('planifiee', 'en_cours', 'terminee', 'verifiee', 'inefficace');

-- Étape 2: Table des rôles utilisateurs (SÉCURISÉE)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, role)
);

-- Fonction de vérification des rôles (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Étape 3: Table des profils utilisateurs
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger pour créer automatiquement un profil lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name'
  );
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Étape 4: Tables métier principales

-- Non-conformités
CREATE TABLE public.non_conformities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nc_number TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    cause TEXT,
    corrective_action TEXT,
    status nc_status DEFAULT 'ouverte' NOT NULL,
    priority nc_priority DEFAULT 'moyenne' NOT NULL,
    created_by UUID REFERENCES auth.users(id) NOT NULL,
    assigned_to UUID REFERENCES auth.users(id),
    attachment_url TEXT,
    due_date DATE,
    closed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Audits
CREATE TABLE public.audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_number TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    type audit_type NOT NULL,
    auditor_id UUID REFERENCES auth.users(id) NOT NULL,
    audit_date DATE NOT NULL,
    score DECIMAL(5,2),
    status audit_status DEFAULT 'planifie' NOT NULL,
    report_url TEXT,
    observations TEXT,
    created_by UUID REFERENCES auth.users(id) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Actions CAPA
CREATE TABLE public.actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action_number TEXT UNIQUE NOT NULL,
    type action_type NOT NULL,
    description TEXT NOT NULL,
    assigned_to UUID REFERENCES auth.users(id) NOT NULL,
    due_date DATE NOT NULL,
    status action_status DEFAULT 'planifiee' NOT NULL,
    effectiveness_verified BOOLEAN DEFAULT false,
    verification_notes TEXT,
    nc_id UUID REFERENCES public.non_conformities(id),
    audit_id UUID REFERENCES public.audits(id),
    created_by UUID REFERENCES auth.users(id) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Documents
CREATE TABLE public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_number TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    version TEXT NOT NULL DEFAULT '1.0',
    category TEXT NOT NULL,
    file_url TEXT NOT NULL,
    validated_by UUID REFERENCES auth.users(id),
    validation_date TIMESTAMPTZ,
    expiry_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Évaluation fournisseurs
CREATE TABLE public.suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    contact_email TEXT,
    contact_phone TEXT,
    evaluation_score DECIMAL(5,2),
    last_evaluation_date DATE,
    comments TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- KPIs
CREATE TABLE public.kpi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    value TEXT NOT NULL,
    target TEXT,
    period TEXT,
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Notifications
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    related_id UUID,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Rapports IA
CREATE TABLE public.ai_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    context TEXT NOT NULL,
    ai_output TEXT NOT NULL,
    report_type TEXT NOT NULL,
    related_id UUID,
    created_by UUID REFERENCES auth.users(id) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Étape 5: Fonctions de génération automatique des numéros

CREATE OR REPLACE FUNCTION generate_nc_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
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
$$;

CREATE OR REPLACE FUNCTION generate_audit_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
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
$$;

CREATE OR REPLACE FUNCTION generate_action_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
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
$$;

-- Triggers pour auto-générer les numéros
CREATE OR REPLACE FUNCTION set_nc_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.nc_number IS NULL OR NEW.nc_number = '' THEN
    NEW.nc_number := generate_nc_number();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER before_insert_nc_number
  BEFORE INSERT ON public.non_conformities
  FOR EACH ROW
  EXECUTE FUNCTION set_nc_number();

CREATE OR REPLACE FUNCTION set_audit_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.audit_number IS NULL OR NEW.audit_number = '' THEN
    NEW.audit_number := generate_audit_number();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER before_insert_audit_number
  BEFORE INSERT ON public.audits
  FOR EACH ROW
  EXECUTE FUNCTION set_audit_number();

CREATE OR REPLACE FUNCTION set_action_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.action_number IS NULL OR NEW.action_number = '' THEN
    NEW.action_number := generate_action_number();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER before_insert_action_number
  BEFORE INSERT ON public.actions
  FOR EACH ROW
  EXECUTE FUNCTION set_action_number();

-- Étape 6: Activation de RLS sur toutes les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.non_conformities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_reports ENABLE ROW LEVEL SECURITY;

-- Étape 7: Politiques RLS pour profiles
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Politiques RLS pour user_roles
CREATE POLICY "Users can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Politiques RLS pour non_conformities
CREATE POLICY "Users can view all NCs"
  ON public.non_conformities FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create NCs"
  ON public.non_conformities FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Admins and quality managers can update NCs"
  ON public.non_conformities FOR UPDATE
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'responsable_qualite')
  );

CREATE POLICY "Admins can delete NCs"
  ON public.non_conformities FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Politiques RLS pour audits
CREATE POLICY "Users can view all audits"
  ON public.audits FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Auditors and quality managers can create audits"
  ON public.audits FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'responsable_qualite') OR
    public.has_role(auth.uid(), 'auditeur')
  );

CREATE POLICY "Auditors and quality managers can update audits"
  ON public.audits FOR UPDATE
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'responsable_qualite') OR
    public.has_role(auth.uid(), 'auditeur')
  );

-- Politiques RLS pour actions
CREATE POLICY "Users can view all actions"
  ON public.actions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Quality managers can create actions"
  ON public.actions FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'responsable_qualite')
  );

CREATE POLICY "Assigned users can update their actions"
  ON public.actions FOR UPDATE
  TO authenticated
  USING (
    assigned_to = auth.uid() OR
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'responsable_qualite')
  );

-- Politiques RLS pour documents
CREATE POLICY "Users can view active documents"
  ON public.documents FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Quality managers can manage documents"
  ON public.documents FOR ALL
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'responsable_qualite')
  );

-- Politiques RLS pour suppliers
CREATE POLICY "Users can view suppliers"
  ON public.suppliers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Quality managers can manage suppliers"
  ON public.suppliers FOR ALL
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'responsable_qualite')
  );

-- Politiques RLS pour KPI
CREATE POLICY "Users can view KPIs"
  ON public.kpi FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and quality managers can manage KPIs"
  ON public.kpi FOR ALL
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'responsable_qualite')
  );

-- Politiques RLS pour notifications
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can create notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Politiques RLS pour ai_reports
CREATE POLICY "Users can view all AI reports"
  ON public.ai_reports FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create AI reports"
  ON public.ai_reports FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());