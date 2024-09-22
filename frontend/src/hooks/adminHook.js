import axios from "axios";
import { useEffect, useState } from "react";

const DB_URL = import.meta.env.APP_URL;

const fetchAdminInfo = (jwt) => {
  const [data, setData] = useState(null);
  const [error, seterror] = useState("");

  useEffect(() => {
    const adminuserFromCache = localStorage.getItem("adminuser");
    const getData = async () => {
      if (adminuserFromCache?.length > 0) {
        setData(JSON.parse(adminuserFromCache));
        console.log("from cache");
        return;
      } else
        try {
          const response = await axios.get(
            `${DB_URL}sadmin/auth/signin?tokenId=${jwt}`
          );
          if (response.data?.user) {
            setData(response.data?.user);
            localStorage.setItem(
              "adminuser",
              JSON.stringify(response.data?.user)
            );
            console.log("from server");
          }
        } catch (err) {
          console.log(err);
          seterror(err?.message);
        }
    };
    getData();
  }, [jwt]);

  return { data, error };
};

const fetchAdminUsers = (limit, page, p) => {
  const [list, setData] = useState([]);
  const [error, seterror] = useState("");
  const [size, setSize] = useState(0);
  const getData = async () => {
    try {
      const response = await axios.get(`${DB_URL}sadmin/sudo/users`, {
        params: {
          permission: p,
          limit: limit,
          page: page,
        },

        withCredentials: true,
      });

      setData(response.data?.list);
      setSize(response.data?.size);
      seterror("");
    } catch (err) {
      console.log(err);
      seterror(err?.message);
    }
  };
  useEffect(() => {
    getData();
  }, [page, p]);
  return { list, size, error, p };
};
const fetchAdminStudents = (limit, page, p, jwt) => {
  const [list, setData] = useState([]);
  const [error, seterror] = useState("");
  const [size, setSize] = useState(0);
  const getData = async () => {
    try {
      const response = await axios.get(`${DB_URL}sadmin/sudo/students`, {
        params: {
          permission: p,
          limit: limit,
          page: page,
        },
        headers: {
          Authorization: `Token ${jwt}`,
        },
        withCredentials: true,
      });
      setData(response.data?.list);
      setSize(response.data?.size);
      seterror("");
    } catch (err) {
      console.log(err);
      seterror(err?.message);
    }
  };
  useEffect(() => {
    getData();
  }, [page, p]);
  return { list, size, error, p };
};

export { fetchAdminInfo, fetchAdminUsers, fetchAdminStudents };
