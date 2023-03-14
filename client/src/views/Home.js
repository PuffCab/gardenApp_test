import React, { useContext, useEffect, useState } from "react";
import PlantCard from "../components/PlantCard";
import { PlantsContext } from "../store/PlantsContext";
import { Button, Modal, Form } from "react-bootstrap";
import { getToken } from "../utils/getToken";
import useFetch from "../hooks/useFetch";

function Home() {
  const [harvestMonth, setHarvestMonth] = useState("");
  const [germinationMonth, setGerminationMonth] = useState("");
  const [newPlant, setNewPlant] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    name: "",
    description: "",
    germinating_season: "",
    harvest: "",
    image: "",
  });

  const { plants, fetchData } = useFetch();
  console.log("Home data", plants);

  useEffect(() => {
    fetchData();
  }, []);

  const token = getToken();

  // Filter plants by harvest and germination months
  const handleGerminationMonthChange = (event) => {
    const value = event.target.value;
    setGerminationMonth(value === "All" ? "" : value);
    if (harvestMonth !== "") {
      setHarvestMonth("");
    }
  };

  const handleHarvestMonthChange = (event) => {
    const value = event.target.value;
    setHarvestMonth(value === "All" ? "" : value);
    if (germinationMonth !== "") {
      setGerminationMonth("");
    }
  };

  const filteredPlants = plants.filter((plant) => {
    if (harvestMonth && plant.harvest !== harvestMonth) {
      return false;
    }
    if (germinationMonth && plant.germinating_season !== germinationMonth) {
      return false;
    }
    return true;
  });

  // Generate options for harvest and germination months
  const harvestMonthOptions = [
    ...new Set(plants.map((plant) => plant.harvest)),
  ];
  const germinationMonthOptions = [
    ...new Set(plants.map((plant) => plant.germinating_season)),
  ];

  // Add new Plant

  const handleInputChangeModal = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    console.log("formData", formData);
  };

  const AddPlant = async (event) => {
    const token = getToken();
    event.preventDefault();
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const raw = JSON.stringify({
      userName: newPlant.userName,
      name: newPlant.name,
      description: newPlant.description,
      germinating_season: newPlant.germinating_season,
      harvest: newPlant.harvest,
      image: newPlant.image,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };
    try {
      const response = await fetch(
        "http://localhost:5003/api/plants/all",
        requestOptions
      );
      const data = await response.json();
      console.log(data);
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setNewPlant(formData);
  }, [formData]);

  return (
    <div className="home-page">
      <div className="container ">
        <h1 className="text-center">Welcome to your Garden App</h1>
        <h2 className="text-center">discover, communicate, plant</h2>
        <br />
        {/* Dropdown Filters */}
        <div className="row g-3">
          <div className="col-auto">
            <label
              htmlFor="harvest-month-select"
              className="form-label"
              style={{ color: "white" }}
            >
              Harvest Month
            </label>
            <select
              id="harvest-month-select"
              className="form-select"
              value={harvestMonth}
              onChange={handleHarvestMonthChange}
              // onChange={(e) => setHarvestMonth(e.target.value)}
            >
              <option value="">All</option>
              {harvestMonthOptions.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div className="col-auto">
            <label
              htmlFor="germination-month-select"
              className="form-label"
              style={{ color: "white" }}
            >
              Germination Month
            </label>
            <select
              id="germination-month-select"
              className="form-select"
              value={germinationMonth}
              onChange={handleGerminationMonthChange}
              // onChange={(e) => setGerminationMonth(e.target.value)}
            >
              <option value="">All</option>
              {germinationMonthOptions.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        </div>
        <br />
        {/* Modal */}
        <div>
          {token ? (
            <>
              {" "}
              <Button onClick={() => setShowModal(true)}>Add Plant</Button>
              <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Add New Plant</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group controlId="formName">
                      <Form.Label>Name of the Plant</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="Enter plant name"
                        value={formData.name}
                        onChange={handleInputChangeModal}
                      />
                    </Form.Group>

                    <Form.Group controlId="formDescription">
                      <Form.Label>Description or Questions</Form.Label>
                      <Form.Control
                        type="text"
                        name="description"
                        placeholder="Enter plant description"
                        value={formData.description}
                        onChange={handleInputChangeModal}
                      />
                    </Form.Group>

                    <Form.Group controlId="formGerminatingSeason">
                      <Form.Label>Germinating Month</Form.Label>
                      <Form.Control
                        type="text"
                        name="germinating_season"
                        placeholder="Enter germinating month"
                        value={formData.germinating_season}
                        onChange={handleInputChangeModal}
                      />
                    </Form.Group>

                    <Form.Group controlId="formHarvest">
                      <Form.Label>Harvest Month</Form.Label>
                      <Form.Control
                        type="text"
                        name="harvest"
                        placeholder="Enter harvest month"
                        value={formData.harvest}
                        onChange={handleInputChangeModal}
                      />
                    </Form.Group>

                    <Form.Group controlId="formImage">
                      <Form.Label>Image URL</Form.Label>
                      <Form.Control
                        type="text"
                        name="image"
                        placeholder="Enter image URL"
                        value={formData.image}
                        onChange={handleInputChangeModal}
                      />
                    </Form.Group>
                  </Form>
                  <Button variant="primary" onClick={AddPlant}>
                    Submit
                  </Button>
                </Modal.Body>
              </Modal>
            </>
          ) : (
            <p>Plesae Log in to add a plant</p>
          )}
        </div>

        <br />
        {/* Displaying Plants */}
        <div className="g-4 row row-cols-md-4 row-cols-1 ">
          {plants &&
            filteredPlants.map((plant, index) => {
              return (
                <div key={plant._id}>
                  <PlantCard plant={plant} />
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default Home;
