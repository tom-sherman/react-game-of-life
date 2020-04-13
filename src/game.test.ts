import { getNeighborhood, nextState, parseWorld } from './game';

describe('getNeighborhood', () => {
  test('get neighborhood when it fits within the world bounds', () => {
    const world = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    const neighborhood = getNeighborhood({ x: 1, y: 1 }, world);

    expect(neighborhood.north).toBe(2);
    expect(neighborhood.east).toBe(6);
    expect(neighborhood.south).toBe(8);
    expect(neighborhood.west).toBe(4);
    expect(neighborhood.northWest).toBe(1);
    expect(neighborhood.northEast).toBe(3);
    expect(neighborhood.southEast).toBe(9);
    expect(neighborhood.southWest).toBe(7);
  });

  test('get neighborhood when the neighbors wrap on x', () => {
    const world = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    const neighborhood = getNeighborhood({ x: 0, y: 1 }, world);

    expect(neighborhood.north).toBe(1);
    expect(neighborhood.east).toBe(5);
    expect(neighborhood.south).toBe(7);
    expect(neighborhood.west).toBe(6);
    expect(neighborhood.northWest).toBe(3);
    expect(neighborhood.northEast).toBe(2);
    expect(neighborhood.southEast).toBe(8);
    expect(neighborhood.southWest).toBe(9);
  });

  test('get neighborhood when the neighbors wrap on y', () => {
    const world = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    const neighborhood = getNeighborhood({ x: 1, y: 0 }, world);

    expect(neighborhood.north).toBe(8);
    expect(neighborhood.east).toBe(3);
    expect(neighborhood.south).toBe(5);
    expect(neighborhood.west).toBe(1);
    expect(neighborhood.northWest).toBe(7);
    expect(neighborhood.northEast).toBe(9);
    expect(neighborhood.southEast).toBe(6);
    expect(neighborhood.southWest).toBe(4);
  });

  test('get neighborhood when the neighbors wrap on x and y', () => {
    const world = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    const neighborhood = getNeighborhood({ x: 0, y: 0 }, world);

    expect(neighborhood.north).toBe(7);
    expect(neighborhood.east).toBe(2);
    expect(neighborhood.south).toBe(4);
    expect(neighborhood.west).toBe(3);
    expect(neighborhood.northWest).toBe(9);
    expect(neighborhood.northEast).toBe(8);
    expect(neighborhood.southEast).toBe(5);
    expect(neighborhood.southWest).toBe(6);
  });
});

describe('nextState', () => {
  const mapWorld = (row: number[]) => row.map((cell) => Boolean(cell));
  test('still lifes dont move', () => {
    const block = [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ].map(mapWorld);

    expect(nextState(block)).toEqual(block);

    const beehive = [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 0, 0],
      [0, 1, 0, 0, 1, 0],
      [0, 0, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ].map(mapWorld);

    expect(nextState(beehive)).toEqual(beehive);
  });

  test('oscilators', () => {
    const blinkerPhase1 = [
      [0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0],
    ].map(mapWorld);

    const blinkerPhase2 = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ].map(mapWorld);

    expect(nextState(blinkerPhase1)).toEqual(blinkerPhase2);
    expect(nextState(blinkerPhase2)).toEqual(blinkerPhase1);
  });
});
