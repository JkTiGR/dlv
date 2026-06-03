(function () {
  "use strict";

  const API_BASE = "https://script.google.com/macros/s/AKfycbywwekrmdJvCnKuXKXY-D1_fkJDNm6ES9xAsptqRpoCOS6u9QidiSnGizIK0wybcGTl/exec";
  const DELIVERY_PRICE = 50;
  const FREE_DELIVERY_MIN = 1000;
  const CURRENCY = "грн";
  const LANG_KEY = "DRAGON_GO_LANG_V1";
  const CART_KEY = "DRAGON_GO_CART_V1";
  const PROFILE_KEY = "DRAGON_GO_PROFILE_V1";
  const ORDERS_KEY = "CD_ORDERS_V1";
  const SEARCH_KEY = "DRAGON_GO_SEARCH_V1";
  const INSTALL_KEY = "DRAGON_GO_INSTALL_DISMISSED";
  const STATUS_SNAPSHOT_KEY = "DRAGON_GO_STATUS_SNAPSHOT_V1";
  const PUSH_PREF_KEY = "DRAGON_GO_PUSH_PREF_V1";
  const IMG_DIR = "images/";
  const IMG_EXTS = ["webp", "jpg", "jpeg", "png"];
  const LOCAL_API_BASE = window.DRAGON_STATIC?.localOrdersApi || "";
  const LOCAL_EVENTS_URL = window.DRAGON_STATIC?.localEventsUrl || "";
  const TELEGRAM_MESSAGE_API = window.DRAGON_STATIC?.telegramMessageApi || "";
  const ONLINE_PAYMENT_URL = window.DRAGON_STATIC?.onlinePaymentUrl || "";
  const ROUTE_PARAMS = new URLSearchParams(window.location.search);

  const TG = {
    MAIN_CHANNEL: "main",
    VN_CHANNEL: "vn",
    BOT_USERNAME: "@cyber_dracon_bot",
    PROXY_URL: TELEGRAM_MESSAGE_API
  };

  const FEATURED_KEYS = [
    "pho_bo_xao",
    "pho_ga_xao",
    "pho_mix",
    "mien_xao_tom",
    "com_rang_tom",
    "salat_bun_nem",
    "ga_chien_xu",
    "nem_ran"
  ];

  const CAT_LABELS = {
    top: { ru: "TOP", ua: "TOP", vn: "TOP" },
    pho_soups: { ru: "Фо", ua: "Фо", vn: "Pho" },
    bun_soups: { ru: "Бун", ua: "Бун", vn: "Bun" },
    salat_bun: { ru: "Бун салат", ua: "Бун салат", vn: "Bun salad" },
    mien_soups: { ru: "Миен", ua: "Мiен", vn: "Mien" },
    mi_soups: { ru: "Ми", ua: "Mi", vn: "Mi" },
    wok_fried_pho: { ru: "Вок Фо", ua: "Вок Фо", vn: "Wok pho" },
    wok_fried_mien: { ru: "Вок Миен", ua: "Вок Miен", vn: "Wok mien" },
    wok_fried_mi: { ru: "Вок лапша", ua: "Вок локшина", vn: "Wok noodles" },
    rice_braised: { ru: "Рис", ua: "Рис", vn: "Rice" },
    fried_rice: { ru: "Жареный рис", ua: "Смажений рис", vn: "Fried rice" },
    appetizers: { ru: "Закуски", ua: "Закуски", vn: "Snacks" },
    drinks: { ru: "Напитки", ua: "Напої", vn: "Drinks" }
  };

  const I18N = {
    ru: {
      app: {
        screenMenuButton: "☰",
        installButton: "Установить",
        installReady: "Установить app",
        installSaved: "Уже установлено",
        heroEyebrow: "DRAGON delivery app",
        heroTitle: "Cyber Dragon в формате food-delivery app.",
        heroText: "Заказывай Фо, вок, рис и напитки в интерфейсе, который ближе к Glovo, Uber Eats и Bolt Food.",
        heroOrderButton: "Начать заказ",
        heroTrackButton: "Мои заказы",
        heroEtaBadge: "25-40 мин",
        heroFreeBadge: "Бесплатная доставка от 1000 грн",
        serviceKicker: "Сервис",
        serviceTitle: "Собрано как приложение доставки, а не просто меню.",
        featuredKicker: "Популярное",
        featuredTitle: "Топ-позиции из текущего меню DRAGON.",
        featuredOpenMenuButton: "Открыть меню",
        categoryKicker: "Категории",
        categoryTitle: "Заходи с нужного раздела.",
        menuKicker: "Каталог",
        menuTitle: "Все, что доступно прямо сейчас.",
        ordersKicker: "Заказы",
        ordersTitle: "Статусы заказов с этого браузера.",
        profileKicker: "Профиль",
        profileTitle: "Сохрани адрес и телефон, чтобы оформлять быстрее.",
        linksKicker: "Ссылки DRAGON",
        linksTitle: "Ресторан, соцсети и быстрая оплата.",
        navHome: "Главная",
        navMenu: "Меню",
        navOrders: "Заказы",
        navAccount: "Профиль",
        cartFabTitle: "Корзина",
        cartFabMetaEmpty: "0 позиций",
        cartFabMeta: "{count} поз.",
        searchPlaceholder: "Поиск блюда",
        searchClearButton: "Сброс",
        orderTypeLabel: "Тип заказа",
        paymentTypeLabel: "Оплата",
        delivery: "Доставка",
        takeaway: "Самовывоз",
        onSite: "На месте",
        card: "Карта",
        cash: "Наличные",
        deliveryAddressLabel: "Адрес доставки",
        deliveryAddressPlaceholder: "Город, улица, дом, подъезд",
        pickupLabel: "Через сколько забрать (мин)",
        pickupPlaceholder: "20",
        tableLabel: "Номер стола",
        tablePlaceholder: "5",
        checkoutPhoneLabel: "Телефон",
        checkoutPhonePlaceholder: "+380 63 000 00 00",
        checkoutCommentLabel: "Комментарий к заказу",
        checkoutCommentPlaceholder: "Позвонить у входа, без кинзы, квартира 12",
        clearCartButton: "Очистить корзину",
        submitOrderButton: "Оформить заказ",
        cartDrawerKicker: "Оформление",
        cartDrawerTitle: "Корзина DRAGON GO",
        productDrawerKicker: "Блюдо",
        productNoteLabel: "Комментарий к позиции",
        productNotePlaceholder: "Без лука, больше соуса, не острое",
        productSaveButton: "Сохранить в корзину",
        summarySubtotalLabel: "Сумма блюд",
        summaryDeliveryLabel: "Доставка",
        summaryTotalLabel: "Итого",
        freeDeliveryText: "Бесплатно",
        freeDeliveryLong: "Бесплатная доставка от 1000 грн",
        unavailableText: "Сегодня недоступно",
        cartEmpty: "Корзина пока пустая.",
        ordersEmpty: "Здесь появятся заказы после первого оформления.",
        ordersEmptyAction: "Собрать первый заказ",
        trackPlaceholder: "Код заказа, например a123",
        trackButton: "Проверить",
        refreshOrdersButton: "Обновить",
        profilePhoneLabel: "Телефон",
        profileAddressLabel: "Адрес доставки",
        profilePhonePlaceholder: "+380 63 000 00 00",
        profileAddressPlaceholder: "Город, улица, дом, подъезд",
        saveProfileButton: "Сохранить профиль",
        phoneTileLabel: "Позвонить",
        mapTileLabel: "Открыть карту",
        mapTileValue: "Героев Крут, 22",
        payTileLabel: "Оплата online",
        payTileValue: "Secure checkout",
        onlinePaymentLabel: "Онлайн оплата",
        onlinePaymentHint: "Защищенный checkout откроется во внешнем окне. Номер карты в приложении не хранится.",
        onlinePaymentButton: "Оплатить онлайн",
        siteTileLabel: "Каталог",
        siteTileValue: "Открыть меню DRAGON GO",
        langDrawerKicker: "Язык",
        langDrawerTitle: "Выбери язык",
        languageRU: "Русский",
        languageUA: "Украинский",
        languageVN: "Vietnamese",
        close: "Закрыть",
        openMenuShort: "Меню",
        installLater: "Позже",
        addButton: "Добавить",
        topBadge: "Top",
        ingredientsLabel: "Состав",
        requiredShort: "обязательно",
        optionalShort: "необязательно",
        receiptButton: "Чек в Telegram",
        serviceCards: [
          {
            title: "Оформление за минуты",
            text: "Быстрые категории, карточки блюд и checkout в одном потоке."
          },
          {
            title: "Статус заказа",
            text: "Заказ сохраняется локально и подтягивает обновления из доступных каналов."
          },
          {
            title: "Тот же backend DRAGON",
            text: "Новый app-слой работает поверх текущего меню, Telegram и Apps Script."
          }
        ],
        status: {
          NEW: "Новый",
          COOKING: "Готовится",
          READY: "Готов",
          HANDED: "Выдан",
          CANCELLED: "Отменен"
        },
        sync: {
          local: "Локально",
          sheet: "Sheet",
          telegram: "Telegram",
          ok: "ok",
          pending: "pending",
          offline: "offline"
        },
        validation: {
          address: "Укажи адрес доставки.",
          phone: "Укажи телефон.",
          pickup: "Укажи время самовывоза.",
          table: "Укажи номер стола.",
          empty: "Корзина пуста.",
          option: "Выбери опцию: {title}"
        },
        toasts: {
          profileSaved: "Профиль сохранен.",
          orderPlaced: "Заказ {code} отправлен.",
          statusUpdated: "Статус {code} обновлен.",
          orderNotFound: "Заказ не найден.",
          cartCleared: "Корзина очищена.",
          added: "{name} добавлено в корзину.",
          unavailable: "Некоторые позиции сегодня недоступны и были удалены.",
          installUnavailable: "Установка сейчас недоступна в этом браузере.",
          onlinePaymentMissing: "Ссылка для online-оплаты пока не настроена."
        },
        meta: {
          quantity: "{count} шт.",
          from: "от",
          dishCount: "{count} блюд",
          sections: "{count} разделов"
        }
      }
    },
    ua: {
      app: {
        screenMenuButton: "☰",
        installButton: "Встановити",
        installReady: "Встановити app",
        installSaved: "Уже встановлено",
        heroEyebrow: "DRAGON delivery app",
        heroTitle: "Cyber Dragon у форматi food-delivery app.",
        heroText: "Замовляй Фо, вок, рис та напої в iнтерфейсi, ближчому до Glovo, Uber Eats i Bolt Food.",
        heroOrderButton: "Почати замовлення",
        heroTrackButton: "Мої замовлення",
        heroEtaBadge: "25-40 хв",
        heroFreeBadge: "Безкоштовна доставка вiд 1000 грн",
        serviceKicker: "Сервiс",
        serviceTitle: "Зiбрано як застосунок доставки, а не просто меню.",
        featuredKicker: "Популярне",
        featuredTitle: "Топ-позицiї з поточного меню DRAGON.",
        featuredOpenMenuButton: "Вiдкрити меню",
        categoryKicker: "Категорiї",
        categoryTitle: "Заходь з потрiбного роздiлу.",
        menuKicker: "Каталог",
        menuTitle: "Все, що доступно прямо зараз.",
        ordersKicker: "Замовлення",
        ordersTitle: "Статуси замовлень з цього браузера.",
        profileKicker: "Профiль",
        profileTitle: "Збережи адресу й телефон для швидшого checkout.",
        linksKicker: "Посилання DRAGON",
        linksTitle: "Ресторан, соцмережi та швидка оплата.",
        navHome: "Головна",
        navMenu: "Меню",
        navOrders: "Замовлення",
        navAccount: "Профiль",
        cartFabTitle: "Кошик",
        cartFabMetaEmpty: "0 позицiй",
        cartFabMeta: "{count} поз.",
        searchPlaceholder: "Пошук страви",
        searchClearButton: "Очистити",
        orderTypeLabel: "Тип замовлення",
        paymentTypeLabel: "Оплата",
        delivery: "Доставка",
        takeaway: "Самовивiз",
        onSite: "У закладi",
        card: "Карта",
        cash: "Готiвка",
        deliveryAddressLabel: "Адреса доставки",
        deliveryAddressPlaceholder: "Мiсто, вулиця, будинок, пiд'їзд",
        pickupLabel: "Через скiльки забрати (хв)",
        pickupPlaceholder: "20",
        tableLabel: "Номер столу",
        tablePlaceholder: "5",
        checkoutPhoneLabel: "Телефон",
        checkoutPhonePlaceholder: "+380 63 000 00 00",
        checkoutCommentLabel: "Коментар до замовлення",
        checkoutCommentPlaceholder: "Подзвонити бiля входу, без кiнзи, квартира 12",
        clearCartButton: "Очистити кошик",
        submitOrderButton: "Оформити замовлення",
        cartDrawerKicker: "Оформлення",
        cartDrawerTitle: "Кошик DRAGON GO",
        productDrawerKicker: "Страва",
        productNoteLabel: "Коментар до позицiї",
        productNotePlaceholder: "Без цибулi, бiльше соусу, не гостре",
        productSaveButton: "Зберегти у кошику",
        summarySubtotalLabel: "Сума страв",
        summaryDeliveryLabel: "Доставка",
        summaryTotalLabel: "Разом",
        freeDeliveryText: "Безкоштовно",
        freeDeliveryLong: "Безкоштовна доставка вiд 1000 грн",
        unavailableText: "Сьогоднi недоступно",
        cartEmpty: "Кошик поки порожнiй.",
        ordersEmpty: "Тут з'являться замовлення пiсля першого оформлення.",
        ordersEmptyAction: "Зiбрати перше замовлення",
        trackPlaceholder: "Код замовлення, наприклад a123",
        trackButton: "Перевiрити",
        refreshOrdersButton: "Оновити",
        profilePhoneLabel: "Телефон",
        profileAddressLabel: "Адреса доставки",
        profilePhonePlaceholder: "+380 63 000 00 00",
        profileAddressPlaceholder: "Мiсто, вулиця, будинок, пiд'їзд",
        saveProfileButton: "Зберегти профiль",
        phoneTileLabel: "Подзвонити",
        mapTileLabel: "Вiдкрити мапу",
        mapTileValue: "Героїв Крут, 22",
        payTileLabel: "Оплата online",
        payTileValue: "Secure checkout",
        onlinePaymentLabel: "Онлайн оплата",
        onlinePaymentHint: "Захищений checkout відкриється в окремому вікні. Номер картки в застосунку не зберігається.",
        onlinePaymentButton: "Оплатити онлайн",
        siteTileLabel: "Каталог",
        siteTileValue: "Вiдкрити меню DRAGON GO",
        langDrawerKicker: "Мова",
        langDrawerTitle: "Обери мову",
        languageRU: "Росiйська",
        languageUA: "Українська",
        languageVN: "Vietnamese",
        close: "Закрити",
        openMenuShort: "Меню",
        installLater: "Пiзнiше",
        addButton: "Додати",
        topBadge: "Top",
        ingredientsLabel: "Склад",
        requiredShort: "обов'язково",
        optionalShort: "необов'язково",
        receiptButton: "Чек у Telegram",
        serviceCards: [
          {
            title: "Оформлення за хвилини",
            text: "Швидкi категорiї, картки страв i checkout в одному потоцi."
          },
          {
            title: "Статус замовлення",
            text: "Замовлення зберiгається локально i пiдтягує оновлення з доступних каналiв."
          },
          {
            title: "Той самий backend DRAGON",
            text: "Новий app-шар працює поверх поточного меню, Telegram i Apps Script."
          }
        ],
        status: {
          NEW: "Нове",
          COOKING: "Готується",
          READY: "Готове",
          HANDED: "Видане",
          CANCELLED: "Скасоване"
        },
        sync: {
          local: "Локально",
          sheet: "Sheet",
          telegram: "Telegram",
          ok: "ok",
          pending: "pending",
          offline: "offline"
        },
        validation: {
          address: "Вкажи адресу доставки.",
          phone: "Вкажи телефон.",
          pickup: "Вкажи час самовивозу.",
          table: "Вкажи номер столу.",
          empty: "Кошик порожнiй.",
          option: "Оберiть опцiю: {title}"
        },
        toasts: {
          profileSaved: "Профiль збережено.",
          orderPlaced: "Замовлення {code} вiдправлено.",
          statusUpdated: "Статус {code} оновлено.",
          orderNotFound: "Замовлення не знайдено.",
          cartCleared: "Кошик очищено.",
          added: "{name} додано у кошик.",
          unavailable: "Деякi позицiї сьогоднi недоступнi та були прибранi.",
          installUnavailable: "Встановлення зараз недоступне в цьому браузерi.",
          onlinePaymentMissing: "Посилання для online-оплати ще не налаштоване."
        },
        meta: {
          quantity: "{count} шт.",
          from: "вiд",
          dishCount: "{count} страв",
          sections: "{count} роздiлiв"
        }
      }
    },
    vn: {
      app: {
        screenMenuButton: "☰",
        installButton: "Cai dat",
        installReady: "Cai app",
        installSaved: "Da cai",
        heroEyebrow: "DRAGON delivery app",
        heroTitle: "Cyber Dragon theo dung kieu food-delivery app.",
        heroText: "Dat pho, wok, com va do uong trong mot giao dien gan voi Glovo, Uber Eats va Bolt Food.",
        heroOrderButton: "Bat dau dat mon",
        heroTrackButton: "Don cua toi",
        heroEtaBadge: "25-40 phut",
        heroFreeBadge: "Mien phi giao tu 1000 грн",
        serviceKicker: "Dich vu",
        serviceTitle: "Duoc lam nhu mot ung dung giao do an, khong chi la menu web.",
        featuredKicker: "Noi bat",
        featuredTitle: "Mon top tu menu hien tai cua DRAGON.",
        featuredOpenMenuButton: "Mo menu",
        categoryKicker: "Danh muc",
        categoryTitle: "Vao thang danh muc ban can.",
        menuKicker: "Kham pha",
        menuTitle: "Tat ca mon dang co san luc nay.",
        ordersKicker: "Don hang",
        ordersTitle: "Trang thai don hang tren trinh duyet nay.",
        profileKicker: "Ho so",
        profileTitle: "Luu dia chi va so dien thoai de thanh toan nhanh hon.",
        linksKicker: "Lien ket DRAGON",
        linksTitle: "Nha hang, mang xa hoi va thanh toan nhanh.",
        navHome: "Home",
        navMenu: "Menu",
        navOrders: "Orders",
        navAccount: "Account",
        cartFabTitle: "Gio hang",
        cartFabMetaEmpty: "0 mon",
        cartFabMeta: "{count} mon",
        searchPlaceholder: "Tim mon",
        searchClearButton: "Xoa",
        orderTypeLabel: "Hinh thuc dat",
        paymentTypeLabel: "Thanh toan",
        delivery: "Giao hang",
        takeaway: "Mang di",
        onSite: "An tai cho",
        card: "The",
        cash: "Tien mat",
        deliveryAddressLabel: "Dia chi giao hang",
        deliveryAddressPlaceholder: "Thanh pho, duong, so nha, toa nha",
        pickupLabel: "Lay sau bao nhieu phut",
        pickupPlaceholder: "20",
        tableLabel: "So ban",
        tablePlaceholder: "5",
        checkoutPhoneLabel: "Dien thoai",
        checkoutPhonePlaceholder: "+380 63 000 00 00",
        checkoutCommentLabel: "Ghi chu don hang",
        checkoutCommentPlaceholder: "Goi dien khi den, khong rau mui, can ho 12",
        clearCartButton: "Xoa gio",
        submitOrderButton: "Dat hang",
        cartDrawerKicker: "Checkout",
        cartDrawerTitle: "Gio DRAGON GO",
        productDrawerKicker: "Mon an",
        productNoteLabel: "Ghi chu cho mon",
        productNotePlaceholder: "Khong hanh, them sot, khong cay",
        productSaveButton: "Luu vao gio",
        summarySubtotalLabel: "Tam tinh",
        summaryDeliveryLabel: "Phi giao",
        summaryTotalLabel: "Tong",
        freeDeliveryText: "Mien phi",
        freeDeliveryLong: "Mien phi giao tu 1000 грн",
        unavailableText: "Tam het hom nay",
        cartEmpty: "Gio hang dang trong.",
        ordersEmpty: "Don hang se hien o day sau lan dat dau tien.",
        ordersEmptyAction: "Dat mon dau tien",
        trackPlaceholder: "Ma don hang, vi du a123",
        trackButton: "Kiem tra",
        refreshOrdersButton: "Lam moi",
        profilePhoneLabel: "Dien thoai",
        profileAddressLabel: "Dia chi giao hang",
        profilePhonePlaceholder: "+380 63 000 00 00",
        profileAddressPlaceholder: "Thanh pho, duong, so nha, toa nha",
        saveProfileButton: "Luu ho so",
        phoneTileLabel: "Goi DRAGON",
        mapTileLabel: "Mo ban do",
        mapTileValue: "Heroes of Krut, 22",
        payTileLabel: "Thanh toan online",
        payTileValue: "Secure checkout",
        onlinePaymentLabel: "Thanh toan online",
        onlinePaymentHint: "Trang thanh toan bao mat se mo o cua so ngoai. Ung dung khong luu so the.",
        onlinePaymentButton: "Thanh toan online",
        siteTileLabel: "Menu",
        siteTileValue: "Mo menu DRAGON GO",
        langDrawerKicker: "Ngon ngu",
        langDrawerTitle: "Chon ngon ngu",
        languageRU: "Russian",
        languageUA: "Ukrainian",
        languageVN: "Tieng Viet",
        close: "Dong",
        openMenuShort: "Menu",
        installLater: "De sau",
        addButton: "Them",
        topBadge: "Top",
        ingredientsLabel: "Thanh phan",
        requiredShort: "bat buoc",
        optionalShort: "khong bat buoc",
        receiptButton: "Hoa don Telegram",
        serviceCards: [
          {
            title: "Checkout trong vai phut",
            text: "Danh muc nhanh, the mon an va checkout trong mot luong duy nhat."
          },
          {
            title: "Theo doi trang thai",
            text: "Don hang duoc luu cuc bo va cap nhat tu cac kenh co san."
          },
          {
            title: "Dung chung backend DRAGON",
            text: "Lop app moi nay van dung menu hien tai, Telegram va Apps Script."
          }
        ],
        status: {
          NEW: "Moi",
          COOKING: "Dang nau",
          READY: "San sang",
          HANDED: "Da giao",
          CANCELLED: "Da huy"
        },
        sync: {
          local: "Local",
          sheet: "Sheet",
          telegram: "Telegram",
          ok: "ok",
          pending: "pending",
          offline: "offline"
        },
        validation: {
          address: "Vui long nhap dia chi giao hang.",
          phone: "Vui long nhap so dien thoai.",
          pickup: "Vui long nhap thoi gian mang di.",
          table: "Vui long nhap so ban.",
          empty: "Gio hang dang trong.",
          option: "Hay chon tuy chon: {title}"
        },
        toasts: {
          profileSaved: "Da luu ho so.",
          orderPlaced: "Da gui don {code}.",
          statusUpdated: "Da cap nhat trang thai {code}.",
          orderNotFound: "Khong tim thay don hang.",
          cartCleared: "Da xoa gio hang.",
          added: "Da them {name} vao gio.",
          unavailable: "Mot so mon hom nay khong co va da duoc go khoi gio.",
          installUnavailable: "Khong the cai dat trong trinh duyet nay.",
          onlinePaymentMissing: "Lien ket thanh toan online chua duoc cau hinh."
        },
        meta: {
          quantity: "{count} mon",
          from: "tu",
          dishCount: "{count} mon",
          sections: "{count} danh muc"
        }
      }
    }
  };

  const TRACKING_COPY = {
    ru: {
      buttons: {
        enablePush: "Включить live updates",
        pushOn: "Live updates включены",
        pushOff: "Уведомления выключены",
        pushBlocked: "Уведомления заблокированы",
        pushUnsupported: "Push недоступен",
        latestReceipt: "Последний чек",
        receiptDetails: "Трекинг и чек",
        openTelegram: "Открыть чек в Telegram",
        share: "Поделиться",
        copyCode: "Копировать код",
        copySummary: "Копировать сводку"
      },
      labels: {
        eta: "ETA",
        payment: "Оплата",
        subtotal: "Сумма блюд",
        delivery: "Доставка",
        total: "Итого",
        type: "Тип",
        phone: "Телефон",
        address: "Адрес",
        pickup: "Самовывоз",
        table: "Стол",
        updated: "Обновлено",
        created: "Создан",
        comment: "Комментарий",
        items: "Позиции",
        minutes: "мин",
        receiptMissing: "Чек в Telegram появится после обработки заказа.",
        cancelledTitle: "Заказ отменен",
        cancelledBody: "Если это ошибка, свяжитесь с DRAGON."
      },
      payment: {
        cash: "Наличные",
        card: "Карта"
      },
      toasts: {
        pushEnabled: "Браузерные уведомления включены.",
        pushDisabled: "Браузерные уведомления выключены.",
        pushBlocked: "Браузер блокирует уведомления для этой страницы.",
        pushUnsupported: "Этот браузер не поддерживает push-уведомления.",
        copiedCode: "Код заказа скопирован.",
        copiedSummary: "Сводка заказа скопирована.",
        latestMissing: "Пока нет заказа для открытия чека.",
        shareFallback: "Шаринг недоступен, сводка заказа скопирована."
      },
      timeline: {
        delivery: [
          { key: "NEW", title: "Заказ отправлен", subtitle: "Ресторан получил заказ" },
          { key: "COOKING", title: "Готовим на кухне", subtitle: "Повара собирают ваш заказ" },
          { key: "READY", title: "Упакован к отправке", subtitle: "Заказ почти у вас" },
          { key: "HANDED", title: "Доставлено", subtitle: "Заказ завершен" }
        ],
        takeaway: [
          { key: "NEW", title: "Заказ отправлен", subtitle: "Точка приняла заказ" },
          { key: "COOKING", title: "Готовим", subtitle: "Кухня уже в работе" },
          { key: "READY", title: "Готов к самовывозу", subtitle: "Можно приезжать" },
          { key: "HANDED", title: "Выдан", subtitle: "Заказ получен" }
        ],
        on_site: [
          { key: "NEW", title: "Заказ принят", subtitle: "Официант передал его на кухню" },
          { key: "COOKING", title: "Готовим", subtitle: "Блюда сейчас в работе" },
          { key: "READY", title: "Готов к подаче", subtitle: "Почти у вашего стола" },
          { key: "HANDED", title: "Подан", subtitle: "Приятного аппетита" }
        ]
      },
      eta: {
        delivery: { NEW: "35-45 мин", COOKING: "20-30 мин", READY: "5-15 мин", HANDED: "Завершен" },
        takeaway: { NEW: "20-25 мин", COOKING: "10-15 мин", READY: "Можно забирать", HANDED: "Завершен" },
        on_site: { NEW: "10-15 мин", COOKING: "5-10 мин", READY: "Подача сейчас", HANDED: "Подано" }
      }
    },
    ua: {
      buttons: {
        enablePush: "Увімкнути live updates",
        pushOn: "Live updates увімкнено",
        pushOff: "Сповіщення вимкнено",
        pushBlocked: "Сповіщення заблоковано",
        pushUnsupported: "Push недоступний",
        latestReceipt: "Останній чек",
        receiptDetails: "Трекінг і чек",
        openTelegram: "Відкрити чек у Telegram",
        share: "Поділитися",
        copyCode: "Копіювати код",
        copySummary: "Копіювати зведення"
      },
      labels: {
        eta: "ETA",
        payment: "Оплата",
        subtotal: "Сума страв",
        delivery: "Доставка",
        total: "Разом",
        type: "Тип",
        phone: "Телефон",
        address: "Адреса",
        pickup: "Самовивіз",
        table: "Стіл",
        updated: "Оновлено",
        created: "Створено",
        comment: "Коментар",
        items: "Позиції",
        minutes: "хв",
        receiptMissing: "Чек у Telegram з'явиться після обробки замовлення.",
        cancelledTitle: "Замовлення скасовано",
        cancelledBody: "Якщо це помилка, зв'яжіться з DRAGON."
      },
      payment: {
        cash: "Готівка",
        card: "Карта"
      },
      toasts: {
        pushEnabled: "Браузерні сповіщення увімкнено.",
        pushDisabled: "Браузерні сповіщення вимкнено.",
        pushBlocked: "Браузер блокує сповіщення для цієї сторінки.",
        pushUnsupported: "Цей браузер не підтримує push-сповіщення.",
        copiedCode: "Код замовлення скопійовано.",
        copiedSummary: "Зведення замовлення скопійовано.",
        latestMissing: "Поки немає замовлення для відкриття чека.",
        shareFallback: "Шаринг недоступний, зведення замовлення скопійовано."
      },
      timeline: {
        delivery: [
          { key: "NEW", title: "Замовлення відправлено", subtitle: "Ресторан отримав замовлення" },
          { key: "COOKING", title: "Готуємо на кухні", subtitle: "Кухня вже збирає ваше замовлення" },
          { key: "READY", title: "Упаковано до відправки", subtitle: "Замовлення майже у вас" },
          { key: "HANDED", title: "Доставлено", subtitle: "Замовлення завершено" }
        ],
        takeaway: [
          { key: "NEW", title: "Замовлення відправлено", subtitle: "Точка прийняла замовлення" },
          { key: "COOKING", title: "Готуємо", subtitle: "Кухня вже в роботі" },
          { key: "READY", title: "Готове до самовивозу", subtitle: "Можна приїжджати" },
          { key: "HANDED", title: "Видано", subtitle: "Замовлення отримано" }
        ],
        on_site: [
          { key: "NEW", title: "Замовлення прийнято", subtitle: "Офіціант передав його на кухню" },
          { key: "COOKING", title: "Готуємо", subtitle: "Страви вже в роботі" },
          { key: "READY", title: "Готове до подачі", subtitle: "Майже біля вашого столу" },
          { key: "HANDED", title: "Подано", subtitle: "Смачного" }
        ]
      },
      eta: {
        delivery: { NEW: "35-45 хв", COOKING: "20-30 хв", READY: "5-15 хв", HANDED: "Завершено" },
        takeaway: { NEW: "20-25 хв", COOKING: "10-15 хв", READY: "Можна забирати", HANDED: "Завершено" },
        on_site: { NEW: "10-15 хв", COOKING: "5-10 хв", READY: "Подача зараз", HANDED: "Подано" }
      }
    },
    vn: {
      buttons: {
        enablePush: "Bat live updates",
        pushOn: "Live updates da bat",
        pushOff: "Thong bao da tat",
        pushBlocked: "Thong bao bi chan",
        pushUnsupported: "Push khong ho tro",
        latestReceipt: "Hoa don moi nhat",
        receiptDetails: "Track va hoa don",
        openTelegram: "Mo hoa don Telegram",
        share: "Chia se",
        copyCode: "Sao chep ma",
        copySummary: "Sao chep tom tat"
      },
      labels: {
        eta: "ETA",
        payment: "Thanh toan",
        subtotal: "Tam tinh",
        delivery: "Phi giao",
        total: "Tong",
        type: "Hinh thuc",
        phone: "Dien thoai",
        address: "Dia chi",
        pickup: "Mang di",
        table: "Ban",
        updated: "Cap nhat",
        created: "Tao luc",
        comment: "Ghi chu",
        items: "Mon",
        minutes: "phut",
        receiptMissing: "Hoa don Telegram se co sau khi don duoc xu ly.",
        cancelledTitle: "Don hang da huy",
        cancelledBody: "Neu day la loi, hay lien he DRAGON."
      },
      payment: {
        cash: "Tien mat",
        card: "The"
      },
      toasts: {
        pushEnabled: "Da bat thong bao trinh duyet.",
        pushDisabled: "Da tat thong bao trinh duyet.",
        pushBlocked: "Trinh duyet dang chan thong bao cho trang nay.",
        pushUnsupported: "Trinh duyet nay khong ho tro push.",
        copiedCode: "Da sao chep ma don hang.",
        copiedSummary: "Da sao chep tom tat don hang.",
        latestMissing: "Chua co don hang de mo hoa don.",
        shareFallback: "Khong the chia se, da sao chep tom tat don hang."
      },
      timeline: {
        delivery: [
          { key: "NEW", title: "Da gui don hang", subtitle: "Nha hang da nhan don" },
          { key: "COOKING", title: "Dang nau", subtitle: "Bep dang chuan bi don cua ban" },
          { key: "READY", title: "Da dong goi", subtitle: "Don hang sap den" },
          { key: "HANDED", title: "Da giao", subtitle: "Don hang da hoan tat" }
        ],
        takeaway: [
          { key: "NEW", title: "Da gui don hang", subtitle: "Cua hang da nhan don" },
          { key: "COOKING", title: "Dang nau", subtitle: "Bep dang lam mon" },
          { key: "READY", title: "San sang lay", subtitle: "Ban co the den lay" },
          { key: "HANDED", title: "Da nhan", subtitle: "Don hang da xong" }
        ],
        on_site: [
          { key: "NEW", title: "Da nhan don", subtitle: "Nha hang da dua xuong bep" },
          { key: "COOKING", title: "Dang nau", subtitle: "Mon an dang duoc chuan bi" },
          { key: "READY", title: "San sang phuc vu", subtitle: "Sap den ban cua ban" },
          { key: "HANDED", title: "Da phuc vu", subtitle: "Chuc ngon mieng" }
        ]
      },
      eta: {
        delivery: { NEW: "35-45 phut", COOKING: "20-30 phut", READY: "5-15 phut", HANDED: "Hoan tat" },
        takeaway: { NEW: "20-25 phut", COOKING: "10-15 phut", READY: "Co the lay ngay", HANDED: "Hoan tat" },
        on_site: { NEW: "10-15 phut", COOKING: "5-10 phut", READY: "Dang phuc vu", HANDED: "Da phuc vu" }
      }
    }
  };

  const state = {
    lang: localStorage.getItem(LANG_KEY) || "ru",
    screen: "home",
    search: localStorage.getItem(SEARCH_KEY) || "",
    activeCategory: "",
    descriptions: null,
    featured: [],
    flatMenu: [],
    groupedMenu: [],
    cart: new Map(),
    dishCtx: null,
    installPrompt: null,
    receiptCode: "",
    statusSnapshot: {},
    notificationsHydrated: false,
    pushEnabled: localStorage.getItem(PUSH_PREF_KEY) !== "0",
    route: {
      screen: String(ROUTE_PARAMS.get("screen") || "").trim(),
      code: String(ROUTE_PARAMS.get("code") || "").trim().toLowerCase(),
      receipt: ROUTE_PARAMS.get("receipt") === "1"
    },
    profile: {
      phone: "",
      address: ""
    },
    checkout: {
      type: "delivery",
      paymentType: "card",
      phone: "",
      address: "",
      pickupIn: "20",
      table: "",
      comment: ""
    }
  };

  const dom = {
    topbar: document.getElementById("topbar"),
    overlay: document.getElementById("overlay"),
    screens: document.querySelectorAll(".screen"),
    navButtons: document.querySelectorAll(".nav-button"),
    cartFab: document.getElementById("cartFab"),
    cartFabTitle: document.getElementById("cartFabTitle"),
    cartFabMeta: document.getElementById("cartFabMeta"),
    cartFabTotal: document.getElementById("cartFabTotal"),
    featuredRail: document.getElementById("featuredRail"),
    serviceGrid: document.getElementById("serviceGrid"),
    categoryGrid: document.getElementById("categoryGrid"),
    menuSections: document.getElementById("menuSections"),
    categoryRail: document.getElementById("categoryRail"),
    menuRailHost: document.getElementById("menuRailHost"),
    topbarRailDock: document.getElementById("topbarRailDock"),
    ordersList: document.getElementById("ordersList"),
    searchInput: document.getElementById("searchInput"),
    searchClearButton: document.getElementById("searchClearButton"),
    trackCodeInput: document.getElementById("trackCodeInput"),
    trackCodeButton: document.getElementById("trackCodeButton"),
    refreshOrdersButton: document.getElementById("refreshOrdersButton"),
    enablePushButton: document.getElementById("enablePushButton"),
    latestReceiptButton: document.getElementById("latestReceiptButton"),
    installButton: document.getElementById("installButton"),
    langButton: document.getElementById("langButton"),
    screenMenuButton: document.getElementById("screenMenuButton"),
    productDrawer: document.getElementById("productDrawer"),
    productTitle: document.getElementById("productTitle"),
    productMeta: document.getElementById("productMeta"),
    productDescription: document.getElementById("productDescription"),
    productMedia: document.getElementById("productMedia"),
    productOptions: document.getElementById("productOptions"),
    productNote: document.getElementById("productNote"),
    productQty: document.getElementById("productQty"),
    productMinusButton: document.getElementById("productMinusButton"),
    productPlusButton: document.getElementById("productPlusButton"),
    productSaveButton: document.getElementById("productSaveButton"),
    cartDrawer: document.getElementById("cartDrawer"),
    cartLines: document.getElementById("cartLines"),
    clearCartButton: document.getElementById("clearCartButton"),
    submitOrderButton: document.getElementById("submitOrderButton"),
    summarySubtotalValue: document.getElementById("summarySubtotalValue"),
    summaryDeliveryValue: document.getElementById("summaryDeliveryValue"),
    summaryTotalValue: document.getElementById("summaryTotalValue"),
    orderTypeRow: document.getElementById("orderTypeRow"),
    paymentTypeRow: document.getElementById("paymentTypeRow"),
    onlinePaymentCard: document.getElementById("onlinePaymentCard"),
    onlinePaymentButton: document.getElementById("onlinePaymentButton"),
    deliveryAddressField: document.getElementById("deliveryAddressField"),
    deliveryAddressInput: document.getElementById("deliveryAddressInput"),
    pickupField: document.getElementById("pickupField"),
    pickupInput: document.getElementById("pickupInput"),
    tableField: document.getElementById("tableField"),
    tableInput: document.getElementById("tableInput"),
    checkoutPhoneInput: document.getElementById("checkoutPhoneInput"),
    checkoutCommentInput: document.getElementById("checkoutCommentInput"),
    profilePhone: document.getElementById("profilePhone"),
    profileAddress: document.getElementById("profileAddress"),
    saveProfileButton: document.getElementById("saveProfileButton"),
    langDrawer: document.getElementById("langDrawer"),
    languageStack: document.getElementById("languageStack"),
    receiptDrawer: document.getElementById("receiptDrawer"),
    receiptHero: document.getElementById("receiptHero"),
    receiptTimeline: document.getElementById("receiptTimeline"),
    receiptSummary: document.getElementById("receiptSummary"),
    receiptItems: document.getElementById("receiptItems"),
    receiptPayOnlineButton: document.getElementById("receiptPayOnlineButton"),
    receiptOpenTelegramButton: document.getElementById("receiptOpenTelegramButton"),
    receiptShareButton: document.getElementById("receiptShareButton"),
    receiptCopyCodeButton: document.getElementById("receiptCopyCodeButton"),
    receiptCopySummaryButton: document.getElementById("receiptCopySummaryButton"),
    toast: document.getElementById("toast"),
    heroOrderButton: document.getElementById("heroOrderButton"),
    heroTrackButton: document.getElementById("heroTrackButton"),
    featuredOpenMenuButton: document.getElementById("featuredOpenMenuButton"),
    payTileLink: document.getElementById("payTileLink")
  };

  const textRefs = {
    screenMenuButton: document.getElementById("screenMenuButton"),
    installButton: document.getElementById("installButton"),
    heroEyebrow: document.getElementById("heroEyebrow"),
    heroTitle: document.getElementById("heroTitle"),
    heroText: document.getElementById("heroText"),
    heroOrderButton: document.getElementById("heroOrderButton"),
    heroTrackButton: document.getElementById("heroTrackButton"),
    heroEtaBadge: document.getElementById("heroEtaBadge"),
    heroFreeBadge: document.getElementById("heroFreeBadge"),
    serviceKicker: document.getElementById("serviceKicker"),
    serviceTitle: document.getElementById("serviceTitle"),
    featuredKicker: document.getElementById("featuredKicker"),
    featuredTitle: document.getElementById("featuredTitle"),
    featuredOpenMenuButton: document.getElementById("featuredOpenMenuButton"),
    categoryKicker: document.getElementById("categoryKicker"),
    categoryTitle: document.getElementById("categoryTitle"),
    menuKicker: document.getElementById("menuKicker"),
    menuTitle: document.getElementById("menuTitle"),
    ordersKicker: document.getElementById("ordersKicker"),
    ordersTitle: document.getElementById("ordersTitle"),
    profileKicker: document.getElementById("profileKicker"),
    profileTitle: document.getElementById("profileTitle"),
    linksKicker: document.getElementById("linksKicker"),
    linksTitle: document.getElementById("linksTitle"),
    navHomeLabel: document.getElementById("navHomeLabel"),
    navMenuLabel: document.getElementById("navMenuLabel"),
    navOrdersLabel: document.getElementById("navOrdersLabel"),
    navAccountLabel: document.getElementById("navAccountLabel"),
    cartFabTitle: document.getElementById("cartFabTitle"),
    productDrawerKicker: document.getElementById("productDrawerKicker"),
    productNoteLabel: document.getElementById("productNoteLabel"),
    cartDrawerKicker: document.getElementById("cartDrawerKicker"),
    cartDrawerTitle: document.getElementById("cartDrawerTitle"),
    orderTypeLabel: document.getElementById("orderTypeLabel"),
    paymentTypeLabel: document.getElementById("paymentTypeLabel"),
    onlinePaymentLabel: document.getElementById("onlinePaymentLabel"),
    onlinePaymentHint: document.getElementById("onlinePaymentHint"),
    onlinePaymentButton: document.getElementById("onlinePaymentButton"),
    deliveryAddressLabel: document.getElementById("deliveryAddressLabel"),
    pickupLabel: document.getElementById("pickupLabel"),
    tableLabel: document.getElementById("tableLabel"),
    checkoutPhoneLabel: document.getElementById("checkoutPhoneLabel"),
    checkoutCommentLabel: document.getElementById("checkoutCommentLabel"),
    clearCartButton: document.getElementById("clearCartButton"),
    submitOrderButton: document.getElementById("submitOrderButton"),
    summarySubtotalLabel: document.getElementById("summarySubtotalLabel"),
    summaryDeliveryLabel: document.getElementById("summaryDeliveryLabel"),
    summaryTotalLabel: document.getElementById("summaryTotalLabel"),
    profilePhoneLabel: document.getElementById("profilePhoneLabel"),
    profileAddressLabel: document.getElementById("profileAddressLabel"),
    saveProfileButton: document.getElementById("saveProfileButton"),
    phoneTileLabel: document.getElementById("phoneTileLabel"),
    mapTileLabel: document.getElementById("mapTileLabel"),
    mapTileValue: document.getElementById("mapTileValue"),
    payTileLabel: document.getElementById("payTileLabel"),
    payTileValue: document.getElementById("payTileValue"),
    siteTileLabel: document.getElementById("siteTileLabel"),
    siteTileValue: document.getElementById("siteTileValue"),
    langDrawerKicker: document.getElementById("langDrawerKicker"),
    langDrawerTitle: document.getElementById("langDrawerTitle"),
    receiptDrawerKicker: document.getElementById("receiptDrawerKicker"),
    receiptDrawerTitle: document.getElementById("receiptDrawerTitle")
  };

  function t(path, replacements) {
    const parts = path.split(".");
    let current = I18N[state.lang] || I18N.ru;
    for (const part of parts) {
      current = current?.[part];
    }
    let value = current ?? path;
    if (typeof value !== "string") return value;
    return Object.entries(replacements || {}).reduce((acc, [key, replacement]) => {
      return acc.replaceAll(`{${key}}`, String(replacement));
    }, value);
  }

  function trackingCopy() {
    return TRACKING_COPY[state.lang] || TRACKING_COPY.ru;
  }

  function availabilityApi() {
    return window.DRAGON_MENU_AVAILABILITY || null;
  }

  function sanitizeMenuData() {
    if (!window.menuData || typeof window.menuData !== "object") return;
    for (const [category, items] of Object.entries(window.menuData)) {
      if (!Array.isArray(items)) continue;
      window.menuData[category] = items.filter(item => !isBuilderItem(item));
    }
  }

  function isBuilderItem(item) {
    if (!item) return false;
    const key = String(item.key || "").toLowerCase();
    const tags = Array.isArray(item.tags) ? item.tags.map(value => String(value).toLowerCase()) : [];
    const nameRu = String(item?.translations?.ru || "").toLowerCase();
    const nameUa = String(item?.translations?.ua || "").toLowerCase();
    const nameVn = String(item?.translations?.vn || "").toLowerCase();

    return (
      key === "pho_custom" ||
      key.startsWith("custom_") ||
      key.startsWith("build_") ||
      item.is_custom_builder === true ||
      tags.includes("custom") ||
      nameRu.includes("собери сам") ||
      nameUa.includes("збери сам") ||
      nameVn.includes("tự chọn") ||
      nameVn.includes("tu chon")
    );
  }

  function isMenuItemAvailable(item) {
    const api = availabilityApi();
    return !api || api.isAvailable(item);
  }

  function textByLang(value) {
    if (!value) return "";
    if (typeof value === "string") return value;
    return String(value?.[state.lang] || value?.ru || value?.ua || value?.vn || "");
  }

  function textByLocale(value, locale) {
    if (!value) return "";
    if (typeof value === "string") return value;
    return String(value?.[locale] || value?.ru || value?.ua || value?.vn || "");
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function fmt(amount) {
    return `${Number(amount || 0).toFixed(2)} ${CURRENCY}`;
  }

  function catLabel(category) {
    return CAT_LABELS[category]?.[state.lang] || CAT_LABELS[category]?.ru || category;
  }

  function itemName(item) {
    return textByLang(item?.translations) || String(item?.key || "").replaceAll("_", " ");
  }

  function itemNameByLocale(item, locale) {
    return textByLocale(item?.translations, locale) || String(item?.key || "").replaceAll("_", " ");
  }

  function menuItemId(category, index) {
    return `${category}:${index}`;
  }

  function menuItemById(id) {
    const [category, indexRaw] = String(id || "").split(":");
    const index = Number(indexRaw);
    const item = window.menuData?.[category]?.[index];
    return item ? { category, index, item } : null;
  }

  function buildThumb(imgEl, key) {
    let current = 0;
    function applyNext() {
      imgEl.src = `${IMG_DIR}${key}.${IMG_EXTS[current]}`;
    }

    imgEl.onerror = () => {
      current += 1;
      if (current < IMG_EXTS.length) {
        applyNext();
        return;
      }
      imgEl.closest(".item-card-media, .category-art, .product-media")?.classList.add("no-image");
      imgEl.remove();
    };

    applyNext();
  }

  async function loadDescriptions() {
    if (state.descriptions) return state.descriptions;
    try {
      const response = await fetch("descriptions.json", { cache: "no-store" });
      if (response.ok) {
        state.descriptions = await response.json();
        return state.descriptions;
      }
    } catch (error) {
      console.warn("Failed to load descriptions", error);
    }
    state.descriptions = {};
    return state.descriptions;
  }

  function getDescriptionEntry(item) {
    return state.descriptions?.[item?.key] || null;
  }

  function getDishDescription(item) {
    const entry = getDescriptionEntry(item);
    return textByLang(entry?.description) || textByLang(item?.short) || textByLang(item?.desc) || "";
  }

  function getDishIngredients(item) {
    const entry = getDescriptionEntry(item);
    return textByLang(entry?.ingredients) || "";
  }

  function normalizeOptions(item) {
    return Array.isArray(item?.options) ? item.options : [];
  }

  function groupTitle(group) {
    return textByLang(group?.title) || group?.name || group?.id || "";
  }

  function optionLabel(option) {
    return textByLang(option?.label) || option?.name || option?.id || "";
  }

  function calcItemUnitPrice(item, selections) {
    let amount = Number(item?.price || 0);
    const options = normalizeOptions(item);

    for (const group of options) {
      const groupId = group.id || group.key || group.name || "";
      const selected = selections?.[groupId];
      if (!selected) continue;

      const selectedValues = Array.isArray(selected) ? selected : [selected];
      for (const optionId of selectedValues) {
        const option = (group.items || []).find(entry => (entry.id || entry.key) === optionId);
        if (option) amount += Number(option.price_delta || 0);
      }
    }

    return amount;
  }

  function summarizeSelections(item, selections, locale) {
    const options = normalizeOptions(item);
    const chunks = [];
    for (const group of options) {
      const groupId = group.id || group.key || group.name || "";
      const selected = selections?.[groupId];
      if (!selected) continue;
      const values = Array.isArray(selected) ? selected : [selected];
      const optionNames = values.map(value => {
        const found = (group.items || []).find(entry => (entry.id || entry.key) === value);
        return locale ? textByLocale(found?.label, locale) || found?.name || value : optionLabel(found || { id: value });
      });
      const title = locale ? textByLocale(group.title, locale) || groupId : groupTitle(group);
      chunks.push(`${title}: ${optionNames.join(", ")}`);
    }
    return chunks.join(" · ");
  }

  function validateSelections(item, selections) {
    const options = normalizeOptions(item);
    for (const group of options) {
      const groupId = group.id || group.key || group.name || "";
      const max = Number(group.max || (group.multi ? 99 : 1));
      const required = group.required === true;
      const selected = selections?.[groupId];
      const values = Array.isArray(selected) ? selected : [selected].filter(Boolean);
      if (required && values.length === 0) {
        return { ok: false, title: groupTitle(group), groupId };
      }
      if (values.length > max) {
        return { ok: false, title: groupTitle(group), groupId };
      }
    }
    return { ok: true };
  }

  function buildMetaTags(item) {
    const tags = [];
    if (item.weight) tags.push(`${item.weight} g`);
    if (item.spicy) tags.push("Spicy " + "•".repeat(Math.min(3, Number(item.spicy))));
    if (Array.isArray(item.tags)) {
      if (item.tags.includes("popular")) tags.push(t("app.topBadge"));
      if (item.tags.includes("chef")) tags.push("Chef");
      if (item.tags.includes("vegan")) tags.push("Vegan");
    }
    return tags;
  }

  function buildFlatMenu() {
    const groups = [];
    const flat = [];
    for (const [category, items] of Object.entries(window.menuData || {})) {
      const available = [];
      (items || []).forEach((item, index) => {
        if (!isMenuItemAvailable(item)) return;
        const id = menuItemId(category, index);
        const entry = { id, category, index, item };
        available.push(entry);
        flat.push(entry);
      });
      if (available.length) groups.push({ category, items: available });
    }
    state.groupedMenu = groups;
    state.flatMenu = flat;
    state.featured = FEATURED_KEYS.map(key => flat.find(entry => entry.item.key === key)).filter(Boolean);
  }

  function findEntryByKey(key) {
    return state.flatMenu.find(entry => entry.item.key === key) || null;
  }

  function loadCart() {
    try {
      const raw = JSON.parse(localStorage.getItem(CART_KEY) || "{}");
      for (const [id, entry] of Object.entries(raw || {})) {
        if (!entry || typeof entry.qty !== "number") continue;
        state.cart.set(id, {
          qty: Math.max(0, entry.qty | 0),
          selections: entry.selections || {},
          note: entry.note || ""
        });
      }
    } catch (error) {
      console.warn("Cart load failed", error);
    }
  }

  function saveCart() {
    const payload = {};
    for (const [id, entry] of state.cart.entries()) {
      payload[id] = entry;
    }
    localStorage.setItem(CART_KEY, JSON.stringify(payload));
  }

  function loadProfile() {
    try {
      const raw = JSON.parse(localStorage.getItem(PROFILE_KEY) || "{}");
      state.profile.phone = String(raw.phone || "");
      state.profile.address = String(raw.address || "");
    } catch (error) {
      console.warn("Profile load failed", error);
    }
    state.checkout.phone = state.profile.phone;
    state.checkout.address = state.profile.address;
  }

  function saveProfile() {
    const nextProfile = {
      phone: String(dom.profilePhone.value || "").trim(),
      address: String(dom.profileAddress.value || "").trim()
    };
    state.profile = nextProfile;
    state.checkout.phone = nextProfile.phone;
    state.checkout.address = nextProfile.address;
    localStorage.setItem(PROFILE_KEY, JSON.stringify(nextProfile));
    syncCheckoutFormFromState();
    showToast(t("app.toasts.profileSaved"));
  }

  function loadOrders() {
    try {
      return JSON.parse(localStorage.getItem(ORDERS_KEY) || "{}") || {};
    } catch (error) {
      return {};
    }
  }

  function saveOrders(payload) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(payload || {}));
  }

  function loadStatusSnapshot() {
    try {
      return JSON.parse(localStorage.getItem(STATUS_SNAPSHOT_KEY) || "{}") || {};
    } catch (error) {
      return {};
    }
  }

  function saveStatusSnapshot(payload) {
    localStorage.setItem(STATUS_SNAPSHOT_KEY, JSON.stringify(payload || {}));
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function normalizeStatus(value) {
    const raw = String(value || "").trim().toUpperCase();
    if (!raw || raw === "SENT" || raw === "FAILED") return "NEW";
    if (raw === "CONFIRMED") return "COOKING";
    if (raw === "COMPLETED" || raw === "DONE") return "HANDED";
    return raw;
  }

  function syncStamp(sync) {
    if (!sync || typeof sync !== "object") return 0;
    const raw = sync.updated_at || sync.attempted_at || sync.requested_at || sync.created_at;
    const value = raw ? new Date(raw).getTime() : 0;
    return Number.isFinite(value) ? value : 0;
  }

  function syncScore(channel, sync) {
    if (!sync || typeof sync !== "object") return 0;
    if (channel === "sheet") {
      if (sync.ok || sync.id) return 4;
      if (sync.pending || sync.retrying) return 3;
      return 2;
    }
    if (channel === "local") {
      return sync.ok ? 3 : 1;
    }
    return sync.ok ? 2 : 1;
  }

  function pickBetterSync(channel, left, right) {
    const leftScore = syncScore(channel, left);
    const rightScore = syncScore(channel, right);
    if (leftScore !== rightScore) return leftScore > rightScore ? left : right;
    return syncStamp(left) >= syncStamp(right) ? left : right;
  }

  function normalizeOrderRecord(raw) {
    const code = String(raw?.code || raw?.order_code || raw?.id || "").trim().toLowerCase();
    const createdAt = raw?.created_at || raw?.createdAt || nowIso();
    const updatedAt = raw?.updated_at || raw?.updatedAt || createdAt;
    const sync = raw?.sync && typeof raw.sync === "object" ? raw.sync : {};

    return {
      ...raw,
      id: String(raw?.id || raw?.order_id || code).trim(),
      code,
      status: normalizeStatus(raw?.status),
      created_at: createdAt,
      updated_at: updatedAt,
      currency: raw?.currency || CURRENCY,
      payment_url: raw?.payment_url || raw?.paymentUrl || raw?.payment_link || raw?.paymentLink || "",
      payment_provider: raw?.payment_provider || raw?.paymentProvider || "",
      payment_status: raw?.payment_status || raw?.paymentStatus || "",
      items: Array.isArray(raw?.items) ? raw.items : [],
      sync: {
        ...sync,
        local: sync.local || raw?.local_sync || null,
        telegram: sync.telegram || raw?.tg || null,
        telegram_vn: sync.telegram_vn || raw?.vn_tg || null,
        sheet: sync.sheet || raw?.sheet || null
      }
    };
  }

  function mergeOrderRecord(current, incoming) {
    const base = current ? normalizeOrderRecord(current) : null;
    const draft = normalizeOrderRecord(incoming);
    if (!base) return draft;

    const baseStamp = new Date(base.updated_at || base.created_at).getTime();
    const draftStamp = new Date(draft.updated_at || draft.created_at).getTime();
    const primary = draftStamp >= baseStamp ? draft : base;
    const fallback = draftStamp >= baseStamp ? base : draft;

    return normalizeOrderRecord({
      ...fallback,
      ...primary,
      sync: {
        ...(fallback.sync || {}),
        ...(primary.sync || {}),
        local: pickBetterSync("local", fallback.sync?.local, primary.sync?.local),
        telegram: pickBetterSync("telegram", fallback.sync?.telegram, primary.sync?.telegram),
        telegram_vn: pickBetterSync("telegram", fallback.sync?.telegram_vn, primary.sync?.telegram_vn),
        sheet: pickBetterSync("sheet", fallback.sync?.sheet, primary.sync?.sheet)
      }
    });
  }

  function persistOrderRecord(order) {
    const orders = loadOrders();
    const normalized = normalizeOrderRecord(order);
    orders[normalized.code] = mergeOrderRecord(orders[normalized.code], normalized);
    saveOrders(orders);
    return orders[normalized.code];
  }

  function orderList() {
    return Object.values(loadOrders())
      .map(normalizeOrderRecord)
      .sort((left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime());
  }

  function statusRank(status) {
    const normalized = normalizeStatus(status);
    return { NEW: 0, COOKING: 1, READY: 2, HANDED: 3 }[normalized] ?? 0;
  }

  function paymentTypeLabel(value) {
    const copy = trackingCopy();
    return copy.payment?.[String(value || "").toLowerCase()] || copy.payment.card;
  }

  function onlinePaymentProviderLabel() {
    return String(window.DRAGON_STATIC?.onlinePaymentLabel || t("app.payTileValue")).trim() || t("app.payTileValue");
  }

  function buildCheckoutPaymentDraft(summary) {
    const nextSummary = summary || cartSummary(state.checkout.type);
    return {
      id: "",
      code: "",
      type: state.checkout.type,
      payment_type: state.checkout.paymentType,
      address: String(dom.deliveryAddressInput?.value || state.checkout.address || "").trim(),
      phone: String(dom.checkoutPhoneInput?.value || state.checkout.phone || "").trim(),
      pickup_in: String(dom.pickupInput?.value || state.checkout.pickupIn || "").trim(),
      table: String(dom.tableInput?.value || state.checkout.table || "").trim(),
      comment: String(dom.checkoutCommentInput?.value || state.checkout.comment || "").trim(),
      subtotal: nextSummary.subtotal,
      delivery_fee: nextSummary.deliveryFee,
      total: nextSummary.total,
      currency: CURRENCY
    };
  }

  function buildOnlinePaymentUrl(paymentContext) {
    const template = String(window.DRAGON_STATIC?.onlinePaymentUrl || ONLINE_PAYMENT_URL || "").trim();
    if (!template) return "";

    const draft = paymentContext || buildCheckoutPaymentDraft();
    const amount = Number(draft.total || draft.subtotal || 0).toFixed(2);
    const amountMinor = String(Math.round(Number(draft.total || draft.subtotal || 0) * 100));
    const orderCode = String(draft.code || "draft").trim().toLowerCase();
    const orderId = String(draft.id || orderCode || "draft").trim();
    const receiptUrl = new URL(
      draft.receipt_link || buildAppUrl(orderCode || "", true),
      window.location.href
    ).toString();
    const returnUrl = new URL(
      buildAppUrl(orderCode || "", Boolean(orderCode)),
      window.location.href
    ).toString();

    const replacements = {
      amount,
      amount_minor: amountMinor,
      currency: String(draft.currency || CURRENCY),
      order_code: orderCode,
      order_id: orderId,
      phone: String(draft.phone || ""),
      address: String(draft.address || ""),
      comment: String(draft.comment || ""),
      order_type: String(draft.type || ""),
      provider: onlinePaymentProviderLabel(),
      receipt_url: receiptUrl,
      return_url: returnUrl
    };

    let resolved = template;
    for (const [key, rawValue] of Object.entries(replacements)) {
      resolved = resolved.replaceAll(`{${key}}`, encodeURIComponent(String(rawValue || "")));
    }

    try {
      const url = new URL(resolved, window.location.href);
      if (!template.includes("{amount}")) url.searchParams.set("amount", amount);
      if (!template.includes("{amount_minor}")) url.searchParams.set("amount_minor", amountMinor);
      if (!template.includes("{currency}")) url.searchParams.set("currency", String(draft.currency || CURRENCY));
      if (!template.includes("{order_code}")) url.searchParams.set("order_code", orderCode);
      if (!template.includes("{order_id}")) url.searchParams.set("order_id", orderId);
      if (!template.includes("{order_type}")) url.searchParams.set("order_type", String(draft.type || ""));
      if (!template.includes("{phone}") && draft.phone) url.searchParams.set("phone", String(draft.phone));
      if (!template.includes("{address}") && draft.address) url.searchParams.set("address", String(draft.address));
      if (!template.includes("{comment}") && draft.comment) url.searchParams.set("comment", String(draft.comment));
      if (!template.includes("{receipt_url}")) url.searchParams.set("receipt_url", receiptUrl);
      if (!template.includes("{return_url}")) url.searchParams.set("return_url", returnUrl);
      return url.toString();
    } catch (_) {
      return resolved;
    }
  }

  function openOnlinePaymentWindow(paymentContext) {
    const url = buildOnlinePaymentUrl(paymentContext);
    if (!url) {
      showToast(t("app.toasts.onlinePaymentMissing"));
      return false;
    }
    window.open(url, "_blank", "noopener,noreferrer");
    return true;
  }

  function etaForOrder(order) {
    const copy = trackingCopy();
    const type = order?.type || "delivery";
    const status = normalizeStatus(order?.status);
    return copy.eta?.[type]?.[status] || copy.eta?.delivery?.[status] || "-";
  }

  function orderTimelineSteps(order) {
    const copy = trackingCopy();
    const type = order?.type || "delivery";
    return copy.timeline?.[type] || copy.timeline.delivery;
  }

  function orderStatusNotificationText(order, nextStatus) {
    const statusLabel = t(`app.status.${nextStatus}`);
    const eta = etaForOrder(order);
    return `${statusLabel} · ${eta}`;
  }

  function buildAppUrl(orderCode, openReceipt) {
    const params = new URLSearchParams();
    params.set("screen", "orders");
    if (orderCode) params.set("code", String(orderCode).toLowerCase());
    if (openReceipt) params.set("receipt", "1");
    const basePath = window.location.pathname || "./index.html";
    return `${basePath}?${params.toString()}`;
  }

  function updateStatusSnapshot(orders, notify) {
    const nextSnapshot = {};
    const changes = [];

    for (const order of orders) {
      const code = String(order?.code || "").trim().toLowerCase();
      if (!code) continue;
      const nextStatus = normalizeStatus(order.status);
      const prevStatus = state.statusSnapshot[code];
      nextSnapshot[code] = nextStatus;
      if (notify && prevStatus && prevStatus !== nextStatus) {
        changes.push({ order, prevStatus, nextStatus });
      }
    }

    state.statusSnapshot = nextSnapshot;
    saveStatusSnapshot(nextSnapshot);

    if (notify) {
      changes.forEach(change => {
        showOrderStatusNotification(change.order, change.prevStatus, change.nextStatus);
      });
    }
  }

  async function showOrderStatusNotification(order, prevStatus, nextStatus) {
    if (!state.pushEnabled) return;
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;
    if (prevStatus === nextStatus) return;

    const title = `DRAGON GO · #${String(order.code || "").toUpperCase()}`;
    const body = orderStatusNotificationText(order, nextStatus);
    const targetUrl = buildAppUrl(order.code, nextStatus === "HANDED");
    const options = {
      body,
      icon: "DockIconKorzina.png",
      badge: "DockIconKorzina.png",
      tag: `order-${order.code}`,
      data: { url: targetUrl },
      renotify: true
    };

    try {
      const registration = await navigator.serviceWorker?.getRegistration();
      if (registration?.showNotification) {
        await registration.showNotification(title, options);
        return;
      }
      new Notification(title, options);
    } catch (error) {
      console.warn("Notification failed", error);
    }
  }

  function copyPlainText(text, toastMessage) {
    const payload = String(text || "").trim();
    if (!payload) return Promise.resolve(false);
    if (navigator.clipboard?.writeText) {
      return navigator.clipboard.writeText(payload).then(() => {
        showToast(toastMessage);
        return true;
      }).catch(() => false);
    }
    return Promise.resolve(false);
  }

  function currentReceiptOrder() {
    if (!state.receiptCode) return null;
    const raw = loadOrders()[state.receiptCode];
    return raw ? normalizeOrderRecord(raw) : null;
  }

  async function fetchOrdersRemoteStatus() {
    const response = await fetch(`${API_BASE}?action=get_orders`, { cache: "no-store" });
    return response.json();
  }

  async function fetchOrdersLocalBridge() {
    if (!LOCAL_API_BASE) return { ok: false, orders: [] };
    const response = await fetch(LOCAL_API_BASE, { cache: "no-store" });
    return response.json();
  }

  async function fetchOrderFromLocalBridge(code) {
    if (!LOCAL_API_BASE) return null;
    const response = await fetch(`${LOCAL_API_BASE}?code=${encodeURIComponent(code)}`, { cache: "no-store" });
    if (!response.ok) return null;
    const payload = await response.json();
    return payload?.order || null;
  }

  async function pushOrderToLocalBridge(order) {
    if (!LOCAL_API_BASE) return { ok: false, error: "local_bridge_unavailable" };
    try {
      const response = await fetch(LOCAL_API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order)
      });
      return await response.json();
    } catch (error) {
      return { ok: false, error: String(error) };
    }
  }

  function TG_ENDPOINT() {
    return String(TG.PROXY_URL || "").trim();
  }

  async function sendTelegramMessage(channel, text) {
    const endpoint = TG_ENDPOINT();
    if (!endpoint) {
      return { ok: false, reason: "telegram_proxy_missing" };
    }
    const response = await fetch(TG_ENDPOINT(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        channel,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true
      })
    });

    let payload = null;
    try {
      payload = await response.json();
    } catch (error) {
      payload = null;
    }

    if (!response.ok) {
      const reason = payload?.description || payload?.error || `HTTP ${response.status}`;
      return { ok: false, reason };
    }
    if (payload?.ok === false) {
      return { ok: false, reason: payload.description || "Telegram error" };
    }
    return { ok: true, payload };
  }

  function orderTypeLabel(type, locale) {
    const lang = locale || state.lang;
    const labels = {
      on_site: { ru: "На месте", ua: "У закладі", vn: "Ăn tại chỗ" },
      takeaway: { ru: "На вынос", ua: "На виніс", vn: "Mang đi" },
      delivery: { ru: "Доставка", ua: "Доставка", vn: "Giao hàng" }
    };
    return labels[type]?.[lang] || labels[type]?.ru || type;
  }

  function buildOrderLineText(orderItem, locale) {
    const found = orderItem.key ? findEntryByKey(orderItem.key) : null;
    const name = found?.item ? itemNameByLocale(found.item, locale) : String(orderItem.name || "-");
    const options = found?.item ? summarizeSelections(found.item, orderItem.selections, locale) : "";
    const note = String(orderItem.note || "").trim();
    const extras = [options ? `(${escapeHtml(options)})` : "", note ? `Note: ${escapeHtml(note)}` : ""]
      .filter(Boolean)
      .join(" ");
    const code = orderItem.code ? `(${escapeHtml(orderItem.code)})` : "";
    return `• ${escapeHtml(name)} ${code} ${extras} — ${Number(orderItem.price || 0).toFixed(2)} ${CURRENCY} × ${Number(orderItem.qty || 0)}`;
  }

  function buildUkrainianOrderText(order) {
    const meta = [];
    if (order.type === "on_site" && order.table) meta.push(`Стіл: <b>${escapeHtml(order.table)}</b>`);
    if (order.type === "takeaway" && order.pickup_in) meta.push(`Забрати через: <b>${escapeHtml(order.pickup_in)} хв</b>`);
    if (order.type === "delivery" && order.address) meta.push(`Адреса: <b>${escapeHtml(order.address)}</b>`);
    if (order.phone) meta.push(`Телефон: <b>${escapeHtml(order.phone)}</b>`);
    if (order.comment) meta.push(`Коментар: <b>${escapeHtml(order.comment)}</b>`);
    meta.push(`Оплата: <b>${order.payment_type === "cash" ? "Готівка" : "Картка"}</b>`);
    if (order.type === "delivery") {
      meta.push(`Вартість доставки: <b>${Number(order.delivery_fee || 0).toFixed(2)} ${CURRENCY}</b>`);
    }
    const lines = (order.items || []).map(item => buildOrderLineText(item, "ua")).join("\n") || "—";

    return `<b>CYBER DRAGON — Нове замовлення</b>
ID: <code>${escapeHtml(order.id)}</code>
Code: <b>${escapeHtml(order.code)}</b>
Сума страв: <b>${Number(order.subtotal || 0).toFixed(2)} ${CURRENCY}</b>
Разом: <b>${Number(order.total || 0).toFixed(2)} ${CURRENCY}</b>
Тип: <b>${orderTypeLabel(order.type, "ua")}</b>
${meta.join("\n")}
<b>Позиції:</b>
${lines}`;
  }

  function buildVietnameseOrderText(order) {
    const meta = [];
    if (order.type === "on_site" && order.table) meta.push(`Bàn: <b>${escapeHtml(order.table)}</b>`);
    if (order.type === "takeaway" && order.pickup_in) meta.push(`Nhận sau: <b>${escapeHtml(order.pickup_in)} phút</b>`);
    if (order.type === "delivery" && order.address) meta.push(`Địa chỉ: <b>${escapeHtml(order.address)}</b>`);
    if (order.phone) meta.push(`SĐT: <b>${escapeHtml(order.phone)}</b>`);
    if (order.comment) meta.push(`Ghi chú: <b>${escapeHtml(order.comment)}</b>`);
    meta.push(`Thanh toán: <b>${order.payment_type === "cash" ? "Tiền mặt" : "Thẻ"}</b>`);
    if (order.type === "delivery") {
      meta.push(`Phí giao hàng: <b>${Number(order.delivery_fee || 0).toFixed(2)} ${CURRENCY}</b>`);
    }
    const lines = (order.items || []).map(item => buildOrderLineText(item, "vn")).join("\n") || "—";

    return `<b>CYBER DRAGON — Đơn mới</b>
ID: <code>${escapeHtml(order.id)}</code>
Code: <b>${escapeHtml(order.code)}</b>
Tạm tính: <b>${Number(order.subtotal || 0).toFixed(2)} ${CURRENCY}</b>
Tổng cộng: <b>${Number(order.total || 0).toFixed(2)} ${CURRENCY}</b>
Hình thức: <b>${orderTypeLabel(order.type, "vn")}</b>
${meta.join("\n")}
<b>Món:</b>
${lines}`;
  }

  async function sendOrderToTelegram(order) {
    return sendTelegramMessage(TG.MAIN_CHANNEL, buildUkrainianOrderText(order));
  }

  async function sendOrderToTelegramVN(order) {
    return sendTelegramMessage(TG.VN_CHANNEL, buildVietnameseOrderText(order));
  }

  async function createOrderOnSheet(order) {
    try {
      const response = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", ...order })
      });
      return await response.json();
    } catch (error) {
      return { ok: false, error: String(error) };
    }
  }

  function generateShortCode() {
    const letters = "abcdefghijklmnopqrstuvwxyz";
    const letter = letters[Math.floor(Math.random() * letters.length)];
    const number = Math.floor(Math.random() * 999) + 1;
    return letter + String(number).padStart(3, "0");
  }

  function receiptLink(code) {
    const username = String(TG.BOT_USERNAME || "").replace("@", "").trim();
    if (!username) return "";
    return `https://t.me/${username}?start=receipt_${encodeURIComponent(code)}`;
  }

  function pruneUnavailableCart(showNotice) {
    let changed = false;
    for (const [id] of state.cart.entries()) {
      const found = menuItemById(id);
      if (!found?.item || !isMenuItemAvailable(found.item)) {
        state.cart.delete(id);
        changed = true;
      }
    }
    if (changed) {
      saveCart();
      if (showNotice) showToast(t("app.toasts.unavailable"));
    }
    return changed;
  }

  function cartQuantity(id) {
    return state.cart.get(id)?.qty || 0;
  }

  function cartSetEntry(id, entry) {
    if (!entry || entry.qty <= 0) {
      state.cart.delete(id);
    } else {
      state.cart.set(id, entry);
    }
    saveCart();
  }

  function cartInc(id, delta) {
    const current = state.cart.get(id) || { qty: 0, selections: {}, note: "" };
    current.qty = Math.max(0, (current.qty | 0) + delta);
    if (current.qty <= 0) {
      state.cart.delete(id);
    } else {
      state.cart.set(id, current);
    }
    saveCart();
  }

  function cartSummary(orderType) {
    let itemsCount = 0;
    let subtotal = 0;
    const items = [];

    for (const [id, entry] of state.cart.entries()) {
      const qty = entry?.qty || 0;
      if (qty <= 0) continue;
      const found = menuItemById(id);
      if (!found?.item || !isMenuItemAvailable(found.item)) continue;
      const unit = calcItemUnitPrice(found.item, entry.selections);
      const noteText = String(entry.note || "").trim();
      itemsCount += qty;
      subtotal += unit * qty;
      items.push({
        name: itemName(found.item),
        price: unit,
        qty,
        key: found.item.key || "",
        code: found.item.code || "",
        selections: entry.selections || {},
        note: noteText
      });
    }

    let deliveryFee = 0;
    if (orderType === "delivery") {
      deliveryFee = subtotal >= FREE_DELIVERY_MIN ? 0 : DELIVERY_PRICE;
    }

    return {
      itemsCount,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      items
    };
  }

  function setScreen(screen) {
    state.screen = screen;
    dom.screens.forEach(node => {
      node.classList.toggle("screen-active", node.dataset.screen === screen);
    });
    dom.navButtons.forEach(button => {
      button.classList.toggle("nav-button-active", button.dataset.screenTarget === screen);
    });
    syncMenuIsland();
  }

  function syncMenuIsland() {
    if (!dom.categoryRail || !dom.menuRailHost || !dom.topbarRailDock || !dom.topbar) return;

    const rail = dom.categoryRail;
    const host = dom.menuRailHost;
    const dock = dom.topbarRailDock;
    const menuIsActive = state.screen === "menu";

    if (!menuIsActive) {
      document.body.classList.remove("dragon-go-island");
      if (rail.parentElement !== host) {
        host.appendChild(rail);
      }
      return;
    }

    const threshold = Math.max(96, host.offsetTop - dom.topbar.offsetHeight - 12);
    const shouldDock = window.scrollY > threshold;

    document.body.classList.toggle("dragon-go-island", shouldDock);
    if (shouldDock) {
      if (rail.parentElement !== dock) {
        dock.appendChild(rail);
      }
      return;
    }

    if (rail.parentElement !== host) {
      host.appendChild(rail);
    }
  }

  function syncCheckoutFormFromState() {
    dom.deliveryAddressInput.value = state.checkout.address || "";
    dom.pickupInput.value = state.checkout.pickupIn || "";
    dom.tableInput.value = state.checkout.table || "";
    dom.checkoutPhoneInput.value = state.checkout.phone || "";
    dom.checkoutCommentInput.value = state.checkout.comment || "";

    const isDelivery = state.checkout.type === "delivery";
    const isTakeaway = state.checkout.type === "takeaway";
    const isOnSite = state.checkout.type === "on_site";
    dom.deliveryAddressField.hidden = !isDelivery;
    dom.pickupField.hidden = !isTakeaway;
    dom.tableField.hidden = !isOnSite;

    dom.orderTypeRow.querySelectorAll("[data-order-type]").forEach(button => {
      button.classList.toggle("choice-pill-active", button.dataset.orderType === state.checkout.type);
    });

    dom.paymentTypeRow.querySelectorAll("[data-payment-type]").forEach(button => {
      button.classList.toggle("choice-pill-active", button.dataset.paymentType === state.checkout.paymentType);
    });
  }

  function applyStaticText() {
    for (const [key, node] of Object.entries(textRefs)) {
      if (!node) continue;
      node.textContent = t(`app.${key}`);
    }

    textRefs.payTileValue.textContent = onlinePaymentProviderLabel();

    textRefs.navHomeLabel.textContent = t("app.navHome");
    textRefs.navMenuLabel.textContent = t("app.navMenu");
    textRefs.navOrdersLabel.textContent = t("app.navOrders");
    textRefs.navAccountLabel.textContent = t("app.navAccount");
    dom.searchInput.placeholder = t("app.searchPlaceholder");
    dom.trackCodeInput.placeholder = t("app.trackPlaceholder");
    dom.profilePhone.placeholder = t("app.profilePhonePlaceholder");
    dom.profileAddress.placeholder = t("app.profileAddressPlaceholder");
    dom.deliveryAddressInput.placeholder = t("app.deliveryAddressPlaceholder");
    dom.pickupInput.placeholder = t("app.pickupPlaceholder");
    dom.tableInput.placeholder = t("app.tablePlaceholder");
    dom.checkoutPhoneInput.placeholder = t("app.checkoutPhonePlaceholder");
    dom.checkoutCommentInput.placeholder = t("app.checkoutCommentPlaceholder");
    dom.productNote.placeholder = t("app.productNotePlaceholder");
    dom.searchClearButton.textContent = t("app.searchClearButton");
    dom.trackCodeButton.textContent = t("app.trackButton");
    dom.refreshOrdersButton.textContent = t("app.refreshOrdersButton");
    dom.productSaveButton.textContent = t("app.productSaveButton");
    document.querySelectorAll("[data-close-drawer]").forEach(button => {
      button.textContent = t("app.close");
    });

    dom.langButton.textContent = state.lang.toUpperCase();
    document.documentElement.lang = state.lang;

    dom.orderTypeRow.querySelector("[data-order-type='delivery']").textContent = t("app.delivery");
    dom.orderTypeRow.querySelector("[data-order-type='takeaway']").textContent = t("app.takeaway");
    dom.orderTypeRow.querySelector("[data-order-type='on_site']").textContent = t("app.onSite");
    dom.paymentTypeRow.querySelector("[data-payment-type='card']").textContent = t("app.card");
    dom.paymentTypeRow.querySelector("[data-payment-type='cash']").textContent = t("app.cash");
    textRefs.receiptDrawerKicker.textContent = t("app.receiptButton");
    textRefs.receiptDrawerTitle.textContent = trackingCopy().buttons.receiptDetails;
    dom.enablePushButton.textContent = trackingCopy().buttons.enablePush;
    dom.latestReceiptButton.textContent = trackingCopy().buttons.latestReceipt;
    dom.receiptPayOnlineButton.textContent = t("app.onlinePaymentButton");
    dom.receiptOpenTelegramButton.textContent = trackingCopy().buttons.openTelegram;
    dom.receiptShareButton.textContent = trackingCopy().buttons.share;
    dom.receiptCopyCodeButton.textContent = trackingCopy().buttons.copyCode;
    dom.receiptCopySummaryButton.textContent = trackingCopy().buttons.copySummary;

    dom.languageStack.querySelector("[data-lang='ru']").textContent = t("app.languageRU");
    dom.languageStack.querySelector("[data-lang='ua']").textContent = t("app.languageUA");
    dom.languageStack.querySelector("[data-lang='vn']").textContent = t("app.languageVN");
    dom.languageStack.querySelectorAll("[data-lang]").forEach(button => {
      button.classList.toggle("language-option-active", button.dataset.lang === state.lang);
    });
  }

  function renderServiceGrid() {
    dom.serviceGrid.innerHTML = t("app.serviceCards")
      .map(card => `
        <article class="service-card">
          <span class="section-kicker">${escapeHtml(t("app.heroEyebrow"))}</span>
          <strong>${escapeHtml(card.title)}</strong>
          <p>${escapeHtml(card.text)}</p>
        </article>
      `)
      .join("");
  }

  function renderFeaturedRail() {
    if (!state.featured.length) {
      dom.featuredRail.innerHTML = `<div class="empty-state">${escapeHtml(t("app.unavailableText"))}</div>`;
      return;
    }
    dom.featuredRail.innerHTML = state.featured.map(entry => cardHtml(entry, true)).join("");
    hydrateImages(dom.featuredRail);
  }

  function renderCategoryGrid() {
    dom.categoryGrid.innerHTML = state.groupedMenu
      .slice(0, 8)
      .map(group => {
        const cover = group.items[0];
        const meta = t("app.meta.dishCount", { count: group.items.length });
        return `
          <button class="category-tile" type="button" data-open-category="${escapeHtml(group.category)}">
            <div class="category-art">${imageHtml(cover.item, "category")}</div>
            <div>
              <span class="category-count">${escapeHtml(meta)}</span>
              <strong>${escapeHtml(catLabel(group.category))}</strong>
              <p>${escapeHtml(t("app.meta.from"))} ${fmt(cover.item.price || 0)}</p>
            </div>
          </button>
        `;
      })
      .join("");
    hydrateImages(dom.categoryGrid);
  }

  function imageHtml(item, scope) {
    const alt = escapeHtml(itemName(item));
    if (item.image) {
      return `<img src="${escapeHtml(item.image)}" alt="${alt}" loading="lazy" decoding="async" data-scope="${scope}">`;
    }
    if (item.key) {
      return `<img alt="${alt}" loading="lazy" decoding="async" data-key="${escapeHtml(item.key)}" data-scope="${scope}">`;
    }
    return "";
  }

  function itemMetaHtml(item) {
    return buildMetaTags(item)
      .map(value => `<span class="meta-pill">${escapeHtml(value)}</span>`)
      .join("");
  }

  function cardHtml(entry, featured) {
    const item = entry.item;
    const id = entry.id;
    const quantity = cartQuantity(id);
    const price = calcItemUnitPrice(item, state.cart.get(id)?.selections);
    const description = getDishDescription(item);
    const metaHtml = itemMetaHtml(item);
    const quantityText = quantity > 0 ? `<span class="meta-pill">${escapeHtml(t("app.meta.quantity", { count: quantity }))}</span>` : "";
    const codeHtml = item.code ? `<span class="item-code">${escapeHtml(item.code)}</span>` : "";
    const topFlag = featured ? `<span class="meta-pill">${escapeHtml(t("app.topBadge"))}</span>` : "";

    return `
      <article class="item-card" data-open-item="${escapeHtml(id)}">
        <div class="item-card-media">
          ${imageHtml(item, "item")}
        </div>
        <div class="item-card-body">
          <div class="item-card-head">
            <div class="item-card-copy">
              <h3>${escapeHtml(itemName(item))}</h3>
              <p>${escapeHtml(description)}</p>
            </div>
            ${codeHtml}
          </div>
          <div class="item-card-meta">
            ${topFlag}
            ${quantityText}
            ${metaHtml}
          </div>
          <div class="item-card-foot">
            <strong class="item-card-price">${escapeHtml(fmt(price))}</strong>
            <button class="inline-add" type="button" data-add-item="${escapeHtml(id)}">${quantity > 0 ? `+1 / ${quantity}` : t("app.addButton")}</button>
          </div>
        </div>
      </article>
    `;
  }

  function filteredGroups() {
    const query = state.search.trim().toLowerCase();
    const active = state.activeCategory;

    return state.groupedMenu
      .map(group => {
        const entries = group.items.filter(entry => {
          if (active && group.category !== active) return false;
          if (!query) return true;
          const haystacks = [
            itemName(entry.item),
            getDishDescription(entry.item),
            getDishIngredients(entry.item),
            textByLang(entry.item?.short)
          ]
            .join(" ")
            .toLowerCase();
          return haystacks.includes(query);
        });
        return { category: group.category, items: entries };
      })
      .filter(group => group.items.length);
  }

  function renderCategoryRail() {
    const buttons = [
      {
        key: "",
        label: state.search ? t("app.openMenuShort") : t("app.navMenu")
      },
      ...state.groupedMenu.map(group => ({
        key: group.category,
        label: catLabel(group.category)
      }))
    ];

    dom.categoryRail.innerHTML = buttons
      .map(button => `
        <button class="chip-button ${button.key === state.activeCategory ? "chip-button-active" : ""}" type="button" data-filter-category="${escapeHtml(button.key)}">
          ${escapeHtml(button.label)}
        </button>
      `)
      .join("");
  }

  function renderMenuSections() {
    const groups = filteredGroups();
    if (!groups.length) {
      dom.menuSections.innerHTML = `<div class="empty-state">${escapeHtml(t("app.unavailableText"))}</div>`;
      return;
    }

    dom.menuSections.innerHTML = groups
      .map(group => `
        <section class="menu-section" id="section-${escapeHtml(group.category)}">
          <div class="menu-section-head">
            <div>
              <span class="section-kicker">${escapeHtml(t("app.meta.dishCount", { count: group.items.length }))}</span>
              <h3>${escapeHtml(catLabel(group.category))}</h3>
            </div>
            <span class="category-count">${escapeHtml(t("app.meta.from"))} ${escapeHtml(fmt(group.items[0].item.price || 0))}</span>
          </div>
          <div class="menu-grid">
            ${group.items.map(entry => cardHtml(entry, false)).join("")}
          </div>
        </section>
      `)
      .join("");

    hydrateImages(dom.menuSections);
  }

  function orderFactCards(order) {
    const copy = trackingCopy();
    return [
      { label: copy.labels.eta, value: etaForOrder(order) },
      { label: copy.labels.payment, value: paymentTypeLabel(order.payment_type) },
      { label: copy.labels.total, value: fmt(order.total || order.subtotal || 0) }
    ];
  }

  function orderMetaFacts(order) {
    const copy = trackingCopy();
    const facts = [
      { label: copy.labels.type, value: orderTypeLabel(order.type) },
      { label: copy.labels.created, value: new Date(order.created_at).toLocaleString() },
      { label: copy.labels.updated, value: new Date(order.updated_at || order.created_at).toLocaleString() }
    ];

    if (order.type === "delivery" && order.address) {
      facts.push({ label: copy.labels.address, value: order.address });
    }
    if (order.type === "takeaway" && order.pickup_in) {
      facts.push({ label: copy.labels.pickup, value: `${order.pickup_in} ${copy.labels.minutes}` });
    }
    if (order.type === "on_site" && order.table) {
      facts.push({ label: copy.labels.table, value: order.table });
    }
    if (order.phone) {
      facts.push({ label: copy.labels.phone, value: order.phone });
    }
    if (order.comment) {
      facts.push({ label: copy.labels.comment, value: order.comment });
    }
    if (order.payment_type === "card" && (order.payment_provider || order.payment_url)) {
      facts.push({ label: t("app.onlinePaymentLabel"), value: order.payment_provider || onlinePaymentProviderLabel() });
    }

    return facts;
  }

  function orderTimelineHtml(order) {
    const steps = orderTimelineSteps(order);
    const status = normalizeStatus(order.status);
    const isCancelled = status === "CANCELLED";
    const currentRank = statusRank(status);
    const copy = trackingCopy();

    const notice = isCancelled
      ? `<div class="receipt-note"><strong>${escapeHtml(copy.labels.cancelledTitle)}</strong><br>${escapeHtml(copy.labels.cancelledBody)}</div>`
      : "";

    const items = steps.map((step, index) => {
      let stateClass = "";
      if (isCancelled) {
        stateClass = index === 0 ? "is-cancelled" : "";
      } else if (status === "HANDED") {
        stateClass = "is-done";
      } else if (index < currentRank) {
        stateClass = "is-done";
      } else if (index === currentRank) {
        stateClass = "is-current";
      }

      return `
        <div class="timeline-step ${stateClass}">
          <span class="timeline-dot" aria-hidden="true"></span>
          <div class="timeline-copy">
            <strong>${escapeHtml(step.title)}</strong>
            <span>${escapeHtml(step.subtitle)}</span>
          </div>
        </div>
      `;
    }).join("");

    return `${notice}<div class="timeline">${items}</div>`;
  }

  function orderSummaryText(order) {
    const copy = trackingCopy();
    const lines = [
      `DRAGON GO #${String(order.code || "").toUpperCase()}`,
      `${copy.labels.type}: ${orderTypeLabel(order.type)}`,
      `${copy.labels.payment}: ${paymentTypeLabel(order.payment_type)}`,
      `${copy.labels.subtotal}: ${fmt(order.subtotal || 0)}`,
      `${copy.labels.delivery}: ${fmt(order.delivery_fee || 0)}`,
      `${copy.labels.total}: ${fmt(order.total || order.subtotal || 0)}`,
      `${copy.labels.created}: ${new Date(order.created_at).toLocaleString()}`,
      `${copy.labels.updated}: ${new Date(order.updated_at || order.created_at).toLocaleString()}`,
      `${copy.labels.eta}: ${etaForOrder(order)}`
    ];

    if (order.address) lines.push(`${copy.labels.address}: ${order.address}`);
    if (order.phone) lines.push(`${copy.labels.phone}: ${order.phone}`);
    if (order.pickup_in) lines.push(`${copy.labels.pickup}: ${order.pickup_in} ${copy.labels.minutes}`);
    if (order.table) lines.push(`${copy.labels.table}: ${order.table}`);
    if (order.comment) lines.push(`${copy.labels.comment}: ${order.comment}`);
    if (order.payment_type === "card" && order.payment_provider) {
      lines.push(`${t("app.onlinePaymentLabel")}: ${order.payment_provider}`);
    }

    lines.push("");
    lines.push(`${copy.labels.items}:`);
    for (const item of order.items || []) {
      const optionText = item.key ? summarizeSelections(findEntryByKey(item.key)?.item, item.selections, state.lang) : "";
      const note = String(item.note || "").trim();
      const extras = [optionText, note].filter(Boolean).join(" | ");
      lines.push(`- ${item.name} x ${item.qty} · ${fmt(item.price)}${extras ? ` · ${extras}` : ""}`);
    }
    return lines.join("\n");
  }

  function renderReceiptDrawer() {
    const order = currentReceiptOrder();
    const copy = trackingCopy();

    if (!order) {
      dom.receiptHero.innerHTML = `<div class="receipt-note">${escapeHtml(copy.toasts.latestMissing)}</div>`;
      dom.receiptTimeline.innerHTML = "";
      dom.receiptSummary.innerHTML = "";
      dom.receiptItems.innerHTML = "";
      dom.receiptPayOnlineButton.hidden = true;
      dom.receiptPayOnlineButton.disabled = true;
      dom.receiptOpenTelegramButton.disabled = true;
      return;
    }

    const status = normalizeStatus(order.status);
    const factCards = orderFactCards(order)
      .map(fact => `
        <div class="order-glance-card">
          <span>${escapeHtml(fact.label)}</span>
          <strong>${escapeHtml(fact.value)}</strong>
        </div>
      `)
      .join("");

    dom.receiptHero.innerHTML = `
      <div class="receipt-hero-head">
        <div>
          <span class="section-kicker">${escapeHtml(t("app.receiptButton"))}</span>
          <strong>#${escapeHtml(order.code)}</strong>
        </div>
        <span class="status-pill status-${status.toLowerCase()}">${escapeHtml(t(`app.status.${status}`))}</span>
      </div>
      <div class="order-glance">${factCards}</div>
    `;

    dom.receiptTimeline.innerHTML = orderTimelineHtml(order);

    dom.receiptSummary.innerHTML = `
      <div class="receipt-summary-grid">
        ${orderMetaFacts(order).map(fact => `
          <div class="receipt-stat">
            <span class="receipt-label">${escapeHtml(fact.label)}</span>
            <strong>${escapeHtml(fact.value)}</strong>
          </div>
        `).join("")}
      </div>
      ${order.receipt_link ? "" : `<div class="receipt-note">${escapeHtml(copy.labels.receiptMissing)}</div>`}
    `;

    dom.receiptItems.innerHTML = `
      <div class="receipt-items-list">
        ${(order.items || []).map(item => {
          const found = item.key ? findEntryByKey(item.key) : null;
          const optionText = found?.item ? summarizeSelections(found.item, item.selections, state.lang) : "";
          const note = String(item.note || "").trim();
          return `
            <div class="receipt-items-row">
              <strong>${escapeHtml(item.name)} x ${Number(item.qty || 0)}</strong>
              <span class="receipt-label">${escapeHtml(fmt(item.price || 0))}${item.code ? ` · ${escapeHtml(item.code)}` : ""}</span>
              ${optionText ? `<span class="receipt-label">${escapeHtml(optionText)}</span>` : ""}
              ${note ? `<span class="receipt-label">${escapeHtml(note)}</span>` : ""}
            </div>
          `;
        }).join("")}
      </div>
    `;

    const canPayOnline = order.payment_type === "card" && !!order.payment_url;
    dom.receiptPayOnlineButton.hidden = !canPayOnline;
    dom.receiptPayOnlineButton.disabled = !canPayOnline;
    dom.receiptOpenTelegramButton.disabled = !order.receipt_link;
  }

  function openReceiptByCode(code) {
    state.receiptCode = String(code || "").trim().toLowerCase();
    renderReceiptDrawer();
    openDrawer("receiptDrawer");
  }

  function renderPushButton() {
    const copy = trackingCopy();
    if (!("Notification" in window)) {
      dom.enablePushButton.textContent = copy.buttons.pushUnsupported;
      dom.enablePushButton.disabled = true;
      return;
    }
    dom.enablePushButton.disabled = false;
    if (Notification.permission === "denied") {
      dom.enablePushButton.textContent = copy.buttons.pushBlocked;
      return;
    }
    if (Notification.permission === "granted") {
      dom.enablePushButton.textContent = state.pushEnabled ? copy.buttons.pushOn : copy.buttons.pushOff;
      return;
    }
    dom.enablePushButton.textContent = copy.buttons.enablePush;
  }

  function renderOrders(options = {}) {
    const orders = orderList();
    const shouldNotify = options.notify ?? state.notificationsHydrated;
    updateStatusSnapshot(orders, shouldNotify);
    if (!state.notificationsHydrated) {
      state.notificationsHydrated = true;
    }
    if (!orders.length) {
      dom.ordersList.innerHTML = `
        <div class="empty-state">
          ${escapeHtml(t("app.ordersEmpty"))}
          <div style="margin-top:12px">
            <button class="hero-button hero-button-primary compact" type="button" data-open-screen="menu">${escapeHtml(t("app.ordersEmptyAction"))}</button>
          </div>
        </div>
      `;
      if (state.receiptCode && dom.receiptDrawer.classList.contains("open")) {
        renderReceiptDrawer();
      }
      return;
    }

    dom.ordersList.innerHTML = orders
      .map(order => {
        const status = normalizeStatus(order.status);
        const meta = [
          orderTypeLabel(order.type),
          new Date(order.created_at).toLocaleString(),
          order.phone ? order.phone : null
        ].filter(Boolean);
        const sync = {
          local: syncPill("local", order.sync?.local),
          telegram: syncPill("telegram", order.sync?.telegram || order.sync?.telegram_vn),
          sheet: syncPill("sheet", order.sync?.sheet)
        };
        const glance = orderFactCards(order)
          .map(fact => `
            <div class="order-glance-card">
              <span>${escapeHtml(fact.label)}</span>
              <strong>${escapeHtml(fact.value)}</strong>
            </div>
          `)
          .join("");
        const items = order.items
          .map(item => `<div>${escapeHtml(item.name)} x ${Number(item.qty || 0)}</div>`)
          .join("");
        return `
          <article class="order-card" data-order-card="${escapeHtml(order.code)}">
            <div class="order-head">
              <div>
                <div class="order-topline">
                  <strong>#${escapeHtml(order.code)}</strong>
                  <span class="status-pill status-${status.toLowerCase()}">${escapeHtml(t(`app.status.${status}`))}</span>
                </div>
                <div class="order-meta">${meta.map(value => `<span>${escapeHtml(value)}</span>`).join(" · ")}</div>
              </div>
              <strong>${escapeHtml(fmt(order.total || order.subtotal || 0))}</strong>
            </div>
            <div class="order-glance">${glance}</div>
            ${orderTimelineHtml(order)}
            <div class="order-items">${items}</div>
            <div class="order-meta">
              ${orderMetaFacts(order).map(fact => `<span><strong>${escapeHtml(fact.label)}:</strong> ${escapeHtml(fact.value)}</span>`).join("")}
            </div>
            <div class="sync-row">
              ${sync.local}
              ${sync.telegram}
              ${sync.sheet}
            </div>
            <div class="order-actions">
              ${order.payment_type === "card" && order.payment_url
                ? `<button class="hero-button hero-button-primary compact" type="button" data-open-payment="${escapeHtml(order.code)}">${escapeHtml(t("app.onlinePaymentButton"))}</button>`
                : ""}
              <button class="hero-button hero-button-secondary compact" type="button" data-refresh-order="${escapeHtml(order.code)}">${escapeHtml(t("app.refreshOrdersButton"))}</button>
              <button class="hero-button hero-button-primary compact" type="button" data-open-receipt="${escapeHtml(order.code)}">${escapeHtml(trackingCopy().buttons.receiptDetails)}</button>
            </div>
          </article>
        `;
      })
      .join("");

    if (state.receiptCode && dom.receiptDrawer.classList.contains("open")) {
      renderReceiptDrawer();
    }
  }

  function syncPill(channel, value) {
    const label = t(`app.sync.${channel}`);
    if (value?.ok || value?.id) {
      return `<span class="sync-pill sync-pill-ok">${escapeHtml(label)}: ${escapeHtml(t("app.sync.ok"))}</span>`;
    }
    if (value?.pending || value?.retrying) {
      return `<span class="sync-pill sync-pill-warn">${escapeHtml(label)}: ${escapeHtml(t("app.sync.pending"))}</span>`;
    }
    return `<span class="sync-pill sync-pill-muted">${escapeHtml(label)}: ${escapeHtml(t("app.sync.offline"))}</span>`;
  }

  function renderCartDrawer() {
    const summary = cartSummary(state.checkout.type);
    const lines = [];

    for (const [id, entry] of state.cart.entries()) {
      const found = menuItemById(id);
      if (!found?.item || !isMenuItemAvailable(found.item) || entry.qty <= 0) continue;
      const unit = calcItemUnitPrice(found.item, entry.selections);
      const selectionText = summarizeSelections(found.item, entry.selections);
      const noteText = String(entry.note || "").trim();
      lines.push(`
        <article class="field-card field-card-wide">
          <div class="order-head">
            <div>
              <strong>${escapeHtml(itemName(found.item))}</strong>
              <div class="order-meta">${escapeHtml(fmt(unit))} x ${entry.qty}</div>
            </div>
            <strong>${escapeHtml(fmt(unit * entry.qty))}</strong>
          </div>
          ${selectionText ? `<div class="order-meta">${escapeHtml(selectionText)}</div>` : ""}
          ${noteText ? `<div class="order-meta">${escapeHtml(noteText)}</div>` : ""}
          <div class="qty-stepper">
            <button type="button" data-dec-item="${escapeHtml(id)}">-</button>
            <span>${entry.qty}</span>
            <button type="button" data-inc-item="${escapeHtml(id)}">+</button>
          </div>
        </article>
      `);
    }

    dom.cartLines.innerHTML = lines.length ? lines.join("") : `<div class="empty-state">${escapeHtml(t("app.cartEmpty"))}</div>`;
    dom.summarySubtotalValue.textContent = fmt(summary.subtotal);
    dom.summaryDeliveryValue.textContent = state.checkout.type === "delivery"
      ? (summary.deliveryFee ? fmt(summary.deliveryFee) : t("app.freeDeliveryText"))
      : fmt(0);
    dom.summaryTotalValue.textContent = fmt(summary.total);
    const showOnlinePayment = state.checkout.paymentType === "card" && Boolean(buildOnlinePaymentUrl(buildCheckoutPaymentDraft(summary)));
    dom.onlinePaymentCard.hidden = !showOnlinePayment;
    dom.onlinePaymentButton.disabled = !showOnlinePayment || !summary.items.length;
    syncCheckoutFormFromState();
    renderCartFab();
  }

  function renderCartFab() {
    const summary = cartSummary(state.checkout.type);
    const visible = summary.itemsCount > 0;
    dom.cartFab.classList.toggle("hidden", !visible);
    dom.cartFabTitle.textContent = t("app.cartFabTitle");
    dom.cartFabMeta.textContent = visible ? t("app.cartFabMeta", { count: summary.itemsCount }) : t("app.cartFabMetaEmpty");
    dom.cartFabTotal.textContent = fmt(summary.total);
  }

  function renderAccount() {
    dom.profilePhone.value = state.profile.phone;
    dom.profileAddress.value = state.profile.address;
    const paymentUrl = buildOnlinePaymentUrl();
    if (dom.payTileLink && paymentUrl) {
      dom.payTileLink.href = paymentUrl;
    }
  }

  function hydrateImages(scope) {
    scope.querySelectorAll("img[data-key]").forEach(img => buildThumb(img, img.dataset.key));
  }

  function openDrawer(id) {
    document.body.classList.add("drawer-open");
    dom.overlay.hidden = false;
    requestAnimationFrame(() => dom.overlay.classList.add("visible"));
    document.getElementById(id)?.classList.add("open");
    document.getElementById(id)?.setAttribute("aria-hidden", "false");
  }

  function closeDrawer(id) {
    document.getElementById(id)?.classList.remove("open");
    document.getElementById(id)?.setAttribute("aria-hidden", "true");
    if (!document.querySelector(".drawer.open")) {
      dom.overlay.classList.remove("visible");
      setTimeout(() => {
        if (!document.querySelector(".drawer.open")) {
          dom.overlay.hidden = true;
          document.body.classList.remove("drawer-open");
        }
      }, 220);
    }
  }

  function closeAllDrawers() {
    document.querySelectorAll(".drawer.open").forEach(drawer => {
      drawer.classList.remove("open");
      drawer.setAttribute("aria-hidden", "true");
    });
    dom.overlay.classList.remove("visible");
    setTimeout(() => {
      dom.overlay.hidden = true;
      document.body.classList.remove("drawer-open");
    }, 220);
  }

  function renderProductDrawer() {
    if (!state.dishCtx) return;
    const item = state.dishCtx.item;
    dom.productTitle.textContent = itemName(item);
    const meta = buildMetaTags(item)
      .concat(item.code ? [item.code] : [])
      .map(value => `<span class="meta-pill">${escapeHtml(value)}</span>`)
      .join("");
    dom.productMeta.innerHTML = meta;
    const description = getDishDescription(item);
    const ingredients = getDishIngredients(item);
    dom.productDescription.textContent = ingredients ? `${description}\n\n${t("app.ingredientsLabel")}: ${ingredients}` : description;
    dom.productQty.textContent = String(cartQuantity(state.dishCtx.id));
    dom.productNote.value = state.dishCtx.note || "";

    dom.productMedia.innerHTML = imageHtml(item, "product");
    hydrateImages(dom.productMedia);

    const options = normalizeOptions(item);
    dom.productOptions.innerHTML = options.length
      ? options
          .map(group => {
            const groupId = group.id || group.key || group.name || "";
            const selected = state.dishCtx.selections[groupId];
            const selectedValues = Array.isArray(selected) ? selected : [selected].filter(Boolean);
            const multi = group.multi || Number(group.max || 0) > 1;
            const max = Number(group.max || (multi ? 99 : 1));
            return `
              <div class="option-group" data-group="${escapeHtml(groupId)}">
                <div class="option-group-head">
                  <strong>${escapeHtml(groupTitle(group))}</strong>
                  <span class="option-hint">${group.required ? t("app.requiredShort") : t("app.optionalShort")}${max < 99 ? ` · max ${max}` : ""}</span>
                </div>
                <div class="option-list">
                  ${(group.items || [])
                    .map(option => {
                      const optionId = option.id || option.key || "";
                      const checked = selectedValues.includes(optionId);
                      const delta = Number(option.price_delta || 0);
                      return `
                        <label class="option-row">
                          <span>${escapeHtml(optionLabel(option))}${delta ? ` (+${delta})` : ""}</span>
                          <input
                            type="${multi ? "checkbox" : "radio"}"
                            name="group-${escapeHtml(groupId)}"
                            value="${escapeHtml(optionId)}"
                            data-option-group="${escapeHtml(groupId)}"
                            data-option-multi="${multi ? "1" : "0"}"
                            data-option-max="${max}"
                            ${checked ? "checked" : ""}
                          >
                        </label>
                      `;
                    })
                    .join("")}
                </div>
              </div>
            `;
          })
          .join("")
      : "";
  }

  function openProduct(id) {
    const found = menuItemById(id);
    if (!found?.item) return;
    if (!isMenuItemAvailable(found.item)) {
      showToast(t("app.unavailableText"));
      return;
    }
    const existing = state.cart.get(id) || { qty: 0, selections: {}, note: "" };
    state.dishCtx = {
      id,
      item: found.item,
      selections: JSON.parse(JSON.stringify(existing.selections || {})),
      note: existing.note || ""
    };
    renderProductDrawer();
    openDrawer("productDrawer");
  }

  function updateProductSelection(input) {
    if (!state.dishCtx) return;
    const groupId = input.dataset.optionGroup;
    const isMulti = input.dataset.optionMulti === "1";
    const max = Number(input.dataset.optionMax || 99);
    if (isMulti) {
      const values = Array.isArray(state.dishCtx.selections[groupId]) ? state.dishCtx.selections[groupId] : [];
      if (input.checked) {
        if (values.length >= max) {
          input.checked = false;
          return;
        }
        values.push(input.value);
      } else {
        const index = values.indexOf(input.value);
        if (index >= 0) values.splice(index, 1);
      }
      state.dishCtx.selections[groupId] = values;
    } else {
      state.dishCtx.selections[groupId] = input.value;
    }
  }

  function saveProductToCart() {
    if (!state.dishCtx) return;
    const validation = validateSelections(state.dishCtx.item, state.dishCtx.selections);
    if (!validation.ok) {
      showToast(t("app.validation.option", { title: validation.title }));
      return;
    }
    const id = state.dishCtx.id;
    const qty = cartQuantity(id);
    const entry = state.cart.get(id) || { qty: 0, selections: {}, note: "" };
    entry.qty = Math.max(1, qty || 1);
    entry.selections = state.dishCtx.selections || {};
    entry.note = String(dom.productNote.value || "").trim();
    cartSetEntry(id, entry);
    renderCartDrawer();
    renderMenuSections();
    renderFeaturedRail();
    showToast(t("app.toasts.added", { name: itemName(state.dishCtx.item) }));
    closeDrawer("productDrawer");
  }

  async function placeOrder() {
    pruneUnavailableCart(true);
    const summary = cartSummary(state.checkout.type);
    if (!summary.items.length) {
      showToast(t("app.validation.empty"));
      return;
    }

    state.checkout.address = String(dom.deliveryAddressInput.value || "").trim();
    state.checkout.pickupIn = String(dom.pickupInput.value || "").trim();
    state.checkout.table = String(dom.tableInput.value || "").trim();
    state.checkout.phone = String(dom.checkoutPhoneInput.value || "").trim();
    state.checkout.comment = String(dom.checkoutCommentInput.value || "").trim();

    if (state.checkout.type === "delivery" && !state.checkout.address) {
      showToast(t("app.validation.address"));
      return;
    }
    if (state.checkout.type === "delivery" && !state.checkout.phone) {
      showToast(t("app.validation.phone"));
      return;
    }
    if (state.checkout.type === "takeaway" && !state.checkout.pickupIn) {
      showToast(t("app.validation.pickup"));
      return;
    }
    if (state.checkout.type === "takeaway" && !state.checkout.phone) {
      showToast(t("app.validation.phone"));
      return;
    }
    if (state.checkout.type === "on_site" && !state.checkout.table) {
      showToast(t("app.validation.table"));
      return;
    }

    const createdAt = nowIso();
    const orderCode = generateShortCode();
    const orderId = "DRAGON-" + createdAt.replace(/[-:TZ.]/g, "").slice(0, 14);
    const receipt = receiptLink(orderCode);
    const paymentCash = state.checkout.paymentType === "cash" ? summary.total : 0;
    const paymentCard = state.checkout.paymentType === "card" ? summary.total : 0;
    const paymentUrl = state.checkout.paymentType === "card"
      ? buildOnlinePaymentUrl({
          id: orderId,
          code: orderCode,
          type: state.checkout.type,
          address: state.checkout.type === "delivery" ? state.checkout.address : "",
          phone: state.checkout.phone,
          pickup_in: state.checkout.type === "takeaway" ? state.checkout.pickupIn : "",
          table: state.checkout.type === "on_site" ? state.checkout.table : "",
          comment: state.checkout.comment,
          subtotal: summary.subtotal,
          delivery_fee: summary.deliveryFee,
          total: summary.total,
          currency: CURRENCY,
          receipt_link: receipt
        })
      : "";

    const orderPayload = {
      id: orderId,
      code: orderCode,
      status: "NEW",
      type: state.checkout.type,
      payment_type: state.checkout.paymentType,
      payment_cash: paymentCash,
      payment_card: paymentCard,
      table: state.checkout.type === "on_site" ? state.checkout.table : "",
      pickup_in: state.checkout.type === "takeaway" ? state.checkout.pickupIn : "",
      address: state.checkout.type === "delivery" ? state.checkout.address : "",
      phone: state.checkout.phone,
      comment: state.checkout.comment,
      items: summary.items,
      subtotal: summary.subtotal,
      delivery_fee: summary.deliveryFee,
      total: summary.total,
      currency: CURRENCY,
      payment_url: paymentUrl,
      payment_provider: paymentUrl ? onlinePaymentProviderLabel() : "",
      payment_status: paymentUrl ? "pending" : "",
      receipt_link: receipt,
      source: "site",
      created_at: createdAt,
      updated_at: createdAt
    };

    const localDraft = persistOrderRecord({
      ...orderPayload,
      sync: {
        local: { ok: false, requested_at: createdAt, via: "local_bridge" },
        sheet: { pending: true, requested_at: createdAt, via: "site_checkout" },
        telegram: { requested_at: createdAt },
        telegram_vn: { requested_at: createdAt }
      }
    });

    const bridgeInitial = await pushOrderToLocalBridge(localDraft);
    const bridgeDraft = persistOrderRecord({
      ...localDraft,
      sync: {
        ...(localDraft.sync || {}),
        local: bridgeInitial?.ok
          ? { ok: true, updated_at: bridgeInitial?.updated_at || createdAt, via: "local_bridge" }
          : { ok: false, updated_at: createdAt, error: bridgeInitial?.error || "" }
      }
    });

    const [telegramMain, telegramVn, sheetResult] = await Promise.all([
      sendOrderToTelegram(orderPayload),
      sendOrderToTelegramVN(orderPayload),
      createOrderOnSheet(orderPayload)
    ]);

    const syncedOrder = persistOrderRecord({
      ...bridgeDraft,
      tg: telegramMain,
      vn_tg: telegramVn,
      sheet: sheetResult,
      status: "NEW",
      updated_at: nowIso(),
      sync: {
        ...(bridgeDraft.sync || {}),
        telegram: {
          ok: !!telegramMain?.ok,
          updated_at: nowIso(),
          error: telegramMain?.reason || ""
        },
        telegram_vn: {
          ok: !!telegramVn?.ok,
          updated_at: nowIso(),
          error: telegramVn?.reason || ""
        },
        sheet: sheetResult?.ok || sheetResult?.id
          ? {
              ok: true,
              id: sheetResult?.id || sheetResult?.order_id || "",
              updated_at: nowIso(),
              via: "apps_script"
            }
          : {
              pending: true,
              retrying: true,
              updated_at: nowIso(),
              error: sheetResult?.error || String(sheetResult?.reason || "")
            }
      }
    });

    await pushOrderToLocalBridge(syncedOrder);

    state.cart.clear();
    saveCart();
    state.checkout.comment = "";
    dom.checkoutCommentInput.value = "";
    renderCartDrawer();
    renderOrders();
    renderMenuSections();
    renderFeaturedRail();
    closeDrawer("cartDrawer");
    setScreen("orders");
    showToast(t("app.toasts.orderPlaced", { code: orderCode }));
  }

  async function refreshOrder(code, options = {}) {
    const normalizedCode = String(code || "").trim().toLowerCase();
    if (!normalizedCode) return;

    let latest = loadOrders()[normalizedCode] || null;

    const [bridgeResult, remoteResult] = await Promise.allSettled([
      fetchOrderFromLocalBridge(normalizedCode),
      fetchOrdersRemoteStatus()
    ]);

    if (bridgeResult.status === "fulfilled" && bridgeResult.value) {
      latest = mergeOrderRecord(latest, bridgeResult.value);
    }

    if (remoteResult.status === "fulfilled" && Array.isArray(remoteResult.value?.orders)) {
      const remoteMatch = remoteResult.value.orders.find(order => {
        return String(order?.code || order?.id || "").trim().toLowerCase() === normalizedCode;
      });
      if (remoteMatch) latest = mergeOrderRecord(latest, remoteMatch);
    }

    if (latest) {
      persistOrderRecord(latest);
      renderOrders({ notify: true });
      if (options.showToast !== false) {
        showToast(t("app.toasts.statusUpdated", { code: normalizedCode }));
      }
      return;
    }

    if (options.showToast !== false) {
      showToast(t("app.toasts.orderNotFound"));
    }
  }

  async function refreshOrders(options = {}) {
    const orders = loadOrders();
    const [bridgeResult, remoteResult] = await Promise.allSettled([
      fetchOrdersLocalBridge(),
      fetchOrdersRemoteStatus()
    ]);

    if (bridgeResult.status === "fulfilled" && Array.isArray(bridgeResult.value?.orders)) {
      for (const order of bridgeResult.value.orders) {
        const normalized = normalizeOrderRecord(order);
        orders[normalized.code] = mergeOrderRecord(orders[normalized.code], normalized);
      }
    }

    if (remoteResult.status === "fulfilled" && Array.isArray(remoteResult.value?.orders)) {
      for (const order of remoteResult.value.orders) {
        const normalized = normalizeOrderRecord(order);
        orders[normalized.code] = mergeOrderRecord(orders[normalized.code], normalized);
      }
    }

    saveOrders(orders);
    renderOrders({ notify: options.notify ?? true });
  }

  function showToast(message) {
    dom.toast.textContent = message;
    dom.toast.classList.add("visible");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => {
      dom.toast.classList.remove("visible");
    }, 2400);
  }

  async function handlePushButton() {
    const copy = trackingCopy();
    if (!("Notification" in window)) {
      showToast(copy.toasts.pushUnsupported);
      return;
    }
    if (Notification.permission === "denied") {
      showToast(copy.toasts.pushBlocked);
      renderPushButton();
      return;
    }
    if (Notification.permission === "granted") {
      state.pushEnabled = !state.pushEnabled;
      localStorage.setItem(PUSH_PREF_KEY, state.pushEnabled ? "1" : "0");
      renderPushButton();
      showToast(state.pushEnabled ? copy.toasts.pushEnabled : copy.toasts.pushDisabled);
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      state.pushEnabled = true;
      localStorage.setItem(PUSH_PREF_KEY, "1");
      renderPushButton();
      showToast(copy.toasts.pushEnabled);
      return;
    }

    renderPushButton();
    showToast(copy.toasts.pushBlocked);
  }

  async function handleReceiptShare() {
    const order = currentReceiptOrder();
    const copy = trackingCopy();
    if (!order) {
      showToast(copy.toasts.latestMissing);
      return;
    }
    const text = orderSummaryText(order);
    const url = order.receipt_link || buildAppUrl(order.code, true);

    if (navigator.share) {
      try {
        await navigator.share({
          title: `DRAGON GO #${String(order.code || "").toUpperCase()}`,
          text,
          url
        });
        return;
      } catch (error) {
        if (error?.name === "AbortError") return;
      }
    }

    const copied = await copyPlainText(`${text}\n\n${url}`, copy.toasts.shareFallback);
    if (!copied) {
      showToast(copy.toasts.shareFallback);
    }
  }

  async function handleReceiptCopyCode() {
    const order = currentReceiptOrder();
    const copy = trackingCopy();
    if (!order) {
      showToast(copy.toasts.latestMissing);
      return;
    }
    const copied = await copyPlainText(String(order.code || "").toUpperCase(), copy.toasts.copiedCode);
    if (!copied) showToast(copy.toasts.copiedCode);
  }

  async function handleReceiptCopySummary() {
    const order = currentReceiptOrder();
    const copy = trackingCopy();
    if (!order) {
      showToast(copy.toasts.latestMissing);
      return;
    }
    const copied = await copyPlainText(orderSummaryText(order), copy.toasts.copiedSummary);
    if (!copied) showToast(copy.toasts.copiedSummary);
  }

  function openLatestReceipt() {
    const latest = orderList()[0];
    const copy = trackingCopy();
    if (!latest) {
      showToast(copy.toasts.latestMissing);
      return;
    }
    openReceiptByCode(latest.code);
  }

  function maybeRegisterServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("dragon_go_sw.js").catch(error => {
      console.warn("Service worker registration failed", error);
    });
  }

  function updateInstallState() {
    if (window.matchMedia?.("(display-mode: standalone)").matches) {
      dom.installButton.textContent = t("app.installSaved");
      return;
    }
    dom.installButton.textContent = state.installPrompt ? t("app.installReady") : t("app.installButton");
  }

  async function handleInstall() {
    if (window.matchMedia?.("(display-mode: standalone)").matches) {
      showToast(t("app.installSaved"));
      return;
    }
    if (!state.installPrompt) {
      showToast(t("app.toasts.installUnavailable"));
      return;
    }
    state.installPrompt.prompt();
    try {
      await state.installPrompt.userChoice;
    } catch (error) {
      console.warn("Install prompt error", error);
    }
    state.installPrompt = null;
    updateInstallState();
  }

  function connectLocalEvents() {
    if (!window.EventSource || !LOCAL_EVENTS_URL) return;
    const source = new EventSource(LOCAL_EVENTS_URL);
    source.addEventListener("orders_updated", () => {
      refreshOrders({ notify: true });
    });
    source.addEventListener("menu_availability_updated", async () => {
      await availabilityApi()?.refresh?.();
      buildFlatMenu();
      pruneUnavailableCart(true);
      renderAll();
    });
    window.addEventListener("beforeunload", () => source.close(), { once: true });
  }

  function renderAll() {
    applyStaticText();
    renderServiceGrid();
    renderFeaturedRail();
    renderCategoryGrid();
    renderCategoryRail();
    renderMenuSections();
    renderOrders();
    renderCartDrawer();
    renderAccount();
    renderPushButton();
    if (state.receiptCode && dom.receiptDrawer.classList.contains("open")) {
      renderReceiptDrawer();
    }
    updateInstallState();
    syncMenuIsland();
  }

  function bindEvents() {
    dom.navButtons.forEach(button => {
      button.addEventListener("click", () => setScreen(button.dataset.screenTarget));
    });

    dom.heroOrderButton.addEventListener("click", () => {
      setScreen("menu");
      const firstButton = dom.categoryRail.querySelector(".chip-button");
      firstButton?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
    });

    dom.heroTrackButton.addEventListener("click", () => setScreen("orders"));
    dom.featuredOpenMenuButton.addEventListener("click", () => setScreen("menu"));
    dom.screenMenuButton.addEventListener("click", () => {
      if (state.screen !== "menu") {
        setScreen("menu");
        return;
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    dom.cartFab.addEventListener("click", () => {
      renderCartDrawer();
      openDrawer("cartDrawer");
    });

    dom.searchInput.value = state.search;
    dom.searchInput.addEventListener("input", () => {
      state.search = dom.searchInput.value;
      localStorage.setItem(SEARCH_KEY, state.search);
      renderCategoryRail();
      renderMenuSections();
    });

    dom.searchClearButton.addEventListener("click", () => {
      state.search = "";
      dom.searchInput.value = "";
      localStorage.removeItem(SEARCH_KEY);
      renderCategoryRail();
      renderMenuSections();
    });

    dom.categoryRail.addEventListener("click", event => {
      const button = event.target.closest("[data-filter-category]");
      if (!button) return;
      state.activeCategory = button.dataset.filterCategory;
      renderCategoryRail();
      renderMenuSections();
    });

    dom.categoryGrid.addEventListener("click", event => {
      const button = event.target.closest("[data-open-category]");
      if (!button) return;
      state.activeCategory = button.dataset.openCategory;
      setScreen("menu");
      renderCategoryRail();
      renderMenuSections();
    });

    document.addEventListener("click", event => {
      const openItem = event.target.closest("[data-open-item]");
      if (openItem && !event.target.closest("[data-add-item]")) {
        openProduct(openItem.dataset.openItem);
        return;
      }

      const addItem = event.target.closest("[data-add-item]");
      if (addItem) {
        const id = addItem.dataset.addItem;
        const found = menuItemById(id);
        if (!found?.item || !isMenuItemAvailable(found.item)) {
          showToast(t("app.unavailableText"));
          return;
        }
        if (normalizeOptions(found.item).length) {
          openProduct(id);
          return;
        }
        cartInc(id, 1);
        renderCartDrawer();
        renderFeaturedRail();
        renderMenuSections();
        showToast(t("app.toasts.added", { name: itemName(found.item) }));
        return;
      }

      const openScreen = event.target.closest("[data-open-screen]");
      if (openScreen) {
        setScreen(openScreen.dataset.openScreen);
        return;
      }

      const refreshOrderButton = event.target.closest("[data-refresh-order]");
      if (refreshOrderButton) {
        refreshOrder(refreshOrderButton.dataset.refreshOrder);
        return;
      }

      const receiptButton = event.target.closest("[data-open-receipt]");
      if (receiptButton) {
        openReceiptByCode(receiptButton.dataset.openReceipt);
        return;
      }

      const openPaymentButton = event.target.closest("[data-open-payment]");
      if (openPaymentButton) {
        const code = String(openPaymentButton.dataset.openPayment || "").trim().toLowerCase();
        const order = code ? normalizeOrderRecord(loadOrders()[code] || null) : null;
        if (!order?.payment_url) {
          showToast(t("app.toasts.onlinePaymentMissing"));
          return;
        }
        openOnlinePaymentWindow(order);
        return;
      }

      const decButton = event.target.closest("[data-dec-item]");
      if (decButton) {
        cartInc(decButton.dataset.decItem, -1);
        renderCartDrawer();
        renderFeaturedRail();
        renderMenuSections();
        return;
      }

      const incButton = event.target.closest("[data-inc-item]");
      if (incButton) {
        cartInc(incButton.dataset.incItem, 1);
        renderCartDrawer();
        renderFeaturedRail();
        renderMenuSections();
        return;
      }

      const closeDrawerButton = event.target.closest("[data-close-drawer]");
      if (closeDrawerButton) {
        closeDrawer(closeDrawerButton.dataset.closeDrawer);
      }
    });

    dom.productOptions.addEventListener("change", event => {
      const input = event.target.closest("input[data-option-group]");
      if (!input) return;
      updateProductSelection(input);
    });

    dom.productNote.addEventListener("input", () => {
      if (!state.dishCtx) return;
      state.dishCtx.note = dom.productNote.value;
    });

    dom.productMinusButton.addEventListener("click", () => {
      if (!state.dishCtx) return;
      cartInc(state.dishCtx.id, -1);
      dom.productQty.textContent = String(cartQuantity(state.dishCtx.id));
      renderCartDrawer();
      renderFeaturedRail();
      renderMenuSections();
    });

    dom.productPlusButton.addEventListener("click", () => {
      if (!state.dishCtx) return;
      const current = state.cart.get(state.dishCtx.id);
      if (!current || current.qty <= 0) {
        cartSetEntry(state.dishCtx.id, {
          qty: 1,
          selections: state.dishCtx.selections || {},
          note: String(dom.productNote.value || "").trim()
        });
      } else {
        cartInc(state.dishCtx.id, 1);
      }
      dom.productQty.textContent = String(cartQuantity(state.dishCtx.id));
      renderCartDrawer();
      renderFeaturedRail();
      renderMenuSections();
    });

    dom.productSaveButton.addEventListener("click", saveProductToCart);

    dom.orderTypeRow.addEventListener("click", event => {
      const button = event.target.closest("[data-order-type]");
      if (!button) return;
      state.checkout.type = button.dataset.orderType;
      renderCartDrawer();
    });

    dom.paymentTypeRow.addEventListener("click", event => {
      const button = event.target.closest("[data-payment-type]");
      if (!button) return;
      state.checkout.paymentType = button.dataset.paymentType;
      renderCartDrawer();
    });

    dom.deliveryAddressInput.addEventListener("input", () => {
      state.checkout.address = dom.deliveryAddressInput.value;
    });
    dom.pickupInput.addEventListener("input", () => {
      state.checkout.pickupIn = dom.pickupInput.value;
    });
    dom.tableInput.addEventListener("input", () => {
      state.checkout.table = dom.tableInput.value;
    });
    dom.checkoutPhoneInput.addEventListener("input", () => {
      state.checkout.phone = dom.checkoutPhoneInput.value;
    });
    dom.checkoutCommentInput.addEventListener("input", () => {
      state.checkout.comment = dom.checkoutCommentInput.value;
    });

    dom.clearCartButton.addEventListener("click", () => {
      state.cart.clear();
      saveCart();
      renderCartDrawer();
      renderFeaturedRail();
      renderMenuSections();
      showToast(t("app.toasts.cartCleared"));
    });

    dom.submitOrderButton.addEventListener("click", placeOrder);
    dom.onlinePaymentButton.addEventListener("click", () => {
      const summary = cartSummary(state.checkout.type);
      if (!summary.items.length) {
        showToast(t("app.validation.empty"));
        return;
      }
      openOnlinePaymentWindow(buildCheckoutPaymentDraft(summary));
    });
    dom.refreshOrdersButton.addEventListener("click", refreshOrders);
    dom.trackCodeButton.addEventListener("click", () => refreshOrder(dom.trackCodeInput.value));
    dom.enablePushButton.addEventListener("click", handlePushButton);
    dom.latestReceiptButton.addEventListener("click", openLatestReceipt);
    dom.trackCodeInput.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        event.preventDefault();
        refreshOrder(dom.trackCodeInput.value);
      }
    });

    dom.saveProfileButton.addEventListener("click", saveProfile);
    dom.installButton.addEventListener("click", handleInstall);
    dom.langButton.addEventListener("click", () => openDrawer("langDrawer"));
    dom.languageStack.addEventListener("click", event => {
      const button = event.target.closest("[data-lang]");
      if (!button) return;
      state.lang = button.dataset.lang;
      localStorage.setItem(LANG_KEY, state.lang);
      renderAll();
      closeDrawer("langDrawer");
    });
    dom.receiptPayOnlineButton.addEventListener("click", () => {
      const order = currentReceiptOrder();
      if (!order?.payment_url) {
        showToast(t("app.toasts.onlinePaymentMissing"));
        return;
      }
      openOnlinePaymentWindow(order);
    });
    dom.receiptOpenTelegramButton.addEventListener("click", () => {
      const order = currentReceiptOrder();
      if (!order?.receipt_link) return;
      window.open(order.receipt_link, "_blank", "noopener,noreferrer");
    });
    dom.receiptShareButton.addEventListener("click", handleReceiptShare);
    dom.receiptCopyCodeButton.addEventListener("click", handleReceiptCopyCode);
    dom.receiptCopySummaryButton.addEventListener("click", handleReceiptCopySummary);

    dom.overlay.addEventListener("click", closeAllDrawers);

    window.addEventListener("storage", event => {
      if (event.key === availabilityApi()?.STORAGE_KEY) {
        buildFlatMenu();
        pruneUnavailableCart(true);
        renderAll();
      }
      if (event.key === ORDERS_KEY) {
        renderOrders();
      }
    });

    window.addEventListener("dragon-menu-availability-changed", () => {
      buildFlatMenu();
      pruneUnavailableCart(true);
      renderAll();
    });

    window.addEventListener("beforeinstallprompt", event => {
      event.preventDefault();
      state.installPrompt = event;
      updateInstallState();
    });

    window.addEventListener("appinstalled", () => {
      state.installPrompt = null;
      localStorage.setItem(INSTALL_KEY, "1");
      updateInstallState();
    });

    window.addEventListener("scroll", syncMenuIsland, { passive: true });
    window.addEventListener("resize", syncMenuIsland);
  }

  async function init() {
    sanitizeMenuData();
    state.statusSnapshot = loadStatusSnapshot();
    loadCart();
    loadProfile();
    await loadDescriptions();
    await availabilityApi()?.refresh?.();
    pruneUnavailableCart();
    buildFlatMenu();
    bindEvents();
    renderAll();
    setScreen(state.route.screen || "menu");
    if (state.route.code) {
      dom.trackCodeInput.value = state.route.code;
      await refreshOrder(state.route.code, { showToast: false });
      if (state.route.receipt) {
        openReceiptByCode(state.route.code);
      }
    }
    maybeRegisterServiceWorker();
    connectLocalEvents();
  }

  init();
})();
