"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
  const t = useTranslations("newsletter");
  const [done, setDone] = useState(false);

  return (
    <section className="container py-20">
      <Reveal className="mx-auto max-w-2xl rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12">
        <h2 className="font-serif text-3xl font-semibold">{t("title")}</h2>
        <p className="mt-3 text-primary-foreground/80">{t("subtitle")}</p>

        {done ? (
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 font-medium"
          >
            {t("success")}
          </motion.p>
        ) : (
          <form
            // TODO: POST email to the backend /subscribe endpoint when ready.
            onSubmit={(e) => {
              e.preventDefault();
              setDone(true);
            }}
            className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <Input
              type="email"
              required
              placeholder={t("placeholder")}
              aria-label={t("placeholder")}
              className="bg-background text-foreground"
            />
            <Button type="submit" variant="secondary">
              {t("button")}
            </Button>
          </form>
        )}
      </Reveal>
    </section>
  );
}
