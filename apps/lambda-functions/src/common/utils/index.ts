import { UserType } from '../types';

export const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; // The +1 ensures the max is inclusive
};

export const getRandomMove = (user1: UserType, user2: UserType): string => {
  const idArray = [user1.id, user2.id] as string[];
  const number = getRandomInt(0, 1);
  return idArray[number];
};

export const getCurrentTime = () => {
  return new Date().getTime();
};

export const isAlive = (live: number) => {
  return getCurrentTime() - live < 5000;
};
