import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';

const AssetDistribution = ({ walletData, coinImagesMap }) => {
  const [activeAsset, setActiveAsset] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [assetDetails, setAssetDetails] = useState([]);
  const [selectedView, setSelectedView] = useState('doughnut'); // 'doughnut', 'bar', 'list'

  useEffect(() => {
    const prepareAssetDistributionData = () => {
      if (!walletData || !walletData.other_wallet_balances) {
        const emptyData = {
          labels: ['No Data'],
          datasets: [{
            data: [1],
            backgroundColor: ['rgba(75, 85, 99, 0.5)'],
            borderColor: ['rgba(75, 85, 99, 0.8)'],
            borderWidth: 1,
            hoverOffset: 4
          }]
        };
        setChartData(emptyData);
        setAssetDetails([]);
        return;
      }

      // Create stylish gradient colors
      const generateBackgroundColor = (index, total) => {
        const hue = (index / total) * 360;
        return `hsla(${hue}, 80%, 60%, 0.8)`;
      };

      const generateBorderColor = (index, total) => {
        const hue = (index / total) * 360;
        return `hsla(${hue}, 90%, 50%, 1)`;
      };

      // Extract data
      const entries = Object.entries(walletData.other_wallet_balances);
      const filteredEntries = entries.filter(([_, value]) => parseFloat(value) > 0);
      
      // Sort by value (balance) from highest to lowest
      filteredEntries.sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]));
      
      const labels = filteredEntries.map(([key]) => key);
      const data = filteredEntries.map(([_, value]) => parseFloat(value));
      
      // Calculate total for percentage
      const total = data.reduce((acc, curr) => acc + curr, 0);
      
      // Prepare detailed asset information
      const details = filteredEntries.map(([key, value], index) => {
        const balance = parseFloat(value);
        const percentage = (balance / total) * 100;
        const imageUrl = coinImagesMap && coinImagesMap[key.toLowerCase()] ? coinImagesMap[key.toLowerCase()] : '';

        return {
          symbol: key,
          balance,
          percentage,
          backgroundColor: generateBackgroundColor(index, filteredEntries.length),
          borderColor: generateBorderColor(index, filteredEntries.length),
          imageUrl: imageUrl
        };
      });
      
      setAssetDetails(details);

      const chartDataObject = {
        labels,
        datasets: [{
          data,
          backgroundColor: details.map(item => item.backgroundColor),
          borderColor: details.map(item => item.borderColor),
          borderWidth: 2,
          hoverOffset: 15,
          hoverBorderWidth: 3
        }]
      };
      
      setChartData(chartDataObject);
    };

    if (walletData) {
      prepareAssetDistributionData();
    }
  }, [walletData, coinImagesMap]);

  const handleChartHover = (event, chartElements) => {
    if (chartElements.length > 0) {
      const index = chartElements[0].index;
      setActiveAsset(assetDetails[index]);
      setIsHovering(true);
    } else {
      setIsHovering(false);
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    },
    onHover: handleChartHover
  };

  // Render a loading state if data is not yet prepared
  if (!chartData) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-3xl p-8 shadow-[0_0_15px_rgba(101,121,248,0.3)] backdrop-blur-lg border border-white/10">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-white/10 rounded-md mb-6"></div>
          <div className="flex justify-center items-center h-64">
            <div className="h-48 w-48 rounded-full bg-white/5"></div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-8 bg-white/5 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-3xl p-8 shadow-[0_0_15px_rgba(101,121,248,0.3)] backdrop-blur-lg border border-white/10">
      {/* Background decorative elements */}
      <div className="absolute -bottom-12 -right-12 w-56 h-56 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -top-12 -left-12 w-56 h-56 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      {/* Header section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">Asset Distribution</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setSelectedView('doughnut')}
            className={`p-2 rounded-xl ${selectedView === 'doughnut' ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
            </svg>
          </button>
          <button 
            onClick={() => setSelectedView('list')}
            className={`p-2 rounded-xl ${selectedView === 'list' ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Doughnut chart view */}
      {selectedView === 'doughnut' && (
        <div className="flex flex-col lg:flex-row">
          <div className="relative w-full lg:w-1/2 h-64">
            {/* Chart container */}
            <div className="relative h-full flex justify-center items-center">
              <Doughnut data={chartData} options={chartOptions} />
              
              {/* Center content */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10">
                {isHovering && activeAsset ? (
                  <div className="transition-opacity duration-300">
                    {activeAsset.imageUrl ? (
                      <img src={activeAsset.imageUrl} alt={activeAsset.symbol} className="w-16 h-16 mx-auto rounded-full" onError={(e) => { e.target.style.display = 'none'; }} />
                    ) : (
                      <div className="w-16 h-16 mx-auto rounded-full bg-white/10 flex items-center justify-center text-white/50 text-xl">{activeAsset.symbol.substring(0,1)}</div>
                    )}
                    <p className="text-2xl font-bold mt-2">{activeAsset.percentage.toFixed(1)}%</p>
                  </div>
                ) : (
                  <div className="transition-opacity duration-300">
                    <p className="text-lg text-white/70">Total</p>
                    <p className="text-2xl font-bold mt-1">100%</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Asset list alongside chart */}
          <div className="w-full lg:w-1/2 mt-6 lg:mt-0 lg:pl-8 flex flex-col justify-center">
            <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar pr-2">
              {assetDetails.length > 0 ? (
                assetDetails.map((asset, index) => (
                  <div 
                    key={index}
                    className="flex items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                    onMouseEnter={() => setActiveAsset(asset)}
                    onMouseLeave={() => setActiveAsset(null)}
                  >
                    <div className="w-8 h-8 mr-3 flex-shrink-0">
                      {asset.imageUrl ? (
                        <img src={asset.imageUrl} alt={asset.symbol} className="w-full h-full rounded-full" onError={(e) => { e.target.style.display = 'none'; }} />
                      ) : (
                        <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center text-white/50 text-sm">{asset.symbol.substring(0,1)}</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium">{asset.symbol}</span>
                        <span>{asset.percentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full mt-1 bg-white/10 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="h-full rounded-full" 
                          style={{ 
                            width: `${asset.percentage}%`,
                            backgroundColor: asset.backgroundColor
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-white/50">
                  No assets found in your portfolio
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* List view */}
      {selectedView === 'list' && (
        <div className="max-h-96 overflow-y-auto custom-scrollbar pr-2">
          {assetDetails.length > 0 ? (
            <div className="space-y-3">
              {assetDetails.map((asset, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 mr-3">
                      {asset.imageUrl ? (
                        <img src={asset.imageUrl} alt={asset.symbol} className="w-full h-full rounded-full" onError={(e) => { e.target.style.display = 'none'; }} />
                      ) : (
                        <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center text-white/50 text-lg">{asset.symbol.substring(0,1)}</div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{asset.symbol}</h3>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-lg font-medium">{asset.balance.toLocaleString('en-US', { maximumFractionDigits: 8 })}</p>
                      <p className="text-sm text-white/60">{asset.percentage.toFixed(2)}% of portfolio</p>
                    </div>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        width: `${asset.percentage}%`,
                        backgroundColor: asset.backgroundColor
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-white/50">
              No assets found in your portfolio
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AssetDistribution;
