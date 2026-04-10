const menuData = {
  "pho_soups": [
    {
      "key": "pho_bo_xao",
      "code": "PBx",
      "price": 200,
      "weight": 800,
      "spicy": 0,
      "tags": [
        "popular"
      ],
      "translations": {
        "ru": "Суп Фо с говядиной",
        "ua": "Фо з яловичиною",
        "vn": "Phở bò"
      },
      "short": {
        "ru": "Насыщенный костный бульон, рисовая лапша, сочная говядина и свежая зелень.",
        "ua": "Насичений кістковий бульйон, рисова локшина, соковита яловичина та свіжа зелень.",
        "vn": "Nước dùng xương đậm đà, bánh phở, bò mềm và rau tươi."
      }
    },
    {
      "key": "pho_heo_xao",
      "code": "PLx",
      "price": 200,
      "weight": 800,
      "spicy": 0,
      "tags": [],
      "translations": {
        "ru": "Суп Фо со свининой",
        "ua": "Фо зі свининою",
        "vn": "Phở heo"
      },
      "short": {
        "ru": "Ароматный бульон, рисовая лапша, нежная свинина и зелень.",
        "ua": "Ароматний бульйон, рисова локшина, ніжна свинина та зелень.",
        "vn": "Nước dùng thơm, bánh phở, thịt heo mềm và rau xanh."
      }
    },
    {
      "key": "pho_ga_xao",
      "code": "PGx",
      "price": 200,
      "weight": 800,
      "spicy": 0,
      "tags": [],
      "translations": {
        "ru": "Суп Фо с курицей",
        "ua": "Фо з куркою",
        "vn": "Phở gà"
      },
      "short": {
        "ru": "Лёгкий бульон, рисовая лапша, курица и свежая зелень.",
        "ua": "Легкий бульйон, рисова локшина, курка та зелень.",
        "vn": "Nước dùng nhẹ, bánh phở, thịt gà và rau thơm."
      }
    },
    {
      "key": "pho_tom",
      "code": "PT",
      "price": 200,
      "weight": 750,
      "spicy": 0,
      "tags": [],
      "translations": {
        "ru": "Суп Фо с креветками",
        "ua": "Фо з креветками",
        "vn": "Phở tôm"
      },
      "short": {
        "ru": "Ароматный бульон, рисовая лапша, креветки и овощи.",
        "ua": "Ароматний бульйон, рисова локшина, креветки та овочі.",
        "vn": "Nước dùng thơm, bánh phở, tôm và rau củ."
      }
    },
    {
      "key": "pho_ga_chien_xu",
      "code": "PGCx",
      "price": 200,
      "weight": 700,
      "spicy": 0,
      "tags": [
        "popular"
      ],
      "translations": {
        "ru": "Суп Фо с курицей в панировке",
        "ua": "Фо з куркою в паніровці",
        "vn": "Phở gà chiên xù"
      },
      "short": {
        "ru": "Бульон, лапша, хрустящая курица и зелень.",
        "ua": "Бульйон, локшина, хрустка курка та зелень.",
        "vn": "Nước dùng, bánh phở, gà chiên xù giòn và rau xanh."
      }
    },
    {
      "key": "pho_mix",
      "code": "PMix",
      "price": 200,
      "weight": 700,
      "spicy": 0,
      "tags": [
        "chef"
      ],
      "translations": {
        "ru": "Суп Фо MIX",
        "ua": "Фо мікс",
        "vn": "Phở mix"
      },
      "short": {
        "ru": "Насыщенный бульон, лапша и микс мяса с морепродуктами.",
        "ua": "Насичений бульйон, локшина, мікс м’яса та морепродуктів.",
        "vn": "Nước dùng đậm vị, bánh phở cùng mix thịt và hải sản."
      }
    }
  ],
  "mi_soups": [
    {
      "key": "mi_soup_bo",
      "code": "MB",
      "price": 200,
      "weight": 800,
      "spicy": 0,
      "tags": [],
      "translations": {
        "ru": "Суп Ми с говядиной",
        "ua": "Суп Mi з яловичиною",
        "vn": "Mì nước bò"
      },
      "short": {
        "ru": "Ароматный бульон, яичная лапша, говядина и овощи.",
        "ua": "Ароматний бульйон, яєчна локшина, яловичина та овочі.",
        "vn": "Nước dùng thơm, mì trứng, bò và rau củ."
      }
    },
    {
      "key": "mi_soup_heo",
      "code": "ML",
      "price": 200,
      "weight": 800,
      "spicy": 0,
      "tags": [],
      "translations": {
        "ru": "Суп Ми со свининой",
        "ua": "Суп Mi зі свининою",
        "vn": "Mì nước heo"
      },
      "short": {
        "ru": "Бульон, яичная лапша, сочная свинина и овощи.",
        "ua": "Бульйон, яєчна локшина, соковита свинина та овочі.",
        "vn": "Nước dùng, mì trứng, thịt heo mềm và rau củ."
      }
    },
    {
      "key": "mi_soup_ga",
      "code": "MG",
      "price": 200,
      "weight": 800,
      "spicy": 0,
      "tags": [],
      "translations": {
        "ru": "Суп Ми с курицей",
        "ua": "Суп Mi з куркою",
        "vn": "Mì nước gà"
      },
      "short": {
        "ru": "Лёгкий бульон, лапша, курица и овощи.",
        "ua": "Легкий бульйон, локшина, курка та овочі.",
        "vn": "Nước dùng nhẹ, mì trứng, thịt gà và rau củ."
      }
    },
    {
      "key": "mi_soup_tom",
      "code": "MT",
      "price": 200,
      "weight": 750,
      "spicy": 0,
      "tags": [],
      "translations": {
        "ru": "Суп Ми с креветками",
        "ua": "Суп Mi з креветками",
        "vn": "Mì nước tôm"
      },
      "short": {
        "ru": "Бульон, лапша, креветки и овощи.",
        "ua": "Бульйон, локшина, креветки та овочі.",
        "vn": "Nước dùng, mì trứng, tôm và rau củ."
      }
    },
    {
      "key": "mi_soup_ga_chien_xu",
      "code": "MGCx",
      "price": 200,
      "weight": 700,
      "spicy": 0,
      "tags": [
        "popular"
      ],
      "translations": {
        "ru": "Суп Ми с курицей в панировке",
        "ua": "Суп Mi з куркою в паніровці",
        "vn": "Mì nước gà chiên xù"
      },
      "short": {
        "ru": "Лапша, бульон и хрустящая курица.",
        "ua": "Локшина, бульйон та хрустка курка.",
        "vn": "Mì nước cùng gà chiên xù giòn rụm."
      }
    },
    {
      "key": "mi_soup_mix",
      "code": "MMix",
      "price": 200,
      "weight": 700,
      "spicy": 0,
      "tags": [
        "chef"
      ],
      "translations": {
        "ru": "Суп Ми MIX",
        "ua": "Суп Mi мікс",
        "vn": "Mì nước mix"
      },
      "short": {
        "ru": "Лапша, бульон и микс мяса с морепродуктами.",
        "ua": "Локшина, бульйон, мікс м’яса та морепродуктів.",
        "vn": "Mì nước với mix thịt và hải sản."
      }
    }
  ],
  "mien_soups": [
    {
      "key": "mien_soup_bo",
      "code": "MnB",
      "price": 200,
      "weight": 700,
      "spicy": 0,
      "tags": [],
      "translations": {
        "ru": "Суп Миен с говядиной",
        "ua": "Суп Мієн з яловичиною",
        "vn": "Miến nước bò"
      },
      "short": {
        "ru": "Прозрачный бульон, стеклянная лапша, говядина и овощи.",
        "ua": "Прозорий бульйон, скляна локшина, яловичина та овочі.",
        "vn": "Nước dùng trong, miến, bò và rau củ."
      }
    },
    {
      "key": "mien_soup_heo",
      "code": "MnL",
      "price": 200,
      "weight": 700,
      "spicy": 0,
      "tags": [],
      "translations": {
        "ru": "Суп Миен со свининой",
        "ua": "Суп Мієн зі свининою",
        "vn": "Miến nước heo"
      },
      "short": {
        "ru": "Лёгкий бульон, стеклянная лапша, свинина и овощи.",
        "ua": "Легкий бульйон, локшина, свинина та овочі.",
        "vn": "Nước dùng nhẹ, miến, thịt heo và rau củ."
      }
    },
    {
      "key": "mien_soup_ga",
      "code": "MnG",
      "price": 200,
      "weight": 700,
      "spicy": 0,
      "tags": [],
      "translations": {
        "ru": "Суп Миен с курицей",
        "ua": "Суп Мієн з куркою",
        "vn": "Miến nước gà"
      },
      "short": {
        "ru": "Бульон, стеклянная лапша, курица и зелень.",
        "ua": "Бульйон, локшина, курка та зелень.",
        "vn": "Nước dùng, miến, thịt gà và rau xanh."
      }
    },
    {
      "key": "mien_soup_tom",
      "code": "MnT",
      "price": 200,
      "weight": 700,
      "spicy": 0,
      "tags": [],
      "translations": {
        "ru": "Суп Миен с креветками",
        "ua": "Суп Мієн з креветками",
        "vn": "Miến nước tôm"
      },
      "short": {
        "ru": "Лапша, бульон, креветки и овощи.",
        "ua": "Локшина, бульйон, креветки та овочі.",
        "vn": "Miến nước cùng tôm và rau củ."
      }
    },
    {
      "key": "mien_soup_ga_chien_xu",
      "code": "MnGCx",
      "price": 200,
      "weight": 700,
      "spicy": 0,
      "tags": [
        "popular"
      ],
      "translations": {
        "ru": "Суп Миен с курицей в панировке",
        "ua": "Суп Мієн з куркою в паніровці",
        "vn": "Miến nước gà chiên xù"
      },
      "short": {
        "ru": "Лапша, хрустящая курица и бульон.",
        "ua": "Локшина, хрустка курка та бульйон.",
        "vn": "Miến, gà chiên xù giòn và nước dùng."
      }
    },
    {
      "key": "mien_soup_mix",
      "code": "MnMix",
      "price": 200,
      "weight": 700,
      "spicy": 0,
      "tags": [
        "chef"
      ],
      "translations": {
        "ru": "Суп Миен MIX",
        "ua": "Суп Мієн мікс",
        "vn": "Miến nước mix"
      },
      "short": {
        "ru": "Лапша, бульон и микс ингредиентов.",
        "ua": "Локшина, бульйон, мікс інгредієнтів.",
        "vn": "Miến nước cùng mix nguyên liệu."
      }
    }
  ],
  "bun_soups": [
    {
      "key": "bun_soup_bo",
      "code": "BBx",
      "price": 200,
      "weight": 700,
      "spicy": 0,
      "tags": [],
      "translations": {
        "ru": "Суп Бун с говядиной",
        "ua": "Суп Бун з яловичиною",
        "vn": "Bún nước bò"
      },
      "short": {
        "ru": "Ароматный бульон, рисовая лапша, говядина и зелень.",
        "ua": "Ароматний бульйон, рисова локшина, яловичина та зелень.",
        "vn": "Nước dùng thơm, bún, bò và rau thơm."
      }
    },
    {
      "key": "bun_soup_heo",
      "code": "BLx",
      "price": 200,
      "weight": 700,
      "spicy": 0,
      "tags": [],
      "translations": {
        "ru": "Суп Бун со свининой",
        "ua": "Суп Бун зі свининою",
        "vn": "Bún nước heo"
      },
      "short": {
        "ru": "Бульон, лапша, свинина и зелень.",
        "ua": "Бульйон, локшина, свинина та зелень.",
        "vn": "Nước dùng, bún, thịt heo và rau xanh."
      }
    },
    {
      "key": "bun_soup_ga",
      "code": "BGx",
      "price": 200,
      "weight": 700,
      "spicy": 0,
      "tags": [],
      "translations": {
        "ru": "Суп Бун с курицей",
        "ua": "Суп Бун з куркою",
        "vn": "Bún nước gà"
      },
      "short": {
        "ru": "Лапша, бульон, курица и зелень.",
        "ua": "Локшина, бульйон, курка та зелень.",
        "vn": "Bún nước với gà và rau xanh."
      }
    },
    {
      "key": "bun_soup_ga_chien_xu",
      "code": "BGCx",
      "price": 200,
      "weight": 700,
      "spicy": 0,
      "tags": [
        "popular"
      ],
      "translations": {
        "ru": "Суп Бун с курицей в панировке",
        "ua": "Суп Бун з куркою в паніровці",
        "vn": "Bún nước gà chiên xù"
      },
      "short": {
        "ru": "Лапша, хрустящая курица и бульон.",
        "ua": "Локшина, хрустка курка та бульйон.",
        "vn": "Bún nước với gà chiên xù giòn."
      }
    },
    {
      "key": "bun_soup_tom",
      "code": "BT",
      "price": 200,
      "weight": 700,
      "spicy": 0,
      "tags": [],
      "translations": {
        "ru": "Суп Бун с креветками",
        "ua": "Суп Бун з креветками",
        "vn": "Bún nước tôm"
      },
      "short": {
        "ru": "Лапша, бульон, креветки и овощи.",
        "ua": "Локшина, бульйон, креветки та овочі.",
        "vn": "Bún nước cùng tôm và rau củ."
      }
    },
    {
      "key": "bun_soup_mix",
      "code": "BMix",
      "price": 200,
      "weight": 700,
      "spicy": 0,
      "tags": [
        "chef"
      ],
      "translations": {
        "ru": "Суп Бун MIX",
        "ua": "Суп Бун мікс",
        "vn": "Bún nước mix"
      },
      "short": {
        "ru": "Лапша, бульон и микс мяса с морепродуктами.",
        "ua": "Локшина, бульйон, мікс м’яса та морепродуктів.",
        "vn": "Bún nước với mix thịt và hải sản."
      }
    }
  ],
  "salat_bun": [
    {
      "key": "salat_bun_bo",
      "code": "BsB",
      "price": 200,
      "weight": 700,
      "spicy": 0,
      "tags": [],
      "translations": {
        "ru": "Салат Бун с говядиной",
        "ua": "Салат Бун з яловичиною",
        "vn": "Bún trộn bò"
      },
      "short": {
        "ru": "Рисовая лапша, говядина, свежая зелень и соус.",
        "ua": "Рисова локшина, яловичина, свіжа зелень та соус.",
        "vn": "Bún, thịt bò, rau tươi và nước sốt."
      }
    },
    {
      "key": "salat_bun_ga",
      "code": "BsG",
      "price": 200,
      "weight": 700,
      "spicy": 0,
      "tags": [],
      "translations": {
        "ru": "Салат Бун с курицей",
        "ua": "Салат Бун з куркою",
        "vn": "Bún trộn gà"
      },
      "short": {
        "ru": "Лапша, курица, овощи и ароматный соус.",
        "ua": "Локшина, курка, овочі та ароматний соус.",
        "vn": "Bún, thịt gà, rau củ và nước sốt thơm."
      }
    },
    {
      "key": "salat_bun_ga_chien_xu",
      "code": "BsGCx",
      "price": 200,
      "weight": 700,
      "spicy": 0,
      "tags": [
        "popular"
      ],
      "translations": {
        "ru": "Салат Бун с курицей в панировке",
        "ua": "Салат Бун з куркою в паніровці",
        "vn": "Bún trộn gà chiên xù"
      },
      "short": {
        "ru": "Лапша, хрустящая курица и зелень.",
        "ua": "Локшина, хрустка курка та зелень.",
        "vn": "Bún, gà chiên xù giòn và rau xanh."
      }
    },
    {
      "key": "salat_bun_tom",
      "code": "BsT",
      "price": 200,
      "weight": 700,
      "spicy": 0,
      "tags": [],
      "translations": {
        "ru": "Салат Бун с креветками",
        "ua": "Салат Бун з креветками",
        "vn": "Bún trộn tôm"
      },
      "short": {
        "ru": "Лапша, креветки и овощи.",
        "ua": "Локшина, креветки та овочі.",
        "vn": "Bún, tôm và rau củ."
      }
    },
    {
      "key": "salat_bun_nem",
      "code": "BsN",
      "price": 200,
      "weight": 700,
      "spicy": 0,
      "tags": [
        "chef"
      ],
      "translations": {
        "ru": "Салат Бун с нэмами",
        "ua": "Салат Бун з немами",
        "vn": "Bún trộn nem"
      },
      "short": {
        "ru": "Лапша, жареные нэмы и зелень.",
        "ua": "Локшина, смажені неми та зелень.",
        "vn": "Bún, nem rán và rau xanh."
      }
    },
    {
      "key": "salat_bun_mix",
      "code": "BsMix",
      "price": 200,
      "weight": 700,
      "spicy": 0,
      "tags": [
        "chef"
      ],
      "translations": {
        "ru": "Салат Бун MIX",
        "ua": "Салат Бун мікс",
        "vn": "Bún trộn mix"
      },
      "short": {
        "ru": "Лапша, микс мяса и овощи.",
        "ua": "Локшина, мікс м’яса та овочі.",
        "vn": "Bún cùng mix thịt và rau củ."
      }
    }
  ],
  "wok_fried_mien": [
    {
      "key": "mien_xao_bo",
      "code": "MXB",
      "price": 250,
      "weight": 700,
      "spicy": 1,
      "tags": [],
      "translations": {
        "ru": "Жареный Миен с говядиной",
        "ua": "Смажений Мієн з яловичиною",
        "vn": "Miến xào bò"
      },
      "short": {
        "ru": "Лапша, говядина, овощи и соус.",
        "ua": "Локшина, яловичина, овочі та соус.",
        "vn": "Miến, bò, rau củ và nước sốt."
      }
    },
    {
      "key": "mien_xao_heo",
      "code": "MXH",
      "price": 250,
      "weight": 700,
      "spicy": 1,
      "tags": [],
      "translations": {
        "ru": "Жареный Миен со свининой",
        "ua": "Смажений Мієн зі свининою",
        "vn": "Miến xào heo"
      },
      "short": {
        "ru": "Лапша, свинина и овощи.",
        "ua": "Локшина, свинина та овочі.",
        "vn": "Miến, thịt heo và rau củ."
      }
    },
    {
      "key": "mien_xao_ga",
      "code": "MXG",
      "price": 250,
      "weight": 700,
      "spicy": 1,
      "tags": [],
      "translations": {
        "ru": "Жареный Миен с курицей",
        "ua": "Смажений Мієн з куркою",
        "vn": "Miến xào gà"
      },
      "short": {
        "ru": "Лапша, курица и соус.",
        "ua": "Локшина, курка та соус.",
        "vn": "Miến, thịt gà và nước sốt."
      }
    },
    {
      "key": "mien_xao_ga_chien_xu",
      "code": "MXGCx",
      "price": 250,
      "weight": 700,
      "spicy": 1,
      "tags": [
        "popular"
      ],
      "translations": {
        "ru": "Жареный Миен с курицей в панировке",
        "ua": "Смажений Мієн з куркою в паніровці",
        "vn": "Miến xào gà chiên xù"
      },
      "short": {
        "ru": "Лапша и хрустящая курица.",
        "ua": "Локшина та хрустка курка.",
        "vn": "Miến xào cùng gà chiên xù giòn."
      }
    },
    {
      "key": "mien_xao_tom",
      "code": "MXT",
      "price": 250,
      "weight": 700,
      "spicy": 1,
      "tags": [],
      "translations": {
        "ru": "Жареный Миен с креветками",
        "ua": "Смажений Мієн з креветками",
        "vn": "Miến xào tôm"
      },
      "short": {
        "ru": "Лапша, креветки и овощи.",
        "ua": "Локшина, креветки та овочі.",
        "vn": "Miến, tôm và rau củ."
      }
    },
    {
      "key": "mien_xao_mix",
      "code": "MXMix",
      "price": 250,
      "weight": 700,
      "spicy": 1,
      "tags": [
        "chef"
      ],
      "translations": {
        "ru": "Жареный Миен MIX",
        "ua": "Смажений Мієн мікс",
        "vn": "Miến xào mix"
      },
      "short": {
        "ru": "Лапша, микс мяса и овощи.",
        "ua": "Локшина, мікс м’яса та овочі.",
        "vn": "Miến xào cùng mix thịt và rau củ."
      }
    }
  ],
  "wok_fried_mi": [
    {
      "key": "mi_xao_bo",
      "code": "MIXB",
      "price": 250,
      "weight": 700,
      "spicy": 1,
      "tags": [],
      "translations": {
        "ru": "Жареный Mi с говядиной",
        "ua": "Смажений Mi з яловичиною",
        "vn": "Mì xào bò"
      },
      "short": {
        "ru": "Лапша, говядина, овощи и соус.",
        "ua": "Локшина, яловичина, овочі та соус.",
        "vn": "Mì xào với bò, rau củ và nước sốt."
      }
    },
    {
      "key": "mi_xao_heo",
      "code": "MIXL",
      "price": 250,
      "weight": 700,
      "spicy": 1,
      "tags": [],
      "translations": {
        "ru": "Жареный Mi со свининой",
        "ua": "Смажений Mi зі свининою",
        "vn": "Mì xào heo"
      },
      "short": {
        "ru": "Лапша, свинина и овощи.",
        "ua": "Локшина, свинина та овочі.",
        "vn": "Mì xào với heo và rau củ."
      }
    },
    {
      "key": "mi_xao_ga",
      "code": "MIXG",
      "price": 250,
      "weight": 700,
      "spicy": 1,
      "tags": [],
      "translations": {
        "ru": "Жареный Mi с курицей",
        "ua": "Смажений Mi з куркою",
        "vn": "Mì xào gà"
      },
      "short": {
        "ru": "Лапша, курица и соус.",
        "ua": "Локшина, курка та соус.",
        "vn": "Mì xào với gà và nước sốt."
      }
    },
    {
      "key": "mi_xao_ga_chien_xu",
      "code": "MIXGCx",
      "price": 250,
      "weight": 700,
      "spicy": 1,
      "tags": [
        "popular"
      ],
      "translations": {
        "ru": "Жареный Mi с курицей в панировке",
        "ua": "Смажений Mi з куркою в паніровці",
        "vn": "Mì xào gà chiên xù"
      },
      "short": {
        "ru": "Лапша и хрустящая курица.",
        "ua": "Локшина та хрустка курка.",
        "vn": "Mì xào cùng gà chiên xù giòn."
      }
    },
    {
      "key": "mi_xao_tom",
      "code": "MIXT",
      "price": 270,
      "weight": 700,
      "spicy": 1,
      "tags": [],
      "translations": {
        "ru": "Жареный Mi с креветками",
        "ua": "Смажений Mi з креветками",
        "vn": "Mì xào tôm"
      },
      "short": {
        "ru": "Лапша, креветки и овощи.",
        "ua": "Локшина, креветки та овочі.",
        "vn": "Mì xào với tôm và rau củ."
      }
    },
    {
      "key": "mi_xao_mix",
      "code": "MIXMix",
      "price": 250,
      "weight": 700,
      "spicy": 1,
      "tags": [
        "chef"
      ],
      "translations": {
        "ru": "Жареный Mi MIX",
        "ua": "Смажений Mi мікс",
        "vn": "Mì xào mix"
      },
      "short": {
        "ru": "Лапша, микс мяса и овощи.",
        "ua": "Локшина, мікс м’яса та овочі.",
        "vn": "Mì xào với mix thịt và rau củ."
      }
    }
  ],
  "wok_fried_pho": [
    {
      "key": "pho_xao_bo",
      "code": "PXB",
      "price": 250,
      "weight": 700,
      "spicy": 1,
      "tags": [],
      "translations": {
        "ru": "Жареный Фо с говядиной",
        "ua": "Смажений Фо з яловичиною",
        "vn": "Phở xào bò"
      },
      "short": {
        "ru": "Рисовая лапша, говядина, овощи и соус.",
        "ua": "Рисова локшина, яловичина, овочі та соус.",
        "vn": "Phở xào với bò, rau củ và nước sốt."
      }
    },
    {
      "key": "pho_xao_heo",
      "code": "PXH",
      "price": 250,
      "weight": 700,
      "spicy": 1,
      "tags": [],
      "translations": {
        "ru": "Жареный Фо со свининой",
        "ua": "Смажений Фо зі свининою",
        "vn": "Phở xào heo"
      },
      "short": {
        "ru": "Лапша, свинина и овощи.",
        "ua": "Локшина, свинина та овочі.",
        "vn": "Phở xào với heo và rau củ."
      }
    },
    {
      "key": "pho_xao_ga",
      "code": "PXG",
      "price": 250,
      "weight": 700,
      "spicy": 1,
      "tags": [],
      "translations": {
        "ru": "Жареный Фо с курицей",
        "ua": "Смажений Фо з куркою",
        "vn": "Phở xào gà"
      },
      "short": {
        "ru": "Лапша, курица и соус.",
        "ua": "Локшина, курка та соус.",
        "vn": "Phở xào với gà và nước sốt."
      }
    },
    {
      "key": "pho_xao_ga_chien_xu",
      "code": "PXGCx",
      "price": 250,
      "weight": 700,
      "spicy": 1,
      "tags": [
        "popular"
      ],
      "translations": {
        "ru": "Жареный Фо с курицей в панировке",
        "ua": "Смажений Фо з куркою в паніровці",
        "vn": "Phở xào gà chiên xù"
      },
      "short": {
        "ru": "Лапша и хрустящая курица.",
        "ua": "Локшина та хрустка курка.",
        "vn": "Phở xào cùng gà chiên xù giòn."
      }
    },
    {
      "key": "pho_xao_tom",
      "code": "PXT",
      "price": 250,
      "weight": 700,
      "spicy": 1,
      "tags": [],
      "translations": {
        "ru": "Жареный Фо с креветками",
        "ua": "Смажений Фо з креветками",
        "vn": "Phở xào tôm"
      },
      "short": {
        "ru": "Лапша, креветки и овощи.",
        "ua": "Локшина, креветки та овочі.",
        "vn": "Phở xào với tôm và rau củ."
      }
    },
    {
      "key": "pho_xao_mix",
      "code": "PXMix",
      "price": 250,
      "weight": 700,
      "spicy": 1,
      "tags": [
        "chef"
      ],
      "translations": {
        "ru": "Жареный Фо MIX",
        "ua": "Смажений Фо мікс",
        "vn": "Phở xào mix"
      },
      "short": {
        "ru": "Лапша, микс мяса и овощи.",
        "ua": "Локшина, мікс м’яса та овочі.",
        "vn": "Phở xào với mix thịt và rau củ."
      }
    }
  ],
  "rice_braised": [
    {
      "key": "com_trang_bo",
      "code": "CB",
      "price": 200,
      "weight": 700,
      "spicy": 0,
      "tags": [],
      "translations": {
        "ru": "Белый рис с говядиной",
        "ua": "Білий рис з яловичиною",
        "vn": "Cơm trắng bò"
      },
      "short": {
        "ru": "Рис, говядина и овощи.",
        "ua": "Рис, яловичина та овочі.",
        "vn": "Cơm trắng, bò và rau củ."
      }
    },
    {
      "key": "com_trang_heo",
      "code": "CL",
      "price": 200,
      "weight": 700,
      "spicy": 0,
      "tags": [],
      "translations": {
        "ru": "Белый рис со свининой",
        "ua": "Білий рис зі свининою",
        "vn": "Cơm trắng heo"
      },
      "short": {
        "ru": "Рис, свинина и овощи.",
        "ua": "Рис, свинина та овочі.",
        "vn": "Cơm trắng, thịt heo và rau củ."
      }
    },
    {
      "key": "com_trang_ga",
      "code": "CG",
      "price": 200,
      "weight": 700,
      "spicy": 0,
      "tags": [],
      "translations": {
        "ru": "Белый рис с курицей",
        "ua": "Білий рис з куркою",
        "vn": "Cơm trắng gà"
      },
      "short": {
        "ru": "Рис, курица и овощи.",
        "ua": "Рис, курка та овочі.",
        "vn": "Cơm trắng, gà và rau củ."
      }
    },
    {
      "key": "com_trang_ga_chien_xu",
      "code": "CGCx",
      "price": 200,
      "weight": 700,
      "spicy": 0,
      "tags": [
        "popular"
      ],
      "translations": {
        "ru": "Белый рис с курицей в панировке",
        "ua": "Білий рис з куркою в паніровці",
        "vn": "Cơm trắng gà chiên xù"
      },
      "short": {
        "ru": "Рис и хрустящая курица.",
        "ua": "Рис та хрустка курка.",
        "vn": "Cơm trắng cùng gà chiên xù giòn."
      }
    },
    {
      "key": "com_trang_tom",
      "code": "CT",
      "price": 200,
      "weight": 700,
      "spicy": 0,
      "tags": [],
      "translations": {
        "ru": "Белый рис с креветками",
        "ua": "Білий рис з креветками",
        "vn": "Cơm trắng tôm"
      },
      "short": {
        "ru": "Рис, креветки и овощи.",
        "ua": "Рис, креветки та овочі.",
        "vn": "Cơm trắng, tôm và rau củ."
      }
    },
    {
      "key": "com_trang_mix",
      "code": "CMix",
      "price": 200,
      "weight": 700,
      "spicy": 0,
      "tags": [
        "chef"
      ],
      "translations": {
        "ru": "Белый рис MIX",
        "ua": "Білий рис мікс",
        "vn": "Cơm trắng mix"
      },
      "short": {
        "ru": "Рис, микс мяса и овощи.",
        "ua": "Рис, мікс м’яса та овочі.",
        "vn": "Cơm trắng với mix thịt và rau củ."
      }
    },
    {
      "key": "com_trang_nem",
      "code": "CNem",
      "price": 200,
      "weight": 700,
      "spicy": 0,
      "tags": [],
      "translations": {
        "ru": "Белый рис с нэмами",
        "ua": "Білий рис з немами",
        "vn": "Cơm trắng nem"
      },
      "short": {
        "ru": "Рис и жареные нэмы.",
        "ua": "Рис та смажені неми.",
        "vn": "Cơm trắng cùng nem rán."
      }
    }
  ],
  "fried_rice": [
    {
      "key": "com_rang_bo",
      "code": "CRB",
      "price": 200,
      "weight": 700,
      "spicy": 0,
      "tags": [],
      "translations": {
        "ru": "Жареный рис с говядиной",
        "ua": "Смажений рис з яловичиною",
        "vn": "Cơm rang bò"
      },
      "short": {
        "ru": "Рис, говядина, овощи и соус.",
        "ua": "Рис, яловичина, овочі та соус.",
        "vn": "Cơm rang với bò, rau củ và nước sốt."
      }
    },
    {
      "key": "com_rang_heo",
      "code": "CRL",
      "price": 200,
      "weight": 700,
      "spicy": 0,
      "tags": [],
      "translations": {
        "ru": "Жареный рис со свининой",
        "ua": "Смажений рис зі свининою",
        "vn": "Cơm rang heo"
      },
      "short": {
        "ru": "Рис, свинина и овощи.",
        "ua": "Рис, свинина та овочі.",
        "vn": "Cơm rang với thịt heo và rau củ."
      }
    },
    {
      "key": "com_rang_ga",
      "code": "CRG",
      "price": 200,
      "weight": 700,
      "spicy": 0,
      "tags": [],
      "translations": {
        "ru": "Жареный рис с курицей",
        "ua": "Смажений рис з куркою",
        "vn": "Cơm rang gà"
      },
      "short": {
        "ru": "Рис, курица и овощи.",
        "ua": "Рис, курка та овочі.",
        "vn": "Cơm rang với gà và rau củ."
      }
    },
    {
      "key": "com_rang_ga_chien_xu",
      "code": "CRGCx",
      "price": 200,
      "weight": 700,
      "spicy": 0,
      "tags": [
        "popular"
      ],
      "translations": {
        "ru": "Жареный рис с курицей в панировке",
        "ua": "Смажений рис з куркою в паніровці",
        "vn": "Cơm rang gà chiên xù"
      },
      "short": {
        "ru": "Рис и хрустящая курица.",
        "ua": "Рис та хрустка курка.",
        "vn": "Cơm rang cùng gà chiên xù giòn."
      }
    },
    {
      "key": "com_rang_tom",
      "code": "CRT",
      "price": 200,
      "weight": 700,
      "spicy": 0,
      "tags": [],
      "translations": {
        "ru": "Жареный рис с креветками",
        "ua": "Смажений рис з креветками",
        "vn": "Cơm rang tôm"
      },
      "short": {
        "ru": "Рис, креветки и овощи.",
        "ua": "Рис, креветки та овочі.",
        "vn": "Cơm rang với tôm và rau củ."
      }
    },
    {
      "key": "com_rang_mix",
      "code": "CRMix",
      "price": 200,
      "weight": 700,
      "spicy": 0,
      "tags": [
        "chef"
      ],
      "translations": {
        "ru": "Жареный рис MIX",
        "ua": "Смажений рис мікс",
        "vn": "Cơm rang mix"
      },
      "short": {
        "ru": "Рис, микс мяса и овощи.",
        "ua": "Рис, мікс м’яса та овочі.",
        "vn": "Cơm rang với mix thịt và rau củ."
      }
    },
    {
      "key": "com_rang_nem",
      "code": "CRNem",
      "price": 200,
      "weight": 700,
      "spicy": 0,
      "tags": [],
      "translations": {
        "ru": "Жареный рис с нэмами",
        "ua": "Смажений рис з немами",
        "vn": "Cơm rang nem"
      },
      "short": {
        "ru": "Рис и жареные нэмы.",
        "ua": "Рис та смажені неми.",
        "vn": "Cơm rang cùng nem rán."
      }
    }
  ],
  "appetizers": [
    {
      "key": "nem_ran",
      "code": "NEM",
      "price": 200,
      "weight": 700,
      "spicy": 0,
      "tags": [
        "popular"
      ],
      "translations": {
        "ru": "Нэмы",
        "ua": "Неми",
        "vn": "Nem rán"
      },
      "short": {
        "ru": "Жареные хрустящие рулеты с мясной начинкой.",
        "ua": "Смажені хрусткі рулети з м’ясною начинкою.",
        "vn": "Nem rán giòn với nhân thịt đậm vị."
      }
    },
    {
      "key": "ga_chien_xu",
      "code": "GCX",
      "price": 200,
      "weight": 700,
      "spicy": 0,
      "tags": [
        "popular"
      ],
      "translations": {
        "ru": "Курица в панировке",
        "ua": "Курка в паніровці",
        "vn": "Gà chiên xù"
      },
      "short": {
        "ru": "Сочная курица в хрустящей золотистой панировке.",
        "ua": "Соковита курка у хрусткій золотистій паніровці.",
        "vn": "Gà chiên xù vàng giòn, mọng nước bên trong."
      }
    },
    {
      "key": "banh_bao",
      "code": "BBAO",
      "price": 99,
      "weight": 250,
      "spicy": 0,
      "tags": [],
      "translations": {
        "ru": "бао",
        "ua": "бао",
        "vn": "Bánh bao"
      },
      "short": {
        "ru": "Паровая булочка из пшеничного теста с мясной начинкой и яйцом.",
        "ua": "Парова булочка з пшеничного тіста з м’ясною начинкою та яйцем.",
        "vn": "Bánh bao hấp với nhân thịt và trứng."
      }
    }
  ],
  "drinks": [
    {
      "key": "bo_huc",
      "code": "BOH",
      "price": 80,
      "weight": 250,
      "spicy": 0,
      "tags": [],
      "translations": {
        "ru": "Bò húc",
        "ua": "Bò húc",
        "vn": "Bò húc"
      },
      "short": {
        "ru": "Энергетический напиток.",
        "ua": "Енергетичний напій.",
        "vn": "Nước tăng lực."
      }
    },
    {
      "key": "ca_phe_viet",
      "code": "CPV",
      "price": 80,
      "weight": 250,
      "spicy": 0,
      "tags": [],
      "translations": {
        "ru": "Cà phê Việt",
        "ua": "Cà phê Việt",
        "vn": "Cà phê Việt"
      },
      "short": {
        "ru": "Крепкий вьетнамский кофе.",
        "ua": "Міцна в’єтнамська кава.",
        "vn": "Cà phê Việt đậm đà."
      }
    },
    {
      "key": "pepsi_03",
      "code": "P03",
      "price": 69,
      "weight": 300,
      "spicy": 0,
      "tags": [],
      "translations": {
        "ru": "Pepsi 0.3",
        "ua": "Pepsi 0.3",
        "vn": "Pepsi 0.3"
      },
      "short": {
        "ru": "Pepsi 0.3 / 0.33 / 0.5.",
        "ua": "Pepsi 0.3 / 0.33 / 0.5.",
        "vn": "Pepsi 0.3 / 0.33 / 0.5."
      }
    },
    {
      "key": "pepsi_black",
      "code": "PBL",
      "price": 69,
      "weight": 500,
      "spicy": 0,
      "tags": [],
      "translations": {
        "ru": "Pepsi Black / Pepsi Cherry",
        "ua": "Pepsi Black / Pepsi Cherry",
        "vn": "Pepsi Black / Pepsi Cherry"
      },
      "short": {
        "ru": "Pepsi Black или Pepsi Cherry.",
        "ua": "Pepsi Black або Pepsi Cherry.",
        "vn": "Pepsi Black hoặc Pepsi Cherry."
      }
    },
    {
      "key": "mirinda_7up",
      "code": "M7",
      "price": 69,
      "weight": 500,
      "spicy": 0,
      "tags": [],
      "translations": {
        "ru": "Mirinda / 7UP",
        "ua": "Mirinda / 7UP",
        "vn": "Mirinda / 7UP"
      },
      "short": {
        "ru": "Mirinda или 7UP.",
        "ua": "Mirinda або 7UP.",
        "vn": "Mirinda hoặc 7UP."
      }
    },
    {
      "key": "water",
      "code": "WTR",
      "price": 39,
      "weight": 500,
      "spicy": 0,
      "tags": [],
      "translations": {
        "ru": "Вода",
        "ua": "Вода",
        "vn": "Nước"
      },
      "short": {
        "ru": "Газированная или негазированная вода.",
        "ua": "Газована або негазована вода.",
        "vn": "Nước có gas hoặc không gas."
      }
    },
    {
      "key": "juice",
      "code": "JCE",
      "price": 69,
      "weight": 500,
      "spicy": 0,
      "tags": [],
      "translations": {
        "ru": "Сок",
        "ua": "Сік",
        "vn": "Nước ép"
      },
      "short": {
        "ru": "Мультифрукт или томатный сок.",
        "ua": "Мультифрукт або томатний сік.",
        "vn": "Nước ép nhiều trái cây hoặc cà chua."
      }
    }
  ]
};

(function patchMenuForSite(){
  const order = [
    'pho_soups',
    'mi_soups',
    'mien_soups',
    'bun_soups',
    'salat_bun',
    'wok_fried_mien',
    'wok_fried_mi',
    'wok_fried_pho',
    'rice_braised',
    'fried_rice',
    'appetizers',
    'drinks'
  ];

  const out = {};
  order.forEach(k => { if (menuData[k]) out[k] = menuData[k]; });
  Object.keys(menuData).forEach(k => { if (!out[k]) out[k] = menuData[k]; });
  for (const k of Object.keys(menuData)) delete menuData[k];
  for (const k of Object.keys(out)) menuData[k] = out[k];
})();
