import { motion } from "framer-motion";
import { CreditCard, CheckCircle2 } from "lucide-react";
import logoFrame from "@/assets/logo_frame.svg";

/**
 * PaymentMethodsSection - Displays available payment methods
 * Simple overview of accepted payment options
 */
export function PaymentMethodsSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Section Header */}
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold uppercase mb-2">
              გადახდის მეთოდები
            </h2>
          </div>

          {/* Payment Methods Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Georgian Bank Installment */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-background border border-border rounded-xl p-6 shadow-sm"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                {/* Bank Logo */}
                <div className="w-20 h-20 flex items-center justify-center bg-white rounded-lg shadow-sm p-3">
                  <img 
                    src={logoFrame} 
                    alt="საქართველოს ბანკი" 
                    className="w-full h-full object-contain"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2">
                    საქართველოს ბანკის განვადება
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    განვადებით გადახდის შესაძლებლობა
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Standard Payment */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-background border border-border rounded-xl p-6 shadow-sm"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                {/* Payment Icon */}
                <div className="w-20 h-20 flex items-center justify-center bg-muted/50 rounded-lg">
                  <CreditCard className="w-10 h-10 text-accent" />
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2">
                    სხვა გადახდის მეთოდები
                  </h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-accent flex-shrink-0" />
                      <span>ბარათით გადახდა</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-accent flex-shrink-0" />
                      <span>უნაღდო გადარიცხვა</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-accent flex-shrink-0" />
                      <span>ნაღდი ანგარიშსწორება</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

