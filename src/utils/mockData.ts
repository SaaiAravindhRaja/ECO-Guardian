// Mock data placeholders for the MVP. Replace with Firebase and API integrations later.

export interface MockCreature {
  id: string;
  name: string;
  description: string;
  image: string; // URL or local require later
}

export interface MockUser {
  username: string;
  points: number;
  streak: number;
  avatar?: string;
}

export const mockCreatures: MockCreature[] = [
  {
    id: 'sg-001',
    name: 'Greenie Merli',
    description: 'Born from the lush parks of Singapore, loves clean energy.',
    image: 'https://placehold.co/200x200?text=Creature',
  },
  {
    id: 'sg-002',
    name: 'Sparkie Lion',
    description: 'Roars when recycling bins are full. Champion of zero waste.',
    image: 'https://placehold.co/200x200?text=Creature',
  },
  {
    id: 'sg-003',
    name: 'Drippy Otter',
    description: 'Protects waterways and loves ABC Waters sites.',
    image: 'https://placehold.co/200x200?text=Creature',
  },
];

export const mockUser: MockUser = {
  username: 'EcoExplorerSG',
  points: 1240,
  streak: 5,
  avatar: 'https://placehold.co/100x100?text=Avatar',
};


