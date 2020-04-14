import React from 'react';
import {
  Button,
  unstable_Composite as Composite,
  unstable_CompositeGroup as CompositeGroup,
  unstable_CompositeItem as CompositeItem,
  unstable_useCompositeState as useCompositeState,
  unstable_CompositeStateReturn as CompositeStateReturn,
} from 'reakit';
import { World, nextState, toggleAlive, createWorld } from './game';
import './App.css';

const Cell: React.FunctionComponent<
  CompositeStateReturn & {
    id: string;
    alive: boolean;
    size: number;
    x: number;
    y: number;
    setWorld: React.Dispatch<React.SetStateAction<World<boolean>>>;
  }
> = ({ alive, size, x, y, setWorld, ...props }) => (
  <CompositeItem
    as="div"
    className="Cell"
    style={{
      background: alive ? 'black' : 'white',
      width: size,
      height: size,
    }}
    onClick={() => setWorld((world) => toggleAlive({ x, y }, world))}
    {...props}
  />
);

const MemoCell = React.memo(Cell, (prev, next) => {
  if (prev.alive !== next.alive) return false;
  if (prev.size !== next.size) return false;
  if (prev.x !== next.x) return false;
  if (prev.y !== next.y) return false;
  if (prev.id !== next.id) return false;
  if (next.id === prev.currentId || next.id === next.currentId) return false;
  return true;
});

const Row: React.FunctionComponent<
  CompositeStateReturn & {
    id: string;
    row: readonly boolean[];
    currentGroupId?: string | null;
    y: number;
    setWorld: React.Dispatch<React.SetStateAction<World<boolean>>>;
  }
> = ({ row, currentGroupId, setWorld, y, ...props }) => {
  return (
    <CompositeGroup style={{ display: 'flex' }} {...props}>
      {row.map((cell, x) => (
        <MemoCell
          {...props}
          key={x}
          id={`cell-${y}-${x}`}
          x={x}
          y={y}
          alive={cell}
          size={10}
          setWorld={setWorld}
        />
      ))}
    </CompositeGroup>
  );
};

const MemoRow = React.memo(Row, (prev, next) => {
  if (prev.row !== next.row) return false;
  if (prev.y !== next.y) return false;
  const prevGroupId = prev.currentGroupId;
  const nextGroupId = next.currentGroupId;
  if (prev.id !== next.id) return false;
  if (next.id === prevGroupId || next.id === nextGroupId) return false;
  return true;
});

const WorldComponent: React.FunctionComponent<{
  world: World<boolean>;
  setWorld: React.Dispatch<React.SetStateAction<World<boolean>>>;
}> = ({ world, setWorld }) => {
  const composite = useCompositeState({ wrap: true });
  const currentItem = React.useMemo(
    () => composite.items.find((item) => item.id === composite.currentId),
    [composite.items, composite.currentId]
  );
  return (
    <Composite {...composite} role="grid" aria-label="World">
      {world.map((row, y) => (
        <MemoRow
          {...composite}
          key={y}
          id={`row-${y}`}
          y={y}
          row={row}
          currentGroupId={currentItem && currentItem.groupId}
          setWorld={setWorld}
        />
      ))}
    </Composite>
  );
};

const initialWorld = createWorld(50);

function App() {
  const [world, setWorld] = React.useState(initialWorld);
  const [started, setStarted] = React.useState(false);
  const [simSpeed, setSimSpeed] = React.useState(50);

  React.useEffect(() => {
    let interval: number;
    if (started) {
      interval = window.setInterval(() => {
        setWorld(nextState);
      }, simSpeed);
    }

    return () => {
      window.clearInterval(interval);
    };
  }, [started, simSpeed]);

  return (
    <div className="App">
      <WorldComponent world={world} setWorld={setWorld} />
      <div>
        <Button onClick={() => setWorld(initialWorld)}>Reset</Button>
        <Button onClick={() => setWorld(nextState)}>Next</Button>
        <Button onClick={() => setStarted((s) => !s)}>
          {started ? 'Stop' : 'Start'}
        </Button>
      </div>
      <label>
        Simulation speed: {simSpeed}ms
        <input
          type="range"
          min={20}
          max={500}
          step="5"
          value={simSpeed}
          onChange={(event) => setSimSpeed(parseInt(event.target.value))}
        />
      </label>
    </div>
  );
}

export default App;
