const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const SEARCH_ENDPOINT = 'https://api.spotify.com/v1/search';
const ALBUM_ENDPOINT = 'https://api.spotify.com/v1/albums';

const getAccessToken = async () => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
    }),
  });

  return response.json();
};

export const searchAlbums = async (query: string) => {
  const { access_token } = await getAccessToken();

  const response = await fetch(
    `${SEARCH_ENDPOINT}?q=${encodeURIComponent(query)}&type=album&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  const data = await response.json();
  return data.albums.items;
};

export const getAlbum = async (albumId: string) => {
  const { access_token } = await getAccessToken();

  const response = await fetch(`${ALBUM_ENDPOINT}/${albumId}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  return response.json();
}; 