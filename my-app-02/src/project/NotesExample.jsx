import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./NotesExample.css";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Country, State, City } from "country-state-city";

export default function NotesExample() {
  const location = useLocation();
  const editingEntry = location.state?.editingEntry || null;
  const mode = location.state?.mode || "create";

  useEffect(() => {
    document.title = mode === "edit" ? "Edit User" : "New Submission";
    // console.log(mode, editingEntry);
  }, [mode]);

  const initializeStatesAndCities = (addresses) => {
    const statesArray = [];
    const citiesArray = [];

    addresses.forEach((addr) => {
      if (addr.countryCode) {
        const states = State.getStatesOfCountry(addr.countryCode);
        statesArray.push(states);
      } else {
        statesArray.push([]);
      }

      if (addr.stateCode) {
        const cities = City.getCitiesOfState(addr.countryCode, addr.stateCode);
        citiesArray.push(cities);
      } else {
        citiesArray.push([]);
      }
    });

    setAllStates(statesArray);
    setAllCities(citiesArray);
  };

  // If editing, fill the form with existing data
  useEffect(() => {
    if (editingEntry) {
      const addrs =
        editingEntry?.Addresses?.map((addr) => ({
          address: addr.address || "",
          country: addr.countryName || "", // 👈 use your DB fields
          countryCode: addr.countryCode || "",
          state: addr.stateName || "",
          stateCode: addr.stateCode || "",
          city: addr.cityName || "",
          cityCode: addr.cityCode || "",
          pincode: addr.pincode || "",
        })) || [];

      setAddresses(addrs);
      setImageFile(null);
      setName(editingEntry.name);
      setEmail(editingEntry.email);
      setAge(editingEntry.age);
      setPassword(editingEntry.password);
      setPhone(editingEntry.phone);
      initializeStatesAndCities(addrs);
    }
  }, [editingEntry]);

  const [name, setName] = useState("");
  const [errorName, setErrorName] = useState("");
  const [email, setEmail] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [age, setAge] = useState("");
  const [errorAge, setErrorAge] = useState("");
  const [password, setPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [errorPhone, setErrorPhone] = useState("");
  const [infoList, setInfoList] = useState([]);
  const [addresses, setAddresses] = useState([
    {
      address: "",
      country: "",
      countryCode: "",
      state: "",
      stateCode: "",
      city: "",
      pincode: "",
    },
  ]);
  const [pincodeErrors, setPincodeErrors] = useState(
    Array.isArray(addresses) && addresses.map(() => "")
  );
  // const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous error messages
    setErrorName("");
    setErrorEmail("");
    setErrorAge("");
    setErrorPassword("");
    setErrorPhone("");
    // setErrorPincode2("");

    // Validate  placeholder=" " fields
    if (!name || !email || !age || !password || !phone) {
      toast.error("Please fill out all required fields!");
      return;
    }

    // Validate name length
    if (name.length > 25) {
      setErrorName("Name must be within 25 characters.");
      return;
    }

    // Validate email format
    if (!email.includes("@gmail.com")) {
      setErrorEmail("Please enter a valid Gmail address.");
      return;
    }

    // Validate age
    const numericAge = parseInt(age);
    if (isNaN(numericAge) || numericAge < 18 || numericAge > 100) {
      setErrorAge("Age must be a number between 18 and 100.");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setErrorPassword("Password must be at least 6 characters long.");
      return;
    }

    // Validate phone (optional)
    if (phone && !/^\d{10}$/.test(phone)) {
      setErrorPhone("Phone number must be exactly 10 digits.");
      return;
    }
    // // ...existing validation...
    const validatePincodes = () => {
      const errors = addresses.map(({ pincode }) => {
        if (!/^\d{6}$/.test(pincode)) {
          return "Pincode must be exactly 6 digits";
        }
        return "";
      });

      setPincodeErrors(errors);

      // Return true if no pincode errors
      return errors.every((err) => err === "");
    };

    for (let i = 0; i < addresses.length; i++) {
      const { address, country, state, city, pincode } = addresses[i];

      if (!address || !pincode || !country || !state || !city) {
        toast.error(`Please fill all fields in Address ${i + 1}`);
        return;
      }

      // Validate pincodes separately
      if (!validatePincodes()) {
        return; // stop submit if pincode errors exist
      }
    }

    let uploadedImageUrl = null;

    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);

      try {
        const res = await fetch("http://localhost:3001/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok || !data?.success) {
          toast.error(data?.error || "Image upload failed!");
          return;
        }

        uploadedImageUrl = data.imageUrl;
      } catch (err) {
        toast.error("Network error during image upload");
        return;
      }
    }

    // Prepare data
    const userData = {
      name,
      email,
      age: numericAge,
      password,
      phone,
      imageUrl: uploadedImageUrl,
      addresses: addresses.map((addr) => ({
        address: addr.address,
        country: { name: addr.country, isoCode: addr.countryCode },
        state: { name: addr.state, isoCode: addr.stateCode },
        city: { name: addr.city, isoCode: addr.cityCode },
        pincode: addr.pincode,
      })),
    };

    // Check if editing an existing entry
    if (editingEntry) {
      // UPDATE user
      fetch(`http://localhost:3001/api/update/${editingEntry.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(userData),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message === "User updated successfully") {
            toast.success("User updated successfully!");
            navigate("/info");
          } else {
            toast.error("Failed to update user.");
          }
        })
        .catch(() => toast.error("Server error during update."));
    } else {
      // CREATE new user
      fetch("http://localhost:3001/api/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message === "User saved successfully") {
            setInfoList([...infoList, userData]);
            toast.success("User saved successfully!");
            navigate("/info");
          } else {
            toast.error("Failed to save user.");
          }
        })
        .catch(() => toast.error("Server error during save."));
    }

    // Reset form
    setName("");
    setEmail("");
    setAge("");
    setPassword("");
    setPhone("");
    setAddresses([
      {
        address: "",
        country: "",
        countryCode: "",
        state: "",
        stateCode: "",
        city: "",
        cityCode: "",
        pincode: "",
      },
    ]);
  };
  const [showPassword, setShowPassword] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const [allStates, setAllStates] = useState([]);
  const [allCities, setAllCities] = useState([]);

  useEffect(() => {
    setCountryList(Country.getAllCountries());
  }, []);

  const handleAddAddress = () => {
    if (addresses.length >= 10) return;

    setAddresses([
      ...addresses,
      {
        address: "",
        country: "",
        countryCode: "",
        state: "",
        stateCode: "",
        city: "",
        cityCode: "",
        pincode: "",
      },
    ]);

    // Initialize empty states and cities for new address index
    setAllStates((prev) => [...prev, []]);
    setAllCities((prev) => [...prev, []]);
  };

  const handleAddressChange = (index, field, value) => {
    const updated = [...addresses];
    updated[index][field] = value;

    if (field === "country") {
      const selectedCountry = Country.getAllCountries().find(
        (c) => c.name === value
      );

      if (selectedCountry) {
        updated[index].country = selectedCountry.name;
        updated[index].countryCode = selectedCountry.isoCode;
        updated[index].state = "";
        updated[index].stateCode = "";
        updated[index].city = "";

        const states = State.getStatesOfCountry(selectedCountry.isoCode);
        const newAllStates = [...allStates];
        newAllStates[index] = states;
        setAllStates(newAllStates);

        const newAllCities = [...allCities];
        newAllCities[index] = [];
        setAllCities(newAllCities);
      }
    }

    if (field === "state") {
      const selectedState = (allStates[index] || []).find(
        (s) => s.name === value
      );

      if (selectedState) {
        updated[index].state = selectedState.name;
        updated[index].stateCode = selectedState.isoCode;
        updated[index].city = "";

        const cities = City.getCitiesOfState(
          updated[index].countryCode,
          selectedState.isoCode
        );
        const newAllCities = [...allCities];
        newAllCities[index] = cities;
        setAllCities(newAllCities);
      }
    }

    if (field === "city") {
      const selectedCity = (allCities[index] || []).find(
        (c) => c.name === value
      );

      if (selectedCity) {
        updated[index].city = selectedCity.name;
        updated[index].cityCode = selectedCity.stateCode || ""; // some cities have stateCode
      }
    }

    setAddresses(updated);
  };

  const handleRemoveAddress = (index) => {
    const updated = [...addresses];
    updated.splice(index, 1);
    setAddresses(updated);
  };
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState(""); // 👈 error state

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 1024 * 1024) {
      // 1MB = 1024 * 1024
      setImageError("File size must be less than 1MB");
      setImageFile(null);
    } else {
      setImageError("");
      setImageFile(file);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        {/* <div className="col-md-4 col-lg-3 progress-tracker">
          <ul className="steps">
            <li className={imageFile ? "completed" : ""}>📸 Upload Image</li>
            <li
              className={
                name && email && age && password && phone ? "completed" : ""
              }
            >
              📝 User Details
            </li>
            <li
              className={
                addresses.some(
                  (addr) => addr.address && addr.city && addr.pincode
                )
                  ? "completed"
                  : ""
              }
            >
              📍 Address
            </li>
          </ul>
        </div> */}
        <div className="col-20 col-lg-20">
          <h3 className="mb-3 form-logo">Enter your details here!</h3>
          <form
            className="form"
            onSubmit={(e) => {
              e.stopPropagation();
              handleSubmit(e);
            }}
          >
            {/* <div className="form-group-google"> */}
            <div className="upload-wrapper">
              <label htmlFor="file-upload" className="upload-label">
                {imageFile ? (
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="Profile Preview"
                    className="upload-preview"
                  />
                ) : (
                  // <span className="upload-placeholder">
                  //   Your Picture uploaded!
                  // </span>
                  //  <span className="upload-selected">📂 {imageFile.name}</span>

                  <span className="upload-placeholder">
                    +<br />
                    Upload Profile Picture
                  </span>
                )}
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                className="upload-input"
                onChange={handleFileChange}
              />
              {imageError && <p className="text-danger">{imageError}</p>}

              {imageFile && (
                <button
                  type="button"
                  className=" btn-image-remove "
                  onClick={() => setImageFile(null)}
                >
                  Remove
                </button>
              )}
            </div>

            {/* </div> */}
            {/* {imageError && <p className="text-danger">{imageError}</p>} */}
            <div className="form-group-google">
              <input
                type="text"
                className="form-control unselect-input"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value.trimStart())}
                placeholder=" "
              />
              <label className="form-label">Enter Your Name</label>
            </div>
            {errorName && <p className="text-danger">{errorName}</p>}
            <div className="form-group-google">
              <input
                type="text"
                className="form-control unselect-input"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.trimStart())}
                placeholder=" "
              />
              <label className="form-label">Enter Your Email</label>
            </div>
            {errorEmail && <p className="text-danger">{errorEmail}</p>}
            <div className="form-group-google">
              <input
                type="number"
                className="form-control unselect-input"
                id="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder=" "
              />
              <label className="form-label">Enter Your Age</label>
            </div>
            {errorAge && <p className="text-danger">{errorAge}</p>}
            <div className="form-group-google">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control unselect-input"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
              />
              <label className="form-label">Enter Your Password</label>
            </div>
            {errorPassword && <p className="text-danger">{errorPassword}</p>}
            {/* Checkbox for show/hide password */}
            <div className="show-password-checkbox">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <label htmlFor="showPassword"> Show Password</label>
            </div>
            <div className="form-group-google">
              <input
                type="tel"
                className="form-control unselect-input"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value?.trimStart())}
                placeholder=" "
              />
              <label className="form-label">Enter your Mobile</label>
            </div>
            {errorPhone && <p className="text-danger">{errorPhone}</p>}
            <br />
            {addresses.map((addr, index) => (
              <div key={index} className="mb-4">
                <h5>Address {index + 1}</h5>

                <div className="form-group-google">
                  <input
                    type="text"
                    className="form-control unselect-input"
                    id="address"
                    value={addr.address}
                    onChange={(e) =>
                      handleAddressChange(index, "address", e.target.value)
                    }
                    placeholder=" "
                  />
                  <label className="form-label">Address Line</label>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group-google">
                      <select
                        className="form-control select-input"
                        value={addr.country}
                        onChange={(e) =>
                          handleAddressChange(index, "country", e.target.value)
                        }
                      >
                        <option value="" disabled hidden>
                          Select Country
                        </option>
                        {countryList.map((country) => (
                          <option key={country.isoCode} value={country.name}>
                            {country.name}
                          </option>
                        ))}
                      </select>

                      <label className="form-label">Country</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group-google">
                      <select
                        className="form-control select-input"
                        value={addr.state}
                        onChange={(e) =>
                          handleAddressChange(index, "state", e.target.value)
                        }
                        disabled={!addr.country}
                      >
                        <option value="" disabled hidden>
                          Select State
                        </option>
                        {(allStates[index] || []).map((state) => (
                          <option key={state.isoCode} value={state.name}>
                            {state.name}
                          </option>
                        ))}
                      </select>

                      <label className="form-label">State</label>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group-google">
                      <select
                        className="form-control select-input"
                        value={addr.city}
                        onChange={(e) =>
                          handleAddressChange(index, "city", e.target.value)
                        }
                        disabled={!addr.state}
                      >
                        <option value="" disabled hidden>
                          Select City
                        </option>
                        {(allCities[index] || []).map((city) => (
                          <option key={city.name} value={city.name}>
                            {city.name}
                          </option>
                        ))}
                      </select>

                      <label className="form-label">City</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group-google">
                      <input
                        type="text"
                        className="form-control unselect-input"
                        value={addr.pincode}
                        onChange={(e) =>
                          handleAddressChange(index, "pincode", e.target.value)
                        }
                        placeholder=" "
                      />
                      <label className="form-label">Pincode</label>
                    </div>
                    {pincodeErrors[index] && (
                      <p className="text-danger">{pincodeErrors[index]}</p>
                    )}
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  {addresses.length > 1 && (
                    <button
                      type="button"
                      className="btn  btn-sm"
                      onClick={() => handleRemoveAddress(index)}
                    >
                      🗑️
                    </button>
                  )}
                  {/* Show Add only on the last address block */}
                  {index === addresses.length - 1 && addresses.length < 10 && (
                    <button
                      type="button"
                      className="btn  btn-sm fixed-plus-btn"
                      onClick={handleAddAddress}
                    >
                      ➕
                    </button>
                  )}
                </div>
              </div>
            ))}
            <br />
            <div className="d-flex justify-content-center gap-2 mt-4">
              <button type="submit" className="btn btn-primary">
                {mode === "edit" ? "Update" : "Submit"}
              </button>
              {mode === "edit" && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => navigate("/info")}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* <button className="btn btn-link mt-3" onClick={() => navigate("/info")}>
                        View Submitted Information
                    </button> */}
        </div>
      </div>
    </div>
  );
}
