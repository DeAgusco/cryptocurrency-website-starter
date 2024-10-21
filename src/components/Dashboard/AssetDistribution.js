import React from 'react';
import { Pie } from 'react-chartjs-2';

const AssetDistribution = ({ walletData }) => {
  const prepareAssetDistributionData = () => {
    if (!walletData || !walletData.other_wallet_balances) {
      return {
        labels: ['No Data'],
        datasets: [{
          data: [1],
          backgroundColor: ['#cccccc'],
          borderColor: ['#ffffff'],
        }]
      };
    }

    const labels = Object.keys(walletData.other_wallet_balances);
    const data = Object.values(walletData.other_wallet_balances).map(balance => Number(balance));

    return {
      labels,
      datasets: [{
        data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: 'white'
        }
      }
    }
  };

  const assetDistributionData = prepareAssetDistributionData();

  return (
    <div className="mt-8 relative backdrop-blur-md bg-darkblue/30 p-8 rounded-lg shadow-lg border border-white/20 z-10 h-96">
      <div className="relative z-10">
        <h2 className="text-xl font-semibold mb-4 text-white">Asset Distribution</h2>
        <div className="relative h-64 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-darkblue opacity-20"></div>
          <div className="absolute inset-0 backdrop-filter backdrop-blur-md"></div>
          <div className="relative z-10 h-full">
            {Object.keys(walletData?.other_wallet_balances || {}).length > 0 ? (
              <Pie data={assetDistributionData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No asset data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDistribution;
