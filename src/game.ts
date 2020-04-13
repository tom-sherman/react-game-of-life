export type World<Cell> = readonly (readonly Cell[])[];

// The world is a two dimensional array of boolean values that represent the cell's state. true = alive, false = dead.
export function createWorld(size: number): World<boolean> {
  return Array.from<boolean[]>({ length: size }).fill(
    Array.from<boolean>({ length: size }).fill(false)
  );
}

export function nextState(world: World<boolean>): World<boolean> {
  return world.map((row, y) =>
    row.map((cell, x) => {
      const neighborhood = getNeighborhood({ x, y }, world);
      const numberOfAliveNeighbors = Object.values(neighborhood).reduce(
        (sum, val) => sum + Number(val),
        0
      );

      if (numberOfAliveNeighbors < 2) {
        return false;
      }

      if (numberOfAliveNeighbors === 3) {
        return true;
      }

      return cell && numberOfAliveNeighbors === 2;
    })
  );
}

export type Coordinate = { x: number; y: number };

type MooreNeighborhood<Cell> = {
  north: Cell;
  south: Cell;
  west: Cell;
  east: Cell;
  northEast: Cell;
  northWest: Cell;
  southEast: Cell;
  southWest: Cell;
};

export function getNeighborhood<Cell>(
  { x, y }: Coordinate,
  world: World<Cell>
): MooreNeighborhood<Cell> {
  const lastIndex = world.length - 1;

  // We want the world to wrap around on itself
  const northIndex = y - 1 < 0 ? lastIndex : y - 1;
  const southIndex = y + 1 > lastIndex ? 0 : y + 1;
  const eastIndex = x + 1 > lastIndex ? 0 : x + 1;
  const westIndex = x - 1 < 0 ? lastIndex : x - 1;

  return {
    west: world[y][westIndex],
    east: world[y][eastIndex],
    north: world[northIndex][x],
    south: world[southIndex][x],
    northEast: world[northIndex][eastIndex],
    northWest: world[northIndex][westIndex],
    southEast: world[southIndex][eastIndex],
    southWest: world[southIndex][westIndex],
  };
}

export function toggleAlive(
  coord: Coordinate,
  world: World<boolean>
): World<boolean> {
  return world.map((row, y) =>
    y !== coord.y ? row : row.map((cell, x) => (x !== coord.x ? cell : !cell))
  );
}
