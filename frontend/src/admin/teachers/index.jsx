import React, { useEffect, useState } from "react";
import { fetchAdminUsers } from "../../hooks/adminHook";
import axios from "axios";
import { useOutletContext } from "react-router-dom";

function AllTeachers() {
  const [page, setPage] = useState(1);
  const [searchFilter, setFilter] = useState("");

  const { data } = useOutletContext();

  const [msg, setMsg] = useState("");
  const { list, size, error, p } = fetchAdminUsers(
    10,
    page,
    data?.role == "sudo-admin" && data?.permission
  );
  const [updateStatus, setStatus] = useState(null);
  // console.log(data);

  const handleUpdate = async (userObjectId, permission) => {
    try {
      const DB_URL = import.meta.env.APP_URL;
      const up = await axios.patch(
        `${DB_URL}sadmin/sudo/users/${userObjectId}`,
        {
          permission: permission,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setStatus(up.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (list.length > 0)
      if (
        list?.filter((ele) => {
          let x = searchFilter.toLocaleLowerCase();
          let y = ele?.displayName.toLocaleLowerCase().includes(x);
          let z = ele?.email.toLocaleLowerCase().includes(x);
          return y || z;
        }).length === 0
      ) {
        if (!msg) setMsg("No data matched");
      } else setMsg("");
  }, [searchFilter]);

  useEffect(() => {
    let loop;
    if (updateStatus) {
      loop = setTimeout(() => {
        setStatus(null);
      }, 3000);
    }
    return () => clearTimeout(loop);
  }, [updateStatus]);

  if (!data) return <div>loading...</div>;
  if (p)
    return (
      <div className="p-5">
        <h2 className="text-xl font-bold underline p-5">
          Users On page: {size}
        </h2>
        <input
          className=" w-full rounded-md p-2 font-thin bg-slate-100 text-slate-900 ring-2 ring-slate-800 mb-5 outline-none border-none"
          type="text"
          placeholder="search by Name or Email"
          value={searchFilter}
          onChange={(e) => setFilter(e.target.value)}
        />

        <p className="text-rose-600">{msg}</p>

        <div className=" my-2 max-h-[50vh] overflow-y-auto shadow-md rounded-md">
          <div
            className={`${
              updateStatus?.success
                ? "text-green-500 bg-green-100 border-b-green-500"
                : "text-orange-500 bg-orange-100 border-b-orange-500"
            } border-b-4 p-2 capitalize aria-hidden:hidden my-3`}
            aria-hidden={!updateStatus}
          >
            {updateStatus?.message} <br />
            User ID: {updateStatus?._id}
          </div>
          <table className="table">
            <thead>
              <tr className="bg-slate-800 table-pin-rows">
                {/* <td>UID</td> */}
                <td>Full Name</td>
                <td>Email</td>
                <td>Phone</td>
                <td>Role</td>
                <td>Permission</td>
                <td>Verified Email</td>
              </tr>
            </thead>
            <tbody>
              {list
                ?.filter((ele) => {
                  let x = searchFilter.toLocaleLowerCase();
                  let y = ele?.displayName.toLocaleLowerCase().includes(x);
                  let z = ele?.email.toLocaleLowerCase().includes(x);
                  return y || z;
                })
                ?.sort((a, b) => (a?.role > b?.role ? 1 : -1))
                ?.map((usr, id) => {
                  let uid = usr?.uid;
                  return (
                    <tr
                      key={usr?._id}
                      className={`${id % 2 !== 0 && "bg-slate-300"}`}
                    >
                      {/* <td title={uid}>{uid.substring(0, 7)}...</td> */}
                      <td>{usr?.displayName}</td>
                      <td>{usr?.email}</td>
                      <td>{usr?.phone}</td>
                      <td>{usr?.role == "teacher" ? "Teacher" : "Admin"}</td>
                      <td>
                        {data?.uid !== usr?.uid && (
                          <Switch
                            id={usr?._id}
                            yes={usr?.permission || false}
                            update={() =>
                              handleUpdate(usr?._id, !usr?.permission)
                            }
                            status={updateStatus}
                          />
                        )}
                      </td>
                      <td className={` ${usr?.isVerified ? "text-green-500" : 'text-red-500'}`}>{usr?.isVerified ? "Yes": 'No'}</td>

                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div className="flex space-x-2 justify-center my-10 items-center">
          <button
            className="bg-slate-200 px-3 py-2"
            onClick={() => {
              if (page > 1) setPage((pre) => pre - 1);
            }}
          >
            ⬅️
          </button>
          <p>Page: {page}</p>
          <button
            className="bg-slate-200 px-3 py-2"
            onClick={() => {
              if (list?.length == 10) setPage((pre) => pre + 1);
            }}
          >
            ➡️
          </button>
        </div>
      </div>
    );
}
const Switch = ({ id, yes, update, status }) => {
  const [perm, setPerm] = useState(yes);
  useEffect(() => {
    if (status?.success && id == status?._id) {
      setPerm(!perm);
      window.location.reload();
    }
  }, [status]);
  return (
    <div
      className="relative rounded-full p-1 bg-gray-900 w-10 h-5 ml-5 group hover:bg-slate-600"
      onClick={() => update()}
    >
      <div
        className={`absolute rounded-full w-3 h-3 ${
          yes ? "bg-green-400 right-1" : "bg-red-500 left-1"
        } group-hover:brightness-150 top-1/2 -translate-y-1/2 `}
      ></div>
    </div>
  );
};
export default AllTeachers;
