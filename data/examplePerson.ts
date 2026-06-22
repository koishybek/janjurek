export type TimelineItem = {
  year: number;
  date?: string;
  title: string;
  description?: string;
  place?: string;
};

export type MemoryPost = {
  id: string;
  author: string;
  date: string;
  text: string;
  likes?: number;
};

export type PersonNode = {
  id: string;
  name: string;
  years?: string;
  avatar?: string;
  relation?: "self" | "spouse" | "parent" | "child";
  children?: PersonNode[];
};

export type ExampleMemorial = {
  slug: "example-moon";
  name: string;
  years: string;
  location?: string;
  obituary: string;
  freeText?: string;
  timeline: TimelineItem[];
  gallery: { src: string; alt: string }[];
  videos: { title: string; url: string }[];
  memoryWall: MemoryPost[];
  favorites: {
    saying?: string;
    book?: string;
    movie?: string;
    travel?: string;
    color?: string;
    fact?: string;
  };
  service?: {
    place: string;
    address?: string;
    date?: string;
    virtualUrl?: string;
  };
  donateBlurb?: string;
  familyTree: {
    self: PersonNode;
    parents: PersonNode[];
    spouse?: PersonNode;
    children: PersonNode[];
  };
};

export const exampleMemorial: ExampleMemorial = {
  slug: "example-moon",
  name: "Давид Викторович Джексон",
  years: "1972—2025",
  location: "Алматы, Казахстан",
  obituary:
    "Давид Викторович Джексон прожил жизнь, наполненную любопытством, заботой и тихой уверенностью в силе семьи. Его тёплый голос, умение рассмешить даже в самые трудные минуты и бесконечная тяга учиться новому вдохновляли друзей и родных. Он оставил после себя воспоминания о путешествиях под звёздным небом, громкие семейные праздники и уютные вечера с гитарой. Давид верил, что главное наследие — это люди, которых мы любим, и истории, которыми делимся.",
  freeText:
    "Когда Давид встретил Наталию на школьном вечере в Караганде, они оба ещё не представляли, насколько переплетутся их судьбы. Они прошли путь от студенческой дружбы до партнёрства, где каждый шаг делился поровну. Давид ценил работу в астрономическом кружке, куда приводил школьников смотреть на Луну и рассказывать о космосе. Он писал короткие рассказы, записывал семейные рецепты, а каждое лето устраивал походы с детьми в предгорья Заилийского Алатау. Его дом был открытым пространством света, смеха и музыки, а стол всегда украшали свежий чай и домашние варенья.",
  timeline: [
    {
      year: 1972,
      date: "1972-09-14",
      title: "Рождение",
      description: "Давид появился на свет в семье молодых инженеров.",
      place: "Караганда, Казахстан",
    },
    {
      year: 1994,
      title: "Окончил университет",
      description: "Получил диплом физика и начал преподавать в школе.",
      place: "Алматы, Казахстан",
    },
    {
      year: 1997,
      date: "1997-06-21",
      title: "Свадьба с Наталией",
      description: "Торжество прошло в тесном кругу, под открытым небом и звёздами.",
      place: "Алматы, Казахстан",
    },
    {
      year: 2000,
      title: "Рождение дочери Эмили",
      description: "Он записал для неё альбом колыбельных, исполняя их под гитару.",
    },
    {
      year: 2003,
      title: "Рождение сына Майкла",
      description: "Сын унаследовал увлечение отца к наблюдению за звёздами.",
    },
    {
      year: 2015,
      title: "Создал клуб «Лунный след»",
      description: "Давид собрал единомышленников для ночных наблюдений и лекций о космосе.",
    },
    {
      year: 2022,
      title: "Стали бабушкой и дедушкой",
      description: "Появление первой внучки Софии наполнило дом новым смехом.",
    },
    {
      year: 2025,
      date: "2025-03-18",
      title: "Прощальная церемония",
      description: "Семья и друзья вспомнили все добрые дела Давида и зажгли свечи в его честь.",
      place: "Алматы, Казахстан",
    },
  ],
  gallery: [
    { src: "/images/gallery/moon-1.jpg", alt: "Давид смотрит на небо в степи" },
    { src: "/images/gallery/moon-2.jpg", alt: "Семейный ужин под гирляндами" },
    { src: "/images/gallery/moon-3.jpg", alt: "Поход в предгорья с детьми" },
    { src: "/images/gallery/moon-4.jpg", alt: "Клуб любителей астрономии на крыше" },
  ],
  videos: [
    { title: "Воспоминания друзей о Давиде", url: "https://example.com/video-friends" },
    { title: "Запись лекции «Истории Луны»", url: "https://example.com/video-moon" },
    { title: "Семейный вечер с гитарой", url: "https://example.com/video-family" },
  ],
  memoryWall: [
    {
      id: "post-3",
      author: "Людмила К.",
      date: "2025-04-02",
      text: "Давид научил меня смотреть на звёзды так, будто каждая — это письмо от предков. Спасибо за бесконечные истории и поддержку.",
      likes: 18,
    },
    {
      id: "post-2",
      author: "Клуб «Лунный след»",
      date: "2025-03-25",
      text: "Мы продолжим наблюдать небо в твою честь, Давид. Завтрашняя лекция посвящена тебе.",
      likes: 27,
    },
    {
      id: "post-1",
      author: "Наталия Джексон",
      date: "2025-03-20",
      text: "Ты подарил нам дом, полный света. Спасибо за каждое путешествие, за музыку и за любовь, которая всегда рядом.",
      likes: 42,
    },
  ],
  favorites: {
    saying: "«Мы — пыль звёзд, которая научилась любить»",
    book: "«Тихие голоса степи»",
    movie: "«Интерстеллар» — семейный просмотр каждый ноябрь",
    travel: "Ночные походы в предгорья Заилийского Алатау",
    color: "Глубокий синий оттенок ночного неба",
    fact: "Всегда носил с собой маленький телескоп, даже в командировки.",
  },
  service: {
    place: "Мемориальный зал «Лунный свет»",
    address: "Алматы, проспект Достык, 45",
    date: "2025-03-26 14:00",
    virtualUrl: "https://example.com/moon-ceremony",
  },
  donateBlurb:
    "Вместо цветов семья просит поддержать образовательные программы для сельских школ. Давид мечтал, чтобы у каждого ребёнка была возможность увидеть небо через телескоп.",
  familyTree: {
    self: {
      id: "self",
      name: "Давид Викторович Джексон",
      years: "1972—2025",
      relation: "self",
    },
    parents: [
      {
        id: "parent-1",
        name: "Иван Петрович Джексон",
        years: "1945—2010",
        relation: "parent",
      },
      {
        id: "parent-2",
        name: "Мария Петровна Джексон",
        years: "1947—2018",
        relation: "parent",
      },
    ],
    spouse: {
      id: "spouse",
      name: "Наталия Сергеевна Джексон",
      years: "1973—",
      relation: "spouse",
    },
    children: [
      {
        id: "child-1",
        name: "Эмили Давидовна Джексон",
        years: "2000—",
        relation: "child",
      },
      {
        id: "child-2",
        name: "Майкл Давидович Джексон",
        years: "2003—",
        relation: "child",
      },
    ],
  },
};
