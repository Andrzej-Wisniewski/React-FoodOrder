import useHttp from '../hooks/useHttp';
import Error from './UI/Error';
import MealItem from './MealItem';

const requestConfig = {}; 

export default function Meals() {
    const {
        data: loadedMeals,
        isLoading,
        error,
    } = useHttp('http://localhost:3000/meals', requestConfig, []);

    if (isLoading) {
        return <p className='center'>Pobieranie posiłków...</p>;
    }

    if (error) {
        return <Error title='Nie udało się pobrać posiłków' message={error} />
    }

    return (
        <ul id='meals'>
            {loadedMeals.map((meal) => (
                <MealItem key={meal.id} meal={meal} />
            ))} 
        </ul>
    )
}