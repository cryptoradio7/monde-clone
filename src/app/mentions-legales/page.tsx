import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Mentions légales | Le Monde",
};

export default function MentionsLegalesPage() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold font-playfair mb-8">Mentions légales</h1>

        <section className="prose prose-sm max-w-none space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-2">Éditeur</h2>
            <p>Le Monde Clone est un projet éducatif développé par AgileVizion.</p>
            <p>Adresse : Luxembourg</p>
            <p>Email : contact@monde-clone.fr</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">Hébergement</h2>
            <p>Ce site est hébergé par Vercel Inc., 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">Propriété intellectuelle</h2>
            <p>Le contenu de ce site est fourni à titre d&apos;exemple uniquement. Tous les articles présentés sont des contenus fictifs créés à des fins de démonstration.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">Limitation de responsabilité</h2>
            <p>L&apos;éditeur s&apos;efforce de fournir des informations exactes et à jour. Cependant, il ne saurait garantir l&apos;exactitude, la complétude et l&apos;actualité des informations diffusées sur ce site.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
