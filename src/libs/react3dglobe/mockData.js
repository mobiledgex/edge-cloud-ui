import shortid from 'shortid';

const getId = () => shortid.generate();

const MOCK_DATA = {
  barcelona: {
    lat: 41.383,
    long: 2.183,
    city: 'Barcelona',
  },
  hamburg: {
    lat: 53.583,
    long: 9.983,
    city: 'Hamburg',
  },
  frankfurt: {
    lat: 50.1,
    long: 8.683,
    city: 'Frankfurt',
  },



};

const getRandomValue = (low, high) => {
  // favor lower values
  return Math.random() > 0.8
    ? Math.floor(Math.random() * high)
    : Math.floor(Math.random() * low);
};

export const getMockData = (color, type) => {
  return Object.values(MOCK_DATA)
    .map(d => ({
      ...d,
      id: getId(),
      color,
      type,
      value: getRandomValue(200, 1000),
      size: 20,
    }))
    .filter(d => Math.random() > 0);
};
