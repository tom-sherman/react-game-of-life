import React from 'react';
import { Button } from 'reakit';
import { World, nextState, toggleAlive, createWorld } from './game';

const Cell: React.FunctionComponent<{
  alive: boolean;
  size: number;
  onClick: () => void;
}> = ({ alive, onClick, size }) => (
  <Button
    as="div"
    style={{
      background: alive ? 'black' : 'white',
      width: size,
      height: size,
      border: '1px solid lightgrey',
    }}
    onClick={onClick}
  />
);

const MemoCell = React.memo(
  Cell,
  (prev, next) => prev.alive === next.alive && prev.onClick === next.onClick
);

const WorldComponent: React.FunctionComponent<{
  world: World<boolean>;
  setWorld: React.Dispatch<React.SetStateAction<World<boolean>>>;
}> = ({ world, setWorld }) => {
  return (
    <>
      {world.map((row, y) => (
        <div key={y} style={{ display: 'flex' }}>
          {row.map((cell, x) => (
            <MemoCell
              key={x}
              alive={cell}
              size={10}
              onClick={() => setWorld(toggleAlive({ x, y }, world))}
            />
          ))}
        </div>
      ))}
    </>
  );
};

const initialWorld = createWorld(50);

function App() {
  const [world, setWorld] = React.useState(initialWorld);
  const [started, setStarted] = React.useState(false);

  React.useEffect(() => {
    let interval: number;
    if (started) {
      interval = window.setInterval(() => {
        setWorld(nextState);
      }, 50);
    }

    return () => {
      window.clearInterval(interval);
    };
  }, [started]);

  return (
    <div className="App">
      <WorldComponent world={world} setWorld={setWorld} />
      <Button onClick={() => setWorld(initialWorld)}>Reset</Button>
      <Button onClick={() => setWorld(nextState)}>Next</Button>
      <Button onClick={() => setStarted((s) => !s)}>
        {started ? 'Stop' : 'Start'}
      </Button>
    </div>
  );
}

export default App;
