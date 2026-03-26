import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Politique de confidentialité | Le Monde",
};

export default function ConfidentialitePage() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold font-playfair mb-8">
          Politique de confidentialité
        </h1>

        <section className="prose prose-sm max-w-none space-y-6 text-gray-700">
          <div>
            <h2 className="text-xl font-bold mb-2">Collecte des données</h2>
            <p>Nous collectons les données personnelles suivantes :</p>
            <ul>
              <li>Adresse e-mail (inscription newsletter, création de compte)</li>
              <li>Nom (optionnel, lors de la création de compte)</li>
              <li>Données de connexion (logs de sécurité)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">Utilisation des données</h2>
            <p>Vos données sont utilisées exclusivement pour :</p>
            <ul>
              <li>Vous envoyer la newsletter à laquelle vous vous êtes abonné(e)</li>
              <li>Gérer votre compte et votre accès aux contenus abonnés</li>
              <li>Améliorer nos services</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">Cookies</h2>
            <p>Ce site utilise des cookies techniques nécessaires à son fonctionnement. Vous pouvez accepter ou refuser les cookies non essentiels via le bandeau affiché lors de votre première visite.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">Vos droits (RGPD)</h2>
            <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :</p>
            <ul>
              <li>Droit d&apos;accès à vos données personnelles</li>
              <li>Droit de rectification</li>
              <li>Droit à l&apos;effacement (droit à l&apos;oubli)</li>
              <li>Droit à la portabilité</li>
              <li>Droit d&apos;opposition</li>
            </ul>
            <p>Pour exercer ces droits, contactez-nous à : privacy@monde-clone.fr</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">Conservation des données</h2>
            <p>Vos données sont conservées pendant la durée nécessaire à la fourniture du service, et au maximum 3 ans après votre dernière interaction avec le site.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">Contact</h2>
            <p>Pour toute question relative à la protection de vos données : privacy@monde-clone.fr</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
