import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import useFetch from "../hooks/useFetch";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../store/AuthContext";
import { getToken } from "../utils/getToken";
import { serverURL } from "../utils/serverURL";

function Pdp() {
  const { _id } = useParams();
  console.log("useParams()", useParams());
  const { plant, error, isLoading, fetchData } = useFetch(_id); // add plant to pass it from useFetch but an array
  console.log("plant", plant);
  const [selectedPlant, setSelectedPlant] = useState(null);
  console.log("selctedPlant", selectedPlant);
  const [showModal, setShowModal] = useState(false);
  const [newComment, setNewComment] = useState({
    text: "",
    author: "",
    authorPicture: "",
  });
  const [inputText, setInputText] = useState("");
  const [updatedComments, setUpdatedComments] = useState({});
  const [commentAuthor, setCommentAuthor] = useState("");

  const { loggedinUser } = useContext(AuthContext);
  console.log("%cloggedinUser", "color:orange", loggedinUser);
  const redirectTo = useNavigate();

  console.log("loggedinUser.userName", loggedinUser.userName);
  // console.log("commentAuthor", commentAuthor);

  const handleDeletePlant = async () => {
    const token = getToken();
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

      const urlencoded = new URLSearchParams();
      urlencoded.append("_id", selectedPlant._id);
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        body: urlencoded,
      };

      const response = await fetch(
        `${serverURL}/api/plants/all`,
        requestOptions
      );
      const result = await response.json();
      // redirectTo = "/";
      console.log(result);
    } catch (error) {
      console.log("error", error);
    } finally {
      fetchData();
      // setSelectedPlant(null);
      setShowModal(false);
      redirectTo("/");
    }
  };

  //post comment
  const handleInputChange = (e) => {
    console.log("e.target.name, e.target.value", e.target.name, e.target.value);
    setInputText(e.target.value);
    setNewComment({
      ...newComment,
      text: e.target.value,
    });
  };

  const handleComment = async () => {
    const token = getToken();

    try {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

      const urlencoded = new URLSearchParams();
      urlencoded.append("text", inputText /* && newComment.text */);
      console.log("newComment.text", newComment.text);

      const requestOptions2 = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
        redirect: "follow",
      };

      const response = await fetch(
        `${serverURL}/api/plants/${_id}/comments`,
        requestOptions2
      );
      const result = await response.json();
      console.log(result);
      if (result.msg === "comment submitted") {
        // const updatedComments = [...selectedPlant.comments, newComment];
        fetchData();
        // setUpdatedComments(result.plant.comments);
        // setSelectedPlant({
        //   ...selectedPlant,
        //   comments: result.plant.comments,
        // });
        setInputText("");
      }
    } catch (error) {
      console.log("something went wrong", error);
    }
  };

  //delete comment
  const handleDeleteComment = async (comment) => {
    const token = getToken();

    try {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      myHeaders.append("Content-Type", "application/json");

      console.log("comment._id :>> ", comment._id);

      const raw = JSON.stringify({
        commentId: comment._id,
      });

      if (!comment._id) {
        console.log("comment._id is undefined");
        return;
      }

      const requestOptions3 = {
        method: "DELETE",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        `${serverURL}/api/plants/${_id}/comments`,
        requestOptions3
      );
      const result = await response.json();
      fetchData();

      // setUpdatedComments(result.plant.comments);
      // setSelectedPlant({
      //   ...selectedPlant,
      //   comments: result.plant.comments,
      // });
    } catch (error) {
      console.log("error", error);
    } finally {
      setShowModal(false);
    }
  };

  useEffect(() => {
    if (plant) {
      setSelectedPlant(plant.plantById[0]);
      setUpdatedComments(plant.plantById[0].comments);
    }
  }, [plant]);

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        selectedPlant && (
          <>
            <div className="container">
              {loggedinUser.email === selectedPlant.userEmail && (
                <>
                  <Button variant="danger" onClick={() => setShowModal(true)}>
                    Delete Plant
                  </Button>
                  <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                      <Modal.Title>Confirm Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      Are you sure you want to delete this plant?
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        variant="secondary"
                        onClick={() => setShowModal(false)}
                      >
                        Cancel
                      </Button>
                      <Button variant="danger" onClick={handleDeletePlant}>
                        Delete
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </>
              )}

              <h1 className=" h1-pdp text-center"> {selectedPlant.name}</h1>
              <div className="product-img-container">
                <img
                  className="container d-flex justify-content-center"
                  alt="plant image"
                  src={selectedPlant.image}
                  style={{ height: "30em", width: "auto" }}
                ></img>
              </div>
              <p>Author: {selectedPlant.userName}</p>
              <p>Description: {selectedPlant.description}</p>
              <h5>Germinating month: {selectedPlant.germinating_season} </h5>
              <h5>Harvest month: {selectedPlant.harvest} </h5>
              <div className=" align-items-baseline">
                {/* <Button variant="primary">Save Me</Button> */}
              </div>
            </div>

            <h2 className="text-center">
              {" "}
              Post a comment or a question for : {selectedPlant.name}
            </h2>
            <div className="comment-section container">
              {selectedPlant.comments &&
                selectedPlant.comments.map((comment, i) => {
                  return (
                    <div className="comment text-center" key={comment._id}>
                      <img
                        src={comment.authorPicture}
                        alt="Avatar"
                        className="comment-avatar"
                        style={{
                          width: "100px",
                          borderRadius: "50%",
                          aspectRatio: "1/1",
                          objectFit: "cover",
                        }}
                      ></img>
                      <div className="comment-detail">
                        <p> Author: {comment.author}</p>
                        <p> Comment: {comment.text}</p>
                      </div>
                      {comment.author === loggedinUser.userName ? (
                        <>
                          <Button
                            variant="danger"
                            onClick={() => setShowModal(true)}
                            className="delete-comment"
                          >
                            Delete Comment
                          </Button>
                          <Modal
                            show={showModal}
                            onHide={() => setShowModal(false)}
                          >
                            <Modal.Header closeButton>
                              <Modal.Title>Confirm Delete</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              Are you sure you want to delete your comment?
                            </Modal.Body>
                            <Modal.Footer>
                              <Button
                                variant="secondary"
                                onClick={() => setShowModal(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="danger"
                                onClick={
                                  () => handleDeleteComment(comment)
                                  // selectedPlant.comments[0]
                                }
                              >
                                Delete
                              </Button>
                            </Modal.Footer>
                          </Modal>
                        </>
                      ) : null}
                    </div>
                  );
                })}
              <div className="text-center input-comment">
                <input
                  type="text"
                  className="text-center"
                  value={inputText}
                  onChange={handleInputChange}
                />

                {loggedinUser ? (
                  <Button
                    variant="dark"
                    className="comment-button"
                    onClick={() => handleComment()}
                  >
                    Submit
                  </Button>
                ) : (
                  <Link to="/login">
                    <Button variant="dark"> login first</Button>
                  </Link>
                )}
              </div>
            </div>

            {/* ) : (
       <p>No plant found</p>
       )}
       {/* {error && <Navigate to="*" />} */}
            {/* {error && <p>No plant with this id</p>} */}
          </>
        )
      )}
    </>
  );
}

export default Pdp;
