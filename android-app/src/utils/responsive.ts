import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

export const wp = (percentage: number): number => {
  return PixelRatio.roundToNearestPixel((SCREEN_WIDTH * percentage) / 100);
};

export const hp = (percentage: number): number => {
  return PixelRatio.roundToNearestPixel((SCREEN_HEIGHT * percentage) / 100);
};

export const scale = (size: number): number => {
  return PixelRatio.roundToNearestPixel((SCREEN_WIDTH / BASE_WIDTH) * size);
};

export const verticalScale = (size: number): number => {
  return PixelRatio.roundToNearestPixel((SCREEN_HEIGHT / BASE_HEIGHT) * size);
};

export const moderateScale = (size: number, factor = 0.5): number => {
  return PixelRatio.roundToNearestPixel(size + (scale(size) - size) * factor);
};

export const screen = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmall: SCREEN_WIDTH < 360,
  isMedium: SCREEN_WIDTH >= 360 && SCREEN_WIDTH < 414,
  isLarge: SCREEN_WIDTH >= 414,
};
