import { memo, useMemo } from "react";
import useHttp from "../hooks/useHttp";
import MealItem from "./MealItem";
import Error from "./UI/Error";

const CATEGORY_ORDER = [
  "Przystawka",
  "Zupa",
  "Danie główne",
  "Deser",
  "Napoje",
];

const Meals = memo(function Meals() {
  const config = useMemo(() => ({ method: "GET" }), []);
  
  const {
    data: loadedMeals,
    isLoading,
    error,
  } = useHttp("/api/meals", config, []);

  if (isLoading) {
    return <p className="center">Ładowanie dań…</p>;
  }

  if (error) {
    return <Error title="Błąd ładowania dań" message={error} />;
  }

   const mealsByCategory = loadedMeals.reduce((acc, meal) => {
    const cat = meal.category || "Inne";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(meal);
    return acc;
  }, {});

   return (
    <>
      {CATEGORY_ORDER.map((category) => {
        const mealsInCategory = mealsByCategory[category];
        if (!mealsInCategory || mealsInCategory.length === 0) return null;

        return (
          <section key={category}>
            <h2 style={{ textAlign: "center", color: "#ffc404" }}>{category}</h2>
            <ul id="meals">
              {mealsInCategory.map((meal) => (
                <MealItem key={meal._id} meal={meal} />
              ))}
            </ul>
          </section>
        );
      })}
    </>
  );
});


export default Meals;
