import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, reset } from '../redux/counterSlice';

function ReduxCounter() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div>
      <h1>Redux Counter</h1>

      <h2>{count}</h2>

      <button onClick={() => dispatch(increment())}>
        Add
      </button>

      <button onClick={() => dispatch(decrement())}>
        Decrease
      </button>

      <button onClick={() => dispatch(reset())}>
        Reset
      </button>
    </div>
  );
}

export default ReduxCounter;
