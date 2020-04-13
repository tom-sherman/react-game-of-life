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

const MemoCell = React.memo(Cell);

const WorldComponent: React.FunctionComponent<{
  world: World<boolean>;
  setWorld: React.Dispatch<React.SetStateAction<World<boolean>>>;
}> = ({ world, setWorld }) => {
  const composite = useCompositeState({ wrap: true });
  return (
    <Composite {...composite} role="grid" aria-label="World">
      {world.map((row, y) => (
        <CompositeGroup {...composite} key={y} style={{ display: 'flex' }}>
          {row.map((cell, x) => (
            <MemoCell
              key={x}
              x={x}
              y={y}
              alive={cell}
              size={10}
              setWorld={setWorld}
              {...composite}
            />
          ))}
        </CompositeGroup>
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
