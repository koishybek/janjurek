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
  /** Alternative spellings (e.g. russified forms) — used by search, never displayed. */
  altNames?: string[];
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
          url: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
          storagePath: "people/akan-nurgali-akhmetpekuly/videos/interview-children.mp4",
        },
        {
          title: "Интервью коллег из лесничества",
          url: "https://youtu.be/86m4RC_ADEY",
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
  {
    id: "kabdolla-omaruly",
    slug: "kabdolla-omaruly",
    firstName: "Кабдолла",
    lastName: "Омарулы",
    altNames: ["Кабдолла Омарулы"],
    years: "1904—1943",
    zhuz: "Средний жуз",
    rod: "Уак",
    plemya: "Ергенекті",
    birthPlace: "с. Самай, Бескарагайский район, Павлодарская область",
    extraInfo:
      "Призван на фронт 7 мая 1942 года. Письменная связь прекратилась в декабре 1942 года. Пропал без вести на фронте Великой Отечественной войны в декабре 1943 года.",
    spouse: "Темирканкызы Зейнеп",
    children: ["Хабдуллин Жумагазы Омарович"],
  },
  {
    id: "zeinep-temirkankyzy",
    slug: "zeinep-temirkankyzy",
    firstName: "Зейнеп",
    lastName: "Темирканкызы",
    years: "20.10.1912 — 05.2003",
    birthPlace: "с. Самай, Бескарагайский район, Павлодарская область",
    extraInfo:
      "Муж, Кабдолла Омарулы, был призван на фронт 7 мая 1942 года и пропал без вести в декабре 1943 года. Зейнеп Темирканкызы одна вырастила сына и пятерых внучек. Умерла в возрасте 91,5 года.",
    spouse: "Кабдолла Омарулы",
    children: ["Хабдуллин Жумагазы Омарович"],
  },
  {
    id: "zhumagazy-khabdullin",
    slug: "zhumagazy-khabdullin",
    firstName: "Жумагазы",
    lastName: "Хабдуллин",
    patronymic: "Омарович",
    years: "01.09.1934 — 11.04.1999",
    zhuz: "Средний жуз",
    rod: "Уак",
    plemya: "Ергенекті",
    birthPlace: "с. Самай, Бескарагайский район, Павлодарская область",
    burialPlace: "с. Бескарагай, Абайская область",
    burialCoordsUrl: "https://maps.app.goo.gl/duPxYgWmy7UXeqoT7",
    fatherName: "Кабдолла Омарулы",
    mainOccupation: "Бухгалтер",
    awards: ["1964 г. — избран депутатом Семеновского округа Бескарагайского района"],
    extraInfo:
      "Играл на музыкальных инструментах: скрипке, пианино и баяне. Любил импровизировать и петь песни.",
    spouse: "Сәдуакасқызы Мәкен",
  },
  {
    id: "maken-saduakaskyzy",
    slug: "maken-saduakaskyzy",
    firstName: "Мәкен",
    lastName: "Сәдуакасқызы",
    altNames: ["Садвокасова Макен"],
    years: "10.06.1934 — 18.04.2024",
    zhuz: "Средний жуз",
    rod: "Уак",
    plemya: "Солакай",
    birthPlace: "Алтайский край",
    burialPlace: "с. Бескарагай, Абайская область",
    burialCoordsUrl: "https://maps.app.goo.gl/eBBdP8N7gZGPsy4Q6",
    fatherName: "Кактранов Садвокас (Сәдуақас Қайыркенұлы)",
    studyPlace: "Усть-Каменогорский кооперативный техникум",
    mainOccupation: "Бухгалтер",
    awards: [
      "«Ударник Коммунистического труда»",
      "Занесена в «Книгу почёта» РайПо за долголетний безупречный труд в системе Кооперации",
    ],
    spouse: "Хабдуллин Жумагазы Омарович",
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
  // ── Род Уак: Кабдолла ⚭ Зейнеп → Жумагазы ⚭ Мәкен ──
  {
    fromId: "kabdolla-omaruly",
    toId: "zhumagazy-khabdullin",
    relation: "parent",
  },
  {
    fromId: "zeinep-temirkankyzy",
    toId: "zhumagazy-khabdullin",
    relation: "parent",
  },
  {
    fromId: "kabdolla-omaruly",
    toId: "zeinep-temirkankyzy",
    relation: "spouse",
  },
  {
    fromId: "zhumagazy-khabdullin",
    toId: "maken-saduakaskyzy",
    relation: "spouse",
  },
];
