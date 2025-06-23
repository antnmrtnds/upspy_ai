import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

/* -----------------------------------------------------------
   One dedicated Axios client for all webhook traffic
   (30 000 ms timeout, JSON headers)
----------------------------------------------------------- */
const webhookClient = axios.create({
  timeout: process.env.WEBHOOK_TIMEOUT_MS
    ? parseInt(process.env.WEBHOOK_TIMEOUT_MS)
    : 300_000,
  headers: { "Content-Type": "application/json" },
});

/**
 * Send `data` to the n8n webhook.
 */
export async function sendToWebhook(data, maxAttempts = 2) {
  const webhookUrl = 'https://upinvestments.app.n8n.cloud/webhook/16d56b55-c155-41e7-9f34-dbd7d24ca1f4';

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`[Webhook] POST attempt ${attempt} → ${webhookUrl}`);
      const { data: body } = await webhookClient.post(webhookUrl, data);
      return body;                                   // success 🎉

    } catch (err) {
      const isTimeout = err.code === "ECONNABORTED";
      const lastTry  = attempt === maxAttempts;

      console.error(
        `[Webhook] attempt ${attempt} failed${isTimeout ? " (timeout)" : ""}:`,
        err.response?.status || err.message
      );

      if (!isTimeout || lastTry) {
        throw err;                                   // bubble up for callers
      }
      // otherwise loop and retry once more
    }
  }
}

