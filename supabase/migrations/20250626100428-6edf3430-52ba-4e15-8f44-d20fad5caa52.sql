
-- Projelere sıralama alanı ekle
ALTER TABLE public.projects 
ADD COLUMN sort_order INTEGER DEFAULT 0;

-- Ana projeler için sıralama değerleri ata
WITH main_projects_ordered AS (
  SELECT id, row_number() OVER (ORDER BY created_at) as new_order
  FROM public.projects 
  WHERE (is_sub_project IS FALSE OR is_sub_project IS NULL)
)
UPDATE public.projects 
SET sort_order = main_projects_ordered.new_order
FROM main_projects_ordered
WHERE public.projects.id = main_projects_ordered.id;

-- Alt projeler için sıralama değerleri ata (parent_id'ye göre grupla)
WITH sub_projects_ordered AS (
  SELECT id, row_number() OVER (PARTITION BY parent_id ORDER BY created_at) as new_order
  FROM public.projects 
  WHERE is_sub_project = true AND parent_id IS NOT NULL
)
UPDATE public.projects 
SET sort_order = sub_projects_ordered.new_order
FROM sub_projects_ordered
WHERE public.projects.id = sub_projects_ordered.id;

-- Index ekle performans için
CREATE INDEX idx_projects_sort_order ON public.projects(sort_order);
CREATE INDEX idx_projects_parent_sort ON public.projects(parent_id, sort_order) WHERE parent_id IS NOT NULL;
