import { getTranslations } from "next-intl/server";
import { CreditCard, Headset, MessageCircle, Truck } from "lucide-react";

const ITEMS = [
  { k: "feat1", Icon: Truck },
  { k: "feat2", Icon: Headset },
  { k: "feat3", Icon: MessageCircle },
  { k: "feat4", Icon: CreditCard },
] as const;

export async function Benefits() {
  const t = await getTranslations("site");
  return (
    <section className="container">
      <div className="grid grid-cols-2 gap-6 rounded-2xl border border-border bg-card/70 px-6 py-6 lg:grid-cols-4">
        {ITEMS.map(({ k, Icon }) => (
          <div key={k} className="flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Icon className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold leading-tight">{t(k)}</p>
              <p className="text-xs text-muted-foreground">{t(`${k}d`)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
