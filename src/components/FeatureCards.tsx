import { motion } from "framer-motion";
import { LucideIcon, Users, Award, Briefcase, TrendingUp, BookOpen, CheckCircle } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Users,
    title: "ექსპერტი ინსტრუქტორები",
    description: "სწავლა ინდუსტრიის გამოცდილი პროფესიონალებისგან პრაქტიკული მიდგომით",
  },
  {
    icon: Award,
    title: "აღიარებული სერთიფიკატი",
    description: "მიიღე საერთაშორისო სტანდარტების სერთიფიკატი კურსის დასრულების შემდეგ",
  },
  {
    icon: Briefcase,
    title: "გარანტირებული სტაჟირება",
    description: "სტაჟირება წამყვან კომპანიებში - Lazieri, Interna, LTB, Kasta",
  },
  {
    icon: TrendingUp,
    title: "კარიერული მხარდაჭერა",
    description: "დახმარება სამსახურის მოძიებასა და კარიერის განვითარებაში",
  },
  {
    icon: BookOpen,
    title: "თანამედროვე პროგრამა",
    description: "განახლებული სასწავლო პროგრამა ინდუსტრიის მოთხოვნების შესაბამისად",
  },
  {
    icon: CheckCircle,
    title: "ფლექსიბილი გრაფიკი",
    description: "Online თეორია და Offline პრაქტიკა შენთვის მოსახერხებელ დროს",
  },
];

export function FeatureCards() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold uppercase mb-4">
            რატომ Craftory Academy?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            ყველაფერი, რაც გჭირდება წარმატებული კარიერის დასაწყებად
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border border-border rounded-xl p-6 shadow-soft hover-lift group"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="text-primary" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
