import React from 'react';

// Fake API –
async function fakeFetchCard(_payload: {}): Promise<{
  name: string;
  type: string;
  price: number;
  size: number;
  situated: string;
  funded: string;
  status: string;
  remaining: number;
}> {
  await new Promise((r) => setTimeout(r, 300));
  return {
    name: 'Project name',
    type: 'Single residential',
    price: 265000,
    size: 1915,
    situated: 'Toronto, Canada',
    funded: '50% funded',
    status: 'Available',
    remaining: 265000,
  };
}

export default function InvestmentCard() {
  const [data, setData] = React.useState<Awaited<
    ReturnType<typeof fakeFetchCard>
  > | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    fakeFetchCard({})
      .then((d) => mounted && setData(d))
      .catch(() => mounted && setError('Failed to load card data'));
    return () => {
      mounted = false;
    };
  }, []);

  // Loading
  if (!data && !error) {
    return (
      <div className="h-full rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 p-6 shadow-lg animate-pulse" />
    );
  }

  // Error
  if (error) {
    return (
      <div className="h-full rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 p-6 shadow-lg">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  // Normal
  return (
    <div className="h-full rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 p-6 shadow-lg flex flex-col justify-between">
      {/* Header */}
      <div>
        <h2 className="text-4xl font-bold text-fraction-violet-500">
          {data?.name}
        </h2>
        <p className="text-base italic text-fraction-light-gray">
          {data?.type}
        </p>

        {/* List */}
        <div className="mt-4 text-sm text-fraction-super-light-gray divide-y divide-gray-200">
          <div className="flex justify-between py-2">
            <span>Purchase price</span>
            <span className="font-medium">${data?.price.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Size</span>
            <span className="font-medium">{data?.size} Sqft</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Situated</span>
            <span className="font-medium">{data?.situated}</span>
          </div>
          <div className="flex justify-end py-2 text-gray-500">
            <span>{data?.funded}</span>
          </div>
        </div>
      </div>

      {/* Status + Invest */}
      <div className="mt-6 rounded-2xl border border-white/10 bg-[#362a74] p-4 shadow-lg">
        <div className="text-sm text-fraction-gray-secondary">
          <span>Status: </span>
          <span className="font-medium text-fraction-light-green">
            {data?.status}
          </span>
        </div>

        <div className="mt-1 text-sm text-fraction-gray-secondary">
          <span>Remaining investment: </span>
          <span className="align-baseline text-2xl font-semibold tracking-tight text-white">
            ${data?.remaining.toLocaleString()}
          </span>
        </div>

        <button className="mt-4 mx-auto block w-3/4 max-w-[260px] rounded-full bg-fraction-lilac-500 px-6 py-1.5 font-medium text-white/95 hover:bg-[#a66cd3] transition">
          Invest
        </button>
      </div>
    </div>
  );
}
