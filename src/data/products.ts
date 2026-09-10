export type ProductVariant = { id: string; label: string; price: number; stock: number; image?: string }
export type Product = {
  id: string
  name: string
  category: string
  tagline: string
  description: string
  images: string[]
  featured?: boolean
  badge?: string
  variants: ProductVariant[]
  details: string[]
}

export const defaultCategories = ['Свічки', 'Посуд', 'Скло', 'Декор']

export const defaultProducts: Product[] = [
  {
    id: 'planeta', name: 'Планета', category: 'Свічки', badge: 'ICON', featured: true,
    tagline: 'Свічка, з якої почалась історія 6.STUDIO.',
    description: 'Фактурна ароматична свічка з кришкою, дерев’яним гнотом і ароматом на вибір. Скульптурний об’єкт для тихого вечора або подарунка.',
    images: ['/images/planeta-1.webp','/images/planeta-2.webp'],
    variants: [{id:'25h',label:'25+ годин',price:690,stock:12}],
    details: ['аромат на вибір', 'дерев’яний гніт', 'кришка у комплекті']
  },
  {
    id: 'busta', name: 'Busta', category: 'Свічки', badge: 'SCULPTURE', featured: true,
    tagline: 'Керамічна пластика та тепле світло.',
    description: 'Ароматична свічка у скульптурній формі. Два гноти створюють м’яке рівне світло та підкреслюють рельєф.',
    images: ['/images/busta-1.webp', '/images/busta-2.webp'],
    variants: [{id:'70h',label:'70+ годин',price:890,stock:8}],
    details: ['аромат на вибір', '70+ годин горіння', 'два гноти']
  },
  {
    id: 'woman', name: 'Жінка', category: 'Свічки', badge: 'OBJECT', featured: true,
    tagline: 'Тактильна форма, що працює як декор.',
    description: 'Ароматична свічка в авторському рельєфному корпусі. Великий формат для інтер’єру з характером.',
    images: ['/images/woman-1.webp', '/images/woman-2.webp'],
    variants: [{id:'90h',label:'90+ годин',price:980,stock:5}],
    details: ['аромат на вибір', '90+ годин горіння', 'великий формат']
  },
  {
    id: 'bear', name: 'Ведмідь', category: 'Свічки', badge: 'MIRROR', featured: true,
    tagline: 'Хромований акцент з м’яким серцем.',
    description: 'Декоративна ароматична свічка у дзеркальному ведмеді. Контраст грайливої форми та металевого блиску.',
    images: ['/images/bear-1.webp','/images/editorial-21.webp'],
    variants: [{id:'20h',label:'20+ годин',price:690,stock:10}],
    details: ['аромат на вибір', '20+ годин горіння', 'дзеркальна поверхня']
  },
  {
    id: 'flower', name: 'Квітка', category: 'Свічки', badge: 'COLOR', featured: true,
    tagline: 'Колір як частина атмосфери.',
    description: 'Керамічна свічка у квітковій формі. Кольори можуть відрізнятися — кожна подача виглядає як маленький арт-об’єкт.',
    images: ['/images/flower-1.webp','/images/flower-2.webp', '/images/flower-3.webp'],
    variants: [{id:'50h',label:'50+ годин',price:830,stock:7}],
    details: ['аромат на вибір', '50+ годин горіння', 'кольорові варіації']
  },
  {
    id: 'lastivky', name: 'Ластівки', category: 'Посуд', badge: 'SET', featured: true,
    tagline: 'Одна серія — кілька розмірів для столу.',
    description: 'Молочна кераміка з легким синім мотивом ластівок. Замість дублювання товарів оберіть потрібний формат в одній картці.',
    images: ['/images/lastivky-main.webp','/images/lastivky-soup.webp','/images/lastivky-side.webp','/images/editorial-01.webp'],
    variants: [
      {id:'side',label:'Гарнірна · Ø15.9 см',price:370,stock:14,image:'/images/lastivky-side.webp'},
      {id:'main',label:'Основна · Ø19.1 см',price:420,stock:11,image:'/images/lastivky-main.webp'},
      {id:'soup',label:'Супова · Ø19.1 см',price:440,stock:9,image:'/images/lastivky-soup.webp'},
    ],
    details: ['кераміка', 'серія з 3 форматів', 'можна комбінувати у сет']
  },
  {
    id: 'piala', name: 'Піала Esquisite', category: 'Посуд', featured: true,
    tagline: 'Невелика форма з графічною типографікою.',
    description: 'Піала для сніданків, десертів і сервірування. Виразний напис робить її самостійним акцентом.',
    images: ['/images/piala-1.webp','/images/piala-2.webp'],
    variants: [{id:'400',label:'400 мл',price:280,stock:16}],
    details: ['12 × 12.8 см', '400 мл', 'кераміка']
  },
  {
    id: 'euforia', name: 'Euforia', category: 'Скло', badge: 'GLASS', featured: true,
    tagline: 'Кольорове скло для довгих вечерь.',
    description: 'Келих із рожевою чашею, зеленою ніжкою та медовою основою. Легкий іронічний акцент для святкового й щоденного столу.',
    images: ['/images/euforia-1.webp','/images/editorial-03.webp'],
    variants: [{id:'260',label:'260 мл',price:445,stock:13}],
    details: ['7.7 × 7.7 × 20 см', '260 мл', 'кольорове скло']
  },
  {
    id: 'pasta', name: 'Pasta', category: 'Посуд', badge: 'GRAPHIC',
    tagline: 'Тарілка, яка сама задає настрій сервіруванню.',
    description: 'Кругла тарілка з квадратним заглибленням та типографікою Fettuccine / Farfalle / Penne / Rigatoni.',
    images: ['/images/editorial-06.webp','/images/editorial-08.webp'],
    variants: [{id:'203',label:'20.3 см',price:430,stock:6}],
    details: ['кераміка', '20.3 × 4.2 см', 'графічний принт']
  },
  {
    id: 'teapot', name: 'Чисте кохання', category: 'Посуд', badge: 'VINTAGE',
    tagline: 'Чайник для повільних ранків і красивих столів.',
    description: 'Рельєфний білий чайник з вінтажним силуетом. Виглядає як знайдена сімейна реліквія, але працює в сучасному інтер’єрі.',
    images: ['/images/teapot-1.webp','/images/editorial-04.webp'],
    variants: [{id:'1000',label:'1000 мл',price:900,stock:4}],
    details: ['26 × 18 × 7.5 см', '1000 мл', 'кераміка']
  },
]
