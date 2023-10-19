
export const isLatitude = (latitude: number) => isFinite(latitude) && Math.abs(latitude) <= 90

export const isLongitude = (longitude: number) => isFinite(longitude) && Math.abs(longitude) <= 180;

export const areValidCoordinates = (longitude: number, latitude: number) => {
    return isLongitude(longitude) && isLatitude(latitude);
};