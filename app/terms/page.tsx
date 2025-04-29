import { NextPage } from "next";
import Link from "next/link";
import React from "react";

const TermsPage: NextPage = () => {
  return (
    <div className="bg-background dark:bg-background text-muted-foreground dark:text-muted-foreground py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-6 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-center text-3xl sm:text-4xl font-bold text-foreground dark:text-foreground mb-12">
            Terms of Use
          </h1>

          <p className="mb-6 text-base leading-relaxed">
            Welcome to the Herbs & Potions website, Herbs & Potions.com owned and operated by
            Herbs & Potions, LLC. Except as otherwise noted herein, these terms and
            conditions (the &quot;Terms&quot;) govern your use of the Herbs & Potions
            Website and Herbs & Potions services, applications, content and products
            (collectively, the &quot;Site&quot;). Please read the following terms
            and conditions of use, because your use of the Site constitutes your
            agreement to follow and be bound by these Terms. If you do not agree
            to these Terms, you should not access or use the Site. Herbs & Potions
            reserves the right to make changes to the Site and to these Terms from
            time to time. When we make changes, we will post them here. For this
            reason, we encourage you to review these Terms whenever you use our
            Site because by visiting the Site, you agree to accept any such
            changes. Herbs & Potions provides you with access to and use of the Site
            subject to your compliance with the Terms. No material from the Site
            may be copied, reproduced, republished, uploaded, posted, transmitted
            or distributed in any way, except as specifically permitted on the
            Site. The Site, including all of its information and content, such as
            text, data, wallpaper, icons, characters, artwork, images,
            photographs, graphics, music, sound, messages, software and the HTML
            used to generate the pages (collectively, &quot;Materials and
            Content&quot;), is Herbs & Potions property or that of our suppliers or
            licensors and is protected by patent, trademark and/or copyright under
            United States and/or foreign laws. Except as otherwise provided on the
            site or in these Terms, you may not use, download, upload, copy,
            print, display, perform, reproduce, publish, modify, delete, add to,
            license, post, transmit or distribute any Materials and Content from
            this Site in whole or in part, for any public or commercial purpose
            without the specific prior written permission of Herbs & Potions. We grant
            you a personal, limited, nonexclusive, nontransferable license to
            access the Site and to use the information and services contained here
            solely for your personal, noncommercial use as described below. We
            reserve the right, for any reason or for no reason, in our sole
            discretion and without notice to you, to revise the products and
            services described on the Site and to terminate, change, suspend or
            discontinue any aspect of the Site, including, but not limited to, the
            Materials and Content on the Site as well as features and/or hours of
            availability of the Site, and we will not be liable to you or to any
            third party for doing so. We may also impose rules for and limits on
            use of the Site or restrict your access to part, or all, of the Site
            without notice or penalty. We have the right to change these rules
            and/or limitations at any time, in our sole discretion.
          </p>

          <h2 className="text-2xl text-center sm:text-3xl font-bold text-foreground dark:text-foreground mt-10 mb-5">
            Security Rules
          </h2>

          <p className="mb-6 text-base leading-relaxed">
            Violations of system or network security may result in civil or
            criminal liability. Herbs & Potions investigates violations and may involve,
            and cooperate with, law enforcement authorities in prosecuting any
            user or users who are involved in such violations. You are prohibited
            from violating or attempting to violate the security of the Site,
            including, without limitation, the following: Accessing data not
            intended for you or logging on to a Herbs & Potions server or account that
            you are not authorized to access Attempting to probe, scan or test the
            vulnerability of a system or network or to breach security or
            authentication measures without proper authorization (or succeeding in
            such an attempt) Attempting to interfere or interfering with the
            operation of our Site, our provision of services to any other visitors
            to our Site and our hosting provider or our network, including,
            without limitation, via means of submitting a virus to the Site,
            overloading, “flooding,” “email bombing” or “crashing” the Site
            Forging any TCP/IP packet header or any part of the header information
            in any email or transmission or posting to our Site
          </p>

          <h2 className="text-2xl text-center sm:text-3xl font-bold text-foreground dark:text-foreground mt-10 mb-5">
            Disclaimers and Limitation of Liability
          </h2>

          <p className="mb-6 text-base leading-relaxed">
            Herbs & Potions publishes information on its Site as a convenience to its
            visitors. While Herbs & Potions attempts to provide accurate and timely
            information, there may be inadvertent technical or factual
            inaccuracies and typographical errors. We reserve the right to make
            corrections and changes to the Site at any time without notice. The
            Herbs & Potions products described on the Site may not be available in your
            region. Herbs & Potions does not claim that the information on the Site is
            appropriate to your jurisdiction or Cthe products described on its
            Site will be available for purchase in all jurisdictions.
          </p>

          <section className="mb-10">
              <h2 className="font-bold text-xl mb-3 text-foreground dark:text-foreground">
                 Prohibited Uses
              </h2>
              <p className="mb-6 text-base leading-relaxed">
                 You agree not to use the Site for any unlawful purpose...
              </p>
          </section>

          <section className="mt-8 text-center">
            <p>
                If you have questions, <Link href="/contact" className="text-green-500 dark:text-green-300 hover:underline font-semibold">contact us</Link>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default TermsPage;