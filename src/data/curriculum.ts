import { BadgeDef, DailyQuestDef, TopicData, TopicTest, UnitData } from '../types';
import { UNIT_ART } from '../utils/unitArt';
import { UNIT1_HAP_BILGILER, UNIT1_TESTS } from './unit1Tests';
import { UNIT2_HAP_BILGILER, UNIT2_TESTS } from './unit2Tests';
import { UNIT3_HAP_BILGILER, UNIT3_TESTS } from './unit3Tests';
import { SEMESTER2_UNITS } from './curriculumSemester2';

export const IMAGES = {
  welcome: '/src/assets/images/hero_welcome_science_1795291664881.jpg',
  spaceCosmos: '/src/assets/images/unit1_space_cosmos_1795291662045.jpg',
  moonSurface: '/src/assets/images/unit1_moon_surface_1795291665270.jpg',
  forceParaglider: '/src/assets/images/unit2_force_paraglider_1795291719581.jpg',
  cellBiology: '/src/assets/images/unit3_cell_biology_1795291664038.jpg',
  skeletonMotion: '/src/assets/images/unit3_skeleton_motion_1795291664041.jpg',
};

export interface LevelInfo {
  level: number;
  title: string;
  minXp: number;
  nextXp: number;
}

export const LEVELS: LevelInfo[] = [
  { level: 1, title: 'Çırak Kâşif', minXp: 0, nextXp: 150 },
  { level: 2, title: 'Meraklı Gözlemci', minXp: 150, nextXp: 350 },
  { level: 3, title: 'Genç Bilim İnsanı', minXp: 350, nextXp: 650 },
  { level: 4, title: 'Yörünge Kaptanı', minXp: 650, nextXp: 1050 },
  { level: 5, title: 'Kuvvet ve Hücre Ustası', minXp: 1050, nextXp: 1600 },
  { level: 6, title: 'Işık ve Madde Kâşifi', minXp: 1600, nextXp: 2300 },
  { level: 7, title: 'Elektrik Mühendisi', minXp: 2300, nextXp: 3100 },
  { level: 8, title: 'Sıfır Atık Gönüllüsü', minXp: 3100, nextXp: 4000 },
  { level: 9, title: '5. Sınıf Fen Şampiyonu', minXp: 4000, nextXp: 5200 },
  { level: 10, title: 'Maarif Bilim Lideri', minXp: 5200, nextXp: 6500 },
];

