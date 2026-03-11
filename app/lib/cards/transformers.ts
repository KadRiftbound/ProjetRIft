import type { RiftboundCard } from './schema';
import { getCardImages } from '../card-utils';

export function transformCardToView(card: RiftboundCard) {
  const variantImageUrl = card.variants && card.variants.length > 0
    ? card.variants[0].imageUrl
    : getCardImages(card.number.toString(), card.set).medium;

  const transformedVariants = card.variants?.map(v => ({
    id: v.id,
    name: v.name,
    imageUrl: v.imageUrl,
    variantType: (v.variantType as 'regular' | 'alternate' | 'foil' | 'signature') || 'regular',
  })) || [];

  return {
    id: card.id,
    name: card.name,
    number: card.number.toString(),
    domain: card.domain,
    type: card.type,
    rarity: card.rarity,
    rules: card.rules,
    images: [
      {
        type: 'front',
        small: variantImageUrl,
        medium: variantImageUrl,
        large: variantImageUrl,
      },
    ],
    expansion: {
      id: card.set,
      name: card.setName,
    },
    energy: card.energy,
    might: card.might,
    power: card.power,
    variants: transformedVariants,
  };
}
