import React from 'react';
import type { FinanceSummary, CostsReturns, ScheduleInfo } from './FinancesTab';

// Define the expected props for the SummaryCards component
type Props = {
  summary: FinanceSummary;
  costs: CostsReturns;
  schedule: ScheduleInfo;
};

// Reusable Card component for displaying grouped information
function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-fraction-gray-280 bg-white p-5 shadow-sm">
      {/* Card title */}
      <h4 className="mb-3 text-[15px] font-semibold text-fraction-gray-500">
        {title}
      </h4>
      {/* Card content */}
      <div className="space-y-1.5 text-[13px] text-fraction-gray-500">
        {children}
      </div>
    </div>
  );
}

// Main component that displays summary information in three cards
export default function SummaryCards({ summary, costs, schedule }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* Investment Overview card */}
      <Card title="Investment Overview">
        <p>
          <span className="text-fraction-gray-500">Total Property Price:</span>{' '}
          <span className="font-medium text-fraction-gray-500">
            {summary.totalPrice}
          </span>
        </p>
        <p>
          <span className="text-fraction-gray-500">Minimum Investment:</span>{' '}
          <span className="font-medium text-fraction-gray-500">
            {summary.minInvestment}
          </span>
        </p>
        <p>
          <span className="text-fraction-gray-500">
            Total Available Shares:
          </span>{' '}
          <span className="font-medium text-fraction-gray-500">
            {summary.totalShares}
          </span>
        </p>
      </Card>

      {/* Costs & Returns card */}
      <Card title="Costs & Returns">
        <p>
          <span className="text-fraction-gray-500">
            Annual Management Fees:
          </span>{' '}
          <span className="font-medium text-fraction-gray-500">
            {costs.mgmtFees}
          </span>
        </p>
        <p>
          <span className="text-fraction-gray-500">
            Estimated Annual Property Maintenance Costs:
          </span>{' '}
          <span className="font-medium text-fraction-gray-500">
            {costs.maintenanceCost}
          </span>
        </p>
        <p>
          <span className="text-fraction-gray-500">
            Holding Period Recommendation:
          </span>{' '}
          <span className="font-medium text-fraction-gray-500">
            {costs.holdingPeriod}
          </span>
        </p>
      </Card>

      {/* Schedule card */}
      <Card title="Schedule">
        <p>
          <span className="text-fraction-gray-500">Subscription Schedule:</span>{' '}
          <span className="font-medium text-fraction-gray-500">
            {schedule.subscriptionSchedule}
          </span>
        </p>
        <p>
          <span className="text-fraction-gray-500">Payment Schedule:</span>{' '}
          <span className="font-medium text-fraction-gray-500">
            {schedule.paymentSchedule}
          </span>
        </p>
        <p>
          <span className="text-fraction-gray-500">Target term:</span>{' '}
          <span className="font-medium text-fraction-gray-500">
            {schedule.targetTerm}
          </span>
        </p>
      </Card>
    </div>
  );
}
