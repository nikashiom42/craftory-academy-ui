import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { academyConfig } from "@/config/academy";

/**
 * Privacy Policy page - required for Bank of Georgia payment activation
 */
export default function Privacy() {
  return (
    <>
      <SEO
        title="კონფიდენციალურობის პოლიტიკა - Craftory Academy"
        description="Craftory Academy-ის კონფიდენციალურობის პოლიტიკა. გაეცანით როგორ ვიცავთ თქვენს პერსონალურ მონაცემებს."
        keywords={["კონფიდენციალურობა", "პერსონალური მონაცემები", "Craftory Academy"]}
        canonical="/privacy"
      />
      <Header />
      <div className="min-h-screen pt-32 pb-20 bg-cream">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold mb-8 text-center">კონფიდენციალურობის პოლიტიკა</h1>

            <div className="bg-white rounded-xl p-8 shadow-sm space-y-8 text-secondary">
              <p className="text-muted-foreground">
                ბოლო განახლება: {new Date().toLocaleDateString("ka-GE")}
              </p>

              <section>
                <h2 className="text-2xl font-bold mb-4">1. შესავალი</h2>
                <p className="mb-4">
                  {academyConfig.siteName} პატივს სცემს თქვენს კონფიდენციალურობას და
                  ვალდებულია დაიცვას თქვენი პერსონალური მონაცემები.
                </p>
                <p>
                  წინამდებარე კონფიდენციალურობის პოლიტიკა აღწერს რა ინფორმაციას ვაგროვებთ,
                  როგორ ვიყენებთ მას და რა უფლებები გაქვთ თქვენი მონაცემების მიმართ.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">2. რა მონაცემებს ვაგროვებთ</h2>
                <p className="mb-4">ჩვენ ვაგროვებთ შემდეგ ინფორმაციას:</p>

                <h3 className="text-xl font-semibold mb-2">2.1 პირდაპირ მოწოდებული ინფორმაცია:</h3>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>სახელი და გვარი</li>
                  <li>ელექტრონული ფოსტის მისამართი</li>
                  <li>ტელეფონის ნომერი</li>
                  <li>გადახდის ინფორმაცია (მუშავდება საქართველოს ბანკის მიერ)</li>
                </ul>

                <h3 className="text-xl font-semibold mb-2">2.2 ავტომატურად შეგროვებული ინფორმაცია:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>IP მისამართი</li>
                  <li>ბრაუზერის ტიპი</li>
                  <li>მოწყობილობის ინფორმაცია</li>
                  <li>ვებგვერდზე ნავიგაციის მონაცემები</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">3. მონაცემების გამოყენება</h2>
                <p className="mb-4">თქვენს მონაცემებს ვიყენებთ შემდეგი მიზნებისთვის:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>თქვენი ანგარიშის შექმნა და მართვა</li>
                  <li>შეძენილ კურსებზე წვდომის უზრუნველყოფა</li>
                  <li>ლაივ სესიების Google Meet ლინკების გაგზავნა</li>
                  <li>გადახდების დამუშავება</li>
                  <li>კურსის განახლებებისა და შეთავაზებების შესახებ ინფორმირება</li>
                  <li>მომხმარებელთა მხარდაჭერა</li>
                  <li>პლატფორმის გაუმჯობესება</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">4. გადახდის მონაცემების დაცვა</h2>
                <p className="mb-4">
                  გადახდის პროცესი ხორციელდება საქართველოს ბანკის iPay უსაფრთხო სისტემის მეშვეობით.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    ჩვენ არ ვინახავთ თქვენი საბანკო ბარათის სრულ მონაცემებს.
                  </li>
                  <li>
                    გადახდის ოპერაციები დაშიფრულია SSL/TLS პროტოკოლით.
                  </li>
                  <li>
                    საქართველოს ბანკი შეესაბამება PCI DSS უსაფრთხოების სტანდარტებს.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">5. მონაცემების გაზიარება</h2>
                <p className="mb-4">
                  ჩვენ არ ვყიდით და არ ვაქირავებთ თქვენს პერსონალურ მონაცემებს მესამე პირებზე.
                </p>
                <p className="mb-4">მონაცემები შეიძლება გაზიარდეს მხოლოდ:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>გადახდის სერვისებთან:</strong> საქართველოს ბანკი - გადახდების დასამუშავებლად.
                  </li>
                  <li>
                    <strong>Google Meet:</strong> ლაივ სესიების ჩასატარებლად.
                  </li>
                  <li>
                    <strong>კანონის მოთხოვნით:</strong> სამართალდამცავი ორგანოების კანონიერი მოთხოვნის შემთხვევაში.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">6. მონაცემების შენახვა</h2>
                <p className="mb-4">
                  თქვენს პერსონალურ მონაცემებს ვინახავთ იმ პერიოდის განმავლობაში,
                  რამდენიც საჭიროა მომსახურების გასაწევად.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>ანგარიშის მონაცემები: სანამ ანგარიში აქტიურია.</li>
                  <li>გადახდის ჩანაწერები: საქართველოს კანონმდებლობით გათვალისწინებული ვადით.</li>
                  <li>კურსზე წვდომის ჩანაწერები: კურსის დასრულებიდან 2 თვის განმავლობაში.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">7. თქვენი უფლებები</h2>
                <p className="mb-4">თქვენ გაქვთ უფლება:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>მოითხოვოთ თქვენს შესახებ შენახული მონაცემების ასლი.</li>
                  <li>მოითხოვოთ არასწორი მონაცემების შესწორება.</li>
                  <li>მოითხოვოთ მონაცემების წაშლა (კანონით გათვალისწინებულ ფარგლებში).</li>
                  <li>უარი თქვათ მარკეტინგულ კომუნიკაციებზე.</li>
                  <li>შეიტანოთ საჩივარი პერსონალურ მონაცემთა დაცვის სამსახურში.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">8. Cookie ფაილები</h2>
                <p className="mb-4">
                  ჩვენი ვებგვერდი იყენებს Cookie ფაილებს მომხმარებლის გამოცდილების გასაუმჯობესებლად.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>აუცილებელი Cookie:</strong> საჭიროა ვებგვერდის ფუნქციონირებისთვის.
                  </li>
                  <li>
                    <strong>ანალიტიკური Cookie:</strong> გვეხმარება გავიგოთ როგორ იყენებენ ვიზიტორები ვებგვერდს.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">9. არასრულწლოვანთა დაცვა</h2>
                <p>
                  ჩვენი სერვისები განკუთვნილია 18 წლის და უფროსი ასაკის პირებისთვის.
                  ჩვენ შეგნებულად არ ვაგროვებთ არასრულწლოვანთა პერსონალურ მონაცემებს.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">10. უსაფრთხოება</h2>
                <p className="mb-4">
                  ჩვენ ვიყენებთ ტექნიკურ და ორგანიზაციულ ზომებს თქვენი მონაცემების დასაცავად:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>SSL/TLS დაშიფვრა მონაცემთა გადაცემისას.</li>
                  <li>უსაფრთხო სერვერები და მონაცემთა ბაზები.</li>
                  <li>წვდომის კონტროლი თანამშრომლებისთვის.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">11. ცვლილებები პოლიტიკაში</h2>
                <p>
                  ჩვენ შეგვიძლია პერიოდულად განვაახლოთ ეს პოლიტიკა. მნიშვნელოვანი ცვლილებების შესახებ
                  შეგატყობინებთ ელ-ფოსტით ან ვებგვერდზე განთავსებული შეტყობინებით.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">12. საკონტაქტო ინფორმაცია</h2>
                <p className="mb-4">
                  კონფიდენციალურობასთან დაკავშირებული კითხვებისთვის დაგვიკავშირდით:
                </p>
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
