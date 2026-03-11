import Link from "next/link";
import { DeckOfTheDay } from "./components/DeckOfTheDay";
import { CardRail } from "./components/ui/CardRail";

// Cartes visuellement marquantes pour les backgrounds et marquises
const BEAUTIFUL_CARDS = [
  {
    id: "OGN-66",
    name: "Ahri, Alluring",
    url: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/fabbcc2f83f397cf07299236a702db05a151053b-744x1039.png",
  },
  {
    id: "OGN-41",
    name: "Volibear, Furious",
    url: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/c9165d49b8caae9a856433cd5151e8b368eb80b5-744x1039.png",
  },
  {
    id: "OGN-39",
    name: "Kai'Sa, Survivor",
    url: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/ad69bde670ce218adee1d2a618a7295d2fb7bd4c-744x1039.png",
  },
  {
    id: "OGN-30",
    name: "Jinx, Demolitionist",
    url: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/d6cac988aa7798945e550eba6841d3993868c4a4-744x1039.png",
  },
  {
    id: "OGN-27",
    name: "Darius, Trifarian",
    url: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/bf7a4900fd2296972c1305a4707c23860bb0522e-744x1039.png",
  },
  {
    id: "OGN-73",
    name: "Sona, Harmonious",
    url: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/8582f6430821fb912fcb3619c5ce9405f254cb2f-744x1039.png",
  },
  {
    id: "OGN-1",
    name: "Blazing Scorcher",
    url: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/15ed971e4029a92b362a81ccadf309fb81e40b81-744x1039.png",
  },
  {
    id: "OGN-13",
    name: "Pouty Poro",
    url: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/d541bf3bcb5aa3ad0d48d87f5753569b72ac426f-744x1039.png",
  },
  {
    id: "IRE-1",
    name: "Irelia",
    url: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/656ef2d1724b818e9e737ec5dcce923de067a316-744x1039.png",
  },
  {
    id: "SIV-1",
    name: "Sivir",
    url: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/fd060882c32a8deac04aea4241c6ab7b97236a05-744x1039.png",
  },
  {
    id: "SFD-1",
    name: "Spiritforged 1",
    url: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/bc254398dfb5db217327b56862011a2fd6020789-744x1039.png",
  },
  {
    id: "SFD-2",
    name: "Spiritforged 2",
    url: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/26ab126258a15afd380c313e973f7469808ce55f-744x1039.png",
  },

  // Duplicats assumés pour densifier le défilement avec les plus belles cartes
  {
    id: "AHRI-ALT",
    name: "Ahri, Alluring",
    url: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/fabbcc2f83f397cf07299236a702db05a151053b-744x1039.png",
  },
  {
    id: "KAISA-ALT",
    name: "Kai'Sa, Survivor",
    url: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/ad69bde670ce218adee1d2a618a7295d2fb7bd4c-744x1039.png",
  },
  {
    id: "DARIUS-ALT",
    name: "Darius, Trifarian",
    url: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/bf7a4900fd2296972c1305a4707c23860bb0522e-744x1039.png",
  },
  {
    id: "IRELIA-ALT",
    name: "Blade Dancer",
    url: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/656ef2d1724b818e9e737ec5dcce923de067a316-744x1039.png",
  },
  // Ajouts (alternatives & showcases)
  { id: "SFD-20", name: "Draven, Vanquisher", url: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/8fa3f1fe63392c4744152d98ff781497a4d17b74-744x1039.png" },
  { id: "SFD-20a", name: "Draven, Vanquisher (Showcase)", url: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/9019c449004f246de6607bf1829f4f3cabcda200-744x1039.png" },
  { id: "OGN-299", name: "Daughter of the Void (Showcase)", url: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/ae8e68af43400f61f7391c0a6ee339fd718a7540-1488x2078.png" },
  { id: "OGN-300", name: "Relentless Storm (Showcase)", url: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/34aa11c88735be28266dbc61486a557454fd6b4c-1488x2078.png" },
  { id: "OGN-301", name: "Loose Cannon (Showcase)", url: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/30bed82f66ce9e4eae260d029d92c9d8cb1588ab-1488x2078.png" },
  { id: "OGN-306", name: "Radiant Dawn (Showcase)", url: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/496d173b74d036a9e28ca1b4383551be0148f13d-1488x2078.png" },
  { id: "OGN-76", name: "Yasuo, Remorseful", url: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/3f2cff3ff3b146c8bfe11594e37e9d8109884273-744x1039.png" },
  { id: "OGN-117", name: "Viktor, Innovator", url: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/12dfa6b38edc9b23f216c0a1828474f7506d49c0-744x1039.png" },
  { id: "OGN-121", name: "Teemo, Strategist", url: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/0709ab02b75d9acc8f3c4037ec3a4140323150d8-744x1039.png" },
  { id: "OGN-110", name: "Ekko, Recurrent", url: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/65da19325b6def53d33c07bc1aa8f91fd2f1e723-744x1039.png" },
  { id: "OGN-111", name: "Heimerdinger, Inventor", url: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/5b14a5f9d567c90329c151a8cc72d870b47b1434-744x1039.png" },
  { id: "OGN-74", name: "Taric, Protector", url: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/7d08e3f64401cb87b8a0564a1cbe6fc94aee03a7-744x1039.png" },
];

const META_CHAMPS = [
  {
    name: "DRAVEN",
    tier: "S+",
    domain: "Fury",
    rules: "Aggro dominant : génération de haches, tempo et finish explosifs.",
    img: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/8fa3f1fe63392c4744152d98ff781497a4d17b74-744x1039.png",
    href: "/legends/SFD-185?utm_source=home&utm_medium=meta-cards&utm_campaign=push-guides",
  },
  {
    name: "IRELIA",
    tier: "S",
    domain: "Order",
    rules: "Inonde le board de lames spirituelles et impose le tempo.",
    img: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/656ef2d1724b818e9e737ec5dcce923de067a316-744x1039.png",
    href: "/legends/SFD-195?utm_source=home&utm_medium=meta-cards&utm_campaign=push-guides",
  },
  {
    name: "SIVIR",
    tier: "S-",
    domain: "Body",
    rules: "Maîtresse des armes et des équipements, très solide en value.",
    img: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/fd060882c32a8deac04aea4241c6ab7b97236a05-744x1039.png",
    href: "/legends/SFD-203?utm_source=home&utm_medium=meta-cards&utm_campaign=push-guides",
  },
];

const FEATURES = [
  {
    title: "BASE DE DONNÉES",
    text: "Chaque variante, chaque artiste, chaque rareté. L'archive exhaustive.",
    icon: "📚",
    link: "/cards",
  },
  {
    title: "CONSTRUCTEUR",
    text: "L'outil indispensable pour peaufiner vos courbes et vos synergies.",
    icon: "⚒️",
    link: "/deckbuilder",
  },
  {
    title: "ACADÉMIE",
    text: "Apprenez des meilleurs. Stratégies de tournois et guides de légendes.",
    icon: "🎓",
    link: "/legends",
  },
];

export default function Home() {
  const topCards = BEAUTIFUL_CARDS.slice(0, 10);
  const middleCards = BEAUTIFUL_CARDS.slice(4);
  const bottomCards = BEAUTIFUL_CARDS.slice().reverse();

  return (
    <div className="min-h-screen bg-background text-white selection:bg-rift-gold selection:text-black font-sans">
      {/* ── HERO SECTION ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/20 to-background z-10" />
          <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(8,8,12,0.97)_100%)]" />

          <div className="flex flex-col gap-8 md:gap-10 opacity-70 scale-110">
            <CardRail
              cards={topCards}
              cardClassName="w-52 md:w-[300px] lg:w-[420px] rounded-[38px] shadow-[var(--shadow-2xl)]"
              imageClassName="brightness-110 contrast-110"
            />
            <CardRail
              cards={middleCards}
              reverse
              cardClassName="w-44 md:w-[240px] lg:w-[340px] rounded-[30px] shadow-[var(--shadow-xl)]"
              imageClassName="brightness-105 contrast-105"
              className="opacity-80"
            />
            <CardRail
              cards={bottomCards}
              cardClassName="w-52 md:w-[300px] lg:w-[420px] rounded-[38px] shadow-[var(--shadow-2xl)]"
              imageClassName="brightness-110 contrast-110"
            />
          </div>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto text-center px-6 pt-20">
          {/* Floating clickable showcase cards */}
          <div className="hidden md:block absolute right-6 top-24 z-10">
            <div className="relative w-[220px] h-[360px]">
              <Link href="/legends/SFD-185?utm_source=home&utm_medium=hero-float&utm_campaign=push-guides" title="Guide Draven">
                <img
                  src="https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/8fa3f1fe63392c4744152d98ff781497a4d17b74-744x1039.png"
                  alt="Draven, Vanquisher"
                  className="absolute -rotate-6 right-0 top-0 w-[200px] rounded-[28px] shadow-[var(--shadow-2xl)] border border-[var(--border-default)] hover:rotate-0 transition-transform duration-700"
                  loading="lazy"
                  decoding="async"
                />
              </Link>
              <Link href="/legends/SFD-195?utm_source=home&utm_medium=hero-float&utm_campaign=push-guides" title="Guide Irelia">
                <img
                  src="https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/656ef2d1724b818e9e737ec5dcce923de067a316-744x1039.png"
                  alt="Blade Dancer"
                  className="absolute rotate-6 right-20 top-20 w-[180px] rounded-[24px] shadow-[var(--shadow-2xl)] border border-[var(--border-default)] hover:rotate-0 transition-transform duration-700"
                  loading="lazy"
                  decoding="async"
                />
              </Link>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-6 md:px-8 py-2.5 mb-10 md:mb-12 rounded-full bg-[var(--border-subtle)] border border-[var(--border-default)] backdrop-blur-3xl animate-in fade-in slide-in-from-top-4 duration-1000">
            <span className="text-[10px] font-black tracking-[0.4em] text-rift-gold uppercase">
              La référence Riftbound en France
            </span>
          </div>

          <h1 className="text-6xl sm:text-7xl md:text-[160px] font-black mb-8 md:mb-12 leading-[0.82] tracking-tighter animate-in fade-in slide-in-from-bottom-4 duration-1000">
            ÉCRIVEZ VOTRE <br />
            <span className="bg-gradient-to-r from-rift-blue via-white to-rift-gold bg-clip-text text-transparent italic px-2 md:px-4">
              LÉGENDE
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-4xl text-[var(--text-secondary)] mb-14 md:mb-20 max-w-5xl mx-auto font-medium leading-tight animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200 opacity-90 tracking-tight">
            Construisez vos decks, analysez la méta et maîtrisez Riftbound.
            <br />
            La plateforme compétitive ultime pour les joueurs.
          </p>

          <div className="flex flex-wrap gap-5 md:gap-8 justify-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <Link
              href="/deckbuilder?utm_source=home&utm_medium=hero-cta&utm_campaign=builder"
              className="group px-8 md:px-14 py-5 md:py-8 bg-[var(--border-subtle)] border-2 border-[var(--border-default)] text-white font-black rounded-[28px] md:rounded-[32px] backdrop-blur-3xl hover:bg-[var(--border-default)] hover:border-rift-gold/50 transition-all hover:scale-105 active:scale-95 shadow-[var(--shadow-2xl)] uppercase text-sm md:text-lg tracking-[0.1em]"
            >
              <span className="group-hover:text-rift-gold transition-colors">Deck Builder</span>
            </Link>

            <Link
              href="/legends?utm_source=home&utm_medium=hero-cta&utm_campaign=guides"
              className="group px-8 md:px-14 py-5 md:py-8 bg-gradient-to-br from-rift-purple/20 to-rift-blue/20 border-2 border-[var(--border-subtle)] text-white font-black rounded-[28px] md:rounded-[32px] backdrop-blur-3xl hover:border-[var(--border-default)] transition-all hover:scale-105 active:scale-95 shadow-[var(--shadow-2xl)] uppercase text-sm md:text-lg tracking-[0.1em]"
            >
              <span className="flex items-center gap-4">Guides 📖</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── SEO EDITORIAL BLOCK ── */}
      <section className="px-6 py-16 md:py-24 bg-background">
        <div className="max-w-5xl mx-auto text-center md:text-left">
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight mb-4">Guides Riftbound, Deck Builder et Bibliothèque de decks</h2>
          <p className="text-[var(--text-secondary)] text-base md:text-lg leading-relaxed">
            Riftbound Guide est votre référence francophone pour{" "}
            <Link href="/legends?utm_source=home&utm_medium=seo-block&utm_campaign=guides" className="text-rift-gold hover:underline">les guides de légendes</Link>,
            un{" "}
            <Link href="/deckbuilder?utm_source=home&utm_medium=seo-block&utm_campaign=builder" className="text-rift-gold hover:underline">constructeur de decks</Link>{" "}
            complet, et une{" "}
            <Link href="/decks?utm_source=home&utm_medium=seo-block&utm_campaign=decks" className="text-rift-gold hover:underline">bibliothèque de decks</Link>{" "}
            mise à jour. Retrouvez chaque carte, variantes et règles, et perfectionnez vos decks pour la compétition.
          </p>
        </div>
      </section>

      {/* ── MÉTA SNAPSHOT ── */}
      <section className="py-28 md:py-48 px-6 bg-[#0d0e1a] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
          <CardRail
            cards={BEAUTIFUL_CARDS}
            cardClassName="w-44 md:w-64 rounded-2xl"
            className="rotate-12 -translate-y-1/2"
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 md:mb-24 gap-10">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
                <div className="w-12 h-1 bg-rift-red rounded-full" />
                <span className="text-xs font-black tracking-[0.4em] text-rift-red uppercase">
                  Classement officiel
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6 md:mb-8">
                LA MÉTA <span className="text-rift-red italic">ACTUELLE</span>
              </h2>
              <p className="text-[var(--text-secondary)] text-lg md:text-2xl font-medium max-w-xl">
                Les légendes qui dominent les compétitions 3 étoiles.
              </p>
            </div>

            <Link
              href="/decks"
              className="px-8 md:px-12 py-4 md:py-6 rounded-[20px] md:rounded-[24px] bg-rift-red text-white font-black text-xs md:text-sm uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-[0_25px_50px_rgba(244,63,94,0.4)]"
            >
              Voir la bibliothèque
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {META_CHAMPS.map((champ, i) => (
              <Link
                href="/decks"
                key={i}
                className="group relative rounded-[36px] md:rounded-[64px] overflow-hidden bg-black aspect-[3/4.5] border border-[var(--border-subtle)] shadow-[var(--shadow-2xl)]"
                title={`${champ.name} — ${champ.tier}`}
              >
                <img
                  src={champ.img}
                  alt={champ.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

                <div className="absolute top-7 md:top-12 left-7 md:left-12 flex flex-col gap-3 md:gap-4">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-red-600 rounded-3xl flex items-center justify-center text-xl md:text-2xl font-black shadow-[0_0_30px_rgba(220,38,38,0.5)]">
                    {champ.tier}
                  </div>
                  <span className="px-4 md:px-5 py-1.5 bg-black/60 backdrop-blur-xl rounded-full text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest border border-[var(--border-default)]">
                    {champ.domain}
                  </span>
                </div>

                <div className="absolute bottom-8 md:bottom-16 left-7 md:left-12 right-7 md:right-12 translate-y-3 md:translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-4xl md:text-6xl font-black mb-3 md:mb-4 tracking-tighter italic leading-none">
                    {champ.name}
                  </h3>
                  <p className="text-[var(--text-secondary)] text-base md:text-lg font-medium mb-6 md:mb-10 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 leading-snug">
                    {champ.rules}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CARD WALL SCROLL ── */}
      <div className="py-20 md:py-32 overflow-hidden bg-background">
        <CardRail
          cards={BEAUTIFUL_CARDS}
          cardClassName="w-56 md:w-80 rounded-3xl border-[var(--border-subtle)]"
          className="opacity-40"
        />
      </div>

      {/* ── SPIRITFORGED SHOWCASE ── */}
      <section className="py-28 md:py-48 px-6 relative overflow-hidden bg-[#0a0a0c]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] md:w-[1400px] h-[900px] md:h-[1400px] bg-rift-purple/10 rounded-full blur-[180px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 md:gap-40 items-center relative z-10">
          <div className="order-2 lg:order-1">
            <div className="flex items-center gap-4 mb-8 md:mb-12">
              <div className="w-16 md:w-20 h-1 bg-rift-purple rounded-full" />
              <span className="text-xs font-black tracking-[0.4em] md:tracking-[0.6em] text-rift-purple uppercase">
                Mise à jour principale
              </span>
            </div>

            <h2 className="text-5xl sm:text-6xl md:text-[120px] font-black mb-8 md:mb-12 tracking-tighter uppercase leading-[0.82]">
              SPIRIT
              <br />
              <span className="text-white italic">FORGED</span>
            </h2>

            <p className="text-xl md:text-3xl text-[var(--text-secondary)] font-medium leading-relaxed mb-12 md:mb-20 max-w-xl">
              Plus de 220 cartes rejoignent le combat. Maîtrisez les Armes Spirituelles.
            </p>

            <div className="flex flex-wrap gap-6 md:gap-10">
              <Link
                href="/cards?set=SFD"
                className="px-8 md:px-14 py-5 md:py-7 bg-rift-purple text-white font-black rounded-[24px] md:rounded-[32px] shadow-[0_30px_60px_rgba(168,85,247,0.4)] hover:scale-105 transition-all uppercase text-xs md:text-sm tracking-widest"
              >
                Explorer l&apos;Extension
              </Link>
            </div>
          </div>

          <div className="order-1 lg:order-2 flex justify-center md:scale-125">
            <div className="relative group">
              <div className="absolute inset-0 bg-rift-purple/30 blur-[120px] rounded-full scale-150" />
              <img
                src="https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/bc254398dfb5db217327b56862011a2fd6020789-744x1039.png"
                className="relative z-10 w-[280px] md:w-[450px] rounded-[34px] md:rounded-[56px] shadow-[var(--shadow-2xl)] border border-[var(--border-default)] transform -rotate-6 group-hover:rotate-0 transition-transform duration-1000"
                alt="Spiritforged Card"
                loading="lazy"
                decoding="async"
              />
              <img
                src="https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/26ab126258a15afd380c313e973f7469808ce55f-744x1039.png"
                className="absolute -bottom-10 md:-bottom-24 -right-8 md:-right-24 z-20 w-[220px] md:w-[350px] rounded-[28px] md:rounded-[48px] shadow-[var(--shadow-2xl)] border border-[var(--border-default)] transform rotate-12 group-hover:rotate-0 transition-transform duration-1000 delay-150"
                alt="Spiritforged Card 2"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── TOOLS GRID ── */}
      <section className="py-28 md:py-48 px-6 bg-background border-y border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8 md:gap-16">
            {FEATURES.map((feature, i) => (
              <Link
                href={feature.link}
                key={i}
                className="group relative p-10 md:p-20 rounded-[36px] md:rounded-[80px] bg-[var(--border-subtle)] border border-[var(--border-default)] hover:bg-[var(--border-default)] transition-all duration-700 hover:-translate-y-4 flex flex-col items-center text-center shadow-[var(--shadow-2xl)]"
              >
                <div className="text-6xl md:text-8xl mb-8 md:mb-12 group-hover:scale-110 transition-transform duration-700">
                  {feature.icon}
                </div>
                <h3 className="text-2xl md:text-4xl font-black mb-5 md:mb-8 tracking-[0.2em] uppercase">
                  {feature.title}
                </h3>
                <p className="text-[var(--text-secondary)] text-base md:text-xl leading-relaxed font-medium mb-8 md:mb-12 opacity-70 group-hover:opacity-100 transition-opacity">
                  {feature.text}
                </p>
                <div className="mt-auto px-8 md:px-10 py-3 md:py-4 bg-[var(--border-default)] rounded-2xl text-[10px] md:text-xs font-black text-rift-blue uppercase tracking-widest opacity-100 md:opacity-0 group-hover:opacity-100 transition-all">
                  Ouvrir →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── DECK OF THE DAY ── */}
      <DeckOfTheDay />

      {/* ── FOOTER ── */}
      <footer className="py-24 md:py-40 px-6 bg-[var(--surface-0)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-16 md:gap-32 mb-20 md:mb-40">
            <div className="max-w-md">
              <div className="flex items-center gap-6 mb-10 md:mb-16">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-[24px] md:rounded-[28px] bg-gradient-to-br from-rift-blue to-rift-purple flex items-center justify-center shadow-[var(--glow-blue)]">
                  <span className="text-4xl md:text-5xl font-black text-white italic">R</span>
                </div>
                <span className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic">
                  RIFTBOUND
                </span>
              </div>

              <p className="text-[var(--text-tertiary)] font-medium leading-relaxed text-base md:text-lg mb-10 md:mb-16 opacity-60">
                L&apos;archive suprême. Par les joueurs, pour les joueurs.
              </p>

              <div className="flex gap-6 md:gap-10">
                <a
                  href="#"
                  className="w-14 h-14 md:w-16 md:h-16 rounded-3xl bg-[var(--border-subtle)] flex items-center justify-center hover:bg-[var(--border-default)] transition-all text-[var(--text-secondary)] hover:text-white border border-[var(--border-subtle)] shadow-[var(--shadow-lg)]"
                >
                  <svg className="w-7 h-7 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-1.017-2.178-1.652-3.594-1.652-2.719 0-4.923 2.204-4.923 4.923 0 .386.044.762.128 1.123-4.092-.205-7.719-2.165-10.148-5.144-.424.73-.667 1.578-.667 2.476 0 1.708 1.017 3.215 2.562 4.246-.944-.03-1.832-.289-2.608-.72v.062c0 2.385 1.697 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.317 0-.626-.03-.927-.086.627 1.956 2.444 3.379 4.6 3.419-1.684 1.32-3.812 2.105-6.12 2.105-.397 0-.79-.023-1.175-.067 2.179 1.396 4.768 2.212 7.548 2.212 9.057 0 13.996-7.496 13.996-13.986 0-.213-.005-.426-.014-.637.961-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-14 h-14 md:w-16 md:h-16 rounded-3xl bg-[var(--border-subtle)] flex items-center justify-center hover:bg-[var(--border-default)] transition-all text-[var(--text-secondary)] hover:text-white border border-[var(--border-subtle)] shadow-[var(--shadow-lg)]"
                >
                  <svg className="w-7 h-7 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 4.438 9.8 10.64 10.728.6.113.82-.258.82-.577 0-.285-.022-1.04-.032-2.042-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.517-1.303.958-1.602-2.665-.305-5.467-1.332-5.467-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.362.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-24">
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-[0.4em] md:tracking-[0.6em] mb-8 md:mb-12 opacity-40">
                  Navigation
                </h4>
                <ul className="space-y-5 md:space-y-8 text-sm md:text-base font-black text-[var(--text-tertiary)] uppercase tracking-widest">
                  <li><Link href="/rules" className="hover:text-rift-gold transition-all hover:translate-x-3 inline-block">Règles</Link></li>
                  <li><Link href="/cards" className="hover:text-rift-gold transition-all hover:translate-x-3 inline-block">Base de données</Link></li>
                  <li><Link href="/legends" className="hover:text-rift-gold transition-all hover:translate-x-3 inline-block">Légendes</Link></li>
                  <li><Link href="/decks" className="hover:text-rift-gold transition-all hover:translate-x-3 inline-block">Bibliothèque</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-[0.4em] md:tracking-[0.6em] mb-8 md:mb-12 opacity-40">
                  Laboratoire
                </h4>
                <ul className="space-y-5 md:space-y-8 text-sm md:text-base font-black text-[var(--text-tertiary)] uppercase tracking-widest">
                  <li><Link href="/deckbuilder" className="hover:text-rift-gold transition-all hover:translate-x-3 inline-block">Constructeur</Link></li>
                  <li><Link href="/decks" className="hover:text-rift-gold transition-all hover:translate-x-3 inline-block">Collection</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-[0.4em] md:tracking-[0.6em] mb-8 md:mb-12 opacity-40">
                  Légal
                </h4>
                <ul className="space-y-5 md:space-y-8 text-sm md:text-base font-black text-[var(--text-tertiary)] uppercase tracking-widest">
                  <li><Link href="/privacy" className="hover:text-rift-gold transition-all hover:translate-x-3 inline-block">Confidentialité</Link></li>
                  <li><Link href="/terms" className="hover:text-rift-gold transition-all hover:translate-x-3 inline-block">Conditions</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-12 md:pt-24 border-t border-[var(--border-subtle)] flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12">
            <p className="text-[10px] md:text-xs font-bold text-[var(--text-disabled)] uppercase tracking-[0.3em] md:tracking-[0.4em]">
              © 2026 RIFTBOUND COMMUNITY.
            </p>
            <p className="text-[9px] md:text-[10px] font-bold text-[var(--text-disabled)] uppercase tracking-[0.2em] md:tracking-[0.3em] text-center md:text-right max-w-2xl leading-loose opacity-40">
              RIFTBOUND ET LEAGUE OF LEGENDS SONT DES MARQUES DÉPOSÉES DE RIOT GAMES, INC.
              CE PROJET EST INDÉPENDANT ET CRÉÉ PAR DES FANS POUR LA COMMUNAUTÉ.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