export function getLevelForXp(xp: number): LevelInfo {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

export const BADGES: BadgeDef[] = [
  {
    id: 'first-lab',
    title: 'İlk Deney Kâşifi',
    description: 'İlk interaktif simülasyonunu başarıyla tamamladın.',
    icon: 'flask',
    accent: 'amber',
  },
  {
    id: 'card-master',
    title: 'Kart Ustası',
    description: 'Bir konunun tüm bilgi kartlarını öğrenerek bitirdin.',
    icon: 'layers',
    accent: 'sky',
  },
  {
    id: 'perfect-quiz',
    title: 'Hatasız Nişancı',
    description: 'Bir testi hiç yanlış yapmadan 5/5 ile tamamladın.',
    icon: 'target',
    accent: 'emerald',
  },
  {
    id: 'test-champion',
    title: 'Test Şampiyonu',
    description: 'En az 10 farklı fen testini başarıyla geçtin.',
    icon: 'award',
    accent: 'amber',
  },
  {
    id: 'unit1-hero',
    title: 'Uzay Kâşifi',
    description: '1. Ünite (Gökyüzündeki Komşularımız) konularını ve testlerini bitirdin.',
    icon: 'orbit',
    accent: 'amber',
  },
  {
    id: 'unit2-hero',
    title: 'Kuvvet Mühendisi',
    description: '2. Ünite (Kuvveti Tanıyalım) konularını ve testlerini bitirdin.',
    icon: 'gauge',
    accent: 'emerald',
  },
  {
    id: 'unit3-hero',
    title: 'Canlılar Dedektifi',
    description: '3. Ünite (Canlıların Yapısı) konularını ve testlerini bitirdin.',
    icon: 'microscope',
    accent: 'sky',
  },
  {
    id: 'unit4-hero',
    title: 'Işık Kâşifi',
    description: '4. Ünite (Işığın Dünyası) konularını ve testlerini bitirdin.',
    icon: 'sun',
    accent: 'rose',
  },
  {
    id: 'unit5-hero',
    title: 'Madde ve Isı Ustası',
    description: '5. Ünite (Maddenin Doğası) konularını ve testlerini bitirdin.',
    icon: 'flame',
    accent: 'sky',
  },
  {
    id: 'unit6-hero',
    title: 'Elektrik Mucidi',
    description: '6. Ünite (Yaşamımızdaki Elektrik) konularını ve testlerini bitirdin.',
    icon: 'zap',
    accent: 'amber',
  },
  {
    id: 'unit7-hero',
    title: 'Sıfır Atık Kahramanı',
    description: '7. Ünite (Sürdürülebilir Yaşam ve Geri Dönüşüm) konularını bitirdin.',
    icon: 'recycle',
    accent: 'emerald',
  },
];

export const DAILY_QUESTS: DailyQuestDef[] = [
  {
    id: 'q-sim',
    title: '1 interaktif deney tamamla',
    target: 1,
    xpReward: 40,
    metric: 'simsDone',
  },
  {
    id: 'q-cards',
    title: '8 bilgi kartı kaydır',
    target: 8,
    xpReward: 35,
    metric: 'cardsSwiped',
  },
  {
    id: 'q-quiz',
    title: '2 konu testi tamamla',
    target: 2,
    xpReward: 55,
    metric: 'quizzesDone',
  },
];

export const CURRICULUM: UnitData[] = [
  // =========================================================================
  // 1. ÜNİTE: GÖKYÜZÜNDEKİ KOMŞULARIMIZ VE BİZ
  // =========================================================================
  {
    id: 'unit-1',
    number: 1,
    title: 'Gökyüzündeki Komşularımız ve Biz',
    shortTitle: 'Gökyüzündeki Komşularımız',
    theme: 'space',
    coverImage: IMAGES.spaceCosmos,
    description: 'Güneş’in yapısı, Ay’ın evreleri ve gök cisimlerinin hareketlerini dokunarak keşfet.',
    topics: [
      {
        id: 'u1-sun',
        unitId: 'unit-1',
        orderLabel: '1.1',
        title: 'Gökyüzündeki Komşumuz: Güneş',
        shortTitle: 'Güneş’in Yapısı ve Dönüşü',
        tagline: 'Sıcak gazlardan oluşan yıldızımız ve yüzeyindeki gizemli Güneş lekeleri.',
        heroImage: IMAGES.spaceCosmos,
        secondaryImage: IMAGES.moonSurface,
        imageAlt: 'Güneş, Dünya ve Ay uzay görünümü',
        simType: 'sun-spots',
        simTitle: 'Güneş Lekesi Gözlemevi',
        simSubtitle: 'Güneş’i parmağınla döndür ve Galileo gibi lekelerin kayışını incele!',
        keyNoteTitle: 'Güneş Hakkında Kısa Bilim Notu',
        keyNotes: [
          'Güneş, Dünya’ya en yakın yıldızdır; ısı ve ışık kaynağımızdır.',
          'Şekli küreye benzer, sıcak gazlardan ve katmanlardan oluşur.',
          'Yüzeyindeki daha serin ve koyu bölgelere Güneş lekesi denir.',
          'Güneş kendi ekseni etrafında saat yönünün tersine (batıdan doğuya) döner.',
          'Güneş’e doğrudan veya filtresiz teleskopla bakmak gözlere kalıcı zarar verir!',
        ],
        flashcards: [
          {
            id: 'u1-sun-c1',
            frontPrompt: 'Güneş nasıl bir gök cismidir ve neden oluşur?',
            frontHint: 'Kartı çevirmek için dokun',
            backAnswer: 'Çevresine ısı ve ışık yayan, sıcak gazlardan ve katmanlardan oluşan bir yıldızdır.',
            miniSummaryTitle: 'Güneş’in Yapısı',
            miniSummaryPoints: [
              'Güneş bir gezegen değil, Dünya’ya en yakın yıldızdır.',
              'Tıpkı Dünya gibi iç içe katmanlardan oluşur ve şekli küreye benzer.',
              'Dünya’daki yaşam için gerekli ısı ve ışığı sağlar.',
            ],
            dailyLifeTip: 'Güneş’in içine 1 milyondan fazla Dünya sığabilir ama çok uzakta olduğu için küçük görünür.',
          },
          {
            id: 'u1-sun-c2',
            frontPrompt: 'Güneş yüzeyinde görünen koyu renkli bölgelere ne ad verilir?',
            frontHint: 'Galileo’nun keşfini hatırla',
            backAnswer: 'Güneş lekeleri! Çevresine göre sıcaklığı biraz daha düşük olan bölgelerdir.',
            miniSummaryTitle: 'Güneş Lekeleri ve Galileo',
            miniSummaryPoints: [
              'Güneş lekeleri yüzeyde koyu renkli benekler gibi görünür.',
              'Galileo Galilei bu lekelerin günler içinde aynı yöne kaydığını gözlemledi.',
              'Böylece Güneş’in kendi ekseni etrafında döndüğünü ispatladı.',
            ],
            dailyLifeTip: 'Bir portakalın üzerine nokta koyup çevirirsen noktanın yer değiştirdiğini görürsün — lekeler de böyle hareket eder.',
          },
          {
            id: 'u1-sun-c3',
            frontPrompt: 'Güneş kendi ekseni etrafında hangi yöne döner?',
            frontHint: 'Saat yönü mü, tersi mi?',
            backAnswer: 'Saat yönünün tersine, yani batıdan doğuya doğru döner.',
            miniSummaryTitle: 'Güneş’in Dönme Yönü',
            miniSummaryPoints: [
              'Güneş, Dünya ve Ay’ın üçü de kendi ekseni etrafında saat yönünün tersine döner.',
              'Bu yön batıdan doğuya doğrudur.',
              'Türk-İslam bilgini Fergani de Güneş’in batıdan doğuya döndüğünü ileri sürmüştür.',
            ],
            dailyLifeTip: 'Kol saatine bak; akrep ve yelkovanın gittiği yönün tam tersi uzaydaki dönme yönüdür.',
          },
          {
            id: 'u1-sun-c4',
            frontPrompt: 'Güneş Dünya’dan çok daha büyük olduğu hâlde neden küçük görünür?',
            frontHint: 'Uzaklık ve görünen boyut',
            backAnswer: 'Dünya’dan çok uzakta bulunduğu için olduğundan küçük görünür.',
            miniSummaryTitle: 'Görünen Boyut ve Uzaklık',
            miniSummaryPoints: [
              'Cisimler bizden uzaklaştıkça gözümüze daha küçük görünür.',
              'Yakınımızdaki küçük bir top, uzaktaki kocaman bir toptan daha büyük görünebilir.',
              'Güneş de dev bir yıldız olmasına rağmen çok uzakta olduğu için gökyüzünde küçük görünür.',
            ],
            dailyLifeTip: 'Gökyüzünde uçan dev yolcu uçakları da çok yüksekte oldukları için küçücük görünür.',
          },
          {
            id: 'u1-sun-c5',
            frontPrompt: 'Güneş’i gözlemlerken nelere dikkat etmeliyiz?',
            frontHint: 'Göz sağlığı uyarısı',
            backAnswer: 'Güneş’e çıplak gözle, dürbün, mercek veya filtresiz teleskopla asla doğrudan bakmamalıyız.',
            miniSummaryTitle: 'Güvenli Güneş Gözlemi',
            miniSummaryPoints: [
              'Güneş ışığı bir büyüteçle kâğıdı tutuşturabilecek kadar güçlü enerji taşır.',
              'Doğrudan bakmak gözlerde kalıcı hasara ve görme kaybına yol açabilir.',
              'Gök bilimciler özel güneş filtreli teleskoplar kullanır veya görüntüyü beyaz bir ekrana yansıtır.',
            ],
            dailyLifeTip: 'Parker uzay aracı 2018’de Güneş’i güvenle yakından incelemek için uzaya gönderilmiştir.',
          },
        ],
        fillBlanks: [
          {
            id: 'u1-sun-f1',
            beforeBlank: 'Çevresine ısı ve ışık yayan bir',
            afterBlank: 'olan Güneş, sıcak gazlardan ve katmanlardan oluşur.',
            answer: 'yıldız',
            distractors: ['uydu', 'krater', 'gezegen'],
            explanation: 'Güneş kendi ışığını üreten bir yıldızdır ve Dünya’ya en yakın yıldızdır.',
          },
          {
            id: 'u1-sun-f2',
            beforeBlank: 'Güneş’in yüzeyinde diğer bölgelere göre daha koyu görünen alanlara',
            afterBlank: 'adı verilir.',
            answer: 'Güneş lekeleri',
            distractors: ['krater', 'yörünge', 'evre'],
            explanation: 'Güneş lekeleri, Güneş yüzeyinde çevresine göre daha serin ve koyu görünen bölgelerdir.',
          },
          {
            id: 'u1-sun-f3',
            beforeBlank: 'Güneş kendi ekseni etrafında',
            afterBlank: 'yönünde dönme hareketi yapar.',
            answer: 'saat yönünün tersi',
            distractors: ['saat', 'kuzeyden güneye', 'doğudan batıya'],
            explanation: 'Güneş batıdan doğuya, yani saat yönünün tersine doğru döner.',
          },
          {
            id: 'u1-sun-f4',
            beforeBlank: 'Güneş’in geometrik şekli bir',
            afterBlank: 'benzer.',
            answer: 'küreye',
            distractors: ['küpe', 'silindire', 'üçgene'],
            explanation: 'Güneş, Dünya ve Ay’ın üçü de küreye benzer bir şekle sahiptir.',
          },
        ],
        hapBilgiler: UNIT1_HAP_BILGILER['u1-sun'],
        tests: UNIT1_TESTS['u1-sun'],
      },
      {
        id: 'u1-moon',
        unitId: 'unit-1',
        orderLabel: '1.2',
        title: 'Gökyüzündeki Komşumuz: Ay ve Evreleri',
        shortTitle: 'Ay’ın Özellikleri ve Evreleri',
        tagline: 'Kraterli doğal uydumuzun yüzeyi ve her hafta değişen ışıklı evreleri.',
        heroImage: IMAGES.moonSurface,
        secondaryImage: IMAGES.spaceCosmos,
        imageAlt: 'Ay yüzeyi kraterleri ve hilal aydınlanması',
        simType: 'moon-phases',
        simTitle: 'Dokunmatik Ay Evreleri Modeli',
        simSubtitle: 'Ay’ı Dünya etrafında parmağınla sürükle, Dünya’dan nasıl göründüğünü canlı izle!',
        keyNoteTitle: 'Ay Hakkında Kısa Bilim Notu',
        keyNotes: [
          'Ay, Dünya’nın tek doğal uydusudur ve ışık kaynağı değildir; Güneş ışığını yansıtır.',
          'Atmosferi yok denecek kadar incedir; rüzgâr, yağmur gibi hava olayları oluşmaz ve astronot ayak izleri silinmez.',
          'Gök taşlarının çarpmasıyla yüzeyinde krater adı verilen çukurlar oluşur.',
          'Kendi etrafında dönme ve Dünya etrafında dolanma süreleri eşit (~27,3 gün) olduğu için hep aynı yüzünü görürüz.',
          '4 ana evresi vardır: Yeni Ay, İlk Dördün, Dolunay, Son Dördün. İki ana evre arası yaklaşık 1 haftadır; tam döngü ~29,5 gündür.',
        ],
        flashcards: [
          {
            id: 'u1-moon-c1',
            frontPrompt: 'Ay kendi ışığını mı üretir, yoksa başka bir yerden mi alır?',
            frontHint: 'Işık kaynağı mı?',
            backAnswer: 'Ay ışık kaynağı değildir; Güneş’ten aldığı ışığı Dünya’ya yansıtır.',
            miniSummaryTitle: 'Ay Bir Işık Kaynağı Değildir',
            miniSummaryPoints: [
              'Güneş doğal bir ışık kaynağıdır, ancak Ay ışık üretemez.',
              'Ay’ı parlak görmemizin sebebi Güneş ışınlarını ayna gibi yansıtmasıdır.',
              'Bu sayede Ay’ı hem gece hem de bazen gündüz görebiliriz.',
            ],
            dailyLifeTip: 'Karanlık odada el fenerini bir topa tuttuğunda topun parlaması gibi, Güneş de Ay’ı aydınlatır.',
          },
          {
            id: 'u1-moon-c2',
            frontPrompt: 'Ay yüzeyindeki irili ufaklı çukurlara ne ad verilir ve nasıl oluşur?',
            frontHint: 'Ay’ın ince atmosferini düşün',
            backAnswer: 'Krater! Ay’ın atmosferi çok ince olduğu için gök taşları yüzeye çarpıp kraterleri oluşturur.',
            miniSummaryTitle: 'Kraterler ve İnce Atmosfer',
            miniSummaryPoints: [
              'Ay’ın atmosferi yok denecek kadar incedir.',
              'Gök taşları atmosferde yanıp yok olamadan yüzeye düşer ve krater çukurlarını açar.',
              'Hava olayı (rüzgâr, yağış) olmadığı için astronotların ayak izleri yıllarca bozulmadan kalır.',
            ],
            dailyLifeTip: 'Gece -174 °C, gündüz +125 °C sıcaklık farkı kayaları parçalayıp Ay yüzeyini tozla kaplamıştır.',
          },
          {
            id: 'u1-moon-c3',
            frontPrompt: 'Dünya’dan baktığımızda Ay’ın neden hep aynı yüzünü görürüz?',
            frontHint: 'Dönme ve dolanma süreleri',
            backAnswer: 'Ay’ın kendi ekseni etrafında dönme süresi ile Dünya etrafında dolanma süresi neredeyse eşit olduğu için!',
            miniSummaryTitle: 'Ay’ın Hep Aynı Yüzü',
            miniSummaryPoints: [
              'Ay kendi ekseni etrafında yaklaşık 27 gün 8 saatte döner.',
              'Dünya etrafındaki bir tam dolanmasını da aynı sürede (27 gün 8 saat) tamamlar.',
              'İki süre eşit olduğundan Ay’ın hep aynı yüzü Dünya’ya dönük kalır.',
            ],
            dailyLifeTip: 'Bir arkadaşının etrafında yüzünü hep ona bakarak dönersen, hem kendi etrafında hem onun etrafında 1 tam tur atmış olursun!',
          },
          {
            id: 'u1-moon-c4',
            frontPrompt: 'Ay’ın 4 ana evresi sırasıyla hangileridir?',
            frontHint: 'Yeni Ay ile başla',
            backAnswer: 'Yeni Ay → İlk Dördün (D harfi) → Dolunay (Tam daire) → Son Dördün (Ters D).',
            miniSummaryTitle: 'Ay’ın Ana ve Ara Evreleri',
            miniSummaryPoints: [
              'Yeni Ay: Ay, Güneş ile Dünya arasındadır; Dünya’dan karanlık görünür.',
              'İlk Dördün: Sağ yarısı aydınlıktır, "D" harfine benzer.',
              'Dolunay: Dünya, Güneş ile Ay arasındadır; Ay tamamen parlak görünür.',
              'Son Dördün: Sol yarısı aydınlıktır, "ters D" harfine benzer.',
              'Ara evreler: Hilal ve Şişkin Ay.',
            ],
            dailyLifeTip: 'Birbirini izleyen iki ana evre arasında yaklaşık 1 hafta (7 gün) geçer; tüm döngü ~29,5 gündür.',
          },
          {
            id: 'u1-moon-c5',
            frontPrompt: 'Türk bayrağındaki Ay şekli hangi ara evreye benzer?',
            frontHint: '"C" harfine benzeyen evre',
            backAnswer: 'Hilal evresine! Yeni Ay’dan önce "C", Yeni Ay’dan sonra "ters C" gibi görünür.',
            miniSummaryTitle: 'Hilal ve Şişkin Ay',
            miniSummaryPoints: [
              'Hilal ve Şişkin Ay, ana evreler arasındaki geçişlerde görülen ara evrelerdir.',
              'Ramazan ayı ve dinî bayram tarihleri Ay’ın hareketine (Hicrî takvim) göre belirlenir.',
            ],
            dailyLifeTip: 'Ay’ın evrelerinin tamamlanma süresi olan 29,5 gün, takvimlerdeki "1 ay" kavramının temelidir.',
          },
        ],
        fillBlanks: [
          {
            id: 'u1-moon-f1',
            beforeBlank: 'Gök taşlarının Ay yüzeyine çarpmasıyla oluşan çukurlara',
            afterBlank: 'adı verilir.',
            answer: 'krater',
            distractors: ['leke', 'eksen', 'yörünge'],
            explanation: 'Ay’ın atmosferi çok ince olduğu için gök taşları kolayca yüzeye çarparak krater oluşturur.',
          },
          {
            id: 'u1-moon-f2',
            beforeBlank: 'Ay’da atmosfer yok denecek kadar ince olduğu için rüzgâr ve',
            afterBlank: 'gibi hava olayları gerçekleşmez.',
            answer: 'yağmur',
            distractors: ['dönme', 'ışık', 'krater'],
            explanation: 'Hava olayları için kalın bir atmosfer gerekir; Ay’da yağmur, kar ve rüzgâr oluşmaz.',
          },
          {
            id: 'u1-moon-f3',
            beforeBlank: 'Dolunay evresinden yaklaşık iki hafta sonra görülen ana evre',
            afterBlank: 'evresidir.',
            answer: 'Yeni Ay',
            distractors: ['İlk Dördün', 'Hilal', 'Şişkin Ay'],
            explanation: 'Dolunay → (+1 hafta) Son Dördün → (+1 hafta) Yeni Ay evresi görülür.',
          },
          {
            id: 'u1-moon-f4',
            beforeBlank: 'Ay’ın evrelerinin oluşma sebebi,',
            afterBlank: 'etrafındaki dolanma hareketidir.',
            answer: 'Dünya',
            distractors: ['kendi ekseni', 'Mars', 'yıldızlar'],
            explanation: 'Ay, Dünya etrafında dolanırken Güneş’e göre konumu değişir ve farklı kısımları aydınlanır.',
          },
        ],
        hapBilgiler: UNIT1_HAP_BILGILER['u1-moon'],
        tests: UNIT1_TESTS['u1-moon'],
      },
      {
        id: 'u1-orbit',
        unitId: 'unit-1',
        orderLabel: '1.3',
        title: 'Güneş, Dünya ve Ay’ın Hareketleri',
        shortTitle: 'Üçlü Yörünge ve Büyüklük',
        tagline: 'Güneş, Dünya ve Ay’ın saat yönünün tersine uyumlu dansı ve hacimsel büyüklükleri.',
        heroImage: IMAGES.spaceCosmos,
        secondaryImage: IMAGES.moonSurface,
        imageAlt: 'Güneş, Dünya ve Ay yörünge hareketleri',
        simType: 'sun-earth-moon',
        simTitle: 'Güneş – Dünya – Ay Yörünge Makinesi',
        simSubtitle: 'Üç gök cisminin eşzamanlı hareketini ve büyüklük modelini elinle kontrol et!',
        keyNoteTitle: 'Üçlü Hareketler Bilim Notu',
        keyNotes: [
          'Güneş, Dünya ve Ay’ın tüm dönme ve dolanma hareketleri saat yönünün tersine (batıdan doğuya) gerçekleşir.',
          'Dünya kendi ekseni etrafında 24 saatte (1 gün) döner; Güneş etrafında 365 gün 6 saatte (1 yıl) dolanır.',
          'Ay, kendi etrafında döner, Dünya etrafında dolanır (27 gün 8 saat) ve Dünya ile birlikte Güneş etrafında dolanır.',
          'Hacimsel büyüklük sırası: Güneş (Karpuz) > Dünya (Elma) > Ay (Erik / Mercimek).',
          'Uluğ Bey bir yılı 365 gün 6 saat 10 dakika 8 saniye olarak bugüne çok yakın hesaplamıştır.',
        ],
        flashcards: [
          {
            id: 'u1-orb-c1',
            frontPrompt: 'Dünya kendi ekseni etrafında ve Güneş etrafında kaç sürede tam tur atar?',
            frontHint: 'Gün ve Yıl kavramları',
            backAnswer: 'Kendi etrafında dönme: 24 saat (1 gün). Güneş etrafında dolanma: 365 gün 6 saat (1 yıl).',
            miniSummaryTitle: 'Dünya’nın İki Hareketi',
            miniSummaryPoints: [
              'Kendi ekseni etrafında dönme hareketi 24 saat sürer → Gece ve gündüz oluşur.',
              'Güneş etrafında dolanma hareketi yaklaşık 365 gün 6 saat sürer → 1 yıl oluşur.',
              'Her iki hareket de saat yönünün tersinedir.',
            ],
            dailyLifeTip: 'Sabah Güneş’i doğuda, öğlen tepede, akşam batıda görmemiz Dünya’nın dönme hareketinin sonucudur.',
          },
          {
            id: 'u1-orb-c2',
            frontPrompt: 'Güneş, Dünya ve Ay’ı karpuz, elma ve erik ile modellersek hangisi hangisi olur?',
            frontHint: 'Büyükten küçüğe sırala',
            backAnswer: 'Güneş = Karpuz, Dünya = Elma, Ay = Erik (Hacim sırası: Güneş > Dünya > Ay).',
            miniSummaryTitle: 'Hacimsel Büyüklük Karşılaştırması',
            miniSummaryPoints: [
              'Maddelerin uzayda kapladığı yere hacim denir (cm³, m³).',
              'Güneş hacimce Dünya’dan çok daha büyüktür.',
              'Dünya da doğal uydusu Ay’dan daha büyüktür.',
            ],
            dailyLifeTip: 'Güneş’in çapı Dünya’nın yaklaşık 109 katıdır!',
          },
          {
            id: 'u1-orb-c3',
            frontPrompt: 'Ay kaç farklı hareket yapar?',
            frontHint: 'Dönme + iki dolanma!',
            backAnswer: '3 hareket: Kendi ekseni etrafında döner, Dünya etrafında dolanır ve Dünya ile birlikte Güneş etrafında dolanır.',
            miniSummaryTitle: 'Ay’ın Üç Hareketi',
            miniSummaryPoints: [
              '1) Kendi ekseni etrafında dönme (~27 gün 8 saat)',
              '2) Dünya etrafında dolanma (~27 gün 8 saat)',
              '3) Dünya ile birlikte Güneş etrafında dolanma (365 gün 6 saat)',
            ],
            dailyLifeTip: 'Ay’ın üç hareketinin tamamı da saat yönünün tersine gerçekleşir.',
          },
          {
            id: 'u1-orb-c4',
            frontPrompt: 'Semerkant’ta büyük rasathane kurup bir yılı bugünkü değere çok yakın hesaplayan bilgin kimdir?',
            frontHint: 'Çağını Aşanlar bölümü',
            backAnswer: 'Uluğ Bey! Ayrıca Ali Kuşçu, Biruni ve Caca Bey astronomiye büyük katkı sağlamıştır.',
            miniSummaryTitle: 'Astronomide Çağını Aşanlar',
            miniSummaryPoints: [
              'Uluğ Bey: Zîc-i Uluğ Bey eserini yazdı, 1 yılı 365 gün 6 saat 10 dk 8 sn hesapladı.',
              'Ali Kuşçu: "Fethiye" kitabında gezegen konumlarını inceledi; Ay’da bir kratere adı verildi.',
              'Biruni: Dünya’nın çapını bugüne çok yakın hesapladı.',
            ],
            dailyLifeTip: 'Caca Bey’in Anadolu’da kurduğu medresenin kubbesi açıktı ve altında gökyüzünü izlemek için su kuyusu vardı.',
          },
        ],
        fillBlanks: [
          {
            id: 'u1-orb-f1',
            beforeBlank: 'Dünya, Güneş etrafındaki bir tam dolanma hareketini yaklaşık',
            afterBlank: 'sürede tamamlar.',
            answer: '365 gün 6 saat',
            distractors: ['24 saat', '29,5 gün', '7 gün'],
            explanation: 'Dünya’nın Güneş etrafındaki bir tam dolanması 1 yıl, yani yaklaşık 365 gün 6 saat sürer.',
          },
          {
            id: 'u1-orb-f2',
            beforeBlank: 'Güneş, Dünya ve Ay’ın dönme ve dolanma hareketlerinin yönü',
            afterBlank: 'doğrudur.',
            answer: 'saat yönünün tersine',
            distractors: ['saat yönüne', 'yukarıdan aşağıya', 'doğudan batıya'],
            explanation: 'Üç gök cisminin tüm dönme ve dolanma hareketleri saat yönünün tersine gerçekleşir.',
          },
          {
            id: 'u1-orb-f3',
            beforeBlank: 'Dünya kendi ekseni etrafındaki bir tam dönme hareketini',
            afterBlank: 'içinde tamamlar.',
            answer: '24 saat',
            distractors: ['27 gün 8 saat', '365 gün', '1 hafta'],
            explanation: 'Dünya kendi ekseni etrafında 24 saatte (1 günde) döner.',
          },
          {
            id: 'u1-orb-f4',
            beforeBlank: 'Ay, Dünya ile birlikte',
            afterBlank: 'etrafında da dolanma hareketi yapar.',
            answer: 'Güneş',
            distractors: ['yıldızlar', 'kendi', 'bulutlar'],
            explanation: 'Ay, Dünya’nın etrafında dolanırken aynı zamanda Dünya’yla birlikte Güneş’in etrafında dolanır.',
          },
        ],
        hapBilgiler: UNIT1_HAP_BILGILER['u1-orbit'],
        tests: UNIT1_TESTS['u1-orbit'],
      },
    ],
  },

  // =========================================================================
  // 2. ÜNİTE: KUVVETİ TANIYALIM
  // =========================================================================
  {
    id: 'unit-2',
    number: 2,
    title: 'Kuvveti Tanıyalım',
    shortTitle: 'Kuvveti Tanıyalım',
    theme: 'force',
    coverImage: IMAGES.forceParaglider,
    description: 'Dinamometre ile kuvvet ölç, Dünya ve Ay’da ağırlığını karşılaştır, sürtünmeyi test et!',
    topics: [
      {
        id: 'u2-dynamometer',
        unitId: 'unit-2',
        orderLabel: '2.1',
        title: 'Kuvvet ve Kuvvetin Ölçülmesi',
        shortTitle: 'Kuvvet ve Dinamometre',
        tagline: 'Kuvvetin etkileri, esnek yaylar, Newton birimi ve dinamometre hassasiyeti.',
        heroImage: IMAGES.forceParaglider,
        secondaryImage: IMAGES.welcome,
        imageAlt: 'Doğa üzerinde süzülen yamaç paraşütü ve kuvvet',
        simType: 'dynamometer',
        simTitle: 'Sanal Dinamometre Laboratuvarı',
        simSubtitle: 'Farklı kalınlıkta yaylar seç, ağırlık as ve Newton değerini oku!',
        keyNoteTitle: 'Kuvvet ve Dinamometre Bilim Notu',
        keyNotes: [
          'Duran cismi hareket ettiren, hızlandıran, yavaşlatan, durduran, yönünü veya şeklini değiştiren etkiye kuvvet denir.',
          'Kuvvetin büyüklüğü dinamometre ile ölçülür; birimi Newton (N) olarak gösterilir.',
          'Dinamometre içinde esnek sarmal yay bulunur; kuvvet arttıkça yay daha çok uzar.',
          'İnce yaylı dinamometre küçük kuvvetleri daha hassas ölçer; kalın yaylı dinamometre daha büyük kuvvetleri ölçebilir.',
          'Dinamometreye ölçebileceğinden fazla kuvvet uygulanırsa yayın esneklik özelliği bozulur!',
        ],
        flashcards: [
          {
            id: 'u2-dyn-c1',
            frontPrompt: 'Kuvvetin büyüklüğü hangi aletle ölçülür ve birimi nedir?',
            frontHint: 'Isaac Newton’ı hatırla',
            backAnswer: 'Dinamometre ile ölçülür; birimi Newton’dır ve "N" harfiyle gösterilir.',
            miniSummaryTitle: 'Dinamometre ve Newton',
            miniSummaryPoints: [
              'Kuvvet ölçen yaylı alete dinamometre (el kantarı) denir.',
              'Bilim insanı Isaac Newton’ın anısına kuvvet birimine Newton (N) adı verilmiştir.',
              'Dinamometredeki her eşit bölme belirli bir Newton değerini gösterir.',
            ],
            dailyLifeTip: 'Pazar yerlerinde sebze-meyve tartmak için kullanılan yaylı el kantarı aslında bir dinamometredir.',
          },
          {
            id: 'u2-dyn-c2',
            frontPrompt: 'Esnek cisim nedir? Dinamometrede neden yay kullanılır?',
            frontHint: 'Kuvvet kalkınca ne olur?',
            backAnswer: 'Kuvvet uygulanınca şekli değişen, kuvvet kalkınca eski hâline dönen cisimdir. Yay esnek olduğu için kullanılır.',
            miniSummaryTitle: 'Esnek Cisimler',
            miniSummaryPoints: [
              'Paket lastiği, sünger ve sarmal yay esnek cisimlerdir.',
              'Oyun hamuru veya cam esnek değildir (eski hâline dönmez veya kırılır).',
              'Dinamometreye kuvvet uygulandıkça içindeki yay düzenli biçimde uzar.',
            ],
            dailyLifeTip: 'Bir yaya 2 N asınca 1 cm uzuyorsa, 4 cm uzatmak için 8 N kuvvet uygulamak gerekir.',
          },
          {
            id: 'u2-dyn-c3',
            frontPrompt: 'İnce yaylı mı, kalın yaylı dinamometre mi daha hassas ölçüm yapar?',
            frontHint: 'Hafif bir cismi ölçerken düşün',
            backAnswer: 'İnce yaylı dinamometre daha hassas ölçer; kalın yaylı dinamometre ise daha büyük kuvvetleri ölçebilir.',
            miniSummaryTitle: 'Yay Kalınlığı ve Hassasiyet',
            miniSummaryPoints: [
              'Aynı maddeden yapılmış ince yay, küçük bir kuvvette bile kolayca uzar → Daha hassastır.',
              'Kalın yay daha zor uzar, bu sayede 50 N veya 100 N gibi büyük kuvvetleri bozulmadan ölçebilir.',
              'Örneğin 3 N’lık bir kuvveti 5 N’lık (ince yaylı) dinamometre 100 N’lıktan çok daha hassas ölçer.',
            ],
            dailyLifeTip: 'Küçük bir silgiyi koca bir yük kantarıyla değil, hassas küçük dinamometreyle ölçmek gerekir.',
          },
          {
            id: 'u2-dyn-c4',
            frontPrompt: 'En fazla 50 N ölçebilen bir dinamometreye 70 N asılırsa ne olur?',
            frontHint: 'Ölçüm sınırı aşılırsa...',
            backAnswer: 'Yayın esneklik özelliği bozulur ve dinamometre artık doğru ölçüm yapamaz!',
            miniSummaryTitle: 'Dinamometrenin Ölçüm Sınırı',
            miniSummaryPoints: [
              'Her dinamometrenin üzerinde ölçebileceği en büyük kuvvet değeri yazar.',
              'Bu sınır aşılırsa sarmal yay aşırı gerilir ve eski hâline dönemez.',
              'Doğru ölçüm için her zaman cismin ağırlığından büyük kapasiteli dinamometre seçilmelidir.',
            ],
            dailyLifeTip: 'Tükenmez kalem içindeki küçük yayı çok sert çekersen düzleşip bir daha toplanmaz!',
          },
        ],
        fillBlanks: [
          {
            id: 'u2-dyn-f1',
            beforeBlank: 'Kuvvetin büyüklüğü',
            afterBlank: 'adı verilen yaylı alet ile ölçülür.',
            answer: 'dinamometre',
            distractors: ['terazi', 'termometre', 'mikroskop'],
            explanation: 'Dinamometre, esnek yayların uzama özelliğinden yararlanarak kuvveti ölçer.',
          },
          {
            id: 'u2-dyn-f2',
            beforeBlank: 'Dinamometreyle ölçülen kuvvetin birimi',
            afterBlank: 'olarak ifade edilir.',
            answer: 'Newton',
            distractors: ['kilogram', 'metre', 'gram'],
            explanation: 'Kuvvetin birimi Newton’dır ve kısaca "N" harfi ile gösterilir.',
          },
          {
            id: 'u2-dyn-f3',
            beforeBlank: 'Kuvvet, hareketli bir cismin',
            afterBlank: ', hızını veya şeklini değiştirebilir.',
            answer: 'yönünü',
            distractors: ['kütlesini', 'rengini', 'sıcaklığını'],
            explanation: 'Kuvvet cisimleri hızlandırabilir, yavaşlatabilir, durdurabilir, yönünü ve şeklini değiştirebilir.',
          },
          {
            id: 'u2-dyn-f4',
            beforeBlank: 'Basit bir dinamometre yapımında esnek özellikteki',
            afterBlank: 'veya yay kullanılabilir.',
            answer: 'lastik',
            distractors: ['tahta', 'cam', 'taş'],
            explanation: 'Esnek cisimler (yay veya lastik) kuvvet kalkınca eski hâline döndüğü için dinamometrede kullanılır.',
          },
        ],
        hapBilgiler: UNIT2_HAP_BILGILER['u2-dynamometer'],
        tests: UNIT2_TESTS['u2-dynamometer'],
      },
      {
        id: 'u2-mass-weight',
        unitId: 'unit-2',
        orderLabel: '2.2',
        title: 'Kütle ve Ağırlık İlişkisi',
        shortTitle: 'Kütle ve Ağırlık',
        tagline: 'Madde miktarı değişmez, ama yer çekimi yüzünden ağırlığın Ay’da 6 kat hafifler!',
        heroImage: IMAGES.forceParaglider,
        secondaryImage: IMAGES.moonSurface,
        imageAlt: 'Yer çekimi, kütle ve ağırlık keşfi',
        simType: 'mass-weight',
        simTitle: 'Dünya – Ay Kütle & Ağırlık Laboratuvarı',
        simSubtitle: 'Cismi Dünya’dan Ay’a, Ekvator’dan Kutba taşı; kütle ve ağırlık nasıl değişir gör!',
        keyNoteTitle: 'Kütle ve Ağırlık Bilim Notu',
        keyNotes: [
          'Kütle, değişmeyen madde miktarıdır; eşit kollu terazi ile ölçülür, birimi gram (g) veya kilogramdır (kg).',
          'Ağırlık, kütleye etki eden yer çekimi kuvvetidir; dinamometre ile ölçülür, birimi Newton’dır (N).',
          'Dünya 1 kg kütleye yaklaşık 10 N çekim kuvveti uygular. Ay’daki ağırlık Dünya’dakinin 1/6’sıdır.',
          'Dünya kutuplardan basık (geoit) olduğu için bir cismin ağırlığı kutuplarda Ekvator’a göre daha fazladır.',
          'Deniz seviyesinden dağ zirvesine çıkıldıkça yer çekimi azalır, ağırlık azalır; ama kütle asla değişmez!',
        ],
        flashcards: [
          {
            id: 'u2-mw-c1',
            frontPrompt: 'Kütle ile ağırlık arasındaki en temel fark nedir?',
            frontHint: 'Biri madde miktarı, diğeri kuvvet!',
            backAnswer: 'Kütle değişmeyen madde miktarıdır (terazi, kg). Ağırlık ise kütleye etki eden yer çekimi kuvvetidir (dinamometre, N).',
            miniSummaryTitle: 'Kütle vs Ağırlık',
            miniSummaryPoints: [
              'Kütle: Eşit kollu terazi ile ölçülür, birimi g / kg, evrenin her yerinde AYNIDIR.',
              'Ağırlık: Dinamometre ile ölçülür, birimi Newton (N), konuma göre DEĞİŞİR.',
              '"2 kilogram elma aldım" dediğimizde kütleden bahsetmiş oluruz.',
            ],
            dailyLifeTip: 'Elmas ölçümünde kullanılan "karat" birimi, hepsi ~0,2 g gelen keçiboynuzu çekirdeklerinden doğmuştur.',
          },
          {
            id: 'u2-mw-c2',
            frontPrompt: 'Dünya’da kütlesi 60 kg olan bir astronotun Dünya’daki ve Ay’daki ağırlığı kaç N olur?',
            frontHint: 'Dünya’da ×10, Ay’da ÷6',
            backAnswer: 'Dünya’da 600 N, Ay’da ise 6 kat azalarak 100 N olur! Kütlesi her iki yerde de 60 kg kalır.',
            miniSummaryTitle: 'Dünya ve Ay’da Ağırlık',
            miniSummaryPoints: [
              'Dünya 1 kg kütleye yaklaşık 10 N çekim kuvveti uygular (60 kg × 10 = 600 N).',
              'Dünya, Ay’dan daha büyük olduğu için 6 kat fazla çekim uygular.',
              'Ay’daki ağırlık = Dünya’daki ağırlık ÷ 6 (600 ÷ 6 = 100 N).',
            ],
            dailyLifeTip: 'Astronotlar Ay’da ağır kıyafetlerle bile zıplayarak yürüyebilir çünkü ağırlıkları 6 kat azalır!',
          },
          {
            id: 'u2-mw-c3',
            frontPrompt: 'Bir cismin ağırlığı kutuplarda mı yoksa Ekvator’da mı daha fazladır?',
            frontHint: 'Dünya’nın geoit şeklini düşün',
            backAnswer: 'Kutuplarda daha fazladır! Çünkü kutuplar Dünya’nın merkezine Ekvator’dan daha yakındır.',
            miniSummaryTitle: 'Geoit Şekli ve Kutuplar',
            miniSummaryPoints: [
              'Dünya kutuplardan basık, Ekvator’dan şişkin (geoit) şeklindedir.',
              'Kutuplar Dünya merkezine ~21 km daha yakın olduğundan yer çekimi daha fazladır.',
              'Bu yüzden aynı cisim kutuplarda Ekvator’a göre daha ağır ölçülür.',
            ],
            dailyLifeTip: 'Ekvator’dan Kuzey Kutbu’na giden bir geminin kütlesi değişmez ama ağırlığı biraz artar.',
          },
          {
            id: 'u2-mw-c4',
            frontPrompt: 'Deniz kenarından yüksek bir dağın zirvesine çıkılırsa kütle ve ağırlık nasıl değişir?',
            frontHint: 'Merkezden uzaklaştıkça...',
            backAnswer: 'Kütle değişmez; yer çekimi azaldığı için ağırlık azalır.',
            miniSummaryTitle: 'Yükseklik ve Ağırlık',
            miniSummaryPoints: [
              'Yer çekimi kuvveti Dünya yüzeyinden uzaklaştıkça (yukarı çıkıldıkça) azalır.',
              'Dağ zirvesinde ağırlık deniz seviyesine göre daha küçük ölçülür.',
              'Cismin madde miktarı olan kütle ise hiçbir yerde değişmez.',
            ],
            dailyLifeTip: 'Roketler uzaya yükseldikçe Dünya’nın çekim kuvveti giderek azalır.',
          },
        ],
        fillBlanks: [
          {
            id: 'u2-mw-f1',
            beforeBlank: 'Elmanın kütlesi',
            afterBlank: 'ile ölçülür ve birimi gram veya kilogramdır.',
            answer: 'eşit kollu terazi',
            distractors: ['dinamometre', 'cetvel', 'kronometre'],
            explanation: 'Kütle ölçümünde eşit kollu terazi, ağırlık ölçümünde ise dinamometre kullanılır.',
          },
          {
            id: 'u2-mw-f2',
            beforeBlank: 'Bir maddenin',
            afterBlank: 'değeri Dünya’nın ve uzayın her yerinde aynı ölçülür.',
            answer: 'kütle',
            distractors: ['ağırlık', 'sürtünme', 'kuvvet'],
            explanation: 'Kütle değişmeyen madde miktarıdır; konuma göre değişmez.',
          },
          {
            id: 'u2-mw-f3',
            beforeBlank: 'Bir maddenin ağırlığı Dünya’nın farklı bölgelerinde',
            afterBlank: 'değerde ölçülebilir.',
            answer: 'farklı',
            distractors: ['aynı', 'sıfır', 'sabit'],
            explanation: 'Yer çekimi kutuplarda fazla, dağ zirvelerinde az olduğu için ağırlık konuma göre değişir.',
          },
          {
            id: 'u2-mw-f4',
            beforeBlank: 'Kütleye etki eden yer çekimi kuvvetine',
            afterBlank: 'denir.',
            answer: 'ağırlık',
            distractors: ['hacim', 'direnç', 'esneklik'],
            explanation: 'Ağırlık bir kuvvettir ve kütleye etki eden yer çekimi kuvvetidir.',
          },
        ],
        hapBilgiler: UNIT2_HAP_BILGILER['u2-mass-weight'],
        tests: UNIT2_TESTS['u2-mass-weight'],
      },
      {
        id: 'u2-friction',
        unitId: 'unit-2',
        orderLabel: '2.3',
        title: 'Sürtünme Kuvveti, Hava ve Su Direnci',
        shortTitle: 'Sürtünme, Hava ve Su Direnci',
        tagline: 'Zeminlerin pürüzlülüğü, araba yarışı deneyi, paraşüt ve gemi tasarımları.',
        heroImage: IMAGES.forceParaglider,
        secondaryImage: IMAGES.welcome,
        imageAlt: 'Hava direnci ile süzülen yamaç paraşütü',
        simType: 'friction-lab',
        simTitle: 'Sürtünme Pisti & Hava-Su Direnci Labı',
        simSubtitle: 'Zemin seçip arabayı bırak, paraşüt ve gemi tasarımını canlı test et!',
        keyNoteTitle: 'Sürtünme Kuvveti Bilim Notu',
        keyNotes: [
          'Temas eden yüzeyler arasında oluşan ve genellikle harekete zıt yönlü dirence sürtünme kuvveti denir.',
          'Pürüzlü yüzeyler (halı, kum, toprak) az pürüzlü yüzeylere (cam, mermer, buz) göre daha çok sürtünme uygular.',
          'Artırmak için: Kar zinciri, krampon, kaydırmaz bant, halterci pudrası. Azaltmak için: Yağlama, tekerlek, cila.',
          'Havanın zorluğuna hava direnci, suyun zorluğuna su direnci denir.',
          'Uçak ve hızlı trenlerin ucu sivri, gemilerin önü "V" şeklinde yapılarak direnç azaltılır; paraşütte ise hava direnci artırılır!',
        ],
        flashcards: [
          {
            id: 'u2-fr-c1',
            frontPrompt: 'Sürtünme kuvveti hareket yönüne göre hangi yönde etki eder?',
            frontHint: 'İtilen bir kutuyu düşün',
            backAnswer: 'Genellikle harekete ZIT yönde etki eder ve cismin hareketini zorlaştırıp yavaşlatır.',
            miniSummaryTitle: 'Sürtünmenin Yönü',
            miniSummaryPoints: [
              'Bir kutuyu sağa doğru ittiğinde zemin ile kutu arasında sola doğru sürtünme oluşur.',
              'Halı gibi pürüzlü yüzeyde sürtünme çok, mermer gibi az pürüzlü yüzeyde sürtünme azdır.',
            ],
            dailyLifeTip: 'Kitabın altına yuvarlak kalemler koyduğunda daha kolay itersin — Fatih Sultan Mehmet de gemileri yağlı kütüklerle karadan yürütmüştür!',
          },
          {
            id: 'u2-fr-c2',
            frontPrompt: 'Sürtünme kuvvetini ARTIRMAK için günlük hayatta neler yapılır?',
            frontHint: 'Kaymayı önlemek istediğimizde...',
            backAnswer: 'Buzlu yolda lastiklere zincir takmak, krampon giymek, merdivene kaydırmaz bant yapıştırmak, haltercilerin pudra sürmesi.',
            miniSummaryTitle: 'Sürtünmeyi Artırma',
            miniSummaryPoints: [
              'Sürtünme her zaman kötü değildir; yürüyebilmemiz, yazı yazmamız ve frenle durabilmemiz sürtünme sayesindedir!',
              'Kaygan zeminlerde güvenliği sağlamak için yüzeyin pürüzlülüğü artırılır.',
            ],
            dailyLifeTip: 'Eğer sürtünme hiç olmasaydı kalemle deftere yazı bile yazamaz, yürürken sürekli kayardık.',
          },
          {
            id: 'u2-fr-c3',
            frontPrompt: 'Sürtünme kuvvetini AZALTMAK için neler yapılır?',
            frontHint: 'Daha kolay hareket etmek için...',
            backAnswer: 'Kapı menteşelerini ve bisiklet zincirini yağlamak, valizlere tekerlek takmak, tahtayı cilalamak.',
            miniSummaryTitle: 'Sürtünmeyi Azaltma',
            miniSummaryPoints: [
              'Yağlama işlemi yüzeydeki girinti çıkıntıları doldurarak kayganlığı artırır.',
              'Tekerlek kullanımı yuvarlanma hareketiyle sürtünmeyi ciddi ölçüde düşürür.',
              'Kırkpınar yağlı güreşlerinde pehlivanların yağlanması da sürtünmeyi azaltır.',
            ],
            dailyLifeTip: 'Makine parçaları sürtünüp aşınmasın diye araç motorlarına düzenli motor yağı konulur.',
          },
          {
            id: 'u2-fr-c4',
            frontPrompt: 'Millî Muharip Uçağı KAAN’ın ve hızlı trenlerin burunları neden sivri tasarlanır?',
            frontHint: 'Gaz ortamındaki sürtünme',
            backAnswer: 'Hava direncini azaltarak daha hızlı gitmek ve enerjiden tasarruf sağlamak için!',
            miniSummaryTitle: 'Hava ve Su Direnci',
            miniSummaryPoints: [
              'Havanın harekete karşı gösterdiği dirence hava direnci denir.',
              'Suyun harekete karşı gösterdiği dirence su direnci denir.',
              'Gemilerin "V" şeklindeki burunları hem su hem hava direncini azaltır.',
              'Paraşütler ise geniş yüzeyleriyle hava direncini ARTIRARAK güvenli iniş sağlar.',
            ],
            dailyLifeTip: 'Aynı A4 kâğıdını buruşturup top yaparsan hava direnci azaldığı için düz kâğıttan çok daha hızlı yere düşer!',
          },
        ],
        fillBlanks: [
          {
            id: 'u2-fr-f1',
            beforeBlank: 'Sürtünme kuvveti, genellikle harekete',
            afterBlank: 'yönde etki eder.',
            answer: 'zıt',
            distractors: ['aynı', 'yukarı', 'dik'],
            explanation: 'Sürtünme kuvveti hareket eden cisimleri yavaşlatıcı ve harekete zıt yönde etki gösterir.',
          },
          {
            id: 'u2-fr-f2',
            beforeBlank: 'Merdivenlere kaydırmaz bant yapıştırılması, sürtünme kuvvetini',
            afterBlank: 'bir uygulamadır.',
            answer: 'artıran',
            distractors: ['azaltan', 'sıfırlayan', 'durduran'],
            explanation: 'Kaydırmaz bant yüzeyi pürüzlü hâle getirerek sürtünmeyi artırır ve düşmeyi önler.',
          },
          {
            id: 'u2-fr-f3',
            beforeBlank: 'Makine parçalarının zamanla aşınması, sürtünme kuvvetinin',
            afterBlank: 'etkilerindendir.',
            answer: 'olumsuz',
            distractors: ['olumlu', 'yararlı', 'hızlandıran'],
            explanation: 'Ayakkabıların eskimesi ve makine dişlilerinin aşınması sürtünmenin olumsuz etkileridir.',
          },
          {
            id: 'u2-fr-f4',
            beforeBlank: 'Gemilerin ön kısmının "V" şeklinde tasarlanması hem hava hem de',
            afterBlank: 'direncini azaltır.',
            answer: 'su',
            distractors: ['toprak', 'cam', 'buz'],
            explanation: 'Gemiler suda ilerlerken su direncini, üst kısımlarıyla da hava direncini yararak ilerler.',
          },
        ],
        hapBilgiler: UNIT2_HAP_BILGILER['u2-friction'],
        tests: UNIT2_TESTS['u2-friction'],
      },
    ],
  },

  // =========================================================================
  // 3. ÜNİTE: CANLILARIN YAPISINA YOLCULUK
  // =========================================================================
  {
    id: 'unit-3',
    number: 3,
    title: 'Canlıların Yapısına Yolculuk',
    shortTitle: 'Canlıların Yapısı',
    theme: 'life',
    coverImage: IMAGES.cellBiology,
    description: 'Mikroskopla bitki ve hayvan hücrelerinin içine gir, iskelet ve kas sistemimizi keşfet!',
    topics: [
      {
        id: 'u3-cell',
        unitId: 'unit-3',
        orderLabel: '3.1',
        title: 'Hücre ve Organelleri',
        shortTitle: 'Hücre ve Organeller',
        tagline: 'Canlıların en küçük yapı taşı, bitki-hayvan hücresi farkları ve organeller.',
        heroImage: IMAGES.cellBiology,
        secondaryImage: UNIT_ART.cellOrganism,
        imageAlt: 'Bitki ve hayvan hücresi 3 boyutlu mikroskop illüstrasyonu',
        simType: 'cell-explorer',
        simTitle: 'İnteraktif Hücre Mikroskobu',
        simSubtitle: 'Organellere dokunarak görevlerini keşfet, Hücre’den Organizma’ya yakınlaş!',
        keyNoteTitle: 'Hücre ve Organeller Bilim Notu',
        keyNotes: [
          'Canlıların canlılık özelliği gösteren en küçük yapı birimine hücre denir; mikroskop ile incelenir.',
          'Hücrenin 3 temel kısmı: Hücre Zarı (madde giriş-çıkışı), Sitoplazma (organelleri taşıyan sıvı), Çekirdek (yönetim merkezi).',
          'Mitokondri enerji, Ribozom protein, Kloroplast (sadece bitki) besin ve oksijen, Koful depolama, Golgi salgı/paketleme, Lizozom sindirim yapar.',
          'Bitki hücresi köşelidir (hücre duvarı + kloroplast var, koful büyük ve az). Hayvan hücresi ovaldir (sentrozom var, koful küçük ve çok).',
          'Basitten karmaşığa sıralama: Hücre → Doku → Organ → Sistem → Organizma.',
        ],
        flashcards: [
          {
            id: 'u3-cell-c1',
            frontPrompt: 'Hem bitki hem hayvan hücresinde ortak bulunan 3 temel kısım nedir?',
            frontHint: 'Dıştan içe doğru say',
            backAnswer: 'Hücre Zarı, Sitoplazma ve Çekirdek!',
            miniSummaryTitle: 'Hücrenin 3 Temel Kısmı',
            miniSummaryPoints: [
              'Hücre Zarı: Hücreyi sarar, seçici geçirgendir, esnektir ve madde giriş-çıkışını kontrol eder.',
              'Sitoplazma: Yarı akışkan saydam sıvıdır, organelleri içinde barındırır.',
              'Çekirdek: Hücreyi yönetir (Okul müdürü gibi) ve kalıtsal özellikleri taşır.',
            ],
            dailyLifeTip: '1665’te Robert Hooke şişe mantarını mikroskopla inceleyip gördüğü küçük odacıklara "hücre" adını vermiştir.',
          },
          {
            id: 'u3-cell-c2',
            frontPrompt: 'Bitki hücresini hayvan hücresinden ayıran 3 önemli özellik nedir?',
            frontHint: 'Şekil, koruma kalkanı ve yeşil renk',
            backAnswer: 'Bitki hücresi KÖŞELİDİR, HÜCRE DUVARI ve KLOROPLAST bulundurur, kofulları büyük ve az sayıdadır.',
            miniSummaryTitle: 'Bitki vs Hayvan Hücresi',
            miniSummaryPoints: [
              'Bitki Hücresi: Köşeli · Hücre duvarı VAR · Kloroplast VAR · Koful büyük ve az · Sentrozom YOK.',
              'Hayvan Hücresi: Oval · Hücre duvarı YOK · Kloroplast YOK · Koful küçük ve çok · Sentrozom VAR.',
            ],
            dailyLifeTip: 'Yeşil yaprak hücresi bitki hücresidir (kloroplastlı); ağız içi epitel ve kas hücresi ise hayvan hücresidir.',
          },
          {
            id: 'u3-cell-c3',
            frontPrompt: 'Hücrenin enerji santrali (Mitokondri) ile protein fabrikası (Ribozom) ne iş yapar?',
            frontHint: 'Organel görevleri',
            backAnswer: 'Mitokondri hücreye enerji üretir; Ribozom ise protein üretir.',
            miniSummaryTitle: 'Önemli Organellerin Görevleri',
            miniSummaryPoints: [
              'Mitokondri: Enerji üretir (Elektrik santrali).',
              'Ribozom: Protein üretir.',
              'Kloroplast: Bitkilerde besin ve oksijen üretir (Mutfak).',
              'Golgi Aygıtı: Salgı üretir ve paketler (Kargo merkezi).',
              'Endoplazmik Retikulum: Hücre içi madde iletimi (Kargo yolları).',
              'Koful: Su, besin ve atık depolar (Depo). Lizozom: Hücre içi sindirim.',
            ],
            dailyLifeTip: 'Çok enerji harcayan kas hücrelerimizde mitokondri sayısı diğer hücrelere göre çok daha fazladır!',
          },
          {
            id: 'u3-cell-c4',
            frontPrompt: 'Canlıların yapısal düzenini basitten karmaşığa doğru sırala!',
            frontHint: 'Tuğla → Duvar → Oda → Ev → Köy',
            backAnswer: 'Hücre → Doku → Organ → Sistem → Organizma!',
            miniSummaryTitle: 'Hücreden Organizmaya Hiyerarşi',
            miniSummaryPoints: [
              'Aynı görevli hücreler birleşip DOKUyu oluşturur (Kas hücresi → Kas dokusu).',
              'Farklı dokular birleşip ORGANı oluşturur (Kalp, mide, kol).',
              'Organlar birleşip SİSTEMi oluşturur (Dolaşım sistemi, destek ve hareket sistemi).',
              'Sistemler birleşip ORGANİZMAyı (insan, ağaç, kuş) oluşturur.',
            ],
            dailyLifeTip: 'Ülke benzetmesi: Ev (Hücre) → Mahalle (Doku) → İlçe (Organ) → İl (Sistem) → Ülke (Organizma).',
          },
        ],
        fillBlanks: [
          {
            id: 'u3-cell-f1',
            beforeBlank: 'Canlıların canlılık olaylarının gerçekleştiği en küçük yapı birimine',
            afterBlank: 'denir.',
            answer: 'hücre',
            distractors: ['doku', 'organ', 'mikroskop'],
            explanation: 'Hücre, tüm canlıların temel yapı taşıdır ve mikroskop ile gözlemlenir.',
          },
          {
            id: 'u3-cell-f2',
            beforeBlank: 'Bitki hücrelerinde besin ve oksijen üretilmesini',
            afterBlank: 'organeli sağlar.',
            answer: 'kloroplast',
            distractors: ['sentrozom', 'lizozom', 'ribozom'],
            explanation: 'Kloroplast bitkilerin yeşil kısımlarında bulunur ve besin + oksijen üretir.',
          },
          {
            id: 'u3-cell-f3',
            beforeBlank: 'Hücrede protein üretmek',
            afterBlank: 'yapısının görevidir.',
            answer: 'ribozom',
            distractors: ['koful', 'golgi', 'çekirdek'],
            explanation: 'Ribozom, hem bitki hem hayvan hücresinde protein üretimi yapan küçük yapıdır.',
          },
          {
            id: 'u3-cell-f4',
            beforeBlank: 'Belirli görevleri üstlenen organların bir araya gelmesiyle',
            afterBlank: 'oluşur.',
            answer: 'sistemler',
            distractors: ['dokular', 'hücreler', 'organeller'],
            explanation: 'Hiyerarşi: Hücre → Doku → Organ → Sistem → Organizma.',
          },
        ],
        hapBilgiler: UNIT3_HAP_BILGILER['u3-cell'],
        tests: UNIT3_TESTS['u3-cell'],
      },
      {
        id: 'u3-organism',
        unitId: 'unit-3',
        orderLabel: '3.2',
        title: 'Hücreden Organizmaya',
        shortTitle: 'Hücreden Organizmaya',
        tagline: 'Hücre, doku, organ, sistem ve organizma arasındaki yapısal basamaklar ve benzetmeler.',
        heroImage: UNIT_ART.cellOrganism,
        secondaryImage: IMAGES.cellBiology,
        imageAlt: 'Hücreden organizmaya basitten karmaşığa beş yapısal basamak şeması',
        simType: 'cell-to-organism',
        simTitle: 'Hücreden Organizmaya Basamak & Benzetme Labı',
        simSubtitle: '5 basamağa sırayla dokun, Köy, Ülke ve 6 Katlı Okul Binası benzetmelerini karşılaştır!',
        keyNoteTitle: 'Hücreden Organizmaya Bilim Notu',
        keyNotes: [
          'Basitten karmaşığa yapısal basamaklar: Hücre → Doku → Organ → Sistem → Organizma.',
          'Aynı görevi yapan hücreler DOKUyu, farklı dokular ORGANı, organlar SİSTEMi, sistemler ORGANİZMAyı oluşturur.',
          'Köy benzetmesi: Tuğla (Hücre) → Duvar (Doku) → Oda (Organ) → Ev (Sistem) → Köy (Organizma).',
          'Ülke benzetmesi: Ev (Hücre) → Mahalle (Doku) → İlçe (Organ) → İl (Sistem) → Ülke (Organizma).',
          'Örnek zincir: Kas hücresi → Kas dokusu → Kalp → Dolaşım sistemi → İnsan.',
        ],
        flashcards: [
          {
            id: 'u3-org-c1',
            frontPrompt: 'Canlıların yapısal basamaklarını basitten karmaşığa doğru sırala!',
            frontHint: '5 basamaklı merdiven',
            backAnswer: 'Hücre → Doku → Organ → Sistem → Organizma!',
            miniSummaryTitle: 'Basitten Karmaşığa Sıralama',
            miniSummaryPoints: [
              'En küçük canlı yapı birimi: Hücre.',
              'Karmaşıktan basite (büyükten küçüğe) sıralama: Organizma → Sistem → Organ → Doku → Hücre.',
            ],
            dailyLifeTip: 'Sadece insan ve hayvanlarda değil, elma ağacı gibi çok hücreli bitkilerde de bu düzen vardır.',
          },
          {
            id: 'u3-org-c2',
            frontPrompt: 'Doku, Organ ve Sistem kavramlarını kısaca tanımla!',
            frontHint: 'Hücreler birleşince ne olur?',
            backAnswer: 'Doku: Aynı görevli hücreler topluluğu. Organ: Farklı dokuların birleşimi (kalp, kol, beyin). Sistem: Organların birleşimi (solunum, dolaşım).',
            miniSummaryTitle: 'Temel Tanımlar',
            miniSummaryPoints: [
              'Kas hücresi → Kas dokusu → Kalp → Dolaşım sistemi → İnsan.',
              'Sinir hücresi → Sinir dokusu → Beyin → Sinir sistemi → İnsan.',
            ],
            dailyLifeTip: 'Tüm sistemlerin uyumlu birleşimi canlı organizmayı oluşturur.',
          },
          {
            id: 'u3-org-c3',
            frontPrompt: 'Kitaptaki Köy ve Ülke benzetmelerinde her basamak neyle eşleşir?',
            frontHint: 'Köprü İstasyonu',
            backAnswer: 'Köy: Tuğla-Duvar-Oda-Ev-Köy. Ülke: Ev-Mahalle-İlçe-İl-Ülke!',
            miniSummaryTitle: 'Benzetme Tablosu',
            miniSummaryPoints: [
              'Hücre = Tuğla / Ev · Doku = Duvar / Mahalle · Organ = Oda / İlçe.',
              'Sistem = Ev / İl · Organizma = Köy / Ülke.',
            ],
            dailyLifeTip: 'Benzetme sorularında en küçük parçayı Hücre, en büyük bütünü Organizma ile eşleştir!',
          },
          {
            id: 'u3-org-c4',
            frontPrompt: 'Ünite sonundaki 6 Katlı Okul Binası benzetmesinde Sınıf ve Kat neyi temsil eder?',
            frontHint: 'Akciğer ve Solunum Sistemi',
            backAnswer: 'Sınıf = Akciğer (Organ), Kat = Solunum Sistemi (Sistem), Okul Binası = İnsan (Organizma)!',
            miniSummaryTitle: '6 Katlı Okul Benzetmesi',
            miniSummaryPoints: [
              'Tuğla = Akciğer Hücresi, Duvar = Akciğer Dokusu.',
              'Sınıf = Akciğer, Kat = Solunum Sistemi, Okul = Organizma.',
            ],
            dailyLifeTip: 'Bu benzetme MEB ders kitabının 3. ünite sonu değerlendirme sorularında yer alır.',
          },
        ],
        fillBlanks: [
          {
            id: 'u3-org-f1',
            beforeBlank: 'Aynı görevi yerine getirmek için bir araya gelen hücreler topluluğuna',
            afterBlank: 'denir.',
            answer: 'doku',
            distractors: ['organ', 'sistem', 'organizma'],
            explanation: 'Kas hücreleri birleşerek kas dokusunu oluşturur.',
          },
          {
            id: 'u3-org-f2',
            beforeBlank: 'Farklı dokuların belirli bir görevi yapmak için bir araya gelmesiyle',
            afterBlank: 'oluşur.',
            answer: 'organ',
            distractors: ['hücre', 'organel', 'doku'],
            explanation: 'Kalp, kol, beyin ve akciğer birer organdır.',
          },
          {
            id: 'u3-org-f3',
            beforeBlank: 'Ev → Mahalle → İlçe → İl → Ülke benzetmesinde "İl"',
            afterBlank: 'basamağını temsil eder.',
            answer: 'sistem',
            distractors: ['hücre', 'doku', 'organ'],
            explanation: 'İlçeler (organlar) birleşerek İli (sistemi) oluşturur.',
          },
          {
            id: 'u3-org-f4',
            beforeBlank: 'Farklı yaşamsal görevleri yerine getiren sistemlerin uyumlu birleşimiyle',
            afterBlank: 'oluşur.',
            answer: 'organizma',
            distractors: ['doku', 'hücre', 'organ'],
            explanation: 'İnsan, kuş ve elma ağacı birer organizmadır.',
          },
        ],
        hapBilgiler: UNIT3_HAP_BILGILER['u3-organism'],
        tests: UNIT3_TESTS['u3-organism'],
      },
      {
        id: 'u3-skeleton',
        unitId: 'unit-3',
        orderLabel: '3.3',
        title: 'Destek ve Hareket Sistemi',
        shortTitle: 'Destek ve Hareket Sistemi',
        tagline: 'Kemik, kıkırdak, eklem ve kas çeşitleriyle vücudumuzu tanıyalım ve koruyalım!',
        heroImage: IMAGES.skeletonMotion,
        secondaryImage: IMAGES.cellBiology,
        imageAlt: 'İnsan iskeleti modeli ve laboratuvar mikroskobu',
        simType: 'skeleton-motion',
        simTitle: 'İnteraktif İskelet & Kas Laboratuvarı',
        simSubtitle: 'İskelet bölgelerine dokun ve kolu bükerek kas-eklem çalışmasını izle!',
        keyNoteTitle: 'Destek ve Hareket Sistemi Bilim Notu',
        keyNotes: [
          'Destek ve hareket sistemi iskelet (kemik, kıkırdak, eklem) ve kaslardan oluşur.',
          'Kemikler: Uzun (uyluk, pazu, parmak), Kısa (el ve ayak bilek), Yassı (kafatası, kaburga, kürek, leğen).',
          'Kıkırdak yumuşak ve esnektir: Burun ucu, kulak kepçesi, soluk borusu ve uzun kemik uçlarında bulunur.',
          'Eklemler: Oynar (kol-bacak), Yarı Oynar (omurga), Oynamaz (kafatası).',
          'Kaslar: Çizgili kas (iskeleti sarar, hızlı), Düz kas (mide-bağırsak gibi iç organlar), Kalp kası (sadece kalpte, ömür boyu çalışır).',
        ],
        flashcards: [
          {
            id: 'u3-sk-c1',
            frontPrompt: 'İskelet hangi üç yapıdan oluşur ve kemik çeşitleri nelerdir?',
            frontHint: 'Binaların kolonları gibi düşün',
            backAnswer: 'İskelet kemik, kıkırdak ve eklemden oluşur. Kemikler: Uzun, Kısa ve Yassı kemiklerdir.',
            miniSummaryTitle: 'Kemik Çeşitleri',
            miniSummaryPoints: [
              'Uzun Kemik: Boyu eninden fazla (uyluk, kaval, pazu, parmak kemikleri). En uzun kemik uyluktur.',
              'Kısa Kemik: Boyu ve eni yakın (el ve ayak bilek kemikleri).',
              'Yassı Kemik: Levha gibi geniş yüzeyli (kafatası, kaburga, kürek, leğen kemikleri).',
            ],
            dailyLifeTip: 'Bebekler ~300 kemikle doğar; büyüdükçe bazıları kaynaşır ve yetişkinlerde 206 kemik olur!',
          },
          {
            id: 'u3-sk-c2',
            frontPrompt: 'Kıkırdak nerelerde bulunur ve görevi nedir?',
            frontHint: 'Kulağına ve burnuna dokun!',
            backAnswer: 'Burun, kulak kepçesi, soluk borusu ve uzun kemiklerin uçlarında bulunur; esnektir ve kemiklerin sürtünmesini önler.',
            miniSummaryTitle: 'Kıkırdak Yapısı',
            miniSummaryPoints: [
              'Kemiklere göre daha yumuşak ve esnek yapıdadır.',
              'Uzun kemik uçlarında yer alarak kemiklerin birbirine sürtünüp aşınmasını önler.',
              'Soluk borusunun açık kalmasına yardımcı olur.',
            ],
            dailyLifeTip: 'Kulak kepçeni hafifçe büktüğünde kırılmayıp eski hâline dönmesi kıkırdak sayesindedir.',
          },
          {
            id: 'u3-sk-c3',
            frontPrompt: 'Eklem çeşitlerini birer örnekle sayabilir misin?',
            frontHint: 'Kapı menteşesi gibi!',
            backAnswer: 'Oynar eklem (kol-bacak), Yarı oynar eklem (omurga), Oynamaz eklem (kafatası).',
            miniSummaryTitle: 'Eklem Çeşitleri',
            miniSummaryPoints: [
              'İki kemiğin birbirine bağlandığı yere eklem denir.',
              'Oynar eklem: Rahat hareket eder (diz, dirsek, omuz, parmak).',
              'Yarı oynar eklem: Kısıtlı hareket eder (omurga kemikleri).',
              'Oynamaz eklem: Hiç hareket etmez (kafatası kemikleri).',
            ],
            dailyLifeTip: 'Tenis oynarken kolundaki oynar eklemler, topu yerden alırken omurgandaki yarı oynar eklemler çalışır.',
          },
          {
            id: 'u3-sk-c4',
            frontPrompt: 'Vücudumuzdaki 3 kas çeşidi nedir ve nerelerde bulunur?',
            frontHint: 'Kol, mide ve kalp!',
            backAnswer: 'Çizgili kas (iskelet/kol-bacak), Düz kas (mide-bağırsak gibi iç organlar), Kalp kası (sadece kalp).',
            miniSummaryTitle: 'Kas Çeşitleri',
            miniSummaryPoints: [
              'Çizgili Kas: İsteğimizle çalışır, yürüme-koşma-yazma sağlar.',
              'Düz Kas: İç organların yapısındadır, istemsiz ve yavaş çalışır.',
              'Kalp Kası: Sadece kalpte bulunur, yaşam boyu durmadan çalışır.',
            ],
            dailyLifeTip: 'Kemikler kalsiyum ve D vitaminiyle güçlenir; yerden ağırlık alırken dizleri bükerek kalkmalıyız!',
          },
        ],
        fillBlanks: [
          {
            id: 'u3-sk-f1',
            beforeBlank: 'İki kemiğin birbirine bağlandığı bölgeye',
            afterBlank: 'denir.',
            answer: 'eklem',
            distractors: ['kıkırdak', 'kas', 'doku'],
            explanation: 'Eklemler kemikleri birbirine bağlayarak (kapı menteşesi gibi) hareketi sağlar.',
          },
          {
            id: 'u3-sk-f2',
            beforeBlank: 'Mide ve ince bağırsak gibi iç organların yapısında',
            afterBlank: 'kas vardır.',
            answer: 'düz',
            distractors: ['çizgili', 'kalp', 'oynar'],
            explanation: 'İç organların düzenli çalışmasını sağlayan kaslar düz kaslardır.',
          },
          {
            id: 'u3-sk-f3',
            beforeBlank: 'Kürek ve kafatası kemikleri',
            afterBlank: 'kemikler sınıfında yer alır.',
            answer: 'yassı',
            distractors: ['uzun', 'kısa', 'kıkırdak'],
            explanation: 'Kafatası, kürek, kaburga ve leğen kemikleri levha biçimli yassı kemiklerdir.',
          },
          {
            id: 'u3-sk-f4',
            beforeBlank: 'İskeletin etrafını saran ve yürümemizi sağlayan kaslar',
            afterBlank: 'kaslardır.',
            answer: 'çizgili',
            distractors: ['düz', 'kalp', 'oynamaz'],
            explanation: 'Çizgili kaslar iskeletin etrafını sararak kol, bacak ve parmak hareketlerini gerçekleştirir.',
          },
        ],
        hapBilgiler: UNIT3_HAP_BILGILER['u3-skeleton'],
        tests: UNIT3_TESTS['u3-skeleton'],
      },
    ],
  },
  ...SEMESTER2_UNITS,
];

export function findTopicById(topicId: string) {
  for (const unit of CURRICULUM) {
    const topic = unit.topics.find((t) => t.id === topicId);
    if (topic) return { unit, topic };
  }
  return { unit: CURRICULUM[0], topic: CURRICULUM[0].topics[0] };
}

export function getTopicRequiredTests(topic: TopicData): TopicTest[] {
  return topic.tests.filter((t) => !t.isExtra).sort((a, b) => a.order - b.order);
}

export function getTopicExtraTests(topic: TopicData): TopicTest[] {
  return topic.tests.filter((t) => t.isExtra).sort((a, b) => a.order - b.order);
}

export function getAllTests(): { unit: UnitData; topic: TopicData; test: TopicTest }[] {
  const list: { unit: UnitData; topic: TopicData; test: TopicTest }[] = [];
  for (const unit of CURRICULUM) {
    for (const topic of unit.topics) {
      for (const test of topic.tests) {
        list.push({ unit, topic, test });
      }
    }
  }
  return list;
}

export function findTestById(testId: string): {
  unit: UnitData;
  topic: TopicData;
  test: TopicTest;
} | null {
  for (const unit of CURRICULUM) {
    for (const topic of unit.topics) {
      const test = topic.tests.find((t) => t.id === testId);
      if (test) return { unit, topic, test };
    }
  }
  return null;
}
