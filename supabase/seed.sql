-- Seed data for Craftory Academy courses
-- This script populates the database with demo courses

-- Clear existing courses (optional, comment out if you want to keep existing data)
-- TRUNCATE courses CASCADE;

-- Insert Furniture Constructor Course
INSERT INTO courses (
  slug,
  title,
  subtitle,
  description,
  image_url,
  duration,
  participant_number,
  start_date,
  end_date,
  published,
  hero_claims,
  cohort,
  skills,
  syllabus,
  target_audience,
  trainer,
  google_meet_link,
  google_drive_link
) VALUES (
  'furniture-constructor',
  'ავეჯის კონსტრუირების კურსი',
  'საქართველოს პირველი ავეჯის კონსტრუირების კურსი',
  '2 თვეში — 0-დან პროფესიონალამდე სტაჟირებით პარტნიორ კომპანიებში',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
  '2 თვე',
  20,
  '2025-01-15',
  '2025-03-15',
  true,
  jsonb_build_array(
    'ავეჯის კონსტრუირების პირველი კურსი საქართველოში',
    '2 თვეში - 0-დან პროფესიონალამდე',
    'სტაჟირება პარტნიორ კომპანიებში'
  ),
  jsonb_build_object(
    'startDate', '2025 წლის 15 იანვარი',
    'duration', '2 თვე',
    'sessionsCount', '24 შეხვედრა',
    'format', 'Online თეორია + Offline პრაქტიკა'
  ),
  jsonb_build_array(
    'ავეჯის კონსტრუქციის საფუძვლები და ტიპები',
    'AutoCAD-ში პროფესიონალური ნახაზების შექმნა',
    'მასალების გაანგარიშება და ხარჯთაღრიცხვა',
    '3D ვიზუალიზაცია და პრეზენტაცია'
  ),
  jsonb_build_array(
    jsonb_build_object(
      'module', 1,
      'title', 'შესავალი ავეჯის კონსტრუირებაში',
      'topics', jsonb_build_array(
        'რას ვისწავლით კურსზე',
        'ავეჯის ტიპები და კონსტრუქციები',
        'ინდუსტრიის მიმოხილვა საქართველოში',
        'კარიერული შესაძლებლობები'
      )
    ),
    jsonb_build_object(
      'module', 2,
      'title', 'AutoCAD საფუძვლები',
      'topics', jsonb_build_array(
        'რა არის AutoCAD',
        'ინტერფეისის გაცნობა',
        'ძირითადი ბრძანებები და ხელსაწყოები',
        'ორგანზომილებიანი ნახაზების შექმნა'
      )
    ),
    jsonb_build_object(
      'module', 3,
      'title', 'პროფესიონალური ნახაზები',
      'topics', jsonb_build_array(
        'ზუსტი ზომების მიცემა',
        'Layer-ების მართვა',
        'სამუშაო ნახაზების მომზადება წარმოებისთვის',
        'ფაილების ექსპორტი და საქაღალდეების მართვა'
      )
    ),
    jsonb_build_object(
      'module', 4,
      'title', 'მასალები და ხარჯთაღრიცხვა',
      'topics', jsonb_build_array(
        'ავეჯის ძირითადი მასალები',
        'მასალების გაანგარიშების მეთოდები',
        'ხარჯთაღრიცხვის შექმნა Excel-ში',
        'ოპტიმიზაცია და ფასების გაანგარიშება'
      )
    ),
    jsonb_build_object(
      'module', 5,
      'title', '3D მოდელირება და ვიზუალიზაცია',
      'topics', jsonb_build_array(
        '3D ნახაზების შექმნა AutoCAD-ში',
        'ვიზუალიზაციის ძირითადი პრინციპები',
        'რენდერინგი და პრეზენტაცია',
        'დასრულებული პროექტის წარდგენა'
      )
    )
  ),
  jsonb_build_array(
    'გსურს დაეუფლო ახალ, მაღალანაზღაურებად პროფესიას',
    'უკვე გაქვს გარკვეული ცოდნა, თუმცა გსურს, რომ გაიღრმავო და ისწავლო დეტალურად როგორ გაზომო სწორად, გააკეთო ხარჯთაღრიცხვა და გააციფრულო ნახაზები',
    'გაქვს ავეჯის ბიზნესი და გსურს თანამშრომლებს გაატარო პროფესიული კურსი'
  ),
  jsonb_build_object(
    'name', 'გიგა მესხი',
    'title', 'კურსის ავტორი და ტრენერი',
    'credentials', 'Interna-ს დამფუძნებელი',
    'bio', 'მე ვარ გიგა, ავეჯის ინდუსტრიაში 15 წელზე მეტია ვმუშაობ. დავაარსე Interna - ერთ-ერთი წამყვანი ავეჯის კომპანია საქართველოში. ამ კურსით მინდა გადავცე ჩემი ყველა ცოდნა და გამოცდილება მომავალ თაობას.',
    'image', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop'
  ),
  'https://meet.google.com/abc-defg-hij',
  'https://drive.google.com/drive/folders/example'
);

