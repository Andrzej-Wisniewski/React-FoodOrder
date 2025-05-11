import { memo } from 'react';
import useHttp from '../hooks/useHttp';
import MealItem from './MealItem';
import Error from './UI/Error';

const Meals = memo(function Meals() {
  const { 
    data: loadedMeals, 
    isLoading, 
    error 
  } = useHttp('/meals', { method: 'GET' }, []);

  if (isLoading) {
    return <p className="center">Ładowanie dań...</p>;
  }

  if (error) {
    return <Error title="Failed to fetch meals" message={error} />;
  }

  return (
    <ul id="meals">
      {loadedMeals?.map((meal) => (
        <MealItem key={meal._id} meal={{ ...meal, id: meal._id }} />
      ))}
    </ul>
  );
});

export default Meals;