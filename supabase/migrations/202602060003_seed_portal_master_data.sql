-- Seed master data for Al-Jamaliah portal (idempotent)
-- This patch can be applied safely multiple times.

begin;

-- Settings
insert into public.settings (key, value) values
  ('site_name_ar', 'بوابة مدينة الجمالية - الدقهلية'),
  ('site_name_en', 'Al-Jamaliah City Portal - Dakahlia'),
  ('contact_phone', '+20 50 0000000'),
  ('contact_email', 'info@aljamaliah.gov.eg'),
  ('city_population', '145000'),
  ('emergency_number', '123'),
  ('hospital_hotline', '137'),
  ('working_hours_ar', 'من الأحد إلى الخميس 9:00 ص - 3:00 م'),
  ('working_hours_en', 'Sunday to Thursday, 9:00 AM - 3:00 PM')
on conflict (key) do update set value = excluded.value;

-- News
insert into public.news (title_ar, title_en, content_ar, content_en, published)
values
  (
    'افتتاح مركز خدمة المواطنين المطور',
    'Opening of the Upgraded Citizen Service Center',
    'تم افتتاح مركز خدمة المواطنين المطور لتسريع إجراءات استخراج المستندات والخدمات الحكومية.',
    'The upgraded citizen service center has been opened to speed up government document and service procedures.',
    true
  ),
  (
    'حملة نظافة موسعة في الأحياء الرئيسية',
    'Expanded Cleanliness Campaign in Main Districts',
    'أطلقت المدينة حملة نظافة موسعة تشمل الشوارع الرئيسية والمناطق الحيوية على مدار الأسبوع.',
    'The city launched an expanded cleanliness campaign covering main streets and key areas throughout the week.',
    true
  ),
  (
    'تحديث شبكة الإنارة العامة',
    'Public Lighting Network Upgrade',
    'بدء أعمال تحديث شبكة الإنارة العامة باستخدام وحدات موفرة للطاقة في عدة قطاعات.',
    'Work has started on upgrading the public lighting network using energy-efficient units in multiple sectors.',
    true
  )
on conflict do nothing;

-- Services
insert into public.services (category, name_ar, name_en, description_ar, description_en, phone)
values
  (
    'municipal',
    'استخراج رخصة محل',
    'Business License Issuance',
    'خدمة إصدار وتجديد رخص المحال التجارية طبقًا للوائح المحلية.',
    'Service for issuing and renewing business licenses according to local regulations.',
    '+20 50 1111111'
  ),
  (
    'utilities',
    'صيانة أعطال الإنارة',
    'Lighting Fault Maintenance',
    'الإبلاغ عن أعطال أعمدة الإنارة ومتابعة الصيانة.',
    'Report public lighting faults and track maintenance.',
    '+20 50 2222222'
  ),
  (
    'social',
    'استخراج شهادة سكن',
    'Residence Certificate',
    'إصدار شهادة سكن معتمدة للمعاملات الرسمية.',
    'Issue an official residence certificate for legal transactions.',
    '+20 50 3333333'
  )
on conflict do nothing;

-- Health services
insert into public.health_services (name_ar, name_en, type, address, phone)
values
  ('مستشفى الجمالية المركزي', 'Al-Jamaliah Central Hospital', 'hospital', 'شارع المستشفى - الجمالية', '+20 50 4444444'),
  ('وحدة طب الأسرة - قبلي', 'Family Medicine Unit - Qebly', 'clinic', 'حي قبلي - الجمالية', '+20 50 5555555'),
  ('مركز إسعاف الجمالية', 'Al-Jamaliah Ambulance Center', 'emergency', 'مدخل المدينة - الطريق الرئيسي', '+20 50 6666666')
on conflict do nothing;

-- Businesses
insert into public.businesses (name_ar, name_en, category, phone)
values
  ('مخبز السلام', 'Al-Salam Bakery', 'food', '+20 50 7777001'),
  ('صيدلية المدينة', 'City Pharmacy', 'health', '+20 50 7777002'),
  ('مكتبة المعرفة', 'Knowledge Bookstore', 'education', '+20 50 7777003')
on conflict do nothing;

-- Ads
insert into public.ads (title_ar, title_en, active)
values
  ('إعلان: منافذ سلع مخفضة أسبوعية', 'Announcement: Weekly Discounted Goods Outlets', true),
  ('إعلان: تطعيمات الأطفال المجانية', 'Announcement: Free Child Vaccination Campaign', true),
  ('إعلان: فرص تدريب للشباب', 'Announcement: Youth Training Opportunities', true)
on conflict do nothing;

commit;
