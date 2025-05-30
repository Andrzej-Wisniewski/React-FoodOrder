export default function Reviews({ mealId }) {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        fetch(`/api/meals/${mealId}/reviews`)
            .then(res => res.json())
            .then(setReviews);
    }, [mealId]);

    return (
        <div className="reviews">
            <h3>Opinie</h3>
            {reviews.map((r, idx) => (
                <div key={idx}>
                    <strong>{r.userName}</strong>({r.rating}/5):
                    <p>{r.comment}</p>
                </div>
            ))}
        </div>
    );
}