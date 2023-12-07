import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useEffect, useState } from "react";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const UpdateListings = () => {
  const [files, setFiles] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const params = useParams(); //  it will give id of the list (/listId)
  // console.log(listId);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  const [ImageUploadError, setImageUplaodError] = useState(false);
  const [imageUplading, setImageUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // console.log(formData)
  useEffect(() => {
    const fechListing = async () => {
      const listId = params.listId;
      const res = await fetch(`/api/listing/getListing/${listId}`);
      const data = await res.json();
      if (data.success == false) {
        return;
      }
      setFormData(data);
    };
    fechListing();
  }, []);
  const hadleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setImageUploading(true);
      setImageUplaodError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(ImageStorage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUplaodError(false);
          setImageUploading(false);
        })
        .catch((error) => {
          setImageUplaodError(
            "Image uploading failed (max 2 mb per image length"
          );
          setImageUploading(false);
        });
    } else {
      setImageUplaodError("You can upload max(6) images only");
      setImageUploading(false);
    }
  };
  const ImageStorage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };
  const DeleteImage = (ind) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== ind),
    });
  };
  const handleChange = (e) => {
    if (e.target.id === "rent" || e.target.id === "sale") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must have to choose at least one image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Regular price must be higher than discount price");
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listing/update/${params.listId}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id, //stores the user id in database
        }),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
      }
      setLoading(false);
      setError(false);
      navigate(`/listings/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update the Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg
      "
            id="name"
            maxLength="63"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg
      "
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg
      "
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex gap-5 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type == "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type == "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex item-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex item-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="1000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Bath</p>
            </div>
            <div className="flex item-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="1000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col text-center">
                <p>Regullar Price</p>
                <span className="text-xs">$ /months</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex item-center gap-2">
                <input
                  type="number"
                  id="discoutnPrice"
                  min="0"
                  max="1000"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col text-center">
                  <p>Discount Price</p>
                  <span className="text-xs">$ /months</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first imsge will be cover max(6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              disabled={imageUplading}
              onClick={hadleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {imageUplading ? "uploading.." : "Uplaod"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {ImageUploadError && ImageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, i) => (
              <div className="flex justify-between p-3 border item-center">
                <img
                  key={url}
                  src={url}
                  alt="listing"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button "
                  onClick={(e) => DeleteImage(i)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-70"
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || imageUplading}
            className="p-3 bg-slate-700  text-white  rounded-lg uppercase hover:opacity-90 disabled:opacity-80"
          >
            {loading ? "updating..." : "Update listing"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
};

export default UpdateListings;
