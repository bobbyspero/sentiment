import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Users, Globe, Newspaper, Search, Plus, X, BarChart3, ExternalLink, Download, Briefcase } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BrandSentimentTracker = () => {
  const [selectedCompany, setSelectedCompany] = useState('meta');
  const [companies, setCompanies] = useState([
    { id: 'meta', name: 'Meta', ticker: 'META' },
    { id: 'google', name: 'Google', ticker: 'GOOGL' },
    { id: 'apple', name: 'Apple', ticker: 'AAPL' },
    { id: 'amazon', name: 'Amazon', ticker: 'AMZN' },
    { id: 'microsoft', name: 'Microsoft', ticker: 'MSFT' },
    { id: 'tesla', name: 'Tesla', ticker: 'TSLA' }
  ]);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyTicker, setNewCompanyTicker] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedCompanies, setSelectedCompanies] = useState(['meta']);
  const [timeRange, setTimeRange] = useState('1M');
  const [selectedJobType, setSelectedJobType] = useState('All');

  const timeRanges = [
    { label: '1W', value: '1W', days: 7 },
    { label: '1M', value: '1M', days: 30 },
    { label: '3M', value: '3M', days: 90 },
    { label: '6M', value: '6M', days: 180 },
    { label: '1Y', value: '1Y', days: 365 }
  ];

  // Generate historical sentiment data
  const generateHistoricalData = (companyId: string, days: number) => {
    const data = [];
    const today = new Date();
    const baseEmployee = mockData[companyId]?.employeeSentiment.score || 70;
    const baseExternal = mockData[companyId]?.externalSentiment.score || 65;

    for (let i = days; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      // Add some variation to make it interesting
      const employeeVariation = Math.sin(i / 10) * 8 + (Math.random() - 0.5) * 4;
      const externalVariation = Math.cos(i / 12) * 6 + (Math.random() - 0.5) * 5;

      data.push({
        date: dateStr,
        employee: Math.max(0, Math.min(100, Math.round(baseEmployee + employeeVariation))),
        external: Math.max(0, Math.min(100, Math.round(baseExternal + externalVariation)))
      });
    }

    return data;
  };

  const stockData: { [key: string]: { price: number; change: number; percentChange: number; high: number; low: number; volume: string } } = {
    meta: { price: 342.56, change: 5.23, percentChange: 1.55, high: 345.12, low: 338.90, volume: '12.4M' },
    google: { price: 138.92, change: -2.15, percentChange: -1.52, high: 141.20, low: 137.85, volume: '18.7M' },
    apple: { price: 178.45, change: 3.67, percentChange: 2.10, high: 179.50, low: 175.30, volume: '45.2M' },
    amazon: { price: 145.78, change: 1.92, percentChange: 1.33, high: 146.85, low: 144.12, volume: '38.9M' },
    microsoft: { price: 378.12, change: 6.45, percentChange: 1.74, high: 380.25, low: 374.90, volume: '22.1M' },
    tesla: { price: 242.84, change: -4.32, percentChange: -1.75, high: 248.50, low: 241.20, volume: '95.3M' }
  };

  const mockData: {
    [key: string]: {
      news: Array<{ title: string; sentiment: string; date: string; source: string; url?: string }>;
      employeeSentiment: { score: number; trend: string; reviews: number; highlights: string[] };
      externalSentiment: { score: number; trend: string; mentions: number; highlights: string[] };
    }
  } = {
    meta: {
      news: [
        { title: 'Meta announces new AI features for Instagram', sentiment: 'positive', date: '2 hours ago', source: 'TechCrunch', url: 'https://techcrunch.com/meta-ai-instagram' },
        { title: 'Privacy concerns raised over latest Meta update', sentiment: 'negative', date: '5 hours ago', source: 'The Verge', url: 'https://theverge.com/meta-privacy' },
        { title: 'Meta Q3 earnings beat expectations', sentiment: 'positive', date: '1 day ago', source: 'CNBC', url: 'https://cnbc.com/meta-earnings' },
        { title: 'Meta faces regulatory scrutiny in EU', sentiment: 'negative', date: '2 days ago', source: 'Reuters', url: 'https://reuters.com/meta-eu-regulation' }
      ],
      employeeSentiment: {
        score: 72,
        trend: 'up',
        reviews: 1247,
        highlights: ['Good work-life balance', 'Innovative culture', 'Competitive compensation']
      },
      externalSentiment: {
        score: 58,
        trend: 'neutral',
        mentions: 15420,
        highlights: ['Privacy concerns persist', 'Strong product innovation', 'Mixed user reviews']
      }
    },
    google: {
      news: [
        { title: 'Google unveils breakthrough in quantum computing', sentiment: 'positive', date: '3 hours ago', source: 'Wired', url: 'https://wired.com/google-quantum' },
        { title: 'Antitrust case against Google moves forward', sentiment: 'negative', date: '6 hours ago', source: 'Bloomberg', url: 'https://bloomberg.com/google-antitrust' },
        { title: 'Google Cloud sees significant growth', sentiment: 'positive', date: '1 day ago', source: 'Forbes', url: 'https://forbes.com/google-cloud-growth' },
        { title: 'Concerns over AI ethics at Google', sentiment: 'neutral', date: '3 days ago', source: 'MIT Tech Review', url: 'https://technologyreview.com/google-ai-ethics' }
      ],
      employeeSentiment: {
        score: 78,
        trend: 'up',
        reviews: 2891,
        highlights: ['Excellent benefits', 'Smart colleagues', 'Great learning opportunities']
      },
      externalSentiment: {
        score: 65,
        trend: 'up',
        mentions: 28340,
        highlights: ['Leading in AI innovation', 'Antitrust concerns', 'Reliable products']
      }
    },
    apple: {
      news: [
        { title: 'Apple Vision Pro receives positive reviews', sentiment: 'positive', date: '1 hour ago', source: 'TechCrunch', url: 'https://techcrunch.com/apple-vision-pro-reviews' },
        { title: 'Apple stock reaches all-time high', sentiment: 'positive', date: '4 hours ago', source: 'MarketWatch', url: 'https://marketwatch.com/apple-stock-high' },
        { title: 'Labor practices questioned at supplier factories', sentiment: 'negative', date: '2 days ago', source: 'Guardian', url: 'https://theguardian.com/apple-labor' },
        { title: 'New iPhone features impress users', sentiment: 'positive', date: '3 days ago', source: 'The Verge', url: 'https://theverge.com/iphone-features' }
      ],
      employeeSentiment: {
        score: 75,
        trend: 'neutral',
        reviews: 1956,
        highlights: ['Strong brand reputation', 'Demanding work culture', 'Good compensation']
      },
      externalSentiment: {
        score: 71,
        trend: 'up',
        mentions: 32100,
        highlights: ['Premium brand image', 'High customer loyalty', 'Price concerns']
      }
    },
    amazon: {
      news: [
        { title: 'Amazon expands same-day delivery network', sentiment: 'positive', date: '1 hour ago', source: 'Reuters', url: 'https://reuters.com/amazon-delivery' },
        { title: 'Workplace safety concerns at warehouses', sentiment: 'negative', date: '4 hours ago', source: 'WSJ', url: 'https://wsj.com/amazon-workplace-safety' },
        { title: 'AWS dominates cloud market share', sentiment: 'positive', date: '1 day ago', source: 'CNBC', url: 'https://cnbc.com/aws-market-share' },
        { title: 'Amazon faces union organizing efforts', sentiment: 'neutral', date: '2 days ago', source: 'NPR', url: 'https://npr.org/amazon-union' }
      ],
      employeeSentiment: {
        score: 62,
        trend: 'down',
        reviews: 3421,
        highlights: ['Competitive pay', 'High-pressure environment', 'Good career growth']
      },
      externalSentiment: {
        score: 63,
        trend: 'neutral',
        mentions: 41200,
        highlights: ['Convenient service', 'Labor concerns', 'Market dominance']
      }
    },
    microsoft: {
      news: [
        { title: 'Microsoft Azure gains enterprise clients', sentiment: 'positive', date: '2 hours ago', source: 'Forbes', url: 'https://forbes.com/microsoft-azure-growth' },
        { title: 'Microsoft completes Activision acquisition', sentiment: 'positive', date: '5 hours ago', source: 'IGN', url: 'https://ign.com/microsoft-activision' },
        { title: 'GitHub Copilot sees massive adoption', sentiment: 'positive', date: '1 day ago', source: 'TechCrunch', url: 'https://techcrunch.com/github-copilot' },
        { title: 'Questions about AI model training data', sentiment: 'neutral', date: '3 days ago', source: 'The Verge', url: 'https://theverge.com/microsoft-ai-training' }
      ],
      employeeSentiment: {
        score: 81,
        trend: 'up',
        reviews: 2134,
        highlights: ['Excellent work culture', 'Strong leadership', 'Flexible remote work']
      },
      externalSentiment: {
        score: 73,
        trend: 'up',
        mentions: 19800,
        highlights: ['Enterprise trust', 'AI innovation leader', 'Strong ecosystem']
      }
    },
    tesla: {
      news: [
        { title: 'Tesla Cybertruck deliveries begin', sentiment: 'positive', date: '3 hours ago', source: 'Electrek' },
        { title: 'Autopilot safety under investigation', sentiment: 'negative', date: '6 hours ago', source: 'Reuters' },
        { title: 'Tesla energy business shows strong growth', sentiment: 'positive', date: '1 day ago', source: 'Bloomberg' },
        { title: 'Production challenges at new factory', sentiment: 'negative', date: '2 days ago', source: 'WSJ' }
      ],
      employeeSentiment: {
        score: 68,
        trend: 'neutral',
        reviews: 1689,
        highlights: ['Mission-driven work', 'Fast-paced environment', 'Long working hours']
      },
      externalSentiment: {
        score: 61,
        trend: 'down',
        mentions: 38900,
        highlights: ['Innovation leader', 'Polarizing CEO', 'Quality concerns']
      }
    }
  };

  const jobPostings: {
    [key: string]: Array<{ id: number; title: string; type: string; location: string; posted: string; salary: string }>
  } = {
    meta: [
      { id: 1, title: 'Senior Software Engineer', type: 'SWE', location: 'Menlo Park, CA', posted: '2 days ago', salary: '$180k - $250k' },
      { id: 2, title: 'Product Designer', type: 'Design', location: 'Remote', posted: '1 week ago', salary: '$150k - $200k' },
      { id: 3, title: 'Machine Learning Engineer', type: 'ENG', location: 'New York, NY', posted: '3 days ago', salary: '$200k - $280k' },
      { id: 4, title: 'UX Researcher', type: 'Design', location: 'San Francisco, CA', posted: '5 days ago', salary: '$140k - $190k' },
      { id: 5, title: 'Data Engineer', type: 'ENG', location: 'Seattle, WA', posted: '1 day ago', salary: '$170k - $230k' },
      { id: 6, title: 'Frontend Engineer', type: 'SWE', location: 'Austin, TX', posted: '4 days ago', salary: '$160k - $220k' }
    ],
    google: [
      { id: 1, title: 'Staff Software Engineer', type: 'SWE', location: 'Mountain View, CA', posted: '1 day ago', salary: '$190k - $270k' },
      { id: 2, title: 'Product Manager', type: 'Product', location: 'Sunnyvale, CA', posted: '3 days ago', salary: '$170k - $240k' },
      { id: 3, title: 'Research Scientist', type: 'ENG', location: 'Cambridge, MA', posted: '2 days ago', salary: '$200k - $300k' },
      { id: 4, title: 'Visual Designer', type: 'Design', location: 'New York, NY', posted: '1 week ago', salary: '$130k - $180k' },
      { id: 5, title: 'Cloud Engineer', type: 'ENG', location: 'Seattle, WA', posted: '5 days ago', salary: '$180k - $250k' },
      { id: 6, title: 'Mobile Engineer', type: 'SWE', location: 'San Francisco, CA', posted: '2 days ago', salary: '$175k - $240k' }
    ],
    apple: [
      { id: 1, title: 'iOS Engineer', type: 'SWE', location: 'Cupertino, CA', posted: '2 days ago', salary: '$185k - $260k' },
      { id: 2, title: 'Hardware Engineer', type: 'ENG', location: 'Cupertino, CA', posted: '4 days ago', salary: '$190k - $270k' },
      { id: 3, title: 'Industrial Designer', type: 'Design', location: 'Cupertino, CA', posted: '1 week ago', salary: '$160k - $220k' },
      { id: 4, title: 'Machine Learning Engineer', type: 'ENG', location: 'Seattle, WA', posted: '3 days ago', salary: '$200k - $280k' },
      { id: 5, title: 'Software Engineer', type: 'SWE', location: 'Austin, TX', posted: '1 day ago', salary: '$170k - $240k' },
      { id: 6, title: 'UX Designer', type: 'Design', location: 'San Diego, CA', posted: '6 days ago', salary: '$145k - $195k' }
    ],
    amazon: [
      { id: 1, title: 'Software Development Engineer', type: 'SWE', location: 'Seattle, WA', posted: '1 day ago', salary: '$170k - $240k' },
      { id: 2, title: 'Solutions Architect', type: 'ENG', location: 'Arlington, VA', posted: '2 days ago', salary: '$180k - $250k' },
      { id: 3, title: 'Product Designer', type: 'Design', location: 'San Francisco, CA', posted: '5 days ago', salary: '$140k - $190k' },
      { id: 4, title: 'DevOps Engineer', type: 'ENG', location: 'Denver, CO', posted: '3 days ago', salary: '$165k - $225k' },
      { id: 5, title: 'Full Stack Engineer', type: 'SWE', location: 'New York, NY', posted: '1 week ago', salary: '$160k - $220k' },
      { id: 6, title: 'UX Writer', type: 'Design', location: 'Remote', posted: '4 days ago', salary: '$120k - $165k' }
    ],
    microsoft: [
      { id: 1, title: 'Principal Software Engineer', type: 'SWE', location: 'Redmond, WA', posted: '2 days ago', salary: '$195k - $280k' },
      { id: 2, title: 'Cloud Solutions Engineer', type: 'ENG', location: 'Atlanta, GA', posted: '3 days ago', salary: '$175k - $245k' },
      { id: 3, title: 'Senior UX Designer', type: 'Design', location: 'San Francisco, CA', posted: '1 day ago', salary: '$155k - $210k' },
      { id: 4, title: 'AI Research Engineer', type: 'ENG', location: 'Redmond, WA', posted: '5 days ago', salary: '$210k - $300k' },
      { id: 5, title: 'Backend Engineer', type: 'SWE', location: 'Austin, TX', posted: '4 days ago', salary: '$170k - $235k' },
      { id: 6, title: 'Product Designer', type: 'Design', location: 'New York, NY', posted: '1 week ago', salary: '$145k - $200k' }
    ],
    tesla: [
      { id: 1, title: 'Embedded Software Engineer', type: 'SWE', location: 'Palo Alto, CA', posted: '1 day ago', salary: '$165k - $230k' },
      { id: 2, title: 'Mechanical Engineer', type: 'ENG', location: 'Fremont, CA', posted: '3 days ago', salary: '$150k - $210k' },
      { id: 3, title: 'Autopilot Software Engineer', type: 'SWE', location: 'Palo Alto, CA', posted: '2 days ago', salary: '$190k - $270k' },
      { id: 4, title: 'UI/UX Designer', type: 'Design', location: 'Austin, TX', posted: '5 days ago', salary: '$130k - $180k' },
      { id: 5, title: 'Battery Engineer', type: 'ENG', location: 'Reno, NV', posted: '1 week ago', salary: '$160k - $220k' },
      { id: 6, title: 'Full Stack Developer', type: 'SWE', location: 'Fremont, CA', posted: '4 days ago', salary: '$155k - $215k' }
    ]
  };

  const jobTypes = ['All', 'SWE', 'ENG', 'Design', 'Product'];

  const handleAddCompany = () => {
    if (newCompanyName.trim() && newCompanyTicker.trim()) {
      const newId = newCompanyName.toLowerCase().replace(/\s+/g, '-');
      setCompanies([...companies, {
        id: newId,
        name: newCompanyName.trim(),
        ticker: newCompanyTicker.trim().toUpperCase()
      }]);

      mockData[newId] = {
        news: [
          { title: `${newCompanyName} in the news - data not yet available`, sentiment: 'neutral', date: 'N/A', source: 'Pending' }
        ],
        employeeSentiment: {
          score: 0,
          trend: 'neutral',
          reviews: 0,
          highlights: ['Data not yet available']
        },
        externalSentiment: {
          score: 0,
          trend: 'neutral',
          mentions: 0,
          highlights: ['Data not yet available']
        }
      };

      stockData[newId] = {
        price: 0,
        change: 0,
        percentChange: 0,
        high: 0,
        low: 0,
        volume: 'N/A'
      };

      setNewCompanyName('');
      setNewCompanyTicker('');
      setShowAddForm(false);
      setSelectedCompany(newId);
    }
  };

  const toggleCompanyInComparison = (companyId: string) => {
    if (selectedCompanies.includes(companyId)) {
      if (selectedCompanies.length > 1) {
        setSelectedCompanies(selectedCompanies.filter(id => id !== companyId));
      }
    } else {
      if (selectedCompanies.length < 4) {
        setSelectedCompanies([...selectedCompanies, companyId]);
      }
    }
  };

  const currentData = mockData[selectedCompany] || mockData.meta;
  const currentStock = stockData[selectedCompany] || stockData.meta;
  const currentCompany = companies.find(c => c.id === selectedCompany);
  const currentTimeRange = timeRanges.find(t => t.value === timeRange);

  const companyColors: { [key: string]: string } = {
    meta: '#3b82f6',
    google: '#10b981',
    apple: '#8b5cf6',
    amazon: '#f59e0b',
    microsoft: '#ec4899',
    tesla: '#ef4444'
  };

  const getSentimentColor = (sentiment: string) => {
    switch(sentiment) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch(sentiment) {
      case 'positive': return <TrendingUp className="w-4 h-4" />;
      case 'negative': return <TrendingDown className="w-4 h-4" />;
      default: return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch(trend) {
      case 'up': return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'down': return <TrendingDown className="w-5 h-5 text-red-400" />;
      default: return <Minus className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  // Prepare comparison chart data
  const getComparisonData = () => {
    const days = currentTimeRange?.days || 30;
    const allData: any = {};

    selectedCompanies.forEach((companyId: string) => {
      allData[companyId] = generateHistoricalData(companyId, days);
    });

    const mergedData: any[] = [];
    const dataLength = allData[selectedCompanies[0]]?.length || 0;

    for (let i = 0; i < dataLength; i++) {
      const dataPoint: any = { date: allData[selectedCompanies[0]][i].date };

      selectedCompanies.forEach((companyId: string) => {
        const company = companies.find(c => c.id === companyId);
        if (company) {
          dataPoint[`${company.name}_employee`] = allData[companyId][i].employee;
          dataPoint[`${company.name}_external`] = allData[companyId][i].external;
        }
      });

      mergedData.push(dataPoint);
    }

    return mergedData;
  };

  // Export sentiment data as JSON
  const exportSentimentData = () => {
    const exportData = {
      company: currentCompany?.name,
      ticker: currentCompany?.ticker,
      timestamp: new Date().toISOString(),
      stockData: currentStock,
      employeeSentiment: currentData.employeeSentiment,
      externalSentiment: currentData.externalSentiment,
      historicalData: generateHistoricalData(selectedCompany, 30),
      news: currentData.news
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentCompany?.name}_sentiment_data_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredJobs = (jobPostings[selectedCompany] || []).filter(
    (job: any) => selectedJobType === 'All' || job.type === selectedJobType
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Brand Sentiment Tracker
          </h1>
          <p className="text-gray-400">Real-time monitoring of brand reputation across news, employees, and public sentiment</p>
        </div>

        {/* Company Selector and Controls */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-300">Select Company</label>
            <button
              onClick={() => {
                setComparisonMode(!comparisonMode);
                if (!comparisonMode) {
                  setSelectedCompanies([selectedCompany]);
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                comparisonMode
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              {comparisonMode ? 'Exit Comparison' : 'Compare Companies'}
            </button>
          </div>

          {comparisonMode ? (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-3">Select up to 4 companies to compare (at least 1 required)</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {companies.map(company => (
                  <button
                    key={company.id}
                    onClick={() => toggleCompanyInComparison(company.id)}
                    className={`px-4 py-2 rounded-lg transition-colors border-2 ${
                      selectedCompanies.includes(company.id)
                        ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                        : 'border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                  >
                    {company.name}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex gap-3 flex-wrap items-start">
              <div className="relative flex-1 min-w-[200px] max-w-[300px]">
                <select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                >
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>{company.name} ({company.ticker})</option>
                  ))}
                </select>
                <Search className="absolute right-3 top-3.5 w-5 h-5 text-gray-500 pointer-events-none" />
              </div>

              {!showAddForm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add Company
                </button>
              )}
            </div>
          )}

          {/* Add Company Form */}
          {showAddForm && (
            <div className="mt-4 bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Add New Company</h3>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewCompanyName('');
                    setNewCompanyTicker('');
                  }}
                  className="text-gray-400 hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Company Name (e.g., Netflix)"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Ticker Symbol (e.g., NFLX)"
                  value={newCompanyTicker}
                  onChange={(e) => setNewCompanyTicker(e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleAddCompany}
                className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Add Company
              </button>
            </div>
          )}
        </div>

        {/* Sentiment Trend Chart */}
        <div className="mb-8">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Sentiment Trends</h2>
              <div className="flex gap-2">
                {timeRanges.map(range => (
                  <button
                    key={range.value}
                    onClick={() => setTimeRange(range.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      timeRange === range.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={getComparisonData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                {selectedCompanies.map(companyId => {
                  const company = companies.find(c => c.id === companyId);
                  const color = companyColors[companyId] || '#3b82f6';
                  if (!company) return null;
                  return (
                    <React.Fragment key={companyId}>
                      <Line
                        type="monotone"
                        dataKey={`${company.name}_employee`}
                        stroke={color}
                        strokeWidth={2}
                        dot={false}
                        name={`${company.name} (Employee)`}
                      />
                      <Line
                        type="monotone"
                        dataKey={`${company.name}_external`}
                        stroke={color}
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                        name={`${company.name} (External)`}
                      />
                    </React.Fragment>
                  );
                })}
              </LineChart>
            </ResponsiveContainer>

            <div className="mt-4 text-sm text-gray-400">
              <span className="mr-4">Solid lines = Employee Sentiment</span>
              <span>Dashed lines = External Sentiment</span>
            </div>
          </div>
        </div>

        {!comparisonMode && (
          <>
            {/* Stock Ticker */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-gray-800 to-gray-850 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Stock Price</div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-bold">${currentStock.price.toFixed(2)}</span>
                      <span className="text-sm text-gray-400">{currentCompany?.ticker}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Change</div>
                      <div className={`text-xl font-semibold flex items-center gap-1 ${
                        currentStock.change >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {currentStock.change >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                        {currentStock.change >= 0 ? '+' : ''}{currentStock.change.toFixed(2)} ({currentStock.percentChange >= 0 ? '+' : ''}{currentStock.percentChange.toFixed(2)}%)
                      </div>
                    </div>

                    <div className="border-l border-gray-700 pl-6">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-gray-400">High</div>
                          <div className="font-medium">${currentStock.high.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Low</div>
                          <div className="font-medium">${currentStock.low.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Volume</div>
                          <div className="font-medium">{currentStock.volume}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Latest News Section */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <Newspaper className="w-6 h-6 mr-2 text-blue-400" />
                <h2 className="text-2xl font-semibold">Latest News</h2>
              </div>
              <div className="grid gap-4">
                {currentData.news.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer block"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-medium">{item.title}</h3>
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="flex items-center text-sm text-gray-400 gap-4">
                          <span>{item.source}</span>
                          <span>•</span>
                          <span>{item.date}</span>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1 ${getSentimentColor(item.sentiment)} ml-4`}>
                        {getSentimentIcon(item.sentiment)}
                        <span className="text-sm font-medium capitalize">{item.sentiment}</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Sentiment Scores */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Sentiment Analysis</h2>
              <button
                onClick={exportSentimentData}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Export Data
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Employee Sentiment */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Users className="w-6 h-6 mr-2 text-purple-400" />
                  <h2 className="text-2xl font-semibold">Employee Sentiment</h2>
                </div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className={`text-5xl font-bold ${getScoreColor(currentData.employeeSentiment.score)}`}>
                      {currentData.employeeSentiment.score}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      Based on {currentData.employeeSentiment.reviews.toLocaleString()} reviews
                    </div>
                  </div>
                  {getTrendIcon(currentData.employeeSentiment.trend)}
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-300 mb-2">Key Highlights:</div>
                  {currentData.employeeSentiment.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center text-gray-400">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></div>
                      <span className="text-sm">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* External Sentiment */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Globe className="w-6 h-6 mr-2 text-cyan-400" />
                  <h2 className="text-2xl font-semibold">External Sentiment</h2>
                </div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className={`text-5xl font-bold ${getScoreColor(currentData.externalSentiment.score)}`}>
                      {currentData.externalSentiment.score}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      From {currentData.externalSentiment.mentions.toLocaleString()} mentions
                    </div>
                  </div>
                  {getTrendIcon(currentData.externalSentiment.trend)}
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-300 mb-2">Key Highlights:</div>
                  {currentData.externalSentiment.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center text-gray-400">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2"></div>
                      <span className="text-sm">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Job Postings Section */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Briefcase className="w-6 h-6 mr-2 text-green-400" />
                  <h2 className="text-2xl font-semibold">Open Positions</h2>
                </div>
                <div className="flex gap-2">
                  {jobTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedJobType(type)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        selectedJobType === type
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredJobs.map(job => (
                  <div key={job.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-green-500 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-100">{job.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        job.type === 'SWE' ? 'bg-blue-500/20 text-blue-300' :
                        job.type === 'ENG' ? 'bg-purple-500/20 text-purple-300' :
                        job.type === 'Design' ? 'bg-pink-500/20 text-pink-300' :
                        'bg-orange-500/20 text-orange-300'
                      }`}>
                        {job.type}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>{job.posted}</span>
                        <span className="text-green-400 font-medium">{job.salary}</span>
                      </div>
                    </div>
                    <button className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors text-sm font-medium">
                      Apply Now
                    </button>
                  </div>
                ))}
              </div>

              {filteredJobs.length === 0 && (
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
                  <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No job postings found for this filter.</p>
                </div>
              )}
            </div>
          </>
        )}

        {comparisonMode && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {selectedCompanies.map(companyId => {
              const company = companies.find(c => c.id === companyId);
              const data = mockData[companyId];
              const stock = stockData[companyId];
              if (!company) return null;

              return (
                <div key={companyId} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold mb-1">{company.name}</h3>
                    <div className="text-sm text-gray-400">{company.ticker}</div>
                  </div>

                  <div className="mb-4 pb-4 border-b border-gray-700">
                    <div className="text-2xl font-bold">${stock.price.toFixed(2)}</div>
                    <div className={`text-sm ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.percentChange >= 0 ? '+' : ''}{stock.percentChange.toFixed(2)}%)
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Employee</div>
                      <div className={`text-3xl font-bold ${getScoreColor(data.employeeSentiment.score)}`}>
                        {data.employeeSentiment.score}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-400 mb-1">External</div>
                      <div className={`text-3xl font-bold ${getScoreColor(data.externalSentiment.score)}`}>
                        {data.externalSentiment.score}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandSentimentTracker;