export async function scrapeYouTubeChannel(handle) {
  try {
    const response = await axios.get(
      `https://api.scrapecreators.com/v1/youtube/channel?handle=${handle}`,
      {
        headers: {
          "x-api-key": process.env.SCRAPE_CREATORS_API_KEY,
        },
        params: {
          country: "PT",
          status: "all",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("error at scrapeYouTubeChannel", error.message);
    throw new Error(`Failed to scrape YouTube channel: ${error.message}`);
  }
}

export async function scrapeYouTubeVideo(url) {
  try {
    const response = await axios.get(
      `https://api.scrapecreators.com/v1/youtube/video?url=${url}&get_transcript=true`,
      {
        headers: {
          "x-api-key": process.env.SCRAPE_CREATORS_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("error at scrapeYouTubeVideo", error.message);
    throw new Error(`Failed to scrape YouTube video: ${error.message}`);
  }
}

export async function scrapeYouTubeChannelVideos(
  handle,
  continuationToken = null
) {
  try {
    let url = `https://api.scrapecreators.com/v1/youtube/channel-videos?handle=${handle}`;
    if (continuationToken) {
      url += `&continuationToken=${continuationToken}`;
    }
    const response = await axios.get(url, {
      headers: {
        "x-api-key": process.env.SCRAPE_CREATORS_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("error at scrapeYouTubeChannelVideos", error.message);
    throw new Error(`Failed to scrape YouTube channel videos: ${error.message}`);
  }
}

export async function scrapeYouTubeSearch(
  query,
  sortBy,
  continuationToken = null
) {
  try {
    let url = `https://api.scrapecreators.com/v1/youtube/search?query=${query}`;
    if (sortBy) {
      url += `&sortBy=${sortBy}`;
    }
    if (continuationToken) {
      url += `&continuationToken=${continuationToken}`;
    }
    const response = await axios.get(url, {
      headers: {
        "x-api-key": process.env.SCRAPE_CREATORS_API_KEY,
      },
    });
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    console.error("error at scrapeYouTubeSearch", error.message);
  }
}

export async function searchFacebookAdLibraryForCompanies(companyName, country = "PT") {
  try {
    const response = await axios.get(
      `https://api.scrapecreators.com/v1/facebook/adLibrary/search/companies`,
      {
        headers: {
          "x-api-key": process.env.SCRAPE_CREATORS_API_KEY,
        },
        params: {
          query: companyName,
          country,
          status: "all",
        },
        timeout: 300000,
      }
    );

    return response.data;
  } catch (error) {
    console.error("error at searchFacebookAdLibraryForCompanies", error.message);
    throw error;
  }
}

export async function getCompanyAdsOnFacebookAdLibrary(
  companyId,
  cursor = null,
  status = "all"
) {
  try {
    let url = `https://api.scrapecreators.com/v1/facebook/adLibrary/company/ads?pageId=${companyId}&status=${status}`;
    if (cursor) {
      url += `&cursor=${cursor}`;
    }
    console.log('[FB-ads] GET', url);
    const { data } = await axios.get(url, {
      headers: {
        "x-api-key": process.env.SCRAPE_CREATORS_API_KEY,
      },
      timeout: 300000,
    });
    console.log('[FB-ads] response sample:', JSON.stringify(data).slice(0,300));

    return data;
  } catch (error) {
    console.error("error at getCompanyAdsOnFacebookAdLibrary", error.message);
    throw error;
  }
}

export async function searchLinkedinAdLibrary({
  company,
  keyword,
  countries,
  startDate,
  endDate,
  paginationToken = null,
}) {
  try {
    let url = "https://api.scrapecreators.com/v1/linkedin/ads/search";
    const queryParams = [];

    if (company) {
      queryParams.push(`company=${encodeURIComponent(company)}`);
    }
    if (keyword) {
      queryParams.push(`keyword=${encodeURIComponent(keyword)}`);
    }
    if (countries) {
      queryParams.push(`countries=${encodeURIComponent(countries)}`);
    }
    if (startDate) {
      queryParams.push(`startDate=${encodeURIComponent(startDate)}`);
    }
    if (endDate) {
      queryParams.push(`endDate=${encodeURIComponent(endDate)}`);
    }
    if (paginationToken) {
      queryParams.push(
        `paginationToken=${encodeURIComponent(paginationToken)}`
      );
    }

    if (queryParams.length > 0) {
      url += `?${queryParams.join("&")}`;
    }

    const response = await axios.get(url, {
      headers: {
        "x-api-key": process.env.SCRAPE_CREATORS_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("error at searchLinkedinAdLibrary", error.message);
    throw new Error(error.message);
  }
}

export async function getLinkedinAdLibraryAdDetail(url) {
  try {
    const response = await axios.get(
      `https://api.scrapecreators.com/v1/linkedin/ad?url=${url}`,
      {
        headers: {
          "x-api-key": process.env.SCRAPE_CREATORS_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("error at getLinkedinAdLibraryAdDetail", error.message);
    throw new Error(error.message);
  }
}

export async function scrapeSubredditPosts(subreddit, sort, timeframe, after) {
  try {
    let url = `https://api.scrapecreators.com/v1/reddit/subreddit?subreddit=${subreddit}`;
    if (timeframe) {
      url += `&timeframe=${timeframe}`;
    }
    if (sort) {
      url += `&sort=${sort}`;
    }
    if (after) {
      url += `&after=${after}`;
    }
    console.log(url);
    const response = await axios.get(url, {
      headers: {
        "x-api-key": process.env.SCRAPE_CREATORS_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("error at scrapeSubredditPosts", error.message);
    console.log(error.response.data);
  }
}

export async function scrapeRedditComments(postUrl, amount = 20) {
  try {
    let url = `https://api.scrapecreators.com/v1/reddit/post/comments/simple?url=${postUrl}&amount=${amount}`;

    const response = await axios.get(url, {
      headers: {
        "x-api-key": process.env.SCRAPE_CREATORS_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("error at scrapeRedditComments", error.message);
    console.log(error.response.data);
  }
}

export async function scrapeRedditSearch(query, sort, timeframe, after) {
  try {
    let url = `https://api.scrapecreators.com/v1/reddit/search?query=${query}`;
    if (sort) {
      url += `&sort=${sort}`;
    }

    if (timeframe) {
      url += `&timeframe=${timeframe}`;
    }
    if (after) {
      url += `&after=${after}`;
    }

    const response = await axios.get(url, {
      headers: {
        "x-api-key": process.env.SCRAPE_CREATORS_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("error at scrapeRedditSearch", error.message);
    console.log(error.response.data);
    throw new Error(error.message);
  }
}

export async function scrapeInstagramProfile(handle) {
  try {
    const response = await axios.get(
      `https://api.scrapecreators.com/v1/instagram/profile?handle=${handle}`,
      {
        headers: {
          "x-api-key": process.env.SCRAPE_CREATORS_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("error at scrapeInstagramProfile", error.message);
    throw new Error(error.message);
  }
}

export async function scrapeInstagramPosts(handle) {
  try {
    const response = await axios.get(
      `https://api.scrapecreators.com/v2/instagram/posts?handle=${handle}`,
      {
        headers: {
          "x-api-key": process.env.SCRAPE_CREATORS_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("error at scrapeInstagramPosts", error.message);
    throw new Error(error.message);
  }
}

export async function scrapeTwitterProfile(handle) {
  try {
    const response = await axios.get(
      `https://api.scrapecreators.com/v1/twitter/profile?handle=${handle}`,
      {
        headers: {
          "x-api-key": process.env.SCRAPE_CREATORS_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("error at scrapeTwitterProfile", error.message);
    throw new Error(`Failed to scrape Twitter profile: ${error.message}`);
  }
}

export async function scrapeUserTweets(handle) {
  try {
    const response = await axios.get(
      `https://api.scrapecreators.com/v1/twitter/user-tweets?handle=${handle}`,
      {
        headers: {
          "x-api-key": process.env.SCRAPE_CREATORS_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("error at scrapeUserTweets", error.message);
    throw new Error(error.message);
  }
}

export async function scrapeTweet(url) {
  try {
    const response = await axios.get(
      `https://api.scrapecreators.com/v1/twitter/tweet?url=${url}`,
      {
        headers: {
          "x-api-key": process.env.SCRAPE_CREATORS_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("error at scrapeTweet", error.message);
    throw new Error(error.message);
  }
}

export async function scrapeTruthSocialPosts(handle) {
  try {
    const response = await axios.get(
      `https://api.scrapecreators.com/v1/truthsocial/user/posts?handle=${handle}`,
      {
        headers: {
          "x-api-key": process.env.SCRAPE_CREATORS_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("error at scrapeTruthSocialPosts", error.message);
    throw new Error(error.message);
  }
}
