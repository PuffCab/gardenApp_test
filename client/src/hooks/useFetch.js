import { useEffect, useState } from "react";
import { serverURL } from "../utils/serverURL";

function useFetch(_id) {
  const [plant, setPlant] = useState(null);
  const [plants, setPlants] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const url = _id
    ? `${serverURL}/api/plants/${_id}`
    : `${serverURL}/api/plants/all`;

  async function fetchData() {
    try {
      setIsLoading(true);
      const response = await fetch(url);
      console.log("respones", response);
      const data = await response.json();
      // console.log("data.allPlants", data.allPlants);
      if (_id) {
        setPlant(data);
      } else {
        setPlants(data.allPlants);
      }
      setIsLoading(false);
    } catch (error) {
      console.log("error :>> ", error);
      setError(error);
      setIsLoading(false);
    }
  }
  return { plant, plants, error, isLoading, setPlants, fetchData };
}

export default useFetch;
