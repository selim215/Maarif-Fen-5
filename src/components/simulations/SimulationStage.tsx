import React from 'react';
import { SimulationType } from '../../types';
import { MoonPhasesSim, SunEarthMoonSim, SunSpotsSim } from './Unit1Simulations';
import { DynamometerSim, FrictionLabSim, MassWeightSim } from './Unit2Simulations';
import { CellExplorerSim, CellToOrganismSim, SkeletonMotionSim } from './Unit3Simulations';
import { LightRaysSim, LightTransparencySim, ShadowLabSim } from './Unit4Simulations';
import {
  HeatExchangeSim,
  HeatInsulationSim,
  ParticleStatesSim,
  PhaseChangeSim,
} from './Unit5Simulations';
import { BulbBrightnessSim, CircuitSymbolsSim } from './Unit6Simulations';
import { WasteSortingSim, ZeroWasteHierarchySim } from './Unit7Simulations';

interface SimulationStageProps {
  simType: SimulationType;
  onComplete: () => void;
  isCompleted: boolean;
}

export const SimulationStage: React.FC<SimulationStageProps> = ({
  simType,
  onComplete,
  isCompleted,
}) => {
  switch (simType) {
    case 'sun-spots':
      return <SunSpotsSim onComplete={onComplete} isCompleted={isCompleted} />;
    case 'moon-phases':
      return <MoonPhasesSim onComplete={onComplete} isCompleted={isCompleted} />;
    case 'sun-earth-moon':
      return <SunEarthMoonSim onComplete={onComplete} isCompleted={isCompleted} />;
    case 'dynamometer':
      return <DynamometerSim onComplete={onComplete} isCompleted={isCompleted} />;
    case 'mass-weight':
      return <MassWeightSim onComplete={onComplete} isCompleted={isCompleted} />;
    case 'friction-lab':
      return <FrictionLabSim onComplete={onComplete} isCompleted={isCompleted} />;
    case 'cell-explorer':
      return <CellExplorerSim onComplete={onComplete} isCompleted={isCompleted} />;
    case 'cell-to-organism':
      return <CellToOrganismSim onComplete={onComplete} isCompleted={isCompleted} />;
    case 'skeleton-motion':
      return <SkeletonMotionSim onComplete={onComplete} isCompleted={isCompleted} />;
    case 'light-rays':
      return <LightRaysSim onComplete={onComplete} isCompleted={isCompleted} />;
    case 'light-transparency':
      return <LightTransparencySim onComplete={onComplete} isCompleted={isCompleted} />;
    case 'shadow-lab':
      return <ShadowLabSim onComplete={onComplete} isCompleted={isCompleted} />;
    case 'particle-states':
      return <ParticleStatesSim onComplete={onComplete} isCompleted={isCompleted} />;
    case 'heat-exchange':
      return <HeatExchangeSim onComplete={onComplete} isCompleted={isCompleted} />;
    case 'phase-change':
      return <PhaseChangeSim onComplete={onComplete} isCompleted={isCompleted} />;
    case 'heat-insulation':
      return <HeatInsulationSim onComplete={onComplete} isCompleted={isCompleted} />;
    case 'circuit-symbols':
      return <CircuitSymbolsSim onComplete={onComplete} isCompleted={isCompleted} />;
    case 'bulb-brightness':
      return <BulbBrightnessSim onComplete={onComplete} isCompleted={isCompleted} />;
    case 'waste-sorting':
      return <WasteSortingSim onComplete={onComplete} isCompleted={isCompleted} />;
    case 'zero-waste-hierarchy':
      return <ZeroWasteHierarchySim onComplete={onComplete} isCompleted={isCompleted} />;
    default:
      return null;
  }
};