-- Insert Interior Design Course
INSERT INTO courses (
  slug,
  title,
  subtitle,
  description,
  image_url,
  duration,
  participant_number,
  start_date,
  end_date,
  published,
  hero_claims,
  cohort,
  skills,
  syllabus,
  target_audience,
  trainer,
  google_meet_link,
  google_drive_link
) VALUES (
  'interior-design',
  'ინტერიერის დიზაინის კურსი',
  'შექმენი უნიკალური სივრცეები',
  '3 თვე - ინტერიერის დიზაინის სრული კურსი პრაქტიკული პროექტებით',
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=600&fit=crop',
  '3 თვე',
  15,
  '2025-02-01',
  '2025-04-30',
  true,
  jsonb_build_array(
    'სრული ინტერიერის დიზაინის კურსი',
    '3 თვე ინტენსიური სწავლება',
    'რეალურ პროექტებზე მუშაობა'
  ),
  jsonb_build_object(
    'startDate', '2025 წლის 1 თებერვალი',
    'duration', '3 თვე',
    'sessionsCount', '36 შეხვედრა',
    'format', 'Online + Offline სამუშაოები'
  ),
  jsonb_build_array(
    'სივრცის დაგეგმარება და ფუნქციონალური ზონირება',
    'ფერების თეორია და სტილების შერჩევა',
    'SketchUp და 3ds Max-ში მუშაობა',
    'პრეზენტაციის მომზადება კლიენტისთვის'
  ),
  jsonb_build_array(
    jsonb_build_object(
      'module', 1,
      'title', 'ინტერიერის დიზაინის საფუძვლები',
      'topics', jsonb_build_array(
        'დიზაინის ძირითადი პრინციპები',
        'სივრცის აღქმა და დაგეგმარება',
        'ფუნქციონალური ზონირება',
        'ერგონომიკის საფუძვლები'
      )
    ),
    jsonb_build_object(
      'module', 2,
      'title', 'ფერები და მასალები',
      'topics', jsonb_build_array(
        'ფერთა თეორია და ფსიქოლოგია',
        'მასალების შერჩევა და კომბინაცია',
        'ტექსტურები და პატერნები',
        'განათების დიზაინი'
      )
    ),
    jsonb_build_object(
      'module', 3,
      'title', '3D მოდელირება',
      'topics', jsonb_build_array(
        'SketchUp საფუძვლები',
        '3D მოდელების შექმნა',
        'რენდერინგი და ვიზუალიზაცია',
        'პრეზენტაციის მომზადება'
      )
    )
  ),
  jsonb_build_array(
    'გაინტერესებს ინტერიერის დიზაინი და გსურს პროფესიონალი გახდე',
    'გაქვს საკუთარი ბიზნესი და გინდა უნარების გაუმჯობესება',
    'ეძებ კრეატიულ და მაღალანაზღაურებად პროფესიას'
  ),
  jsonb_build_object(
    'name', 'ანა ბერიძე',
    'title', 'კურსის ავტორი და ტრენერი',
    'credentials', '10+ წლის გამოცდილება ინტერიერის დიზაინში',
    'bio', 'მე ვარ ანა, ინტერიერის დიზაინით 10 წელზე მეტია ვმუშაობ. დავამთავრე პროექტები როგორც საქართველოში, ასევე საზღვარგარეთ. ჩემი მიზანია გადავცე ცოდნა და გამოცდილება, რათა დავეხმარო სტუდენტებს გახდნენ წარმატებული დიზაინერები.',
    'image', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop'
  ),
  NULL,
  NULL
);

