import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";
import { validate } from "./validation"
interface User {
  name?: string | null;
  email?: string | null;
  birthDate?: string | null;
  address?: string | null;
  phone?: string | null;
  countryCode?: string | null;
}

interface UserProfileFormProps {
  user: User | undefined;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({
  user,
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+216");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const storedUserProfile = localStorage.getItem("userProfile");
    if (storedUserProfile) {
      const parsedProfile = JSON.parse(storedUserProfile);
      setFirstName(parsedProfile.firstName || "");
      setLastName(parsedProfile.lastName || "");
      setEmail(parsedProfile.email || "");
      setBirthDate(parsedProfile.birthDate || "");
      setAddress(parsedProfile.address || "");
      setPhone(parsedProfile.phone || "");
      setCountryCode(parsedProfile.countryCode || "+216");
    } else if (user) {
      const nameParts = user.name?.split(" ") || ["", ""];
      setFirstName(nameParts[0]);
      setLastName(nameParts.slice(1).join(" "));
      setEmail(user.email || "");
      setBirthDate("");
      setAddress("");
      setPhone("");
    }
  }, [user]);



const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const newErrors = await validate(address); // Call validate for address

  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) {
    return; // Stop if there are validation errors
  }

  const userInfo = {
    firstName,
    lastName,
    email,
    birthDate,
    address,
    phone: phone.trim(),
    countryCode,
  };

  localStorage.setItem("userProfile", JSON.stringify(userInfo));

  console.log("Profile Saved to localStorage:", userInfo);

  window.location.reload(); // Refreshes the page after saving the data
};


return (
  <form onSubmit={handleSubmit} className="space-y-4">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label className="text-sm font-medium">First Name</label>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full mt-1 border rounded-lg p-2"
        />
        {errors.firstName && (
          <p className="text-red-600 text-sm">{errors.firstName}</p>
        )}
      </div>
      <div>
        <label className="text-sm font-medium">Last Name</label>
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full mt-1 border rounded-lg p-2"
        />
        {errors.lastName && (
          <p className="text-red-600 text-sm">{errors.lastName}</p>
        )}
      </div>
    </div>

    <div>
      <label className="text-sm font-medium">Email</label>
      <input
        type="email"
        value={email}
        readOnly
        className="w-full mt-1 border rounded-lg p-2 bg-gray-100"
      />
    </div>

    <div>
      <label className="text-sm font-medium">Date of Birth</label>
      <input
        type="date"
        value={birthDate}
        onChange={(e) => setBirthDate(e.target.value)}
        className="w-full mt-1 border rounded-lg p-2"
      />
      {errors.birthDate && (
        <p className="text-red-600 text-sm">{errors.birthDate}</p>
      )}
    </div>

    <div>
      <label className="text-sm font-medium">Address</label>
      <input
        type="text"
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full mt-1 border rounded-lg p-2"
      />
      {errors.address && (
        <p className="text-red-600 text-sm">{errors.address}</p>
      )}
    </div>

    <div>
      <label className="text-sm font-medium">Phone Number</label>
      <input
        type="tel"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full mt-1 border rounded-lg p-2"
      />
      {errors.phone && (
        <p className="text-red-600 text-sm">{errors.phone}</p>
      )}
    </div>

    <button
      type="submit"
      className="w-full bg-blue-500 text-white py-2 rounded-lg mt-4"
    >
      Save Profile
    </button>
  </form>
);

};

const UserProfile = () => {
  const { data: session } = useSession();

  return (
    <div className="mt-6 max-w-5xl mx-auto p-6 border border-gray-300 rounded-lg shadow-sm">
      {session ? (
        <>
        

          <UserProfileForm user={session.user} />
        </>
      ) : (
        <p className="text-red-500">
          You need to be logged in to modify your information.
        </p>
      )}
    </div>
  );
};

export default UserProfile;
