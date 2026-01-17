/* Auto-generated menu.js — Cyber Dragon / Mobile Web App (PRICE UPDATE) */
(() => {
  /* ========= Reusable options (one style) ========= */

  const extrasSoup = {
    id: "extras",
    title: {
      ru: "Добавки",
      ua: "Додатки",
      en: "Extras",
      vn: "Topping",
      pl: "Dodatki",
      de: "Extras",
      zh: "加料"
    },
    required: false,
    multi: true,
    max: 3,
    items: [
      {
        id: "extra_greens",
        label: {
          ru: "Больше зелени",
          ua: "Більше зелені",
          en: "Extra greens",
          vn: "Thêm rau thơm",
          pl: "Więcej zieleniny",
          de: "Mehr Kräuter",
          zh: "加香草"
        },
        price_delta: 10
      },
      {
        id: "chili",
        label: {
          ru: "Чили",
          ua: "Чилі",
          en: "Chili",
          vn: "Ớt",
          pl: "Chili",
          de: "Chili",
          zh: "辣椒"
        },
        price_delta: 5
      },
      {
        id: "lime",
        label: {
          ru: "Лайм",
          ua: "Лайм",
          en: "Lime",
          vn: "Chanh",
          pl: "Limonka",
          de: "Limette",
          zh: "青柠"
        },
        price_delta: 5
      }
    ]
  };

  const extrasWok = {
    id: "extras",
    title: {
      ru: "Добавки",
      ua: "Додатки",
      en: "Extras",
      vn: "Topping",
      pl: "Dodatki",
      de: "Extras",
      zh: "加料"
    },
    required: false,
    multi: true,
    max: 3,
    items: [
      {
        id: "extra_vegetables",
        label: {
          ru: "Больше овощей",
          ua: "Більше овочів",
          en: "Extra vegetables",
          vn: "Thêm rau củ",
          pl: "Więcej warzyw",
          de: "Mehr Gemüse",
          zh: "加蔬菜"
        },
        price_delta: 15
      },
      {
        id: "fried_egg",
        label: {
          ru: "Жареное яйцо",
          ua: "Смажене яйце",
          en: "Fried egg",
          vn: "Trứng ốp la",
          pl: "Jajko sadzone",
          de: "Spiegelei",
          zh: "煎蛋"
        },
        price_delta: 20
      },
      {
        id: "chili",
        label: {
          ru: "Чили",
          ua: "Чилі",
          en: "Chili",
          vn: "Ớt",
          pl: "Chili",
          de: "Chili",
          zh: "辣椒"
        },
        price_delta: 5
      }
    ]
  };

  const extrasRice = {
    id: "extras",
    title: {
      ru: "Добавки",
      ua: "Додатки",
      en: "Extras",
      vn: "Topping",
      pl: "Dodatki",
      de: "Extras",
      zh: "加料"
    },
    required: false,
    multi: true,
    max: 3,
    items: [
      {
        id: "fried_egg",
        label: {
          ru: "Жареное яйцо",
          ua: "Смажене яйце",
          en: "Fried egg",
          vn: "Trứng ốp la",
          pl: "Jajko sadzone",
          de: "Spiegelei",
          zh: "煎蛋"
        },
        price_delta: 20
      },
      {
        id: "extra_vegetables",
        label: {
          ru: "Больше овощей",
          ua: "Більше овочів",
          en: "Extra vegetables",
          vn: "Thêm rau củ",
          pl: "Więcej warzyw",
          de: "Mehr Gemüse",
          zh: "加蔬菜"
        },
        price_delta: 15
      },
      {
        id: "chili",
        label: {
          ru: "Чили",
          ua: "Чилі",
          en: "Chili",
          vn: "Ớt",
          pl: "Chili",
          de: "Chili",
          zh: "辣椒"
        },
        price_delta: 5
      }
    ]
  };

  /* ========= Final menuData ========= */

  const menuData = {
    pho_soups: [
      {
        key: "pho_ga",
        price: 200,
        weight: 550,
        unit: "g",
        spicy: 0,
        tags: ["popular"],
        translations: {
          ru: "Суп Фо с курицей",
          ua: "Суп Фо з куркою",
          en: "Pho Soup with Chicken",
          vn: "Phở gà",
          pl: "Zupa Pho z kurczakiem",
          de: "Pho-Suppe mit Huhn",
          zh: "鸡肉河粉汤"
        },
        short: {
          ru: "Ароматный бульон, рисовая лапша и курица.",
          ua: "Ароматний бульйон, рисова локшина та курка.",
          en: "Fragrant broth with rice noodles and chicken.",
          vn: "Nước dùng thơm, bánh phở và thịt gà.",
          pl: "Aromatyczny bulion, makaron ryżowy i kurczak.",
          de: "Duftende Brühe, Reisnudeln und Huhn.",
          zh: "香浓高汤、米粉与鸡肉。"
        },
        options: [extrasSoup]
      },
      {
        key: "pho_bo",
        price: 200,
        weight: 550,
        unit: "g",
        spicy: 0,
        tags: ["popular"],
        translations: {
          ru: "Суп Фо с говядиной",
          ua: "Суп Фо з яловичиною",
          en: "Pho Soup with Beef",
          vn: "Phở bò",
          pl: "Zupa Pho z wołowiną",
          de: "Pho-Suppe mit Rind",
          zh: "牛肉河粉汤"
        },
        short: {
          ru: "Насыщенный бульон, рисовая лапша и говядина.",
          ua: "Насичений бульйон, рисова локшина та яловичина.",
          en: "Rich broth with rice noodles and beef.",
          vn: "Nước dùng đậm đà, bánh phở và thịt bò.",
          pl: "Bogaty bulion, makaron ryżowy i wołowina.",
          de: "Kräftige Brühe, Reisnudeln und Rind.",
          zh: "浓郁高汤、米粉与牛肉。"
        },
        options: [extrasSoup]
      },
      {
        key: "pho_heo",
        price: 200,
        weight: 550,
        unit: "g",
        spicy: 0,
        tags: [],
        translations: {
          ru: "Суп Фо со свининой",
          ua: "Суп Фо зі свининою",
          en: "Pho Soup with Pork",
          vn: "Phở heo",
          pl: "Zupa Pho z wieprzowiną",
          de: "Pho-Suppe mit Schwein",
          zh: "猪肉河粉汤"
        },
        short: {
          ru: "Лёгкий бульон, рисовая лапша и свинина — с зеленью.",
          ua: "Легкий бульйон, рисова локшина та свинина — із зеленню.",
          en: "Light broth with rice noodles and pork — with herbs.",
          vn: "Nước dùng nhẹ, bánh phở và thịt heo — kèm rau thơm.",
          pl: "Lekki bulion, makaron ryżowy i wieprzowina — z zieleniną.",
          de: "Leichte Brühe, Reisnudeln und Schwein — mit Kräutern.",
          zh: "清淡高汤、米粉与猪肉 — 搭配香草。"
        },
        options: [extrasSoup]
      }
    ],

    bun_soups: [
      {
        key: "bun_ga",
        price: 200,
        weight: 550,
        unit: "g",
        spicy: 0,
        tags: ["popular"],
        translations: {
          ru: "Суп Бун с курицей",
          ua: "Суп Бун з куркою",
          en: "Bun Soup with Chicken",
          vn: "Bún gà",
          pl: "Zupa Bún z kurczakiem",
          de: "Bún-Suppe mit Huhn",
          zh: "鸡肉米粉汤"
        },
        short: {
          ru: "Рисовая вермишель в ароматном бульоне с курицей.",
          ua: "Рисова вермішель в ароматному бульйоні з куркою.",
          en: "Rice vermicelli in fragrant broth with chicken.",
          vn: "Bún tươi trong nước dùng thơm với thịt gà.",
          pl: "Makaron ryżowy w aromatycznym bulionie z kurczakiem.",
          de: "Reisnudeln in duftender Brühe mit Huhn.",
          zh: "香浓高汤配米粉与鸡肉。"
        },
        options: [extrasSoup]
      },
      {
        key: "bun_bo",
        price: 200,
        weight: 550,
        unit: "g",
        spicy: 0,
        tags: ["popular"],
        translations: {
          ru: "Суп Бун с говядиной",
          ua: "Суп Бун з яловичиною",
          en: "Bun Soup with Beef",
          vn: "Bún bò",
          pl: "Zupa Bún z wołowiną",
          de: "Bún-Suppe mit Rind",
          zh: "牛肉米粉汤"
        },
        short: {
          ru: "Рисовая вермишель в говяжьем бульоне — с зеленью.",
          ua: "Рисова вермішель у яловичому бульйоні — із зеленню.",
          en: "Rice vermicelli in beef broth — with herbs.",
          vn: "Bún trong nước dùng bò — kèm rau thơm.",
          pl: "Makaron ryżowy w bulionie wołowym — z zieleniną.",
          de: "Reisnudeln in Rinderbrühe — mit Kräutern.",
          zh: "牛肉高汤配米粉 — 搭配香草。"
        },
        options: [extrasSoup]
      }
    ],

    bun_nam_bo: [
      {
        key: "bun_nem_nam_bo",
        price: 200,
        weight: 520,
        unit: "g",
        spicy: 0,
        tags: ["popular"],
        translations: {
          ru: "Бун Нам Бо с жареными спринг-роллами",
          ua: "Бун Нам Бо зі смаженими спрінг-ролами",
          en: "Bun Nam Bo with Fried Spring Rolls",
          vn: "Bún nem Nam Bộ",
          pl: "Bún Nam Bộ ze smażonymi spring rollsami",
          de: "Bún Nam Bộ mit frittierten Spring Rolls",
          zh: "南部风味拌米粉配炸春卷"
        },
        short: {
          ru: "Рисовая лапша, nem rán, свежая зелень и соус.",
          ua: "Рисова локшина, nem rán, свіжа зелень і соус.",
          en: "Rice noodles, fried spring rolls, fresh herbs and sauce.",
          vn: "Bún, nem rán, rau thơm và nước sốt.",
          pl: "Makaron ryżowy, smażone spring rollsy, zielenina i sos.",
          de: "Reisnudeln, frittierte Spring Rolls, Kräuter und Sauce.",
          zh: "米粉、炸春卷、香草与酱汁。"
        },
        options: [extrasWok]
      }
    ],

    wok_fried_mien: [
      {
        key: "mien_xao_ga",
        price: 200,
        weight: 450,
        unit: "g",
        spicy: 1,
        tags: ["popular"],
        translations: {
          ru: "Жареная стеклянная лапша Миен с курицей (WOK)",
          ua: "Смажена скляна локшина Мієн з куркою (WOK)",
          en: "WOK Fried Glass Noodles with Chicken",
          vn: "Miến xào gà",
          pl: "Smażony makaron szklany z kurczakiem (WOK)",
          de: "Gebratene Glasnudeln mit Huhn (WOK)",
          zh: "鸡肉炒粉丝（WOK）"
        },
        short: {
          ru: "Стеклянная лапша, курица, овощи и соус.",
          ua: "Скляна локшина, курка, овочі та соус.",
          en: "Glass noodles with chicken, vegetables and sauce.",
          vn: "Miến xào với gà, rau và nước sốt.",
          pl: "Makaron szklany z kurczakiem, warzywami i sosem.",
          de: "Glasnudeln mit Huhn, Gemüse und Sauce.",
          zh: "粉丝配鸡肉、蔬菜与酱汁。"
        },
        options: [extrasWok]
      },
      {
        key: "mien_xao_bo",
        price: 200,
        weight: 450,
        unit: "g",
        spicy: 1,
        tags: ["popular"],
        translations: {
          ru: "Жареная стеклянная лапша Миен с говядиной (WOK)",
          ua: "Смажена скляна локшина Мієн з яловичиною (WOK)",
          en: "WOK Fried Glass Noodles with Beef",
          vn: "Miến xào bò",
          pl: "Smażony makaron szklany z wołowiną (WOK)",
          de: "Gebratene Glasnudeln mit Rind (WOK)",
          zh: "牛肉炒粉丝（WOK）"
        },
        short: {
          ru: "Стеклянная лапша, говядина, овощи и соус.",
          ua: "Скляна локшина, яловичина, овочі та соус.",
          en: "Glass noodles with beef, vegetables and sauce.",
          vn: "Miến xào với bò, rau và nước sốt.",
          pl: "Makaron szklany z wołowiną, warzywami i sosem.",
          de: "Glasnudeln mit Rind, Gemüse und Sauce.",
          zh: "粉丝配牛肉、蔬菜与酱汁。"
        },
        options: [extrasWok]
      },
      {
        key: "mien_xao_heo",
        price: 200,
        weight: 450,
        unit: "g",
        spicy: 1,
        tags: [],
        translations: {
          ru: "Жареная стеклянная лапша Миен со свининой (WOK)",
          ua: "Смажена скляна локшина Мієн зі свининою (WOK)",
          en: "WOK Fried Glass Noodles with Pork",
          vn: "Miến xào heo",
          pl: "Smażony makaron szklany z wieprzowiną (WOK)",
          de: "Gebratene Glasnudeln mit Schwein (WOK)",
          zh: "猪肉炒粉丝（WOK）"
        },
        short: {
          ru: "Стеклянная лапша, свинина, овощи и соус.",
          ua: "Скляна локшина, свинина, овочі та соус.",
          en: "Glass noodles with pork, vegetables and sauce.",
          vn: "Miến xào với heo, rau và nước sốt.",
          pl: "Makaron szklany z wieprzowiną, warzywami i sosem.",
          de: "Glasnudeln mit Schwein, Gemüse und Sauce.",
          zh: "粉丝配猪肉、蔬菜与酱汁。"
        },
        options: [extrasWok]
      }
    ],

    com_rice: [
      {
        key: "com_thit_bo_xao",
        price: 200,
        weight: 450,
        unit: "g",
        spicy: 0,
        tags: ["popular"],
        translations: {
          ru: "Рис с жареной говядиной",
          ua: "Рис зі смаженою яловичиною",
          en: "Rice with Stir-fried Beef",
          vn: "Cơm thịt bò xào",
          pl: "Ryż z wołowiną stir-fry",
          de: "Reis mit gebratenem Rind",
          zh: "炒牛肉盖饭"
        },
        short: {
          ru: "Рис с говядиной и добавками.",
          ua: "Рис з яловичиною та додатками.",
          en: "Rice with beef and add-ons.",
          vn: "Cơm với thịt bò xào và topping.",
          pl: "Ryż z wołowiną i dodatkami.",
          de: "Reis mit Rind und Extras.",
          zh: "米饭配炒牛肉与配料。"
        },
        options: [extrasRice]
      },
      {
        key: "com_thit_heo_kho",
        price: 200,
        weight: 450,
        unit: "g",
        spicy: 0,
        tags: [],
        translations: {
          ru: "Рис с тушёной свининой",
          ua: "Рис із тушкованою свининою",
          en: "Rice with Braised Pork",
          vn: "Cơm thịt heo kho",
          pl: "Ryż z duszoną wieprzowiną",
          de: "Reis mit geschmortem Schwein",
          zh: "卤猪肉饭"
        },
        short: {
          ru: "Свинина в соусе — с рисом.",
          ua: "Свинина в соусі — з рисом.",
          en: "Braised pork in sauce served with rice.",
          vn: "Thịt heo kho ăn kèm cơm.",
          pl: "Wieprzowina w sosie — z ryżem.",
          de: "Schwein in Sauce — mit Reis.",
          zh: "卤猪肉配米饭。"
        },
        options: [extrasRice]
      }
    ],

    com_rang: [
      {
        key: "com_rang_bo",
        price: 200,
        weight: 450,
        unit: "g",
        spicy: 0,
        tags: ["popular"],
        translations: {
          ru: "Жареный рис с говядиной",
          ua: "Смажений рис з яловичиною",
          en: "Fried Rice with Beef",
          vn: "Cơm rang bò",
          pl: "Smażony ryż z wołowiną",
          de: "Gebratener Reis mit Rind",
          zh: "牛肉炒饭"
        },
        short: {
          ru: "Жареный рис с говядиной и овощами.",
          ua: "Смажений рис з яловичиною та овочами.",
          en: "Fried rice with beef and vegetables.",
          vn: "Cơm rang với bò và rau củ.",
          pl: "Smażony ryż z wołowiną i warzywami.",
          de: "Gebratener Reis mit Rind und Gemüse.",
          zh: "牛肉炒饭配蔬菜。"
        },
        options: [extrasRice]
      },
      {
        key: "com_rang_ga",
        price: 200,
        weight: 450,
        unit: "g",
        spicy: 0,
        tags: ["popular"],
        translations: {
          ru: "Жареный рис с курицей",
          ua: "Смажений рис з куркою",
          en: "Fried Rice with Chicken",
          vn: "Cơm rang gà",
          pl: "Smażony ryż z kurczakiem",
          de: "Gebratener Reis mit Huhn",
          zh: "鸡肉炒饭"
        },
        short: {
          ru: "Жареный рис с курицей и овощами.",
          ua: "Смажений рис з куркою та овочами.",
          en: "Fried rice with chicken and vegetables.",
          vn: "Cơm rang với gà và rau củ.",
          pl: "Smażony ryż z kurczakiem i warzywami.",
          de: "Gebratener Reis mit Huhn und Gemüse.",
          zh: "鸡肉炒饭配蔬菜。"
        },
        options: [extrasRice]
      }
    ],

    nem: [
      {
        key: "nem_ran",
        price: 50,
        weight: 1,
        unit: "pc",
        spicy: 0,
        tags: ["popular"],
        translations: {
          ru: "Nem rán — жареный спринг-ролл (1 шт)",
          ua: "Nem rán — смажений спрінг-рол (1 шт)",
          en: "Nem rán — Fried Spring Roll (1 pc)",
          vn: "Nem rán (1 cái)",
          pl: "Nem rán — smażony spring roll (1 szt.)",
          de: "Nem rán — frittierte Spring Roll (1 Stk.)",
          zh: "炸春卷（1个）"
        },
        short: {
          ru: "Хрустящий жареный ролл. Цена за 1 шт.",
          ua: "Хрусткий смажений рол. Ціна за 1 шт.",
          en: "Crispy fried roll. Price per 1 piece.",
          vn: "Nem rán giòn. Giá cho 1 cái.",
          pl: "Chrupiący smażony roll. Cena za 1 sztukę.",
          de: "Knusprige frittierte Roll. Preis pro Stück.",
          zh: "外脆内嫩。按1个计价。"
        }
      },
      {
        key: "nem_cuon",
        price: 50,
        weight: 1,
        unit: "pc",
        spicy: 0,
        tags: ["popular"],
        translations: {
          ru: "Nem cuốn — свежий спринг-ролл (1 шт)",
          ua: "Nem cuốn — свіжий спрінг-рол (1 шт)",
          en: "Fresh Spring Roll (1 pc)",
          vn: "Nem cuốn (1 cái)",
          pl: "Świeży spring roll (1 szt.)",
          de: "Frische Spring Roll (1 Stk.)",
          zh: "鲜春卷（1个）"
        },
        short: {
          ru: "Свежий ролл (нежареный). Цена за 1 шт.",
          ua: "Свіжий рол (нежарений). Ціна за 1 шт.",
          en: "Fresh (non-fried) roll. Price per 1 piece.",
          vn: "Cuốn tươi. Giá cho 1 cái.",
          pl: "Świeży (niesmażony) roll. Cena za 1 sztukę.",
          de: "Frische (nicht frittierte) Roll. Preis pro Stück.",
          zh: "新鲜不油炸。按1个计价。"
        }
      }
    ]
  };

  const menuMeta = {
    categories: {
      pho_soups: { ru: "PHỞ — Супы", ua: "PHỞ — Супи", en: "PHỞ — Soups", vn: "PHỞ — Súp", pl: "PHỞ — Zupy", de: "PHỞ — Suppen", zh: "PHỞ — 汤类" },
      bun_soups: { ru: "BÚN — Супы", ua: "BÚN — Супи", en: "BÚN — Soups", vn: "BÚN — Súp", pl: "BÚN — Zupy", de: "BÚN — Suppen", zh: "BÚN — 汤类" },
      bun_nam_bo: { ru: "BÚN NEM NAM BỘ", ua: "BÚN NEM NAM BỘ", en: "BÚN NEM NAM BỘ", vn: "BÚN NEM NAM BỘ", pl: "BÚN NEM NAM BỘ", de: "BÚN NEM NAM BỘ", zh: "南部拌米粉" },
      wok_fried_mien: { ru: "MIẾN XÀO — WOK", ua: "MIẾN XÀO — WOK", en: "MIẾN XÀO — WOK", vn: "MIẾN XÀO", pl: "MIẾN XÀO — WOK", de: "MIẾN XÀO — WOK", zh: "炒粉丝（WOK）" },
      com_rice: { ru: "CƠM — Рис", ua: "CƠM — Рис", en: "CƠM — Rice", vn: "CƠM", pl: "CƠM — Ryż", de: "CƠM — Reis", zh: "盖饭" },
      com_rang: { ru: "CƠM RANG — Жареный рис", ua: "CƠM RANG — Смажений рис", en: "CƠM RANG — Fried Rice", vn: "CƠM RANG", pl: "CƠM RANG — Smażony ryż", de: "CƠM RANG — Gebratener Reis", zh: "炒饭" },
      nem: { ru: "NEM — Роллы (по 1 шт)", ua: "NEM — Роли (по 1 шт)", en: "NEM — Rolls (per piece)", vn: "NEM (tính theo cái)", pl: "NEM — Rolki (za szt.)", de: "NEM — Rolls (pro Stück)", zh: "春卷（按个）" }
    }
  };

  window.menuData = menuData;
  window.menuMeta = menuMeta;
})();