-- Insert Wood Carving Course
INSERT INTO courses (
  slug,
  title,
  subtitle,
  description,
  image_url,
  duration,
  participant_number,
  start_date,
  end_date,
  published,
  hero_claims,
  cohort,
  skills,
  syllabus,
  target_audience,
  trainer,
  google_meet_link,
  google_drive_link
) VALUES (
  'wood-carving',
  'ხის კვეთის ხელოსნობის კურსი',
  'შეისწავლე ტრადიციული და თანამედროვე ტექნიკები',
  '2.5 თვე - პრაქტიკული კურსი ხის დამუშავებისა და კვეთის ხელოსნობაში',
  'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&h=600&fit=crop',
  '2.5 თვე',
  12,
  '2025-01-20',
  '2025-04-05',
  false,
  jsonb_build_array(
    'ხელით მუშაობის უძველესი ხელოსნობა',
    '2.5 თვე ინტენსიური პრაქტიკა',
    'საკუთარი პროექტების შექმნა'
  ),
  jsonb_build_object(
    'startDate', '2025 წლის 20 იანვარი',
    'duration', '2.5 თვე',
    'sessionsCount', '30 შეხვედრა',
    'format', 'Offline პრაქტიკული შეხვედრები'
  ),
  jsonb_build_array(
    'ხის დამუშავების ძირითადი ტექნიკები',
    'კვეთის ხელსაწყოების გამოყენება',
    'სხვადასხვა სტილის ორნამენტების შექმნა',
    'საკუთარი პროდუქტების დამზადება'
  ),
  jsonb_build_array(
    jsonb_build_object(
      'module', 1,
      'title', 'ხის კვეთის საფუძვლები',
      'topics', jsonb_build_array(
        'ხის ტიპები და მათი თავისებურებები',
        'ძირითადი ხელსაწყოები და მათი გამოყენება',
        'უსაფრთხოების წესები',
        'საწყისი ტექნიკები'
      )
    ),
    jsonb_build_object(
      'module', 2,
      'title', 'ტრადიციული ორნამენტები',
      'topics', jsonb_build_array(
        'ქართული ორნამენტების შესწავლა',
        'გეომეტრიული ნიმუშები',
        'ფლორალური მოტივები',
        'პრაქტიკული სამუშაოები'
      )
    ),
    jsonb_build_object(
      'module', 3,
      'title', 'თანამედროვე ტექნიკები',
      'topics', jsonb_build_array(
        'მინიმალისტური დიზაინი',
        '3D ეფექტები',
        'ელექტრო ხელსაწყოების გამოყენება',
        'საბოლოო დამუშავება და დაცვა'
      )
    )
  ),
  jsonb_build_array(
    'გაინტერესებს ხელოსნობა და ხელით მუშაობა',
    'გსურს ახალი, კრეატიული უნარის შეძენა',
    'გაქვს მცირე ბიზნესის იდეა ხელნაკეთი ნივთების გაყიდვაზე'
  ),
  jsonb_build_object(
    'name', 'ლევან ქართველიშვილი',
    'title', 'კურსის ავტორი და ტრენერი',
    'credentials', '20+ წლის გამოცდილება ხის დამუშავებაში',
    'bio', 'მე ვარ ლევან, ხის დამუშავებისა და კვეთის ხელოსნობით 20 წელზე მეტია ვმუშაობ. ჩემი ნამუშევრები წარმოდგენილია როგორც საქართველოში, ასევე საზღვარგარეთ. კურსით მინდა გადავცე ტრადიციული ხელოსნობის უნარები ახალ თაობას.',
    'image', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'
  ),
  NULL,
  NULL
);
