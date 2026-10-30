export type MediaAssetMeta = {
  storagePath?: string;
  storageBucket?: string;
};

export type MediaItemMeta = MediaAssetMeta & {
  /** Folder path, e.g. "От родных" or "От родных/Диас". Absent means unfiled. */
  folder?: string;
};

export type PersonMedia = {
  /**
   * Extra folders for this person on top of the base set (От родных, От друзей, От коллег).
   * Nested folders are paths: "От родных/Диас".
   */
  folders?: string[];
  photos: Array<{ src: string; alt: string } & MediaItemMeta>;
  videos: Array<{ title: string; url: string } & MediaItemMeta>;
  documents: Array<{ title: string; url?: string; note?: string } & MediaItemMeta>;
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
  motherName?: string;
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
 * Kinship is defined by these edges and nothing else. The `fatherName`, `motherName`, `spouse`,
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

// ── Род Аргын · Мейрамсопы · Каракесек · Жалыкпас (Нургалиевы) ──

/** What the family's questionnaire repeats on every ancestor of the Жалыкпас line. */
const ZHALYKPAS_LINE = {
  zhuz: "Средний жуз",
  rod: "Аргын",
  plemya: "Мейрамсопы",
  rod2: "Каракесек",
  rod3: "Жалыкпас",
  birthPlace: "Каркаралинский район",
  extraInfo:
    "Происхождение рода. Согласно шежіре, от Аргына происходит Мейрамсопы, от чьей жены Каркабат родился сын Болаткожа. Болаткожа в народе получил прозвище Каракесек. Само слово «каракесек» в древнетюркском языке означает «крупный, мощный, отдельный, крепкий народ».\n\nЖалықпас — одна из древних ветвей, входящих в состав каракесекского объединения. В народных родословных Жалықпас часто упоминается наряду с основными ветвями Каракесека. Со временем его потомки образовали самостоятельный крупный род, который прочно закрепился в составе каракесекского племенного союза.\n\nВ период формирования казахской народности и её жузовой системы (XV–XVII вв.) руы объединялись по территориальным, хозяйственным и военным признакам под общим кличем племени Аргын («Ақжол»). Жалықпасцы наравне с другими родами Каракесека активно участвовали в защите родной земли, кочевках и общественно-политической жизни казахского общества.",
} satisfies Partial<Person>;

const NURGALIEV_FAMILY_TIMELINE =
  "1955 г. — семью из с. Известковое переселяют в с. Черемушки для создания мясо-молочного совхоза «Долонский».\n1959 г. — рождается дочь Куляш.\n1961 г. — рождается дочь Айтжамал.\n1964 г. — рождается дочь Оразбике.\n1964 г. — устраивается на работу в лесхоз с. Мостик.\n1966 г. — рождается дочь Нурбике.\n1969 г. — рождается сын Кайрат.\n1971 г. — рождается сын Жанат.\n1973 г. — дочь Менжамал выходит замуж.\n1974 г. — рождается сын Болат.\n1976 г. — дочь Куляш выходит замуж.\n1977 г. — рождается сын Рустам.\n1981 г. — сын Мадениет женится.\n1985 г. — дочь Айтжамал выходит замуж.\n1987 г. — дочь Нурбике выходит замуж.\n1988 г. — сын Кайрат женится.\n1990 г. — дочь Оразбике выходит замуж.\n1995 г. — сын Жанат женится.\n2003 г. — сын Болат женится.\n2009 г. — сын Рустам женится.";

const nurgalievPeople: Person[] = [
  {
    id: "akhmetbek-nurgaliuly",
    slug: "akhmetbek-nurgaliuly",
    firstName: "Ахметбек (Акан)",
    lastName: "Нұрғалиұлы",
    altNames: ["Ахметбек Нургалиулы", "Ахметпек Нургалиулы", "Акан", "Нургалиев Ахметбек"],
    years: "1927—2004",
    zhuz: "Средний жуз",
    rod: "Аргын",
    plemya: "Мейрамсопы",
    rod2: "Каракесек",
    rod3: "Жалыкпас",
    causeOfDeath: "Рак",
    birthPlace: "с. Балапан (или Каркаралинск), Абралинский район",
    burialPlace: "с. Черемушки, ВКО",
    burialCoordsUrl: "https://maps.app.goo.gl/hSWtjDckbu2ewLSw6",
    fatherName: "Күлжанұлы Нұрғали",
    mainOccupation: "Лесник",
    extraInfo:
      "До 1940 г. — коллективизация и голод.\n1941–1945 гг. — служил в трудовой армии в г. Караганда.\n1946 г. — НКВД переселяет семью в Бескарагайский район, к Иртышу, в с. Известковое для добычи и обработки извести.\n1952 г. — женится.\n1953 г. — рождается дочь Менжамал.\n1955 г. — рождается сын Мадениет.\n" +
      NURGALIEV_FAMILY_TIMELINE,
    spouse: "Нургалиева Бижамал Ибрагимкызы",
  },
  {
    id: "bizhamal-nurgalieva",
    slug: "bizhamal-nurgalieva",
    firstName: "Бижамал",
    lastName: "Нургалиева",
    patronymic: "Ибрагимкызы",
    altNames: ["Бажамал Нургалиева", "Бижамал Ибрахимкызы"],
    burialPlace: "с. Черемушки, ВКО",
    burialCoordsUrl: "https://maps.app.goo.gl/hSWtjDckbu2ewLSw6",
    extraInfo: "1952 г. — выходит замуж.\n" + NURGALIEV_FAMILY_TIMELINE,
    spouse: "Нұрғалиұлы Ахметбек (Акан)",
  },
  { id: "nurgali-kulzhanuly", slug: "nurgali-kulzhanuly", firstName: "Нұрғали", lastName: "Күлжанұлы", altNames: ["Нургали Кулжанулы"], ...ZHALYKPAS_LINE, burialPlace: "Каркаралинский район", fatherName: "Көпенұлы Күлжан" },
  { id: "kulzhan-kopenuly", slug: "kulzhan-kopenuly", firstName: "Күлжан", lastName: "Көпенұлы", altNames: ["Кулжан Копенулы"], ...ZHALYKPAS_LINE, fatherName: "Көпен Солтанайұлы" },
  { id: "kopen-soltanaiuly", slug: "kopen-soltanaiuly", firstName: "Көпен", lastName: "Солтанайұлы", altNames: ["Копен Солтанайулы"], ...ZHALYKPAS_LINE, fatherName: "Ордабайұлы Солтанай" },
  { id: "soltanai-ordabaiuly", slug: "soltanai-ordabaiuly", firstName: "Солтанай", lastName: "Ордабайұлы", altNames: ["Солтанай Ордабайулы"], ...ZHALYKPAS_LINE, fatherName: "Ордабай Болатұлы" },
  { id: "ordabai-bolatuly", slug: "ordabai-bolatuly", firstName: "Ордабай", lastName: "Болатұлы", altNames: ["Ордабай Болатулы"], ...ZHALYKPAS_LINE, fatherName: "Өтегенұлы Болат" },
  { id: "bolat-otegenuly", slug: "bolat-otegenuly", firstName: "Болат", lastName: "Өтегенұлы", altNames: ["Болат Отегенулы"], ...ZHALYKPAS_LINE, fatherName: "Өтеген Жиенқұлұлы" },
  { id: "otegen-zhienkululy", slug: "otegen-zhienkululy", firstName: "Өтеген", lastName: "Жиенқұлұлы", altNames: ["Отеген Жиенкулулы"], ...ZHALYKPAS_LINE, fatherName: "Матайұлы Жиенқұл" },
  { id: "zhienkul-mataiuly", slug: "zhienkul-mataiuly", firstName: "Жиенқұл", lastName: "Матайұлы", altNames: ["Жиенкул Матайулы"], ...ZHALYKPAS_LINE, fatherName: "Жолмамбетұлы Матай" },
  { id: "matai-zholmambetuly", slug: "matai-zholmambetuly", firstName: "Матай", lastName: "Жолмамбетұлы", altNames: ["Матай Жолмамбетулы"], ...ZHALYKPAS_LINE, fatherName: "Түгелұлы Жолмамбет" },
  { id: "zholmambet-tugeluly", slug: "zholmambet-tugeluly", firstName: "Жолмамбет", lastName: "Түгелұлы", altNames: ["Жолмамбет Тугелулы"], ...ZHALYKPAS_LINE, fatherName: "Жалыкпасұлы Түгел" },
  { id: "tugel-zhalykpasuly", slug: "tugel-zhalykpasuly", firstName: "Түгел", lastName: "Жалыкпасұлы", altNames: ["Тугел Жалыкпасулы"], ...ZHALYKPAS_LINE },
];

/** The Жалыкпас line, oldest first: each one is the father of the next. */
const NURGALIEV_PATRILINE = [
  "tugel-zhalykpasuly",
  "zholmambet-tugeluly",
  "matai-zholmambetuly",
  "zhienkul-mataiuly",
  "otegen-zhienkululy",
  "bolat-otegenuly",
  "ordabai-bolatuly",
  "soltanai-ordabaiuly",
  "kopen-soltanaiuly",
  "kulzhan-kopenuly",
  "nurgali-kulzhanuly",
  "akhmetbek-nurgaliuly",
];

const nurgalievRelations: Edge[] = [
  ...NURGALIEV_PATRILINE.slice(1).map(
    (childId, index): Edge => ({
      fromId: NURGALIEV_PATRILINE[index],
      toId: childId,
      relation: "parent",
      role: "father",
    })
  ),
  { fromId: "akhmetbek-nurgaliuly", toId: "bizhamal-nurgalieva", relation: "spouse" },
];

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
      folders: ["От родных/Диас"],
      photos: [
        { src: "/images/people/maken-saduakaskyzy/01.jpg", alt: "Семейное фото в доме, на фоне ковра", folder: "От родных/Диас" },
        { src: "/images/people/maken-saduakaskyzy/02.jpg", alt: "За праздничным столом с родными", folder: "От родных/Диас" },
        { src: "/images/people/maken-saduakaskyzy/03.jpg", alt: "За праздничным столом с родными", folder: "От родных/Диас" },
        { src: "/images/people/maken-saduakaskyzy/04.jpg", alt: "Большая семья за дастарханом", folder: "От родных/Диас" },
        { src: "/images/people/maken-saduakaskyzy/05.jpg", alt: "С семьёй во дворе дома", folder: "От родных/Диас" },
        { src: "/images/people/maken-saduakaskyzy/06.jpg", alt: "С цветами", folder: "От родных/Диас" },
        { src: "/images/people/maken-saduakaskyzy/07.jpg", alt: "С малышкой на руках", folder: "От родных/Диас" },
        { src: "/images/people/maken-saduakaskyzy/08.jpg", alt: "В объятиях родного человека", folder: "От родных/Диас" },
        { src: "/images/people/maken-saduakaskyzy/09.jpg", alt: "С букетом цветов в кругу родных", folder: "От родных/Диас" },
        { src: "/images/people/maken-saduakaskyzy/10.jpg", alt: "С родными и букетом цветов", folder: "От родных/Диас" },
        { src: "/images/people/maken-saduakaskyzy/11.jpg", alt: "С малышкой и цветами", folder: "От родных/Диас" },
        { src: "/images/people/maken-saduakaskyzy/12.jpg", alt: "С малышкой и букетом", folder: "От родных/Диас" },
        { src: "/images/people/maken-saduakaskyzy/13.jpg", alt: "В кругу родных дома", folder: "От родных/Диас" },
        { src: "/images/people/maken-saduakaskyzy/14.jpg", alt: "Праздничный стол с родственниками", folder: "От родных/Диас" },
        { src: "/images/people/maken-saduakaskyzy/15.jpg", alt: "Семейное застолье", folder: "От родных/Диас" },
        { src: "/images/people/maken-saduakaskyzy/16.jpg", alt: "Семейный праздник", folder: "От родных/Диас" },
        { src: "/images/people/maken-saduakaskyzy/17.jpg", alt: "За столом с семьёй", folder: "От родных/Диас" },
        { src: "/images/people/maken-saduakaskyzy/18.jpg", alt: "У новогодней ёлки", folder: "От родных/Диас" },
      ],
      videos: [],
      documents: [],
    },
  },
  ...nurgalievPeople,
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
  ...nurgalievRelations,
];
