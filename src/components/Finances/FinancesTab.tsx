import SummaryCards from './SummaryCards';
import StrategySection from './StrategySection';
// import ReturnsCalculator from './ReturnsCalculator';
// import ExitStrategy from './ExitStrategy';

// Types for the Finance tab props
export type FinanceSummary = {
  totalPrice: string;
  minInvestment: string;
  totalShares: string;
};

export type CostsReturns = {
  mgmtFees: string;
  maintenanceCost: string;
  holdingPeriod: string;
};

export type ScheduleInfo = {
  subscriptionSchedule: string;
  paymentSchedule: string;
  targetTerm: string;
};

// Main Finance tab component
export default function FinancesTab() {
  // Sample data (later replace with API/props)
  const summary: FinanceSummary = {
    totalPrice: '$1,200,000',
    minInvestment: '$5,000 per fraction',
    totalShares: '240 investment units available',
  };

  const costs: CostsReturns = {
    mgmtFees: '2% of investment value per year',
    maintenanceCost: '$10,000 per year',
    holdingPeriod: '5–7 years for optimal returns',
  };

  const schedule: ScheduleInfo = {
    subscriptionSchedule: 'Daily',
    paymentSchedule: 'Monthly interest',
    targetTerm: 'December 20, 2028',
  };

  const strategy = {
    type: 'Long-term appreciation with steady rental income',
    holding: '5–7 years for best returns',
    yield: '5.2% annually',
    growth: '+6.5% per year',
  };

  return (
    <section className="space-y-10">
      {/* Summary cards for investment, costs & schedule */}
      <SummaryCards summary={summary} costs={costs} schedule={schedule} />

      {/* Strategy section with expandable details */}
      <StrategySection
        headingsLabel="Investment Strategy for This Property"
        items={[
          { label: 'Type of Investment', value: strategy.type },
          { label: 'Recommended Holding Period', value: strategy.holding },
          { label: 'Projected Rental Yield', value: strategy.yield },
          { label: 'Expected Market Growth', value: strategy.growth },
        ]}
      />
    </section>
  );
}
