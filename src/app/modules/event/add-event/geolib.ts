import * as x from 'geolib';

// @types/geolib is written in a way that `import * as geolib from 'geolib';` does not work
type geolibType = typeof geolib;
const theGeolib = (x as any).default as geolibType;

export { theGeolib as geolib };