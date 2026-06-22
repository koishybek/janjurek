export type MediaAssetMeta = {
  storagePath?: string;
  storageBucket?: string;
};

export type PersonMedia = {
  photos: Array<{ src: string; alt: string } & MediaAssetMeta>;
  videos: Array<{ title: string; url: string } & MediaAssetMeta>;
  documents: Array<{ title: string; url?: string; note?: string } & MediaAssetMeta>;
};

export type Person = {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  patronymic?: string;
  years?: string;
  zhuz?: string;
  rod?: string;
  plemya?: string;
  rod2?: string;
  rod3?: string;
  birthPlace?: string;
  burialPlace?: string;
  burialCoordsUrl?: string;
  fatherName?: string;
  studyPlace?: string;
  mainOccupation?: string;
  awards?: string[];
  extraInfo?: string;
  spouse?: string;
  children?: string[];
  media?: PersonMedia;
  createdAt?: string;
  updatedAt?: string;
};

export type PersonDraft = Person & {
  media: PersonMedia;
};

export const createEmptyPersonDraft = (): PersonDraft => ({
  id: "",
  slug: "",
  firstName: "",
  lastName: "",
  patronymic: "",
  media: {
    photos: [],
    videos: [],
    documents: [],
  },
});

export type Edge = {
  fromId: string;
  toId: string;
  relation: "parent" | "child" | "spouse";
};

export const people: Person[] = [
  {
    id: "akan-nurgali",
    slug: "akan-nurgali-akhmetpekuly",
    firstName: "Акан",
    lastName: "Нургали",
    patronymic: "Ахметпекулы",
    years: "1926—1998",
    zhuz: "Средний жуз",
    rod: "Аргын",
    plemya: "Мейрамсопы",
    rod2: "Каракесек",
    rod3: "Жалкыпас",
    birthPlace: "с. Черемушки, Восточно-Казахстанская область, Казахстан",
    burialPlace: "с. Черемушки, Восточно-Казахстанская область, Казахстан",
    burialCoordsUrl: "https://maps.app.goo.gl/hSWtjDckbu2ewLSw6",
    fatherName: "Ахметпек Нургалиулы",
    studyPlace: "Семипалатинский лесотехнический техникум",
    mainOccupation: "Лесничий в Катон-Карагайском районе",
    awards: ["Медаль «За трудовую доблесть»", "Почётная грамота лесного хозяйства Восточного Казахстана"],
    extraInfo:
      "Собирал семейный архив, составлял карту переселения рода и записывал рассказы старших родственников.",
    spouse: "Жамал Айдарбеккызы",
    children: ["Ермек Аканулы", "Гүлнар Аканкызы", "Сауле Аканкызы"],
    media: {
      photos: [
        {
          src: "/images/sample-photo.jpg",
          alt: "Акан Нургали с семьёй у дома в Черемушках",
          storagePath: "people/akan-nurgali-akhmetpekuly/photos/family-portrait.jpg",
        },
        {
          src: "/images/gallery/hero-stars.jpg",
          alt: "Рабочая бригада в сосновом лесу",
          storagePath: "people/akan-nurgali-akhmetpekuly/photos/forest-team.jpg",
        },
      ],
      videos: [
        {
          title: "Воспоминания детей об Акане",
          url: "https://example.com/video1",
          storagePath: "people/akan-nurgali-akhmetpekuly/videos/interview-children.mp4",
        },
        {
          title: "Интервью коллег из лесничества",
          url: "https://example.com/video2",
          storagePath: "people/akan-nurgali-akhmetpekuly/videos/forestry-colleagues.mp4",
        },
      ],
      documents: [
        {
          title: "Трудовая книжка лесничего",
          note: "Оригинал хранится в семейном архиве.",
          storagePath: "people/akan-nurgali-akhmetpekuly/documents/work-book.pdf",
        },
        {
          title: "Список наград и благодарностей",
          storagePath: "people/akan-nurgali-akhmetpekuly/documents/awards-list.pdf",
        },
      ],
    },
  },
  {
    id: "ermek-akanuly",
    slug: "ermek-akanuly",
    firstName: "Ермек",
    lastName: "Нургали",
    patronymic: "Аканулы",
    years: "1954—2016",
    zhuz: "Средний жуз",
    rod: "Аргын",
    plemya: "Мейрамсопы",
    rod2: "Каракесек",
    rod3: "Жалкыпас",
    birthPlace: "с. Черемушки, Восточно-Казахстанская область, Казахстан",
    studyPlace: "Казахский политехнический институт",
    mainOccupation: "Инженер-строитель",
    awards: ["Медаль «Ветеран труда»"],
    extraInfo: "Поддерживал семейный архив и собирал устные истории для передачи детям.",
    spouse: "Асем Калибеккызы",
    children: ["Меруерт Ермеккызы", "Айдын Ермекулы"],
    media: {
      photos: [
        {
          src: "/images/gallery/hero-stars.jpg",
          alt: "Ермек Нургали на строительной площадке",
          storagePath: "people/ermek-akanuly/photos/engineer-site.jpg",
        },
      ],
      videos: [],
      documents: [],
    },
  },
  {
    id: "gulnar-akanqyzy",
    slug: "gulnar-akanqyzy",
    firstName: "Гүлнар",
    lastName: "Нургали",
    patronymic: "Аканкызы",
    years: "1961—",
    zhuz: "Средний жуз",
    rod: "Аргын",
    plemya: "Мейрамсопы",
    rod2: "Каракесек",
    rod3: "Жалкыпас",
    birthPlace: "с. Черемушки, Восточно-Казахстанская область, Казахстан",
    studyPlace: "Алматинский государственный медицинский институт",
    mainOccupation: "Врач-педиатр",
    awards: ["Почётная грамота Минздрава Казахстана"],
    extraInfo: "Организует ежегодные встречи семьи в память об Акана.",
    spouse: "Нурболат Жанузаков",
    children: ["Инкар Нурболаткызы"],
    media: {
      photos: [],
      videos: [],
      documents: [],
    },
  },
];

export const relations: Edge[] = [
  {
    fromId: "akan-nurgali",
    toId: "ermek-akanuly",
    relation: "parent",
  },
  {
    fromId: "akan-nurgali",
    toId: "gulnar-akanqyzy",
    relation: "parent",
  },
];
