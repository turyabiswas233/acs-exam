import imageCompression from "browser-image-compression";
const DB_URL = import.meta.env.APP_URL;

//hooks
const uploadReport = (data) => {
  return fetch(`${DB_URL}report/upload`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};
const getReportByUser = (userid) => {
  return fetch(`${DB_URL}report/get/?id=${userid}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
const getReportList = (filterByCategory) => {
  return fetch(`${DB_URL}report/getall?filterBy=${filterByCategory}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${localStorage.getItem("authToken")}`,
    },
  });
};
/**
 *
 * @param {eventFile} event
 * @param {setNewImage} setImage
 * @param {progressSetter} setProgress
 */
async function handleImageUpload(event) {
  const imageFile = event;

  const options = {
    maxSizeMB: 0.1,
    maxWidthOrHeight: 800,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(imageFile, options);

    if (compressedFile) {
      const blob = new Blob([compressedFile]);
      const file = new File([blob], imageFile?.name, {
        lastModified: new Date().getTime(),
        type: "image/jpeg",
      });
      return file;
    } else {
      throw new Error("Failed to compress");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Failed to compress");
  }
}
/**
 *
 * @param {Image URL} url
 * @returns
 */
const fetchAndStoreImage = async (url) => {
  const hash = await sha256(url);
  const storedImage = localStorage.getItem(hash);

  if (storedImage) {
    console.log("from cache");

    return storedImage;
  } else {
    console.log("from server");

    const response = await fetch(url);
    const blob = await response.blob();
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      //on success
      reader.onload = () => {
        const base64Data = reader.result;
        try {
          localStorage.setItem(hash, base64Data);
          resolve(base64Data);
        } catch (error) {
          return url;
        }
      };
      //
      reader.onerror = (err) => {
        console.log(err);
        reject(err);
      };
      reader.readAsDataURL(blob);
    });
  }
};

const sha256 = async (message) => {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};
export {
  uploadReport,
  getReportByUser,
  getReportList,
  handleImageUpload,
  sha256,
  fetchAndStoreImage,
};
