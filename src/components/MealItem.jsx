import { useContext } from "react";
import { currencyFormatter } from "../util/formatting";
import Button from "./UI/Button";
import CartContext from "../store/CartContext";

export default function MealItem({ meal }) {
    const cartCtx = useContext(CartContext);

    function handleAddMealToCart() {
        cartCtx.addItem({
            id: meal._id,
            name: meal.name,
            price: meal.price,
            image: meal.image,
            quantity: 1
        });
    }

    return (
        <li className="meal-item">
            <article>
                <img src={meal.image} alt={meal.name} loading="lazy" />
                <div>
                    <h3>{meal.name}</h3>
                    <p className="meal-item-price">{currencyFormatter.format(meal.price)}</p>
                    <p className="meal-item-description">{meal.description}</p>
                </div>
                <p className="meal-item-actions">
                    <Button onClick={handleAddMealToCart}>Dodaj do koszyka</Button>
                </p>
            </article>
        </li>
    );
}