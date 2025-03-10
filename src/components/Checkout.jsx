import { useContext, useActionState } from "react";

import CartContext from "../store/CartContext";
import Modal from "./UI/Modal";
import { currencyFormatter } from "../util/formatting";
import Input from "./UI/Input";
import Button from "./UI/Button";
import UserProgressContext from "../store/UserProgressContext";
import useHttp from "../hooks/useHttp";
import Error from "./UI/Error";

const requestConfig = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
};

export default function Checkout() {
    const cartCtx = useContext(CartContext);
    const userProgressCtx = useContext(UserProgressContext);

    const { 
        data, 
        error, 
        sendRequest,
        clearData
     } = useHttp(
        'http://localhost:3000/orders', requestConfig
    );

    const cartTotal = cartCtx.items.reduce(
        (totalPrice, item) => totalPrice + item.quantity * item.price, 0
    );

    function handleClose() {
        userProgressCtx.hideCheckout();
    }

    function handleFinish() {
        userProgressCtx.hideCheckout(); 
        cartCtx.clearCart();
        clearData();
    }

    async function checkoutAction(prevState, fd) {
        const customerData = Object.fromEntries(fd.entries()); 

        await sendRequest(JSON.stringify({
            order: {
                items: cartCtx.items,
                customer: customerData
            },
        })
        ); 
    }

    const [formState, formAction, isSending] = useActionState(checkoutAction, null);

    let actions = (
        <>
            <Button type="button" textOnly onClick={handleClose}>Zamknij</Button>
            <Button>Złóż zamówienie</Button>
        </>
    );

    if (isSending) {
        actions = <span>Wysyłanie danych zamówienia...</span>;
    }

    if (data && !error) {
        return (
        <Modal open={userProgressCtx.progress === 'checkout'} 
            onClose={handleFinish}
        >
            <h2>Sukces!</h2>
            <p>Twoje zamówienie zostało pomyślnie złożone.</p>
            <p>W ciągu kilku minut wyślemy do Ciebie e-mail z dalszymi szczegółami.</p>
            <p className='modal-actions'>
                <Button onClick={handleFinish}>Okay</Button>
            </p>
        </Modal>
        )}

    return (
        <Modal 
            open={userProgressCtx.progress === 'checkout'} 
            onClose={handleClose}
        >
            <form onAction={formAction}>
                <h2>Zamówienie</h2>
                <p>Całkowita kwota: {currencyFormatter.format(cartTotal)}</p>
                <Input label="Imię i Nazwisko" type="text" id="name" />
                <Input label="E-Mail" type="email" id="email" />
                <Input label="Ulica" type="text" id="street" />
                <div className="control-row">
                    <Input label="Kod Pocztowy" type="text" id="postal-code" />
                    <Input label="Miasto" type="text" id="city" />
                </div>
                {error && <Error title='Failed to submit order' message={error} />}
                <p className="modal-actions">{actions}</p>
            </form>
        </Modal>
    );
}