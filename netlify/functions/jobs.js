const axios = require('axios');

exports.handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { company } = event.queryStringParameters || {};

    if (!company) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Company parameter is required' })
      };
    }

    // Fetch from RemoteOK (free, no API key required)
    const response = await axios.get('https://remoteok.com/api', {
      headers: {
        'User-Agent': 'BrandSentimentTracker/1.0'
      }
    });

    // RemoteOK returns an array with first element being metadata
    const allJobs = response.data.slice(1) || [];

    // Filter jobs by company name
    const companyJobs = allJobs.filter(job => {
      const companyName = job.company?.toLowerCase() || '';
      const position = job.position?.toLowerCase() || '';
      const tags = (job.tags || []).join(' ').toLowerCase();
      const searchTerm = company.toLowerCase();

      return companyName.includes(searchTerm) ||
             position.includes(searchTerm) ||
             tags.includes(searchTerm);
    }).slice(0, 10);

    // Categorize jobs by type
    const categorizeJob = (job) => {
      const title = (job.position || '').toLowerCase();
      const tags = (job.tags || []).join(' ').toLowerCase();

      if (title.includes('software') || title.includes('developer') || title.includes('frontend') || title.includes('backend') || title.includes('full stack')) {
        return 'SWE';
      } else if (title.includes('engineer') || title.includes('devops') || title.includes('infrastructure')) {
        return 'ENG';
      } else if (title.includes('design') || title.includes('ux') || title.includes('ui')) {
        return 'Design';
      } else if (title.includes('product') || title.includes('manager')) {
        return 'Product';
      }
      return 'Other';
    };

    // Format jobs
    const formattedJobs = companyJobs.map((job, index) => {
      // Calculate time ago
      const epochDate = job.epoch || Date.now() / 1000;
      const jobDate = new Date(epochDate * 1000);
      const now = new Date();
      const diffDays = Math.floor((now - jobDate) / (1000 * 60 * 60 * 24));

      let timeAgo;
      if (diffDays === 0) timeAgo = 'Today';
      else if (diffDays === 1) timeAgo = '1 day ago';
      else if (diffDays < 7) timeAgo = `${diffDays} days ago`;
      else if (diffDays < 30) timeAgo = `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
      else timeAgo = `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;

      return {
        id: job.id || index + 1,
        title: job.position || 'Position Available',
        type: categorizeJob(job),
        location: job.location || 'Remote',
        posted: timeAgo,
        salary: job.salary_min && job.salary_max
          ? `$${Math.round(job.salary_min / 1000)}k - $${Math.round(job.salary_max / 1000)}k`
          : 'Competitive',
        url: job.url || `https://remoteok.com/remote-jobs/${job.slug}`,
        company: job.company || company
      };
    });

    // If no jobs found, try a broader search
    if (formattedJobs.length === 0) {
      // Use general tech jobs as examples
      const techJobs = allJobs.slice(0, 6).map((job, index) => ({
        id: index + 1,
        title: job.position || 'Tech Position',
        type: categorizeJob(job),
        location: job.location || 'Remote',
        posted: 'Recently',
        salary: job.salary_min && job.salary_max
          ? `$${Math.round(job.salary_min / 1000)}k - $${Math.round(job.salary_max / 1000)}k`
          : 'Competitive',
        url: job.url || `https://remoteok.com/remote-jobs/${job.slug}`,
        company: job.company || 'Tech Company'
      }));

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          company,
          jobs: techJobs,
          note: `No specific jobs found for ${company}. Showing similar tech positions.`,
          lastUpdated: new Date().toISOString()
        })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        company,
        jobs: formattedJobs,
        lastUpdated: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Error:', error);

    // Return mock data as fallback
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        company: event.queryStringParameters?.company || 'Company',
        jobs: [
          {
            id: 1,
            title: 'Software Engineer',
            type: 'SWE',
            location: 'Remote',
            posted: '2 days ago',
            salary: '$120k - $180k',
            url: 'https://remoteok.com'
          },
          {
            id: 2,
            title: 'Product Designer',
            type: 'Design',
            location: 'Remote',
            posted: '1 week ago',
            salary: '$100k - $150k',
            url: 'https://remoteok.com'
          },
          {
            id: 3,
            title: 'DevOps Engineer',
            type: 'ENG',
            location: 'Remote',
            posted: '3 days ago',
            salary: '$130k - $190k',
            url: 'https://remoteok.com'
          }
        ],
        fallback: true,
        note: 'Job API temporarily unavailable. Showing example positions.',
        lastUpdated: new Date().toISOString()
      })
    };
  }
};
