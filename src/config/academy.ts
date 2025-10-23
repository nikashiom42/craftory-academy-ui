// Craftory Academy Configuration
// All editable content for easy client updates

import lazieriLogo from "@/assets/partners/lazieri-logo.png";
import internaLogo from "@/assets/partners/interna-logo.png";
import ltbLogo from "@/assets/partners/ltb-logo.png";
import kastaLogo from "@/assets/partners/kasta-logo.png";
import woodcraftLogo from "@/assets/partners/woodcraft-logo.png";
import furnexLogo from "@/assets/partners/furnex-logo.png";

export const academyConfig = {
  // Site Meta
  siteName: "Craftory Academy",
  siteDescription: "საქართველოს პირველი ავეჯის კონსტრუირების აკადემია",
  
  // Navigation
  nav: [
    { name: "მთავარი", path: "/" },
    { name: "კურსები", path: "/courses" },
    { name: "სილაბუსი", path: "/syllabus/furniture-constructor" },
    { name: "კონტაქტი", path: "#contact" },
    { name: "რეგისტრაცია", path: "#registration" },
  ],

  // Contact Info
  contact: {
    phone: "+995 555 123 456",
    email: "info@craftoryacademy.ge",
    address: "თბილისი, საქართველო",
    workingHours: "ორშ-პარ: 10:00-19:00, შაბ: 11:00-17:00",
    social: {
      facebook: "https://facebook.com/craftoryacademy",
      instagram: "https://instagram.com/craftoryacademy",
      linkedin: "https://linkedin.com/company/craftoryacademy",
    },
  },

  // Partners
  partners: [
    { name: "Lazieri", logo: lazieriLogo },
    { name: "Interna", logo: internaLogo },
    { name: "LTB", logo: ltbLogo },
    { name: "Kasta", logo: kastaLogo },
    { name: "Woodcraft", logo: woodcraftLogo },
    { name: "Furnex", logo: furnexLogo },
  ],

  // Courses
  courses: [
    {
      id: "furniture-constructor",
      slug: "furniture-constructor",
      title: "ავეჯის კონსტრუირების კურსი",
      subtitle: "საქართველოს პირველი ავეჯის კონსტრუირების კურსი",
      description: "2 თვეში — 0-დან პროფესიონალამდე სტაჟირებით პარტნიორ კომპანიებში",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
      
      // Hero Claims
      heroClaims: [
        "ავეჯის კონსტრუირების პირველი კურსი საქართველოში",
        "2 თვეში — 0-დან პროფესიონალამდე",
        "სტაჟირება პარტნიორ კომპანიებში",
      ],

      // Cohort Info
      cohort: {
        startDate: "2025 წლის 15 იანვარი",
        duration: "2 თვე",
        sessionsCount: "24 შეხვედრა",
        format: "Online თეორია + Offline პრაქტიკა",
      },

      // Why This Course
      whyPoints: [
        {
          title: "პროფესია დიდ მოთხოვნაშია",
          description: "ავეჯის კონსტრუქტორები საქართველოში და მსოფლიოში ძალიან მოთხოვნადი სპეციალისტები არიან",
          icon: "TrendingUp",
        },
        {
          title: "კურსის ბოლოს სერთიფიკატი",
          description: "მიიღე აღიარებული სერთიფიკატი, რომელიც დაგეხმარება კარიერის დაწყებაში",
          icon: "Award",
        },
        {
          title: "სტაჟირება პარტნიორებთან",
          description: "Lazieri და Interna-ში სტაჟირების შესაძლებლობა",
          icon: "Briefcase",
        },
        {
          title: "ონლაინ + პრაქტიკული შეხვედრები",
          description: "თეორია ონლაინ, პრაქტიკა LTB-სა და Kasta-ში",
          icon: "Laptop",
        },
      ],

      // Target Audience
      targetAudience: [
        "გსურს ახალი, მაღალანაზღაურებადი პროფესია",
        "უკვე გაქვს ცოდნა და გინდა გააღრმავო (ზომები/ხარჯთაღრიცხვა/ციფრული ნახაზები)",
        "გაქვს ბიზნესი და გინდა თანამშრომლების გადამზადება",
      ],

      // Trainer Info
      trainer: {
        name: "გიგა მესხი",
        title: "კურსის ავტორი და ტრენერი",
        credentials: "Interna-ს დამფუძნებელი",
        bio: "მე ვარ გიგა, ავეჯის ინდუსტრიაში 15 წელზე მეტია ვმუშაობ. დავაარსე Interna - ერთ-ერთი წამყვანი ავეჯის კომპანია საქართველოში. ამ კურსით მინდა გადავცე ჩემი ყველა ცოდნა და გამოცდილება მომავალ თაობას.",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
      },

      // Skills
      skills: [
        "ავეჯის კონსტრუქციის საფუძვლები და ტიპები",
        "AutoCAD-ში პროფესიონალური ნახაზების შექმნა",
        "მასალების გაანგარიშება და ხარჯთაღრიცხვა",
        "3D ვიზუალიზაცია და პრეზენტაცია",
      ],

      // Syllabus Modules
      syllabus: [
        {
          module: 1,
          title: "შესავალი ავეჯის კონსტრუირებაში",
          topics: [
            "რას ვისწავლით კურსის განმავლობაში",
            "ავეჯის ტიპები და კონსტრუქციები",
            "ინდუსტრიის მიმოხილვა საქართველოში",
            "კარიერული შესაძლებლობები",
          ],
        },
        {
          module: 2,
          title: "AutoCAD საფუძვლები",
          topics: [
            "რა არის AutoCAD და რატომ გვჭირდება",
            "ინტერფეისის გაცნობა",
            "ძირითადი ბრძანებები და ხელსაწყოები",
            "ორგანზომილებიანი ნახაზების შექმნა",
          ],
        },
        {
          module: 3,
          title: "პროფესიონალური ნახაზები",
          topics: [
            "ზუსტი ზომების მიცემა",
            "Layer-ების მართვა",
            "სამუშაო ნახაზების მომზადება წარმოებისთვის",
            "ფაილების ექსპორტი და საქაღალდეების მართვა",
          ],
        },
        {
          module: 4,
          title: "მასალები და ხარჯთაღრიცხვა",
          topics: [
            "ავეჯის ძირითადი მასალები",
            "მასალების გაანგარიშების მეთოდები",
            "ხარჯთაღრიცხვის შექმნა Excel-ში",
            "ოპტიმიზაცია და ფასების გაანგარიშება",
          ],
        },
        {
          module: 5,
          title: "3D მოდელირება და ვიზუალიზაცია",
          topics: [
            "3D ნახაზების შექმნა AutoCAD-ში",
            "ვიზუალიზაციის ძირითადი პრინციპები",
            "რენდერინგი და პრეზენტაცია",
            "დასრულებული პროექტის წარდგენა",
          ],
        },
      ],
    },
  ],
};
