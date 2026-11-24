import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge, EmptyState } from "@para/ui";
import { MODULES, getModule } from "@/lib/modules";

export function generateStaticParams() {
  return MODULES.filter((m) => m.slug !== "dashboard").map((m) => ({ module: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ module: string }> }): Promise<Metadata> {
  const { module } = await params;
  return { title: getModule(module)?.label ?? "Module" };
}

export default async function ModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module } = await params;
  const mod = getModule(module);
  if (!mod || mod.slug === "dashboard") notFound();
  return (
    <>
      <div className="topbar">
        <h1 className="title">{mod.label}</h1>
        <Badge>{mod.permission}</Badge>
      </div>
      <section className="card" aria-labelledby="perimetre">
        <h2 id="perimetre">Périmètre prévu</h2>
        <ul className="list">
          {mod.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </section>
      <EmptyState title="Module à implémenter">Écran non encore développé dans ce prototype.</EmptyState>
    </>
  );
}
