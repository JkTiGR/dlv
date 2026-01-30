/* menu.js
   DLV menu data.
   ✅ Price for all FOOD dishes set to 200 UAH.
   ✅ Added detailed descriptions (multilang) + filled short.
   ⚠️ Drinks kept as-is (they’re not “bluda”).
*/

const menuData = {
  // 🍜 Супи Фо (з рисовою локшиною)
  pho_soups: [
    {
      key: "pho_bo_xao",
      price: 200,
      translations: {
        ua: "Суп Фо зі смаженою яловичиною",
        ru: "Суп Фо с жареной говядиной",
        en: "Pho with fried beef",
        vn: "Phở xào bò",
        pl: "Pho z smażoną wołowiną",
        de: "Pho mit gebratenem Rind",
        zh: "炒牛肉河粉"
      },
      short: "🍜 Рисова локшина, смажена яловичина, овочі та ароматний соус. Ситно, швидко і дуже по-в’єтнамськи.",
      desc: {
        ua: "Рисова локшина, смажена яловичина, овочі та ароматний соус. Ситно, швидко і дуже по-в’єтнамськи.",
        ru: "Рисовая лапша, жареная говядина, овощи и ароматный соус. Сытно, быстро и по-вьетнамски.",
        en: "Rice noodles with fried beef, vegetables, and a fragrant savory sauce. Hearty wok-style comfort food.",
        vn: "Bánh phở xào bò với rau và sốt đậm đà, thơm nóng kiểu wok.",
        pl: "Makaron ryżowy pho ze smażoną wołowiną, warzywami i aromatycznym sosem.",
        de: "Reisnudeln mit gebratenem Rind, Gemüse und würziger Sauce – wokfrisch und sättigend.",
        zh: "河粉配炒牛肉与时蔬，拌香浓咸鲜酱汁，热炒更过瘾。"
      }
    },
    {
      key: "pho_ga_xao",
      price: 200,
      translations: {
        ua: "Суп Фо зі смаженою куркою",
        ru: "Суп Фо с жареной курицей",
        en: "Pho with fried chicken",
        vn: "Phở gà xao",
        pl: "Pho z smażonym kurczakiem",
        de: "Pho mit gebratenem Huhn",
        zh: "炒鸡肉河粉"
      },
      short: "🍜 Рисовая лапша фо, сочная курица, овощи и фирменный соус. Полегче, но очень вкусно.",
      desc: {
        ua: "Рисова локшина фо, соковита курка, овочі та фірмовий соус. Легше за яловичину, але так само смачно.",
        ru: "Рисовая лапша фо, сочная курица, овощи и фирменный соус. Полегче, но очень вкусно.",
        en: "Rice pho noodles with juicy fried chicken, vegetables, and signature sauce. Light yet satisfying.",
        vn: "Phở xào gà với thịt gà mềm, rau và sốt đặc trưng, thơm nóng.",
        pl: "Pho z kurczakiem, warzywami i sosem firmowym – delikatne i sycące.",
        de: "Pho-Reisnudeln mit gebratenem Huhn, Gemüse und Haussauce – leicht und lecker.",
        zh: "河粉配炒鸡肉与蔬菜，拌招牌酱汁，清爽又饱腹。"
      }
    },
    {
      key: "pho_heo_xao",
      price: 200,
      translations: {
        ua: "Суп Фо зі смаженою свининою",
        ru: "Суп Фо с жареной свининой",
        en: "Pho with fried pork",
        vn: "Phở xào heo",
        pl: "Pho z smażoną wieprzowiną",
        de: "Pho mit gebratenem Schwein",
        zh: "炒猪肉河粉"
      },
      short: "Лапша фо, нежная жареная свинина, овощи и пикантный соус. Сладко-солёный баланс.",
      desc: {
        ua: "Локшина фо, ніжна смажена свинина, овочі та пікантний соус. Баланс солодко-солоного смаку.",
        ru: "Лапша фо, нежная жареная свинина, овощи и пикантный соус. Сладко-солёный баланс.",
        en: "Pho rice noodles with tender fried pork, vegetables, and a slightly sweet-salty sauce.",
        vn: "Phở xào heo với thịt heo mềm, rau và sốt hơi ngọt mặn rất bắt vị.",
        pl: "Pho z delikatną wieprzowiną, warzywami i lekko słodko-słonym sosem.",
        de: "Pho mit zartem Schwein, Gemüse und fein süß-salziger Sauce.",
        zh: "河粉配炒猪肉与时蔬，酱汁微甜微咸，特别开胃。"
      }
    }
  ],

  // 🍜 Супи Бун
  bun_soups: [
    {
      key: "bun_bo_xao",
      price: 200,
      translations: {
        ua: "Суп Бун зі смаженою яловичиною",
        ru: "Суп Бун с жареной говядиной",
        en: "Bun with fried beef",
        vn: "Bún xào bò",
        pl: "Bun z smażoną wołowiną",
        de: "Bun mit gebratenem Rind",
        zh: "炒牛肉米粉"
      },
      short: "🍜 Бун • яловичина • зелень",
      desc: {
        ua: "Рисова вермішель бун, смажена яловичина, зелень та соус. М’яко, ароматно, без зайвої важкості.",
        ru: "Рисовая вермишель бун, жареная говядина, зелень и соус. Ароматно и не тяжело.",
        en: "Bun rice vermicelli with fried beef, herbs, and savory sauce. Fragrant and balanced.",
        vn: "Bún xào bò với rau thơm và sốt đậm vị, nhẹ bụng mà ngon.",
        pl: "Makaron ryżowy bun z wołowiną, ziołami i sosem – lekko i aromatycznie.",
        de: "Bun-Reisnudeln mit gebratenem Rind, Kräutern und würziger Sauce – angenehm leicht.",
        zh: "米粉配炒牛肉与香草，拌咸鲜酱汁，清香不腻。"
      }
    }
  ],

  // 🥗 Салати
  salads: [
    {
      key: "salad_bun_nem",
      price: 200,
      translations: {
        ua: "Салат бун зі смаженими рулетами",
        ru: "Салат бун с жареными рулетами",
        en: "Bun salad with fried rolls",
        vn: "Bún trộn nem",
        pl: "Sałatka bun z smażonymi rulonikami",
        de: "Bun-Salat mit frittierten Rollen",
        zh: "炸春卷拌米粉沙拉"
      },
      short: "🥗 Бун • нем • соус",
      desc: {
        ua: "Холодний салат: бун, хрусткі нем, овочі, зелень і кисло-солодкий соус. Дуже освіжає.",
        ru: "Холодный салат: бун, хрустящий нэм, овощи, зелень и кисло-сладкий соус. Освежает идеально.",
        en: "Refreshing bun salad with crispy fried rolls, vegetables, herbs, and sweet-sour dressing.",
        vn: "Bún trộn nem giòn, rau tươi, rau thơm và nước sốt chua ngọt.",
        pl: "Sałatka z bun, chrupiącym nem, warzywami, ziołami i sosem słodko-kwaśnym.",
        de: "Erfrischender Bun-Salat mit knusprigem Nem, Gemüse, Kräutern und süß-saurer Sauce.",
        zh: "拌米粉沙拉配炸春卷、蔬菜与香草，酸甜酱汁清爽开胃。"
      }
    }
  ],

  // 🍝 Мієн (смажена скляна локшина)
  wok_fried_mien: [
    {
      key: "mien_xao_ga",
      price: 200,
      translations: {
        ua: "Мієн зі смаженою куркою",
        ru: "Миен с жареной курицей",
        en: "Fried glass noodles with chicken",
        vn: "Miến xào gà",
        pl: "Smażony miến z kurczakiem",
        de: "Gebratene Glasnudeln mit Huhn",
        zh: "炒鸡肉粉丝"
      },
      short: "🍝 Скляна локшина • курка",
      desc: {
        ua: "Скляна локшина, курка, овочі та соус wok. Легка текстура, насичений аромат.",
        ru: "Стеклянная лапша, курица, овощи и соус wok. Лёгкая текстура, яркий вкус.",
        en: "Wok-fried glass noodles with chicken, vegetables, and savory sauce. Light, aromatic, satisfying.",
        vn: "Miến xào gà với rau và sốt wok thơm đậm, sợi miến dai nhẹ.",
        pl: "Smażony miến z kurczakiem, warzywami i sosem wok – lekki i aromatyczny.",
        de: "Gebratene Glasnudeln mit Huhn, Gemüse und Wok-Sauce – duftig und ausgewogen.",
        zh: "粉丝配炒鸡肉与蔬菜，锅气十足，口感爽滑。"
      }
    },
    {
      key: "mien_xao_bo",
      price: 200,
      translations: {
        ua: "Мієн зі смаженою яловичиною",
        ru: "Миен с жареной говядиной",
        en: "Fried glass noodles with beef",
        vn: "Miến xào bò",
        pl: "Smażony miến z wołowiną",
        de: "Gebratene Glasnudeln mit Rind",
        zh: "炒牛肉粉丝"
      },
      short: "🍝 Скляна локшина • яловичина",
      desc: {
        ua: "Скляна локшина з яловичиною та овочами у фірмовому соусі. Соковито й дуже ситно.",
        ru: "Стеклянная лапша с говядиной и овощами в фирменном соусе. Сочно и сытно.",
        en: "Glass noodles stir-fried with beef and vegetables in a signature savory sauce.",
        vn: "Miến xào bò với thịt bò mềm, rau và sốt đậm đà.",
        pl: "Miến smażony z wołowiną, warzywami i sosem firmowym – sycący i soczysty.",
        de: "Glasnudeln mit Rind und Gemüse in Haussauce – kräftig und sättigend.",
        zh: "粉丝炒牛肉配时蔬与招牌酱汁，香浓耐吃。"
      }
    },
    {
      key: "mien_xao_heo",
      price: 200,
      translations: {
        ua: "Мієн зі смаженою свининою",
        ru: "Миен с жареной свининой",
        en: "Fried glass noodles with pork",
        vn: "Miến xào heo",
        pl: "Smażony miến z wieprzowiną",
        de: "Gebratene Glasnudeln mit Schwein",
        zh: "炒猪肉粉丝"
      },
      short: "🍝 Скляна локшина • свинина",
      desc: {
        ua: "Скляна локшина, свинина, овочі та соус wok з легкою солодкістю. Дуже гарний баланс.",
        ru: "Стеклянная лапша, свинина, овощи и wok-соус с лёгкой сладостью. Отличный баланс.",
        en: "Wok-fried glass noodles with pork, vegetables, and a gently sweet-savory sauce.",
        vn: "Miến xào heo với rau và sốt hơi ngọt mặn, thơm nóng.",
        pl: "Miến z wieprzowiną i warzywami w lekko słodko-słonym sosie.",
        de: "Glasnudeln mit Schwein, Gemüse und fein süß-würziger Sauce.",
        zh: "粉丝炒猪肉配蔬菜，酱汁微甜咸，口感很顺。"
      }
    },
    {
      key: "mien_xao_hai_san",
      price: 200,
      translations: {
        ua: "Miến xào hải sản (мієн з морепродуктами)",
        ru: "Миен с морепродуктами",
        en: "Fried glass noodles with seafood",
        vn: "Miến xào hải sản",
        pl: "Smażony miến z owocami morza",
        de: "Gebratene Glasnudeln mit Meeresfrüchten",
        zh: "海鲜炒粉丝"
      },
      short: "🍝 Морепродукти • wok",
      desc: {
        ua: "Скляна локшина з морепродуктами та овочами у соусі wok. Аромат моря + швидка смажка.",
        ru: "Стеклянная лапша с морепродуктами и овощами в wok-соусе. Морской вкус и жарка в секунды.",
        en: "Wok-fried glass noodles with seafood and vegetables in a savory aromatic sauce.",
        vn: "Miến xào hải sản với rau và sốt wok thơm đậm, vị biển rõ ràng.",
        pl: "Miến z owocami morza, warzywami i aromatycznym sosem wok.",
        de: "Glasnudeln mit Meeresfrüchten, Gemüse und würziger Wok-Sauce – duftig und saftig.",
        zh: "海鲜炒粉丝配时蔬，锅气十足，鲜味突出。"
      }
    }
  ],

  // 🍚 Смажений рис
  fried_rice: [
    {
      key: "com_rang_ga",
      price: 200,
      translations: {
        ua: "Смажений рис з куркою",
        ru: "Жареный рис с курицей",
        en: "Fried rice with chicken",
        vn: "Cơm chiên gà",
        pl: "Ryż smażony z kurczakiem",
        de: "Gebratener Reis mit Huhn",
        zh: "鸡肉炒饭"
      },
      short: "🍚 Рис • курка • овочі",
      desc: {
        ua: "Смажений рис wok із куркою, овочами та соусом. Класика, яка не підводить.",
        ru: "Жареный рис wok с курицей, овощами и соусом. Классика без сюрпризов.",
        en: "Wok-style fried rice with chicken, vegetables, and savory seasoning. A reliable classic.",
        vn: "Cơm chiên gà với rau và gia vị đậm đà, thơm nóng.",
        pl: "Ryż smażony z kurczakiem, warzywami i przyprawami – klasyk.",
        de: "Gebratener Reis mit Huhn, Gemüse und Würzung – ein echter Klassiker.",
        zh: "鸡肉炒饭配蔬菜与调味，热香管饱。"
      }
    },
    {
      key: "com_rang_bo",
      price: 200,
      translations: {
        ua: "Смажений рис з яловичиною",
        ru: "Жареный рис с говядиной",
        en: "Fried rice with beef",
        vn: "Cơm chiên bò",
        pl: "Ryż smażony z wołowiną",
        de: "Gebratener Reis mit Rind",
        zh: "牛肉炒饭"
      },
      short: "🍚 Рис • яловичина • овочі",
      desc: {
        ua: "Смажений рис з яловичиною та овочами, приправлений фірмовим соусом. Ситно і м’ясно.",
        ru: "Жареный рис с говядиной и овощами, приправленный фирменным соусом. Сытно и мясно.",
        en: "Fried rice with beef and vegetables, seasoned with a signature savory sauce. Rich and filling.",
        vn: "Cơm chiên bò với thịt bò mềm, rau và sốt đậm vị.",
        pl: "Ryż smażony z wołowiną i warzywami w sosie firmowym – sycący.",
        de: "Gebratener Reis mit Rind und Gemüse in Haussauce – kräftig und sättigend.",
        zh: "牛肉炒饭配蔬菜与招牌酱汁，浓香耐吃。"
      }
    },
    {
      key: "com_rang_heo",
      price: 200,
      translations: {
        ua: "Смажений рис зі свининою",
        ru: "Жареный рис со свининой",
        en: "Fried rice with pork",
        vn: "Cơm chiên heo",
        pl: "Ryż smażony z wieprzowiną",
        de: "Gebratener Reis mit Schwein",
        zh: "猪肉炒饭"
      },
      short: "🍚 Рис • свинина • овочі",
      desc: {
        ua: "Смажений рис зі свининою, овочами та ароматними спеціями. Легка солодкість у соусі.",
        ru: "Жареный рис со свининой, овощами и ароматными специями. В соусе лёгкая сладость.",
        en: "Wok fried rice with pork, vegetables, and aromatic seasoning, with a hint of sweet-savory sauce.",
        vn: "Cơm chiên heo với rau và gia vị thơm, sốt hơi ngọt mặn.",
        pl: "Ryż smażony z wieprzowiną, warzywami i aromatycznymi przyprawami.",
        de: "Gebratener Reis mit Schwein, Gemüse und aromatischer Würzung – fein süß-würzig.",
        zh: "猪肉炒饭配蔬菜与香料，酱汁微甜咸。"
      }
    }
  ],

  // 🍚 Білий рис
  white_rice: [
    {
      key: "com_trang_thit_kho",
      price: 200,
      translations: {
        ua: "Білий рис зі тушкованою свининою",
        ru: "Белый рис с тушеной свининой",
        en: "White rice with braised pork",
        vn: "Cơm trắng thịt kho",
        pl: "Biały ryż z duszoną wieprzowiną",
        de: "Weißer Reis mit geschmortem Schwein",
        zh: "卤猪肉盖饭"
      },
      short: "🍚 Рис • тушкована свинина",
      desc: {
        ua: "Білий рис і свинина, тушкована до м’якості в ароматному соусі. Домашній смак, як у В’єтнамі.",
        ru: "Белый рис и свинина, тушёная до мягкости в ароматном соусе. Домашний вкус по-вьетнамски.",
        en: "Steamed white rice topped with tender braised pork in a fragrant savory sauce. Comforting and hearty.",
        vn: "Cơm trắng thịt kho mềm, thấm sốt thơm – vị nhà rất Việt.",
        pl: "Biały ryż z miękką duszoną wieprzowiną w aromatycznym sosie – domowy smak.",
        de: "Weißer Reis mit zart geschmortem Schwein in aromatischer Sauce – klassisches Comfort Food.",
        zh: "白米饭配卤到软烂的猪肉，酱香浓郁，很下饭。"
      }
    },
    {
      key: "com_trang_bo_xao",
      price: 200,
      translations: {
        ua: "Білий рис зі смаженою яловичиною",
        ru: "Белый рис с жареной говядиной",
        en: "White rice with fried beef",
        vn: "Cơm trắng bò xào",
        pl: "Biały ryż ze smażoną wołowiną",
        de: "Weißer Reis mit gebratenem Rind",
        zh: "炒牛肉盖饭"
      },
      short: "🍚 Рис • яловичина wok",
      desc: {
        ua: "Білий рис із яловичиною wok та овочами в соусі. Проста формула, максимальний смак.",
        ru: "Белый рис с говядиной wok и овощами в соусе. Простая формула — максимальный вкус.",
        en: "Steamed white rice with wok-fried beef and vegetables in savory sauce. Simple and powerful.",
        vn: "Cơm trắng bò xào với rau và sốt đậm đà, thơm nóng.",
        pl: "Biały ryż ze smażoną wołowiną, warzywami i sosem – prosto i pysznie.",
        de: "Weißer Reis mit Wok-Rind und Gemüse in würziger Sauce – schlicht, aber genial.",
        zh: "白米饭配炒牛肉与蔬菜，拌咸鲜酱汁，简单但超好吃。"
      }
    }
  ],

  // 🥟 Закуски
  appetizers: [
    {
      key: "spring_rolls_fresh",
      price: 200,
      translations: {
        ua: "Спрінг-роли (свіжі рулети в рисовому папері)",
        ru: "Спринг-роллы (свежие рулеты в рисовой бумаге)",
        en: "Fresh spring rolls (rice paper)",
        vn: "Gỏi cuốn",
        pl: "Świeże spring rollsy (papier ryżowy)",
        de: "Frische Frühlingsrollen (Reispapier)",
        zh: "越南鲜春卷"
      },
      short: "🥟 Свіжі • рисовий папір",
      desc: {
        ua: "Свіжі рулети в рисовому папері з зеленню та начинкою. Легкі, свіжі, ідеальні як старт.",
        ru: "Свежие рулеты в рисовой бумаге с зеленью и начинкой. Лёгкая закуска, идеально для разгона.",
        en: "Fresh rice-paper rolls with herbs and filling. Light, clean, and refreshing.",
        vn: "Gỏi cuốn tươi cuốn bánh tráng với rau thơm và nhân, nhẹ mà ngon.",
        pl: "Świeże rollsy w papierze ryżowym z ziołami i nadzieniem – lekkie i świeże.",
        de: "Frische Rollen im Reispapier mit Kräutern und Füllung – leicht und erfrischend.",
        zh: "鲜春卷用米纸包裹香草与馅料，清爽不腻。"
      }
    },
    {
      key: "nem_fried",
      price: 200,
      translations: {
        ua: "Нем (смажені рулети)",
        ru: "Нэм (жареные рулеты)",
        en: "Fried rolls (Nem)",
        vn: "Nem rán",
        pl: "Smażone ruloniki (Nem)",
        de: "Frittierte Rollen (Nem)",
        zh: "炸春卷"
      },
      short: "🥟 Хрусткі • гарячі",
      desc: {
        ua: "Хрусткі смажені рулети з начинкою. Золотиста скоринка та соковита серединка.",
        ru: "Хрустящие жареные рулеты с начинкой. Золотистая корочка и сочная середина.",
        en: "Crispy fried rolls with a juicy filling. Golden crust, satisfying crunch.",
        vn: "Nem rán giòn rụm, nhân thơm, ăn nóng cực đã.",
        pl: "Chrupiące smażone nem z soczystym nadzieniem – najlepsze na ciepło.",
        de: "Knusprig frittierte Nem-Rollen mit saftiger Füllung – am besten heiß.",
        zh: "炸春卷外酥里嫩，趁热吃最香。"
      }
    },
    {
      key: "uc_ga_chien_xu",
      price: 200,
      translations: {
        ua: "Ức gà chiên xù (хрустка куряча грудка)",
        ru: "Хрустящая куриная грудка",
        en: "Crispy chicken breast",
        vn: "Ức gà chiên xù",
        pl: "Chrupiąca pierś z kurczaka",
        de: "Knusprige Hähnchenbrust",
        zh: "脆炸鸡胸"
      },
      short: "🍗 Хрустка курка",
      desc: {
        ua: "Куряча грудка в хрусткій паніровці, соковита всередині. Ідеально під соус або як закуска.",
        ru: "Куриная грудка в хрустящей панировке, сочная внутри. Отлично с соусом или как закуска.",
        en: "Crispy breaded chicken breast: juicy inside, crunchy outside. Great with sauce or as a snack.",
        vn: "Ức gà chiên xù giòn bên ngoài, mềm mọng bên trong, ăn kèm sốt rất hợp.",
        pl: "Pierś z kurczaka w chrupiącej panierce – soczysta w środku, idealna z sosem.",
        de: "Knusprig panierte Hähnchenbrust – innen saftig, außen crunchy; perfekt mit Sauce.",
        zh: "脆炸鸡胸外酥里嫩，搭配蘸酱更好吃。"
      }
    }
  ],

  // ☕ / 🥤 Напої
  drinks: [
    {
      key: "caphe_viet",
      price: 0,
      translations: {
        ua: "В’єтнамська кава",
        ru: "Вьетнамский кофе",
        en: "Vietnamese coffee",
        vn: "Cà phê Việt",
        pl: "Kawa wietnamska",
        de: "Vietnamesischer Kaffee",
        zh: "越南咖啡"
      },
      short: "☕"
    },
    {
      key: "energy_drink",
      price: 0,
      translations: {
        ua: "Енергетичний напій",
        ru: "Энергетический напиток",
        en: "Energy drink",
        vn: "Nước tăng lực",
        pl: "Napój energetyczny",
        de: "Energy-Drink",
        zh: "能量饮料"
      },
      short: "⚡"
    },

    // Pepsi / газоване (цены)
    {
      key: "pepsi_glass_03",
      price: 69,
      translations: {
        ua: "Pepsi 0.3 л (скло) — 69 грн",
        ru: "Pepsi 0.3 л (стекло) — 69 грн",
        en: "Pepsi 0.3L (glass) — 69 UAH",
        vn: "Pepsi 0.3L (chai) — 69 UAH",
        pl: "Pepsi 0.3L (szkło) — 69 UAH",
        de: "Pepsi 0.3L (Glas) — 69 UAH",
        zh: "百事 0.3L（玻璃）— 69"
      },
      short: "🥤 Газоване"
    },
    {
      key: "pepsi_can_033",
      price: 59,
      translations: {
        ua: "Pepsi 0.33 л (ж/б) — 59 грн",
        ru: "Pepsi 0.33 л (банка) — 59 грн",
        en: "Pepsi 0.33L (can) — 59 UAH",
        vn: "Pepsi 0.33L (lon) — 59 UAH",
        pl: "Pepsi 0.33L (puszka) — 59 UAH",
        de: "Pepsi 0.33L (Dose) — 59 UAH",
        zh: "百事 0.33L（罐）— 59"
      },
      short: "🥤 Газоване"
    },
    {
      key: "pepsi_05",
      price: 69,
      translations: {
        ua: "Pepsi 0.5 л — 69 грн",
        ru: "Pepsi 0.5 л — 69 грн",
        en: "Pepsi 0.5L — 69 UAH",
        vn: "Pepsi 0.5L — 69 UAH",
        pl: "Pepsi 0.5L — 69 UAH",
        de: "Pepsi 0.5L — 69 UAH",
        zh: "百事 0.5L — 69"
      },
      short: "🥤 Газоване"
    },
    {
      key: "pepsi_black_05",
      price: 69,
      translations: {
        ua: "Pepsi Black 0.5 л — 69 грн",
        ru: "Pepsi Black 0.5 л — 69 грн",
        en: "Pepsi Black 0.5L — 69 UAH",
        vn: "Pepsi Black 0.5L — 69 UAH",
        pl: "Pepsi Black 0.5L — 69 UAH",
        de: "Pepsi Black 0.5L — 69 UAH",
        zh: "百事无糖 0.5L — 69"
      },
      short: "🥤 Газоване"
    },
    {
      key: "pepsi_cherry_05",
      price: 69,
      translations: {
        ua: "Pepsi Cherry 0.5 л — 69 грн",
        ru: "Pepsi Cherry 0.5 л — 69 грн",
        en: "Pepsi Cherry 0.5L — 69 UAH",
        vn: "Pepsi Cherry 0.5L — 69 UAH",
        pl: "Pepsi Cherry 0.5L — 69 UAH",
        de: "Pepsi Cherry 0.5L — 69 UAH",
        zh: "百事樱桃 0.5L — 69"
      },
      short: "🥤 Газоване"
    },
    {
      key: "mirinda_orange_05",
      price: 69,
      translations: {
        ua: "Mirinda Orange 0.5 л — 69 грн",
        ru: "Mirinda Orange 0.5 л — 69 грн",
        en: "Mirinda Orange 0.5L — 69 UAH",
        vn: "Mirinda Orange 0.5L — 69 UAH",
        pl: "Mirinda Orange 0.5L — 69 UAH",
        de: "Mirinda Orange 0.5L — 69 UAH",
        zh: "美年达橙味 0.5L — 69"
      },
      short: "🥤 Газоване"
    },
    {
      key: "sevenup_05",
      price: 69,
      translations: {
        ua: "7UP 0.5 л — 69 грн",
        ru: "7UP 0.5 л — 69 грн",
        en: "7UP 0.5L — 69 UAH",
        vn: "7UP 0.5L — 69 UAH",
        pl: "7UP 0.5L — 69 UAH",
        de: "7UP 0.5L — 69 UAH",
        zh: "七喜 0.5L — 69"
      },
      short: "🥤 Газоване"
    },

    // Вода
    {
      key: "karpatska_still_05",
      price: 39,
      translations: {
        ua: "Карпатська джерельна негаз 0.5 л — 39 грн",
        ru: "Карпатская родниковая негаз 0.5 л — 39 грн",
        en: "Carpathian spring water still 0.5L — 39 UAH",
        vn: "Nước suối Carpathian không ga 0.5L — 39 UAH",
        pl: "Woda źródlana Karpacka niegaz. 0.5L — 39 UAH",
        de: "Karpaty-Quellwasser still 0.5L — 39 UAH",
        zh: "喀尔巴阡矿泉水（无气）0.5L — 39"
      },
      short: "💧 Вода"
    },
    {
      key: "karpatska_spark_05",
      price: 39,
      translations: {
        ua: "Карпатська джерельна газ 0.5 л — 39 грн",
        ru: "Карпатская родниковая газ 0.5 л — 39 грн",
        en: "Carpathian spring water sparkling 0.5L — 39 UAH",
        vn: "Nước suối Carpathian có ga 0.5L — 39 UAH",
        pl: "Woda źródlana Karpacka gaz. 0.5L — 39 UAH",
        de: "Karpaty-Quellwasser sprudelnd 0.5L — 39 UAH",
        zh: "喀尔巴阡矿泉水（有气）0.5L — 39"
      },
      short: "💧 Вода"
    },

    // Соки
    {
      key: "sadok_multi_05",
      price: 69,
      translations: {
        ua: "Садочок Мультифрукт 0.5 л — 69 грн",
        ru: "Садочок Мультифрукт 0.5 л — 69 грн",
        en: "Sadok Multifruit 0.5L — 69 UAH",
        vn: "Nước trái cây Sadok đa vị 0.5L — 69 UAH",
        pl: "Sadok Multiowoc 0.5L — 69 UAH",
        de: "Sadok Multifrucht 0.5L — 69 UAH",
        zh: "Sadok 综合果汁 0.5L — 69"
      },
      short: "🧃 Соки"
    },
    {
      key: "sadok_tomato_05",
      price: 75,
      translations: {
        ua: "Садочок Томатний 0.5 л — 75 грн",
        ru: "Садочок Томатный 0.5 л — 75 грн",
        en: "Sadok Tomato 0.5L — 75 UAH",
        vn: "Nước cà chua Sadok 0.5L — 75 UAH",
        pl: "Sadok Pomidorowy 0.5L — 75 UAH",
        de: "Sadok Tomate 0.5L — 75 UAH",
        zh: "Sadok 番茄汁 0.5L — 75"
      },
      short: "🧃 Соки"
    }
  ]
};

// window.menuData = menuData;
