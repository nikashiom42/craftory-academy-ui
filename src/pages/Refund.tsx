import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { academyConfig } from "@/config/academy";

/**
 * Refund Policy page - required for Bank of Georgia payment activation
 */
export default function Refund() {
  return (
    <>
      <SEO
        title="თანხის დაბრუნების პოლიტიკა - Craftory Academy"
        description="Craftory Academy-ის თანხის დაბრუნების პირობები. გაეცანით როდის და როგორ შეგიძლიათ მოითხოვოთ თანხის დაბრუნება."
        keywords={["თანხის დაბრუნება", "რეფანდი", "Craftory Academy"]}
        canonical="/refund"
      />
      <Header />
      <div className="min-h-screen pt-32 pb-20 bg-cream">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold mb-8 text-center">თანხის დაბრუნების პოლიტიკა</h1>

            <div className="bg-white rounded-xl p-8 shadow-sm space-y-8 text-secondary">
              <p className="text-muted-foreground">
                ბოლო განახლება: {new Date().toLocaleDateString("ka-GE")}
              </p>

              <section>
                <h2 className="text-2xl font-bold mb-4">1. ზოგადი პირობები</h2>
                <p className="mb-4">
                  {academyConfig.siteName} მიზნად ისახავს მომხმარებელთა კმაყოფილებას და
                  გთავაზობთ სამართლიან თანხის დაბრუნების პოლიტიკას.
                </p>
                <p>
                  ვინაიდან ჩვენი პროდუქტი არის ციფრული სასწავლო კურსი, რომელიც მოიცავს
                  ლაივ სესიებს და ჩაწერილ მასალებზე წვდომას, თანხის დაბრუნების პირობები
                  განსხვავდება ფიზიკური პროდუქტებისგან.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">2. თანხის სრული დაბრუნება</h2>
                <p className="mb-4">
                  თქვენ შეგიძლიათ მოითხოვოთ <strong>თანხის სრული დაბრუნება</strong> შემდეგ შემთხვევებში:
                </p>
                <ul className="list-disc pl-6 space-y-3">
                  <li>
                    <strong>კურსის დაწყებამდე გაუქმება:</strong> თუ კურსის პირველი ლაივ სესიის
                    დაწყებამდე მინიმუმ 48 საათით ადრე მოითხოვთ გაუქმებას.
                  </li>
                  <li>
                    <strong>კურსის გაუქმება აკადემიის მიერ:</strong> თუ აკადემიამ გააუქმა კურსი
                    და ვერ შესთავაზა ალტერნატიული თარიღი.
                  </li>
                  <li>
                    <strong>ტექნიკური პრობლემები:</strong> თუ აკადემიის ბრალით ვერ მიიღეთ
                    წვდომა კურსის მასალებზე და პრობლემა ვერ მოგვარდა 7 დღის განმავლობაში.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">3. თანხის ნაწილობრივი დაბრუნება</h2>
                <p className="mb-4">
                  <strong>თანხის 50%-ის დაბრუნება</strong> შესაძლებელია შემდეგ შემთხვევაში:
                </p>
                <ul className="list-disc pl-6 space-y-3">
                  <li>
                    თუ მოითხოვთ გაუქმებას კურსის პირველი ლაივ სესიის შემდეგ, მაგრამ
                    მეორე სესიის დაწყებამდე.
                  </li>
                </ul>
                <p className="mt-4 text-muted-foreground">
                  შენიშვნა: ნაწილობრივი დაბრუნების შემთხვევაში თქვენ კარგავთ წვდომას
                  ყველა კურსის მასალაზე.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">4. თანხის დაბრუნება არ ხორციელდება</h2>
                <p className="mb-4">
                  თანხის დაბრუნება <strong>არ არის შესაძლებელი</strong> შემდეგ შემთხვევებში:
                </p>
                <ul className="list-disc pl-6 space-y-3">
                  <li>
                    კურსის მეორე ლაივ სესიის დაწყების შემდეგ.
                  </li>
                  <li>
                    თუ უკვე მიიღეთ წვდომა ჩაწერილ ვიდეო-გაკვეთილებზე.
                  </li>
                  <li>
                    თუ დაარღვიეთ მომსახურების წესები და პირობები (მაგ. კურსის მასალების
                    გავრცელება მესამე პირებზე).
                  </li>
                  <li>
                    თუ გაუქმების მოთხოვნა გამოწვეულია თქვენი პირადი მიზეზებით და არა
                    აკადემიის მომსახურების ხარისხით.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">5. განვადებით შეძენილი კურსები</h2>
                <p className="mb-4">
                  თუ კურსი შეძენილია განვადებით (საქართველოს ბანკის განვადება ან ნაწილ-ნაწილ):
                </p>
                <ul className="list-disc pl-6 space-y-3">
                  <li>
                    თანხის დაბრუნების მოთხოვნის შემთხვევაში, დაბრუნება განხორციელდება
                    იმავე მეთოდით, რომლითაც განხორციელდა გადახდა.
                  </li>
                  <li>
                    განვადების გაუქმების პროცესი შეიძლება მოითხოვდეს დამატებით დროს
                    ბანკთან კოორდინაციისთვის.
                  </li>
                  <li>
                    განვადების პირობები რეგულირდება საქართველოს ბანკის წესებით.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">6. თანხის დაბრუნების პროცედურა</h2>
                <p className="mb-4">თანხის დაბრუნების მოსათხოვად:</p>
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    გამოგვიგზავნეთ მოთხოვნა ელ-ფოსტაზე: <strong>{academyConfig.contact.email}</strong>
                  </li>
                  <li>
                    მიუთითეთ თქვენი სახელი, ელ-ფოსტა და შეძენილი კურსის დასახელება.
                  </li>
                  <li>
                    აღწერეთ თანხის დაბრუნების მიზეზი.
                  </li>
                  <li>
                    ჩვენ განვიხილავთ თქვენს მოთხოვნას 3 სამუშაო დღის განმავლობაში.
                  </li>
                  <li>
                    დადებითი პასუხის შემთხვევაში, თანხა დაგიბრუნდებათ იმავე საბანკო
                    ბარათზე 5-10 სამუშაო დღის განმავლობაში.
                  </li>
                </ol>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">7. კურსის გადატანა</h2>
                <p className="mb-4">
                  თანხის დაბრუნების ალტერნატივად, შეგიძლიათ მოითხოვოთ:
                </p>
                <ul className="list-disc pl-6 space-y-3">
                  <li>
                    <strong>კურსის გადატანა:</strong> სხვა თარიღის კურსზე გადასვლა
                    (თუ ხელმისაწვდომია).
                  </li>
                  <li>
                    <strong>კურსის შეცვლა:</strong> სხვა კურსზე გადასვლა ფასთა სხვაობის
                    გათვალისწინებით.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">8. საჩივრები</h2>
                <p className="mb-4">
                  თუ არ ხართ კმაყოფილი თანხის დაბრუნების გადაწყვეტილებით:
                </p>
                <ul className="list-disc pl-6 space-y-3">
                  <li>
                    შეგიძლიათ გაასაჩივროთ გადაწყვეტილება ელ-ფოსტაზე:{" "}
                    <strong>{academyConfig.contact.email}</strong>
                  </li>
                  <li>
                    საჩივარს განიხილავს მენეჯმენტი 5 სამუშაო დღის განმავლობაში.
                  </li>
                  <li>
                    ასევე შეგიძლიათ მიმართოთ მომხმარებელთა უფლებების დაცვის სამსახურს.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">9. დამატებითი ინფორმაცია</h2>
                <p className="mb-4">
                  აკადემია იტოვებს უფლებას განიხილოს თითოეული მოთხოვნა ინდივიდუალურად
                  და მიიღოს გადაწყვეტილება კონკრეტული გარემოებების გათვალისწინებით.
                </p>
                <p>
                  განსაკუთრებული შემთხვევებისთვის (ავადმყოფობა, ფორსმაჟორი) გთხოვთ
                  დაგვიკავშირდეთ - ჩვენ შევეცდებით მოვძებნოთ ორმხრივად მისაღები გამოსავალი.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">10. საკონტაქტო ინფორმაცია</h2>
                <p className="mb-4">თანხის დაბრუნებასთან დაკავშირებული კითხვებისთვის:</p>
                <ul className="space-y-2">
                  <li>
                    <strong>ტელეფონი:</strong> {academyConfig.contact.phone}
                  </li>
                  <li>
                    <strong>ელ-ფოსტა:</strong> {academyConfig.contact.email}
                  </li>
                  <li>
                    <strong>სამუშაო საათები:</strong> {academyConfig.contact.workingHours}
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
