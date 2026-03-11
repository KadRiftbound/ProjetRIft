import Link from 'next/link';

const LEGEND_LINK_IDS = new Set([
  "SFD-185",
  "SFD-195",
  "SFD-203",
  "OGN-299", "OGN-300", "OGN-301", "OGN-302", "OGN-303", "OGN-304", "OGN-305", "OGN-306", "OGN-307", "OGN-308", "OGN-309", "OGN-310",
]);

type CardRailCard = {
  id: string;
  name: string;
  url: string;
};

export function CardRail({
  cards,
  reverse = false,
  className = "",
  imageClassName = "",
  cardClassName = "",
}: {
  cards: CardRailCard[];
  reverse?: boolean;
  className?: string;
  imageClassName?: string;
  cardClassName?: string;
}) {
  const tripled = [...cards, ...cards, ...cards];

  return (
    <div
      className={`flex gap-6 ${reverse ? "animate-scroll-slow-reverse" : "animate-scroll-fast"} ${className}`}
    >
      {tripled.map((card, i) => {
        const isId = typeof card.id === 'string' && card.id.includes('-');
        const href = isId
          ? (LEGEND_LINK_IDS.has(card.id) ? `/legends/${card.id}` : `/cards/${card.id}`)
          : '/cards';
        return (
          <Link
            key={`${card.id}-${reverse ? "rev" : "fwd"}-${i}`}
            href={`${href}?utm_source=home&utm_medium=card-rail&utm_campaign=push-guides`}
            className={`flex-shrink-0 overflow-hidden border border-[var(--border-default)] ${cardClassName}`}
            title={card.name}
          >
            <img
              src={card.url}
              alt={card.name}
              loading="lazy"
              decoding="async"
              className={`w-full h-full object-cover ${imageClassName}`}
            />
          </Link>
        );
      })}
    </div>
  );
}
