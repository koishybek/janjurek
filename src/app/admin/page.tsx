"use client";

import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { people, createEmptyPersonDraft, type Person } from "@data/people";
import { buildMediaStoragePath, firebaseCollections, getAdminAccessCode, isFirebaseConfigured } from "@/lib/firebase";
import { fetchPeopleFromFirestore, savePersonToFirestore } from "@/lib/firestore-people";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type PhotoDraft = {
  id: string;
  alt: string;
  storagePath: string;
  file?: File;
};

type VideoDraft = {
  id: string;
  title: string;
  url: string;
};

type DocumentDraft = {
  id: string;
  title: string;
  url: string;
  note: string;
  storagePath: string;
};

const createId = () => (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));

const createVideoDraft = (): VideoDraft => ({
  id: createId(),
  title: "",
  url: "",
});

const createDocumentDraft = (): DocumentDraft => ({
  id: createId(),
  title: "",
  url: "",
  note: "",
  storagePath: "",
});

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [form, setForm] = useState(() => createEmptyPersonDraft());
  const [awardsText, setAwardsText] = useState("");
  const [childrenText, setChildrenText] = useState("");
  const [photoDrafts, setPhotoDrafts] = useState<PhotoDraft[]>([]);
  const [videoDrafts, setVideoDrafts] = useState<VideoDraft[]>([createVideoDraft()]);
  const [documentDrafts, setDocumentDrafts] = useState<DocumentDraft[]>([createDocumentDraft()]);
  const [payloadPreview, setPayloadPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [remotePeople, setRemotePeople] = useState<Person[]>([]);
  const [loadingRemote, setLoadingRemote] = useState(isFirebaseConfigured);
  const [saving, setSaving] = useState(false);

  const accessCode = getAdminAccessCode();

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoadingRemote(false);
      return;
    }
    let cancelled = false;
    setLoadingRemote(true);
    fetchPeopleFromFirestore()
      .then((list) => {
        if (!cancelled) {
          setRemotePeople(list);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setStatus(`Не удалось загрузить данные Firestore: ${error instanceof Error ? error.message : String(error)}`);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingRemote(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const existingPeople = useMemo(() => {
    const source = remotePeople.length > 0 ? remotePeople : people;
    return source.map((person) => ({
      id: person.id,
      name: [person.lastName, person.firstName, person.patronymic].filter(Boolean).join(" "),
      years: person.years ?? "—",
      slug: person.slug,
    }));
  }, [remotePeople]);

  const handleAuthorize = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (codeInput.trim() === accessCode) {
      setAuthorized(true);
      setStatus(null);
    } else {
      setStatus("Неверный код доступа. Попробуйте снова.");
    }
  };

  const handleBasicChange = (field: keyof typeof form) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handlePhotoFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;
    const slug = form.slug || form.id || "new-person";
    const nextDrafts = files.map((file) => ({
      id: createId(),
      alt: "",
      file,
      storagePath: buildMediaStoragePath(slug, file.name),
    }));
    setPhotoDrafts((current) => [...current, ...nextDrafts]);
    event.target.value = "";
  };

  const updatePhotoDraft = (id: string, field: "alt" | "storagePath") => (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPhotoDrafts((current) =>
      current.map((photo) => (photo.id === id ? { ...photo, [field]: value } : photo))
    );
  };

  const removePhotoDraft = (id: string) => {
    setPhotoDrafts((current) => current.filter((photo) => photo.id !== id));
  };

  const updateVideoDraft = (id: string, field: keyof VideoDraft) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setVideoDrafts((current) =>
      current.map((video) => (video.id === id ? { ...video, [field]: value } : video))
    );
  };

  const addVideoDraft = () => setVideoDrafts((current) => [...current, createVideoDraft()]);
  const removeVideoDraft = (id: string) => setVideoDrafts((current) => current.filter((video) => video.id !== id));

  const updateDocumentDraft = (id: string, field: keyof DocumentDraft) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    setDocumentDrafts((current) =>
      current.map((doc) => (doc.id === id ? { ...doc, [field]: value } : doc))
    );
  };

  const addDocumentDraft = () => setDocumentDrafts((current) => [...current, createDocumentDraft()]);
  const removeDocumentDraft = (id: string) => setDocumentDrafts((current) => current.filter((doc) => doc.id !== id));

  const parseList = (value: string) =>
    value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.firstName || !form.lastName) {
      setStatus("Введите минимум имя и фамилию.");
      return;
    }

    const personId = form.id || form.slug || createId();
    const slug = form.slug || form.id || personId;

    const prepared: Person = {
      ...form,
      id: personId,
      slug,
      awards: parseList(awardsText),
      children: parseList(childrenText),
      media:
        photoDrafts.length > 0 || videoDrafts.length > 0 || documentDrafts.length > 0
          ? {
              photos: photoDrafts.map((photo) => ({
                src: `/storage/${photo.storagePath}`,
                alt: photo.alt || photo.file?.name || "Без подписи",
                storagePath: photo.storagePath,
              })),
              videos: videoDrafts
                .filter((video) => video.title && video.url)
                .map((video) => ({
                  title: video.title,
                  url: video.url,
                  storagePath: buildMediaStoragePath(slug, `${video.title.replace(/\s+/g, "-").toLowerCase()}.mp4`),
                })),
              documents: documentDrafts
                .filter((doc) => doc.title)
                .map((doc) => ({
                  title: doc.title,
                  url: doc.url || undefined,
                  note: doc.note || undefined,
                  storagePath: doc.storagePath || buildMediaStoragePath(slug, `${doc.title.replace(/\s+/g, "-").toLowerCase()}.pdf`),
                })),
            }
          : undefined,
    };

    setPayloadPreview(JSON.stringify(prepared, null, 2));

    if (isFirebaseConfigured) {
      try {
        setSaving(true);
        setStatus("Сохраняем в Firestore...");
        await savePersonToFirestore(prepared);
        setStatus("Запись сохранена в Firestore.");
        const list = await fetchPeopleFromFirestore();
        setRemotePeople(list);
      } catch (error) {
        setStatus(`Ошибка сохранения: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        setSaving(false);
      }
    } else {
      setStatus("Черновик сохранён. Отправьте эти данные в Firebase вручную.");
    }
  };

  const resetForm = () => {
    setForm(createEmptyPersonDraft());
    setAwardsText("");
    setChildrenText("");
    setPhotoDrafts([]);
    setVideoDrafts([createVideoDraft()]);
    setDocumentDrafts([createDocumentDraft()]);
    setPayloadPreview(null);
    setStatus("Форма очищена.");
  };

  if (!authorized) {
    return (
      <main className="container flex min-h-screen items-center justify-center py-24">
        <Card className="w-full max-w-md rounded-3xl border-border/30 bg-secondary/40">
          <CardHeader>
            <CardTitle>Вход в админ-панель</CardTitle>
            <CardDescription>Введите код, чтобы продолжить. Доступ открыт только доверенному администратору.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuthorize} className="space-y-4">
              <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                Код доступа
                <Input
                  type="password"
                  placeholder="Например: JANJUREK"
                  value={codeInput}
                  onChange={(event) => setCodeInput(event.target.value)}
                />
              </label>
              <Button type="submit" className="w-full rounded-2xl bg-accent text-accent-foreground">
                Войти
              </Button>
              {status ? <p className="text-sm text-red-500">{status}</p> : null}
            </form>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container space-y-12 py-12">
        <section className="space-y-2">
          <p className="text-sm uppercase tracking-[0.4em] text-accent/80">Администрирование</p>
          <h1 className="font-serif text-4xl text-foreground">Панель управления JANJUREK</h1>
          <p className="text-sm text-muted-foreground">
            Здесь вы можете подготовить записи людей перед выгрузкой в Firebase. Все поля соответствуют биографии Акана Нургали.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="rounded-3xl border-border/30 bg-secondary/40">
            <CardHeader>
              <CardTitle>Подготовка записи</CardTitle>
              <CardDescription>Заполните поля, добавьте медиа и нажмите «Сформировать черновик».</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-foreground">
                    ID документа
                    <Input value={form.id} onChange={handleBasicChange("id")} placeholder="akan-nurgali" />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-foreground">
                    Slug
                    <Input value={form.slug} onChange={handleBasicChange("slug")} placeholder="akan-nurgali-akhmetpekuly" />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-foreground">
                    Фамилия
                    <Input value={form.lastName} onChange={handleBasicChange("lastName")} required />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-foreground">
                    Имя
                    <Input value={form.firstName} onChange={handleBasicChange("firstName")} required />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-foreground">
                    Отчество
                    <Input value={form.patronymic ?? ""} onChange={handleBasicChange("patronymic")} />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-foreground">
                    Годы жизни
                    <Input value={form.years ?? ""} onChange={handleBasicChange("years")} placeholder="1926—1998" />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-foreground">
                    Жуз
                    <Input value={form.zhuz ?? ""} onChange={handleBasicChange("zhuz")} />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-foreground">
                    Род
                    <Input value={form.rod ?? ""} onChange={handleBasicChange("rod")} />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-foreground">
                    Племя
                    <Input value={form.plemya ?? ""} onChange={handleBasicChange("plemya")} />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-foreground">
                    Род 2
                    <Input value={form.rod2 ?? ""} onChange={handleBasicChange("rod2")} />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-foreground">
                    Род 3
                    <Input value={form.rod3 ?? ""} onChange={handleBasicChange("rod3")} />
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-foreground">
                    Место рождения
                    <Input value={form.birthPlace ?? ""} onChange={handleBasicChange("birthPlace")} />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-foreground">
                    Место захоронения
                    <Input value={form.burialPlace ?? ""} onChange={handleBasicChange("burialPlace")} />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-foreground">
                    Ссылка на координаты
                    <Input value={form.burialCoordsUrl ?? ""} onChange={handleBasicChange("burialCoordsUrl")} placeholder="https://maps..." />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-foreground">
                    Отец
                    <Input value={form.fatherName ?? ""} onChange={handleBasicChange("fatherName")} />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-foreground">
                    Место учёбы
                    <Input value={form.studyPlace ?? ""} onChange={handleBasicChange("studyPlace")} />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-foreground">
                    Основная профессия
                    <Input value={form.mainOccupation ?? ""} onChange={handleBasicChange("mainOccupation")} />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-foreground">
                    Супруг(а)
                    <Input value={form.spouse ?? ""} onChange={handleBasicChange("spouse")} />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-foreground">
                    Дополнительная информация
                    <Textarea value={form.extraInfo ?? ""} onChange={handleBasicChange("extraInfo")} placeholder="Короткое описание архивов, заслуг..." />
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-foreground">
                    Награды (каждая с новой строки)
                    <Textarea value={awardsText} onChange={(event) => setAwardsText(event.target.value)} placeholder="Медаль ...&#10;Грамота ..." />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-foreground">
                    Дети (каждый с новой строки)
                    <Textarea value={childrenText} onChange={(event) => setChildrenText(event.target.value)} placeholder="Имя ребёнка..." />
                  </label>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Фотографии</h3>
                    <p className="text-sm text-muted-foreground">Загрузите файлы — путь автоматически сформируется и его можно отредактировать.</p>
                  </div>
                  <Input type="file" multiple accept="image/*" onChange={handlePhotoFiles} />
                  <div className="space-y-4">
                    {photoDrafts.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Фотографии ещё не добавлены.</p>
                    ) : (
                      photoDrafts.map((photo) => (
                        <div key={photo.id} className="rounded-2xl border border-border/30 p-4">
                          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div className="flex-1 space-y-3">
                              <label className="space-y-1 text-sm font-medium text-foreground">
                                Описание
                                <Input value={photo.alt} onChange={updatePhotoDraft(photo.id, "alt")} placeholder="Например: портрет семьи" />
                              </label>
                              <label className="space-y-1 text-sm font-medium text-foreground">
                                Путь в хранилище
                                <Input value={photo.storagePath} onChange={updatePhotoDraft(photo.id, "storagePath")} />
                              </label>
                            </div>
                            <Button type="button" variant="outline" className="rounded-2xl" onClick={() => removePhotoDraft(photo.id)}>
                              Удалить
                            </Button>
                          </div>
                          {photo.file ? (
                            <p className="text-xs text-muted-foreground mt-2">Файл: {photo.file.name}</p>
                          ) : null}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Видео</h3>
                      <p className="text-sm text-muted-foreground">Добавьте ссылки на видео (например, YouTube или облако).</p>
                    </div>
                    <Button type="button" variant="secondary" className="rounded-2xl" onClick={addVideoDraft}>
                      Добавить видео
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {videoDrafts.map((video) => (
                      <div key={video.id} className="grid gap-3 rounded-2xl border border-border/30 p-4 md:grid-cols-[1fr_1fr_auto]">
                        <Input value={video.title} onChange={updateVideoDraft(video.id, "title")} placeholder="Название" />
                        <Input value={video.url} onChange={updateVideoDraft(video.id, "url")} placeholder="https://..." />
                        <Button type="button" variant="outline" className="rounded-2xl" onClick={() => removeVideoDraft(video.id)}>
                          Удалить
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Документы</h3>
                      <p className="text-sm text-muted-foreground">Впишите название, ссылку и путь для хранения скана.</p>
                    </div>
                    <Button type="button" variant="secondary" className="rounded-2xl" onClick={addDocumentDraft}>
                      Добавить документ
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {documentDrafts.map((doc) => (
                      <div key={doc.id} className="space-y-3 rounded-2xl border border-border/30 p-4">
                        <Input value={doc.title} onChange={updateDocumentDraft(doc.id, "title")} placeholder="Название" />
                        <Input value={doc.url} onChange={updateDocumentDraft(doc.id, "url")} placeholder="https://..." />
                        <Textarea
                          value={doc.note}
                          onChange={updateDocumentDraft(doc.id, "note")}
                          placeholder="Примечание или пояснение"
                          className="min-h-[80px]"
                        />
                        <Input value={doc.storagePath} onChange={updateDocumentDraft(doc.id, "storagePath")} placeholder="people/.../documents/..." />
                        <div className="text-right">
                          <Button type="button" variant="outline" className="rounded-2xl" onClick={() => removeDocumentDraft(doc.id)}>
                            Удалить
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Button type="submit" className="rounded-2xl bg-accent text-accent-foreground" disabled={saving}>
                    {saving ? "Сохранение..." : "Сформировать черновик"}
                  </Button>
                  <Button type="button" variant="outline" className="rounded-2xl" onClick={resetForm}>
                    Очистить
                  </Button>
                </div>
                {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="rounded-3xl border-border/30 bg-secondary/30">
              <CardHeader>
                <CardTitle>База людей</CardTitle>
                <CardDescription>
                  {loadingRemote
                    ? "Загружаем данные из Firestore..."
                    : isFirebaseConfigured
                      ? "Данные подтянуты из Firestore. При отсутствии подключения используется локальный список."
                      : "Показаны локальные данные. Подключите Firebase, чтобы увидеть удалённую базу."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Коллекция Firebase: <span className="font-mono">{firebaseCollections.people}</span>
                </p>
                <ul className="space-y-3">
                  {existingPeople.map((person) => (
                    <li key={person.id} className="flex items-center justify-between rounded-2xl border border-border/30 p-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{person.name}</p>
                        <p className="text-xs text-muted-foreground">slug: {person.slug}</p>
                      </div>
                      <Badge variant="outline">{person.years}</Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-border/30 bg-secondary/30">
              <CardHeader>
                <CardTitle>Готовый JSON</CardTitle>
                <CardDescription>Скопируйте и вставьте в Firebase вручную или через скрипт.</CardDescription>
              </CardHeader>
              <CardContent>
                {payloadPreview ? (
                  <pre className="max-h-[420px] overflow-auto rounded-2xl bg-background/80 p-4 text-xs text-muted-foreground">
                    {payloadPreview}
                  </pre>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    После заполнения формы здесь появится JSON-черновик записи.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
