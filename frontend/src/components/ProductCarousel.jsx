import { Link } from "react-router-dom";
import { useGetTopProductsQuery } from "../slices/productsApiSlice";
import { Carousel, Image } from "react-bootstrap";
import Loader from "./Loader";
import Message from "./Message";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();
  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error?.data?.message || error.error}</Message>
  ) : (
    <Carousel pause="hover" className="bg-dark mb-4">
      {products.map((product) => (
        <Carousel.Item key={product._id} className="text-center">
          <Link to={`/product/${product._id}`}>
            <Image src={product.image} alt={product.name} fluid />
            <Carousel.Caption className="carousel-caption">
              <h2>
                {product.name} (${product.price})
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;
