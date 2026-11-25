-- Create Users Table (Profile)
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'agent', 'estimator')),
    status TEXT NOT NULL DEFAULT 'Active',
    avatar TEXT,
    lastLogin TIMESTAMP WITH TIME ZONE
);

-- Create Projects Table
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    client TEXT NOT NULL,
    zip TEXT NOT NULL,
    description TEXT,
    estimatorId UUID REFERENCES public.users(id),
    agentId UUID REFERENCES public.users(id),
    status TEXT NOT NULL DEFAULT 'Draft',
    drawing TEXT,
    estValue NUMERIC DEFAULT 0.0,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Quotations Table
CREATE TABLE public.quotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    projectId UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    totalValue NUMERIC NOT NULL,
    margin NUMERIC NOT NULL,
    agentStatus TEXT NOT NULL DEFAULT 'Pending',
    adminStatus TEXT NOT NULL DEFAULT 'Pending',
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Setup Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;

-- Allow read/write access for authenticated users for now
CREATE POLICY "Enable read access for all authenticated users" ON public.users FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all access for all authenticated users" ON public.projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all access for all authenticated users" ON public.quotations FOR ALL USING (auth.role() = 'authenticated');
