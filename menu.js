const menuData = {
  /* ===================== SOUPS ===================== */
  pho_soups: [
    {
      key: "pho_ga_xao",
      price: 200,
      weight: 700,
      spicy: 0,
      tags: ["popular"],
      translations: {
        ru: "Суп Фо с курицей",
        ua: "Суп Фо з куркою",
        vn: "Phở gà xào",
      },
      short: "Ароматный бульон, рисовая лапша и курица. Классика Вьетнама."
    },
    {
      key: "pho_bo_xao",
      price: 200,
      weight: 700,
      spicy: 0,
      tags: ["popular"],
      translations: {
        ru: "Суп Фо с говядиной",
        ua: "Суп Фо з яловичиною",
        vn: "Phở bò ap chao",
      },
      short: "Насыщенный говяжий бульон, рисовая лапша и тонкие ломтики мяса."
    },
    {
      key: "pho_heo_xao",
      price: 200,
      weight: 700,
      spicy: 0,
      tags: [],
      translations: {
        ru: "Суп Фо со свининой",
        ua: "Суп Фо зі свининою",
        vn: "Phở heo ap chao",
      },
      short: "Лёгкий бульон, рисовая лапша и свинина — с зеленью и лаймом."
    },
    {
      key: "pho_tom",
      price: 200,
      weight: 700,
      spicy: 0,
      tags: [],
      translations: {
        ru: "Суп Фо с креветками",
        ua: "Суп Фо з креветками",
        vn: "Phở tôm",
      },
      short: "Ароматный бульон и креветки — морской вариант Фо."
    },
    {
      key: "pho_mix",
      price: 200,
      weight: 700,
      spicy: 0,
      tags: ["chef"],
      translations: {
        ru: "Суп Фо MIX",
        ua: "Суп Фо MIX",
        vn: "Phở mix",
      },
      short: "Микс — 4 вида начинки в одной порции (говядина + свинина + курица + 1 креветка + овощи)."
    }
  ],

  bun_soups: [
    {
      key: "bun_ga_xao",
      price: 200,
      weight: 700,
      spicy: 0,
      tags: [],
      translations: {
        ru: "Суп Бун с курицей",
        ua: "Суп Бун з куркою",
        vn: "Bún gà xao",
      },
      short: "Лёгкий бульон и рисовая вермишель (bún) с курицей."
    },
    {
      key: "bun_bo_xao",
      price: 200,
      weight: 700,
      spicy: 0,
      tags: [],
      translations: {
        ru: "Суп Бун с говядиной",
        ua: "Суп Бун з яловичиною",
        vn: "Bún bò",
      },
      short: "Рисовая вермишель и говядина в ароматном бульоне."
    },
    {
      key: "bun_heo_xao",
      price: 200,
      weight: 700,
      spicy: 0,
      tags: [],
      translations: {
        ru: "Суп Бун со свининой",
        ua: "Суп Бун зі свининою",
        vn: "Bún heo",
      },
      short: "Рисовая вермишель, свинина и зелень — лёгкий азиатский суп."
    },
    {
      key: "bun_tom",
      price: 200,
      weight: 700,
      spicy: 0,
      tags: [],
      translations: {
        ru: "Суп Бун с креветками",
        ua: "Суп Бун з креветками",
        vn: "Bún tôm",
      },
      short: "Нежный бульон, рисовая вермишель и креветки."
    },
    {
      key: "bun_mix",
      price: 200,
      weight: 700,
      spicy: 0,
      tags: ["chef"],
      translations: {
        ru: "Суп Бун MIX",
        ua: "Суп Бун MIX",
        vn: "Bún mix",
      },
      short: "Микс — 4 вида начинки в одной порции (говядина + свинина + курица + 1 креветка + овощи)."
    }
  ],

  salat_bun: [
    {
      key: "salat_bun_ga",
      price: 200,
      weight: 700,
      spicy: 0,
      tags: ["popular"],
      translations: {
        ru: "салат Бун с курицей",
        ua: "Холодний Бун з куркою",
        vn: "Bún Nam Bộ gà",
      },
      short: "Холодная рисовая лапша с овощами, соусом и курицей. Без бульона."
    },
    {
      key: "salat_bun_bo",
      price: 200,
      weight: 700,
      spicy: 0,
      tags: ["popular"],
      translations: {
        ru: "салат Бун с говядиной",
        ua: "салат Бун з яловичиною",
        vn: "Bún Nam Bộ bò",
      },
      short: "Холодная лапша, свежие овощи и говядина — ярко и сытно."
    },
    {
      key: "salat_bun_tom",
      price: 200,
      weight: 700,
      spicy: 0,
      tags: [],
      translations: {
        ru: "салат Бун с креветками",
        ua: "салат Бун з креветками",
        vn: "Bún Nam Bộ tôm",
      },
      short: "Холодная лапша с овощами и креветками. Освежает."
    },
    {
      key: "salat_bun_heo",
      price: 200,
      weight: 700,
      spicy: 0,
      tags: [],
      translations: {
        ru: "салат Бун со свининой",
        ua: "салат Бун зі свининою",
        vn: "Bún Nam Bộ heo",
      },
      short: "салат, свинина, овощи и соус."
    },
    {
      key: "salat_bun_nem",
      price: 200,
      weight: 700,
      spicy: 0,
      tags: ["chef"],
      translations: {
        ru: "салат Бун с ролл нэм",
        ua: "салат Бун з ролл нем",
        vn: "Bún nem nam Bộ",
      },
      short: "лапша Бун с овощами + хрустящий нем (спринг-ролл)."
    },
    {
      key: "salat_bun_mix",
      price: 200,
      weight: 700,
      spicy: 0,
      tags: ["chef"],
      translations: {
        ru: "салат Бун MIX",
        ua: "салат Бун MIX",
        vn: "Bún Nam Bộ mix",
      },
      short: "Микс — 4 вида начинки в одной порции (говядина + свинина + курица + 1 креветка + овощи)."
    }
  ],

  mien_soups: [
    {
      key: "mien_ga_xao",
      price: 200,
      weight: 700,
      spicy: 0,
      tags: [],
      translations: {
        ru: "Суп Миен с курицей (стеклянная лапша)",
        ua: "Суп Мієн з куркою (скляна локшина)",
        vn: "Miến gà",
      },
      short: "Прозрачная (стеклянная) лапша, курица и лёгкий бульон."
    },
    {
      key: "mien_bo_xao",
      price: 200,
      weight: 700,
      spicy: 0,
      tags: [],
      translations: {
        ru: "Суп Миен с говядиной (стеклянная лапша)",
        ua: "Суп Мієн з яловичиною (скляна локшина)",
        vn: "Miến bò",
      },
      short: "Стеклянная лапша и говядина — нежно и сытно."
    },
    {
      key: "mien_tom",
      price: 200,
      weight: 700,
      spicy: 0,
      tags: [],
      translations: {
        ru: "Суп Миен с креветками (стеклянная лапша)",
        ua: "Суп Мієн з креветками (скляна локшина)",
        vn: "Miến tôm",
      },
      short: "Стеклянная лапша, креветки и ароматный бульон."
    },
    {
      key: "mien_heo_xao",
      price: 200,
      weight: 700,
      spicy: 0,
      tags: [],
      translations: {
        ru: "Суп Миен со свининой (стеклянная лапша)",
        ua: "Суп Мієн зі свининою (скляна локшина)",
        vn: "Miến heo",
      },
      short: "Стеклянная лапша со свининой и зеленью."
    },
    {
      key: "mien_mix",
      price: 200,
      weight: 700,
      spicy: 0,
      tags: ["chef"],
      translations: {
        ru: "Суп Миен MIX (стеклянная лапша)",
        ua: "Суп Мієн MIX (скляна локшина)",
        vn: "Miến mix",
      },
      short: "Микс — 4 вида начинки в одной порции (говядина + свинина + курица + 1 креветка + овощи)."
    }
  ],

  mi_soups: [
    {
      key: "mi_xao_ga",
      price: 200,
      weight: 700,
      spicy: 0,
      tags: [],
      translations: {
        ru: "Суп Ми (яичная лапша) с курицей",
        ua: "Суп Мі (яєчна локшина) з куркою",
        vn: "Mì Tàu gà",
      },
      short: "Суп на яичной лапше: курица, зелень и ароматный бульон."
    },
    {
      key: "mi_xao_bo",
      price: 200,
      weight: 700,
      spicy: 0,
      tags: [],
      translations: {
        ru: "Суп Ми (яичная лапша) с говядиной",
        ua: "Суп Мі (яєчна локшина) з яловичиною",
        vn: "Mì Tàu bò",
      },
      short: "Яичная лапша в бульоне с говядиной — сытно и по-домашнему."
    },
    {
      key: "mi_xao_heo",
      price: 200,
      weight: 700,
      spicy: 0,
      tags: [],
      translations: {
        ru: "Суп Ми (яичная лапша) со свининой",
        ua: "Суп Мі (яєчна локшина) зі свининою",
        vn: "Mì Tàu heo",
      },
      short: "Яичная лапша, свинина, зелень — мягкий вкус."
    },
    {
      key: "mi_xao_tom",
      price: 200,
      weight: 700,
      spicy: 0,
      tags: [],
      translations: {
        ru: "Суп Ми (яичная лапша) с креветками",
        ua: "Суп Мі (яєчна локшина) з креветками",
        vn: "Mì Tàu tôm",
      },
      short: "Яичная лапша с креветками в ароматном бульоне."
    },
    {
      key: "mi_xao_mix",
      price: 200,
      weight: 700,
      spicy: 0,
      tags: ["chef"],
      translations: {
        ru: "Суп Ми MIX (лапша)",
        ua: "Суп Мі MIX (локшина)",
        vn: "Mì Tàu mix",
      },
      short: "Микс — 4 вида начинки в одной порции (говядина + свинина + курица + 1 креветка + овощи)."
    }
  ],

  /* ===================== WOK ===================== */
  wok_fried_pho: [
    {
      key: "pho_xao_ga",
      price: 200,
      weight: 700,
      spicy: 1,
      tags: ["popular"],
      translations: {
        ru: "Жареная рисовая лапша Фо с курицей (ВОК)",
        ua: "Смажена рисова локшина Фо з куркою (ВОК)",
        vn: "Phở xào gà",
      },
      short: "Рисовая лапша, овощи и курица, быстро обжарено в воке."
    },
    {
      key: "pho_xao_bo",
      price: 200,
      weight: 700,
      spicy: 1,
      tags: [],
      translations: {
        ru: "Жареная рисовая лапша Фо с говядиной (ВОК)",
        ua: "Смажена рисова локшина Фо з яловичиною (ВОК)",
        vn: "Phở xào bò",
      },
      short: "Рисовая лапша Фо, овощи и говядина — насыщенно и сытно."
    },
    {
      key: "pho_xao_heo",
      price: 200,
      weight: 700,
      spicy: 1,
      tags: [],
      translations: {
        ru: "Жареная рисовая лапша Фо со свининой (ВОК)",
        ua: "Смажена рисова локшина Фо зі свининою (ВОК)",
        vn: "Phở xào heo",
      },
      short: "Обжаренная лапша Фо со свининой и овощами."
    },
    {
      key: "pho_xao_tom",
      price: 200,
      weight: 700,
      spicy: 1,
      tags: [],
      translations: {
        ru: "Жареная рисовая лапша Фо с креветками (ВОК)",
        ua: "Смажена рисова локшина Фо з креветками (ВОК)",
        vn: "Phở xào tôm",
      },
      short: "Рисовая лапша, овощи и креветки — морской вок."
    },
    {
      key: "pho_xao_mix",
      price: 200,
      weight: 700,
      spicy: 1,
      tags: ["chef"],
      translations: {
        ru: "Жареная рисовая лапша Фо MIX (ВОК)",
        ua: "Смажена рисова локшина Фо MIX (ВОК)",
        vn: "Phở xào mix",
      },
      short: "Микс — 4 вида начинки в одной порции (говядина + свинина + курица + 1 креветка + овощи)."
    }
  ],

  wok_fried_mien: [
    {
      key: "mien_xao_ga",
      price: 200,
      weight: 700,
      spicy: 1,
      tags: [],
      translations: {
        ru: "Жареная стеклянная лапша Миен с курицей (ВОК)",
        ua: "Смажена скляна локшина Мієн з куркою (ВОК)",
        vn: "Miến xào gà",
      },
      short: "Стеклянная лапша, овощи и курица, обжарено в воке."
    },
    {
      key: "mien_xao_bo",
      price: 200,
      weight: 700,
      spicy: 1,
      tags: ["popular"],
      translations: {
        ru: "Жареная стеклянная лапша Миен с говядиной (ВОК)",
        ua: "Смажена скляна локшина Мієн з яловичиною (ВОК)",
        vn: "Miến xào bò",
      },
      short: "Стеклянная лапша Миен, овощи и говядина — насыщенно."
    },
    {
      key: "mien_xao_heo",
      price: 200,
      weight: 700,
      spicy: 1,
      tags: [],
      translations: {
        ru: "Жареная стеклянная лапша Миен со свининой (ВОК)",
        ua: "Смажена скляна локшина Мієн зі свининою (ВОК)",
        vn: "Miến xào heo",
      },
      short: "Стеклянная лапша со свининой и овощами, обжарено в воке."
    },
    {
      key: "mien_xao_tom",
      price: 200,
      weight: 700,
      spicy: 1,
      tags: [],
      translations: {
        ru: "Жареная стеклянная лапша Миен с креветками (ВОК)",
        ua: "Смажена скляна локшина Мієн з креветками (ВОК)",
        vn: "Miến xào tôm",
      },
      short: "Стеклянная лапша, овощи и креветки — быстрый вок."
    },
    {
      key: "mien_xao_mix",
      price: 200,
      weight: 700,
      spicy: 1,
      tags: ["chef"],
      translations: {
        ru: "Жареная стеклянная лапша Миен MIX (ВОК)",
        ua: "Смажена скляна локшина Мієн MIX (ВОК)",
        vn: "Miến xào mix",
      },
      short: "Микс — 4 вида начинки в одной порции (говядина + свинина + курица + 1 креветка + овощи)."
    }
  ],

  wok_fried_mi: [
    {
      key: "mi_xao_ga",
      price: 200,
      weight: 700,
      spicy: 1,
      tags: [],
      translations: {
        ru: "Жареная лапша Ми с курицей (ВОК)",
        ua: "Смажена локшина Мі з куркою (ВОК)",
        vn: "Mì xào gà",
      },
      short: "Яичная лапша, овощи и курица — быстро и сытно."
    },
    {
      key: "mi_xao_bo",
      price: 200,
      weight: 700,
      spicy: 1,
      tags: ["popular"],
      translations: {
        ru: "Жареная лапша Ми с говядиной (ВОК)",
        ua: "Смажена локшина Мі з яловичиною (ВОК)",
        vn: "Mì xào bò",
      },
      short: "Лапша, овощи и говядина — насыщенный вкус вок."
    },
    {
      key: "mi_xao_heo",
      price: 200,
      weight: 700,
      spicy: 1,
      tags: [],
      translations: {
        ru: "Жареная лапша Ми со свининой (ВОК)",
        ua: "Смажена локшина Мі зі свининою (ВОК)",
        vn: "Mì xào heo",
      },
      short: "Лапша, овощи и свинина — быстро обжарено в воке."
    },
    {
      key: "mi_xao_tom",
      price: 200,
      weight: 700,
      spicy: 1,
      tags: [],
      translations: {
        ru: "Жареная лапша Ми с креветками (ВОК)",
        ua: "Смажена локшина Мі з креветками (ВОК)",
        vn: "Mì xào tôm",
      },
      short: "Лапша с креветками и овощами — морской вок."
    },
    {
      key: "mi_xao_mix",
      price: 200,
      weight: 700,
      spicy: 1,
      tags: ["chef"],
      translations: {
        ru: "Жареная лапша Ми MIX (ВОК)",
        ua: "Смажена локшина Мі MIX (ВОК)",
        vn: "Mì xào mix",
      },
      short: "Микс — 4 вида начинки в одной порции (говядина + свинина + курица + 1 креветка + овощи)."
    }
  ],

  /* ===================== RICE ===================== */
  rice_braised: [
    {
      key: "com_thit_ga_xao",
      price: 200,
      weight: 700,
      spicy: 0,
      tags: ["popular"],
      translations: {
        ru: "Рис с курицей",
        ua: "Рис з куркою",
        vn: "Cơm thịt gà xao",
      },
      short: "Рис + тушёная курица в соусе. Домашний вьетнамский вкус."
    },
    {
      key: "com_thit_bo_xao",
      price: 200,
      weight: 700,
      spicy: 0,
      tags: [],
      translations: {
        ru: "Рис с говядиной",
        ua: "Рис з яловичиною",
        vn: "Cơm thịt bò kho",
      },
      short: "Рис с говядиной, тушёной в ароматных специях."
    },
    {
      key: "com_thit_heo_xao",
      price: 200,
      weight: 700,
      spicy: 0,
      tags: [],
      translations: {
        ru: "Рис с свининой",
        ua: "Рис з свининою",
        vn: "Cơm thịt heo xao",
      },
      short: "Рис и тушёная свинина — сытно и по-домашнему."
    },
    {
      key: "com_tom",
      price: 200,
      weight: 700,
      spicy: 0,
      tags: [],
      translations: {
        ru: "Рис с тушёными креветками",
        ua: "Рис з тушкованими креветками",
        vn: "Cơm tôm kho",
      },
      short: "Рис и креветки в соусе — морской вариант."
    },
    {
      key: "com_nem",
      price: 200,
      weight: 700,
      spicy: 0,
      tags: ["chef"],
      translations: {
        ru: "Рис с нем",
        ua: "Рис з нем",
        vn: "Cơm nem",
      },
      short: "Рис + хрустящий нем. Просто, понятно, вкусно."
    },
    {
      key: "com_mix",
      price: 200,
      weight: 700,
      spicy: 0,
      tags: ["chef"],
      translations: {
        ru: "Рис MIX",
        ua: "Рис MIX",
        vn: "Cơm mix",
      },
      short: "Микс — 4 вида начинки в одной порции (говядина + свинина + курица + 1 креветка + овощи)."
    }
  ],

  fried_rice: [
    {
      key: "com_rang_ga",
      price: 200,
      weight: 700,
      spicy: 0,
      tags: ["popular"],
      translations: {
        ru: "Жареный рис с курицей",
        ua: "Смажений рис з куркою",
        vn: "Cơm rang gà",
      },
      short: "Обжаренный рис с овощами и курицей."
    },
    {
      key: "com_rang_bo",
      price: 200,
      weight: 700,
      spicy: 0,
      tags: [],
      translations: {
        ru: "Жареный рис с говядиной",
        ua: "Смажений рис з яловичиною",
        vn: "Cơm rang bò",
      },
      short: "Жареный рис, овощи и говядина — сытно."
    },
    {
      key: "com_rang_tom",
      price: 200,
      weight: 700,
      spicy: 0,
      tags: [],
      translations: {
        ru: "Жареный рис с креветками",
        ua: "Смажений рис з креветками",
        vn: "Cơm rang tôm",
      },
      short: "Жареный рис с креветками и овощами."
    },
    {
      key: "com_rang_heo",
      price: 200,
      weight: 700,
      spicy: 0,
      tags: [],
      translations: {
        ru: "Жареный рис со свининой",
        ua: "Смажений рис зі свининою",
        vn: "Cơm rang heo",
      },
      short: "Жареный рис со свининой — классика."
    },
    {
      key: "com_rang_nem",
      price: 200,
      weight: 700,
      spicy: 0,
      tags: ["chef"],
      translations: {
        ru: "Жареный рис с нем",
        ua: "Смажений рис з нем",
        vn: "Cơm rang nem",
      },
      short: "Жареный рис с нем — просто и вкусно."
    },
    {
      key: "com_rang_mix",
      price: 200,
      weight: 700,
      spicy: 0,
      tags: ["chef"],
      translations: {
        ru: "Жареный рис MIX",
        ua: "Смажений рис MIX",
        vn: "Cơm rang mix",
      },
      short: "Микс — 4 вида начинки в одной порции (говядина + свинина + курица + 1 креветка + овощи)."
    }
  ],

  /* ===================== APPETIZERS ===================== */
  appetizers: [
    {
      key: "nem_ran",
      price: 200,
      weight: 700,
      spicy: 0,
      tags: ["popular"],
      translations: {
        ru: "Нэм жареный",
        ua: "Нем смажений",
        vn: "Nem rán",
      },
      short: "Хрустящие рулетики с начинкой, подаются с соусом."
    },
    {
      key: "spring_rolls",
      price: 200,
      weight: 700,
      spicy: 0,
      tags: [],
      translations: {
        ru: "Спринг-роллы",
        ua: "Спрінг-роли",
        vn: "Gỏi cuốn",
      },
      short: "Свежие роллы с овощами (и начинкой по выбору), лёгкие и сочные."
    }
  ],

  /* ===================== DRINKS ===================== */
  drinks: [
    {
      key: "bo_huc",
      price: 80,
      weight: 250,
      spicy: 0,
      tags: [],
      translations: {
        ru: "Энергетик (Bò Húc)",
        ua: "Енергетик (Bò Húc)",
        vn: "Nước bò húc",
      },
      short: "Вьетнамский энергетик. Бодрит сильнее, чем мысли о дедлайне."
    },
    {
      key: "caphe_viet",
      price: 50,
      weight: 250,
      spicy: 0,
      tags: ["popular"],
      translations: {
        ru: "Вьетнамский кофе",
        ua: "В’єтнамська кава",
        vn: "Cà phê Việt",
      },
      short: "Крепкий кофе со сгущённым молоком (по желанию)."
    },
    {
      key: "pepsi_03_sklo",
      price: 69,
      weight: 300,
      spicy: 0,
      tags: [],
      translations: {
        ru: "Pepsi 0.3 л (скло)",
        ua: "Pepsi 0.3 л (скло)",
        vn: "Pepsi 0.3 l (chai thủy tinh)",
      },
      short: ""
    },
    {
      key: "pepsi_033_jb",
      price: 59,
      weight: 330,
      spicy: 0,
      tags: [],
      translations: {
        ru: "Pepsi 0.33 л (ж/б)",
        ua: "Pepsi 0.33 л (ж/б)",
        vn: "Pepsi 0.33 l (lon)",
      },
      short: ""
    },
    {
      key: "pepsi_05",
      price: 69,
      weight: 500,
      spicy: 0,
      tags: [],
      translations: {
        ru: "Pepsi 0.5 л",
        ua: "Pepsi 0.5 л",
        vn: "Pepsi 0.5 l",
      },
      short: ""
    },
    {
      key: "pepsi_black_05",
      price: 69,
      weight: 500,
      spicy: 0,
      tags: [],
      translations: {
        ru: "Pepsi Black 0.5 л",
        ua: "Pepsi Black 0.5 л",
        vn: "Pepsi Black 0.5 l",
      },
      short: ""
    },
    {
      key: "pepsi_cherry_05",
      price: 69,
      weight: 500,
      spicy: 0,
      tags: [],
      translations: {
        ru: "Pepsi Cherry 0.5 л",
        ua: "Pepsi Cherry 0.5 л",
        vn: "Pepsi Cherry 0.5 l",
      },
      short: ""
    },
    {
      key: "mirinda_orange_05",
      price: 69,
      weight: 500,
      spicy: 0,
      tags: [],
      translations: {
        ru: "Mirinda Orange 0.5 л",
        ua: "Mirinda Orange 0.5 л",
        vn: "Mirinda Orange 0.5 l",
      },
      short: ""
    },
    {
      key: "seven_up_05",
      price: 69,
      weight: 500,
      spicy: 0,
      tags: [],
      translations: {
        ru: "7UP 0.5 л",
        ua: "7UP 0.5 л",
        vn: "7UP 0.5 l",
      },
      short: ""
    },
    {
      key: "karpatska_djerelna_negaz_05",
      price: 39,
      weight: 500,
      spicy: 0,
      tags: [],
      translations: {
        ru: "Карпатська джерельна негаз 0.5 л",
        ua: "Карпатська джерельна негаз 0.5 л",
        vn: "Nước suối Karpatska không gas 0.5 l",
      },
      short: ""
    },
    {
      key: "karpatska_djerelna_gaz_05",
      price: 39,
      weight: 500,
      spicy: 0,
      tags: [],
      translations: {
        ru: "Карпатська джерельна газ 0.5 л",
        ua: "Карпатська джерельна газ 0.5 л",
        vn: "Nước suối Karpatska có gas 0.5 l",
      },
      short: ""
    },
    {
      key: "sadochok_multifrukht_05",
      price: 69,
      weight: 500,
      spicy: 0,
      tags: [],
      translations: {
        ru: "Садочок Мультифрукт 0.5 л",
        ua: "Садочок Мультифрукт 0.5 л",
        vn: "Nước trái cây Sadochok đa vị 0.5 l",
      },
      short: ""
    },
    {
      key: "sadochok_tomatniy_05",
      price: 75,
      weight: 500,
      spicy: 0,
      tags: [],
      translations: {
        ru: "Садочок Томатний 0.5 л",
        ua: "Садочок Томатний 0.5 л",
        vn: "Nước cà chua Sadochok 0.5 l",
      },
      short: ""
    }
  ]
};

