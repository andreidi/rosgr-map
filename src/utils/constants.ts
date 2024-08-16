export const TILE_LAYER_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';
export const TILE_LAYER_ATTRIBUTION =
  'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ';
export const TILE_LAYER_MAX_ZOOM = 16;

export const ROMANIA_LATLNG = [45.9432, 24.9668];

export const BASE_GMAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=';

export const NEW_LOCATION_FORM_URL = 'https://forms.gle/GFSGPTKv5YgreLTt8';

export const FEEDBACK_FORM_URL = 'https://forms.gle/qXZ8g5rKovr6tLZM8';

export const ASSETS_CONFIG = () => {
  return {
    locationsCacheKey: 'locations-cache',
    locationsCacheTTL: 24 * 60 * 60 * 1000, // 24 hours
    geoJSON: 'assets/romania.geojson',
    geoJSONCacheKey: 'geojson-cache',
    geoJSONCacheTTL: 72 * 60 * 60 * 1000, // 72 hours
  };
};

export const SUPABASE_TABLES = () => {
  return {
    locations: 'locations',
    locationSchedules: 'location_schedules',
    locationReviews: 'location_reviews',
  };
};

export const DEFAULT_STAR_COUNTS = [
  [5, 0, 0],
  [4, 0, 0],
  [3, 0, 0],
  [2, 0, 0],
  [1, 0, 0],
];
