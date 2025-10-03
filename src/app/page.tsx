import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Impressum - Klub Društvenih Igara Eliksir',
  description: 'Legal information and contact details for Klub Društvenih Igara Eliksir',
};

export default function ImpressumPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Impressum</h1>

      <div className="prose prose-lg max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Organization Information</h2>
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <p><strong>Organization Name:</strong> Klub Društvenih Igara Eliksir</p>
            <p><strong>Legal Form:</strong> Non-Profit Citizens Association</p>
            <p><strong>Registration Number:</strong> 28215096</p>
            <p><strong>Taxpayer Identification Number:</strong> 109787406</p>
            <p><strong>Registered at:</strong> Serbian Business Registrations Agency</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Address</h2>
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <p>Oblačića Rada 11<br />
            18000 Niš<br />
            Serbia</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <p><strong>Email:</strong> <a href="mailto:jovandamjanovic@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">jovandamjanovic@gmail.com</a></p>
            <p><strong>Phone:</strong> <a href="tel:+38162213581" className="text-blue-600 dark:text-blue-400 hover:underline">+381 62 213 581</a></p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Legal Representative</h2>
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <p><strong>President:</strong> Zoran Kokić</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Disclaimer</h2>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <p className="mb-4">
              Despite careful checking of content, we assume no liability for the content of external links.
              The operators of the linked pages are solely responsible for their content.
            </p>
            <p className="mb-4">
              The information on this website is provided for informational purposes only and does not
              constitute legal, financial, or professional advice.
            </p>
            <p>
              We reserve the right to make changes to the content of this website at any time without notice.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
