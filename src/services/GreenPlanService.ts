import { CreatureType, GreenPlanTarget } from '@/types';

export class GreenPlanService {
  private backstories: Record<CreatureType, string> = {
    greenie: 'Born from the lush gardens of Singapore, Greenie embodies the spirit of urban nature and biodiversity.',
    sparkie: 'Energized by clean electricity, Sparkie represents Singapore\'s commitment to renewable energy.',
    binities: 'A champion of waste reduction, Binities transforms recycling into a joyful adventure.',
    drippies: 'Guardian of Singapore\'s precious water resources, Drippies ensures every drop counts.',
  } as any;

  validateTarget(target: GreenPlanTarget): boolean {
    return Object.values(GreenPlanTarget).includes(target);
  }

  getBackstory(type: CreatureType): string {
    return this.backstories[type] || 'A mysterious creature tied to Singapore\'s green future.';
  }

  mapTargetToEducation(target: GreenPlanTarget): string {
    const map: Record<GreenPlanTarget, string> = {
      [GreenPlanTarget.CITY_IN_NATURE]: 'Expanding nature parks and biodiversity corridors across Singapore.',
      [GreenPlanTarget.ENERGY_RESET]: 'Accelerating clean energy adoption and electrification of transport.',
      [GreenPlanTarget.SUSTAINABLE_LIVING]: 'Reducing waste and promoting a circular economy culture.',
      [GreenPlanTarget.GREEN_ECONOMY]: 'Creating green jobs and fostering a sustainable economy.',
      [GreenPlanTarget.RESILIENT_FUTURE]: 'Strengthening climate resilience and water sustainability.',
    };
    return map[target];
  }
}


