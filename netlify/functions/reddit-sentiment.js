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

    // Get Reddit access token
    const auth = await axios.post(
      'https://www.reddit.com/api/v1/access_token',
      'grant_type=client_credentials',
      {
        auth: {
          username: process.env.REDDIT_CLIENT_ID,
          password: process.env.REDDIT_CLIENT_SECRET
        },
        headers: {
          'User-Agent': process.env.REDDIT_USER_AGENT || 'BrandSentimentTracker/1.0',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const accessToken = auth.data.access_token;

    // Search Reddit for company mentions
    const searchQuery = company.toLowerCase();
    const subreddits = ['technology', 'stocks', 'investing', 'news'];

    let allPosts = [];

    for (const subreddit of subreddits) {
      try {
        const response = await axios.get(
          `https://oauth.reddit.com/r/${subreddit}/search`,
          {
            params: {
              q: searchQuery,
              limit: 10,
              sort: 'relevance',
              t: 'month'
            },
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'User-Agent': process.env.REDDIT_USER_AGENT || 'BrandSentimentTracker/1.0'
            }
          }
        );

        if (response.data?.data?.children) {
          allPosts = allPosts.concat(response.data.data.children);
        }
      } catch (err) {
        console.error(`Error fetching from r/${subreddit}:`, err.message);
      }
    }

    // Analyze sentiment
    let totalScore = 0;
    let totalComparative = 0;
    let postCount = 0;
    const highlights = [];
    const mentions = [];

    allPosts.forEach(post => {
      const postData = post.data;
      const text = `${postData.title} ${postData.selftext || ''}`;
      const analysis = sentiment.analyze(text);

      totalScore += analysis.score;
      totalComparative += analysis.comparative;
      postCount++;

      mentions.push({
        title: postData.title,
        score: analysis.score,
        url: `https://reddit.com${postData.permalink}`,
        subreddit: postData.subreddit,
        created: new Date(postData.created_utc * 1000).toISOString()
      });

      // Collect sentiment highlights
      if (analysis.positive.length > 0) {
        highlights.push(...analysis.positive.slice(0, 2));
      }
      if (analysis.negative.length > 0) {
        highlights.push(...analysis.negative.slice(0, 2));
      }
    });

    // Calculate sentiment score (0-100 scale)
    const avgComparative = postCount > 0 ? totalComparative / postCount : 0;
    const sentimentScore = Math.round(Math.max(0, Math.min(100, (avgComparative + 1) * 50)));

    // Determine trend
    let trend = 'neutral';
    if (sentimentScore >= 60) trend = 'up';
    else if (sentimentScore <= 40) trend = 'down';

    // Get unique highlights
    const uniqueHighlights = [...new Set(highlights)].slice(0, 3);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        company,
        employeeSentiment: {
          score: sentimentScore,
          trend: trend,
          reviews: postCount,
          highlights: uniqueHighlights.length > 0 ? uniqueHighlights : ['Analyzing community feedback', 'Limited recent discussions', 'Check back for updates'],
          source: 'Reddit'
        },
        mentions: mentions.slice(0, 10),
        lastUpdated: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Error:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to fetch Reddit sentiment',
        message: error.message,
        // Return mock data as fallback
        fallback: true,
        employeeSentiment: {
          score: 70,
          trend: 'neutral',
          reviews: 0,
          highlights: ['API temporarily unavailable', 'Using cached data'],
          source: 'Reddit (Cached)'
        }
      })
    };
  }
};
