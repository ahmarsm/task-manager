
import { useSelector } from 'react-redux';

function CounterDisplay() {
  const count = useSelector((state) => state.counter.value);

  return (
    <div>
      <h3>Counter Display Component</h3>
      <p>Shared counter value: {count}</p>
    </div>
  );
}

export default CounterDisplay;
