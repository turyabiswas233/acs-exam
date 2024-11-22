import React, { useEffect, useState } from "react";
import { fetchAdminStudents } from "../../hooks/adminHook";

function AllStudents() {
  const [page, setPage] = useState(1);
  const token = localStorage.getItem("authToken");
  const [searchFilter, setFilter] = useState("");
  const [msg, setMsg] = useState("");

  const { list, size, error } = fetchAdminStudents(10, page, token);

  useEffect(() => {
    if (list.length > 0)
      if (
        list?.filter((ele) => {
          let x = searchFilter?.toLocaleLowerCase();
          let y = ele?.displayName?.toLocaleLowerCase()?.includes(x);
          // let z = ele?.email?.toLocaleLowerCase().includes(x);
          let ph = ele?.phone?.includes(x);

          return y || ph;
        }).length === 0
      ) {
        if (!msg) setMsg("No data matched");
      } else setMsg("");
  }, [searchFilter]);

  if (error) return <p>{error}</p>;

  return (
    <div className="py-5">
      <h2 className="text-xl font-bold underline p-5">Student Users List</h2>
      <p>Students On page: {size}</p>

      <input
        className=" w-full rounded-md p-2 bg-slate-100 text-slate-900 ring-2 ring-slate-800 mb-5"
        type="text"
        placeholder="search by Name or Phone"
        value={searchFilter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <p className="text-rose-600">{msg}</p>
      <div className="my-2 max-h-[50vh] overflow-y-auto shadow-md rounded-md">
        <table className="table">
          <thead>
            <tr className="bg-slate-900 text-swhite">
              {/* <td>UID</td> */}
              <td>Full Name</td>
              <td>Email</td>
              <td>Phone</td>
              <td>Joined On</td>
            </tr>
          </thead>
          <tbody>
            {list
              ?.filter((ele) => {
                let x = searchFilter?.toLocaleLowerCase();
                let y = ele?.displayName?.toLocaleLowerCase()?.includes(x);
                let ph = ele?.phone?.includes(x);
                return y || ph;
              })
              .map((user, id) => {
                return (
                  <tr
                    key={user?._id}
                    className={`${id % 2 !== 0 && "bg-slate-300"} font-normal`}
                  >
                    {/* <td title={uid}>{uid.substring(0, 7)}...</td> */}
                    <td>{user?.displayName}</td>
                    <td>{user?.email}</td>
                    <td>{user?.phone}</td>
                    <td>
                      <pre>{dateCast(user?.createdAt)}</pre>
                    </td>
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
function dateCast(date) {
  const DATE = new Date(date);
  return DATE?.toLocaleDateString() + "\n" + DATE.toLocaleTimeString();
}

export default AllStudents;
