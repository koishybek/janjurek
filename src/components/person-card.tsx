"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Person } from "@data/people";
import { Calendar, MapPin, User } from "lucide-react";

type PersonCardProps = {
  person: Person;
};

export function PersonCard({ person }: PersonCardProps) {
  const fullName = [person.firstName, person.patronymic].filter(Boolean).join(" ");
  const initials = `${person.firstName.at(0) ?? ""}${person.lastName.at(0) ?? ""}`.toUpperCase();
  const avatarSrc = person.media?.photos?.[0]?.src;

  return (
    <Card className="rounded-2xl surface shadow-none">
      <CardHeader className="flex flex-col gap-6 p-8 sm:flex-row sm:items-start">
        <Avatar className="h-28 w-28 shrink-0 border border-gold/30 grayscale">
          {avatarSrc ? <AvatarImage src={avatarSrc} alt={`Портрет: ${fullName || person.lastName}`} /> : null}
          <AvatarFallback className="bg-white/[0.04] text-2xl font-semibold text-gold">{initials || "?"}</AvatarFallback>
        </Avatar>
        <div className="space-y-3">
          <CardTitle className="font-serif text-3xl leading-tight text-foreground sm:text-4xl">
            {[person.lastName, fullName].filter(Boolean).join(" ")}
          </CardTitle>
          <CardDescription className="flex flex-wrap items-center gap-x-5 gap-y-2 text-base text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gold/80" aria-hidden />
              {person.years ?? "Годы неизвестны"}
            </span>
            {person.mainOccupation ? (
              <span className="inline-flex items-center gap-2">
                <User className="h-4 w-4 text-gold/80" aria-hidden />
                {person.mainOccupation}
              </span>
            ) : null}
            {person.birthPlace ? (
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gold/80" aria-hidden />
                {person.birthPlace}
              </span>
            ) : null}
          </CardDescription>
      {person.extraInfo ? (
        <p className="max-w-2xl text-[15px] leading-8 text-muted-foreground sm:text-base">{person.extraInfo}</p>
      ) : null}
    </div>
  </CardHeader>
  <CardContent className="flex flex-wrap gap-3 px-8 pb-8 text-sm text-muted-foreground">
    {person.zhuz ? <BadgeLine label="Жуз" value={person.zhuz} /> : null}
    {person.rod ? <BadgeLine label="Род" value={person.rod} /> : null}
    {person.plemya ? <BadgeLine label="Племя" value={person.plemya} /> : null}
    {person.rod2 ? <BadgeLine label="Род 2" value={person.rod2} /> : null}
    {person.rod3 ? <BadgeLine label="Род 3" value={person.rod3} /> : null}
  </CardContent>
</Card>
  );
}

type BadgeLineProps = {
  label: string;
  value: string;
};

function BadgeLine({ label, value }: BadgeLineProps) {
  return (
    <span className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-sm text-foreground/80">
      <span className="font-medium text-gold/80">{label}:</span> {value}
    </span>
  );
}
