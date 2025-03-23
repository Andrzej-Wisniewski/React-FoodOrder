import { useEffect, useState } from 'react';

const Meals = () => {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/meals')
      .then((response) => response.json())
      .then((data) => setMeals(data))
      .catch((error) => console.error('Błąd ładowania posiłków:', error));
  }, []);

  return (
    <div>
      <h2>Nasze Menu</h2>
      <ul>
        {meals.map((meal) => (
          <li key={meal.name}>
            {meal.name} - {meal.price} PLN
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Meals;
