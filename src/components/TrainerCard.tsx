import { motion } from "framer-motion";

interface Trainer {
  name: string;
  title: string;
  credentials: string;
  bio: string;
  image: string;
}

interface TrainerCardProps {
  trainer: Trainer;
}

export function TrainerCard({ trainer }: TrainerCardProps) {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div className="order-2 md:order-1">
              <img
                src={trainer.image}
                alt={trainer.name}
                className="rounded-2xl shadow-elevated w-full aspect-square object-cover"
              />
            </div>

            <div className="order-1 md:order-2 space-y-6">
              <div>
                <p className="text-sm uppercase text-muted-foreground mb-2 font-heading">
                  {trainer.title}
                </p>
                <h2 className="text-4xl font-bold mb-2">{trainer.name}</h2>
                <p className="text-xl text-accent font-semibold">{trainer.credentials}</p>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed">{trainer.bio}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
