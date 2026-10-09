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
  /**
   * Path to the person's portrait under /public. Kept separate from `media.photos`
   * so a single portrait does not turn into a one-item gallery tab.
   */
  portrait?: string;
  years?: string;
  zhuz?: string;
  rod?: string;
  plemya?: string;
  rod2?: string;
  rod3?: string;
  birthPlace?: string;
  burialPlace?: string;
  burialCoordsUrl?: string;
  causeOfDeath?: string;
  fatherName?: string;
  studyPlace?: string;
  mainOccupation?: string;
  awards?: string[];
  extraInfo?: string;
  spouse?: string;
  children?: string[];
  siblings?: string[];
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

/**
 * Kinship is defined by these edges and nothing else. The `fatherName`, `spouse`,
 * `children` and `siblings` fields on Person are free text written by families in four
 * different name orders, so they are display labels only — never link targets.
 */
export type Edge = {
  fromId: string;
  toId: string;
  relation: "parent" | "spouse";
  /** On a parent edge: which parent this is. Required to link to the father specifically. */
  role?: "father" | "mother";
};

export const people: Person[] = [
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
    portrait: "/images/people/maken-saduakaskyzy.jpg",
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
    media: {
      photos: [
        { src: "/images/people/maken-saduakaskyzy/01.jpg", alt: "Семейное фото в доме, на фоне ковра" },
        { src: "/images/people/maken-saduakaskyzy/02.jpg", alt: "За праздничным столом с родными" },
        { src: "/images/people/maken-saduakaskyzy/03.jpg", alt: "За праздничным столом с родными" },
        { src: "/images/people/maken-saduakaskyzy/04.jpg", alt: "Большая семья за дастарханом" },
        { src: "/images/people/maken-saduakaskyzy/05.jpg", alt: "С семьёй во дворе дома" },
        { src: "/images/people/maken-saduakaskyzy/06.jpg", alt: "С цветами" },
        { src: "/images/people/maken-saduakaskyzy/07.jpg", alt: "С малышкой на руках" },
        { src: "/images/people/maken-saduakaskyzy/08.jpg", alt: "В объятиях родного человека" },
        { src: "/images/people/maken-saduakaskyzy/09.jpg", alt: "С букетом цветов в кругу родных" },
        { src: "/images/people/maken-saduakaskyzy/10.jpg", alt: "С родными и букетом цветов" },
        { src: "/images/people/maken-saduakaskyzy/11.jpg", alt: "С малышкой и цветами" },
        { src: "/images/people/maken-saduakaskyzy/12.jpg", alt: "С малышкой и букетом" },
        { src: "/images/people/maken-saduakaskyzy/13.jpg", alt: "В кругу родных дома" },
        { src: "/images/people/maken-saduakaskyzy/14.jpg", alt: "Праздничный стол с родственниками" },
        { src: "/images/people/maken-saduakaskyzy/15.jpg", alt: "Семейное застолье" },
        { src: "/images/people/maken-saduakaskyzy/16.jpg", alt: "Семейный праздник" },
        { src: "/images/people/maken-saduakaskyzy/17.jpg", alt: "За столом с семьёй" },
        { src: "/images/people/maken-saduakaskyzy/18.jpg", alt: "У новогодней ёлки" },
      ],
      videos: [],
      documents: [],
    },
  },
];

// ── Род Уак: Кабдолла ⚭ Зейнеп → Жумагазы ⚭ Мәкен ──
export const relations: Edge[] = [
  {
    fromId: "kabdolla-omaruly",
    toId: "zhumagazy-khabdullin",
    relation: "parent",
    role: "father",
  },
  {
    fromId: "zeinep-temirkankyzy",
    toId: "zhumagazy-khabdullin",
    relation: "parent",
    role: "mother",
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
