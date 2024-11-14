import React, { useEffect } from "react";
import { updateAdminUser } from "../../hooks/adminHook";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
function Verified() {
  const { userId } = useParams();
  const { user } = useAuth();
  useEffect(() => {
    updateAdminUser(userId, user?.emailVerified).then((res) => {
        console.log(res);
        if(res?.success) {
            window.location.href = "/swift-admin/account";
        }
    });
  }, [userId]);
  return <div>{userId}</div>;
}

export default Verified;
