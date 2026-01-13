import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { academyConfig } from "@/config/academy";

/**
 * Terms of Service page - required for Bank of Georgia payment activation
 */
export default function Terms() {
  return (
    <>
      <SEO
        title="წესები და პირობები - Craftory Academy"
        description="Craftory Academy-ის მომსახურების წესები და პირობები. გაეცანით ონლაინ კურსების შეძენის, გამოყენების და გაუქმების პირობებს."
        keywords={["წესები და პირობები", "Craftory Academy", "სერვისის პირობები"]}
        canonical="/terms"
      />
      <Header />
      <div className="min-h-screen pt-32 pb-20 bg-cream">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold mb-8 text-center">წესები და პირობები</h1>

            <div className="bg-white rounded-xl p-8 shadow-sm space-y-8 text-secondary">
              <p className="text-muted-foreground">
                ბოლო განახლება: {new Date().toLocaleDateString("ka-GE")}
              </p>

              <section>
                <h2 className="text-2xl font-bold mb-4">1. ზოგადი დებულებები</h2>
                <p className="mb-4">
                  წინამდებარე წესები და პირობები არეგულირებს {academyConfig.siteName}-ის ვებგვერდის
                  (შემდგომში "პლატფორმა") გამოყენებას და ონლაინ კურსების შეძენას.
                </p>
                <p className="mb-4">
                  პლატფორმაზე რეგისტრაციით ან კურსის შეძენით თქვენ ეთანხმებით წინამდებარე წესებსა და პირობებს.
                </p>
                <p>
                  {academyConfig.siteName} იტოვებს უფლებას ნებისმიერ დროს შეცვალოს აღნიშნული წესები და პირობები.
                  ცვლილებები ძალაში შედის ვებგვერდზე გამოქვეყნებისთანავე.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">2. მომსახურების აღწერა</h2>
                <p className="mb-4">
                  {academyConfig.siteName} გთავაზობთ ონლაინ სასწავლო კურსებს,
                  რომლებიც მოიცავს:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>ლაივ სესიები:</strong> რეალურ დროში ჩატარებული ონლაინ გაკვეთილები Google Meet-ის
                    მეშვეობით, სადაც მოსწავლეებს შესაძლებლობა აქვთ უშუალოდ დაუსვან კითხვები ლექტორს.
                  </li>
                  <li>
                    <strong>ჩაწერილი მასალა:</strong> კურსის დასრულების შემდეგ მოსწავლეები იღებენ წვდომას
                    ჩაწერილ ვიდეო-გაკვეთილებზე 2 თვის განმავლობაში.
                  </li>
                  <li>
                    <strong>სასწავლო მასალები:</strong> დამხმარე დოკუმენტაცია და რესურსები.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">3. რეგისტრაცია და ანგარიში</h2>
                <p className="mb-4">კურსის შესაძენად აუცილებელია პლატფორმაზე რეგისტრაცია.</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>თქვენ ვალდებული ხართ მიუთითოთ სწორი და აქტუალური ინფორმაცია.</li>
                  <li>თქვენ პასუხისმგებელი ხართ თქვენი ანგარიშის უსაფრთხოებაზე და პაროლის დაცვაზე.</li>
                  <li>ანგარიშის გადაცემა მესამე პირებზე აკრძალულია.</li>
                  <li>
                    აკადემია იტოვებს უფლებას დაბლოკოს ანგარიში წესების დარღვევის შემთხვევაში.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">4. კურსის შეძენა და გადახდა</h2>
                <p className="mb-4">კურსის ფასი მითითებულია ლარებში (GEL) და მოიცავს დღგ-ს.</p>
                <p className="mb-4">გადახდის მეთოდები:</p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>
                    <strong>სრული გადახდა:</strong> საბანკო ბარათით ერთჯერადი გადახდა.
                  </li>
                  <li>
                    <strong>განვადება:</strong> საქართველოს ბანკის მეშვეობით 6-24 თვიანი განვადება
                    (მინიმალური თანხა: 100 ლარი).
                  </li>
                  <li>
                    <strong>ნაწილ-ნაწილ:</strong> 4 თვიანი უპროცენტო განვადება
                    (მინიმალური თანხა: 45 ლარი).
                  </li>
                </ul>
                <p className="mb-4">
                  გადახდა ხორციელდება უსაფრთხო გადახდის სისტემით - საქართველოს ბანკის iPay-ის მეშვეობით.
                </p>
                <p>
                  კურსზე წვდომა გააქტიურდება გადახდის დადასტურების შემდეგ ავტომატურად.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">5. კურსზე წვდომა</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    კურსის შეძენის შემდეგ თქვენ მიიღებთ წვდომას Google Meet-ის ლინკზე ლაივ სესიებისთვის.
                  </li>
                  <li>
                    ლაივ სესიების ჩაწერილი ვერსიები ხელმისაწვდომი გახდება კურსის დასრულების შემდეგ.
                  </li>
                  <li>
                    ჩაწერილ მასალებზე წვდომა მოქმედებს კურსის დასრულებიდან 2 თვის განმავლობაში.
                  </li>
                  <li>
                    კურსის მასალების გადაცემა, კოპირება ან გავრცელება მესამე პირებზე აკრძალულია.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">6. ინტელექტუალური საკუთრება</h2>
                <p className="mb-4">
                  პლატფორმაზე განთავსებული ყველა მასალა, მათ შორის ვიდეო-გაკვეთილები, ტექსტები
                  და გრაფიკული მასალები, წარმოადგენს {academyConfig.siteName}-ის ინტელექტუალურ საკუთრებას.
                </p>
                <p>
                  აკრძალულია მასალების კოპირება, გავრცელება, გაყიდვა ან კომერციული მიზნებისთვის გამოყენება
                  აკადემიის წერილობითი თანხმობის გარეშე.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">7. მომხმარებლის ვალდებულებები</h2>
                <p className="mb-4">მომხმარებელი ვალდებულია:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>გამოიყენოს პლატფორმა კანონიერი მიზნებისთვის.</li>
                  <li>არ გაავრცელოს კურსის მასალები მესამე პირებზე.</li>
                  <li>არ ჩაწეროს ლაივ სესიები აკადემიის ნებართვის გარეშე.</li>
                  <li>პატივი სცეს სხვა მოსწავლეებს და ლექტორებს.</li>
                  <li>არ განახორციელოს არაკანონიერი ან არაეთიკური ქმედებები პლატფორმაზე.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">8. პასუხისმგებლობის შეზღუდვა</h2>
                <p className="mb-4">
                  {academyConfig.siteName} არ არის პასუხისმგებელი:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>ტექნიკური პრობლემების გამო გამოწვეულ დროებით შეფერხებებზე.</li>
                  <li>მომხმარებლის ინტერნეტ-კავშირის ხარისხზე.</li>
                  <li>
                    არასწორად მითითებული საკონტაქტო ინფორმაციის გამო გამოწვეულ პრობლემებზე.
                  </li>
                  <li>
                    კურსის დასრულების შემდეგ მომხმარებლის პროფესიულ შედეგებზე.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">9. დავების გადაწყვეტა</h2>
                <p className="mb-4">
                  ნებისმიერი დავა მხარეებს შორის განიხილება მოლაპარაკების გზით.
                </p>
                <p>
                  შეუთანხმებლობის შემთხვევაში დავა განიხილება საქართველოს კანონმდებლობის შესაბამისად,
                  საქართველოს სასამართლოში.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">10. საკონტაქტო ინფორმაცია</h2>
                <p className="mb-4">კითხვების შემთხვევაში დაგვიკავშირდით:</p>
                <ul className="space-y-2">
                  <li>
                    <strong>ტელეფონი:</strong> {academyConfig.contact.phone}
                  </li>
                  <li>
                    <strong>ელ-ფოსტა:</strong> {academyConfig.contact.email}
                  </li>
                  <li>
                    <strong>მისამართი:</strong> {academyConfig.contact.address}
                  </li>
                </ul>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
