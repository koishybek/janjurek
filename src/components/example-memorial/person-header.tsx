import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";

type PersonHeaderProps = {
  name: string;
  years: string;
};

export function PersonHeader({ name, years }: PersonHeaderProps) {
  return (
    <header className="space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="text-muted-foreground transition-colors hover:text-gold">
              Главная
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage className="text-foreground">{name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-wrap items-baseline gap-3">
        <h1 className="font-serif text-4xl text-foreground">{name}</h1>
        <span className="text-lg text-gold/80">{years}</span>
      </div>
    </header>
  );
}
