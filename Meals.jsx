import { memo, useMemo } from 'react';
import useHttp from '../hooks/useHttp';
import MealItem from './MealItem';
import Error from './UI/Error';

const Meals = memo(function Meals() {
  const config = useMemo(() => ({ method: 'GET' }), []);

  const {
    data: loadedMeals,
    isLoading,
    error
  } = useHttp('/api/meals', config, []);

  if (isLoading) {
    return <p className="center">Ładowanie dań…</p>;
  }

  if (error) {
    return <Error title="Błąd ładowania dań" message={error} />;
  }

  return (
    <ul id="meals">
      {loadedMeals.map(meal => (
        <MealItem key={meal._id} meal={meal} />
      ))}
    </ul>
  );
});

export default Meals;
