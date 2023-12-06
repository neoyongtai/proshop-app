import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from "../../slices/productsApiSlice";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import FormContainer from "../../components/FormContainer";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

const ProductEditPage = () => {
  const { productId } = useParams();
  const [data, setData] = useState({
    name: "",
    price: "",
    image: "",
    brand: "",
    category: "",
    countInStock: 0,
    description: "",
  });
  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsQuery(productId);
  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();
  const [uploadProductImage, { isLoading: loadingUpload }] =
    useUploadProductImageMutation();
  const navigate = useNavigate();
  useEffect(() => {
    if (product) {
      setData(product);
    }
  }, [product]);
  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setData({ ...data, image: res.image });
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    const res = await updateProduct({ ...data, productId }).unwrap();
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Product updated");
      navigate("/admin/productlist");
    }
  };
  return (
    <>
      <Link to="/admin/productlist" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name" className="my-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Name"
                value={data.name}
                name="name"
                onChange={changeHandler}
              />
            </Form.Group>
            <Form.Group controlId="price" className="my-2">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Price"
                value={data.price}
                name="price"
                onChange={changeHandler}
              />
            </Form.Group>
            <Form.Group controlId="image" className="my-2">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image url"
                value={data.image}
                name="image"
                onChange={changeHandler}
              />
              <Form.Control
                type="file"
                label="Choose file"
                onChange={uploadFileHandler}
              />
            </Form.Group>
            <Form.Group controlId="brand" className="my-2">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Brand"
                value={data.brand}
                name="brand"
                onChange={changeHandler}
              />
            </Form.Group>
            <Form.Group controlId="countInStock" className="my-2">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Count In Stock"
                value={data.countInStock}
                name="countInStock"
                onChange={changeHandler}
              />
            </Form.Group>
            <Form.Group controlId="category" className="my-2">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Category"
                value={data.category}
                name="category"
                onChange={changeHandler}
              />
            </Form.Group>
            <Form.Group controlId="description" className="my-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter Description"
                value={data.description}
                name="description"
                onChange={changeHandler}
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="my-2">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditPage;