/* Optional: if you want fixed order of categories on page */
(function orderKeys(){
  const order = [
    "pho_soups",
    "bun_soups",
    "salat_bun",
    "mien_soups",
    "mi_soups",
    "wok_fried_pho",
    "wok_fried_mien",
    "wok_fried_mi",
    "rice_braised",
    "fried_rice",
    "appetizers",
    "drinks"
  ];
  const out = {};
  order.forEach(k => { if (menuData[k]) out[k] = menuData[k]; });
  Object.keys(menuData).forEach(k => { if (!out[k]) out[k] = menuData[k]; });
  // replace object in-place
  for (const k of Object.keys(menuData)) delete menuData[k];
  for (const k of Object.keys(out)) menuData[k] = out[k];
})();

/* =========================================================
   ✅ GLOBAL INGREDIENT OPTIONS + CUSTOM BASE FOR "Собери сам"
   - Protein REQUIRED, max 2
   - Sauces REQUIRED, max 2
   - Veggies optional, max 4
   - Addons optional, max 3
   - Coffee options for drinks (ice / condensed milk / sugar)
   - "Собери сам" gets: is_custom_builder=true, custom_base=<category>
   ========================================================= */
(function(){
  const CAT_BASE_RU = {
    pho_soups: "Фо (суп)",
    bun_soups: "Бун (суп)",
    salat_bun: "салат Бун",
    mien_soups: "Миен (суп)",
    mi_soups: "Ми (суп)",
    wok_fried_pho: "ВОК: жареный Фо",
    wok_fried_mien: "ВОК: жареный Миен",
    wok_fried_mi: "ВОК: жареная лапша",
    rice_braised: "Рис: тушёные",
    fried_rice: "Рис: жареный",
    appetizers: "Закуски",
    drinks: "Напитки",
    top: "TOP"
  };

  const FOOD_INGREDIENTS = [
    {
      id: "protein",
      title: { ru:"Белок", ua:"Білок", vn:"Đạm" },
      required: true,
      multi: true,
      max: 2,
      items: [
        { id:"chicken_50",  label:{ru:"Курица 50г",  vn:"Gà 50g"},  price_delta: 7 },
        { id:"chicken_100", label:{ru:"Курица 100г", vn:"Gà 100g"}, price_delta: 14 },
        { id:"chicken_150", label:{ru:"Курица 150г", vn:"Gà 150g"}, price_delta: 21 },

        { id:"pork_50",  label:{ru:"Свинина 50г",  vn:"Heo 50g"},  price_delta: 7 },
        { id:"pork_100", label:{ru:"Свинина 100г", vn:"Heo 100g"}, price_delta: 14 },
        { id:"pork_150", label:{ru:"Свинина 150г", vn:"Heo 150g"}, price_delta: 21 },

        { id:"beef_50",  label:{ru:"Говядина 50г",  vn:"Bò 50g"},  price_delta: 8 },
        { id:"beef_100", label:{ru:"Говядина 100г", vn:"Bò 100g"}, price_delta: 16 },
        { id:"beef_150", label:{ru:"Говядина 150г", vn:"Bò 150g"}, price_delta: 24 },

        { id:"tofu_50",  label:{ru:"Тофу 50г",  vn:"Đậu phụ 50g"},  price_delta: 6 },
        { id:"tofu_100", label:{ru:"Тофу 100г", vn:"Đậu phụ 100g"}, price_delta: 12 },
        { id:"tofu_150", label:{ru:"Тофу 150г", vn:"Đậu phụ 150g"}, price_delta: 18 },

        { id:"shrimp_1", label:{ru:"1 креветка (30г)", vn:"1 con tôm (30g)"}, price_delta: 6 },
        { id:"shrimp_2", label:{ru:"2 креветки (60г)", vn:"2 con tôm (60g)"}, price_delta: 12 },
        { id:"shrimp_4", label:{ru:"4 креветки (120г)", vn:"4 con tôm (120g)"}, price_delta: 24 },
        { id:"shrimp_6", label:{ru:"6 креветок (180г)", vn:"6 con tôm (180g)"}, price_delta: 36 }
      ]
    },
    {
      id: "veggies",
      title: { ru:"Овощи", ua:"Овочі", vn:"Rau" },
      required: false,
      multi: true,
      max: 4,
      items: [
        { id:"wok_veg", label:{ru:"овощи wok", vn:"rau xào"}, price_delta: 6 },
        { id:"corn",    label:{ru:"кукуруза", vn:"hạt ngô"}, price_delta: 4 },
        { id:"sprouts", label:{ru:"ростки", vn:"hạt đỗ"}, price_delta: 4 },
        { id:"carrot",  label:{ru:"морковь", vn:"cà rốt"}, price_delta: 3 },
        { id:"scall",   label:{ru:"зелёный лук", vn:"hành lá"}, price_delta: 3 }
      ]
    },
    {
      id: "addons",
      title: { ru:"Добавки", ua:"Додатки", vn:"Topping" },
      required: false,
      multi: true,
      max: 3,
      items: [
        { id:"onion",       label:{ru:"лук", vn:"hành củ"}, price_delta: 3 },
        { id:"fried_onion", label:{ru:"жареный лук", vn:"hành khô"}, price_delta: 4 },
        { id:"peanut",      label:{ru:"арахис", vn:"hạt lạc"}, price_delta: 5 }
      ]
    },
    {
      id: "sauces",
      title: { ru:"Соусы", ua:"Соуси", vn:"Nước chấm" },
      required: true,
      multi: true,
      max: 2,
      items: [
        { id:"sweet_sour", label:{ru:"кисло-сладкий", vn:"chua ngọt"}, price_delta: 3 },
        { id:"fish",       label:{ru:"рыбный соус", vn:"nước mắm"}, price_delta: 3 },
        { id:"soy",        label:{ru:"соевый соус", vn:"xì dầu"}, price_delta: 2 },
        { id:"chili",      label:{ru:"острый перец", vn:"ớt cay"}, price_delta: 2 },
        { id:"nem",        label:{ru:"соус для nem", vn:"nước mắm nem"}, price_delta: 3 }
      ]
    }
  ];

  const COFFEE_OPTIONS = [
    {
      id: "ice",
      title: { ru:"Лёд", ua:"Лід", vn:"Đá" },
      required: false,
      multi: false,
      items: [
        { id:"no_ice", label:{ru:"Без льда", vn:"Không đá"}, price_delta: 0 },
        { id:"ice",    label:{ru:"Со льдом", vn:"Có đá"}, price_delta: 0 }
      ]
    },
    {
      id: "milk",
      title: { ru:"Молоко", ua:"Молоко", vn:"Sữa" },
      required: false,
      multi: false,
      items: [
        { id:"no_milk", label:{ru:"Без", vn:"Không"}, price_delta: 0 },
        { id:"cond",    label:{ru:"Сгущённое", vn:"Sữa đặc"}, price_delta: 5 }
      ]
    },
    {
      id: "sugar",
      title: { ru:"Сахар", ua:"Цукор", vn:"Đường" },
      required: false,
      multi: false,
      items: [
        { id:"0", label:{ru:"0%", vn:"0%"}, price_delta: 0 },
        { id:"25", label:{ru:"25%", vn:"25%"}, price_delta: 0 },
        { id:"50", label:{ru:"50%", vn:"50%"}, price_delta: 0 },
        { id:"75", label:{ru:"75%", vn:"75%"}, price_delta: 0 },
        { id:"100", label:{ru:"100%", vn:"100%"}, price_delta: 0 }
      ]
    }
  ];

  const deepClone = (o) => JSON.parse(JSON.stringify(o));

  function ensureOptionGroup(item, group){
    if (!item.options) item.options = [];
    const exists = item.options.some(g => g && g.id === group.id);
    if (!exists) item.options.push(deepClone(group));
  }

  function applyFoodIngredientsToItem(item){
    FOOD_INGREDIENTS.forEach(g => ensureOptionGroup(item, g));
  }

  function applyCoffeeOptionsToItem(item){
    if (!item.options) item.options = [];
    COFFEE_OPTIONS.forEach(g => ensureOptionGroup(item, g));
  }

  function makeBuilderItem(catKey){
    const base = CAT_BASE_RU[catKey] || catKey;

    const META = {
      pho_soups:   {
      name: "Собери сам Фо (супы)", id:"custom_pho_soups",   key:"build_pho_soup",   name_ru:"Собери сам Фо (супы)",        image: "images/build_pho_soup.png" },
      bun_soups:   {
      name: "Собери сам Бун (супы)", id:"custom_bun_soups",   key:"build_bun_soup",   name_ru:"Собери сам Бун (супы)",       image: "images/build_bun_soup.png" },
      salat_bun:    {
      name: "Собери сам салат Бун", id:"custom_salat_bun",    key:"salat_bun",    name_ru:"Собери сам salat Бун",     image: "images/build_salat_bun.png" },
      mien_soups:  {
      name: "Собери сам Миен (супы)", id:"custom_mien_soups",  key:"build_mien_soup",  name_ru:"Собери сам Миен (супы)",      image: "images/build_mien_soup.png" },
      mi_soups:    {
      name: "Собери сам Ми (супы)", id:"custom_mi_soups",    key:"build_mi_soup",    name_ru:"Собери сам Ми (супы)",        image: "images/build_mi_soup.png" },
      wok_fried_pho:{
      name: "Собери сам ВОК: жареный Фо",id:"custom_wok_pho",     key:"build_wok_pho",     name_ru:"Собери сам ВОК: жареный Фо",   image: "images/build_wok_pho.png" },
      wok_fried_mien:{
      name: "Собери сам ВОК: жареный Миен",id:"custom_wok_mien",   key:"build_wok_mien",    name_ru:"Собери сам ВОК: жареный Миен", image: "images/build_wok_mien.png" },
      wok_fried_mi:{
      name: "Собери сам ВОК: жареная лапша", id:"custom_wok_mi",      key:"build_wok_mi",      name_ru:"Собери сам ВОК: жареная лапша",image: "images/build_wok_mi.png" },
      rice_braised:{
      name: "Собери сам Рис: тушёные", id:"custom_rice_braised",key:"build_rice_braised",name_ru:"Собери сам Рис: тушёные",      image: "images/build_rice_braised.png" },
      fried_rice:  {
      name: "Собери сам Рис: жареный", id:"custom_fried_rice",  key:"build_fried_rice",  name_ru:"Собери сам Рис: жареный",      image: "images/build_fried_rice.png" },
      appetizers:  {
      name: "Собери сам spring roll", id:"custom_spring_roll", key:"build_spring_roll", name_ru:"Собери сам spring roll",       image: "images/build_spring_roll.png",
      price: 120, base_override:"Spring roll" }
    };

    const meta = META[catKey] || { id:`custom_${catKey}`, key:`custom_${catKey}`, name_ru:"Собери сам", image:"images/build/build_custom.png" };
    const baseForThis = meta.base_override || base;

    return {
      id: meta.id,
      key: meta.key,
      name: meta.name_ru,
      image: meta.image,
      price: (meta.price ?? 120),
      weight: 0,
      spicy: 0,
      tags: ["custom","featured"],
      custom: true,
      is_custom_builder: true,
      custom_base: baseForThis,
      base: baseForThis,
      translations: {
        ru: meta.name_ru,
        ua: meta.name_ru,   // если захочешь — позже добавим нормальные переводы
        vn: "Tự chọn"
      },
      short: `База: ${baseForThis}`
    };
  }

  function ensureTopCategory(){
    if (menuData.top) return;
    // Try to find Vietnamese coffee in drinks
    let coffee = null;
    try{
      const d = menuData.drinks || [];
      coffee = d.find(x => (x.key && String(x.key).toLowerCase().includes("caphe")) ||
                           (x.image && String(x.image).toLowerCase().includes("caphe")) ||
                           (x.translations && x.translations.ru && String(x.translations.ru).toLowerCase().includes("кава")));
    }catch(_){}
    menuData.top = [];
    if (coffee) menuData.top.push(coffee);
  }

  function injectBuildersPerCategory(){
    const foodCats = Object.keys(menuData).filter(k => k !== "drinks" && k !== "top");
    foodCats.forEach(k => {
      const arr = menuData[k];
      if (!Array.isArray(arr) || arr.length === 0) return;

      // if first already builder, ensure fields and base
      const first = arr[0];
      if (first && first.is_custom_builder){
        first.custom_base = first.custom_base || (CAT_BASE_RU[k] || k);
        return;
      }
      const builder = makeBuilderItem(k);
      // add ingredient groups to builder too
      applyFoodIngredientsToItem(builder);
      arr.unshift(builder);
    });
  }

  function applyIngredientsEverywhere(){
    for (const [catKey, arr] of Object.entries(menuData)){
      if (!Array.isArray(arr)) continue;

      arr.forEach(item => {
        if (!item || typeof item !== "object") return;

        // Mark builder items with base
        if (item.is_custom_builder){
          item.custom_base = item.custom_base || (CAT_BASE_RU[catKey] || catKey);
        }

        if (catKey === "drinks" || (item.tags || []).includes("drink")){
          applyCoffeeOptionsToItem(item);
        } else {
          applyFoodIngredientsToItem(item);
        }
      });
    }
  }

  // Do it
  ensureTopCategory();
  injectBuildersPerCategory();
  applyIngredientsEverywhere();
})();