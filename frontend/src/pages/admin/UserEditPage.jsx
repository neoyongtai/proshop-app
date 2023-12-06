import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from "../../slices/usersApiSlice";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import FormContainer from "../../components/FormContainer";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

const UserEditPage = () => {
  const { userId } = useParams();
  const [data, setData] = useState({
    name: "",
    email: "",
    isAdmin: false,
  });
  const {
    data: user,
    refetch,
    isLoading,
    error,
  } = useGetUserDetailsQuery(userId);
  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      setData(user);
    }
  }, [user]);
  const changeHandler = (e) => {
    setData({
      ...data,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    const res = await updateUser({ ...data, userId });
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("User updated");
      navigate("/admin/userlist");
    }
  };
  return (
    <>
      <Link to="/admin/userlist" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit User</h1>
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
            <Form.Group controlId="email" className="my-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Email"
                value={data.email}
                name="email"
                onChange={changeHandler}
              />
            </Form.Group>
            <Form.Group controlId="isAdmin" className="my-2">
              <Form.Check
                type="checkbox"
                label="Is Admin"
                checked={data.isAdmin}
                name="isAdmin"
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

export default UserEditPage;
