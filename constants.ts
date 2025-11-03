
import { Tour } from './types';

export const TOURS: Tour[] = [
  {
    id: 'impressionism_101',
    title: 'A Journey into Impressionism',
    description: 'Discover the revolutionary artists who captured light and movement, changing the course of art history.',
    artworks: [
      {
        title: 'Impression, soleil levant',
        story: 'Start your journey with the painting that gave Impressionism its name. Look for the hazy sunrise and the quick brushstrokes.'
      },
      {
        title: 'Bal du moulin de la Galette',
        story: 'Next, immerse yourself in a lively Parisian scene. Notice how Renoir captures the fleeting joy and dappled sunlight.'
      },
      {
        title: 'The Water Lily Pond',
        story: 'Conclude your tour with Monet\'s iconic masterpiece. Reflect on how he abstracts nature into pure color and light.'
      }
    ]
  },
  {
    id: 'dutch_masters',
    title: 'The Dutch Golden Age',
    description: 'Explore the masterful use of light, detail, and realism from the 17th-century Dutch masters.',
    artworks: [
      {
        title: 'The Night Watch',
        story: 'Begin with Rembrandt\'s dramatic and energetic group portrait. It\'s a masterclass in composition and chiaroscuro.'
      },
      {
        title: 'The Milkmaid',
        story: 'Observe Vermeer\'s quiet domestic scene. The detail in the light hitting the bread and milk is extraordinary.'
      },
      {
        title: 'The Girl with a Pearl Earring',
        story: 'End with the enigmatic gaze of this famous tronie. Who is she? What is she thinking? The mystery is part of its charm.'
      }
    ]
  }
];
