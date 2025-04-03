export const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-MA", {
        style: "currency",
        currency: "MAD"
    }).format(price);
};