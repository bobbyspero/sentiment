const axios = require('axios');
const Sentiment = require('sentiment');

const sentiment = new Sentiment();

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

    const apiKey = process.env.NEWS_API_KEY;

    if (!apiKey) {
      throw new Error('NEWS_API_KEY not configured');
    }

    // Fetch news from NewsAPI
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: company,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 10,
        apiKey: apiKey
      }
    });

    const articles = response.data.articles || [];

    // Analyze sentiment for each article
    const newsWithSentiment = articles.map(article => {
      const text = `${article.title} ${article.description || ''}`;
      const analysis = sentiment.analyze(text);

      let sentimentLabel = 'neutral';
      if (analysis.score > 2) sentimentLabel = 'positive';
      else if (analysis.score < -2) sentimentLabel = 'negative';

      // Calculate time ago
      const publishedDate = new Date(article.publishedAt);
      const now = new Date();
      const diffMs = now - publishedDate;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      let timeAgo;
      if (diffHours < 1) timeAgo = 'Just now';
      else if (diffHours < 24) timeAgo = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      else timeAgo = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

      return {
        title: article.title,
        sentiment: sentimentLabel,
        date: timeAgo,
        source: article.source?.name || 'Unknown',
        url: article.url,
        image: article.urlToImage,
        sentimentScore: analysis.score
      };
    });

    // Calculate overall external sentiment
    const totalSentiment = newsWithSentiment.reduce((sum, article) => sum + article.sentimentScore, 0);
    const avgSentiment = newsWithSentiment.length > 0 ? totalSentiment / newsWithSentiment.length : 0;
    const externalScore = Math.round(Math.max(0, Math.min(100, (avgSentiment + 5) * 10)));

    let trend = 'neutral';
    if (externalScore >= 60) trend = 'up';
    else if (externalScore <= 40) trend = 'down';

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        company,
        news: newsWithSentiment.slice(0, 4),
        externalSentiment: {
          score: externalScore,
          trend: trend,
          mentions: newsWithSentiment.length,
          highlights: [
            newsWithSentiment.filter(n => n.sentiment === 'positive').length > 0 ? 'Positive media coverage' : 'Mixed reviews',
            `${newsWithSentiment.length} recent articles`,
            'Real-time news analysis'
          ],
          source: 'NewsAPI'
        },
        lastUpdated: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Error:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to fetch news',
        message: error.message,
        // Return mock data as fallback
        fallback: true,
        news: [
          {
            title: 'News API temporarily unavailable',
            sentiment: 'neutral',
            date: 'N/A',
            source: 'System',
            url: '#'
          }
        ],
        externalSentiment: {
          score: 65,
          trend: 'neutral',
          mentions: 0,
          highlights: ['API temporarily unavailable', 'Using cached data'],
          source: 'NewsAPI (Cached)'
        }
      })
    };
  }
};
